import { PrismaClient } from "@prisma/client";
import { getPokemon } from "../pokemon/pokemon";
import { getMove } from "../move/move";
import { MAX_MOVE_COUNT } from "../../const/move_count.const";
import { Move } from "../../types/core/move";
import { Pokemon } from "../../types/core/pokemon";
import { TeamPokemon } from "../../types/core/team-pokemon";

const prisma = new PrismaClient();

export async function registerTeamPokemon(player_id: string, pokemon_id: number, index: number): Promise<TeamPokemon> {
    const move_list: number[] = [];
    const pokemon:Pokemon = await getPokemon(pokemon_id);
    if (!pokemon) {
        throw new Error("ポケモンが見つかりません");
    }
    else {
        console.log(`🔍 Getting moves for first Pokemon ${pokemon.name} (ID: ${pokemon_id})`);
        console.log(`🔍 Pokemon move_list:`, pokemon.move_list);
        
        for (let i = 0; i < MAX_MOVE_COUNT; i++) {
            if (pokemon.move_list && pokemon.move_list[i]) {
                const move: Move = await getMove(pokemon.move_list[i]);
                if (move) {
                    move_list.push(move.move_id);
                    console.log(`✅ Move ${i}: ${move.name} (ID: ${move.move_id})`);
                } else {
                    console.log(`❌ Move ${i}: Move ID ${pokemon.move_list[i]} not found`);
                }
            } else {
                console.log(`⚠️ Move ${i}: No move ID found in pokemon.move_list[${i}]`);
            }
        }
        
        console.log(`🔍 Final move_list for first Pokemon:`, move_list);
    }
    await prisma.teamPokemon.create({
        data: {
            player_id: player_id,
            index: index,
            pokemon_id: pokemon_id,
            level: 1,
            exp: 0,
            move_list: move_list
        }
    });

    const teamPokemon: TeamPokemon = await prisma.teamPokemon.findFirst({ where: { player_id, index } });
    return teamPokemon;
}