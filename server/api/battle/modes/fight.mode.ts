import { BattleInfo } from "../../../type/battle/battleInfo.type";
import { BattlePokemon } from "../../../type/battle/battlePokemon.type";
import { Move } from "../../../type/move.type";
import { getMove } from "../../move/move";
import { ailmentHandler } from "../handlers/ailment.handler";
import { applyAilmentHandler } from "../handlers/apply-ailment.handler";
import { attackHandler } from "../handlers/attack.handler";
import { shiftHandler } from "../handlers/shift.handler";

export const fightMode = async (battleInfo: BattleInfo, command_id: number): Promise<BattleInfo> => {
    // 必要データの確認
    if (!battleInfo || battleInfo === undefined || !battleInfo.battlePokemons || battleInfo.battlePokemons === undefined || !battleInfo.battlePokemons.PlayerBattlePokemons || !battleInfo.battlePokemons.EnemyBattlePokemons || !battleInfo.battleLogs || battleInfo.battleLogs === undefined) {
        console.error("handleFight: Required battle data is missing or invalid");
        return null;
    }
    // コマンドが許容範囲を超えていないが確認
    if (command_id < 0 || command_id > 3) {
        console.error("handleFight: Invalid command_id, must be between 0 and 3");
        return null;
    }

    // 各戦闘ポケモンの取得
    const playerBattlePokemon: BattlePokemon = battleInfo.battlePokemons.PlayerBattlePokemons[0];
    const enemyBattlePokemon: BattlePokemon = battleInfo.battlePokemons.EnemyBattlePokemons[0];
    if (!playerBattlePokemon || playerBattlePokemon === undefined || !enemyBattlePokemon || enemyBattlePokemon === undefined) {
        console.error("handleFight: Player or enemy battle pokemon not found");
        return null;
    }

    // 技IDの取得
    const player_move_id: number = playerBattlePokemon.move_list[command_id];
    const random_number: number = Math.floor(Math.random() * 4);
    const enemyBattlePokemon_move_id: number = enemyBattlePokemon.move_list[random_number];

    // 技データの取得
    const playerMove: Move = await getMove(player_move_id);
    const enemyMove: Move = await getMove(enemyBattlePokemon_move_id);

    if (!playerMove || playerMove === undefined || !enemyMove || enemyMove === undefined) {
        console.error("fightMode: Failed to get move data");
        return null;
    }

    // 手持ち状態異常の判定
    let playerActionFlag = true;
    let enemyActionFlag = true;
    const playerAilmentResult = ailmentHandler(battleInfo, "player");
    if (!playerAilmentResult || playerAilmentResult === undefined) {
        console.error("fightMode: Failed to handle player ailment");
        return null;
    }
    battleInfo = playerAilmentResult.battleInfo;
    playerActionFlag = playerAilmentResult.actionFlag;

    // 相手の状態異常の判定
    const enemyAilmentData = ailmentHandler(battleInfo, "enemy");
    if (!enemyAilmentData || enemyAilmentData === undefined) {
        console.error("handleFight: Failed to handle enemy ailment");
        return null;
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

    // 優先度・素早さ判定   
    if (playerBattlePokemon.speed >= enemyBattlePokemon.speed) {
        // プレイヤーの攻撃処理
        if (playerActionFlag && playerBattlePokemon.current_hp > 0) {
            // 攻撃技の処理
            if (playerMove?.category.includes("damage")) battleInfo = attackHandler(battleInfo, "player", playerMove);
            if (playerMove?.category.includes("ailment")) battleInfo = applyAilmentHandler(battleInfo, "player", playerMove);
        }
        // 相手の攻撃処理
        if (enemyActionFlag && enemyBattlePokemon.current_hp > 0) {
            if (playerMove?.category.includes("damage")) battleInfo = attackHandler(battleInfo, "enemy", enemyMove);
            if (enemyMove?.category.includes("ailment")) battleInfo = applyAilmentHandler(battleInfo, "enemy", enemyMove);
        }
    }
    else if (playerBattlePokemon.speed < enemyBattlePokemon.speed) {
        // 相手の攻撃処理
        if (enemyActionFlag && enemyBattlePokemon.current_hp > 0) {
            if (playerMove?.category.includes("damage")) battleInfo = attackHandler(battleInfo, "enemy", enemyMove);
            if (enemyMove?.category.includes("ailment")) battleInfo = applyAilmentHandler(battleInfo, "enemy", enemyMove);
        }
        // プレイヤーの攻撃処理
        if (playerActionFlag && playerBattlePokemon.current_hp > 0) {
            if (playerMove?.category.includes("damage")) battleInfo = attackHandler(battleInfo, "player", playerMove);
            if (playerMove?.category.includes("ailment")) battleInfo = applyAilmentHandler(battleInfo, "player", playerMove);
        }
    }

    // HP確認処理
    if (playerBattlePokemon.current_hp <= 0) {
        // 交代処理 または 戦闘終了処理
        let shiftResult = shiftHandler(battleInfo, "player");
        if (!shiftResult?.sucsess) {
            // 戦闘終了処理
            console.log("戦闘終了処理: プレイヤーのポケモンが倒れました。");
        }
    }

    if (enemyBattlePokemon.current_hp <= 0) {
        // 交代処理 または 戦闘終了処理
        let shiftResult;
        shiftResult = shiftHandler(battleInfo, "enemy");
        if (!shiftResult?.sucsess) {
            // 戦闘終了処理 倒したポケモンに応じた経験値 レベルアップ処理
            console.log("戦闘終了処理: 相手のポケモンが倒れました。");
        }
    }


    // 合計ターンの更新処理
    if (battleInfo?.battleResult?.totalTurn) battleInfo.battleResult.totalTurn += 1;

    return battleInfo;
}
