
import { Pokemon } from "../../types/core/pokemon";
import { pokemonCache } from "../../cache/pokemon-cache";
import { prisma } from "../../database/prisma-service";

// 単一ポケモン取得（既存）
export async function getPokemon(pokemon_id: number): Promise<Pokemon> {
    // キャッシュから取得を試行
    const cachedPokemon = pokemonCache.get(pokemon_id);
    if (cachedPokemon) {
        return cachedPokemon;
    }

    const dbStartTime = Date.now();
    const data = await prisma.pokemon.findFirst({ where: { pokemon_id } });
    const dbTime = Date.now() - dbStartTime;
    console.log(`🗄️ DB query getPokemon(${pokemon_id}): ${dbTime}ms`);
    
    if (data) {
        const pokemon: Pokemon = {
            pokemon_id: pokemon_id,
            name: data.name,
            type1: data.type1,
            type2: data.type2,
            front_image: data.front_image,
            back_image: data.back_image,
            base_hp: data.base_hp,
            base_attack: data.base_attack,
            base_defence: data.base_defence,
            base_special_attack: data.base_special_attack,
            base_special_defence: data.base_special_defence,
            base_speed: data.base_speed,
            evolve_level: data.evolve_level,
            move_list: data.move_list,
        }
        
        // キャッシュに保存
        pokemonCache.set(pokemon_id, pokemon);
        pokemonCache.evictIfNeeded();
        
        return pokemon;
    }
    return null;
}

// 複数ポケモン一括取得（新規）
export async function getPokemonBatch(pokemon_ids: number[]): Promise<Pokemon[]> {
    const startTime = Date.now();
    
    // キャッシュから取得可能なものを先にチェック
    const cachedPokemons: Pokemon[] = [];
    const uncachedIds: number[] = [];
    
    for (const id of pokemon_ids) {
        const cached = pokemonCache.get(id);
        if (cached) {
            cachedPokemons.push(cached);
        } else {
            uncachedIds.push(id);
        }
    }
    
    console.log(`🎯 キャッシュヒット: ${cachedPokemons.length}/${pokemon_ids.length}`);
    
    // キャッシュにないものを一括取得
    let dbPokemons: Pokemon[] = [];
    if (uncachedIds.length > 0) {
        const dbStartTime = Date.now();
        const dbData = await prisma.pokemon.findMany({
            where: {
                pokemon_id: {
                    in: uncachedIds
                }
            }
        });
        const dbTime = Date.now() - dbStartTime;
        console.log(`🗄️ DB batch query getPokemon([${uncachedIds.join(',')}]): ${dbTime}ms`);
        
        // データベース結果をPokemon型に変換してキャッシュに保存
        dbPokemons = dbData.map(data => {
            const pokemon: Pokemon = {
                pokemon_id: data.pokemon_id,
                name: data.name,
                type1: data.type1,
                type2: data.type2,
                front_image: data.front_image,
                back_image: data.back_image,
                base_hp: data.base_hp,
                base_attack: data.base_attack,
                base_defence: data.base_defence,
                base_special_attack: data.base_special_attack,
                base_special_defence: data.base_special_defence,
                base_speed: data.base_speed,
                evolve_level: data.evolve_level,
                move_list: data.move_list,
            };
            
            // キャッシュに保存
            pokemonCache.set(data.pokemon_id, pokemon);
            
            return pokemon;
        });
        
        pokemonCache.evictIfNeeded();
    }
    
    // 結果を元の順序で結合
    const result: Pokemon[] = [];
    for (const id of pokemon_ids) {
        const pokemon = [...cachedPokemons, ...dbPokemons].find(p => p && p.pokemon_id === id);
        if (pokemon) {
            result.push(pokemon);
        }
    }
    
    const totalTime = Date.now() - startTime;
    console.log(`⚡ getPokemonBatch完了: ${totalTime}ms (${result.length}匹取得)`);
    
    return result;
}
