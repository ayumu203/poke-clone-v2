import { battleAction } from "../../type/Battle/battleAction.type";
import { BattleInfo } from "../../type/Battle/battleInfo.type";

export const getBattleInfo = async (battleInfo: BattleInfo, battleAction: battleAction): Promise<BattleInfo> => {
    if( !battleInfo || !battleAction ) {
        console.error("failed");
        return null;
    }

    
    const command_id = battleAction.command_id;
    switch (battleAction.action_name) {
            case "fight":
                break;
            case "switch":
                break;    
            case "get":
                break;
            case "run":
                break;
    }
}