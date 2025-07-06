import { Move } from '../../../../type/move.type';
import { devLog } from '../../../utils/dev-utils';

interface MoveSelectionProps {
  moves: Move[];
  onMoveSelect: (moveId: number) => void;
  onBack: () => void;
  loading: boolean;
}

function MoveSelection({ moves, onMoveSelect, onBack, loading }: MoveSelectionProps) {
  devLog('MoveSelection rendered with moves:', moves);
  devLog('MoveSelection onMoveSelect function:', onMoveSelect);
  
  const getTypeColor = (type: string): string => {
    const typeColors: { [key: string]: string } = {
      'normal': '#A8A878',
      'fire': '#F08030',
      'water': '#6890F0',
      'electric': '#F8D030',
      'grass': '#78C850',
      'ice': '#98D8D8',
      'fighting': '#C03028',
      'poison': '#A040A0',
      'ground': '#E0C068',
      'flying': '#A890F0',
      'psychic': '#F85888',
      'bug': '#A8B820',
      'rock': '#B8A038',
      'ghost': '#705898',
      'dragon': '#7038F8',
      'dark': '#705848',
      'steel': '#B8B8D0',
      'fairy': '#EE99AC'
    };
    return typeColors[type.toLowerCase()] || '#68A090';
  };

  return (
    <div className="move-selection">
      <div className="move-selection-title">技を選んでください</div>
      <div className="moves-grid">
        {moves.map((move, index) => {
          devLog('Rendering move:', move, 'at index:', index);
          return move && (
            <button
              key={move.move_id || index}
              className="move-button"
              onClick={() => {
                devLog('Move button clicked:', move.move_id, move.name);
                onMoveSelect(move.move_id);
              }}
              disabled={loading}
              style={{ 
                backgroundColor: getTypeColor(move.type),
                borderColor: getTypeColor(move.type)
              }}
            >
              <div className="move-name">{move.name}</div>
              <div className="move-details">
                <span className="move-type">{move.type}</span>
                <span className="move-power">威力: {move.power || '-'}</span>
                <span className="move-pp">PP: {move.pp}</span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="move-selection-actions">
        <button 
          className="back-button"
          onClick={onBack}
          disabled={loading}
        >
          もどる
        </button>
      </div>
      {loading && (
        <div className="move-loading">
          技を使用中...
        </div>
      )}
    </div>
  );
}

export default MoveSelection;
