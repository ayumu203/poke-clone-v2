import { Pokemon } from "../../type/pokemon.type";

export const fetch_first_pokemon = async():Promise<Pokemon[]> =>{
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    console.log(base_url);
    const url = `${base_url}/first-pokemon`;
    try {
        const response = await fetch(url,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error('response error');
        }
        const data:Pokemon[] = await response.json();
        return data;
    } catch(error){
        console.error(error);
        throw error;
    }
}