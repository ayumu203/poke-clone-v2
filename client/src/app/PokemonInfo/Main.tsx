import { useEffect, useState } from "react";
import { Pokemon } from "../../../type/pokemon.type"
import { usePlayer } from "../../../context/playerContext";
import { fetch_team_pokemon } from "../../../lib/team_pokemon/fetch_team_pokemon";
import { TeamPokemon } from "../../../type/teamPokemon.type";
import { fetch_pokemon } from "../../../lib/pokemon/fetch_pokemon";
import { useRouter } from "next/navigation";
import PokemonGrid from "./PokemonGrid";
import PokemonDetail from "./PokemonDetail";
import { Move } from "../../../type/move.type";
import { fetch_move } from "../../../lib/move/fetch_move";

type PokemonData = {
    pokemon: Pokemon;
    teamPokemon: TeamPokemon;
    moves: Move[];
};

export default function Main() {
    const { player } = usePlayer();
    const [pokemonData, setPokemonData] = useState<PokemonData[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const handleFetchTeamPokemon = async () => {
            if (!player) return;
            
            setIsLoading(true);
            const newPokemonData: PokemonData[] = [];

            for (let i = 0; i <= 6; i++) {
                const teamPokemon = await fetch_team_pokemon(player.player_id, i);
                if (teamPokemon) {
                    const pokemon = await fetch_pokemon(teamPokemon.pokemon_id);
                    if (pokemon) {
                        const moves: Move[] = [];
                        for (const move_id of teamPokemon.move_list) {
                            const move = await fetch_move(move_id);
                            if (move) moves.push(move);
                        }
                        newPokemonData.push({ pokemon, teamPokemon, moves });
                    }
                }
            }

            setPokemonData(newPokemonData);
            setIsLoading(false);
        };

        if (player) {
            handleFetchTeamPokemon();
        }
    }, [player]);

    const handlePokemonSelect = (index: number) => {
        setSelectedIndex(index);
    };

    const handleBackToGrid = () => {
        setSelectedIndex(null);
    };

    const handleReload = async () => {
        if (!player) return;
        
        setIsLoading(true);
        const newPokemonData: PokemonData[] = [];

        for (let i = 0; i <= 6; i++) {
            const teamPokemon = await fetch_team_pokemon(player.player_id, i);
            if (teamPokemon) {
                const pokemon = await fetch_pokemon(teamPokemon.pokemon_id);
                if (pokemon) {
                    const moves: Move[] = [];
                    for (const move_id of teamPokemon.move_list) {
                        const move = await fetch_move(move_id);
                        if (move) moves.push(move);
                    }
                    newPokemonData.push({ pokemon, teamPokemon, moves });
                }
            }
        }

        setPokemonData(newPokemonData);
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <div className="bg-blue-900 flex-1 flex items-center justify-center">
                <div className="text-white text-xl">データ取得中...</div>
            </div>
        );
    }

    return (
        <div className="bg-blue-900 flex-1 relative">
            {selectedIndex === null ? (
                <>
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <button
                            onClick={() => router.push("/")}
                            className="h-12 w-24 bg-black bg-opacity-50 hover:bg-opacity-70 text-white text-lg rounded">
                            戻る
                        </button>
                        <button
                            onClick={handleReload}
                            className="h-12 w-24 bg-green-600 bg-opacity-70 hover:bg-opacity-90 text-white text-lg rounded">
                            更新
                        </button>
                    </div>
                    <PokemonGrid 
                        pokemonData={pokemonData} 
                        onPokemonSelect={handlePokemonSelect} 
                    />
                </>
            ) : (
                <>
                    <button
                        onClick={handleBackToGrid}
                        className="absolute top-4 right-4 z-10 h-12 w-24 bg-black bg-opacity-50 hover:bg-opacity-70 text-white text-lg rounded">
                        戻る
                    </button>
                    <PokemonDetail 
                        pokemonData={pokemonData[selectedIndex]} 
                        onBack={handleBackToGrid}
                    />
                </>
            )}
        </div>
    );
}
