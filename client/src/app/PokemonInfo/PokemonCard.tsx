
import Image from "next/image";
import { Pokemon } from "../../../types/core/pokemon";
import { TeamPokemon } from "../../../types/core/team-pokemon";

type Props = {
    pokemon?: Pokemon;
    teamPokemon?: TeamPokemon;
    onClick: () => void;
};

export default function PokemonCard({ pokemon, teamPokemon, onClick }: Props) {
    if (!pokemon || !teamPokemon) {
        return (
            <div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-4 h-64 flex items-center justify-center">
                <div className="text-slate-400 text-lg">-</div>
            </div>
        );
    }

    const typeColors: { [key: string]: string } = {
        normal: "#A8A878",
        fire: "#F08030",
        water: "#6890F0",
        electric: "#F8D030",
        grass: "#78C850",
        ice: "#98D8D8",
        fighting: "#C03028",
        poison: "#A040A0",
        ground: "#E0C068",
        flying: "#A890F0",
        psychic: "#F85888",
        bug: "#A8B820",
        rock: "#B8A038",
        ghost: "#705898",
        dragon: "#7038F8",
        dark: "#705848",
        steel: "#B8B8D0",
        fairy: "#EE99AC",
    };

    return (
        <div 
            className="relative bg-slate-800 border-2 border-slate-700 rounded-lg p-4 transition-all duration-300 h-64 flex flex-col justify-between cursor-pointer hover:border-cyan-400"
            onClick={onClick}
        >
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mb-2">
                    <Image 
                        src={pokemon.front_image} 
                        alt={pokemon.name} 
                        width={96} 
                        height={96}
                        className="pixelated"
                    />
                </div>
                <div className="text-slate-100 text-lg font-bold">{pokemon.name}</div>
                <div className="text-cyan-400">Lv.{teamPokemon.level}</div>
                <div className="flex gap-1 mt-1">
                    <span 
                        className="px-2 py-0.5 rounded text-white text-xs font-bold"
                        style={{ backgroundColor: typeColors[pokemon.type1] || "#68A090" }}
                    >
                        {pokemon.type1.toUpperCase()}
                    </span>
                    {pokemon.type2 !== "none" && (
                        <span 
                            className="px-2 py-0.5 rounded text-white text-xs font-bold"
                            style={{ backgroundColor: typeColors[pokemon.type2] || "#68A090" }}
                        >
                            {pokemon.type2.toUpperCase()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
