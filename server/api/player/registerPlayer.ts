import { PrismaClient } from "@prisma/client";
import { Player } from "../../type/player.type";
import { isPlayer } from "./existPlayer";

const prisma = new PrismaClient();

export async function registerPlayer(player_id:string,name:string) {
    const exist:Boolean|Player = await isPlayer(player_id);
    if(!exist){
        await prisma.player.create({data: {
            player_id:player_id,
            name:name
        }})
    }
    const result = await prisma.player.findMany();
}