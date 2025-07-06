import { BattleInfo } from "../../../types/battle/battle-info";
import { BattlePokemon } from "../../../types/battle/battle-pokemon";
import { Move } from "../../../types/core/move";

export const statusHandler = (battleInfo: BattleInfo, playerOrEnemy: string, move: Move): BattleInfo => {
    console.log("🔧 statusHandler called:", playerOrEnemy, "using move:", move?.name, "category:", move?.category);

    // 必要データの確認
    if (!battleInfo?.battlePokemons?.PlayerBattlePokemons || !battleInfo?.battlePokemons?.EnemyBattlePokemons) {
        throw new Error("Required battle data is missing");
    }

    if (!move) {
        throw new Error("Move data is missing");
    }

    if (!battleInfo.battleLogs) {
        throw new Error("Battle logs is missing");
    }

    // 攻撃側・防御側のポケモンを取得
    let userPokemon: BattlePokemon, targetPokemon: BattlePokemon;
    if (playerOrEnemy === "player") {
        userPokemon = battleInfo.battlePokemons.PlayerBattlePokemons[0];
        targetPokemon = battleInfo.battlePokemons.EnemyBattlePokemons[0];
    } else {
        userPokemon = battleInfo.battlePokemons.EnemyBattlePokemons[0];
        targetPokemon = battleInfo.battlePokemons.PlayerBattlePokemons[0];
    }

    // nullチェック
    if (!userPokemon || !targetPokemon) {
        throw new Error("User pokemon or target pokemon is null/undefined");
    }

    let logMessage = `${userPokemon.name}の${move.name}！\n`;

    // カテゴリ別の処理
    switch (move.category) {
        case "net-good-stats":
            logMessage += handleStatModification(battleInfo, userPokemon, targetPokemon, move, playerOrEnemy);
            break;
        case "heal":
            logMessage += handleHealing(userPokemon, move);
            break;
        case "ailment":
            logMessage += handleAilment(targetPokemon, move);
            break;
        case "unique":
            logMessage += handleUniqueEffect(battleInfo, userPokemon, targetPokemon, move);
            break;
        case "field-effect":
        case "whole-field-effect":
            logMessage += handleFieldEffect(battleInfo, move);
            break;
        case "force-switch":
            logMessage += handleForceSwitch();
            break;
        default:
            logMessage += "しかし、なにも起こらなかった！";
            console.warn("Unknown status move category:", move.category);
    }

    // ログの更新
    if (playerOrEnemy === "player") {
        battleInfo.battleLogs.playerPokemonLog = logMessage;
    } else {
        battleInfo.battleLogs.enemyPokemonLog = logMessage;
    }

    console.log("🔧 Status move processed:", logMessage);
    return battleInfo;
};

function handleStatModification(
    battleInfo: BattleInfo, 
    userPokemon: NonNullable<BattlePokemon>, 
    targetPokemon: NonNullable<BattlePokemon>, 
    move: NonNullable<Move>, 
    playerOrEnemy: string
): string {
    if (!move.stat_name || !move.stat_rank || move.stat_name.length === 0) {
        return "しかし、なにも起こらなかった！";
    }

    let message = "";
    
    for (let i = 0; i < move.stat_name.length; i++) {
        const statName = move.stat_name[i];
        const statChange = move.stat_rank[i];
        
        // 対象の決定
        let targetPokemonToModify: NonNullable<BattlePokemon>;
        if (move.stat_target === "user") {
            targetPokemonToModify = userPokemon;
        } else if (move.stat_target === "selected-pokemon") {
            targetPokemonToModify = targetPokemon;
        } else if (move.stat_target === "all-opponents") {
            targetPokemonToModify = targetPokemon; // 簡略化: 現在は1対1のみ
        } else {
            targetPokemonToModify = targetPokemon;
        }

        // 能力値の変更
        const oldValue = targetPokemonToModify.status_ranks[statName] || 0;
        const newValue = Math.max(-6, Math.min(6, oldValue + statChange));
        targetPokemonToModify.status_ranks[statName] = newValue;
        
        // メッセージの生成
        const pokemonName = targetPokemonToModify === userPokemon ? userPokemon.name : targetPokemon.name;
        const statDisplayName = getStatDisplayName(statName);
        
        if (statChange > 0) {
            if (statChange === 1) {
                message += `${pokemonName}の${statDisplayName}があがった！\n`;
            } else {
                message += `${pokemonName}の${statDisplayName}がぐーんとあがった！\n`;
            }
        } else {
            if (statChange === -1) {
                message += `${pokemonName}の${statDisplayName}がさがった！\n`;
            } else {
                message += `${pokemonName}の${statDisplayName}ががくっとさがった！\n`;
            }
        }
    }
    
    return message;
}

function handleHealing(userPokemon: NonNullable<BattlePokemon>, move: NonNullable<Move>): string {
    if (!move.healing || move.healing <= 0) {
        return "しかし、なにも起こらなかった！";
    }

    const healAmount = Math.floor(userPokemon.max_hp * (move.healing / 100));
    const oldHp = userPokemon.current_hp;
    userPokemon.current_hp = Math.min(userPokemon.max_hp, userPokemon.current_hp + healAmount);
    const actualHeal = userPokemon.current_hp - oldHp;

    if (actualHeal > 0) {
        return `${userPokemon.name}のHPが${actualHeal}回復した！\n`;
    } else {
        return `${userPokemon.name}のHPは満タンだ！\n`;
    }
}

function handleAilment(targetPokemon: NonNullable<BattlePokemon>, move: NonNullable<Move>): string {
    if (!move.ailment || move.ailment === "none") {
        return "しかし、なにも起こらなかった！";
    }

    // 既に状態異常がある場合は失敗
    if (targetPokemon.status_ailment && targetPokemon.status_ailment !== "none") {
        return `しかし、${targetPokemon.name}には効果がなかった！\n`;
    }

    // 状態異常の付与
    targetPokemon.status_ailment = move.ailment;
    
    switch (move.ailment) {
        case "sleep":
            targetPokemon.status_ailment_turn = Math.floor(Math.random() * 3) + 1; // 1-3ターン
            return `${targetPokemon.name}は眠ってしまった！\n`;
        case "paralysis":
            return `${targetPokemon.name}は体がしびれて動きにくい！\n`;
        case "burn":
            return `${targetPokemon.name}はやけどを負った！\n`;
        case "freeze":
            return `${targetPokemon.name}は凍ってしまった！\n`;
        case "poison":
            return `${targetPokemon.name}は毒をあびた！\n`;
        case "confusion":
            targetPokemon.status_ailment_turn = Math.floor(Math.random() * 4) + 1; // 1-4ターン
            return `${targetPokemon.name}は混乱した！\n`;
        default:
            return `${targetPokemon.name}に${move.ailment}の効果！\n`;
    }
}

function handleUniqueEffect(
    battleInfo: BattleInfo, 
    userPokemon: NonNullable<BattlePokemon>, 
    targetPokemon: NonNullable<BattlePokemon>, 
    move: NonNullable<Move>
): string {
    switch (move.name) {
        case "かなしばり":
            // 実装簡略化: 現在はメッセージのみ
            return `${targetPokemon.name}の技を封じた！\n`;
        case "きあいだめ":
            // 急所率アップ（簡略化）
            return `${userPokemon.name}は気合をためた！\n`;
        case "ものまね":
            return `技をまねた！\n`;
        default:
            return "特殊な効果が発動した！\n";
    }
}

function handleFieldEffect(battleInfo: BattleInfo, move: NonNullable<Move>): string {
    switch (move.name) {
        case "しろいきり":
            return "白い霧が立ちこめた！\n能力がさがりにくくなった！\n";
        case "ひかりのかべ":
            return "光の壁を作った！\n特殊攻撃に強くなった！\n";
        case "リフレクター":
            return "リフレクターを張った！\n物理攻撃に強くなった！\n";
        case "くろいきり":
            return "黒い霧が戦場を包んだ！\n能力変化がリセットされた！\n";
        default:
            return "フィールド効果が発動した！\n";
    }
}

function handleForceSwitch(): string {
    // 実装簡略化: 現在はメッセージのみ
    return "相手を吹きとばした！\n";
}

function getStatDisplayName(statName: string): string {
    switch (statName) {
        case "attack": return "こうげき";
        case "defense": return "ぼうぎょ";
        case "special-attack": return "とくこう";
        case "special-defense": return "とくぼう";
        case "speed": return "すばやさ";
        case "accuracy": return "めいちゅう";
        case "evasion": return "かいひ";
        default: return statName;
    }
}
