"use client"

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useUser } from "./userContext";
import { Player } from "../type/player.type";
import { fetch_player } from "../lib/player/fetch_player";

type PlayerContextType = { player:Player | null };
const PlayerContext = createContext<PlayerContextType>({player:null});
export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({children}:{children:ReactNode}) =>{
    const { user } = useUser();
    const [ player,setPlayer ] = useState<Player | null>(null);

    useEffect(()=>{
        const fetchPlayer = async() => {
            if(user){
                const data = await fetch_player(user.id);
                if(data) {
                    setPlayer({ player_id: data.player_id, name: data.name });
                }
            }
        };
        fetchPlayer();
    },[user]);

    return (
        <PlayerContext.Provider value={{player}}>
            {children}
        </PlayerContext.Provider>
    )
}