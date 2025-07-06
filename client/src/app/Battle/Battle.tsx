'use client';

import React, { useEffect, useState } from 'react';
import { BattleInfo, BattleLogs, BattlePokemons, BattleResult } from '../../types/battle/battle-info';
import { fetchBattleInit } from '@/lib/battle/fetch_battle_init';
import { useUser } from '@/context/userContext';
import { fetchBattleProcess } from '@/lib/battle/fetch_battle_process';
import BattleField from './BattleField';
import BattleLog from './BattleLog';
import BattleUI from './BattleUI';
import Victory from './Victory';

const Battle: React.FC = () => {
  const { user } = useUser();

  const [battleInfo, setBattleInfo] = useState<BattleInfo | null>(null);
  const [battleLogs, setBattleLogs] = useState<BattleLogs[]>([]);
  const [battlePokemons, setBattlePokemons] = useState<BattlePokemons | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initBattle = async () => {
      try {
        setLoading(true);
        const data = await fetchBattleInit(user.id);
        setBattleInfo({ battleId: data.battleInfo.battleId });
        setBattlePokemons(data.battlePokemons);
        setBattleLogs(data.battleLogs);
        setBattleResult(data.battleResult);
      } catch (err) {
        setError('Failed to initialize battle.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initBattle();
  }, []);

  const handleAction = async (action: string, value: string) => {
    if (!battleInfo) return;

    try {
      setLoading(true);
      const data = await fetchBattleProcess(battleInfo.battleId, action, value);
      setBattleInfo(data.battleInfo);
      setBattlePokemons(data.battlePokemons);
      setBattleLogs(data.battleLogs);
      setBattleResult(data.battleResult);
    } catch (err) {
      setError('Failed to process battle action.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading battle...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!battleInfo || !battlePokemons) {
    return <div>No battle data available.</div>;
  }

  if (battleResult && battleResult.isBattleEnd) {
    return <Victory result={battleResult} />;
  }

  return (
    <div>
      <BattleField battlePokemons={battlePokemons} />
      <BattleLog logs={battleLogs} />
      <BattleUI onAction={handleAction} />
    </div>
  );
};

export default Battle;
