import Image from "next/image";
import { Pokemon } from "../../../type/pokemon.type";

type Prop = {
    pokemon:Pokemon;
    onSelect:(id:number)=>void;
}

export default function PokemonImage(prop:Prop) {
    const pokemon = prop.pokemon;
    return (
        <div className="bg-opacity-80 rounded-xl shadow-lg p-4 w-40 h-40 flex flex-col items-center justify-center text-center">
            {pokemon && <>
                <Image src={pokemon.front_image} alt={pokemon.name} width={80} height={80} onClick={()=>prop.onSelect(pokemon.pokemon_id)}></Image>
            </>}
        </div>
    )
}
