import React, { useEffect, useState } from 'react'
import { Pokemon } from '../../../type/pokemon.type'
import { useUser } from '../../../context/userContext';
import { fetch_first_pokemon } from '../../../lib/first_pokemon.ts/fetch_first_pokemon';

export default function Main() {
    const { user } = useUser();
    const [ firstPokemons,setFirstPokemons ] = useState<Pokemon[]>([]);

    useEffect(()=>{
        if(user){
            const data =  fetch_first_pokemon();
            const pokemons:Pokemon[] = [];
            console.log(data);
        }
    },[user]);

    return (
        <div className="bg-[url(/002_firstPokemon.png)] flex-1">
        </div>
    )
}
