import { POKEMON_ID_BEGIN, POKEMON_ID_END } from "../../const/pokemon_id.const";
import { BattleInfo } from "../../type/Battle/battleInfo.type";
import { BattleLogs } from "../../type/Battle/battleLogs.type";
import { BattlePokemon } from "../../type/Battle/battlePokemon.type";
import { BattlePokemons } from "../../type/Battle/battlePokemons.type"
import { BattleResult } from "../../type/Battle/battleResult.type";
import { Pokemon } from "../../type/pokemon.type";
import { TeamPokemon } from "../../type/teamPokemon.type";
import { getPokemon } from "../pokemon/pokemon";
import { getTeamPokemon } from "../teamPokemon/getTeamPokemon";
import { getBattlePokemon } from "./getBattlePokemon";

export const getBattleInfo = async (player_id: string): Promise<BattleInfo> => {

    // 手持ちポケモンの生成
    const battlePokemons: BattlePokemons = {
        PlayerBattlePokemons: [],
        EnemyBattlePokemons: []
    };
    const playerBattlePokemons: BattlePokemon[] = [];
    for (let i = 0; i < 3; i++) {
        const teamPokemon: TeamPokemon = await getTeamPokemon(player_id, i);
        if (!teamPokemon) return null;;
        const pokemon: Pokemon = await getPokemon(teamPokemon.pokemon_id);
        const battlePokemon: BattlePokemon = getBattlePokemon(pokemon, teamPokemon);
        if (playerBattlePokemons) {
            playerBattlePokemons.push(battlePokemon);
        }
    }

    // 敵ポケモンの生成
    const EnemyBattlePokemons: BattlePokemon[] = [];
    for (let i = 0; i < 3; i++) {
        const randomPokemonId: number = Math.random() * (POKEMON_ID_END - POKEMON_ID_BEGIN + 1) + POKEMON_ID_BEGIN;
        const pokemon: Pokemon = await getPokemon(Math.floor(randomPokemonId));
        if (!pokemon) continue;
        const teamPokemon: TeamPokemon = {
            player_id: "enemy",
            index: i,
            pokemon_id: pokemon.pokemon_id,
            level: Math.floor(Math.random() * 10) + 5,
            exp: 0,
            move_list: pokemon.move_list.slice(0, 4)
        }
        const battlePokemon: BattlePokemon = getBattlePokemon(pokemon, teamPokemon);
        if (battlePokemon)EnemyBattlePokemons.push(battlePokemon);
    }

    // ログの生成
    const battleLog: BattleLogs = {
        PlayerPokemonLog: "行け" + playerBattlePokemons[0]!.name + "!",
        EnemyPokemonLog: "敵の" + EnemyBattlePokemons[0]!.name + "が現れた!",
        BattleLog: ""
    };

    // 対戦結果の生成
    const BattleResult: BattleResult = {
        IsFinished: false,
        TotalTurn: 1,
        GainExp: 0,
        GainPokemon: null
    };

    // ユーザへ返す情報の生成
    const battleInfo: BattleInfo = {
        battlePokemons: {
            PlayerBattlePokemons: playerBattlePokemons,
            EnemyBattlePokemons: EnemyBattlePokemons
        },
        BattleResult: BattleResult,
        battleLogs: battleLog
    };

    return battleInfo;
}