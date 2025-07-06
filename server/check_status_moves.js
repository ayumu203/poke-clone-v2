const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getStatusMoves() {
  const moves = await prisma.move.findMany({
    where: { category: "status" }
  });
  console.log("補助技数:", moves.length);
  moves.forEach(move => {
    console.log(`${move.move_id}: ${move.name} (${move.type})`);
    if (move.stat_name?.length > 0) {
      console.log(`  能力変化: ${move.stat_name.join(", ")} (${move.stat_rank.join(", ")})`);
    }
    if (move.ailment && move.ailment !== "none") {
      console.log(`  状態異常: ${move.ailment}`);
    }
    if (move.healing > 0) {
      console.log(`  回復量: ${move.healing}`);
    }
  });
  await prisma.$disconnect();
}

getStatusMoves().catch(console.error);
