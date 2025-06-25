import { BattleInfo } from "../../../type/battle/battleInfo.type";
import { BattlePokemon } from "../../../type/battle/battlePokemon.type";

export const handleShift = (battleInfo: BattleInfo, playerOrEnemy: string): { battleInfo: BattleInfo, sucsess: boolean } | null => {
    if (!battleInfo || !battleInfo.battlePokemons || !battleInfo.battlePokemons.PlayerBattlePokemons || !battleInfo.battlePokemons.EnemyBattlePokemons || !battleInfo.battleLogs) {
        console.error("handleShift: Required battle data is missing or invalid");
        return null;
    }

    const targetParty = playerOrEnemy === "player" 
        ? battleInfo.battlePokemons.PlayerBattlePokemons 
        : battleInfo.battlePokemons.EnemyBattlePokemons;

    const nextPokemonIndex = targetParty.findIndex((p, index) => index > 0 && p && p.current_hp > 0);

    if (nextPokemonIndex === -1) {
        return { battleInfo, sucsess: false };
    }

    const deadOrCurrentPokemon = targetParty[0];
    targetParty[0] = targetParty[nextPokemonIndex];
    targetParty[nextPokemonIndex] = deadOrCurrentPokemon;

    if (playerOrEnemy === "player") {
        battleInfo.battlePokemons.PlayerBattlePokemons = targetParty;
    } else {
        battleInfo.battlePokemons.EnemyBattlePokemons = targetParty;
    }

    return { battleInfo, sucsess: true };
}