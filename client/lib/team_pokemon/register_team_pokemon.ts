import { TeamPokemon } from "../../type/teamPokemon.type";

export const register_first_pokemon = async(player_id:string, pokemon_id:number, index:number):Promise<TeamPokemon> =>{
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    console.log(base_url);
    const url = `${base_url}/first-pokemon/register`;
    try {
        const response = await fetch(url,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                player_id: player_id,
                pokemon_id: pokemon_id,
                index: index
            })
        });
        if (!response.ok) {
            throw new Error('response error');
        }
        const data:TeamPokemon = await response.json();
        return data;
    } catch(error){
        console.error(error);
        throw error;
    }
}