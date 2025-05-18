import { useEffect, useState } from "react";
import { Pokemon } from "../../../type/pokemon.type"
import { usePlayer } from "../../../context/playerContext";
import { fetch_team_pokemon } from "../../../lib/team_pokemon/fetch_team_pokemon";
import { TeamPokemon } from "../../../type/teamPokemon.type";
import { fetch_pokemon } from "../../../lib/pokemon/fetch_pokemon";
import { useRouter } from "next/navigation";
import Info from "./Info";
import { Move } from "../../../type/move.type";
import { fetch_move } from "../../../lib/move/fetch_move";

export default function Main() {
    const { player } = usePlayer();
    const [ pokemons,setPokemons ] = useState<Pokemon[]>([]);
    const [teamPokemons, setTeamPokemons] = useState<TeamPokemon[]>([]);
    const [moves, setMoves] = useState<Move[]>([]);
    const router = useRouter();

    useEffect(() => {
        const handleFetchTeamPokemon = async () => {
            const newMoves = new Set<Move>();
            const newPokemons: Pokemon[] = [];
            const newTeamPokemons: TeamPokemon[] = [];

            for (let i = 0; i < 6; i++) {
                const teamPokemon = await fetch_team_pokemon(player!.player_id, i);
                if (teamPokemon) {
                    const pokemon = await fetch_pokemon(teamPokemon.pokemon_id);
                    if (pokemon) {
                        newTeamPokemons[teamPokemon.index] = teamPokemon;
                        newPokemons[teamPokemon.index] = pokemon;
                        for (const move_id of teamPokemon.move_list) {
                            const move:Move = await fetch_move(move_id);
                            newMoves.add(move);
                        }
                    }
                }
            }

            setPokemons(newPokemons);
            setTeamPokemons(newTeamPokemons);
            setMoves(Array.from(newMoves));

            console.log("Pokemons:", pokemons);
            console.log("Team Pokemons:", teamPokemons);
            console.log("Moves:", Array.from(moves));
        };

        if (player) {
            handleFetchTeamPokemon();
        }
    }, [player]);

    return (
        <div className="bg-blue-200 flex-1 p-4">
            <button
                onClick={() => router.push("/")}
                className="h-[8vh] w-[96px] bg-black opacity-30 hover:opacity-70 text-white text-[30px]">
                戻る
            </button>
            <div className="flex flex-col items-center text-white justify-center">
                {
                    teamPokemons.map((teamPokemon, index) => {
                        const pokemon = pokemons[index];
                        if (pokemon) return (<Info key={index} pokemon={pokemon} teamPokemon={teamPokemon} moves={moves}></Info>);
                    })
                }
            </div>
        </div>
    )
}
