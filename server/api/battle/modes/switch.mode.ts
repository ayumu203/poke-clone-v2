import { BattleInfo } from "../../../type/battle/battleInfo.type";
import { BattlePokemon } from "../../../type/battle/battlePokemon.type";

export const switchMode = async(battleInfo: BattleInfo, command_id:number): Promise<BattleInfo | null> => {
    if (!battleInfo || !battleInfo.battlePokemons || !battleInfo.battlePokemons.PlayerBattlePokemons || !battleInfo.battlePokemons.EnemyBattlePokemons || !battleInfo.battleLogs) {
        console.error("shiftHandler: Required battle data is missing or invalid");
        return null;
    }

    const targetParty: (BattlePokemon | null)[] = battleInfo.battlePokemons.PlayerBattlePokemons;

    if (command_id === -1) {
        return battleInfo; 
    }

    const currentPokemon: BattlePokemon | null = targetParty[0] ?? null;
    const targetPokemon: BattlePokemon | null = targetParty[command_id] ?? null;
    
    if (!targetPokemon || (targetPokemon.current_hp ?? 0) <= 0) {
        console.error("switchMode: Cannot switch to a fainted Pokemon");
        return battleInfo;
    }
    
    targetParty[0] = targetPokemon;
    targetParty[command_id] = currentPokemon;

    battleInfo.battleLogs.playerPokemonLog += `${currentPokemon?.name ?? 'ポケモン'}は${targetPokemon?.name ?? 'ポケモン'}に交代した！\n`;

    return battleInfo;
}