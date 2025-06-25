import { BattleInfo } from "../../../type/battle/battleInfo.type";
import { BattlePokemon } from "../../../type/battle/battlePokemon.type";
import { Move } from "../../../type/move.type";

export const applyAilmentHandler = (battleInfo: BattleInfo, playerOrEnemy: string, move: Move): BattleInfo | null => {
    // 必要データの確認
    if (!battleInfo || !battleInfo.battlePokemons || !battleInfo.battlePokemons.PlayerBattlePokemons || !battleInfo.battlePokemons.EnemyBattlePokemons || !battleInfo.battleLogs || !move) {
        console.error("handleApplyAilment: Required battle data or move data is missing");
        return null;
    }

    // 攻撃側・防御側のポケモンを取得
    let attackPokemon: BattlePokemon | null, defencePokemon: BattlePokemon | null;
    if (playerOrEnemy === "player") {
        attackPokemon = battleInfo.battlePokemons.PlayerBattlePokemons[0] ?? null;
        defencePokemon = battleInfo.battlePokemons.EnemyBattlePokemons[0] ?? null;
    }
    else if (playerOrEnemy === "enemy") {
        attackPokemon = battleInfo.battlePokemons.EnemyBattlePokemons[0] ?? null;
        defencePokemon = battleInfo.battlePokemons.PlayerBattlePokemons[0] ?? null;
    }
    else {
        console.error("handleApplyAilment: Invalid playerOrEnemy parameter, expected 'player' or 'enemy'");
        return null;
    }

    if (!attackPokemon || !defencePokemon) {
        console.error("handleApplyAilment: Attack or defence pokemon not found");
        return null;
    }

    if(move.ailment && move.ailment !== 'none') {
        // 状態異常の適用
        defencePokemon.ailment = move.ailment;
        if (playerOrEnemy === "player") {
            battleInfo.battleLogs.playerPokemonLog += `\n${defencePokemon.name ?? 'ポケモン'}は${move.ailment}になった！\n`;
        } else if (playerOrEnemy === "enemy") {
            battleInfo.battleLogs.enemyPokemonLog += `\n${defencePokemon.name ?? 'ポケモン'}は${move.ailment}になった！\n`;
        }
    }

    return battleInfo;
}

