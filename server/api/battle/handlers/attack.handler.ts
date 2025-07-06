import { BattleInfo } from "../../../types/battle/battle-info";
import { BattlePokemon } from "../../../types/battle/battle-pokemon";
import { Move } from "../../../types/core/move";
import { getTypeEffectiveness, getEffectivenessMessage, getSTAB } from "../../../const/type-effectiveness.const";

export const attackHandler = (battleInfo: BattleInfo, playerOrEnemy: string, move: Move): BattleInfo => {
    // 必要データの確認
    if (!battleInfo || battleInfo === undefined || !battleInfo.battlePokemons || battleInfo.battlePokemons === undefined || !battleInfo.battlePokemons.PlayerBattlePokemons || !battleInfo.battlePokemons.EnemyBattlePokemons || !battleInfo.battleLogs || battleInfo.battleLogs === undefined || !move || move === undefined) {
        console.error("handleAttack: Required battle data or move data is missing");
        throw new Error("Required battle data or move data is missing");
    }

    console.log("💥 attackHandler called:", playerOrEnemy, "using move:", move.name);

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
        throw new Error("Invalid playerOrEnemy parameter");
    }

    if (!attackPokemon || attackPokemon === undefined || !defencePokemon || defencePokemon === undefined) {
        console.error("handleAttack: Attack or defence pokemon not found");
        throw new Error("Attack or defence pokemon not found");
    }

    const damageResult = calcDamage(attackPokemon, defencePokemon, move);
    if (!damageResult) {
        console.error("handleAttack: Failed to calculate damage");
        throw new Error("Failed to calculate damage");
    }

    console.log("💥 Damage calculated:", damageResult.log);

    if (playerOrEnemy === "player") {
        battleInfo.battlePokemons.EnemyBattlePokemons[0] = damageResult.defencePokemon;
        battleInfo.battleLogs.playerPokemonLog = damageResult.log;
        console.log("💥 Updated enemy HP:", battleInfo.battlePokemons.EnemyBattlePokemons[0]?.current_hp);
    }
    if (playerOrEnemy === "enemy") {
        battleInfo.battlePokemons.PlayerBattlePokemons[0] = damageResult.defencePokemon;
        battleInfo.battleLogs.enemyPokemonLog = damageResult.log;
        console.log("💥 Updated player HP:", battleInfo.battlePokemons.PlayerBattlePokemons[0]?.current_hp);
    }

    return battleInfo;
}

const calcDamage = (attackPokemon: BattlePokemon, defencePokemon: BattlePokemon, move: Move): { defencePokemon: BattlePokemon, log: string } | null => {
    if (!attackPokemon || !defencePokemon || !move) {
        console.error("calcDamage: Required pokemon or move data is missing");
        throw new Error("Required pokemon or move data is missing");
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

    // タイプ相性の計算
    console.log(`🎯 Attack move: ${move.name} (${move.type})`);
    console.log(`🎯 Attacker: ${attackPokemon.name} (${attackPokemon.type1}${attackPokemon.type2 ? `/${attackPokemon.type2}` : ''})`);
    console.log(`🎯 Defender: ${defencePokemon.name} (${defencePokemon.type1}${defencePokemon.type2 ? `/${defencePokemon.type2}` : ''})`);
    
    const typeEffectiveness = getTypeEffectiveness(move.type, defencePokemon.type1, defencePokemon.type2);
    const stabMultiplier = getSTAB(move.type, attackPokemon.type1, attackPokemon.type2);
    
    console.log(`🎯 Type effectiveness: ${move.type} vs ${defencePokemon.type1}${defencePokemon.type2 ? `/${defencePokemon.type2}` : ''} = ${typeEffectiveness}x`);
    console.log(`🎯 STAB (Same Type Attack Bonus): ${stabMultiplier}x`);

    // ダメージ計算
    const baseDamage = Math.floor(((((2 * level / 5 + 2) * movePower * attack / defence) / 50) + 2));
    const damage = Math.floor(baseDamage * typeEffectiveness * stabMultiplier);
    
    console.log(`💥 Damage calculation:`);
    console.log(`   Base damage: ${baseDamage}`);
    console.log(`   Type effectiveness: x${typeEffectiveness}`);
    console.log(`   STAB: x${stabMultiplier}`);
    console.log(`   Final damage: ${damage}`);
    
    defencePokemon.current_hp -= damage;
    
    let log = `${attackPokemon.name}の${move.name}!${defencePokemon.name}に${damage}のダメージを与えた！`;
    
    // タイプ相性のメッセージを追加
    const effectivenessMessage = getEffectivenessMessage(typeEffectiveness);
    if (effectivenessMessage) {
        log += `\n${effectivenessMessage}`;
    }
    
    if (defencePokemon.current_hp <= 0) {
        defencePokemon.current_hp = 0;
        log += `\n${defencePokemon.name}は倒れた！`;
        console.log(`💀 ${defencePokemon.name} has fainted! HP: ${defencePokemon.current_hp}`);
    } else {
        console.log(`💥 ${defencePokemon.name} HP remaining: ${defencePokemon.current_hp}`);
    }

    return { defencePokemon, log };

}