import { PrismaClient } from "@prisma/client";
import { Player } from "../../type/player.type";
import { isPlayer } from "./isPlayer";

const prisma = new PrismaClient();

export async function registerPlayer(player_id:string,name:string):Promise<Player> {
    const exist:Boolean = await isPlayer(player_id);
    if(!exist){
        await prisma.player.create({data: {
            player_id:player_id,
            name:name
        }})
    }
    const player:Player = await prisma.player.findFirst({where: {player_id} });
    return player;
}