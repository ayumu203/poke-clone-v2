'use client';

import React from 'react';
import { BattleLogs } from '../../types/battle/battle-logs';

interface BattleLogProps {
  logs: BattleLogs[];
}

const BattleLog: React.FC<BattleLogProps> = ({ logs }) => {
  return (
    <div className="battle-log">
      <h3>Battle Log</h3>
      {logs.map((log, index) => (
        <div key={index}>
          <p>{log.battleLog}</p>
          {log.playerPokemonLog && <p>Player: {log.playerPokemonLog}</p>}
          {log.enemyPokemonLog && <p>Enemy: {log.enemyPokemonLog}</p>}
        </div>
      ))}
    </div>
  );
};

export default BattleLog;
