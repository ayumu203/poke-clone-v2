import { PrismaClient, Move } from "@prisma/client";

const prisma = new PrismaClient();

async function checkStatusMoves() {
  try {
    const statusMoves = await prisma.move.findMany({
      where: { category: 'status' },
      take: 200
    });
    
    console.log(`補助技データ (${statusMoves.length}件):`);
    
    statusMoves.forEach((move: Move) => {
      console.log(`ID: ${move.move_id}, 名前: ${move.name}`);
      console.log(`  能力変化対象: ${JSON.stringify(move.stat_name)}`);
      console.log(`  能力変化値: ${JSON.stringify(move.stat_rank)}`);
      console.log(`  状態異常: ${move.ailment}, 回復: ${move.healing}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStatusMoves();
