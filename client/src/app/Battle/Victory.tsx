'use client';

import React from 'react';
import { BattleResult } from '../../types/battle/battle-result';

interface VictoryProps {
  result: BattleResult;
}

const Victory: React.FC<VictoryProps> = ({ result }) => {
  if (!result) {
    return null;
  }

  return (
    <div className="victory-screen">
      <h2>Battle End!</h2>
      {result.isFinished ? (
        <p>You {result.gainPokemon ? 'won' : 'lost'}!</p>
      ) : (
        <p>Battle continues...</p>
      )}
      {result.gainExp && <p>Gained Experience: {result.gainExp}</p>}
      {result.gainPokemon && (
        <p>Captured Pokémon: {result.gainPokemon.name}</p>
      )}
      <p>Total Turns: {result.totalTurn}</p>
    </div>
  );
};

export default Victory;
