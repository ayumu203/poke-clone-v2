import { useEffect, useState } from "react";
import { Pokemon } from "../../../type/pokemon.type"
import { usePlayer } from "../../../context/playerContext";
import { fetch_team_pokemon } from "../../../lib/team_pokemon/fetch_team_pokemon";
import { TeamPokemon } from "../../../type/teamPokemon.type";
import { fetch_pokemon } from "../../../lib/pokemon/fetch_pokemon";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Main() {
    const { player } = usePlayer();
    const [pokemons] = useState<Pokemon[]>([]);
    const [teamPokemons] = useState<TeamPokemon[]>([]);
    const router = useRouter();

    useEffect(() => {
        const handleFetchTeamPokemon = async () => {
            for (let i = 0; i < 6; i++) {
                const teamPokemon: TeamPokemon = await fetch_team_pokemon(player!.player_id, i);
                if (teamPokemon) {
                    teamPokemons[teamPokemon!.index] = teamPokemon;
                    pokemons[teamPokemon!.index] = await fetch_pokemon(teamPokemon.pokemon_id);
                }
            }
        }
        if (player) {
            handleFetchTeamPokemon();
            console.log("Pokemons: ", pokemons);
            console.log("Team Pokemons: ", teamPokemons);
        }
    }, [player]);

    return (
        <div className="bg-blue-200 flex-1 p-4">
            <div className="flex flex-col items-center text-white justify-center">
                <button
                    onClick={()=>router.push("/")}
                    className="h-[8vh] bg-black opacity-30 hover:opacity-70 text-white text-[30px]">
                    戻る
                </button>
                {pokemons[0] && teamPokemons[0] && <>                
                    <Image
                        src={pokemons[0]!.front_image}
                        alt="Pokemon Image"
                        width={100}
                        height={100}
                    />
                    <h1 className="text-2xl font-bold">{pokemons[0]?.name}</h1>
                    <p className="text-lg">Level: {teamPokemons[0]?.level}</p>
                    <p>{pokemons[0]?.type1}・{pokemons[0]?.type2}タイプ</p>
                </>}

            </div>
        </div>
    )
}
