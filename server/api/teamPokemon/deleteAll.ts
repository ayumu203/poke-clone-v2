import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function deleteALLTeamPokemon():Promise<void> {
    await prisma.teamPokemon.deleteMany();
    return ;
}
