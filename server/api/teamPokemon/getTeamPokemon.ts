import { PrismaClient } from "@prisma/client";
import { TeamPokemon } from "../../type/teamPokemon.type";

const prisma = new PrismaClient();

export async function getTeamPokemon(player_id: string, index: number): Promise<TeamPokemon> {
    const data:TeamPokemon = await prisma.teamPokemon.findFirst({ where: { player_id, index } });
    if (!data) return data;
    return data;
    
}
