#!/bin/bash

# =================================================================
# Pokemon Clone Server GCP デプロイスクリプト（東京リージョン）
# =================================================================

set -e  # エラー時に停止

# 色付きログ
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# =================================================================
# 設定値（必要に応じて変更してください）
# =================================================================

# プロジェクト設定
PROJECT_ID="pkcv2tokyo"  # ←あなたのプロジェクトIDに変更
REGION="asia-northeast1"    # 東京リージョン
REPOSITORY_NAME="pkcv2-server"
SERVICE_NAME="poke-clone-server"
IMAGE_NAME="poke-clone-server"
IMAGE_TAG="latest"

# データベース設定（.envファイルから取得）
DATABASE_URL="postgresql://postgres.aywognkgyngdxtjrfnfo:kvf09TNoYFUz0OqJ@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.aywognkgyngdxtjrfnfo:kvf09TNoYFUz0OqJ@aws-0-us-east-2.pooler.supabase.com:5432/postgres"
NODE_ENV="production"
PORT="3001"

# 生成された値
IMAGE_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}/${IMAGE_NAME}:${IMAGE_TAG}"

# =================================================================
# メイン処理
# =================================================================

main() {
    log_info "Pokemon Clone Server GCP デプロイを開始します..."
    
    # 1. 事前確認
    check_prerequisites
    
    # 2. プロジェクト設定
    setup_project
    
    # 3. APIの有効化
    enable_apis
    
    # 4. Artifact Registry の設定
    setup_artifact_registry
    
    # 5. Docker イメージのビルドとプッシュ
    build_and_push_image
    
    # 6. Cloud Run へのデプロイ
    deploy_to_cloud_run
    
    # 7. デプロイ確認
    verify_deployment
    
    log_success "デプロイが完了しました！"
}

check_prerequisites() {
    log_info "前提条件を確認中..."
    
    # gcloud CLI の確認
    if ! command -v gcloud &> /dev/null; then
        log_error "gcloud CLI がインストールされていません"
        exit 1
    fi
    
    # Docker の確認
    if ! command -v docker &> /dev/null; then
        log_error "Docker がインストールされていません"
        exit 1
    fi
    
    # server ディレクトリの確認
    if [ ! -d "server" ]; then
        log_error "server ディレクトリが見つかりません。プロジェクトルートで実行してください"
        exit 1
    fi
    
    # Dockerfile.prod の確認
    if [ ! -f "server/Dockerfile.prod" ]; then
        log_error "server/Dockerfile.prod が見つかりません"
        exit 1
    fi
    
    log_success "前提条件の確認が完了しました"
}

setup_project() {
    log_info "プロジェクト設定中..."
    
    # プロジェクトの設定
    gcloud config set project ${PROJECT_ID}
    
    # 現在のプロジェクトを確認
    CURRENT_PROJECT=$(gcloud config get-value project)
    log_info "現在のプロジェクト: ${CURRENT_PROJECT}"
    
    log_success "プロジェクト設定が完了しました"
}

enable_apis() {
    log_info "必要なAPIを有効化中..."
    
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable artifactregistry.googleapis.com
    gcloud services enable run.googleapis.com
    
    log_success "APIの有効化が完了しました"
}

setup_artifact_registry() {
    log_info "Artifact Registry を設定中..."
    
    # リポジトリが既に存在するかチェック
    if gcloud artifacts repositories describe ${REPOSITORY_NAME} --location=${REGION} &> /dev/null; then
        log_warning "リポジトリ ${REPOSITORY_NAME} は既に存在します"
    else
        # リポジトリの作成
        gcloud artifacts repositories create ${REPOSITORY_NAME} \
            --repository-format=docker \
            --location=${REGION} \
            --description="Docker repository for Pokemon Clone Server"
        log_success "Artifact Registry リポジトリを作成しました"
    fi
    
    # Docker認証の設定
    gcloud auth configure-docker ${REGION}-docker.pkg.dev
    
    log_success "Artifact Registry の設定が完了しました"
}

build_and_push_image() {
    log_info "Docker イメージをビルド中..."
    log_info "Image URI: ${IMAGE_URI}"
    
    # serverディレクトリに移動してビルド
    cd server
    
    # Cloud Build を使用してビルド
    if [ -f "cloudbuild.yaml" ]; then
        log_info "cloudbuild.yaml を使用してビルドします..."
        gcloud builds submit --config cloudbuild.yaml --substitutions _IMAGE_URI=${IMAGE_URI}
    else
        log_info "Dockerfile.prod を一時的にコピーしてビルドします..."
        # Dockerfile.prodを一時的にDockerfileとしてコピー
        cp Dockerfile.prod Dockerfile
        gcloud builds submit --tag ${IMAGE_URI}
        rm Dockerfile
    fi
    
    cd ..
    
    log_success "Docker イメージのビルドとプッシュが完了しました"
}

deploy_to_cloud_run() {
    log_info "Cloud Run にデプロイ中..."
    
    gcloud run deploy ${SERVICE_NAME} \
        --image=${IMAGE_URI} \
        --platform=managed \
        --region=${REGION} \
        --port=${PORT} \
        --set-env-vars="DATABASE_URL=${DATABASE_URL}" \
        --set-env-vars="DIRECT_URL=${DIRECT_URL}" \
        --set-env-vars="NODE_ENV=${NODE_ENV}" \
        --memory=512Mi \
        --cpu=1 \
        --min-instances=0 \
        --max-instances=10 \
        --timeout=300 \
        --concurrency=80 \
        --allow-unauthenticated
    
    log_success "Cloud Run へのデプロイが完了しました"
}

verify_deployment() {
    log_info "デプロイを確認中..."
    
    # サービスURLの取得
    SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format="value(status.url)")
    
    log_info "サービスURL: ${SERVICE_URL}"
    
    # ヘルスチェック（簡易版）
    log_info "ヘルスチェックを実行中..."
    if curl -f "${SERVICE_URL}/health" &> /dev/null; then
        log_success "ヘルスチェックが成功しました"
    else
        log_warning "ヘルスチェックが失敗しました。ログを確認してください"
        log_info "ログを確認するには以下のコマンドを実行してください:"
        log_info "gcloud run services logs read ${SERVICE_NAME} --region=${REGION}"
    fi
    
    log_info "==========================="
    log_info "デプロイ情報"
    log_info "==========================="
    log_info "プロジェクト: ${PROJECT_ID}"
    log_info "リージョン: ${REGION}"
    log_info "サービス名: ${SERVICE_NAME}"
    log_info "サービスURL: ${SERVICE_URL}"
    log_info "==========================="
}

# スクリプトを実行
main "$@"
