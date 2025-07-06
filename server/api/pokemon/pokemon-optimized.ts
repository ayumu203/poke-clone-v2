/**
 * ポケモンデータ取得モジュール（最適化版）
 * 
 * 変更理由: パフォーマンス最適化
 * - 単一取得に加えて一括取得機能を追加
 * - キャッシュシステムの統合
 * - データベースアクセスの最適化
 * 
 * 主な改善点:
 * 1. 一括取得により複数のポケモンを1回のクエリで取得
 * 2. キャッシュチェックによりデータベースアクセスを削減
 * 3. パフォーマンス測定ログの追加
 */

import { Pokemon } from "../../types/core/pokemon";
import { pokemonCache } from "../../cache/pokemon-cache";
import { prisma } from "../../database/prisma-service";

/**
 * 単一ポケモンデータを取得（キャッシュ対応）
 * @param pokemon_id ポケモンID
 * @returns ポケモンデータまたはnull
 */
export async function getPokemon(pokemon_id: number): Promise<Pokemon> {
    // キャッシュから取得を試行
    const cachedPokemon = pokemonCache.get(pokemon_id);
    if (cachedPokemon) {
        return cachedPokemon;
    }

    // キャッシュにない場合はデータベースから取得
    const dbStartTime = Date.now();
    const data = await prisma.pokemon.findFirst({ where: { pokemon_id } });
    const dbTime = Date.now() - dbStartTime;
    console.log(`DB query getPokemon(${pokemon_id}): ${dbTime}ms`);
    
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
        
        // 取得したデータをキャッシュに保存
        pokemonCache.set(pokemon_id, pokemon);
        pokemonCache.evictIfNeeded();
        
        return pokemon;
    }
    return null;
}

/**
 * 複数ポケモンデータを一括取得（新機能）
 * 
 * 変更理由: パフォーマンス最適化
 * - 複数の個別クエリを1つのバッチクエリに統合
 * - データベースアクセス回数を大幅削減
 * - 並列処理よりも効率的なデータ取得を実現
 * 
 * @param pokemon_ids ポケモンIDの配列
 * @returns ポケモンデータの配列
 */
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
    
    console.log(`キャッシュヒット: ${cachedPokemons.length}/${pokemon_ids.length}`);
    
    // キャッシュにないものを一括取得
    let dbPokemons: Pokemon[] = [];
    if (uncachedIds.length > 0) {
        const dbStartTime = Date.now();
        
        // 一括クエリでデータベースアクセス回数を削減
        const dbData = await prisma.pokemon.findMany({
            where: {
                pokemon_id: {
                    in: uncachedIds
                }
            }
        });
        
        const dbTime = Date.now() - dbStartTime;
        console.log(`DB batch query getPokemon([${uncachedIds.join(',')}]): ${dbTime}ms`);
        
        // データベース結果をPokemon型に変換してキャッシュに保存
        dbPokemons = dbData.map((data: any) => {
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
            
            // 取得したデータをキャッシュに保存
            pokemonCache.set(data.pokemon_id, pokemon);
            
            return pokemon;
        });
        
        // キャッシュサイズが上限を超えた場合のエビクション処理
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
    console.log(`getPokemonBatch完了: ${totalTime}ms (${result.length}匹取得)`);
    
    return result;
}
