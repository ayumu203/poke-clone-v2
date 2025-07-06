const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getMoves() {
  try {
    const statusMoves = await prisma.move.findMany({
      where: { category: 'status' },
      orderBy: { move_id: 'asc' }
    });
    
    console.log('=== 補助技一覧 ===');
    console.log(`総数: ${statusMoves.length}技`);
    console.log('');
    
    statusMoves.forEach(move => {
      console.log(`ID ${move.move_id}: ${move.name} (${move.type}タイプ)`);
      
      if (move.stat_name && move.stat_name.length > 0) {
        console.log(`  能力変化: ${move.stat_name.join(', ')} (${move.stat_rank.join(', ')})`);
        console.log(`  対象: ${move.stat_target}, 確率: ${move.stat_chance}%`);
      }
      
      if (move.ailment && move.ailment !== 'none') {
        console.log(`  状態異常: ${move.ailment} (確率: ${move.ailment_chance}%)`);
      }
      
      if (move.healing > 0) {
        console.log(`  回復量: ${move.healing}`);
      }
      
      if (move.drain > 0) {
        console.log(`  吸収量: ${move.drain}`);
      }
      
      console.log('');
    });
    
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getMoves();
