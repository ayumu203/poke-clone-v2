import { devLog, devError } from "../../src/utils/dev-utils";
import { Pokemon } from "../../type/pokemon.type";

export const fetch_pokemon = async (pokemon_id:number): Promise<Pokemon> => {
    const base_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    devLog(base_url);
    const url = `${base_url}/data/pokemon`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pokemon_id: pokemon_id
            })

        });
        if (!response.ok) {
            throw new Error('response error');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        devError(error);
        throw error;
    }
}