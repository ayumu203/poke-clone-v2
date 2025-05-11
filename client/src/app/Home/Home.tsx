import React from 'react'
import { usePlayer } from '../../../context/playerContext';
import { supabase } from '../../../lib/supabase/supabase';
import { useRouter } from 'next/navigation';

export default function Main() {
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/signIn");

    }

    return (
        <div className="bg-[url(/001_home.png)] flex-1">
            {/* {player?.player_id} <br />
            {player?.name} <br /> */}
            {/* <button onClick={handleSignOut}>サインアウト</button> */}
            <button
                onClick={handleSignOut}
                className="h-[8vh] bg-black opacity-30 text-white text-[30px]">
                ログアウト
            </button>
            <button
                onClick={() => { router.push("/PokemonInfo") }}
                style={{
                    position: "absolute",
                    top: "30%",
                    left: "48%"
                }}
                className="h-[8vh] bg-green-800 opacity-25 text-white text-[30px]"
            >
                ポケモン
            </button>
            <button
                onClick={() => { router.push("/WildBattle") }}
                style={{
                    position: "absolute",
                    top: "20%",
                    left: "65%"
                }}
                className="h-[8vh] bg-orange-450 opacity-60 text-white text-[30px]"
            >
                サファリ
            </button>

        </div>

    )
}
