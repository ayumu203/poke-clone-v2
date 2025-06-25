import { BattleInfo } from "../../../type/battle/battleInfo.type";
import { BattlePokemon } from "../../../type/battle/battlePokemon.type";
import { Move } from "../../../type/move.type";
import { getMove } from "../../move/move";
import { handleAilment } from "../module/handleAilment";
import { handleAttack } from "../module/handleAttack";
import { handleShift } from "../module/handleShift";

export const handleFight = async (battleInfo: BattleInfo, command_id: number): Promise<BattleInfo> => {
    // 必要データの確認
    if (!battleInfo || !battleInfo.battlePokemons || !battleInfo.battlePokemons.PlayerBattlePokemons || !battleInfo.battlePokemons.EnemyBattlePokemons || !battleInfo.battleLogs) {
        console.error("handleFight: Required battle data is missing or invalid");
        return null;
    }
    // コマンドが許容範囲を超えていないが確認
    if (command_id < 0 || command_id > 3) {
        console.error("handleFight: Invalid command_id, must be between 0 and 3");
        return null;
    }

    // 各戦闘ポケモンの取得
    const playerBattlePokemon: BattlePokemon = battleInfo!.battlePokemons!.PlayerBattlePokemons[0];
    const enemyBattlePokemon: BattlePokemon = battleInfo!.battlePokemons!.EnemyBattlePokemons[0];
    if (!playerBattlePokemon || !enemyBattlePokemon) {
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

    // 手持ち状態異常の判定
    let playerActionFlag = true;
    let enemyActionFlag = true;
    const playerAilmentResult = handleAilment(battleInfo, "player");
    if (!playerAilmentResult) {
        console.error("handleFight: Failed to handle player ailment");
        return null;
    }
    battleInfo = playerAilmentResult.battleInfo;
    playerActionFlag = playerAilmentResult.actionFlag;

    // 相手の状態異常の判定
    const enemyAilmentData = handleAilment(battleInfo, "enemy");
    if (!enemyAilmentData) {
        console.error("handleFight: Failed to handle enemy ailment");
        return null;
    }

    // 行動可能フラグ
    battleInfo = enemyAilmentData.battleInfo;
    enemyActionFlag = enemyAilmentData.actionFlag;

    // HP確認処理
    if (playerBattlePokemon.current_hp <= 0) {
        // 交代処理 または 戦闘終了処理
        let shiftResult = handleShift(battleInfo, "player");
        if (!shiftResult?.sucsess) {
            // 戦闘終了処理 
        }
    }
    else if (enemyBattlePokemon.current_hp <= 0) {
        // 交代処理 または 戦闘終了処理
        let shiftResult = handleShift(battleInfo, "enemy");
        if (!shiftResult?.sucsess) {
            // 戦闘終了処理 倒したポケモンに応じた経験値 レベルアップ処理
        }
    }

    // 優先度・素早さ判定   
    if (playerBattlePokemon.speed >= enemyBattlePokemon.speed) {
        // プレイヤーの攻撃処理
        if (playerActionFlag && playerBattlePokemon.current_hp > 0) {
            // 攻撃技の処理
            if (playerMove?.category.includes("damage")) battleInfo = handleAttack(battleInfo, "player", playerMove);
        }
        // 相手の攻撃処理
        if (enemyActionFlag && enemyBattlePokemon.current_hp > 0) {
            if (playerMove?.category.includes("damage")) battleInfo = handleAttack(battleInfo, "enemy", enemyMove);
        }
    }
    else if (playerBattlePokemon.speed < enemyBattlePokemon.speed) {
        // 相手の攻撃処理
        if (enemyActionFlag && enemyBattlePokemon.current_hp > 0) {
            if (playerMove?.category.includes("damage")) battleInfo = handleAttack(battleInfo, "enemy", enemyMove);
        }
        // プレイヤーの攻撃処理
        if (playerActionFlag && playerBattlePokemon.current_hp > 0) {
            if (playerMove?.category.includes("damage")) battleInfo = handleAttack(battleInfo, "player", playerMove);
        }
    }

    // HP確認処理
    if (playerBattlePokemon.current_hp <= 0) {
        // 交代処理 または 戦闘終了処理
        let shiftResult = handleShift(battleInfo, "player");
        if (!shiftResult?.sucsess) {
            // 戦闘終了処理
            console.log("戦闘終了処理: プレイヤーのポケモンが倒れました。");
        }
    }

    if (enemyBattlePokemon.current_hp <= 0) {
        // 交代処理 または 戦闘終了処理
        let shiftResult;
        shiftResult = handleShift(battleInfo, "enemy");
        if (!shiftResult?.sucsess) {
            // 戦闘終了処理 倒したポケモンに応じた経験値 レベルアップ処理
            console.log("戦闘終了処理: 相手のポケモンが倒れました。");
        }
    }


    // 合計ターンの更新処理
    if (battleInfo?.battleResult?.totalTurn) battleInfo.battleResult.totalTurn += 1;

    return battleInfo;
}
