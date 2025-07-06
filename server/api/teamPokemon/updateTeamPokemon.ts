import { PrismaClient } from "@prisma/client";
import { TeamPokemon } from "../../types/core/team-pokemon";

const prisma = new PrismaClient();

export async function updateTeamPokemon(
    player_id: string, 
    index: number, 
    updates: { level?: number; exp?: number }
): Promise<TeamPokemon | null> {
    try {
        const updatedTeamPokemon = await prisma.teamPokemon.update({
            where: {
                player_id_index: {
                    player_id: player_id,
                    index: index
                }
            },
            data: updates
        });

        return {
            player_id: updatedTeamPokemon.player_id,
            index: updatedTeamPokemon.index,
            pokemon_id: updatedTeamPokemon.pokemon_id,
            level: updatedTeamPokemon.level,
            exp: updatedTeamPokemon.exp,
            move_list: updatedTeamPokemon.move_list,
        };
    } catch (error) {
        console.error('TeamPokemonの更新に失敗:', error);
        return null;
    }
}
