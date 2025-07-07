# poke-clone-v2

## 公開先
* URL: https://poke-clone-v2.vercel.app/
* 動作がかなりゆっくりです、ご了承を、、、
* 定期的に作業しないとSupabaseがとまってしまう(freeプラン)

## 作成目的
* # アーキテクチャ構成の見直し(設計書の構成図を参照).
* 本番環境での動作(GCP,Vercelでの公開).
* Agentによる実装のお試し

## 現状
### 実装済み
* ログイン
* 最初のポケモンの選択
* 手持ちポケモンの情報表示
* 野生ポケモンとのバトル
### 未実装
* WebSocketを用いたオンライン対戦(WebSocketを利用予定・実装時期未定)

## システムのアーキテクチャ構成
### フロントエンド：Next.js
* Vercelへ公開.

### バックエンド：NodeJS
* Next.jsでフルスタックに開発するようにしてもいいが,いずれサーバとクライアントでWebソケットを用いた通信などを行うことも考えると処理サーバとWebサーバは分けておきたい.
* Google Cloud Platform の Cloud Run へ公開.

### PostgreSQL
* Supabaseで公開.
* Google認証にも利用.


