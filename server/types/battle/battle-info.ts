import { BattleLogs } from "./battle-logs";
import { BattlePokemons } from "./battle-pokemons";
import { BattleResult } from "./battle-result";

export type BattleInfo = {
    player_id: string;
    battlePokemons: BattlePokemons;
    battleResult: BattleResult;
    battleLogs: BattleLogs;
} | null | undefined;
