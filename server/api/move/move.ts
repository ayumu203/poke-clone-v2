import { PrismaClient } from "@prisma/client";
import { Move } from "../../type/move.type";

const prisma = new PrismaClient();

export async function move_getter(move_id:number):Promise<Move> {
    const move:Move = await prisma.move.findFirst({where: {move_id} });
    if(!move)return move;
    return move;
}