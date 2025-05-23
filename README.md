# poke-clone-v2

## 公開先
* URL: https://poke-clone-v2.vercel.app/signIn
* 動作がかなりゆっくり

## 作成目的
* アーキテクチャ構成の見直し(設計書の構成図を参照).
* 本番環境での動作(GCP,Vercelでの公開).

## システムのアーキテクチャ構成
### Next.js
* Vercelへデプロイしている.

### NodeJS
* Next.jsでフルスタックに開発するようにしてもいいが,いずれサーバとクライアントでWebソケットを用いた通信などを行うことも考えるとAPIサーバとWebサーバは分けておきたい.
* GCPへデプロイしている.

### PostgreSQL
* Supabaseで動作させている.
* Google認証もSupabaseを利用している.

# ローカルでの動作
## 環境変数の設定
### /client/.env.local
```
.env.local
NEXT_PUBLIC_SUPABASE_URL=PROJECT_URL # プロジェクトURL
NEXT_PUBLIC_SUPABASE_ANON_KEY=ANON_KEY   # 公開用のAPIキー
NEXT_PUBLIC_BASE_URL=http://localhost:3001

```
### /server/.env
```
DIRECT_URL="データベースのURL"
```

### /.env
```
# Direct connection to the database. Used for migrations
DIRECT_URL="データベースのURL"

# バックエンドサーバー
NODE_ENV=development
PORT=3001
```

## 実行方法
```
docker compose up --build
```

## 初期データの読み込み
```
docker exec -it poke-clone-server sh
npx ts-node api/master/pokemon/register.ts
npx ts-node api/master/move/register.ts
```
