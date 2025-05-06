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

# Prisma環境構築
* /serverでPrismaに接続
* Prismaにスキーマを作成し,prisma studioでデータの確認をしたい.
## バグ対応
* index.tsにサーバ起動のプログラム
* tsconfig.jsonにトランスパイルの設定？
* package.jsonでdevコマンドの変更
* docker-compose.ymlとDockerfileでのポート開放忘れない








# GPTによるまとめ

# 開発環境構築手順まとめ

## ディレクトリ構成

```
.
├── README.md
├── client
│   └── Dockerfile
├── server
│   ├── Dockerfile
│   ├── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── prisma/
│       └── schema.prisma
├── .env
├── docker-compose.yml
└── その他ドキュメント
```

---

## 1. ルートディレクトリでの作業

### 1-1. `.env` の作成

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=poke_clone
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:postgres@db:5432/poke_clone

NODE_ENV=development
PORT=3001

NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 1-2. `docker-compose.yml` の作成

```yaml
version: '3.8'

services:
  db:
    image: postgres:14-alpine
    container_name: poke-clone-db
    ports:
      - "${POSTGRES_PORT}:5432"
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  server:
    build: ./server
    container_name: poke-clone-server
    ports:
      - "${PORT}:${PORT}"
    environment:
      - NODE_ENV=${NODE_ENV}
      - PORT=${PORT}
      - DATABASE_URL=${DATABASE_URL}
    volumes:
      - ./server:/app
      - /app/node_modules
    depends_on:
      - db
    restart: unless-stopped

  client:
    build: ./client
    container_name: poke-clone-client
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    volumes:
      - ./client:/app
      - /app/node_modules
    depends_on:
      - server
    restart: unless-stopped

volumes:
  postgres_data:
```

---

## 2. /server ディレクトリでの作業

### 2-1. 必要パッケージのインストール

```bash
npm init -y
npm install express cors @prisma/client
npm install -D typescript ts-node nodemon prisma @types/express @types/node @types/cors
```

### 2-2. `tsconfig.json` の作成

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2-3. `package.json` のスクリプト設定

```json
"scripts": {
  "dev": "npx prisma generate && nodemon --watch '*.ts' --exec 'ts-node' index.ts"
}
```

### 2-4. Prisma初期化とスキーマ作成

```bash
npx prisma init
```

- `prisma/schema.prisma` を編集し、モデルを定義

### 2-5. Prismaマイグレーション

```bash
npx prisma migrate dev --name init
```

### 2-6. `index.ts` の作成

```typescript
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'APIサーバーが稼働中です' });
});

app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'ユーザー取得に失敗しました' });
  }
});

app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
});
```

### 2-7. `Dockerfile` の作成

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
COPY . .

EXPOSE 3001

CMD ["sh", "-c", "npx prisma generate && npx nodemon --watch '*.ts' --exec 'ts-node' index.ts"]
```

### 2-8. `.dockerignore` の作成

```
node_modules
dist
.env*
npm-debug.log
```

---

## 3. /client ディレクトリでの作業

### 3-1. Next.js プロジェクト作成

```bash
npx create-next-app@latest .
```

### 3-2. 必要に応じて `Dockerfile` を作成

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

---

## 4. サービスの起動

```bash
docker compose up --build
```

---

## 5. Prisma Studioの利用（DB確認）

```bash
docker exec -it poke-clone-server sh
npx prisma studio
```

---

## 6. 注意点

- ホスト側の`node_modules`は削除し、`.dockerignore`に必ず追加
- Prisma Studioやマイグレーションは**サーバーコンテナ内で実行**
- Next.jsの環境変数は`NEXT_PUBLIC_`で始める

---

