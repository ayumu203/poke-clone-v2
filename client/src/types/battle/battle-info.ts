import { BattleLogs } from "./battle-logs";
import { BattlePokemons } from "./battle-pokemons";
import { BattleResult } from "./battle-result";

export type BattleInfo = {
  battlePokemons: BattlePokemons;
  battleResult: BattleResult;
  battleLogs: BattleLogs;
};

export type BattleResponse = BattleInfo;
