import { BattlePokemons } from '../../../types/battle/battle-pokemons';
import { devLog } from '../../../utils/dev-utils';
import './PokemonDisplay.css';

interface BattleFieldProps {
  battlePokemons: BattlePokemons;
  backgroundImage: string;
}

function BattleField({ battlePokemons, backgroundImage }: BattleFieldProps) {
  const playerPokemon = battlePokemons?.PlayerBattlePokemons?.[0];
  const enemyPokemon = battlePokemons?.EnemyBattlePokemons?.[0];

  // デバッグ用
  devLog('BattleField - Player Pokemon:', playerPokemon);
  devLog('BattleField - Enemy Pokemon:', enemyPokemon);

  if (!playerPokemon || !enemyPokemon) {
    return (
      <div className="battle-field">
        <div className="no-pokemon">ポケモンが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="battle-field" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="battle-field-overlay">
        {/* 相手のポケモン */}
        <div className="enemy-pokemon-area">
          <div className="pokemon-info enemy">
            <div className="pokemon-name">{enemyPokemon.name}</div>
            <div className="pokemon-level">Lv.{enemyPokemon.level}</div>
            <div className="hp-bar-container">
              <div className="hp-label">HP</div>
              <div className="hp-bar">
                <div 
                  className="hp-fill"
                  style={{ 
                    width: `${Math.floor((enemyPokemon.current_hp / enemyPokemon.max_hp) * 100)}%`,
                    backgroundColor: getHPBarColor(enemyPokemon.current_hp / enemyPokemon.max_hp),
                    transition: 'width 0.8s ease-in-out, background-color 0.3s ease'
                  }}
                />
              </div>
            </div>
            {enemyPokemon.ailment && enemyPokemon.ailment !== 'normal' && (
              <div className="ailment-status">{enemyPokemon.ailment}</div>
            )}
          </div>
          <div className="pokemon-sprite enemy">
            <img 
              src={enemyPokemon.image} 
              alt={enemyPokemon.name}
              onError={(e) => {
                e.currentTarget.src = '/pokemon-placeholder.png';
              }}
            />
          </div>
        </div>

        {/* プレイヤーのポケモン */}
        <div className="player-pokemon-area">
          <div className="pokemon-sprite player">
            <img 
              src={playerPokemon.image} 
              alt={playerPokemon.name}
              onError={(e) => {
                e.currentTarget.src = '/pokemon-placeholder.png';
              }}
            />
          </div>
          <div className="pokemon-info player">
            <div className="pokemon-name">{playerPokemon.name}</div>
            <div className="pokemon-level">Lv.{playerPokemon.level}</div>
            <div className="hp-bar-container">
              <div className="hp-label">HP</div>
              <div className="hp-bar">
                <div 
                  className="hp-fill"
                  style={{ 
                    width: `${Math.floor((playerPokemon.current_hp / playerPokemon.max_hp) * 100)}%`,
                    backgroundColor: getHPBarColor(playerPokemon.current_hp / playerPokemon.max_hp),
                    transition: 'width 0.8s ease-in-out, background-color 0.3s ease'
                  }}
                />
              </div>
              <div className="hp-text">
                {Math.floor(playerPokemon.current_hp)}/{Math.floor(playerPokemon.max_hp)}
              </div>
            </div>
            {playerPokemon.ailment && playerPokemon.ailment !== 'normal' && (
              <div className="ailment-status">{playerPokemon.ailment}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getHPBarColor(hpRatio: number): string {
  if (hpRatio > 0.5) return '#4ade80'; // 緑
  if (hpRatio > 0.2) return '#fbbf24'; // 黄
  return '#ef4444'; // 赤
}

export default BattleField;
