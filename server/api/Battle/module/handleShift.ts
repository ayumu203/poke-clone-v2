// import { BattleInfo } from "../../../type/Battle/battleInfo.type";
// import { BattlePokemon } from "../../../type/Battle/battlePokemon.type";

// export const handleShift = (battleInfo: BattleInfo, playerOrEnemy: string): { battleInfo: BattleInfo, sucsess: boolean } | null => {
//     // 必要データの確認
//     if (!battleInfo || !battleInfo.battlePokemons || !battleInfo.battlePokemons.PlayerBattlePokemons || !battleInfo.battlePokemons.EnemyBattlePokemons || !battleInfo.battleLogs) {
//         console.error("failed");
//         return null;
//     }

//     let battlePokemon1: BattlePokemon, battlePokemon2: BattlePokemon;

//     // プレイヤーのポケモンを取得
//     if (playerOrEnemy === "player") {
//         battlePokemon1 = battleInfo.battlePokemons.PlayerBattlePokemons[1];
//         battlePokemon2 = battleInfo.battlePokemons.PlayerBattlePokemons[2];
//     }
//     // 敵のポケモンを取得
//     else if (playerOrEnemy === "enemy") {
//         battlePokemon1 = battleInfo.battlePokemons.EnemyBattlePokemons[1];
//         battlePokemon2 = battleInfo.battlePokemons.EnemyBattlePokemons[2];
//     }
//     // どちらのポケモンも存在しない場合はエラー
//     else {
//         console.error("failed");
//         return null;
//     }

//     if (!battlePokemon1 || !battlePokemon2) {
//         console.error("failed");
//         return null;
//     }

//     // 交代処理の実行
//     if (battlePokemon1.current_hp > 0) {
//         if(playerOrEnemy === "player") {
//             battleInfo.battlePokemons.PlayerBattlePokemons[2] = battleInfo.battlePokemons.PlayerBattlePokemons[0];
//             battleInfo.battlePokemons.PlayerBattlePokemons[0] = battlePokemon1;
//             battleInfo.battlePokemons.PlayerBattlePokemons[1] = battlePokemon2
//         }
//         else if (playerOrEnemy === "enemy") {
//             battleInfo.battlePokemons.EnemyBattlePokemons[2] = battleInfo.battlePokemons.EnemyBattlePokemons[0];
//             battleInfo.battlePokemons.EnemyBattlePokemons[0] = battlePokemon1;
//             battleInfo.battlePokemons.EnemyBattlePokemons[1] = battlePokemon2;
//         }   
//     }
//     else if (battlePokemon2.current_hp > 0) {
//         if(playerOrEnemy === "player") {        
//             battleInfo.battlePokemons.PlayerBattlePokemons[2] = battleInfo.battlePokemons.PlayerBattlePokemons[0];
//             battleInfo.battlePokemons.PlayerBattlePokemons[0] = battlePokemon2;
//             battleInfo.battlePokemons.PlayerBattlePokemons[1] = battlePokemon1;
//         }
//         else if (playerOrEnemy === "enemy") {
//             battleInfo.battlePokemons.EnemyBattlePokemons[2] = battleInfo.battlePokemons.EnemyBattlePokemons[0];
//             battleInfo.battlePokemons.EnemyBattlePokemons[0] = battlePokemon2;
//             battleInfo.battlePokemons.EnemyBattlePokemons[1] = battlePokemon1;
//         }
//     }
//     else {
//         return { battleInfo, sucsess: false };
//     }


//     return { battleInfo, sucsess: true };
// }

import { BattleInfo } from "../../../type/Battle/battleInfo.type";
import { BattlePokemon } from "../../../type/Battle/battlePokemon.type";

export const handleShift = (battleInfo: BattleInfo, playerOrEnemy: string): { battleInfo: BattleInfo, sucsess: boolean } | null => {
    if (!battleInfo || !battleInfo.battlePokemons || !battleInfo.battlePokemons.PlayerBattlePokemons || !battleInfo.battlePokemons.EnemyBattlePokemons || !battleInfo.battleLogs) {
        console.error("failed");
        return null;
    }

    const targetParty = playerOrEnemy === "player" 
        ? battleInfo.battlePokemons.PlayerBattlePokemons 
        : battleInfo.battlePokemons.EnemyBattlePokemons;

    const nextPokemonIndex = targetParty.findIndex((p, index) => index > 0 && p && p.current_hp > 0);

    if (nextPokemonIndex === -1) {
        return { battleInfo, sucsess: false };
    }

    const deadOrCurrentPokemon = targetParty[0];
    targetParty[0] = targetParty[nextPokemonIndex];
    targetParty[nextPokemonIndex] = deadOrCurrentPokemon;

    if (playerOrEnemy === "player") {
        battleInfo.battlePokemons.PlayerBattlePokemons = targetParty;
    } else {
        battleInfo.battlePokemons.EnemyBattlePokemons = targetParty;
    }

    return { battleInfo, sucsess: true };
}