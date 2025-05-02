import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェアの設定
app.use(cors());
app.use(express.json());

// ルートエンドポイント
app.get('/', (req, res) => {
  res.json({ message: 'ポケクローンAPIサーバーが稼働中です' });
});

// サーバーの起動
app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
});