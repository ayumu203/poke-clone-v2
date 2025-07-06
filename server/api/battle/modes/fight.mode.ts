import { BattleInfo } from "../../../types/battle/battle-info";
import { BattlePokemon } from "../../../types/battle/battle-pokemon";
import { Move } from "../../../types/core/move";
import { getMove } from "../../move/move";
import { ailmentHandler } from "../handlers/ailment.handler";
import { applyAilmentHandler } from "../handlers/apply-ailment.handler";
import { attackHandler } from "../handlers/attack.handler";
import { statusHandler } from "../handlers/status.handler";
import { shiftHandler } from "../handlers/shift.handler";
import { applyStatModifier } from "../../../utils/stat-modifier";

export const fightMode = async (battleInfo: BattleInfo, command_id: number): Promise<BattleInfo> => {
    console.log("⚔️ fightMode called with command_id:", command_id);
    
    // 必要データの確認
    if (!battleInfo || battleInfo === undefined || !battleInfo.battlePokemons || battleInfo.battlePokemons === undefined || !battleInfo.battlePokemons.PlayerBattlePokemons || !battleInfo.battlePokemons.EnemyBattlePokemons || !battleInfo.battleLogs || battleInfo.battleLogs === undefined) {
        console.error("handleFight: Required battle data is missing or invalid");
        throw new Error("Required battle data is missing or invalid");
    }
    // コマンドが許容範囲を超えていないが確認
    if (command_id < -1 || command_id > 3) {
        console.error("handleFight: Invalid command_id, must be between 0 and 3. Received:", command_id);
        const playerBattlePokemon = battleInfo.battlePokemons.PlayerBattlePokemons[0];
        console.error("Player pokemon move_list:", playerBattlePokemon?.move_list);
        throw new Error(`Invalid command_id: ${command_id}, must be between 0 and 3`);
    }

    // 各戦闘ポケモンの取得
    const playerBattlePokemon: BattlePokemon = battleInfo.battlePokemons.PlayerBattlePokemons[0];
    const enemyBattlePokemon: BattlePokemon = battleInfo.battlePokemons.EnemyBattlePokemons[0];
    if (!playerBattlePokemon || playerBattlePokemon === undefined || !enemyBattlePokemon || enemyBattlePokemon === undefined) {
        console.error("handleFight: Player or enemy battle pokemon not found");
        throw new Error("Player or enemy battle pokemon not found");
    }

    // 技IDの取得
    let player_move_id: number = -1;
    let playerMove: Move | null = null;
    
    if (command_id >= 0 && command_id < playerBattlePokemon.move_list.length) {
        player_move_id = playerBattlePokemon.move_list[command_id];
        playerMove = await getMove(player_move_id);
    }
    
    const random_number: number = Math.floor(Math.random() * 4);
    const enemyBattlePokemon_move_id: number = enemyBattlePokemon.move_list[random_number];

    // 敵の技データの取得
    const enemyMove: Move = await getMove(enemyBattlePokemon_move_id);

    if (!enemyMove || enemyMove === undefined) {
        console.error("fightMode: Failed to get enemy move data");
        throw new Error("Failed to get enemy move data");
    }
    
    if (command_id >= 0 && (!playerMove || playerMove === undefined)) {
        console.error("fightMode: Failed to get player move data");
        throw new Error("Failed to get player move data");
    }

    // 手持ち状態異常の判定
    let playerActionFlag = true;
    let enemyActionFlag = true;

    if (command_id === -1) {
        // コマンドが-1の場合は、プレイヤーの行動をスキップ
        playerActionFlag = false;
    }

    const playerAilmentResult = ailmentHandler(battleInfo, "player");
    if (!playerAilmentResult || playerAilmentResult === undefined) {
        console.error("fightMode: Failed to handle player ailment");
        throw new Error("Failed to handle player ailment");
    }
    battleInfo = playerAilmentResult.battleInfo;
    playerActionFlag = playerAilmentResult.actionFlag;

    // 相手の状態異常の判定
    const enemyAilmentData = ailmentHandler(battleInfo, "enemy");
    if (!enemyAilmentData || enemyAilmentData === undefined) {
        console.error("handleFight: Failed to handle enemy ailment");
        throw new Error("Failed to handle enemy ailment");
    }

    // 行動可能フラグ
    battleInfo = enemyAilmentData.battleInfo;
    enemyActionFlag = enemyAilmentData.actionFlag;

    // HP確認処理
    if (playerBattlePokemon.current_hp <= 0) {
        // 交代処理 または 戦闘終了処理
        let shiftResult = shiftHandler(battleInfo, "player");
        if (!shiftResult?.sucsess) {
            // 戦闘終了処理 
        }
    }
    else if (enemyBattlePokemon.current_hp <= 0) {
        // 交代処理 または 戦闘終了処理
        let shiftResult = shiftHandler(battleInfo, "enemy");
        if (!shiftResult?.sucsess) {
            // 戦闘終了処理 倒したポケモンに応じた経験値 レベルアップ処理
        }
    }

    // 優先度・素早さ判定（ランク補正を適用）
    const playerSpeed = applyStatModifier(playerBattlePokemon.speed, playerBattlePokemon.status_ranks?.speed || 0);
    const enemySpeed = applyStatModifier(enemyBattlePokemon.speed, enemyBattlePokemon.status_ranks?.speed || 0);
    
    console.log(`⚡ Speed comparison:`);
    console.log(`   ${playerBattlePokemon.name}: ${playerBattlePokemon.speed} (rank: ${playerBattlePokemon.status_ranks?.speed || 0}) → ${playerSpeed}`);
    console.log(`   ${enemyBattlePokemon.name}: ${enemyBattlePokemon.speed} (rank: ${enemyBattlePokemon.status_ranks?.speed || 0}) → ${enemySpeed}`);
    
    if (playerSpeed >= enemySpeed) {
        // プレイヤーの攻撃処理
        if (playerActionFlag && playerBattlePokemon.current_hp > 0) {
            // 攻撃技の処理
            if (playerMove?.category.includes("damage")) battleInfo = attackHandler(battleInfo, "player", playerMove);
            if (playerMove?.category.includes("ailment")) battleInfo = applyAilmentHandler(battleInfo, "player", playerMove);
            // 補助技の処理
            if (isStatusMove(playerMove?.category)) battleInfo = statusHandler(battleInfo, "player", playerMove);
        }
        // 相手の攻撃処理
        if (enemyActionFlag && enemyBattlePokemon.current_hp > 0) {
            if (enemyMove?.category.includes("damage")) battleInfo = attackHandler(battleInfo, "enemy", enemyMove);
            if (enemyMove?.category.includes("ailment")) battleInfo = applyAilmentHandler(battleInfo, "enemy", enemyMove);
        }
    }
    else if (playerSpeed < enemySpeed) {
        // 相手の攻撃処理
        if (enemyActionFlag && enemyBattlePokemon.current_hp > 0) {
            if (enemyMove?.category.includes("damage")) battleInfo = attackHandler(battleInfo, "enemy", enemyMove);
            if (enemyMove?.category.includes("ailment")) battleInfo = applyAilmentHandler(battleInfo, "enemy", enemyMove);
            // 補助技の処理
            if (isStatusMove(enemyMove?.category)) battleInfo = statusHandler(battleInfo, "enemy", enemyMove);
        }
        // プレイヤーの攻撃処理
        if (playerActionFlag && playerBattlePokemon.current_hp > 0) {
            if (playerMove?.category.includes("damage")) battleInfo = attackHandler(battleInfo, "player", playerMove);
            if (playerMove?.category.includes("ailment")) battleInfo = applyAilmentHandler(battleInfo, "player", playerMove);
            // 補助技の処理
            if (isStatusMove(playerMove?.category)) battleInfo = statusHandler(battleInfo, "player", playerMove);
        }
    }

    // HP確認処理
    if (playerBattlePokemon.current_hp <= 0) {
        // 交代処理 または 戦闘終了処理
        let shiftResult = shiftHandler(battleInfo, "player");
        if (!shiftResult?.sucsess) {
            // 戦闘終了処理
            console.log("🏁 戦闘終了: プレイヤーのポケモンが倒れました。プレイヤーの敗北です。");
            if (battleInfo && battleInfo.battleResult) {
                battleInfo.battleResult.isFinished = true;
                if (battleInfo.battleLogs) {
                    battleInfo.battleLogs.battleLog = `${playerBattlePokemon.name}は倒れた！\n勝負に負けた...`;
                }
            }

        }
    }

    if (enemyBattlePokemon.current_hp <= 0) {
        // 交代処理 または 戦闘終了処理
        let shiftResult;
        shiftResult = shiftHandler(battleInfo, "enemy");
        if (!shiftResult?.sucsess) {
            // 戦闘終了処理
            console.log("🏁 戦闘終了: 相手のポケモンが倒れました。プレイヤーの勝利です！");
            if (battleInfo && battleInfo.battleResult) {
                battleInfo.battleResult.isFinished = true;
                if (battleInfo.battleLogs) {
                    battleInfo.battleLogs.battleLog = `敵の${enemyBattlePokemon.name}は倒れた！\n勝負に勝った！`;
                }
            }
        }
    }


    // 合計ターンの更新処理
    if (battleInfo?.battleResult) {
        if (battleInfo.battleResult.totalTurn) {
            battleInfo.battleResult.totalTurn += 1;
        } else {
            battleInfo.battleResult.totalTurn = 1;
        }
        console.log("⚔️ Turn updated to:", battleInfo.battleResult.totalTurn);
    }

    console.log("⚔️ fightMode completed successfully");
    return battleInfo;
}

// 補助技かどうかを判定する関数
function isStatusMove(category: string | undefined): boolean {
    if (!category) return false;
    
    const statusCategories = [
        "net-good-stats",
        "heal",
        "ailment",
        "unique",
        "field-effect",
        "whole-field-effect",
        "force-switch"
    ];
    
    return statusCategories.includes(category);
}
