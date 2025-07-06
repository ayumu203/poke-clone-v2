import { BattleLogs } from '../../../types/battle/battle-logs';
import { devLog } from '../../../utils/dev-utils';

interface BattleLogProps {
  logs: BattleLogs;
  onContinue: () => void;
}

function BattleLog({ logs, onContinue }: BattleLogProps) {
  if (!logs) {
    return (
      <div className="battle-log">
        <div className="log-content">
          <div className="log-message">ログが見つかりません</div>
        </div>
        <button className="continue-button" onClick={onContinue}>
          つづける
        </button>
      </div>
    );
  }

  devLog('Battle logs:', logs); // デバッグ用

  return (
    <div className="battle-log">
      <div className="log-content">
        {logs.battleLog && (
          <div className="log-message battle-log-main">
            {logs.battleLog}
          </div>
        )}
        {logs.playerPokemonLog && (
          <div className="log-message player-log">
            {logs.playerPokemonLog}
          </div>
        )}
        {logs.enemyPokemonLog && (
          <div className="log-message enemy-log">
            {logs.enemyPokemonLog}
          </div>
        )}
      </div>
      <button className="continue-button" onClick={onContinue}>
        つづける
      </button>
    </div>
  );
}

export default BattleLog;
