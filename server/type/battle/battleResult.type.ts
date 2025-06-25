import { Pokemon } from "../pokemon.type";

export type BattleResult = {
    isFinished: boolean,
    totalTurn: number,
    gainExp: number,
    gainPokemon: Pokemon
} | null | undefined;