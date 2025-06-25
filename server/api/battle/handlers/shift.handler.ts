import { BattleInfo } from "../../../types/battle/battle-info";
import { BattlePokemon } from "../../../types/battle/battle-pokemon";

export const shiftHandler = (battleInfo: BattleInfo, playerOrEnemy: string): { battleInfo: BattleInfo, sucsess: boolean } | null => {
    if (!battleInfo || battleInfo === undefined || !battleInfo.battlePokemons || battleInfo.battlePokemons === undefined || !battleInfo.battlePokemons.PlayerBattlePokemons || !battleInfo.battlePokemons.EnemyBattlePokemons || !battleInfo.battleLogs || battleInfo.battleLogs === undefined) {
        console.error("handleShift: Required battle data is missing or invalid");
        return null;
    }

    const targetParty = playerOrEnemy === "player" 
        ? battleInfo.battlePokemons.PlayerBattlePokemons 
        : battleInfo.battlePokemons.EnemyBattlePokemons;

    const nextPokemonIndex = targetParty.findIndex((p, index) => index > 0 && p && p !== undefined && p.current_hp > 0);

    if (nextPokemonIndex === -1) {
        return { battleInfo, sucsess: false };
    }

    const deadOrCurrentPokemon = targetParty[0];
    targetParty[0] = targetParty[nextPokemonIndex];
    targetParty[nextPokemonIndex] = deadOrCurrentPokemon;

    if (playerOrEnemy === "player") {
        battleInfo.battlePokemons.PlayerBattlePokemons = targetParty;
        battleInfo.battleLogs.playerPokemonLog += `${deadOrCurrentPokemon?.name}は${targetParty[0]!.name}に交代した！\n`;
    } else if (playerOrEnemy === "enemy") {
        battleInfo.battlePokemons.EnemyBattlePokemons = targetParty;
        battleInfo.battleLogs.enemyPokemonLog += `${deadOrCurrentPokemon?.name}は${targetParty[0]!.name}に交代した！\n`;
    }

    return { battleInfo, sucsess: true };
}