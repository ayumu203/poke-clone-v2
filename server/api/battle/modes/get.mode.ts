import { BattleInfo } from "../../../types/battle/battle-info";
import { BattlePokemon } from "../../../types/battle/battle-pokemon";

export const getMode = async (battleInfo: BattleInfo): Promise<BattleInfo> => {
    console.log("🎯 getMode called - attempting to capture Pokemon");
    
    if (!battleInfo || !battleInfo.battlePokemons || !battleInfo.battlePokemons.PlayerBattlePokemons || !battleInfo.battlePokemons.EnemyBattlePokemons || !battleInfo.battleLogs) {
        console.error("getMode: Required battle data is missing or invalid");
        return null;
    }

    const targetPokemon: BattlePokemon = battleInfo.battlePokemons.EnemyBattlePokemons[0];
    if (!targetPokemon || targetPokemon === undefined) {
        console.error("getMode: Cannot get a Pokemon that is fainted");
        return battleInfo;
    }
    
    console.log(`🎯 Attempting to capture: ${targetPokemon.name}`);
    
    const randomNumber = Math.random();
    console.log(`🎲 Random number: ${randomNumber} (success if < 0.5)`);
    
    if (randomNumber < 0.5) {
        console.log("✅ Capture successful!");
        battleInfo.battleLogs.playerPokemonLog = `${targetPokemon.name}を捕まえた！`;
        if (battleInfo.battleResult) {
            battleInfo.battleResult.gainPokemon = targetPokemon;
            battleInfo.battleResult.isFinished = true;
        }
    } else {
        console.log("❌ Capture failed!");
        battleInfo.battleLogs.playerPokemonLog = `${targetPokemon.name}はボールから飛び出した！`;
    }
    
    console.log(`🎯 Final playerPokemonLog: ${battleInfo.battleLogs.playerPokemonLog}`);
    console.log(`🎯 Battle finished: ${battleInfo.battleResult?.isFinished}`);
    
    return battleInfo;
}