import { PrismaClient } from "@prisma/client";
import { isTeamPokemon } from "./isTeamPokemon";
import { getPokemon } from "../pokemon/pokemon";
import { getMove } from "../move/move";
import { MAX_MOVE_COUNT } from "../../const/move_count.const";
import { Move } from "../../type/move.type";

const prisma = new PrismaClient();

export async function registerTeamPokemon(player_id:string,pokemon_id:number,index:number):Promise<void> {
    const exist:Boolean = await isTeamPokemon(player_id,index);
    const move_list:number[] = [];
    if(!exist){
        const pokemon = await getPokemon(pokemon_id);
        if(!pokemon){
            throw new Error("ポケモンが見つかりません");
        }
        else {
            for(let i=0;i<MAX_MOVE_COUNT;i++){
                const move:Move = await getMove(pokemon.move_list[i]);
                move_list.push(move!.move_id);
            }
        }
        await prisma.teamPokemon.create({data: {
            player_id:player_id,
            index:index,
            pokemon_id:pokemon_id,
            level:1,
            exp:0,
            move_list:move_list
        }});
    }
    return ;
}