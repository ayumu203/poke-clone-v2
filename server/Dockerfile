FROM node:18-alpine

WORKDIR /app

# 依存ファイルを先にコピーしてキャッシュを効かせる
COPY package*.json ./
RUN npm install

# Prismaスキーマを先にコピー
COPY prisma ./prisma/

# アプリ本体をコピー
COPY . .

EXPOSE 3001
EXPOSE 5555

# 開発用: Prisma Client生成→nodemonでTypeScriptサーバ起動
CMD ["sh", "-c", "npx prisma generate && npx nodemon --watch '*.ts' --exec 'ts-node' index.ts"]