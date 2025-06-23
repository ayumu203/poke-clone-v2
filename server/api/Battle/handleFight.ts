import { BattleInfo } from "../../type/Battle/battleInfo.type";
import { BattlePokemon } from "../../type/Battle/battlePokemon.type";
import { getMove } from "../move/move";
import { handleAilment } from "./module/handleAilment";
import { handleShift } from "./module/handleShift";

export const handleFight = async (battleInfo: BattleInfo, command_id: number): Promise<BattleInfo> => {
    // 必要データの確認
    if (!battleInfo || !battleInfo.battlePokemons || !battleInfo.battlePokemons.PlayerBattlePokemons || !battleInfo.battlePokemons.EnemyBattlePokemons || !battleInfo.battleLogs) {
        console.error("failed");
        return null;
    }
    // コマンドが許容範囲を超えていないが確認
    if (command_id < 0 || command_id > 3) {
        console.error("failed");
        return null;
    }

    // 各戦闘ポケモンの取得
    const playerBattlePokemon: BattlePokemon = battleInfo!.battlePokemons!.PlayerBattlePokemons[0];
    const enemyBattlePokemon: BattlePokemon = battleInfo!.battlePokemons!.EnemyBattlePokemons[0];
    if (!playerBattlePokemon || !enemyBattlePokemon) {
        console.error("failed");
        return null;
    }

    // 技IDの取得
    const player_move_id = playerBattlePokemon.move_list[command_id];
    const random_number = Math.floor(Math.random() * 3.9999999999999999);
    const enemyBattlePokemon_move_id = enemyBattlePokemon.move_list[0];

    // 技データの取得
    const playerMove = getMove(player_move_id);
    const enemyMove = getMove(enemyBattlePokemon_move_id);

    // 手持ち状態異常の判定
    let  playerActionFlag = true;
    let enemyActionFlag = true;
    const playerAilmentResult = handleAilment(battleInfo, "player");
    if (!playerAilmentResult) {
        console.error("failed");
        return null;
    }
    battleInfo = playerAilmentResult.battleInfo;
    playerActionFlag = playerAilmentResult.actionFlag;
    
    // 相手の状態異常の判定
    const enemyAilmentData = handleAilment(battleInfo, "player");
    if (!enemyAilmentData) {
        console.error("failed");
        return null;
    }

    // 行動可能フラグ
    battleInfo = enemyAilmentData.battleInfo;
    enemyActionFlag = enemyAilmentData.actionFlag;

    // HP確認処理
    if (playerBattlePokemon.current_hp === 0) {
        // 交代処理 または 戦闘終了処理
        let shiftResult = handleShift(battleInfo,"player");
        if (!shiftResult?.sucsess) {
            // 戦闘終了処理 
        } 
    }
    else if (enemyBattlePokemon.current_hp === 0) {
        // 交代処理 または 戦闘終了処理
        let shiftResult = handleShift(battleInfo,"enemy");
        if (!shiftResult?.sucsess) {
            // 戦闘終了処理 倒したポケモンに応じた経験値 レベルアップ処理
        } 
    }

    // 優先度・素早さ判定   
    if (playerBattlePokemon.speed >= enemyBattlePokemon.speed) {
        // プレイヤーの攻撃処理
        // 相手の攻撃処理
    }
    else if (playerBattlePokemon.speed < enemyBattlePokemon.speed) {
        // 相手の攻撃処理
        // プレイヤーの攻撃処理
    }

    // HP確認処理
    if (playerBattlePokemon.current_hp === 0 || enemyBattlePokemon.current_hp === 0) {
        // 交代処理 または 戦闘終了処理
    }

    // 合計ターンの更新処理
}


