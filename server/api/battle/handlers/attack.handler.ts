import { BattleInfo } from "../../../types/battle/battle-info";
import { BattlePokemon } from "../../../types/battle/battle-pokemon";
import { Move } from "../../../types/core/move";

export const attackHandler = (battleInfo: BattleInfo, playerOrEnemy: string, move: Move): BattleInfo => {
    // 必要データの確認
    if (!battleInfo || battleInfo === undefined || !battleInfo.battlePokemons || battleInfo.battlePokemons === undefined || !battleInfo.battlePokemons.PlayerBattlePokemons || !battleInfo.battlePokemons.EnemyBattlePokemons || !battleInfo.battleLogs || battleInfo.battleLogs === undefined || !move || move === undefined) {
        console.error("handleAttack: Required battle data or move data is missing");
        return null;
    }

    // 攻撃側・防御側のポケモンを取得
    let attackPokemon: BattlePokemon, defencePokemon: BattlePokemon;
    if (playerOrEnemy === "player") {
        attackPokemon = battleInfo.battlePokemons.PlayerBattlePokemons[0];
        defencePokemon = battleInfo.battlePokemons.EnemyBattlePokemons[0];
    }
    else if (playerOrEnemy === "enemy") {
        attackPokemon = battleInfo.battlePokemons.EnemyBattlePokemons[0];
        defencePokemon = battleInfo.battlePokemons.PlayerBattlePokemons[0];
    }
    else {
        console.error("handleAttack: Invalid playerOrEnemy parameter, expected 'player' or 'enemy'");
        return null;
    }

    if (!attackPokemon || attackPokemon === undefined || !defencePokemon || defencePokemon === undefined) {
        console.error("handleAttack: Attack or defence pokemon not found");
        return null;
    }

    const damageResult = calcDamage(attackPokemon, defencePokemon, move);
    if (!damageResult) {
        console.error("handleAttack: Failed to calculate damage");
        return null;
    }

    if (playerOrEnemy === "player") {
        battleInfo.battlePokemons.EnemyBattlePokemons[0] = damageResult.defencePokemon;
        battleInfo.battleLogs.playerPokemonLog = damageResult.log;
    }
    if (playerOrEnemy === "enemy") {
        battleInfo.battlePokemons.PlayerBattlePokemons[0] = damageResult.defencePokemon;
        battleInfo.battleLogs.enemyPokemonLog = damageResult.log;
    }

    return battleInfo;
}

const calcDamage = (attackPokemon: BattlePokemon, defencePokemon: BattlePokemon, move: Move): { defencePokemon: BattlePokemon, log: string } | null => {
    if (!attackPokemon || !defencePokemon || !move) {
        console.error("calcDamage: Required pokemon or move data is missing");
        return null;
    }
    // ダメージ計算準備
    const movePower = move.power;
    const level = attackPokemon.level;
    let attack = 0;
    let defence = 0;
    if (move.damage_class === "physical") attack = attackPokemon.attack;
    if (move.damage_class === "physical") defence = defencePokemon.defence;
    if (move.damage_class === "special") attack = attackPokemon.special_attack;
    if (move.damage_class === "special") defence = defencePokemon.special_defence;

    const correction = 1.0;

    // ダメージ計算
    const damage = Math.floor(((((2 * level / 5 + 2) * movePower * attack / defence) / 50) + 2) * correction);
    defencePokemon.current_hp -= damage;
    if (attackPokemon.current_hp < 0) {
        attackPokemon.current_hp = 0;
    }
    const log = `${attackPokemon.name}の${move.name}.${attackPokemon.name}は${defencePokemon.name}に${damage}のダメージを与えた！\n`;

    return { defencePokemon, log };

}