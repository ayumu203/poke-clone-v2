'use client';

import { useEffect, useState } from 'react';

export default function EnvDebugComponent() {
  const [envVars, setEnvVars] = useState({
    apiUrl: '',
    supabaseUrl: '',
    supabaseKey: '',
    nodeEnv: ''
  });

  useEffect(() => {
    setEnvVars({
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'NOT SET',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET (hidden)' : 'NOT SET',
      nodeEnv: process.env.NODE_ENV || 'NOT SET'
    });
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#000',
      color: '#fff',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxWidth: '400px',
      zIndex: 9999,
      border: '2px solid #333'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#00ff00' }}>🔧 環境変数デバッグ</h3>
      <div style={{ marginBottom: '5px' }}>
        <strong>NEXT_PUBLIC_API_URL:</strong><br />
        <span style={{ color: envVars.apiUrl === 'NOT SET' ? '#ff4444' : '#44ff44' }}>
          {envVars.apiUrl}
        </span>
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong>NEXT_PUBLIC_SUPABASE_URL:</strong><br />
        <span style={{ color: envVars.supabaseUrl === 'NOT SET' ? '#ff4444' : '#44ff44' }}>
          {envVars.supabaseUrl}
        </span>
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong><br />
        <span style={{ color: envVars.supabaseKey === 'NOT SET' ? '#ff4444' : '#44ff44' }}>
          {envVars.supabaseKey}
        </span>
      </div>
      <div>
        <strong>NODE_ENV:</strong><br />
        <span style={{ color: '#ffff44' }}>{envVars.nodeEnv}</span>
      </div>
      <div style={{ marginTop: '10px', fontSize: '10px', color: '#888' }}>
        タイムスタンプ: {new Date().toLocaleString()}
      </div>
    </div>
  );
}
