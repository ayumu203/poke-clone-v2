"use client"
import { useEffect, useState } from "react";
import { useUser } from "../../../context/userContext";
import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "../../../lib/supabase/supabase";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { usePlayer } from "../../../context/playerContext";
import { Pokemon } from "../../../type/pokemon.type";
import { fetch_first_pokemon } from "../../../lib/first_pokemon/fetch_first_pokemon";
import { TeamPokemon } from "../../../type/teamPokemon.type";
import { fetch_team_pokemon } from "../../../lib/team_pokemon/fetch_team_pokemon";
import { register_first_pokemon } from "../../../lib/first_pokemon/register_first_pokemon";
import { devLog } from "../../utils/dev-utils";

// export const deleteall = async():Promise<void> =>{
//     const base_url = process.env.NEXT_PUBLIC_BASE_URL;
//     console.log(base_url);
//     const url = `${base_url}/delete`;
//     try {
//         const response = await fetch(url,{
//             method:"POST",
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//         });
//         if (!response.ok) {
//             throw new Error('response error');
//         }
//         const data = await response.json();
//         return data;
//     } catch(error){
//         console.error(error);
//         throw error;
//     }
// }

export default function Home() {
    const { user } = useUser();
    const { player } = usePlayer();
    const [ flag, setFlag ] = useState(false);
    const [ firstPokemons, setFirstPokemons ] = useState<Pokemon[]>([]);
    const [ teamPokemon, setTeamPokemon ] = useState<TeamPokemon>(null);


    // 初期ポケモンオプションデータ取得テスト
    useEffect(() => {
        const handleDelete = async() => {
            // await deleteall();
        }
        const handleFetchFirstPokemon = async() => {
            const fpks:Pokemon[] = await fetch_first_pokemon();
            setFirstPokemons(fpks);
        }
        const handleRegisterFirstPokemon = async() => {
            if(player && player.player_id){
                const pokemon:Pokemon = await register_first_pokemon(player.player_id,494);
                devLog(pokemon);
            }
        }
        const handleFetchTeamPokemon = async() => {
            if(player && player.player_id){
                const pokemon:TeamPokemon = await fetch_team_pokemon(player.player_id,0);
                setTeamPokemon(pokemon);
                devLog(pokemon);
            }
        }
        handleDelete();
        handleFetchFirstPokemon();
        handleRegisterFirstPokemon();
        handleFetchTeamPokemon();
    }, [flag, player]);

    return (
        <>
            <div className="min-h-screen flex flex-col">
                <>                
                    {!user && <>
                        <div className="flex justify-center">
                            <Auth
                                supabaseClient={supabase}
                                appearance={{ theme: ThemeSupa }}
                                providers={["google"]}
                                onlyThirdPartyProviders
                            />
                        </div>
                    </>}
                    {user && <>
                        UserId:{user.id} <br></br>
                        <button onClick={()=>{supabase.auth.signOut()}}>サインアウト</button><br></br>
                    </>}
                </>
                <br></br>
                <>
                    {!player && <>プレイヤーデータが存在しない状態</>}
                    {player && <>
                        PlayerId:{player.player_id} <br></br>
                        player:{player.name}
                    </>}
                </>
                <br></br>
                <>
                    <button onClick={()=>{if(!flag)setFlag(true); else setFlag(false);}}>フラグ切り替え</button>
                </>
                <>
                    {firstPokemons && <>
                    {firstPokemons.map((pokemon,index) => {
                        return <div key={index}>{pokemon!.name}<br></br></div>
                    })}
                    </>}
                </>
                <>
                    {!player && <>プレイヤーデータ読込中<br></br></>}
                    {player && teamPokemon && <>
                        {teamPokemon.pokemon_id}<br></br>
                        level:{teamPokemon.level}<br></br>
                    </>}
                </>
            </div>
        </>
    );
}
