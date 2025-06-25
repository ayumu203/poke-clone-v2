import { Pokemon } from "../pokemon.type";
import { BattlePokemon } from "./battlePokemon.type";

export type BattleResult = {
    isFinished: boolean,
    totalTurn: number,
    gainExp: number,
    gainPokemon: BattlePokemon
} | null | undefined;