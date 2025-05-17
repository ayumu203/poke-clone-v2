import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function deleteALLPlayer():Promise<void> {
    await prisma.player.deleteMany();
    return ;
}
