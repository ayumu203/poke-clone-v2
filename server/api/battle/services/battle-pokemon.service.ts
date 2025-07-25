import { BattlePokemon } from "../../../types/battle/battle-pokemon";
import { Pokemon } from "../../../types/core/pokemon";
import { TeamPokemon } from "../../../types/core/team-pokemon";

export const battlePokemonService = (pokemon: Pokemon, teamPokemon: TeamPokemon): BattlePokemon => {
    if (pokemon && pokemon !== undefined && teamPokemon && teamPokemon !== undefined) {
        const max_hp = Math.floor(pokemon.base_hp * teamPokemon.level / 100 ) + 10;
        const attack = Math.floor(pokemon.base_attack * teamPokemon.level / 100) + 5;
        const defence = Math.floor(pokemon.base_defence * teamPokemon.level / 100) + 5;
        const special_attack = Math.floor(pokemon.base_special_attack * teamPokemon.level / 100) + 5;
        const special_defence = Math.floor(pokemon.base_special_defence * teamPokemon.level / 100) + 5;
        const speed = Math.floor(pokemon.base_speed * teamPokemon.level / 100) + 5;        const battlePokemon:BattlePokemon = {
            player_id: teamPokemon.player_id,
            pokemon_id: pokemon.pokemon_id,
            pokemon_index: teamPokemon.index,
            level: teamPokemon.level,
            exp: teamPokemon.exp,
            name: pokemon.name,
            type1: pokemon.type1,
            type2: pokemon.type2,
            image: pokemon.front_image,
            max_hp: max_hp,
            current_hp: max_hp,
            attack: attack,
            defence: defence,
            special_attack: special_attack,
            special_defence: special_defence,
            speed: speed,
            move_list: teamPokemon.move_list,
            rank: {attack: 0, defence: 0, special_attack: 0, special_defence: 0, speed: 0, accuracy: 0},
            ailment: "none",
            // 補助技用フィールドの初期化
            status_ranks: {
                attack: 0,
                defense: 0,
                "special-attack": 0,
                "special-defense": 0,
                speed: 0,
                accuracy: 0,
                evasion: 0
            },
            status_ailment: "none",
            status_ailment_turn: 0
        };
        return battlePokemon;
    }
    return null;
};