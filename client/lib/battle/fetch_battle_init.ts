import { BattleInfo } from '../../src/types/battle/battle-info';
import { apiClient } from '../api/api-client';
import { devLog } from '../../src/utils/dev-utils';

export async function fetchBattleInit(playerId: string): Promise<BattleInfo> {
  const response = await apiClient.post<BattleInfo>('/battle/init', {
    player_id: playerId
  });
  
  devLog('Battle init response:', response.data);
  return response.data;
}
