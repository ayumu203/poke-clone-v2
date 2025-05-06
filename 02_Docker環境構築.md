# Docker環境構築
以下のような環境を構築したい

# ディレクトリ構成
.
├── README.md
├── client
├── prisma実行手順.md
├── server
└── 実装予定.md

## /(rootディレクトリで動作させるもの)
### docker-compose.yml
* 下記のデータベース・クライアント・サーバの起動を一括で行いたい
### .env
* データベース等への接続用の環境変数を記述
### データベース
* postgreSQLを使用したい
* 公開サーバはSupabaseの予定・開発ではDockerで動かしたい
* 後述のようにPrismaでNodeJSで操作したい
* Dockerfileにはデータベースの内容を記述

## /client
* Next.js(v15)をDocker環境で動作させたい.
* 公開先はVercel
* DockerfileにはNext.jsの内容を記述
* 環境変数は.env.localに記述

## /server
* Node.js(v18の軽量なやつがいい)をDocker環境で動作させたい
* Prismaでデータベースに接続する
* 公開先はRenderか何かしらのPaasを使って動かしたい
* DockerfileにはNodeJSの内容および必要ならばデータベースの接続設定を記述
