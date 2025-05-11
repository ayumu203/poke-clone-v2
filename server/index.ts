import express from 'express';
import cors from 'cors';
import { Player } from './type/player.type';
import { getPlayer } from './api/player/getPlayer';
import { isPlayer } from './api/player/isPlayer';
import { registerPlayer } from './api/player/registerPlayer';
import { Pokemon } from './type/pokemon.type';
import { FIRST_POKEMON_ID_ARRAY } from './const/pokemon_id.const';
import { getPokemon } from './api/pokemon/pokemon';
import { isTeamPokemon } from './api/teamPokemon/isTeamPokemon';
import { registerTeamPokemon } from './api/teamPokemon/resisterFirstPokemon';
import { getTeamPokemon } from './api/teamPokemon/getTeamPokemon';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 動作確認用ルート
app.get('/', (req, res) => {
  res.json({ message: 'APIサーバーが稼働中です' });
});

// playerのデータを参照・データが存在しない場合は登録まで行うAPI
app.post('/player', async (req, res) => {
  const player_id: string = req.body.player_id;
  const exist: Boolean = await isPlayer(player_id);

  if (exist) {
    const player: Player = await getPlayer(player_id);
    res.status(200).json(player);
  }
  else {
    const player_id: string = req.body.player_id;
    const name: string = "トレーナー君";
    await registerPlayer(player_id, name);
    const player:Player = await getPlayer(player_id);
    res.status(200).json({ player:player });
  }
});

// playerのデータを登録するAPI
app.post('/player/register', async (req, res) => {
  const player_id: string = req.body.player_id;
  const name: string = req.body.name;
  const exist: Boolean = await isPlayer(player_id);
  if (!exist) {
    await registerPlayer(player_id, name);
    res.status(200).json({ message: "登録完了" });
  }
  else {
    res.status(400).json({ message: "登録に失敗" });
  }
});

// 最初のポケモンの選択肢のデータを送信するAPI
app.post('/first-pokemon', async (req, res) => {
  const first_pokemons: Pokemon[] = [];
  for (let i = 0; i < FIRST_POKEMON_ID_ARRAY.length; i++) {
    const pokemon: Pokemon = await getPokemon(FIRST_POKEMON_ID_ARRAY[i]);
    first_pokemons.push(pokemon);
  }
  res.status(200).json(first_pokemons);
});

// 最初のポケモンを登録するAPI
app.post('/first-pokemon/register', async (req, res) => {
  const player_id: string = req.body.player_id;
  const pokemon_id: number = req.body.pokemon_id;
  const index: number = 0;
  const player_exist: Boolean = await isPlayer(player_id);
  const pokemon_exist: Boolean = await isTeamPokemon(player_id, 0);

  
  if (!player_exist) {
    res.status(404).json({ message: "プレイヤーが登録されていません" });
    return;
  }
  
  // res.status(200).json({ pokemon_exist });
  if (!pokemon_exist) {
    if (pokemon_id === 494 || pokemon_id === 495 || pokemon_id === 501) {
      await registerTeamPokemon(player_id, pokemon_id, index);
      res.status(200).json({ message: "初期ポケモン登録完了" });
    }
  }
  else {
    res.status(200).json({ message: "初期ポケモン登録済み" });
  }
});

// 手持ちのポケモンをplayer_id,index(配置位置)で取得するAPI
app.post('/team-pokemon', async (req, res) => {
  const player_id: string = req.body.player_id;
  const index: number = req.body.index;
  const exist: Boolean = await isTeamPokemon(player_id, index);
  if (exist) {
    const teamPokemon = await getTeamPokemon(player_id, index);
    res.status(200).json(teamPokemon);
  }
  else {
    res.status(404).json(null);
  }
});

app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
});