import React, { useEffect, useState } from 'react'
import { useUser } from '../../../context/userContext';
import { fetch_first_pokemon } from '../../../lib/first_pokemon.ts/fetch_first_pokemon';
import { usePlayer } from '../../../context/playerContext';
import { Pokemon } from '../../../type/pokemon.type';
import PokemonInfo from './pokemonInfo/PokemonInfo';

export default function Main() {
    const { user } = useUser();
    const { player } = usePlayer();
    const [ pokemons, setPokemons ] = useState<Pokemon[]>([]);

    useEffect(()=>{
        if(user && player){
            const handleFetchFirstPokemon = async():Promise<void> => {
                const data = await fetch_first_pokemon();
                setPokemons(data);
            }
            handleFetchFirstPokemon();
        }
    },[user,player]);

    return (
        <div className="bg-[url(/002_firstPokemon.png)] flex-1 text-white p-4">
            {pokemons.length < 3 && <>データの取得中</>}
            {pokemons.length >= 3 && <>
                {pokemons.map((pokemon,index) => {
                    return(<div className='flex flex-row justify-center items-center gap-6 flex-wrap'><PokemonInfo key={index} pokemon={pokemon} /></div>)
                })}
            </>}

        </div>
    )
}
