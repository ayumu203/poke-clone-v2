import React, { useEffect, useState } from 'react'
import { fetch_first_pokemon } from '../../../lib/first_pokemon/fetch_first_pokemon';
import { usePlayer } from '../../../context/playerContext';
import { Pokemon } from '../../../type/pokemon.type';
import { register_first_pokemon } from '../../../lib/first_pokemon/register_first_pokemon';
import { is_first_pokemon } from '../../../lib/first_pokemon/is_first_pokemon';
import { useRouter } from 'next/navigation';
import { TeamPokemon } from '../../../type/teamPokemon.type';
import { fetch_team_pokemon } from '../../../lib/team_pokemon/fetch_team_pokemon';
import PokemonImage from './pokemonImage';
import PokemonName from './pokemonName';

export default function Main() {
    const { player } = usePlayer();
    // 手持ちにポケモンがいるかを保持
    const [ pageFlag, setPageFlag ] = useState<boolean>(false);
    // 選択可能ポケモンを保持
    const [ firstPokemons, setFirstPokemons ] = useState<Pokemon[]>([]);
    // 選択したポケモンのIDを保持
    const [ selectId, setSelectId ] = useState<number>(-1);
    // 選択を送信済みかを保持
    const [ submitFlag, setSubmitFlag ] = useState<boolean>(false);
    const router = useRouter();


    // 以下は手持ちにポケモンがいる場合の処理
    useEffect(()=>{
        const handleExistTeamPokemon = async() =>{
            if(player){
                const exist = await is_first_pokemon(player.player_id);
                if(exist)router.push("/");
                else setPageFlag(true);
            }
        }
        handleExistTeamPokemon();
    },[player]);

    // 以下は初期ポケモン登録処理
    function handleSelect(id: number): void {
        setSelectId(id);
    }

    useEffect(()=>{
        const handleFetchFirstPokemon = async() => {
            const fpks:Pokemon[] = await fetch_first_pokemon();
            setFirstPokemons(fpks);
        }
        if(player)handleFetchFirstPokemon();
    },[player]);

    const handleSubmit = () => {
        if(!submitFlag && player){
            if(selectId === 494 || selectId === 495 || selectId === 501){
                setSubmitFlag(true);
            }
        }
    }

    useEffect(()=>{
        const handleRegister = async() => {
            if(submitFlag && player){
                await register_first_pokemon(player.player_id,selectId);
                const pokemon:TeamPokemon = await fetch_team_pokemon(player.player_id,0);
                if(pokemon)router.push("/");
            }
        }
        handleRegister();
    },[submitFlag]);

    return (
        <div className="bg-[url(/002_firstPokemon.png)] flex flex-col items-center justify-center flex-1 text-white p-4">
            {submitFlag && <div className='text-[32px]'>通信中...</div>}
            {!submitFlag && pageFlag && <>            
                {/* 選択中のポケモン名を表示するコンポーネント */}
                {selectId && firstPokemons.map((pokemon: Pokemon, index: number) => {
                    let name: string = "";
                    let type: string = "";
                    if (pokemon?.pokemon_id === selectId){
                        name = pokemon.name;
                        type = pokemon.type1;
                    }
                    return <PokemonName key={index} name={name} type={type}></PokemonName>;
                })}
                {/* 選択できるポケモンを表示・クリックで選択できるコンポーネント */}
                {firstPokemons && firstPokemons.map((pokemon,index) => {
                    return <PokemonImage key={index} pokemon={pokemon} onSelect={handleSelect}></PokemonImage>
                })}

                {!submitFlag && <>            
                <button className="h-[8vh] w-32 bg-white opacity-50 hover:opacity-80 text-gray-700 text-[30px]" onClick={handleSubmit}>決定</button>
                </>}
            </>}
            {!pageFlag && <div className='text-[32px]'>データ取得中...</div>}
        </div>
    )
}
