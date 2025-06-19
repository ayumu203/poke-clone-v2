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
import { deleteALLTeamPokemon } from './api/teamPokemon/deleteAll';
import { deleteALLPlayer } from './api/player/deleteAll';
import { getMove } from './api/move/move';
import { Move } from './type/move.type';
import { getBattleInfo } from './api/Battle/getBattleInfo';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 動作確認用エンドポイント
app.get('/', (req, res) => {
  res.json({ message: 'APIサーバーが稼働中です' });
});

// playerのデータを参照・データが存在しない場合は登録を行うAPI
app.post('/player', async (req, res) => {
  const { player_id } = req.body as { player_id: string };
  const exist: boolean = await isPlayer(player_id);

  if (!exist) {
    // プレイヤーID(SupabaseのUID),デフォルト名トレーナー君を設定
    const { player_id } = req.body as { player_id: string };
    const name: string = "トレーナー君";
    const player: Player = await registerPlayer(player_id, name);
    res.status(200).json(player);
  }
  else {
    const player: Player = await getPlayer(player_id);
    res.status(200).json(player);
  }
});

// playerのデータを登録するAPI(プレイヤー名の変更等で使用予定)
app.post('/player/register', async (req, res) => {
  const { player_id } = req.body as { player_id: string };
  const { name } = req.body as { name: string };
  const palyer: Player = await registerPlayer(player_id, name);
  res.status(200).json(palyer);
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
  const { player_id, pokemon_id } = req.body as { player_id: string, pokemon_id: number };
  const index: number = 0;
  const player_exist: boolean = await isPlayer(player_id);
  const pokemon_exist: boolean = await isTeamPokemon(player_id, 0);


  if (!player_exist) {
    res.status(200).json("failed");
    return;
  }

  if (pokemon_exist) {
    res.status(200).json("failed");
  }

  if (!pokemon_exist) {
    if (pokemon_id === 494 || pokemon_id === 495 || pokemon_id === 501) {
      await registerTeamPokemon(player_id, pokemon_id, index);
      res.status(200).json("success");
    }
  }
});

// 手持ちのポケモンをplayer_id,index(配置位置)で取得するAPI
app.post('/team-pokemon', async (req, res) => {
  const { player_id, index } = req.body as { player_id: string, index: number };
  const teamPokemon = await getTeamPokemon(player_id, index);
  res.status(200).json(teamPokemon);
});

// 手持ちポケモンの登録処理
app.post('/team-pokemon/register', async (req, res) => {
  const { player_id, pokemon_id, index } = req.body as { player_id: string, pokemon_id: number, index: number };
  const player_exist: boolean = await isPlayer(player_id);

  if (!player_exist) {
    res.status(200).json("failed");
    return;
  }

  if (pokemon_id >= 494 && pokemon_id <= 650) {
    await registerTeamPokemon(player_id, pokemon_id, index);
    res.status(200).json("failed");
  }
});

app.post('/battle/init', async(req, res) => {
  const { player_id } = req.body as { player_id: string };
  const player_exist: boolean = await isPlayer(player_id);
  // if(!player_exist) {
  //   res.status(200).json("failed");
  //   return;
  // }
  const battleInfo = await getBattleInfo(player_id);
  if(!battleInfo) {
    res.status(200).json("failed");
    return;
  }
  res.status(200).json(battleInfo);
});

// マスタデータ
app.post('/data/pokemon', async (req, res) => {
  const { pokemon_id } = req.body as { pokemon_id: number };
  const pokemon: Pokemon = await getPokemon(pokemon_id);
  res.status(200).json(pokemon);
});

app.post('/data/move', async (req, res) => {
  const { move_id } = req.body as { move_id: number };
  const move: Move = await getMove(move_id);
  res.status(200).json(move);
});

// 削除用エンドポイント
app.post('/delete', async (req, res) => {
  await deleteALLTeamPokemon();
  await deleteALLPlayer();
  res.status(200).json("削除に成功");
});

app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
});