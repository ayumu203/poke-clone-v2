// Node.js環境でのfetch関数パフォーマンステスト
import { performance } from 'perf_hooks';

// 環境変数設定
const BASE_URL = process.env.DOCKER_MODE === 'true' ? 'http://server:3001' : 'http://localhost:3001';

console.log('🚀 Fetch関数パフォーマンステスト開始');
console.log('================================');
console.log(`🎯 ベースURL: ${BASE_URL}`);

// テストデータ
const testBattleData = {
  action: {
    action_name: "fight",
    command_id: 0
  },
  battleInfo: {
    battlePokemons: {
      PlayerBattlePokemons: [
        {
          pokemon_id: 494,
          pokemon_index: 0,
          level: 1,
          exp: 0,
          name: "ビクティニ",
          type1: "psychic",
          type2: "fire",
          image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/494.gif",
          max_hp: 11,
          current_hp: 11,
          attack: 6,
          defence: 6,
          special_attack: 6,
          special_defence: 6,
          speed: 6,
          move_list: [5, 7, 9, 25],
          rank: {
            attack: 0,
            defence: 0,
            special_attack: 0,
            special_defence: 0,
            speed: 0,
            accuracy: 0
          },
          ailment: "none"
        }
      ],
      EnemyBattlePokemons: [
        {
          pokemon_id: 648,
          pokemon_index: 0,
          level: 7,
          exp: 0,
          name: "メロエッタ",
          type1: "normal",
          type2: "psychic",
          image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/648.gif",
          max_hp: 17,
          current_hp: 17,
          attack: 10,
          defence: 10,
          special_attack: 10,
          special_defence: 10,
          speed: 10,
          move_list: [5, 7, 9, 25],
          rank: {
            attack: 0,
            defence: 0,
            special_attack: 0,
            special_defence: 0,
            speed: 0,
            accuracy: 0
          },
          ailment: "none"
        }
      ]
    },
    battleLogs: {
      playerPokemonLog: "",
      enemyPokemonLog: ""
    },
    battleResult: {
      isFinished: false,
      result: "ongoing"
    }
  }
};

// パフォーマンス測定関数
async function measureFetchPerformance(url, data, testName) {
  console.log(`📊 テスト: ${testName}`);
  console.log(`🎯 URL: ${url}`);
  
  const startTime = performance.now();
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const endTime = performance.now();
    const fetchTime = endTime - startTime;
    
    const parseStartTime = performance.now();
    const result = await response.json();
    const parseEndTime = performance.now();
    const parseTime = parseEndTime - parseStartTime;
    
    const totalTime = parseEndTime - startTime;
    
    console.log(`  ✅ HTTPステータス: ${response.status}`);
    console.log(`  ⏱️  Fetch時間: ${fetchTime.toFixed(3)}ms`);
    console.log(`  📝 JSON解析時間: ${parseTime.toFixed(3)}ms`);
    console.log(`  🕒 総時間: ${totalTime.toFixed(3)}ms`);
    console.log(`  📦 レスポンスサイズ: ${JSON.stringify(result).length} bytes`);
    console.log('---');
    
    return {
      testName,
      status: response.status,
      fetchTime: fetchTime.toFixed(3),
      parseTime: parseTime.toFixed(3),
      totalTime: totalTime.toFixed(3),
      responseSize: JSON.stringify(result).length,
      success: response.ok
    };
  } catch (error) {
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    console.error(`  ❌ エラー: ${error.message}`);
    console.log(`  🕒 エラーまでの時間: ${totalTime.toFixed(3)}ms`);
    console.log('---');
    
    return {
      testName,
      status: 'ERROR',
      fetchTime: 'N/A',
      parseTime: 'N/A',
      totalTime: totalTime.toFixed(3),
      responseSize: 0,
      success: false,
      error: error.message
    };
  }
}

// メイン実行関数
async function runPerformanceTests() {
  const results = [];
  
  // 1. サーバー基本動作確認
  console.log('🔍 1. サーバー基本動作確認');
  const basicResult = await measureFetchPerformance(
    `${BASE_URL}/`,
    {},
    'サーバー基本動作'
  );
  results.push(basicResult);
  
  // 2. バトル初期化テスト
  console.log('🔍 2. バトル初期化テスト');
  const initResult = await measureFetchPerformance(
    `${BASE_URL}/battle/init`,
    { player_id: "test-player-123" },
    'バトル初期化'
  );
  results.push(initResult);
  
  // 3. バトル処理テスト
  console.log('🔍 3. バトル処理テスト');
  const battleResult = await measureFetchPerformance(
    `${BASE_URL}/battle/process`,
    testBattleData,
    'バトル処理'
  );
  results.push(battleResult);
  
  // 4. 連続バトル処理テスト（5回）
  console.log('🔍 4. 連続バトル処理テスト（5回）');
  for (let i = 1; i <= 5; i++) {
    const consecutiveResult = await measureFetchPerformance(
      `${BASE_URL}/battle/process`,
      testBattleData,
      `連続バトル処理${i}`
    );
    results.push(consecutiveResult);
  }
  
  // 5. ポケモンデータ取得テスト
  console.log('🔍 5. ポケモンデータ取得テスト');
  const pokemonResult = await measureFetchPerformance(
    `${BASE_URL}/data/pokemon`,
    { pokemon_id: 494 },
    'ポケモンデータ取得'
  );
  results.push(pokemonResult);
  
  // 6. 技データ取得テスト
  console.log('🔍 6. 技データ取得テスト');
  const moveResult = await measureFetchPerformance(
    `${BASE_URL}/data/move`,
    { move_id: 5 },
    '技データ取得'
  );
  results.push(moveResult);
  
  // 結果サマリー
  console.log('================================');
  console.log('📊 テスト結果サマリー');
  console.log('================================');
  
  // 統計計算
  const successfulTests = results.filter(r => r.success);
  const battleTests = results.filter(r => r.testName.includes('バトル処理'));
  
  if (successfulTests.length > 0) {
    const avgTotalTime = successfulTests.reduce((sum, r) => sum + parseFloat(r.totalTime), 0) / successfulTests.length;
    console.log(`📈 全体平均時間: ${avgTotalTime.toFixed(3)}ms`);
  }
  
  if (battleTests.length > 0) {
    const avgBattleTime = battleTests.reduce((sum, r) => sum + parseFloat(r.totalTime), 0) / battleTests.length;
    console.log(`⚔️  バトル処理平均時間: ${avgBattleTime.toFixed(3)}ms`);
  }
  
  // 結果をCSV形式で出力
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const csvContent = [
    'テスト名,HTTPステータス,Fetch時間(ms),JSON解析時間(ms),総時間(ms),レスポンスサイズ(bytes),成功,エラー',
    ...results.map(r => `${r.testName},${r.status},${r.fetchTime},${r.parseTime},${r.totalTime},${r.responseSize},${r.success},${r.error || ''}`)
  ].join('\n');
  
  console.log('\n📄 CSV形式の結果:');
  console.log(csvContent);
  
  console.log('\n✅ パフォーマンステスト完了');
}

// テスト実行
runPerformanceTests().catch(console.error);
