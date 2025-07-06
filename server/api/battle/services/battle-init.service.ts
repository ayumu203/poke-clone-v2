import { POKEMON_ID_BEGIN, POKEMON_ID_END } from "../../../const/pokemon_id.const";
import { BattleInfo } from "../../../types/battle/battle-info";
import { BattleLogs } from "../../../types/battle/battle-logs";
import { BattlePokemon } from "../../../types/battle/battle-pokemon";
import { BattlePokemons } from "../../../types/battle/battle-pokemons"
import { BattleResult } from "../../../types/battle/battle-result";
import { Pokemon } from "../../../types/core/pokemon";
import { TeamPokemon } from "../../../types/core/team-pokemon";
import { getPokemon } from "../../pokemon/pokemon";
import { getTeamPokemon } from "../../teamPokemon/getTeamPokemon";
import { battlePokemonService } from "./battle-pokemon.service";

export const battleInitService = async (player_id: string): Promise<BattleInfo | null> => {
    // 手持ちポケモンの生成
    const battlePokemons: BattlePokemons = {
        PlayerBattlePokemons: [],
        EnemyBattlePokemons: []
    };
    const playerBattlePokemons: (BattlePokemon | null)[] = [];
    for (let i = 0; i < 3; i++) {
        console.log("getBattleInfo called with player_id:", player_id);
        const teamPokemon: TeamPokemon | null = await getTeamPokemon(player_id, i);
        if( !teamPokemon && i === 0) return null;
        if (!teamPokemon) continue;
        const pokemon: Pokemon | null = await getPokemon(teamPokemon.pokemon_id ?? 0);
        if (!pokemon) continue;
        const battlePokemon: BattlePokemon | null = battlePokemonService(pokemon, teamPokemon);
        if (battlePokemon) {
            playerBattlePokemons.push(battlePokemon);
        }
    }
    
    console.log("playerBattlePokemons", playerBattlePokemons);

    // プレイヤーの最初のポケモンのレベルを基準に敵のレベルを決定
    const playerLevel = playerBattlePokemons[0]?.level || 5;
    const baseEnemyLevel = Math.max(5, playerLevel); // 最低レベル5

    // 敵ポケモンの生成
    const EnemyBattlePokemons: (BattlePokemon | null)[] = [];
    for (let i = 0; i < 3; i++) {
        const randomPokemonId: number = Math.random() * (POKEMON_ID_END - POKEMON_ID_BEGIN + 1) + POKEMON_ID_BEGIN;
        const pokemon: Pokemon | null = await getPokemon(Math.floor(randomPokemonId));
        if (!pokemon) continue;
        
        // 敵のレベルをプレイヤーレベル±3の範囲で設定
        const enemyLevel = Math.max(5, baseEnemyLevel + Math.floor(Math.random() * 7) - 3); // -3〜+3の範囲
        
        const teamPokemon: TeamPokemon = {
            player_id: "enemy",
            index: i,
            pokemon_id: pokemon.pokemon_id ?? 0,
            level: enemyLevel,
            exp: 0,
            move_list: pokemon.move_list ?? []
        }
        console.log(`🎯 Enemy Pokemon ${i}: ${pokemon.name} Level ${enemyLevel} (Player Level: ${playerLevel})`);
        
        const battlePokemon: BattlePokemon | null = battlePokemonService(pokemon, teamPokemon);
        if (battlePokemon) EnemyBattlePokemons.push(battlePokemon);
    }

    // ログの生成
    const battleLog: BattleLogs = {
        playerPokemonLog: "行け" + (playerBattlePokemons[0]?.name || "ポケモン") + "!",
        enemyPokemonLog: "敵の" + (EnemyBattlePokemons[0]?.name || "ポケモン") + "が現れた!",
        battleLog: ""
    };

    // 対戦結果の生成
    const battleResult: BattleResult = {
        isFinished: false,
        totalTurn: 1,
        gainExp: 0,
        gainPokemon: null
    };

    // ユーザへ返す情報の生成
    const battleInfo: BattleInfo = {
        player_id: player_id,
        battlePokemons: {
            PlayerBattlePokemons: playerBattlePokemons,
            EnemyBattlePokemons: EnemyBattlePokemons
        },
        battleResult: battleResult,
        battleLogs: battleLog
    };

    return battleInfo;
}