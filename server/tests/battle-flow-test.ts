// バトルフロー完全テスト
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001';
const TEST_PLAYER_ID = 'battle-test-player-' + Date.now();

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
        if (body && method === 'POST' && endpoint.includes('/battle/')) {
            console.log('📤 Request Body:', JSON.stringify(body, null, 2));
        }
        
        const response = await fetch(url, options);
        const data = await response.json();
        
        console.log(`📥 Response (${response.status}):`, typeof data === 'string' ? data : JSON.stringify(data, null, 2));
        console.log('---');
        
        return { status: response.status, data };
    } catch (error) {
        console.error(`❌ API Request Failed: ${method} ${url}`, error);
        return { status: 0, data: null, error };
    }
};

// テストデータ準備
const setupTestPlayer = async () => {
    console.log('🔧 === テストプレイヤー準備 ===');
    
    // プレイヤー登録
    await apiRequest('/player', 'POST', {
        player_id: TEST_PLAYER_ID
    });
    
    // 最初のポケモン登録（ビクティニ）
    await apiRequest('/first-pokemon/register', 'POST', {
        player_id: TEST_PLAYER_ID,
        pokemon_id: 494
    });
    
    // 2番目のポケモン登録（ツタージャ）
    await apiRequest('/team-pokemon/register', 'POST', {
        player_id: TEST_PLAYER_ID,
        pokemon_id: 495,
        index: 1
    });
    
    console.log('✅ テストプレイヤー準備完了');
};

// バトル処理テスト（実際のAPIレスポンスを基にした統合テスト）
const testBattleProcessWithRealData = async () => {
    console.log('⚔️ === 実際のAPIレスポンスでのバトル処理テスト ===');
    
    // バトル初期化
    const initResult = await apiRequest('/battle/init', 'POST', {
        player_id: TEST_PLAYER_ID
    });
    
    if (!initResult || !initResult.data || initResult.data === "failed") {
        console.log('❌ バトル初期化に失敗しました');
        return;
    }
    
    console.log('✅ バトル初期化成功');
    let currentBattleInfo = initResult.data as any;
    
    // 現在のバトル状況を詳細表示
    console.log('\n📊 === 初期バトル状況 ===');
    const playerPokemon = currentBattleInfo.battlePokemons?.PlayerBattlePokemons[0];
    const enemyPokemon = currentBattleInfo.battlePokemons?.EnemyBattlePokemons[0];
    
    if (playerPokemon) {
        console.log(`👤 プレイヤー: ${playerPokemon.name} (Lv.${playerPokemon.level})`);
        console.log(`   HP: ${playerPokemon.current_hp}/${playerPokemon.max_hp}`);
        console.log(`   タイプ: ${playerPokemon.type1}${playerPokemon.type2 !== 'none' ? '/' + playerPokemon.type2 : ''}`);
        console.log(`   ステータス: 攻撃${playerPokemon.attack} 防御${playerPokemon.defence} 素早さ${playerPokemon.speed}`);
    }
    
    if (enemyPokemon) {
        console.log(`🤖 敵: ${enemyPokemon.name} (Lv.${enemyPokemon.level})`);
        console.log(`   HP: ${enemyPokemon.current_hp}/${enemyPokemon.max_hp}`);
        console.log(`   タイプ: ${enemyPokemon.type1}${enemyPokemon.type2 !== 'none' ? '/' + enemyPokemon.type2 : ''}`);
        console.log(`   ステータス: 攻撃${enemyPokemon.attack} 防御${enemyPokemon.defence} 素早さ${enemyPokemon.speed}`);
    }
    
    // 段階的なバトルテスト
    console.log('\n🎯 攻撃アクションテスト（技0番）');
    const fightResult = await apiRequest('/battle/process', 'POST', {
        action: { action_name: 'fight', command_id: 0 },
        battleInfo: currentBattleInfo
    });
    
    if (fightResult && fightResult.status === 200 && fightResult.data !== "failed") {
        console.log('✅ 攻撃アクション成功');
        currentBattleInfo = fightResult.data as any;
        
        // 詳細な結果分析
        console.log('\n📈 戦闘結果分析:');
        console.log(`ターン数: ${currentBattleInfo.battleResult?.totalTurn || 'N/A'}`);
        console.log(`バトル終了: ${currentBattleInfo.battleResult?.isFinished ? 'はい' : 'いいえ'}`);
        
        if (currentBattleInfo.battleResult?.gainExp > 0) {
            console.log(`🌟 獲得経験値: ${currentBattleInfo.battleResult.gainExp}`);
        }
        
        // バトルログの詳細表示
        if (currentBattleInfo.battleLogs) {
            if (currentBattleInfo.battleLogs.playerPokemonLog) {
                console.log(`📝 プレイヤーログ: ${currentBattleInfo.battleLogs.playerPokemonLog}`);
            }
            if (currentBattleInfo.battleLogs.enemyPokemonLog) {
                console.log(`📝 敵ログ: ${currentBattleInfo.battleLogs.enemyPokemonLog}`);
            }
        }
        
        // ポケモンの状態変化を表示
        const newPlayerPokemon = currentBattleInfo.battlePokemons?.PlayerBattlePokemons[0];
        const newEnemyPokemon = currentBattleInfo.battlePokemons?.EnemyBattlePokemons[0];
        
        console.log('\n🔄 戦闘後の状態:');
        if (newPlayerPokemon) {
            console.log(`� ${newPlayerPokemon.name}: HP ${newPlayerPokemon.current_hp}/${newPlayerPokemon.max_hp} (状態異常: ${newPlayerPokemon.ailment})`);
        }
        if (newEnemyPokemon) {
            console.log(`🤖 ${newEnemyPokemon.name}: HP ${newEnemyPokemon.current_hp}/${newEnemyPokemon.max_hp} (状態異常: ${newEnemyPokemon.ailment})`);
        }
        
        // バトル終了判定
        if (currentBattleInfo.battleResult?.isFinished) {
            console.log('\n🏁 バトル終了！');
            if (currentBattleInfo.battleResult.gainPokemon) {
                console.log(`🎉 ポケモンを捕獲: ${currentBattleInfo.battleResult.gainPokemon.name}`);
            } else {
                console.log('🏆 戦闘で勝敗が決定しました');
            }
        } else {
            console.log('\n▶️ バトル継続中...');
        }
    } else {
        console.log('❌ 攻撃アクション失敗');
        console.log('Response:', fightResult);
    }
    
    return currentBattleInfo;
};

// 完全なバトルフロー再現テスト（実際のバトル終了まで継続）
const testFullBattleFlow = async () => {
    console.log('🎮 === 完全バトルフロー再現テスト ===');
    
    // バトル初期化
    const initResult = await apiRequest('/battle/init', 'POST', {
        player_id: TEST_PLAYER_ID
    });
    
    if (!initResult || !initResult.data || initResult.data === "failed") {
        console.log('❌ バトル初期化に失敗しました');
        return;
    }
    
    let currentBattleInfo = initResult.data as any;
    let turnCount = 0;
    const maxTurns = 25;
    
    console.log('\n⚔️ バトル開始！');
    const initialPlayer = currentBattleInfo.battlePokemons?.PlayerBattlePokemons[0];
    const initialEnemy = currentBattleInfo.battlePokemons?.EnemyBattlePokemons[0];
    console.log(`👤 ${initialPlayer?.name} (Lv.${initialPlayer?.level}) vs 🤖 ${initialEnemy?.name} (Lv.${initialEnemy?.level})`);
    
    // バトル終了まで継続
    while (!currentBattleInfo.battleResult?.isFinished && turnCount < maxTurns) {
        turnCount++;
        console.log(`\n🎲 --- ターン ${turnCount} ---`);
        
        // 現在の状況確認
        const playerPokemon = currentBattleInfo.battlePokemons?.PlayerBattlePokemons[0];
        const enemyPokemon = currentBattleInfo.battlePokemons?.EnemyBattlePokemons[0];
        
        if (playerPokemon && enemyPokemon) {
            console.log(`👤 ${playerPokemon.name}: ${playerPokemon.current_hp}/${playerPokemon.max_hp} HP (${playerPokemon.ailment})`);
            console.log(`🤖 ${enemyPokemon.name}: ${enemyPokemon.current_hp}/${enemyPokemon.max_hp} HP (${enemyPokemon.ailment})`);
        }
        
        // 戦略的なアクション選択（実際のゲームロジックに基づく）
        let action: any;
        const hpRatio = playerPokemon ? playerPokemon.current_hp / playerPokemon.max_hp : 1;
        const enemyHpRatio = enemyPokemon ? enemyPokemon.current_hp / enemyPokemon.max_hp : 1;
        
        // HPが低い場合の戦略
        if (hpRatio < 0.3 && currentBattleInfo.battlePokemons?.PlayerBattlePokemons?.length > 1) {
            // 交代を試行
            const availablePokemons = currentBattleInfo.battlePokemons.PlayerBattlePokemons
                .map((p: any, index: number) => ({ pokemon: p, index }))
                .filter(({ pokemon, index }: { pokemon: any, index: number }) => 
                    pokemon && pokemon.current_hp > 0 && index !== 0
                );
            
            if (availablePokemons.length > 0) {
                action = { action_name: 'switch', command_id: availablePokemons[0].index };
                console.log(`🔄 戦略交代: ${availablePokemons[0].pokemon.name}に交代`);
            } else {
                action = { action_name: 'fight', command_id: 0 };
                console.log(`🗡️ 最後の攻撃`);
            }
        } else if (enemyHpRatio < 0.4 && Math.random() < 0.3) {
            // 相手のHPが低い時は捕獲を試行
            action = { action_name: 'get', command_id: 0 };
            console.log(`🎯 捕獲チャンス！`);
        } else {
            // 通常攻撃（技をランダム選択）
            const moveIndex = Math.floor(Math.random() * 4);
            action = { action_name: 'fight', command_id: moveIndex };
            console.log(`🗡️ 攻撃: 技${moveIndex}番`);
        }
        
        // バトル処理実行
        const result = await apiRequest('/battle/process', 'POST', {
            action,
            battleInfo: currentBattleInfo
        });
        
        if (!result || result.status !== 200 || result.data === "failed") {
            console.log('❌ バトル処理エラー');
            console.log('エラー詳細:', result);
            break;
        }
        
        currentBattleInfo = result.data as any;
        
        // ターン結果の表示
        if (currentBattleInfo.battleLogs?.battleLog) {
            console.log(`📝 ${currentBattleInfo.battleLogs.battleLog}`);
        }
        if (currentBattleInfo.battleLogs?.enemyPokemonLog) {
            console.log(`📝 ${currentBattleInfo.battleLogs.enemyPokemonLog}`);
        }
        
        // ダメージや状態変化の確認
        const updatedPlayer = currentBattleInfo.battlePokemons?.PlayerBattlePokemons[0];
        const updatedEnemy = currentBattleInfo.battlePokemons?.EnemyBattlePokemons[0];
        
        if (updatedPlayer && initialPlayer && updatedPlayer.current_hp !== initialPlayer.current_hp) {
            const hpChange = updatedPlayer.current_hp - initialPlayer.current_hp;
            console.log(`📊 プレイヤーHP変化: ${hpChange > 0 ? '+' : ''}${hpChange}`);
        }
        
        // バトル終了チェック
        if (currentBattleInfo.battleResult?.isFinished) {
            console.log('\n🏁 === バトル終了 ===');
            console.log(`🎯 総ターン数: ${currentBattleInfo.battleResult.totalTurn}`);
            console.log(`⭐ 獲得経験値: ${currentBattleInfo.battleResult.gainExp}`);
            
            if (currentBattleInfo.battleResult.gainPokemon) {
                console.log(`🎉 ポケモン捕獲成功: ${currentBattleInfo.battleResult.gainPokemon.name}`);
            } else {
                console.log(`🏆 戦闘終了！勝敗が決定しました`);
            }
            break;
        }
        
        // ターン間の待機（ログの読みやすさのため）
        await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    if (turnCount >= maxTurns) {
        console.log(`⏰ 最大ターン数(${maxTurns})に達しました`);
    }
    
    return currentBattleInfo;
};

// 異常系テスト
const testErrorCases = async () => {
    console.log('🚨 === 異常系テスト ===');
    
    // 無効なプレイヤーIDでバトル初期化
    console.log('\n❌ 無効なプレイヤーIDテスト');
    await apiRequest('/battle/init', 'POST', {
        player_id: 'invalid-player-id'
    });
    
    // 有効なバトル情報を取得
    const initResult = await apiRequest('/battle/init', 'POST', {
        player_id: TEST_PLAYER_ID
    });
    
    if (initResult?.data && initResult.data !== "failed") {
        const battleInfo = initResult.data;
        
        // 無効なアクション名
        console.log('\n❌ 無効なアクション名テスト');
        await apiRequest('/battle/process', 'POST', {
            action: { action_name: 'invalid_action', command_id: 0 },
            battleInfo
        });
        
        // 無効なcommand_id
        console.log('\n❌ 無効なcommand_idテスト');
        await apiRequest('/battle/process', 'POST', {
            action: { action_name: 'fight', command_id: 999 },
            battleInfo
        });
        
        // 不正なリクエストボディ
        console.log('\n❌ 不正なリクエストボディテスト');
        await apiRequest('/battle/process', 'POST', {
            invalidField: 'test'
        });
    }
};

// データクリーンアップ
const cleanup = async () => {
    console.log('🧹 === データクリーンアップ ===');
    await apiRequest('/delete', 'POST');
};

// 実際のバトル結果を検証するテスト
const testSpecificBattleScenarios = async () => {
    console.log('🎯 === 特定バトルシナリオ検証テスト ===');
    
    // シナリオ1: 攻撃による即死と状態異常
    console.log('\n🔥 シナリオ1: 攻撃→即死パターン');
    
    const scenario1Init = await apiRequest('/battle/init', 'POST', {
        player_id: TEST_PLAYER_ID
    });
    
    if (scenario1Init?.data && scenario1Init.data !== "failed") {
        const result1 = await apiRequest('/battle/process', 'POST', {
            action: { action_name: 'fight', command_id: 0 },
            battleInfo: scenario1Init.data
        });
        
        if (result1?.data && result1.data !== "failed") {
            const battleResult = result1.data as any;
            
            console.log('✅ バトル処理完了');
            console.log('🔍 結果検証:');
            
            // HP検証
            const playerPokemon = battleResult.battlePokemons?.PlayerBattlePokemons[0];
            if (playerPokemon) {
                console.log(`   プレイヤーHP: ${playerPokemon.current_hp}/${playerPokemon.max_hp}`);
                if (playerPokemon.current_hp <= 0) {
                    console.log('   ✅ HPが0以下になった（KO状態）');
                }
                
                if (playerPokemon.ailment !== 'none') {
                    console.log(`   ✅ 状態異常発生: ${playerPokemon.ailment}`);
                }
            }
            
            // バトル終了検証
            if (battleResult.battleResult?.isFinished) {
                console.log('   ✅ バトル終了フラグが正常に設定された');
                console.log(`   ターン数: ${battleResult.battleResult.totalTurn}`);
                if (battleResult.battleResult.gainExp > 0) {
                    console.log(`   🌟 経験値獲得: ${battleResult.battleResult.gainExp}`);
                }
            }
        }
    }
    
    // シナリオ2: 捕獲アクション連続テスト
    console.log('\n🎯 シナリオ2: 捕獲アクション連続テスト');
    
    const scenario2Init = await apiRequest('/battle/init', 'POST', {
        player_id: TEST_PLAYER_ID
    });
    
    if (scenario2Init?.data && scenario2Init.data !== "failed") {
        let currentBattle = scenario2Init.data as any;
        
        for (let i = 1; i <= 3; i++) {
            console.log(`   捕獲試行 ${i}回目`);
            
            const captureResult = await apiRequest('/battle/process', 'POST', {
                action: { action_name: 'get', command_id: 0 },
                battleInfo: currentBattle
            });
            
            if (captureResult?.data && captureResult.data !== "failed") {
                currentBattle = captureResult.data as any;
                
                if (currentBattle.battleResult?.gainPokemon) {
                    console.log(`   🎉 捕獲成功: ${currentBattle.battleResult.gainPokemon.name}`);
                    break;
                } else {
                    console.log(`   📝 捕獲失敗（${i}回目）`);
                }
                
                if (currentBattle.battleResult?.isFinished) {
                    console.log('   🏁 バトル終了');
                    break;
                }
            } else {
                console.log(`   ❌ 捕獲処理エラー（${i}回目）`);
                break;
            }
        }
    }
    
    // シナリオ3: 異なる技の効果テスト
    console.log('\n⚡ シナリオ3: 技効果検証テスト');
    
    for (let moveIndex = 0; moveIndex < 4; moveIndex++) {
        console.log(`   技${moveIndex}番のテスト`);
        
        const moveTestInit = await apiRequest('/battle/init', 'POST', {
            player_id: TEST_PLAYER_ID
        });
        
        if (moveTestInit?.data && moveTestInit.data !== "failed") {
            const moveResult = await apiRequest('/battle/process', 'POST', {
                action: { action_name: 'fight', command_id: moveIndex },
                battleInfo: moveTestInit.data
            });
            
            if (moveResult?.data && moveResult.data !== "failed") {
                const result = moveResult.data as any;
                console.log(`   ✅ 技${moveIndex}: ターン${result.battleResult?.totalTurn}, 終了${result.battleResult?.isFinished}`);
                
                // ログから技名を取得
                if (result.battleLogs?.enemyPokemonLog) {
                    const logMatch = result.battleLogs.enemyPokemonLog.match(/(\w+)の(\w+)/);
                    if (logMatch) {
                        console.log(`   📝 使用技: ${logMatch[2]}`);
                    }
                }
            } else {
                console.log(`   ❌ 技${moveIndex}の処理失敗`);
            }
        }
        
        // 次の技テストまで少し待機
        await new Promise(resolve => setTimeout(resolve, 300));
    }
};

// メインテスト実行
const runBattleFlowTests = async () => {
    console.log('🚀 === バトルフローテスト開始 ===\n');
    console.log(`🎯 テスト対象: ${API_BASE_URL}`);
    console.log(`👤 テストプレイヤーID: ${TEST_PLAYER_ID}\n`);
    
    try {
        // 1. テストプレイヤー準備
        await setupTestPlayer();
        
        // 2. バトル処理テスト（個別アクション）
        await testBattleProcessWithRealData();
        
        // 3. 完全バトルフロー再現
        await testFullBattleFlow();
        
        // 4. 異常系テスト
        await testErrorCases();
        
        // 5. 特定バトルシナリオ検証テスト
        await testSpecificBattleScenarios();
        
        // 6. クリーンアップ
        await cleanup();
        
        console.log('\n🎉 === バトルフローテスト完了 ===');
        
    } catch (error) {
        console.error('❌ テスト実行中にエラーが発生しました:', error);
    }
};

// テスト実行
runBattleFlowTests().catch(console.error);
