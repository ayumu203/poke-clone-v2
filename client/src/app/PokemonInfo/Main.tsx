import { useEffect, useState } from "react";
import { Pokemon } from "../../../type/pokemon.type"
import { usePlayer } from "../../../context/playerContext";
import { useUser } from "../../../context/userContext";
import { fetch_team_pokemon } from "../../../lib/team_pokemon/fetch_team_pokemon";
import { TeamPokemon } from "../../../type/teamPokemon.type";
import { fetch_pokemon } from "../../../lib/pokemon/fetch_pokemon";

export default function Main() {
    const { player } = usePlayer();
    const [ pokemons ] = useState<Pokemon[]>([]);
    const [ teamPokemons ] = useState<TeamPokemon[]>([]);

    useEffect(()=>{
        const handleFetchTeamPokemon = async()=>{
            for(let i = 0; i < 6; i++){
                const teamPokemon:TeamPokemon = await fetch_team_pokemon(player!.player_id, i);
                if(teamPokemon){
                    teamPokemons[teamPokemon!.index] = teamPokemon;
                    pokemons[teamPokemon!.index] = await fetch_pokemon(teamPokemon.pokemon_id);
                }
            }
        }
        if(player){
            handleFetchTeamPokemon();
            console.log("Pokemons: ", pokemons);
            console.log("Team Pokemons: ", teamPokemons);
        }
    },[player]);

    return (
        <div className="bg-[url(/002_firstPokemon.png)] flex-1 text-orange-400 p-4">
            
        </div>
    )
}
