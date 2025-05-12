# poke-clone-v2
# installation
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

## 注意
* 現在はSupabaseのリダイレクト先をlocalhostにしてあるためログイン処理移行進まないようになってます.
* 一応設定変えれば動くのも確認してるよ.

## 作成目的
* アーキテクチャ構成の見直し.
* 本番環境での動作.

## システムのアーキテクチャ構成
### Next.js
* フロントエンド
* Vercelへデプロイ.

### NodeJS
* バックエンド
* Next.jsでフルスタックに開発するようにしてもいいが,いずれサーバとクライアントでWebソケットを用いた通信などを行うことも考えるとAPIサーバとWebサーバは分けておきたい.
* GCPへデプロイ.
* クレジットが切れたらAWSか別のGoogle Acount作るかの二択.

### PostgreSQL
* Supabaseで実行中.
* 開発環境ではPostgerSQLのサーバを建てていたが,ほぼSupabaseに移行.
* Google認証もSupabaseを利用している.
