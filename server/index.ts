import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 動作確認用ルート
app.get('/', (req, res) => {
  res.json({ message: 'APIサーバーが稼働中です' });
});

// ユーザー一覧取得例
// app.get('/users', async (req, res) => {
//   try {
//     const users = await prisma.user.findMany();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: 'ユーザー取得に失敗しました' });
//   }
// });

app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
});