import React, { useEffect, useState } from 'react'
import { useUser } from '../../../context/userContext';
import { fetch_first_pokemon } from '../../../lib/first_pokemon/fetch_first_pokemon';
import { usePlayer } from '../../../context/playerContext';
import { Pokemon } from '../../../type/pokemon.type';
import PokemonInfo from './PokemonInfo';
import { register_first_pokemon } from '../../../lib/first_pokemon/register_first_pokemon';
import { is_first_pokemon } from '../../../lib/first_pokemon/is_first_pokemon';
import { useRouter } from 'next/navigation';

export default function Main() {
    const { user } = useUser();
    const { player } = usePlayer();
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [exist, setExist] = useState<boolean>(false);
    const [selectId, setSelectId] = useState<number>(-1);
    const [isSubmitted, setIssubmitted] = useState<boolean>(false);
    const router = useRouter();

    function handleSelect(id: number): void {
        setSelectId(id);
    }

    useEffect(() => {
        const handleExist = async () => {
            const ex = await is_first_pokemon(player!.player_id);
            if (!ex) setExist(false);
            else setExist(true);
        }
        const handleFetchFirstPokemon = async (): Promise<void> => {
            const data = await fetch_first_pokemon();
            setPokemons(data);
        }

        if (user && player) {
            handleExist();
            if (exist) router.push("/");
            else handleFetchFirstPokemon();
        }
    }, [user, player]);

    useEffect(() => {
        if (isSubmitted) router.push("/");
    }, [isSubmitted]);


    return (
        <div className="bg-[url(/002_firstPokemon.png)] flex-1 text-orange-400 p-4">
            <span>選択中のポケモン:</span>{selectId && pokemons.map((pokemon: Pokemon, index: number) => {
                let name: string = "";
                if (pokemon?.pokemon_id === selectId) name = pokemon.name;
                return name;
            })}
            {pokemons.length < 3 && <>データの取得中</>}
            {pokemons.length >= 3 && <>
                {pokemons.map((pokemon, index) => {
                    return (<div className='flex flex-row justify-center items-center gap-6 flex-wrap' key={index}><PokemonInfo pokemon={pokemon} onSelect={handleSelect} /></div>)
                })}
                {
                    !isSubmitted &&
                    <>
                        <div className="flex justify-center mt-4">

                            <button onClick={async () => { register_first_pokemon(player!.player_id, selectId); setIssubmitted(true) }} className="bg-blue-500 hover:bg-grean-900 text-white font-bold py-2 px-4 rounded">
                                決定
                            </button>
                        </div>
                    </>
                }
            </>}
        </div>
    )
}
