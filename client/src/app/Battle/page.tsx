"use client";

import { useEffect, useState } from 'react';
import { usePlayer } from '../../../context/playerContext';
import { BattleInfo } from '../../types/battle/battle-info';
import { Move } from '../../../type/move.type';
import { fetchBattleInit } from '../../../lib/battle/fetch_battle_init';
import { fetchBattleProcess } from '../../../lib/battle/fetch_battle_process';
import { fetchMovesByIds } from '../../../lib/battle/fetch_moves';
import { devLog, devError } from '../../utils/dev-utils';

// デバッグ用: 関数が正しくインポートされているかチェック
devLog('fetchBattleProcess imported:', typeof fetchBattleProcess);
devLog('fetchBattleProcess function:', fetchBattleProcess);
import { 
  BattleField, 
  ActionPanel, 
  MoveSelection, 
  BattleLog, 
  BattleResult 
} from './components';
import './styles/battle.css';
import './styles/globals-override.css';

type BattleState = 'action' | 'move-selection' | 'log' | 'result';

export default function BattlePage() {
  const { player } = usePlayer();
  const [battleInfo, setBattleInfo] = useState<BattleInfo | null>(null);
  const [battleState, setBattleState] = useState<BattleState>('action');
  const [playerMoves, setPlayerMoves] = useState<Move[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [autoProgressTimeout, setAutoProgressTimeout] = useState<NodeJS.Timeout | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // 強制更新用の関数
  const triggerForceUpdate = () => {
    setForceUpdate(prev => prev + 1);
  };

  // 背景画像をランダムに選択
  useEffect(() => {
    const backgroundImages = [
      '/001_home.png',
      '/002_firstPokemon.png', 
      '/003_beach.png'
    ];
    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    setBackgroundImage(randomImage);
  }, []);

  useEffect(() => {
    const initBattle = async () => {
      if (!player?.player_id) return;
      
      try {
        setLoading(true);
        const battleData = await fetchBattleInit(player.player_id);
        setBattleInfo(battleData);
        
        // 初期化時は先頭ポケモンの技を設定（後で動的に更新）
        if (battleData.battlePokemons?.PlayerBattlePokemons?.[0]?.move_list) {
          const moves = await fetchMovesByIds(battleData.battlePokemons.PlayerBattlePokemons[0].move_list);
          setPlayerMoves(moves);
        }
      } catch (err) {
        setError('バトルの初期化に失敗しました');
        devError('Battle init error:', err);
      } finally {
        setLoading(false);
      }
    };

    initBattle();
  }, [player]);

  // バトル情報が更新されたときに現在アクティブなポケモンの技を更新
  useEffect(() => {
    const updateActivePokemonMoves = async () => {
      if (!battleInfo?.battlePokemons?.PlayerBattlePokemons) return;
      
      // 現在アクティブなポケモンを特定（HP > 0の最初のポケモン）
      const activePlayerPokemon = battleInfo.battlePokemons.PlayerBattlePokemons.find(
        pokemon => pokemon && pokemon.current_hp > 0
      );
      
      if (activePlayerPokemon?.move_list) {
        try {
          const moves = await fetchMovesByIds(activePlayerPokemon.move_list);
          setPlayerMoves(moves);
          devLog('🔄 Updated active pokemon moves:', activePlayerPokemon.name, moves);
        } catch (error) {
          devError('Error updating active pokemon moves:', error);
        }
      }
    };

    updateActivePokemonMoves();
  }, [battleInfo]);

  // コンポーネントアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      if (autoProgressTimeout) {
        clearTimeout(autoProgressTimeout);
      }
    };
  }, [autoProgressTimeout]);

  // battleInfo変更の監視（デバッグ用）
  useEffect(() => {
    devLog('BattleInfo updated:', battleInfo);
    devLog('Current battle state:', battleState);
  }, [battleInfo, battleState]);

  const handleAction = async (action: string, value?: string) => {
    devLog('handleAction called with:', { action, value });
    if (!battleInfo) return;

    try {
      setLoading(true);
      
      if (action === 'attack') {
        devLog('Attack action - switching to move selection');
        devLog('Player moves available:', playerMoves);
        setBattleState('move-selection');
        setLoading(false);
        return;
      }

      devLog('Non-attack action - calling fetchBattleProcess');
      const updatedBattleInfo = await fetchBattleProcess(battleInfo, action, value || '');
      devLog('Updated battle info after action:', updatedBattleInfo); // デバッグ用
      // 不変性を保った状態更新
      setBattleInfo({...updatedBattleInfo});
      triggerForceUpdate();
      setBattleState('log');
      
      // バトル終了チェック
      if (updatedBattleInfo.battleResult?.isFinished) {
        // バトル終了の場合、3秒後にリザルト画面へ
        const timeout = setTimeout(() => setBattleState('result'), 3000);
        setAutoProgressTimeout(timeout);
      } else {
        // バトル継続の場合、2秒後にアクション選択に戻る
        const timeout = setTimeout(() => setBattleState('action'), 2000);
        setAutoProgressTimeout(timeout);
      }
    } catch (err) {
      setError('アクションの実行に失敗しました');
      devError('Battle action error:', err);
    } finally {
      if (action !== 'attack') {
        setLoading(false);
      }
    }
  };

  const handleMoveSelect = async (moveId: number) => {
    devLog('=== handleMoveSelect START ===');
    devLog('moveId:', moveId);
    devLog('battleInfo exists:', !!battleInfo);
    
    if (!battleInfo) {
      devLog('No battleInfo, returning early');
      return;
    }

    // 現在戦闘中のポケモンを取得（HP > 0の最初のポケモン）
    const playerPokemons = battleInfo.battlePokemons?.PlayerBattlePokemons;
    if (!playerPokemons || playerPokemons.length === 0) {
      devError('Player pokemon list not found');
      return;
    }

    // 現在戦闘中のポケモンを特定（HP > 0の最初のポケモン）
    const currentPlayerPokemon = playerPokemons.find(pokemon => pokemon && pokemon.current_hp > 0);
    if (!currentPlayerPokemon?.move_list) {
      devError('Current active player pokemon or move_list not found');
      return;
    }

    devLog('🔍 Current Active Pokemon details:');
    devLog('- Name:', currentPlayerPokemon.name);
    devLog('- Pokemon ID:', currentPlayerPokemon.pokemon_id);
    devLog('- Index:', currentPlayerPokemon.pokemon_index);
    devLog('- HP:', `${currentPlayerPokemon.current_hp}/${currentPlayerPokemon.max_hp}`);
    devLog('- Move list:', currentPlayerPokemon.move_list);
    devLog('- Searching for move ID:', moveId);

    const commandId = currentPlayerPokemon.move_list.indexOf(moveId);
    if (commandId === -1) {
      devError('❌ Move ID not found in current active pokemon move list:', moveId);
      devError('Current active pokemon:', currentPlayerPokemon.name);
      devError('Available moves in list:', currentPlayerPokemon.move_list);
      return;
    }

    devLog('handleMoveSelect called with moveId:', moveId, 'converted to commandId:', commandId);
    devLog('Current active pokemon move list:', currentPlayerPokemon.move_list);

    try {
      devLog('Setting loading to true...');
      setLoading(true);
      
      devLog('About to call fetchBattleProcess...');
      devLog('Calling fetchBattleProcess with:', {
        battleInfo,
        action: 'attack',
        value: commandId.toString()
      });
      
      const updatedBattleInfo = await fetchBattleProcess(battleInfo, 'attack', commandId.toString());
      devLog('fetchBattleProcess completed successfully');
      devLog('Updated battle info after move selection:', updatedBattleInfo);
      
      // 詳細なAPIレスポンス内容の確認
      devLog('=== DETAILED API RESPONSE ===');
      devLog('battlePokemons:', JSON.stringify(updatedBattleInfo.battlePokemons, null, 2));
      devLog('battleResult:', JSON.stringify(updatedBattleInfo.battleResult, null, 2));
      devLog('battleLogs:', JSON.stringify(updatedBattleInfo.battleLogs, null, 2));
      devLog('============================');
      // 不変性を保った状態更新
      setBattleInfo({...updatedBattleInfo});
      triggerForceUpdate();
      setBattleState('log');
      
      // バトル終了チェック
      if (updatedBattleInfo.battleResult?.isFinished) {
        // バトル終了の場合、3秒後にリザルト画面へ
        const timeout = setTimeout(() => setBattleState('result'), 3000);
        setAutoProgressTimeout(timeout);
      } else {
        // バトル継続の場合、2秒後にアクション選択に戻る
        const timeout = setTimeout(() => setBattleState('action'), 2000);
        setAutoProgressTimeout(timeout);
      }
    } catch (err) {
      devLog('=== ERROR in handleMoveSelect ===');
      devLog('Error object:', err);
      devLog('Error message:', err instanceof Error ? err.message : 'Unknown error');
      devLog('Error stack:', err instanceof Error ? err.stack : 'No stack trace');
      setError('技の使用に失敗しました');
      devError('Move selection error:', err);
    } finally {
      devLog('handleMoveSelect finally block');
      setLoading(false);
    }
  };

  const handleLogContinue = () => {
    // 自動進行のタイマーをクリア
    if (autoProgressTimeout) {
      clearTimeout(autoProgressTimeout);
      setAutoProgressTimeout(null);
    }
    
    if (battleInfo?.battleResult?.isFinished) {
      setBattleState('result');
    } else {
      // ログを表示した後、次のターンのアクション選択に戻る
      setBattleState('action');
    }
  };

  const handleBackToAction = () => {
    setBattleState('action');
  };

  if (loading && !battleInfo) {
    return (
      <div className="battle-container loading">
        <div className="loading-text">バトルを準備中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="battle-container error">
        <div className="error-text">{error}</div>
      </div>
    );
  }

  if (!battleInfo || !battleInfo.battlePokemons) {
    return (
      <div className="battle-container error">
        <div className="error-text">バトルデータが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="battle-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="battle-field-area">
        <BattleField 
          key={`battle-field-${battleInfo.battleResult?.totalTurn || 0}-${forceUpdate}`}
          battlePokemons={battleInfo.battlePokemons}
          backgroundImage={backgroundImage}
        />
      </div>
      
      <div className="battle-action-area">
        {battleState === 'action' && (
          <ActionPanel 
            onAction={handleAction}
            loading={loading}
          />
        )}
        
        {battleState === 'move-selection' && (
          <>
            <MoveSelection 
              moves={playerMoves}
              onMoveSelect={handleMoveSelect}
              onBack={handleBackToAction}
              loading={loading}
            />
          </>
        )}
        
        {battleState === 'log' && (
          <BattleLog 
            key={`battle-log-${battleInfo.battleResult?.totalTurn || 0}-${forceUpdate}`}
            logs={battleInfo.battleLogs}
            onContinue={handleLogContinue}
          />
        )}
        
        {battleState === 'result' && (
          <BattleResult 
            battleResult={battleInfo.battleResult}
            onReturn={() => window.history.back()}
          />
        )}
      </div>
    </div>
  );
}
