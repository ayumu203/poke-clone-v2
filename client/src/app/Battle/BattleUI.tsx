'use client';

import React from 'react';

interface BattleUIProps {
  onAction: (action: string, value: string) => void;
}

const BattleUI: React.FC<BattleUIProps> = ({ onAction }) => {
  return (
    <div className="battle-ui">
      <button onClick={() => onAction('attack', 'normal')}>Attack</button>
      <button onClick={() => onAction('run', '')}>Run</button>
    </div>
  );
};

export default BattleUI;
