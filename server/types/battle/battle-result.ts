import { BattlePokemon } from "./battle-pokemon";

export type BattleResult = {
    isFinished: boolean;
    totalTurn: number;
    gainExp: number;
    gainPokemon: BattlePokemon;
} | null | undefined;
