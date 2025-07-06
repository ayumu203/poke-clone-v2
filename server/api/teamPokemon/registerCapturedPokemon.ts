import { PrismaClient } from "@prisma/client";
import { getPokemon } from "../pokemon/pokemon";
import { getMove } from "../move/move";
import { MAX_MOVE_COUNT } from "../../const/move_count.const";
import { Move } from "../../types/core/move";
import { Pokemon } from "../../types/core/pokemon";
import { TeamPokemon } from "../../types/core/team-pokemon";
import { BattlePokemon } from "../../types/battle/battle-pokemon";

const prisma = new PrismaClient();

/**
 * 捕獲したポケモンをチームに登録する
 */
export async function registerCapturedPokemon(
    player_id: string, 
    capturedPokemon: BattlePokemon
): Promise<TeamPokemon | null> {
    try {
        // capturedPokemonのnullチェック
        if (!capturedPokemon) {
            console.log(`❌ Captured Pokemon is null or undefined`);
            return null;
        }
        // 現在のチームポケモン数を確認
        const currentTeamCount = await prisma.teamPokemon.count({
            where: { player_id }
        });

        console.log(`📊 Current team count for player ${player_id}: ${currentTeamCount}`);

        // 手持ちが7体以上の場合はボックス機能が未実装なので今は登録しない
        // 実際のゲームでは手持ち6体+捕獲時の一時スロットがあるが、今回は7体未満の場合のみ追加
        if (currentTeamCount >= 7) {
            console.log(`❌ Team is full (${currentTeamCount}/7). Cannot add new Pokemon to team.`);
            return null;
        }

        // 次の空いているインデックスを取得
        const nextIndex = await getNextAvailableIndex(player_id);
        if (nextIndex === -1) {
            console.log(`❌ No available index found for player ${player_id}`);
            return null;
        }

        // ポケモンの技リストを取得
        const move_list: number[] = [];
        const pokemon: Pokemon = await getPokemon(capturedPokemon.pokemon_id);
        if (!pokemon) {
            throw new Error(`Pokemon with ID ${capturedPokemon.pokemon_id} not found`);
        }

        console.log(`🔍 Getting moves for Pokemon ${pokemon.name} (ID: ${capturedPokemon.pokemon_id})`);
        console.log(`🔍 Pokemon move_list:`, pokemon.move_list);

        for (let i = 0; i < MAX_MOVE_COUNT; i++) {
            if (pokemon.move_list && pokemon.move_list[i]) {
                const move: Move = await getMove(pokemon.move_list[i]);
                if (move) {
                    move_list.push(move.move_id);
                    console.log(`✅ Move ${i}: ${move.name} (ID: ${move.move_id})`);
                } else {
                    console.log(`❌ Move ${i}: Move ID ${pokemon.move_list[i]} not found`);
                }
            } else {
                console.log(`⚠️ Move ${i}: No move ID found in pokemon.move_list[${i}]`);
            }
        }

        console.log(`🔍 Final move_list for captured Pokemon:`, move_list);

        // 捕獲したポケモンをチームに登録（レベルと経験値を保持）
        const createdPokemon = await prisma.teamPokemon.create({
            data: {
                player_id: player_id,
                index: nextIndex,
                pokemon_id: capturedPokemon.pokemon_id,
                level: capturedPokemon.level,
                exp: capturedPokemon.exp,
                move_list: move_list
            }
        });

        console.log(`✅ Captured Pokemon registered successfully: ${pokemon.name} (Level ${capturedPokemon.level}) at index ${nextIndex}`);

        // 登録されたポケモンを返す
        const teamPokemon: TeamPokemon = {
            player_id: player_id,
            index: nextIndex,
            pokemon_id: capturedPokemon.pokemon_id,
            level: capturedPokemon.level,
            exp: capturedPokemon.exp,
            move_list: move_list,
        };

        return teamPokemon;

    } catch (error) {
        console.error(`❌ Error registering captured Pokemon:`, error);
        throw error;
    }
}

/**
 * 次の空いているインデックスを取得
 */
async function getNextAvailableIndex(player_id: string): Promise<number> {
    // インデックス0-6の中で空いている最小の番号を取得（0は最初のポケモン用だが、捕獲時にも使用可能）
    for (let i = 0; i <= 6; i++) {
        const existing = await prisma.teamPokemon.findFirst({
            where: { player_id, index: i }
        });
        if (!existing) {
            return i;
        }
    }
    return -1; // 空きがない
}
