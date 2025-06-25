import { BattleInfo } from "../../../types/battle/battle-info";
import { BattlePokemon } from "../../../types/battle/battle-pokemon";

export const ailmentHandler = (battleInfo: BattleInfo, playerOrEnemy: string): { battleInfo: BattleInfo, actionFlag: boolean } | null => {
    // 必要データの確認
    if (!battleInfo || battleInfo === undefined || !battleInfo.battlePokemons || battleInfo.battlePokemons === undefined || !battleInfo.battlePokemons.PlayerBattlePokemons || !battleInfo.battlePokemons.EnemyBattlePokemons || !battleInfo.battleLogs || battleInfo.battleLogs === undefined) {
        console.error("handleAilment: Required battle data is missing or invalid");
        return null;
    }

    // 各戦闘ポケモンの取得
    let BattlePokemon: BattlePokemon = battleInfo.battlePokemons.PlayerBattlePokemons[0];
    if (playerOrEnemy === "player") {
        if (!battleInfo.battlePokemons.PlayerBattlePokemons || battleInfo.battlePokemons.PlayerBattlePokemons.length === 0) {
            console.error("handleAilment: Player battle pokemon not found");
            return null;
        }
        BattlePokemon = battleInfo.battlePokemons.PlayerBattlePokemons[0];
    }
    else if (playerOrEnemy === "enemy") {
        if (!battleInfo.battlePokemons.EnemyBattlePokemons || battleInfo.battlePokemons.EnemyBattlePokemons.length === 0) {
            console.error("handleAilment: Enemy battle pokemon not found");
            return null;
        }
        BattlePokemon = battleInfo.battlePokemons.EnemyBattlePokemons[0];
    }

    if (!BattlePokemon || BattlePokemon === undefined) {
        console.error("handleAilment: Battle pokemon is not available");
        return null;
    }

    // 行動可能フラグ
    let actionFlag = true;

    // 手持ちポケモン状態異常の処理
    if (BattlePokemon.ailment === "sleep") {
        const sleep_random_number = Math.random();
        if (sleep_random_number > 0.6) {
            BattlePokemon.ailment = "none";
            actionFlag = true;
            battleInfo.battleLogs.playerPokemonLog = `${BattlePokemon.name}は目を覚ました！\n`;
        }
        else {
            actionFlag = false;
            battleInfo.battleLogs.playerPokemonLog = `${BattlePokemon.name}は眠っている！\n`;
        }
    }
    else if (BattlePokemon.ailment === "paralysis") {
        const paralysis_random_number = Math.random();
        if (paralysis_random_number > 0.25) {
            actionFlag = true;
        }
        else {
            actionFlag = false;
            battleInfo.battleLogs.playerPokemonLog = `${BattlePokemon.name}は麻痺して動けない！\n`;
        }
    }
    else if (BattlePokemon.ailment === "freeze") {
        const freeze_random_number = Math.random();
        if (freeze_random_number > 0.6) {
            BattlePokemon.ailment = "none";
            actionFlag = true;
            battleInfo.battleLogs.playerPokemonLog = `${BattlePokemon.name}の凍えが解けた！\n`;
        }
        else {
            actionFlag = false;
            battleInfo.battleLogs.playerPokemonLog = `${BattlePokemon.name}は凍えている！\n`;
        }
    }
    else if (BattlePokemon.ailment === "poison") {
        BattlePokemon.current_hp -= BattlePokemon.max_hp * 0.25;
        if (BattlePokemon.current_hp <= 0) {
            BattlePokemon.current_hp = 0;
            BattlePokemon.ailment = "none";
            battleInfo.battleLogs.playerPokemonLog = `${BattlePokemon.name}は毒で倒れた！\n`;
            actionFlag = false;
        }
        else {
            battleInfo.battleLogs.playerPokemonLog = `${BattlePokemon.name}は毒でダメージを受けた！\n`;
        }
    }
    else if (BattlePokemon.ailment === "burn") {
        BattlePokemon.current_hp -= BattlePokemon.max_hp * 0.10;
        if (BattlePokemon.current_hp <= 0) {
            BattlePokemon.current_hp = 0;
            BattlePokemon.ailment = "none";
            battleInfo.battleLogs.playerPokemonLog = `${BattlePokemon.name}はやけどで倒れた！\n`;
            actionFlag = false;
        }
        else {
            battleInfo.battleLogs.playerPokemonLog = `${BattlePokemon.name}はやけどでダメージを受けた！\n`;
        }
    }
    else if (BattlePokemon.ailment === "confusion") {
        const confusion_random_number = Math.random();
        if (confusion_random_number > 0.5) {
            BattlePokemon.current_hp -= BattlePokemon.max_hp * 0.25;
            if (BattlePokemon.current_hp <= 0) {
                BattlePokemon.current_hp = 0;
                BattlePokemon.ailment = "none";
                battleInfo.battleLogs.playerPokemonLog = `${BattlePokemon.name}は混乱で倒れた！\n`;
                actionFlag = false;
            }
            else {
                battleInfo.battleLogs.playerPokemonLog = `${BattlePokemon.name}は混乱してダメージを受けた！\n`;
            }
        }
        else {
            battleInfo.battleLogs.playerPokemonLog = `${BattlePokemon.name}は混乱して攻撃できなかった！\n`;
            actionFlag = false;
        }
    }

    // いつか実装
    else if (BattlePokemon.ailment === "disable") { }
    else if (BattlePokemon.ailment === "leech-seed") { }
    else if (BattlePokemon.ailment === "infatuation") { }
    else if (BattlePokemon.ailment === "yawn") { }

    if (playerOrEnemy === "player") {
        battleInfo.battlePokemons.PlayerBattlePokemons[0] = BattlePokemon;
    } else if (playerOrEnemy === "enemy") {
        battleInfo.battlePokemons.EnemyBattlePokemons[0] = BattlePokemon;
    }
    return { battleInfo, actionFlag };
}