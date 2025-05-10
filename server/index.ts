import express from 'express';
import cors from 'cors';
import { Player } from './type/player.type';
import { getPlayer } from './api/player/getPlayer';
import { isPlayer } from './api/player/existPlayer';
import { register } from 'module';
import { registerPlayer } from './api/player/registerPlayer';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 動作確認用ルート
app.get('/', (req, res) => {
  res.json({ message: 'APIサーバーが稼働中です' });
});

app.post('/player', async (req,res) => {
  const player_id:string = req.body.player_id;
  const exist:Boolean = await isPlayer(player_id);

  if(exist){
    const player:Player = await getPlayer(player_id);
    res.status(200).json(player);
  }
  else {
    res.status(404).json(null);
  }
});

app.post('/player/register', async (req,res) =>{
  const player_id:string = req.body.player_id;
  const name:string = "トレーナー君";
  const exist:Boolean = await isPlayer(player_id);
  if(!exist){
    await registerPlayer(player_id,name);
    res.status(200).json({message:"登録完了"});
  }
  else {
    res.status(400).json({message:"登録済み"});
  }
});

app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
});