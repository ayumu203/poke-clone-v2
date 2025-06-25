import { BattlePokemon } from "./battlePokemon.type";

export type BattlePokemons = {
    PlayerBattlePokemons: BattlePokemon[],
    EnemyBattlePokemons: BattlePokemon[]
} | null | undefined;