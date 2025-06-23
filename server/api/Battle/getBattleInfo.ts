import { battleAction } from "../../type/Battle/battleAction.type";
import { BattleInfo } from "../../type/Battle/battleInfo.type";
import { handleFight } from "./mode/fightMode";

export const getBattleInfo = async (battleInfo: BattleInfo, battleAction: battleAction): Promise<BattleInfo> => {
    if( !battleInfo || !battleAction ) {
        console.error("failed");
        return null;
    }

    
    const command_id: number = battleAction.command_id;
    switch (battleAction.action_name) {
            case "fight":
                // 戦闘モードの処理を呼び出す
                battleInfo = await handleFight(battleInfo, command_id);
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
