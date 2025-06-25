import { Pokemon } from "../../../types/core/pokemon";

// 外部APIから必要データを取得するAPI
// マスタデータの変更で使用し、ユーザの使用範囲では使われない.
// ステータス取得用
const fetchStat = async (url: string, headers: HeadersInit,pokemon_id:number): Promise<Pokemon> => {
    const response = await fetch(url);
    if (!response.ok) {
    throw new Error('response error');
    }
    const data: any = await response.json();
    const move_list = [];
    for(let i = 0; i < data.moves.length; i++){
        const move_id = data.moves[i].move.url.replace(/\/+$/, "");
        const id = move_id.split("/").pop();
        if(Number(id) <= 559)move_list.push(Number(id));
    }
    const pokemon:Pokemon = {
        pokemon_id:pokemon_id,
        name:"none",
        type1:data.types[0].type.name,
        type2:data.types.length > 1 ? data.types[1].type.name : "none",
        front_image:data.sprites.versions['generation-v']['black-white'].animated.front_default,
        back_image:data.sprites.versions['generation-v']['black-white'].animated.back_default,
        base_hp:data.stats[0].base_stat,
        base_attack:data.stats[1].base_stat,
        base_defence:data.stats[2].base_stat,
        base_special_attack:data.stats[3].base_stat,
        base_special_defence:data.stats[4].base_stat,
        base_speed:data.stats[5].base_stat,
        evolve_level:-1,
        move_list: move_list,
    };
    return pokemon;
};

export const fetchPokemonInfo = async(pokemon_id:number): Promise<Pokemon> => {
    const base_status_url = `https://pokeapi.co/api/v2/pokemon/${pokemon_id}`;
    const name_url = `https://pokeapi.co/api/v2/pokemon-species/${pokemon_id}`;
    const headers = {
    'Content-Type': 'application/json',
    };

    try{
        const pokemon = await fetchStat(base_status_url,headers,pokemon_id);
        return pokemon;
    } catch(error){
        console.error('Error fetching Pokémon data:', error);
        throw error;
    }
}

// 日本語名取得
const fetchName = async (url: string, headers: HeadersInit,pokemon_id:number): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok) {
    throw new Error('response error');
    }
    const data: any = await response.json();
    const name:string = data.names[0].name;
    return name;
};


export const fetchPokemonName = async(pokemon_id:number): Promise<string> =>{
    const name_url = `https://pokeapi.co/api/v2/pokemon-species/${pokemon_id}`;
    const headers = {
    'Content-Type': 'application/json',
    };
    const name:string = await fetchName(name_url,headers,pokemon_id);
    try {
        return name;
    }   catch(error){
        throw error;
    }
}


export const fetchPokemonEvolutionChainURL = async(info_url:string, pokemon_id:number): Promise<string> => {
    const response = await fetch(info_url)
    if (!response.ok) {
    throw new Error('response error');
    }
    const data: any = await response.json();
    const url:string = data.evolution_chain.url;
    return url;
}

export const fetchPokemonEvolveLevel = async(pokemon_id:number): Promise<number> =>{
    const info_url = `https://pokeapi.co/api/v2/pokemon-species/${pokemon_id}/`;
    const evolution_chain_url = await fetchPokemonEvolutionChainURL(info_url, pokemon_id);

    try {
        const response = await fetch(evolution_chain_url);
        if (!response.ok) {
        throw new Error('response error');
        }
        const data: any = await response.json();

        let link = data.chain;
        let i = 1;
        while(isTrulyEmpty(link.evolves_to) == false){
            if(link.species.url == info_url){
                if(link.evolves_to[0].evolution_details[0].min_level !== null){
                    const evolve_level = link.evolves_to[0].evolution_details[0].min_level;
                    /*const url = link.evolves_to[0].species.replace(/\/+$/, "");
                    const id = url.split("/").pop();
                    const ret:evolveInfo = {level:evolve_level, id:id};
                    return ret;*/
                    return evolve_level;
                } else {
                    return i*20;
                }
            }
            i++;
            link = link.evolves_to[0];
        }
        return -1;
    } catch(error){
        throw error;
    }
}

function isTrulyEmpty(value: unknown): boolean {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else if (value && typeof value === "object") {
      return Object.keys(value).length === 0;
    }
    return false; // null, undefined, 文字列、数値などは空とはみなさない
  }
