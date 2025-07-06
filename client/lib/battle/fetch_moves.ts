import { Move } from '../../type/move.type';
import { apiClient } from '../api/api-client';
import { devError } from '../../src/utils/dev-utils';

export async function fetchMovesByIds(moveIds: number[]): Promise<Move[]> {
  try {
    const moves: Move[] = [];
    
    for (const moveId of moveIds) {
      const response = await apiClient.post<Move>('/data/move', {
        move_id: moveId
      });
      moves.push(response.data);
    }
    
    return moves;
  } catch (error) {
    devError('Failed to fetch moves:', error);
    return [];
  }
}
