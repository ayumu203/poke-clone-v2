import { BattleResult as BattleResultType } from '../../../types/battle/battle-result';
import Image from 'next/image';

interface BattleResultProps {
  battleResult: BattleResultType;
  onReturn: () => void;
}

function BattleResult({ battleResult, onReturn }: BattleResultProps) {
  if (!battleResult) {
    return (
      <div className="battle-result">
        <div className="result-title">バトル終了</div>
        <button className="return-button" onClick={onReturn}>
          戻る
        </button>
      </div>
    );
  }

  return (
    <div className="battle-result">
      <div className="result-title">バトル終了！</div>
      
      <div className="result-content">
        <div className="result-stats">
          <div className="stat-item">
            <span className="stat-label">ターン数:</span>
            <span className="stat-value">{battleResult.totalTurn}</span>
          </div>
          
          {battleResult.gainExp > 0 && (
            <div className="stat-item">
              <span className="stat-label">獲得経験値:</span>
              <span className="stat-value">{battleResult.gainExp} EXP</span>
            </div>
          )}
        </div>

        {battleResult.gainPokemon && (
          <div className="gained-pokemon">
            <div className="gained-title">新しいポケモンを捕まえた！</div>
            <div className="pokemon-card">
              <Image 
                src={battleResult.gainPokemon.image} 
                alt={battleResult.gainPokemon.name}
                width={96}
                height={96}
                className="pokemon-image"
                onError={(e) => {
                  e.currentTarget.src = '/pokemon-placeholder.png';
                }}
              />
              <div className="pokemon-details">
                <div className="pokemon-name">{battleResult.gainPokemon.name}</div>
                <div className="pokemon-level">Lv.{battleResult.gainPokemon.level}</div>
                <div className="pokemon-types">
                  <span className="pokemon-type">{battleResult.gainPokemon.type1}</span>
                  {battleResult.gainPokemon.type2 && (
                    <span className="pokemon-type">{battleResult.gainPokemon.type2}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <button className="return-button" onClick={onReturn}>
        戻る
      </button>
    </div>
  );
}

export default BattleResult;
