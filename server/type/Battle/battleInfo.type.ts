import { BattleLogs } from "./battleLogs.type";
import { BattlePokemons } from "./battlePokemons.type";
import { BattleResult } from "./battleResult.type";

export type BattleInfo = {  
    battlePokemons: BattlePokemons,
    BattleResult: BattleResult,
    battleLogs: BattleLogs
} | null;