import { devLog } from '../../../utils/dev-utils';

interface ActionPanelProps {
  onAction: (action: string) => void;
  loading: boolean;
}

function ActionPanel({ onAction, loading }: ActionPanelProps) {
  return (
    <div className="action-panel">
      <div className="action-title">どうする？</div>
      <div className="action-buttons">
        <button 
          className="action-button fight"
          onClick={() => {
            devLog('Fight button clicked');
            onAction('attack');
          }}
          disabled={loading}
        >
          たたかう
        </button>
        <button 
          className="action-button run"
          onClick={() => onAction('run')}
          disabled={loading}
        >
          にげる
        </button>
        <button 
          className="action-button catch"
          onClick={() => onAction('catch')}
          disabled={loading}
        >
          つかまえる
        </button>
        <button 
          className="action-button items"
          onClick={() => onAction('items')}
          disabled={loading}
        >
          どうぐ
        </button>
      </div>
      {loading && (
        <div className="action-loading">
          処理中...
        </div>
      )}
    </div>
  );
}

export default ActionPanel;
