import { PrismaClient } from "@prisma/client";
import { Pokemon } from "../../../type/pokemon.type";

import { fetchPokemonEvolveLevel, fetchPokemonInfo, fetchPokemonName } from "./fetch";
import { POKEMON_ID_BEGIN,POKEMON_ID_END } from "../../../const/pokemon_id.const";


const prisma = new PrismaClient()

// イッシュ地方のポケモンのデータをAPIで取得し,データベースに保存する
async function store_pokemon_info_from_api(){

  // pokemon_infoのすべてのレコードを削除する
  const del = await prisma.pokemon.deleteMany();
  let begin = POKEMON_ID_BEGIN;
  let end = POKEMON_ID_END;
//   for(let i = begin; i <= end; i++){
for(let i = 1; i <= 10; i++){
    const pokemon:Pokemon = await fetchPokemonInfo(i);
    console.dir(pokemon);
    const name:string = await fetchPokemonName(i);
    let evolve_level:number = await fetchPokemonEvolveLevel(i);
    if(pokemon?.pokemon_id === 550 || pokemon?.pokemon_id === 625)evolve_level = -1;

    if(pokemon){
      await prisma.pokemon.create({data:{
        pokemon_id:pokemon.pokemon_id,
        name:name,
        type1:pokemon.type1,
        type2:pokemon.type2,
        front_image:pokemon.front_image,
        back_image:pokemon.back_image,
        base_hp:pokemon.base_hp,
        base_attack:pokemon.base_attack,
        base_defence:pokemon.base_defence,
        base_special_attack:pokemon.base_special_attack,
        base_special_defence:pokemon.base_special_defence,
        base_speed:pokemon.base_speed,
        evolve_level:evolve_level,
        move_list:pokemon.move_list,
      }}); 
    }
  }
}

// サーバでしか動かさないためメイン関数を用意
async function main() {
  try {
    store_pokemon_info_from_api();
  } catch(err){
    console.error(err);
  }
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
})