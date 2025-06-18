import { Pokemon } from "../pokemon.type";

type BattleResult = {
    IsFinished: boolean,
    TotalTurn: number,
    GainExp: number,
    GainPokemon: Pokemon
} | null;