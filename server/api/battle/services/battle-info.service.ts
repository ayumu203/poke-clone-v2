import { battleAction } from "../../../type/battle/battleAction.type";
import { BattleInfo } from "../../../type/battle/battleInfo.type";
import { fightMode } from "../modes/fight.mode";

export const battleInfoService = async (battleInfo: BattleInfo, battleAction: battleAction): Promise<BattleInfo> => {
    if( !battleInfo || !battleAction ) {
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
                break;    
            case "get":
                break;
            case "run":
                break;
    }

    return battleInfo;
}
