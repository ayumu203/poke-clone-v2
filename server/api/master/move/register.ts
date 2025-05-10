import { PrismaClient } from "@prisma/client";
import { fetchMoveInfo } from "./fetch";
import { Move } from "../../../type/move.type";


const prisma = new PrismaClient();

// イッシュ地方のポケモンのデータをAPIで取得し,データベースに保存する
async function store_move_info_from_api() {
    // pokemon_infoのすべてのレコードを削除する
    const del = await prisma.move.deleteMany();

    for (let i = 1; i <= 559; i++) {
        const move: Move = await fetchMoveInfo(i);
        if (move) {
            let power = 0;
            let accuracy = 0;
            if (move.power !== null) power = move.power;
            if (move.accuracy !== null) accuracy = move.accuracy;
            await prisma.move.create({
                data: {
                    move_id: move.move_id,
                    category: move.category,
                    name: move.name,
                    type: move.type,
                    damage_class: move.damage_class,
                    power: power,
                    pp: move.pp / 2,
                    accuracy: accuracy,
                    priority: move.priority,
                    stat_name: move.stat_name,
                    stat_rank: move.stat_rank,
                    stat_target: move.stat_target,
                    stat_chance: move.stat_chance,
                    ailment: move.ailment,
                    ailment_chance: move.ailment_chance,
                    healing: move.healing,
                    drain: move.drain,
                    description: move.description,
                }
            })
        }
    }

}

// サーバでしか動かさないためメイン関数を用意
async function main() {
    try {
        store_move_info_from_api();
    } catch (err) {
        console.error(err);
    }
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect()
    })