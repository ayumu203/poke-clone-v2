import { BattleInfo } from '../../src/types/battle/battle-info';
import { apiClient } from '../api/api-client';
import { devLog } from '../../src/utils/dev-utils';

export async function fetchBattleProcess(
  battleInfo: BattleInfo,
  action: string,
  value: string
): Promise<BattleInfo> {
  devLog('fetchBattleProcess called with:', { action, value });
  
  // アクション名をサーバー側の期待値に変換
  let serverActionName = action;
  if (action === 'attack') {
    serverActionName = 'fight';
  } else if (action === 'catch' || action === 'capture' || action === 'つかまえる') {
    serverActionName = 'get';
  }
  
  devLog(`🔄 Action mapping: ${action} → ${serverActionName}`);
  
  const battleAction = {
    action_name: serverActionName,
    command_id: parseInt(value) || 0
  };

  devLog('Sending battle process request:', {
    action: battleAction,
    battleInfo: battleInfo
  });

  const response = await apiClient.post<BattleInfo>('/battle/process', {
    action: battleAction,
    battleInfo: battleInfo
  });
  
  devLog('Battle process response:', response.data);
  return response.data;
}
