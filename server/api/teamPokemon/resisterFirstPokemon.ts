import { PrismaClient } from "@prisma/client";
import { getPokemon } from "../pokemon/pokemon";
import { getMove } from "../move/move";
import { MAX_MOVE_COUNT } from "../../const/move_count.const";
import { Move } from "../../type/move.type";
import { Pokemon } from "../../type/pokemon.type";
import { TeamPokemon } from "../../type/teamPokemon.type";

const prisma = new PrismaClient();

export async function registerTeamPokemon(player_id: string, pokemon_id: number, index: number): Promise<TeamPokemon> {
    const move_list: number[] = [];
    const pokemon:Pokemon = await getPokemon(pokemon_id);
    if (!pokemon) {
        throw new Error("ポケモンが見つかりません");
    }
    else {
        for (let i = 0; i < MAX_MOVE_COUNT; i++) {
            const move: Move = await getMove(pokemon.move_list[i]);
            move_list.push(move!.move_id);
        }
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