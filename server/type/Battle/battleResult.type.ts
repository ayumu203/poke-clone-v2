import { Pokemon } from "../pokemon.type";

export type BattleResult = {
    IsFinished: boolean,
    TotalTurn: number,
    GainExp: number,
    GainPokemon: Pokemon
} | null;