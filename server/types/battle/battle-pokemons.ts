import { BattlePokemon } from "./battle-pokemon";

export type BattlePokemons = {
    PlayerBattlePokemons: BattlePokemon[];
    EnemyBattlePokemons: BattlePokemon[];
} | null | undefined;
