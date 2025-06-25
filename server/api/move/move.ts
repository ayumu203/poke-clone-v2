import { PrismaClient } from "@prisma/client";
import { Move } from "../../types/core/move";

const prisma = new PrismaClient();

export async function getMove(move_id:number):Promise<Move> {
    const move:Move = await prisma.move.findFirst({where: {move_id} });
    return move;
}