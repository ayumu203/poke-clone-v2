import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function isPlayer(player_id:string):Promise<Boolean> {
    const data = await prisma.player.findFirst({where: {player_id} });
    if(!data){
        return false;
    }
    return true;
}
