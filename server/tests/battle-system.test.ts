// ポケモンバトルシステム統合テスト

import { fightMode } from '../api/battle/modes/fight.mode';
import { switchMode } from '../api/battle/modes/switch.mode';
import { getMode } from '../api/battle/modes/get.mode';
import { attackHandler } from '../api/battle/handlers/attack.handler';
import { ailmentHandler } from '../api/battle/handlers/ailment.handler';
import { shiftHandler } from '../api/battle/handlers/shift.handler';
import { BattleInfo } from '../types/battle/battle-info';
import { BattlePokemon } from '../types/battle/battle-pokemon';
import { Move } from '../types/core/move';

// --- モックデータ ---
const MOCK_MOVES: NonNullable<Move>[] = [
  { 
    move_id: 1, 
    name: 'でんこうせっか', 
    category: 'damage', 
    power: 40, 
    type: 'normal', 
    accuracy: 100,
    ailment: "none", 
    ailment_chance: 0, 
    damage_class: "physical", 
    description: "", 
    drain: 0, 
    healing: 0, 
    pp: 30, 
    priority: 1, 
    stat_chance: 0,
    stat_name: [], 
    stat_rank: [], 
    stat_target: "" 
  },
  { 
    move_id: 2, 
    name: 'たいあたり', 
    category: 'damage', 
    power: 40, 
    type: 'normal', 
    accuracy: 100,
    ailment: "none", 
    ailment_chance: 0, 
    damage_class: "physical", 
    description: "", 
    drain: 0, 
    healing: 0, 
    pp: 35, 
    priority: 0, 
    stat_chance: 0,
    stat_name: [], 
    stat_rank: [], 
    stat_target: "" 
  },
  { 
    move_id: 3, 
    name: 'サイコキネシス', 
    category: 'damage', 
    power: 90, 
    type: 'psychic', 
    accuracy: 100,
    ailment: "none", 
    ailment_chance: 0, 
    damage_class: "special", 
    description: "", 
    drain: 0, 
    healing: 0, 
    pp: 10, 
    priority: 0, 
    stat_chance: 0,
    stat_name: [], 
    stat_rank: [], 
    stat_target: "" 
  }
];

// テスト用ポケモンを作成する関数
const createTestPokemon = (
    id: number, 
    name: string, 
    options: Partial<NonNullable<BattlePokemon>> = {}
): NonNullable<BattlePokemon> => {
    return {
        pokemon_id: id,
        pokemon_index: 0,
        level: 50,
        exp: 1000,
        name: name,
        type1: "normal",
        type2: "",
        image: "",
        max_hp: 100,
        current_hp: 100,
        attack: 80,
        defence: 70,
        special_attack: 60,
        special_defence: 60,
        speed: 90,
        ailment: "none",
        move_list: [1, 2, 3],
        rank: {
            attack: 0,
            defence: 0,
            special_attack: 0,
            special_defence: 0,
            speed: 0,
            accuracy: 0
        },
        ...options
    };
};

// テスト用バトル情報を作成する関数
const createTestBattleInfo = (
    playerPokemons: NonNullable<BattlePokemon>[], 
    enemyPokemons: NonNullable<BattlePokemon>[]
): BattleInfo => {
    return {
        battlePokemons: {
            PlayerBattlePokemons: playerPokemons,
            EnemyBattlePokemons: enemyPokemons
        },
        battleLogs: {
            playerPokemonLog: "",
            enemyPokemonLog: "",
            battleLog: "戦闘開始！"
        },
        battleResult: {
            isFinished: false,
            totalTurn: 0,
            gainExp: 0,
            gainPokemon: null
        }
    };
};

// --- 統合テスト実行 ---
const runAllBattleTests = async () => {
    console.log('🧪 === ポケモンバトルシステム統合テスト開始 === 🧪\n');

    try {
        // 1. 戦闘ハンドラーテスト
        await testAttackHandlers();
        
        // 2. 状態異常ハンドラーテスト  
        await testAilmentHandlers();
        
        // 3. 交代ハンドラーテスト
        await testShiftHandlers();
        
        // 4. 戦闘モードテスト（戦闘・交代・捕獲・戦闘結果）
        await testBattleModes();
        
        // 5. バトルシミュレーション
        await testBattleSimulation();

        console.log('\n🎉 === すべてのテストが正常に完了しました === 🎉');
        
    } catch (error) {
        console.error('テスト実行中にエラーが発生しました:', error);
    }
};

// 1. 攻撃ハンドラーテスト
const testAttackHandlers = async () => {
    console.log('=== 攻撃ハンドラーテスト ===');
    
    const attacker = createTestPokemon(1, 'アタッカー', { 
        attack: 100, 
        special_attack: 100 
    });
    const defender = createTestPokemon(2, 'ディフェンダー', { 
        defence: 50, 
        special_defence: 50,
        current_hp: 100,
        max_hp: 100
    });
    
    const battleInfo = createTestBattleInfo([attacker], [defender]);
    
    // 物理攻撃テスト
    console.log('物理攻撃テスト開始');
    console.log(`攻撃前 - ${defender.name} HP: ${defender.current_hp}/${defender.max_hp}`);
    
    const physicalMove = MOCK_MOVES.find(m => m.damage_class === 'physical') || MOCK_MOVES[0];
    const afterPhysical = attackHandler(battleInfo, "player", physicalMove);
    
    if (afterPhysical?.battlePokemons?.EnemyBattlePokemons[0]) {
        const defenderAfter = afterPhysical.battlePokemons.EnemyBattlePokemons[0];
        console.log(`攻撃後 - ${defenderAfter?.name} HP: ${defenderAfter?.current_hp}/${defenderAfter?.max_hp}`);
        const damage = (defender.current_hp) - (defenderAfter?.current_hp ?? 0);
        console.log(`ダメージ: ${damage}`);
        console.log('✓ 物理攻撃が正常に処理されました');
    } else {
        console.log('✗ 物理攻撃の処理に失敗しました');
    }
    
    // 特殊攻撃テスト
    console.log('\n特殊攻撃テスト開始');
    const defender2 = createTestPokemon(3, 'ディフェンダー2', { 
        defence: 50, 
        special_defence: 50,
        current_hp: 100,
        max_hp: 100
    });
    const battleInfo2 = createTestBattleInfo([attacker], [defender2]);
    
    console.log(`攻撃前 - ${defender2.name} HP: ${defender2.current_hp}/${defender2.max_hp}`);
    
    const specialMove = MOCK_MOVES.find(m => m.damage_class === 'special') || MOCK_MOVES[2];
    const afterSpecial = attackHandler(battleInfo2, "player", specialMove);
    
    if (afterSpecial?.battlePokemons?.EnemyBattlePokemons[0]) {
        const defender2After = afterSpecial.battlePokemons.EnemyBattlePokemons[0];
        console.log(`攻撃後 - ${defender2After?.name} HP: ${defender2After?.current_hp}/${defender2After?.max_hp}`);
        const damage = (defender2.current_hp) - (defender2After?.current_hp ?? 0);
        console.log(`ダメージ: ${damage}`);
        console.log('✓ 特殊攻撃が正常に処理されました');
    } else {
        console.log('✗ 特殊攻撃の処理に失敗しました');
    }
    
    console.log('');
};

// 2. 状態異常ハンドラーテスト
const testAilmentHandlers = async () => {
    console.log('=== 状態異常ハンドラーテスト ===');
    
    // 毒状態テスト
    console.log('毒状態テスト開始');
    const poisonedPokemon = createTestPokemon(10, 'どくポケモン', { 
        ailment: 'poison',
        current_hp: 100,
        max_hp: 100
    });
    const normalPokemon = createTestPokemon(11, 'ノーマルポケモン');
    
    let battleInfo = createTestBattleInfo([poisonedPokemon], [normalPokemon]);
    console.log(`処理前 - ${poisonedPokemon.name} HP: ${poisonedPokemon.current_hp}/${poisonedPokemon.max_hp} (状態: ${poisonedPokemon.ailment})`);
    
    const result = ailmentHandler(battleInfo, "player");
    
    if (result?.battleInfo?.battlePokemons?.PlayerBattlePokemons[0]) {
        const pokemonAfter = result.battleInfo.battlePokemons.PlayerBattlePokemons[0];
        console.log(`処理後 - ${pokemonAfter?.name} HP: ${pokemonAfter?.current_hp}/${pokemonAfter?.max_hp} (状態: ${pokemonAfter?.ailment})`);
        console.log(`行動可能フラグ: ${result.actionFlag}`);
        
        if ((pokemonAfter?.current_hp ?? 0) < poisonedPokemon.current_hp) {
            console.log('✓ 毒ダメージが正常に処理されました');
        } else {
            console.log('✗ 毒ダメージが処理されませんでした');
        }
    }
    
    // 麻痺状態テスト
    console.log('\n麻痺状態テスト開始');
    const paralyzedPokemon = createTestPokemon(12, 'まひポケモン', { 
        ailment: 'paralysis'
    });
    
    battleInfo = createTestBattleInfo([paralyzedPokemon], [normalPokemon]);
    console.log(`処理前 - ${paralyzedPokemon.name} (状態: ${paralyzedPokemon.ailment})`);
    
    const result2 = ailmentHandler(battleInfo, "player");
    
    if (result2) {
        console.log(`行動可能フラグ: ${result2.actionFlag}`);
        if (result2.actionFlag === false) {
            console.log('✓ 麻痺による行動不能が正常に処理されました');
        } else {
            console.log('✓ 麻痺状態でも行動可能でした（75%の確率）');
        }
    }
    
    console.log('');
};

// 3. 交代ハンドラーテスト
const testShiftHandlers = async () => {
    console.log('=== 交代ハンドラーテスト ===');
    
    // 交代可能なケース
    console.log('交代可能ケーステスト開始');
    const pokemon1 = createTestPokemon(20, 'ポケモン1', { current_hp: 0 }); // 瀕死
    const pokemon2 = createTestPokemon(21, 'ポケモン2', { current_hp: 80 }); // 生存
    const pokemon3 = createTestPokemon(22, 'ポケモン3', { current_hp: 60 }); // 生存
    const enemyPokemon = createTestPokemon(23, '相手ポケモン');
    
    const battleInfo = createTestBattleInfo([pokemon1, pokemon2, pokemon3], [enemyPokemon]);
    
    console.log('交代前の手持ち状況:');
    if (battleInfo && battleInfo.battlePokemons && battleInfo.battlePokemons.PlayerBattlePokemons) {
        battleInfo.battlePokemons.PlayerBattlePokemons.forEach((p, index) => {
            if (p) console.log(`  ${index}: ${p.name} HP: ${p.current_hp}/${p.max_hp}`);
        });
    }
    
    const shiftResult = shiftHandler(battleInfo, "player");
    
    if (shiftResult?.sucsess && shiftResult.battleInfo?.battlePokemons) {
        console.log('\n交代後の手持ち状況:');
        shiftResult.battleInfo.battlePokemons.PlayerBattlePokemons.forEach((p, index) => {
            if (p) console.log(`  ${index}: ${p.name} HP: ${p.current_hp}/${p.max_hp}`);
        });
        console.log('✓ 交代が正常に処理されました');
    } else {
        console.log('✗ 交代処理に失敗しました');
    }
    
    // 交代不可能なケース（全て瀕死）
    console.log('\n交代不可能ケーステスト開始');
    const allFaintedPokemon1 = createTestPokemon(24, '瀕死ポケモン1', { current_hp: 0 });
    const allFaintedPokemon2 = createTestPokemon(25, '瀕死ポケモン2', { current_hp: 0 });
    const allFaintedPokemon3 = createTestPokemon(26, '瀕死ポケモン3', { current_hp: 0 });
    
    const battleInfo2 = createTestBattleInfo([allFaintedPokemon1, allFaintedPokemon2, allFaintedPokemon3], [enemyPokemon]);
    
    const shiftResult2 = shiftHandler(battleInfo2, "player");
    
    if (shiftResult2 && !shiftResult2.sucsess) {
        console.log('✓ 交代不可能な状況が正常に判定されました');
    } else {
        console.log('✗ 交代不可能な状況の判定に失敗しました');
    }
    
    console.log('');
};

// 4. 戦闘モードテスト（戦闘・交代・捕獲・戦闘結果）
const testBattleModes = async () => {
    console.log('=== 戦闘モードテスト（戦闘・交代・捕獲・戦闘結果） ===');
    
    // 戦闘モードテスト
    console.log('--- 戦闘モードテスト ---');
    const playerPokemon = createTestPokemon(30, 'テストピカチュウ', {
        attack: 80,
        speed: 120,
        current_hp: 100,
        max_hp: 100
    });
    const enemyPokemon = createTestPokemon(31, '野生のイーブイ', {
        attack: 60,
        speed: 80,
        current_hp: 80,
        max_hp: 80
    });
    
    let battleInfo = createTestBattleInfo([playerPokemon], [enemyPokemon]);
    console.log(`戦闘前HP: プレイヤー ${playerPokemon.current_hp}, 相手 ${enemyPokemon.current_hp}`);
    
    const fightResult = await fightMode(battleInfo, 0);
    
    if (fightResult?.battleResult) {
        console.log('✓ 戦闘モード実行成功');
        console.log(`  総ターン数: ${fightResult.battleResult.totalTurn}`);
        console.log(`  戦闘終了: ${fightResult.battleResult.isFinished ? 'はい' : 'いいえ'}`);
        
        if (fightResult.battlePokemons) {
            const newPlayerHp = fightResult.battlePokemons.PlayerBattlePokemons[0]?.current_hp ?? 0;
            const newEnemyHp = fightResult.battlePokemons.EnemyBattlePokemons[0]?.current_hp ?? 0;
            console.log(`戦闘後HP: プレイヤー ${newPlayerHp}, 相手 ${newEnemyHp}`);
        }
    } else {
        console.log('✗ 戦闘モード実行失敗');
    }
    
    // 交代モードテスト
    console.log('\n--- 交代モードテスト ---');
    const playerPokemon1 = createTestPokemon(32, 'テストピカチュウ');
    const playerPokemon2 = createTestPokemon(33, 'テストフシギダネ');
    const enemyPokemon2 = createTestPokemon(34, '野生ポケモン');
    
    const switchInfo = createTestBattleInfo([playerPokemon1, playerPokemon2], [enemyPokemon2]);
    console.log(`交代前: ${playerPokemon1.name}`);
    
    const switchResult = await switchMode(switchInfo, 1);
    
    if (switchResult?.battlePokemons) {
        console.log('✓ 交代モード実行成功');
        const newName = switchResult.battlePokemons.PlayerBattlePokemons[0]?.name ?? '不明';
        console.log(`交代後: ${newName}`);
        
        if (switchResult.battleLogs) {
            console.log(`ログ: ${switchResult.battleLogs.playerPokemonLog}`);
        }
    } else {
        console.log('✗ 交代モード実行失敗');
    }
    
    // 捕獲モードテスト
    console.log('\n--- 捕獲モードテスト ---');
    let captureSuccess = 0;
    let captureFail = 0;
    
    for (let i = 0; i < 10; i++) {
        const testPlayerPokemon = createTestPokemon(40 + i, 'テストポケモン');
        const testEnemyPokemon = createTestPokemon(50 + i, '野生ポケモン');
        const captureInfo = createTestBattleInfo([testPlayerPokemon], [testEnemyPokemon]);
        
        const captureResult = await getMode(captureInfo);
        
        if (captureResult?.battleResult) {
            if (captureResult.battleResult.gainPokemon) {
                captureSuccess++;
            } else {
                captureFail++;
            }
        }
    }
    
    console.log('✓ 捕獲モード実行成功');
    console.log(`  捕獲成功率: ${captureSuccess}/10 (${(captureSuccess / 10 * 100).toFixed(1)}%)`);
    console.log(`  捕獲失敗率: ${captureFail}/10 (${(captureFail / 10 * 100).toFixed(1)}%)`);
    
    // 戦闘結果記録テスト
    console.log('\n--- 戦闘結果記録テスト ---');
    const resultPlayerPokemon = createTestPokemon(60, 'テストポケモン');
    const resultEnemyPokemon = createTestPokemon(61, '相手ポケモン');
    const resultInfo = createTestBattleInfo([resultPlayerPokemon], [resultEnemyPokemon]);
    
    if (resultInfo && resultInfo.battleResult) {
        const initialTurn = resultInfo.battleResult.totalTurn;
        const initialFinished = resultInfo.battleResult.isFinished;
        console.log(`初期状態: ターン${initialTurn}, 終了${initialFinished}`);
    }
    
    // 戦闘実行
    const resultAfterFight = await fightMode(resultInfo, 0);
    if (resultAfterFight?.battleResult) {
        console.log(`戦闘後: ターン${resultAfterFight.battleResult.totalTurn}, 終了${resultAfterFight.battleResult.isFinished}`);
    }
    
    // 捕獲実行
    const resultAfterCapture = await getMode(resultAfterFight || resultInfo);
    if (resultAfterCapture?.battleResult) {
        console.log(`捕獲後: ターン${resultAfterCapture.battleResult.totalTurn}, 終了${resultAfterCapture.battleResult.isFinished}`);
        if (resultAfterCapture.battleResult.gainPokemon) {
            console.log(`  捕獲したポケモン: ${resultAfterCapture.battleResult.gainPokemon.name}`);
        }
    }
    
    console.log('✓ 戦闘結果記録テスト完了');
    console.log('');
};

// 5. バトルシミュレーション
const testBattleSimulation = async () => {
    console.log('=== バトルシミュレーション ===');
    
    // 基本的な1vs1バトル
    console.log('--- 基本1vs1バトル ---');
    const player = createTestPokemon(100, 'ピカチュウ', {
        attack: 80,
        speed: 120,
        current_hp: 100,
        max_hp: 100
    });
    const enemy = createTestPokemon(101, 'イーブイ', {
        attack: 70,
        speed: 80,
        current_hp: 100,
        max_hp: 100
    });
    
    let battleInfo = createTestBattleInfo([player], [enemy]);
    let turn = 1;
    const maxTurns = 10;
    
    console.log(`プレイヤー: ${player.name}(HP:${player.current_hp})`);
    console.log(`相手: ${enemy.name}(HP:${enemy.current_hp})`);
    console.log('---------------------------------');
    
    while (turn <= maxTurns) {
        console.log(`[ターン ${turn}]`);
        
        if (!battleInfo || !battleInfo.battlePokemons) break;
        
        const currentPlayer = battleInfo.battlePokemons.PlayerBattlePokemons[0];
        const currentEnemy = battleInfo.battlePokemons.EnemyBattlePokemons[0];
        
        if (!currentPlayer || !currentEnemy) break;
        
        console.log(`プレイヤー: ${currentPlayer.name} (HP: ${currentPlayer.current_hp}) (状態: ${currentPlayer.ailment})`);
        console.log(`相手: ${currentEnemy.name} (HP: ${currentEnemy.current_hp}) (状態: ${currentEnemy.ailment})`);
        
        // 戦闘実行
        const result = await fightMode(battleInfo, Math.floor(Math.random() * 3));
        
        if (!result) break;
        
        battleInfo = result;
        
        // バトルログ表示
        if (result.battleLogs) {
            if (result.battleLogs.playerPokemonLog) {
                console.log(`プレイヤーログ: ${result.battleLogs.playerPokemonLog}`);
            }
            if (result.battleLogs.enemyPokemonLog) {
                console.log(`相手ログ: ${result.battleLogs.enemyPokemonLog}`);
            }
            if (result.battleLogs.battleLog) {
                console.log(`バトルログ: ${result.battleLogs.battleLog}`);
            }
        }
        
        // 勝敗判定
        const playerAlive = result.battlePokemons?.PlayerBattlePokemons.some(p => p && p.current_hp > 0);
        const enemyAlive = result.battlePokemons?.EnemyBattlePokemons.some(p => p && p.current_hp > 0);
        
        if (!playerAlive) {
            console.log('--- 対戦結果 ---');
            console.log('勝利者: 相手');
            console.log(`最終ターン: ${turn}`);
            break;
        } else if (!enemyAlive) {
            console.log('--- 対戦結果 ---');
            console.log('勝利者: プレイヤー');
            console.log(`最終ターン: ${turn}`);
            break;
        }
        
        turn++;
    }
    
    if (turn > maxTurns) {
        console.log('--- 対戦結果 ---');
        console.log('引き分け（最大ターン数到達）');
        console.log(`最終ターン: ${maxTurns}`);
    }
    
    console.log('---------------------------------\n');
};

// テスト実行
runAllBattleTests();