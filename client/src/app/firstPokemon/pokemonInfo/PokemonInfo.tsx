import Image from "next/image";
import { Pokemon } from "../../../../type/pokemon.type";

type Prop = {
    pokemon:Pokemon;
}

export default function PokemonInfo(prop:Prop) {
    const pokemon = prop.pokemon;
    console.log(pokemon);
    return (
        <div className="bg-opacity-80 rounded-xl shadow-lg p-4 w-40 h-40 flex flex-col items-center justify-center text-center">
            {pokemon && <>
                {pokemon.name}
                <Image src={pokemon.front_image} alt={pokemon.name} width={80} height={80}></Image>
            </>}
        </div>
    )
}
