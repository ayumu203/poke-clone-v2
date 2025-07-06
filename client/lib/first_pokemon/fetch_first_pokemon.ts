import { devLog, devError } from "../../src/utils/dev-utils";
import { Pokemon } from "../../type/pokemon.type";

export const fetch_first_pokemon = async():Promise<Pokemon[]> =>{
    const base_url = process.env.NEXT_PUBLIC_API_URL || 'https://poke-clone-server-so62bfi3va-an.a.run.app';
    devLog(`API URL: ${base_url}`);
    const url = `${base_url}/first-pokemon`;
    try {
        const response = await fetch(url,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            const errorMsg = `HTTP ${response.status}: ${errorText}`;
            devError(errorMsg);
            throw new Error(errorMsg);
        }
        const data:Pokemon[] = await response.json();
        return data;
    } catch(error){
        devError('fetch_first_pokemon error:', error);
        throw error;
    }
}