import { PrismaClient } from "@prisma/client";
import { TeamPokemon } from "../../type/teamPokemon.type";

const prisma = new PrismaClient();

export async function getTeamPokemon(player_id: string, index: number): Promise<TeamPokemon> {
    const data:TeamPokemon = await prisma.teamPokemon.findFirst({ where: { player_id, index } });
    if (!data) return data;
    const teamPokemon: TeamPokemon = {
        player_id: player_id,
        index: index,
        pokemon_id: data.pokemon_id,
        level: data.level,
        exp: data.exp,
        move_list: data.move_list,
    }
    return teamPokemon;
    
}
