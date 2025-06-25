import { BattleAction } from "../../../types/battle/battle-action";
import { BattleInfo } from "../../../types/battle/battle-info";
import { BattleLogs } from "../../../types/battle/battle-logs";
import { BattlePokemon } from "../../../types/battle/battle-pokemon";
import { BattlePokemons } from "../../../types/battle/battle-pokemons";
import { BattleResult } from "../../../types/battle/battle-result";
import { fightMode } from "../modes/fight.mode";
import { getMode } from "../modes/get.mode";
import { switchMode } from "../modes/switch.mode";

export const battleInfoService = async (battleInfo: BattleInfo, battleAction: BattleAction): Promise<BattleInfo> => {
    if (!battleInfo || battleInfo === undefined || !battleAction || battleAction === undefined) {
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
            // 交代後プレイヤー側の攻撃は行わないまま,相手の攻撃に入る.
            battleInfo = await fightMode(battleInfo, -1);
            break;
        case "get":
            battleInfo = await getMode(battleInfo);
            if (battleInfo?.battleResult && battleInfo.battleResult.isFinished) battleInfo = await fightMode(battleInfo, -1);
            break;
        case "run":
            if (battleInfo.battleLogs && battleInfo.battleResult) {
                battleInfo.battleLogs.playerPokemonLog = "逃げた！";
                battleInfo.battleResult.isFinished = true;
            }
            break;
    }

    return battleInfo;
}

const aggregateBattleResult = (battleInfo: BattleInfo): BattleInfo => {
    if (!battleInfo || !battleInfo.battleLogs || !battleInfo.battleResult) {
        console.error("aggregateBattleResult: Required battleInfo, battleLogs or battleResult is missing");
        return null;
    }

    if( battleInfo.battleResult.isFinished ) {
        let gainExp = 0;
        battleInfo.battlePokemons?.EnemyBattlePokemons.forEach((enemyPokemon: BattlePokemon) => {
            gainExp += enemyPokemon!.level * 5;
        })
        battleInfo.battleResult.gainExp = gainExp;
    }
    return null;
}