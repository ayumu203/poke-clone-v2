
import { Pokemon } from "../../../types/core/pokemon";
import { TeamPokemon } from "../../../types/core/team-pokemon";
import PokemonCard from "./PokemonCard";

type Props = {
    pokemons: (Pokemon | undefined)[];
    teamPokemons: (TeamPokemon | undefined)[];
    onPokemonClick: (pokemon: Pokemon, teamPokemon: TeamPokemon) => void;
};

export default function PokemonGrid({ pokemons, teamPokemons, onPokemonClick }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => {
                const pokemon = pokemons[index];
                const teamPokemon = teamPokemons[index];
                return (
                    <PokemonCard
                        key={index}
                        pokemon={pokemon}
                        teamPokemon={teamPokemon}
                        onClick={() => pokemon && teamPokemon && onPokemonClick(pokemon, teamPokemon)}
                    />
                );
            })}
        </div>
    );
}
