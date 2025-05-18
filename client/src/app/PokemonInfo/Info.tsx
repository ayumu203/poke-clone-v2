import Image from "next/image";
import { Pokemon } from "../../../type/pokemon.type";
import { TeamPokemon } from "../../../type/teamPokemon.type";
import { Move } from "../../../type/move.type";

type Prop = {
    pokemon:Pokemon;
    teamPokemon:TeamPokemon;
    moves:Move[];
};
export default function Info(prop:Prop) {
    const pokemon = prop.pokemon;
    const teamPokemon = prop.teamPokemon;
    const moves = prop.moves;
   return (
        <>
            {pokemon && teamPokemon && 
                <>
                    <Image src={pokemon.front_image} alt={pokemon.name} width={150} height={150}></Image>
                    <span>レベル:{teamPokemon.level}</span>
                    <span>{pokemon.name}</span>
                    <span>{pokemon.type1}{pokemon.type2 !== "none" && <>・{pokemon.type2}</>}</span>
                    <span>{moves[0] && moves[0].name}</span>
                </>
            }
        </>
    )
}
