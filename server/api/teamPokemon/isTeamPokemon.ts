import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function isTeamPokemon(player_id:string,index:number):Promise<Boolean> {
    const data = await prisma.teamPokemon.findFirst({where: {player_id,index} });
    if(!data){
        return false;
    }
    return true;
}
