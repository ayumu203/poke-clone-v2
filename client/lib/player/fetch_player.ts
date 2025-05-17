import { Player } from "../../type/player.type";

export const fetch_player = async(player_id:string):Promise<Player> =>{
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    console.log(base_url);
    const url = `${base_url}/player`;
    try {
        const response = await fetch(url,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({player_id:player_id}),
        });
        if (!response.ok) {
            throw new Error('response error');
        }
        const data:Player = await response.json();
        return data;
    } catch(error){
        console.error(error);
        throw error;
    }
}