import { BattleInfo } from "../../../type/Battle/battleInfo.type";
import { BattlePokemon } from "../../../type/Battle/battlePokemon.type";
import { Move } from "../../../type/move.type";

export const handleAttack = (battleInfo: BattleInfo, playerOrEnemy: string, move: Move): BattleInfo => {
    // 必要データの確認
    if (!battleInfo || !battleInfo.battlePokemons || !battleInfo.battlePokemons.PlayerBattlePokemons || !battleInfo.battlePokemons.EnemyBattlePokemons || !battleInfo.battleLogs || !move) {
        console.error("failed");
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
        console.error("failed");
        return null;
    }

    if (!attackPokemon || !defencePokemon) {
        console.error("failed");
        return null;
    }

    switch (move.category) {
        case "damage":
            const damageResult = handleDamage(attackPokemon, defencePokemon, move);
            if (!damageResult) {
                console.error("failed");
                return null;
            }

            if(playerOrEnemy === "player"){
                battleInfo.battlePokemons.EnemyBattlePokemons[0] = damageResult.defencePokemon;
                battleInfo.battleLogs.playerPokemonLog = damageResult.log;
            }
            if(playerOrEnemy === "enemy"){
                battleInfo.battlePokemons.PlayerBattlePokemons[0] = damageResult.defencePokemon;
                battleInfo.battleLogs.enemyPokemonLog = damageResult.log;
            }
            break;
    }

    return battleInfo;
}

const handleDamage = (attackPokemon: BattlePokemon, defencePokemon: BattlePokemon, move: Move): { defencePokemon: BattlePokemon , log: string } | null => {
    if (!attackPokemon || !defencePokemon || !move) {   
        console.error("failed");
        return null;
    }
    // ダメージ計算準備
    const movePower = move.power;
    const level = attackPokemon.level;
    const attack = attackPokemon.attack;
    const defence = defencePokemon.defence;
    const correction = 1.0;

    // ダメージ計算
    const damage = Math.floor(((((2 * level / 5 + 2) * movePower * attack / defence) / 50) + 2) * correction);
    defencePokemon.current_hp -= damage;
    if (attackPokemon.current_hp < 0) {
        attackPokemon.current_hp = 0;
    }
    const log = `${attackPokemon.name}の${move.name}.${attackPokemon.name}は${defencePokemon.name}に${damage}のダメージを与えた！`;

    return { defencePokemon, log };
}