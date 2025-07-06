'use client';

import React from 'react';
import { BattlePokemons } from '../../types/battle/battle-pokemons';

interface BattleFieldProps {
  battlePokemons: BattlePokemons;
}

const BattleField: React.FC<BattleFieldProps> = ({ battlePokemons }) => {
  if (!battlePokemons) {
    return <div>No Pokémon data available for battle field.</div>;
  }

  const playerPokemon = battlePokemons.PlayerBattlePokemons[0];
  const enemyPokemon = battlePokemons.EnemyBattlePokemons[0];

  return (
    <div className="battle-field">
      <div className="enemy-pokemon">
        {enemyPokemon && (
          <>
            <h3>{enemyPokemon.name}</h3>
            <p>HP: {enemyPokemon.currentHp}/{enemyPokemon.maxHp}</p>
            {/* Add enemy pokemon image here */}
          </>
        )}
      </div>
      <div className="player-pokemon">
        {playerPokemon && (
          <>
            <h3>{playerPokemon.name}</h3>
            <p>HP: {playerPokemon.currentHp}/{playerPokemon.maxHp}</p>
            {/* Add player pokemon image here */}
          </>
        )}
      </div>
    </div>
  );
};

export default BattleField;
