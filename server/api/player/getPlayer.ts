import { PrismaClient } from "@prisma/client";
import { Player } from "../../types/core/player";

const prisma = new PrismaClient();

export async function getPlayer(player_id:string):Promise<Player> {
    const data = await prisma.player.findFirst({where: {player_id} });
    if(!data)return data;
    const player:Player = {
        player_id:player_id,
        name:data.name
    };
    return player;
}
