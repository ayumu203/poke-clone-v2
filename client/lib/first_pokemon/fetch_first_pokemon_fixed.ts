import { devLog, devError } from "../../src/utils/dev-utils";
import { Pokemon } from "../../type/pokemon.type";

export const fetch_first_pokemon = async():Promise<Pokemon[]> =>{
    const base_url = process.env.NEXT_PUBLIC_API_URL;
    console.log('API Base URL:', base_url);
    
    if (!base_url) {
        throw new Error('NEXT_PUBLIC_API_URL is not defined');
    }
    
    const url = `${base_url}/first-pokemon`;
    console.log('Fetching from:', url);
    
    try {
        const response = await fetch(url,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data:Pokemon[] = await response.json();
        console.log('Fetched pokemon data:', data);
        return data;
    } catch(error){
        console.error('Fetch error:', error);
        devError(error);
        throw error;
    }
}
