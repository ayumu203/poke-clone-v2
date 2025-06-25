// APIサーバーテスト（localhost:8080）
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001';

// テスト用のプレイヤーID（UUIDっぽい形式）
const TEST_PLAYER_ID = 'test-player-' + Date.now();

// APIリクエスト用のヘルパー関数
const apiRequest = async (endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const options: any = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        console.log(`📡 ${method} ${url}`);
        if (body) console.log('📤 Request Body:', JSON.stringify(body, null, 2));
        
        const response = await fetch(url, options);
        const data = await response.json();
        
        console.log(`📥 Response (${response.status}):`, JSON.stringify(data, null, 2));
        console.log('---');
        
        return { status: response.status, data };
    } catch (error) {
        console.error(`❌ API Request Failed: ${method} ${url}`, error);
        return { status: 0, data: null, error };
    }
};

// テスト関数群
const testHealthCheck = async () => {
    console.log('🏥 === サーバー動作確認テスト ===');
    return await apiRequest('/');
};

const testPlayerRegistration = async () => {
    console.log('👤 === プレイヤー登録・取得テスト ===');
    
    // プレイヤー登録（存在しない場合は自動登録）
    const playerResult = await apiRequest('/player', 'POST', {
        player_id: TEST_PLAYER_ID
    });
    
    return playerResult;
};

const testPlayerNameUpdate = async () => {
    console.log('✏️ === プレイヤー名変更テスト ===');
    
    return await apiRequest('/player/register', 'POST', {
        player_id: TEST_PLAYER_ID,
        name: 'テストトレーナー'
    });
};

const testFirstPokemonList = async () => {
    console.log('🎯 === 最初のポケモン選択肢テスト ===');
    
    return await apiRequest('/first-pokemon', 'POST');
};

const testFirstPokemonRegister = async () => {
    console.log('🐾 === 最初のポケモン登録テスト ===');
    
    // ビクティニ（494）を選択
    return await apiRequest('/first-pokemon/register', 'POST', {
        player_id: TEST_PLAYER_ID,
        pokemon_id: 494
    });
};

const testTeamPokemonGet = async () => {
    console.log('👥 === 手持ちポケモン取得テスト ===');
    
    return await apiRequest('/team-pokemon', 'POST', {
        player_id: TEST_PLAYER_ID,
        index: 0
    });
};

const testTeamPokemonRegister = async () => {
    console.log('➕ === 手持ちポケモン追加テスト ===');
    
    // ツタージャ（495）を2番目に追加
    return await apiRequest('/team-pokemon/register', 'POST', {
        player_id: TEST_PLAYER_ID,
        pokemon_id: 495,
        index: 1
    });
};

const testBattleInit = async () => {
    console.log('⚔️ === バトル初期化テスト ===');
    
    return await apiRequest('/battle/init', 'POST', {
        player_id: TEST_PLAYER_ID
    });
};

const testPokemonMasterData = async () => {
    console.log('📚 === ポケモンマスタデータテスト ===');
    
    // ピカチュウ（25）のデータを取得
    return await apiRequest('/data/pokemon', 'POST', {
        pokemon_id: 25
    });
};

const testMoveMasterData = async () => {
    console.log('💫 === 技マスタデータテスト ===');
    
    // でんこうせっか（1）のデータを取得
    return await apiRequest('/data/move', 'POST', {
        move_id: 1
    });
};

const testBattleProcess = async () => {
    console.log('⚔️ === バトル処理エンドポイント個別テスト ===');
    
    // まずバトル初期化
    const initResult = await apiRequest('/battle/init', 'POST', {
        player_id: TEST_PLAYER_ID
    });
    
    if (!initResult || !initResult.data) {
        console.log('❌ バトル初期化に失敗しました');
        return;
    }
    
    console.log('✅ バトル初期化成功');
    
    // 単発攻撃テスト
    console.log('\n🗡️ 単発攻撃テスト');
    const attackResult = await apiRequest('/battle/process', 'POST', {
        action: {
            action_name: 'fight',
            command_id: 0
        },
        battleInfo: initResult.data
    });
    
    if (attackResult && attackResult.status === 200 && attackResult.data !== "failed") {
        console.log('✅ 攻撃処理成功');
        console.log(`ターン数: ${(attackResult.data as any).battleResult?.totalTurn || 'N/A'}`);
    } else {
        console.log('❌ 攻撃処理失敗');
    }
    
    // 交代テスト（手持ちが複数いる場合）
    if ((initResult.data as any).battlePokemons?.PlayerBattlePokemons?.length > 1) {
        console.log('\n🔄 交代テスト');
        const switchResult = await apiRequest('/battle/process', 'POST', {
            action: {
                action_name: 'switch',
                command_id: 1
            },
            battleInfo: initResult.data
        });
        
        if (switchResult && switchResult.status === 200 && switchResult.data !== "failed") {
            console.log('✅ 交代処理成功');
        } else {
            console.log('❌ 交代処理失敗');
        }
    }
    
    // 捕獲テスト
    console.log('\n🎯 捕獲テスト');
    const captureResult = await apiRequest('/battle/process', 'POST', {
        action: {
            action_name: 'get',
            command_id: 0
        },
        battleInfo: initResult.data
    });
    
    if (captureResult && captureResult.status === 200 && captureResult.data !== "failed") {
        console.log('✅ 捕獲処理成功');
        if ((captureResult.data as any).battleResult?.gainPokemon) {
            console.log(`🎉 ポケモンを捕獲: ${(captureResult.data as any).battleResult.gainPokemon.name}`);
        } else {
            console.log('📝 捕獲失敗（確率的）');
        }
    } else {
        console.log('❌ 捕獲処理失敗');
    }
    
    // 無効なアクションテスト
    console.log('\n❌ 無効アクションテスト');
    const invalidResult = await apiRequest('/battle/process', 'POST', {
        action: {
            action_name: 'invalid_action',
            command_id: 999
        },
        battleInfo: initResult.data
    });
    
    if (invalidResult && (invalidResult.data === "failed" || invalidResult.status !== 200)) {
        console.log('✅ 無効アクションが適切に処理されました');
    } else {
        console.log('⚠️ 無効アクションの処理が想定外です');
    }
};

const testBattleFlow = async (battleInfo: any) => {
    console.log('🎮 === バトルフロー統合テスト ===');
    
    if (!battleInfo || !battleInfo.data) {
        console.log('❌ バトル情報が不正です');
        return;
    }
    
    let currentBattleInfo = battleInfo.data;
    let turnCount = 0;
    const maxTurns = 20; // 無限ループ防止
    
    console.log('⚔️ バトル開始！');
    console.log(`プレイヤー: ${currentBattleInfo.battlePokemons?.PlayerBattlePokemons[0]?.name}`);
    console.log(`相手: ${currentBattleInfo.battlePokemons?.EnemyBattlePokemons[0]?.name}`);
    
    while (!currentBattleInfo.battleResult?.isFinished && turnCount < maxTurns) {
        turnCount++;
        console.log(`\n--- ターン ${turnCount} ---`);
        
        // ランダムにアクションを選択（80%攻撃、15%交代、5%捕獲）
        const actionRandom = Math.random();
        let action: any;
        
        if (actionRandom < 0.8) {
            // 攻撃アクション
            const moveIndex = Math.floor(Math.random() * 4); // 0-3の技インデックス
            action = {
                action_name: 'fight',
                command_id: moveIndex
            };
            console.log(`🗡️ プレイヤーの行動: 攻撃 (技${moveIndex})`);
        } else if (actionRandom < 0.95 && currentBattleInfo.battlePokemons?.PlayerBattlePokemons?.length > 1) {
            // 交代アクション（手持ちが複数いる場合のみ）
            const availablePokemons = currentBattleInfo.battlePokemons.PlayerBattlePokemons
                .map((p: any, index: number) => ({ pokemon: p, index }))
                .filter(({ pokemon, index }: { pokemon: any, index: number }) => pokemon && pokemon.current_hp > 0 && index !== 0);
            
            if (availablePokemons.length > 0) {
                const switchTarget = availablePokemons[Math.floor(Math.random() * availablePokemons.length)];
                action = {
                    action_name: 'switch',
                    command_id: switchTarget.index
                };
                console.log(`🔄 プレイヤーの行動: 交代 (${switchTarget.pokemon?.name})`);
            } else {
                // 交代できない場合は攻撃
                action = {
                    action_name: 'fight',
                    command_id: 0
                };
                console.log(`🗡️ プレイヤーの行動: 攻撃 (交代不可のため)`);
            }
        } else {
            // 捕獲アクション
            action = {
                action_name: 'get',
                command_id: 0
            };
            console.log(`🎯 プレイヤーの行動: 捕獲`);
        }
        
        // バトル処理実行
        const battleResult = await apiRequest('/battle/process', 'POST', {
            action,
            battleInfo: currentBattleInfo
        });
        
        if (!battleResult || battleResult.status !== 200 || !battleResult.data) {
            console.log('❌ バトル処理でエラーが発生しました');
            break;
        }
        
        if (battleResult.data === "failed") {
            console.log('❌ バトル処理が失敗しました');
            break;
        }
        
        currentBattleInfo = battleResult.data;
        
        // バトルログ表示
        if (currentBattleInfo.battleLogs) {
            if (currentBattleInfo.battleLogs.playerPokemonLog) {
                console.log(`📝 プレイヤーログ: ${currentBattleInfo.battleLogs.playerPokemonLog}`);
            }
            if (currentBattleInfo.battleLogs.enemyPokemonLog) {
                console.log(`📝 相手ログ: ${currentBattleInfo.battleLogs.enemyPokemonLog}`);
            }
            if (currentBattleInfo.battleLogs.battleLog) {
                console.log(`📝 バトルログ: ${currentBattleInfo.battleLogs.battleLog}`);
            }
        }
        
        // 現在の状況表示
        if (currentBattleInfo.battlePokemons) {
            const playerPokemon = currentBattleInfo.battlePokemons.PlayerBattlePokemons[0];
            const enemyPokemon = currentBattleInfo.battlePokemons.EnemyBattlePokemons[0];
            
            if (playerPokemon) {
                console.log(`👤 ${playerPokemon.name}: HP ${playerPokemon.current_hp}/${playerPokemon.max_hp} (状態: ${playerPokemon.ailment})`);
            }
            if (enemyPokemon) {
                console.log(`🤖 ${enemyPokemon.name}: HP ${enemyPokemon.current_hp}/${enemyPokemon.max_hp} (状態: ${enemyPokemon.ailment})`);
            }
        }
        
        // バトル結果チェック
        if (currentBattleInfo.battleResult?.isFinished) {
            console.log('\n🏁 === バトル終了 ===');
            console.log(`総ターン数: ${currentBattleInfo.battleResult.totalTurn}`);
            console.log(`獲得経験値: ${currentBattleInfo.battleResult.gainExp}`);
            if (currentBattleInfo.battleResult.gainPokemon) {
                console.log(`🎉 ポケモンを捕獲しました: ${currentBattleInfo.battleResult.gainPokemon.name}`);
            }
            break;
        }
        
        // ターン間の待機（ログの読みやすさのため）
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (turnCount >= maxTurns) {
        console.log(`⏰ 最大ターン数(${maxTurns})に達したため、バトルを終了します`);
    }
    
    return currentBattleInfo;
};

const testCompleteBattleSimulation = async () => {
    console.log('🎲 === 完全バトルシミュレーションテスト ===');
    
    // 複数のバトルシナリオをテスト
    const scenarios = [
        { name: '攻撃メインバトル', attackRatio: 0.9, switchRatio: 0.05, captureRatio: 0.05 },
        { name: '交代メインバトル', attackRatio: 0.4, switchRatio: 0.5, captureRatio: 0.1 },
        { name: '捕獲チャレンジバトル', attackRatio: 0.3, switchRatio: 0.2, captureRatio: 0.5 }
    ];
    
    for (const scenario of scenarios) {
        console.log(`\n🎯 シナリオ: ${scenario.name}`);
        
        // バトル初期化
        const initResult = await apiRequest('/battle/init', 'POST', {
            player_id: TEST_PLAYER_ID
        });
        
        if (!initResult || !initResult.data) {
            console.log('❌ バトル初期化失敗');
            continue;
        }
        
        let currentBattleInfo = initResult.data as any;
        let turnCount = 0;
        const maxTurns = 15;
        let actionStats = { attack: 0, switch: 0, capture: 0 };
        
        console.log(`開始 - プレイヤー: ${currentBattleInfo.battlePokemons?.PlayerBattlePokemons[0]?.name} vs 相手: ${currentBattleInfo.battlePokemons?.EnemyBattlePokemons[0]?.name}`);
        
        while (!currentBattleInfo.battleResult?.isFinished && turnCount < maxTurns) {
            turnCount++;
            
            // シナリオベースのアクション選択
            const actionRandom = Math.random();
            let action: any;
            
            if (actionRandom < scenario.attackRatio) {
                action = { action_name: 'fight', command_id: Math.floor(Math.random() * 4) };
                actionStats.attack++;
            } else if (actionRandom < scenario.attackRatio + scenario.switchRatio && 
                      currentBattleInfo.battlePokemons?.PlayerBattlePokemons?.length > 1) {
                const availableIndices = [1, 2, 3, 4, 5].filter(i => 
                    currentBattleInfo.battlePokemons.PlayerBattlePokemons[i]?.current_hp > 0
                );
                if (availableIndices.length > 0) {
                    action = { action_name: 'switch', command_id: availableIndices[0] };
                    actionStats.switch++;
                } else {
                    action = { action_name: 'fight', command_id: 0 };
                    actionStats.attack++;
                }
            } else {
                action = { action_name: 'get', command_id: 0 };
                actionStats.capture++;
            }
            
            // バトル処理実行
            const result = await apiRequest('/battle/process', 'POST', {
                action,
                battleInfo: currentBattleInfo
            });
            
            if (!result || result.status !== 200 || result.data === "failed") {
                console.log(`❌ ターン${turnCount}で処理失敗`);
                break;
            }
            
            currentBattleInfo = result.data as any;
            
            // 簡潔な状況報告
            if (currentBattleInfo.battleResult?.isFinished) {
                console.log(`🏁 ${turnCount}ターンで終了`);
                if (currentBattleInfo.battleResult.gainPokemon) {
                    console.log(`🎉 ${currentBattleInfo.battleResult.gainPokemon.name}を捕獲！`);
                }
                break;
            }
        }
        
        console.log(`📊 アクション統計 - 攻撃:${actionStats.attack} 交代:${actionStats.switch} 捕獲:${actionStats.capture}`);
    }
};

const testBattleEndgameScenarios = async () => {
    console.log('🎭 === バトル終了シナリオテスト ===');
    
    // 異なる終了パターンをテスト
    const endgameTests = [
        { name: '捕獲成功シナリオ', actions: ['get', 'get', 'get'] },
        { name: '戦闘勝利シナリオ', actions: ['fight', 'fight', 'fight', 'fight'] },
        { name: '交代→攻撃シナリオ', actions: ['switch', 'fight', 'fight'] }
    ];
    
    for (const test of endgameTests) {
        console.log(`\n🎬 ${test.name}`);
        
        const initResult = await apiRequest('/battle/init', 'POST', {
            player_id: TEST_PLAYER_ID
        });
        
        if (!initResult?.data) continue;
        
        let currentBattleInfo = initResult.data as any;
        
        for (let i = 0; i < test.actions.length && !currentBattleInfo.battleResult?.isFinished; i++) {
            const actionName = test.actions[i];
            let action: any;
            
            switch (actionName) {
                case 'fight':
                    action = { action_name: 'fight', command_id: 0 };
                    break;
                case 'switch':
                    action = { action_name: 'switch', command_id: 1 };
                    break;
                case 'get':
                    action = { action_name: 'get', command_id: 0 };
                    break;
            }
            
            const result = await apiRequest('/battle/process', 'POST', {
                action,
                battleInfo: currentBattleInfo
            });
            
            if (result?.data && result.data !== "failed") {
                currentBattleInfo = result.data as any;
                console.log(`✅ ${actionName}アクション成功`);
                
                if (currentBattleInfo.battleResult?.isFinished) {
                    console.log(`🏁 バトル終了 - 総ターン:${currentBattleInfo.battleResult.totalTurn}`);
                    break;
                }
            } else {
                console.log(`❌ ${actionName}アクション失敗`);
            }
        }
    }
};

const testErrorHandling = async () => {
    console.log('🚨 === エラーハンドリングテスト ===');
    
    console.log('❌ 存在しないプレイヤーでバトル初期化');
    await apiRequest('/battle/init', 'POST', {
        player_id: 'non-existent-player'
    });
    
    console.log('❌ 無効なポケモンIDでマスタデータ取得');
    await apiRequest('/data/pokemon', 'POST', {
        pokemon_id: 99999
    });
    
    console.log('❌ 無効な技IDでマスタデータ取得');
    await apiRequest('/data/move', 'POST', {
        move_id: 99999
    });
    
    console.log('❌ 無効なリクエストボディでバトル処理');
    await apiRequest('/battle/process', 'POST', {
        invalidData: 'test'
    });
    
    console.log('❌ 存在しないエンドポイント');
    await apiRequest('/nonexistent-endpoint', 'GET');
};

const testCleanup = async () => {
    console.log('🧹 === データクリーンアップテスト ===');
    
    return await apiRequest('/delete', 'POST');
};

// メインテスト実行関数
const runAllApiTests = async () => {
    console.log('🚀 === APIサーバーテスト開始 ===\n');
    console.log(`🎯 テスト対象: ${API_BASE_URL}`);
    console.log(`👤 テストプレイヤーID: ${TEST_PLAYER_ID}\n`);
    
    try {
        // 1. サーバー動作確認
        await testHealthCheck();
        
        // 2. プレイヤー関連テスト
        const playerResult = await testPlayerRegistration();
        await testPlayerNameUpdate();
        
        // 3. ポケモン関連テスト
        await testFirstPokemonList();
        await testFirstPokemonRegister();
        await testTeamPokemonGet();
        await testTeamPokemonRegister();
        
        // 4. マスタデータテスト
        await testPokemonMasterData();
        await testMoveMasterData();
        
        // 5. バトル関連テスト
        const battleResult = await testBattleInit();
        
        // 個別バトル処理テスト
        await testBattleProcess();
        
        // バトルフロー統合テスト（実際の戦闘シミュレーション）
        if (battleResult && battleResult.data) {
            console.log('\n🎮 バトルフロー統合テストを開始します...');
            await testBattleFlow(battleResult);
            
            // 完全バトルシミュレーション
            await testCompleteBattleSimulation();
            
            // バトル終了シナリオテスト
            await testBattleEndgameScenarios();
        }
        
        // 6. エラーハンドリングテスト
        await testErrorHandling();
        
        // 7. データクリーンアップ
        await testCleanup();
        
        console.log('\n🎉 === すべてのAPIテストが完了しました === 🎉');
        
    } catch (error) {
        console.error('❌ テスト実行中にエラーが発生しました:', error);
    }
};

// Node.js環境での実行
runAllApiTests().catch(console.error);
