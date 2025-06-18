import { BattlePokemon } from "./battlePokemon.type";

type BattlePokemons = {
    PlayerBattlePokemons: BattlePokemon[],
    EnemyBattlePokemons: BattlePokemon[]
} | null;