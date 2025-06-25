import { BattleInfo } from "../../../types/battle/battle-info";
import { BattlePokemon } from "../../../types/battle/battle-pokemon";

export const getMode = async (battleInfo: BattleInfo): Promise<BattleInfo> => {
    if (!battleInfo || !battleInfo.battlePokemons || !battleInfo.battlePokemons.PlayerBattlePokemons || !battleInfo.battlePokemons.EnemyBattlePokemons || !battleInfo.battleLogs) {
        console.error("shiftHandler: Required battle data is missing or invalid");
        return null;
    }

    const targetPokemon: BattlePokemon = battleInfo.battlePokemons.EnemyBattlePokemons[0];
    if (!targetPokemon || targetPokemon === undefined) {
        console.error("getMode: Cannot get a Pokemon that is fainted");
        return battleInfo;
    }
    const randomNumber = Math.random();
    if (randomNumber < 0.5) {
        battleInfo.battleLogs.playerPokemonLog = `${targetPokemon.name}を捕まえた！`;
        if (battleInfo.battleResult) {
            battleInfo.battleResult.gainPokemon = targetPokemon;
            battleInfo.battleResult.isFinished = true;
        }
    } else {
        battleInfo.battleLogs.playerPokemonLog = `${targetPokemon.name}はボールから飛び出した！`;
    }
    return battleInfo;
}