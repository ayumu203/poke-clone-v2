import { battleAction } from "../../../type/battle/battleAction.type";
import { BattleInfo } from "../../../type/battle/battleInfo.type";
import { BattleLogs } from "../../../type/battle/battleLogs.type";
import { BattlePokemons } from "../../../type/battle/battlePokemons.type";
import { BattleResult } from "../../../type/battle/battleResult.type";
import { fightMode } from "../modes/fight.mode";
import { switchMode } from "../modes/switch.mode";

export const battleInfoService = async (battleInfo: BattleInfo, battleAction: battleAction): Promise<BattleInfo> => {
    if( !battleInfo || battleInfo === undefined || !battleAction || battleAction === undefined ) {
        console.error("getBattleInfo: Required battleInfo or battleAction is missing");
        return null;
    }

    
    const command_id: number = battleAction.command_id;
    switch (battleAction.action_name) {
            case "fight":
                // 戦闘モードの処理を呼び出す
                battleInfo = await fightMode(battleInfo, command_id);
                break;
            case "switch":
                // command_idの位置のポケモンと交代する
                battleInfo = await switchMode(battleInfo, command_id);
                break;    
            case "get":
                break;
            case "run":
                break;
    }

    return battleInfo;
}
