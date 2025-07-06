# GCP Cloud Run デプロイ手順書（東京リージョン）

## 🏗️ 前提条件

1. Google Cloud SDK (`gcloud`) がインストール済み
2. Docker がインストール済み
3. Google Cloud Project が作成済み
4. 課金が有効化されている

## 🔧 事前準備

### 1. Google Cloud CLI の認証とプロジェクト設定

```bash
# Google Cloud にログイン
gcloud auth login

# 使用するプロジェクトID を設定（例: pkcv2-project）
export PROJECT_ID="your-project-id"
gcloud config set project ${PROJECT_ID}

# プロジェクトIDの確認
gcloud config get-value project
```

### 2. 必要なAPIの有効化

```bash
# Cloud Build, Artifact Registry, Cloud Run API を有効化
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com 
gcloud services enable run.googleapis.com
```

### 3. 環境変数の設定（東京リージョン）

```bash
# 東京リージョン（asia-northeast1）を設定
export REGION="asia-northeast1"
export REPOSITORY_NAME="pkcv2-server"
export SERVICE_NAME="poke-clone-server"
export IMAGE_NAME="poke-clone-server"
export IMAGE_TAG="latest"

# イメージURIの生成
export IMAGE_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY_NAME}/${IMAGE_NAME}:${IMAGE_TAG}"

echo "Project ID: ${PROJECT_ID}"
echo "Region: ${REGION}" 
echo "Image URI: ${IMAGE_URI}"
```

## 📦 Artifact Registry の設定

### 1. Docker リポジトリの作成

```bash
gcloud artifacts repositories create ${REPOSITORY_NAME} \
    --repository-format=docker \
    --location=${REGION} \
    --description="Docker repository for Pokemon Clone Server"
```

### 2. Docker認証の設定

```bash
gcloud auth configure-docker ${REGION}-docker.pkg.dev
```

## 🐳 Docker イメージのビルド・プッシュ

### 1. serverディレクトリに移動

```bash
cd /path/to/your/project/server
```

### 2. 本番用Dockerfileでビルド

```bash
# Cloud Build を使用してリモートでビルド（推奨）
gcloud builds submit --tag ${IMAGE_URI} --file Dockerfile.prod .

# または、ローカルでビルドしてプッシュ
# docker build -f Dockerfile.prod -t ${IMAGE_URI} .
# docker push ${IMAGE_URI}
```

## 🚀 Cloud Run へのデプロイ

### 1. 環境変数の設定（データベース接続情報）

```bash
# .env ファイルから値を取得して設定
export DATABASE_URL="postgresql://postgres.cgfurevypvlajsorbkiy:kvf09TNoYFUz0OqJ@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
export DIRECT_URL="postgresql://postgres.cgfurevypvlajsorbkiy:kvf09TNoYFUz0OqJ@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
export NODE_ENV="production"
export PORT="3001"
```

### 2. Cloud Run にデプロイ

```bash
gcloud run deploy ${SERVICE_NAME} \
    --image=${IMAGE_URI} \
    --platform=managed \
    --region=${REGION} \
    --port=${PORT} \
    --set-env-vars="DATABASE_URL=${DATABASE_URL}" \
    --set-env-vars="DIRECT_URL=${DIRECT_URL}" \
    --set-env-vars="NODE_ENV=${NODE_ENV}" \
    --set-env-vars="PORT=${PORT}" \
    --memory=512Mi \
    --cpu=1 \
    --min-instances=0 \
    --max-instances=10 \
    --timeout=300 \
    --concurrency=80 \
    --allow-unauthenticated
```

### 3. デプロイ確認

```bash
# サービスの詳細を確認
gcloud run services describe ${SERVICE_NAME} --region=${REGION}

# サービスのURLを取得
gcloud run services list --region=${REGION}
```

## 🔍 デプロイ後の確認

### 1. ヘルスチェック

```bash
# デプロイされたサービスのURLを取得
export SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format="value(status.url)")

# ヘルスチェックエンドポイントの確認
curl "${SERVICE_URL}/health"
```

### 2. API エンドポイントのテスト

```bash
# 基本的なAPIエンドポイントのテスト
curl "${SERVICE_URL}/api/health"
curl "${SERVICE_URL}/api/first-pokemon" -X POST -H "Content-Type: application/json"
```

## 🔄 更新手順

既存のサービスを更新する場合：

```bash
# 1. 新しいイメージをビルド
gcloud builds submit --tag ${IMAGE_URI} --file Dockerfile.prod .

# 2. Cloud Run サービスを更新
gcloud run deploy ${SERVICE_NAME} \
    --image=${IMAGE_URI} \
    --region=${REGION}
```

## 📊 監視とログ

### 1. ログの確認

```bash
# リアルタイムでログを確認
gcloud run services logs tail ${SERVICE_NAME} --region=${REGION}

# 最新のログを表示
gcloud run services logs read ${SERVICE_NAME} --region=${REGION} --limit=50
```

### 2. メトリクスの確認

Google Cloud Console で以下を確認：
- Cloud Run > サービス > poke-clone-server
- リクエスト数、レスポンス時間、エラー率など

## 🛡️ セキュリティ設定

### 1. IAM 設定（必要に応じて）

```bash
# サービスアカウントの作成
gcloud iam service-accounts create pokemon-server-sa \
    --description="Service account for Pokemon Clone Server" \
    --display-name="Pokemon Server SA"

# 権限の付与
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:pokemon-server-sa@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/cloudsql.client"
```

### 2. 認証設定（公開しない場合）

```bash
# 認証が必要なサービスとしてデプロイ
gcloud run deploy ${SERVICE_NAME} \
    --image=${IMAGE_URI} \
    --region=${REGION} \
    --no-allow-unauthenticated
```

## 💰 料金最適化

- **CPU制限**: 最小限のCPUを使用
- **メモリ制限**: 必要最小限のメモリを設定
- **オートスケーリング**: min-instances=0 でコスト削減
- **タイムアウト**: 適切なタイムアウト設定

## 🚨 トラブルシューティング

### よくある問題と解決方法

1. **ビルドエラー**: Dockerfile.prod の設定を確認
2. **起動エラー**: 環境変数の設定を確認
3. **データベース接続エラー**: DATABASE_URL の形式を確認
4. **ポートエラー**: PORT環境変数とExposeポートの一致を確認

### ログ確認コマンド

```bash
# 詳細なログを確認
gcloud run services logs read ${SERVICE_NAME} --region=${REGION} --format="table(timestamp,severity,textPayload)"
```

---

**📝 注意事項**
- 環境変数に機密情報が含まれているため、適切に管理してください
- 定期的にセキュリティアップデートを行ってください
- 本番環境では適切な監視とアラート設定を行ってください
