// /pkcv2/server/tests/battle-system.test.ts

import { battleInfoService } from '../api/battle/services/battle-info.service';
import { shiftHandler } from '../api/battle/handlers/shift.handler';
import { ailmentHandler } from '../api/battle/handlers/ailment.handler';
import { attackHandler } from '../api/battle/handlers/attack.handler';
import { BattleInfo } from '../type/battle/battleInfo.type';
import { BattlePokemon } from '../type/battle/battlePokemon.type';
import { Move } from '../type/move.type';
import { battleAction } from '../type/battle/battleAction.type';

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
    name: 'はかいこうせん', 
    category: 'damage', 
    power: 150, 
    type: 'normal', 
    accuracy: 90,
    ailment: "none", 
    ailment_chance: 0, 
    damage_class: "special", 
    description: "", 
    drain: 0, 
    healing: 0, 
    pp: 5, 
    priority: 0, 
    stat_chance: 0,
    stat_name: [], 
    stat_rank: [], 
    stat_target: "" 
  },
  { 
    move_id: 4, 
    name: 'どくどく', 
    category: 'ailment', 
    power: 0, 
    type: 'poison', 
    accuracy: 90,
    ailment: "poison", 
    ailment_chance: 100, 
    damage_class: "status", 
    description: "", 
    drain: 0, 
    healing: 0, 
    pp: 10, 
    priority: 0, 
    stat_chance: 0,
    stat_name: [], 
    stat_rank: [], 
    stat_target: "" 
  },
  { 
    move_id: 5, 
    name: 'でんじは', 
    category: 'ailment', 
    power: 0, 
    type: 'electric', 
    accuracy: 100,
    ailment: "paralysis", 
    ailment_chance: 100, 
    damage_class: "status", 
    description: "", 
    drain: 0, 
    healing: 0, 
    pp: 20, 
    priority: 0, 
    stat_chance: 0,
    stat_name: [], 
    stat_rank: [], 
    stat_target: "" 
  },
  { 
    move_id: 6, 
    name: 'ねむりごな', 
    category: 'ailment', 
    power: 0, 
    type: 'grass', 
    accuracy: 75,
    ailment: "sleep", 
    ailment_chance: 100, 
    damage_class: "status", 
    description: "", 
    drain: 0, 
    healing: 0, 
    pp: 15, 
    priority: 0, 
    stat_chance: 0,
    stat_name: [], 
    stat_rank: [], 
    stat_target: "" 
  },
  { 
    move_id: 7, 
    name: 'かえんほうしゃ', 
    category: 'damage', 
    power: 90, 
    type: 'fire', 
    accuracy: 100,
    ailment: "burn", 
    ailment_chance: 10, 
    damage_class: "special", 
    description: "", 
    drain: 0, 
    healing: 0, 
    pp: 15, 
    priority: 0, 
    stat_chance: 0,
    stat_name: [], 
    stat_rank: [], 
    stat_target: "" 
  },
  { 
    move_id: 8, 
    name: 'れいとうビーム', 
    category: 'damage', 
    power: 90, 
    type: 'ice', 
    accuracy: 100,
    ailment: "freeze", 
    ailment_chance: 10, 
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
  },
  { 
    move_id: 9, 
    name: 'あやしいひかり', 
    category: 'ailment', 
    power: 0, 
    type: 'ghost', 
    accuracy: 100,
    ailment: "confusion", 
    ailment_chance: 100, 
    damage_class: "status", 
    description: "", 
    drain: 0, 
    healing: 0, 
    pp: 10, 
    priority: 0, 
    stat_chance: 0,
    stat_name: [], 
    stat_rank: [], 
    stat_target: "" 
  },
];


// --- ヘルパー関数 ---

const createMockPokemon = (id: number, name: string, overrides: Partial<NonNullable<BattlePokemon>> = {}): NonNullable<BattlePokemon> => {
    const defaultPokemon: NonNullable<BattlePokemon> = {
        pokemon_id: id,
        pokemon_index: 1,
        name: name,
        level: 50,
        exp: 0,
        type1: 'normal',
        type2: '',
        image: '',
        max_hp: 100,
        current_hp: 100,
        attack: 50,
        defence: 50,
        special_attack: 50,
        special_defence: 50,
        speed: 50,
        move_list: [3,3,3], 
        rank: { accuracy: 0, attack: 0, defence: 0, special_attack: 0, special_defence: 0, speed: 0 },
        ailment: 'none',
    };

    const pokemon = { ...defaultPokemon, ...overrides };
    if (pokemon.current_hp > pokemon.max_hp) {
        pokemon.current_hp = pokemon.max_hp;
    }
    return pokemon;
};

const createInitialBattleInfo = (playerPokemons: BattlePokemon[], enemyPokemons: BattlePokemon[]): NonNullable<BattleInfo> => {
    return {
        battlePokemons: {
            PlayerBattlePokemons: [...playerPokemons],
            EnemyBattlePokemons: [...enemyPokemons],
        },
        battleResult: {
            isFinished: false,
            totalTurn: 0,
            gainExp: 0,
            gainPokemon: null,
        },
        battleLogs: {
            playerPokemonLog: '',
            enemyPokemonLog: '',
            battleLog: 'バトルかいし！',
        },
    };
};

// --- テスト実行 ---
const runBattleSimulation = async (battleNumber: number, initialBattleInfo: BattleInfo) => {
    if (!initialBattleInfo || !initialBattleInfo.battlePokemons) {
        console.error(`テスト対戦 ${battleNumber} は初期化に失敗しました。`);
        return;
    }
    console.log(`\n--- テスト対戦 ${battleNumber} 開始 ---`);
    console.log(`プレイヤー: ${initialBattleInfo.battlePokemons.PlayerBattlePokemons.map(p => p ? `${p.name ?? 'N/A'}(HP:${p.current_hp ?? 0})` : 'N/A').join(', ')}`);
    console.log(`相手: ${initialBattleInfo.battlePokemons.EnemyBattlePokemons.map(p => p ? `${p.name ?? 'N/A'}(HP:${p.current_hp ?? 0})` : 'N/A').join(', ')}`);
    console.log('---------------------------------');

    let battleInfo: BattleInfo = JSON.parse(JSON.stringify(initialBattleInfo));
    let turn = 1;

    while (turn <= 30) {
        if (!battleInfo || !battleInfo.battlePokemons) {
            console.log(`[TURN ${turn}] battleInfoが不正な状態になったためバトルを終了します。`);
            break;
        }
        const playerPokemon = battleInfo.battlePokemons.PlayerBattlePokemons[0];
        const enemyPokemon = battleInfo.battlePokemons.EnemyBattlePokemons[0];

        if (!playerPokemon || !enemyPokemon) {
            console.log(`[TURN ${turn}] プレイヤーまたは相手のポケモンが見つかりません。`);
            break;
        }
        if ((playerPokemon?.current_hp ?? 0) <= 0 || (enemyPokemon?.current_hp ?? 0) <= 0) {
            break; // どちらかの手持ちが全滅したらループを抜ける
        }

        if (!playerPokemon || (playerPokemon.current_hp ?? 0) === 0) {
            const shiftResult = shiftHandler(battleInfo, "player");
            if (shiftResult && shiftResult.sucsess) {
                battleInfo = shiftResult.battleInfo;
                const newPlayerPokemon = battleInfo?.battlePokemons?.PlayerBattlePokemons[0];
                console.log(`[TURN ${turn}] プレイヤーは ${newPlayerPokemon?.name || '次のポケモン'} を繰り出した！`);
                continue;
            } else {
                console.log(`[TURN ${turn}] プレイヤーの戦えるポケモンがいない！`);
                break;
            }
        }
        if (!enemyPokemon || (enemyPokemon.current_hp ?? 0) === 0) {
            const shiftResult = shiftHandler(battleInfo, "enemy");
            if (shiftResult && shiftResult.sucsess) {
                battleInfo = shiftResult.battleInfo;
                const newEnemyPokemon = battleInfo?.battlePokemons?.EnemyBattlePokemons[0];
                console.log(`[TURN ${turn}] 相手は ${newEnemyPokemon?.name || '次のポケモン'} を繰り出した！`);
                continue;
            } else {
                console.log(`[TURN ${turn}] 相手の戦えるポケモンがいない！`);
                break;
            }
        }

        console.log(`\n[ターン ${turn}]`);
        console.log(`プレイヤー: ${playerPokemon?.name ?? 'N/A'} (HP: ${playerPokemon?.current_hp ?? 0}) (状態: ${playerPokemon?.ailment ?? 'unknown'})`);
        console.log(`相手: ${enemyPokemon?.name ?? 'N/A'} (HP: ${enemyPokemon?.current_hp ?? 0}) (状態: ${enemyPokemon?.ailment ?? 'unknown'})`);

        const action: battleAction = { action_name: 'fight', command_id: 3 };
        battleInfo = await battleInfoService(battleInfo, action);
        
        // バトルログを適切に表示
        if (battleInfo?.battleLogs) {
            if (battleInfo.battleLogs.playerPokemonLog) {
                console.log(`プレイヤーログ: ${battleInfo.battleLogs.playerPokemonLog}`);
            }
            if (battleInfo.battleLogs.enemyPokemonLog) {
                console.log(`相手ログ: ${battleInfo.battleLogs.enemyPokemonLog}`);
            }
            if (battleInfo.battleLogs.battleLog) {
                console.log(`バトルログ: ${battleInfo.battleLogs.battleLog}`);
            }
        }
        
        turn++;
    }

    const finalPlayerHp = battleInfo?.battlePokemons?.PlayerBattlePokemons.reduce((sum: number, p) => sum + (p?.current_hp || 0), 0) ?? 0;
    const finalEnemyHp = battleInfo?.battlePokemons?.EnemyBattlePokemons.reduce((sum: number, p) => sum + (p?.current_hp || 0), 0) ?? 0;

    console.log('\n--- 対戦結果 ---');
    if (finalEnemyHp <= 0 && finalPlayerHp > 0) {
        console.log(`勝利者: プレイヤー`);
    } else if (finalPlayerHp <= 0 && finalEnemyHp > 0) {
        console.log(`勝利者: 相手`);
    } else {
        console.log('引き分けまたは不明な結果');
    }
    console.log(`最終ターン: ${turn - 1}`);
    console.log(`---------------------------------\n`);
};

const runAllTests = async () => {
    console.log('🧪 === ポケモンバトル詳細テスト開始 === 🧪\n');
    
    // 詳細テスト実行
    await testAttackHandler();
    await testAilmentHandler(); 
    await testDetailedAilmentStates(); // 新しい詳細状態異常テスト
    await testShiftHandler();
    await testBattleFlow();
    
    console.log('\n📊 === 基本バトルシミュレーション === 📊\n');
    
    // 既存のテストシナリオ (1-10)
    const p1 = createMockPokemon(1, 'ピカチュウ', { speed: 100, attack: 60, move_list: [1, 2] });
    const e1 = createMockPokemon(2, 'イーブイ', { speed: 50, attack: 55, move_list: [2] });
    await runBattleSimulation(1, createInitialBattleInfo([p1], [e1]));

    const p2 = createMockPokemon(3, 'カビゴン', { speed: 30, attack: 110, max_hp: 160, current_hp: 160, move_list: [2] });
    const e2 = createMockPokemon(4, 'サンダース', { speed: 130, attack: 65, move_list: [1] });
    await runBattleSimulation(2, createInitialBattleInfo([p2], [e2]));

    const p3_1 = createMockPokemon(5, 'コラッタ', { max_hp: 30, current_hp: 30, move_list: [1] });
    const p3_2 = createMockPokemon(6, 'リザードン', { attack: 84, speed: 100, move_list: [3] });
    const e3 = createMockPokemon(7, 'カイリキー', { attack: 130, move_list: [2] });
    await runBattleSimulation(3, createInitialBattleInfo([p3_1, p3_2], [e3]));

    const p4 = createMockPokemon(8, 'ミュウツー', { special_attack: 154, speed: 130, move_list: [3] });
    const e4_1 = createMockPokemon(9, 'ポッポ', { max_hp: 40, current_hp: 40, move_list: [1] });
    const e4_2 = createMockPokemon(10, 'ラッタ', { attack: 81, speed: 97, move_list: [2] });
    await runBattleSimulation(4, createInitialBattleInfo([p4], [e4_1, e4_2]));

    const p5 = createMockPokemon(11, 'ハピナス', { max_hp: 255, current_hp: 255, defence: 10, special_defence: 135, attack: 10, move_list: [2] });
    const e5 = createMockPokemon(12, 'ツボツボ', { max_hp: 20, current_hp: 20, defence: 230, special_defence: 230, attack: 10, move_list: [2] });
    await runBattleSimulation(5, createInitialBattleInfo([p5], [e5]));

    const p6 = createMockPokemon(13, 'ベトベトン', { ailment: 'poison', move_list: [2] });
    const e6 = createMockPokemon(14, 'ナッシー', { move_list: [2] });
    await runBattleSimulation(6, createInitialBattleInfo([p6], [e6]));

    const p7 = createMockPokemon(15, 'ゲンガー', { move_list: [3] });
    const e7 = createMockPokemon(16, 'フーディン', { ailment: 'paralysis', move_list: [3] });
    await runBattleSimulation(7, createInitialBattleInfo([p7], [e7]));

    const p8 = createMockPokemon(17, 'ラムパルド', { attack: 165, defence: 60, move_list: [2] });
    const e8 = createMockPokemon(18, 'ボスゴドラ', { attack: 110, defence: 180, move_list: [2] });
    await runBattleSimulation(8, createInitialBattleInfo([p8], [e8]));

    const p9_1 = createMockPokemon(1, 'Pika', { current_hp: 1, max_hp: 1 });
    const p9_2 = createMockPokemon(2, 'Char', { attack: 80 });
    const p9_3 = createMockPokemon(3, 'Squi', { defence: 80 });
    const e9_1 = createMockPokemon(4, 'Bulb', { current_hp: 1, max_hp: 1 });
    const e9_2 = createMockPokemon(5, 'Eeve', { speed: 80 });
    const e9_3 = createMockPokemon(6, 'Snor', { max_hp: 200, current_hp: 200 });
    await runBattleSimulation(9, createInitialBattleInfo([p9_1, p9_2, p9_3], [e9_1, e9_2, e9_3]));
    
    const p10 = createMockPokemon(19, 'メタモンA', { move_list: [2] });
    const e10 = createMockPokemon(20, 'メタモンB', { move_list: [2] });
    await runBattleSimulation(10, createInitialBattleInfo([p10], [e10]));

    // 追加テストシナリオ
    const p11_1 = createMockPokemon(129, 'コイキング', { max_hp: 10, current_hp: 10, move_list: [2]});
    const p11_2 = createMockPokemon(130, 'ギャラドス', { attack: 125, speed: 81, move_list: [3] });
    const e11 = createMockPokemon(68, 'カイリキー', { attack: 130, speed: 55, move_list: [2] });
    await runBattleSimulation(11, createInitialBattleInfo([p11_1, p11_2], [e11]));

    // 相手の交代処理テスト
    const p12 = createMockPokemon(150, 'ミュウツー', { special_attack: 154, speed: 130, move_list: [3] });
    const e12_1 = createMockPokemon(10, 'キャタピー', { max_hp: 10, current_hp: 10, move_list: [2] });
    const e12_2 = createMockPokemon(12, 'バタフリー', { special_attack: 90, speed: 70, move_list: [3] });
    await runBattleSimulation(12, createInitialBattleInfo([p12], [e12_1, e12_2]));
    
    console.log('\n🎉 === すべてのテストが完了しました === 🎉');
};

// 個別の状態異常テスト関数

// 毒状態の複数ターンテスト
const testPoisonMultipleTurns = async () => {
    console.log('毒状態のポケモンを5ターン処理してダメージを確認');
    
    const poisonedPokemon = createMockPokemon(100, 'どくテスト', { 
        ailment: 'poison', 
        max_hp: 100, 
        current_hp: 100 
    });
    const normalPokemon = createMockPokemon(101, 'ノーマル', {});
    
    let battleInfo = createInitialBattleInfo([poisonedPokemon], [normalPokemon]);
    
    for (let turn = 1; turn <= 5; turn++) {
        if (!battleInfo.battlePokemons?.PlayerBattlePokemons[0]) break;
        
        const pokemon = battleInfo.battlePokemons.PlayerBattlePokemons[0];
        const hpBefore = pokemon?.current_hp ?? 0;
        
        console.log(`ターン${turn}前: HP ${hpBefore}/${pokemon?.max_hp ?? 100} (状態: ${pokemon?.ailment ?? 'unknown'})`);
        
        const result = ailmentHandler(battleInfo, "player");
        
        if (result && result.battleInfo) {
            battleInfo = result.battleInfo;
            const pokemonAfter = battleInfo.battlePokemons?.PlayerBattlePokemons[0];
            
            if (pokemonAfter) {
                const damage = hpBefore - (pokemonAfter.current_hp ?? 0);
                console.log(`ターン${turn}後: HP ${pokemonAfter.current_hp ?? 0}/${pokemonAfter.max_hp ?? 100} (ダメージ: ${damage}) (状態: ${pokemonAfter.ailment ?? 'unknown'})`);
                
                if ((pokemonAfter.current_hp ?? 0) <= 0) {
                    console.log('✓ ポケモンが毒で倒れました');
                    break;
                }
            }
        }
    }
};

// 麻痺状態の複数回判定テスト
const testParalysisMultipleChecks = async () => {
    console.log('麻痺状態のポケモンを10回処理して行動可能率を確認');
    
    let actionableCount = 0;
    let totalTests = 10;
    
    for (let test = 1; test <= totalTests; test++) {
        const paralyzedPokemon = createMockPokemon(200 + test, 'まひテスト', { 
            ailment: 'paralysis', 
            max_hp: 100, 
            current_hp: 100 
        });
        const normalPokemon = createMockPokemon(300 + test, 'ノーマル', {});
        
        const battleInfo = createInitialBattleInfo([paralyzedPokemon], [normalPokemon]);
        
        const result = ailmentHandler(battleInfo, "player");
        
        if (result && result.actionFlag) {
            actionableCount++;
        }
    }
    
    const actionableRate = (actionableCount / totalTests) * 100;
    console.log(`行動可能回数: ${actionableCount}/${totalTests} (${actionableRate.toFixed(1)}%)`);
    console.log(`理論値: 75% (麻痺で動けない確率25%)`);
    
    if (actionableRate >= 50 && actionableRate <= 100) {
        console.log('✓ 麻痺の行動可能率が妥当な範囲内です');
    } else {
        console.log('✗ 麻痺の行動可能率が想定外です');
    }
};

// 眠り状態の複数ターンテスト
const testSleepMultipleTurns = async () => {
    console.log('眠り状態のポケモンを処理して起床するまで確認');
    
    const sleepingPokemon = createMockPokemon(400, 'すいみんテスト', { 
        ailment: 'sleep', 
        max_hp: 100, 
        current_hp: 100 
    });
    const normalPokemon = createMockPokemon(401, 'ノーマル', {});
    
    let battleInfo = createInitialBattleInfo([sleepingPokemon], [normalPokemon]);
    let maxTurns = 10;
    
    for (let turn = 1; turn <= maxTurns; turn++) {
        if (!battleInfo.battlePokemons?.PlayerBattlePokemons[0]) break;
        
        const pokemon = battleInfo.battlePokemons.PlayerBattlePokemons[0];
        
        console.log(`ターン${turn}前: 状態 ${pokemon?.ailment ?? 'unknown'}`);
        
        const result = ailmentHandler(battleInfo, "player");
        
        if (result && result.battleInfo) {
            battleInfo = result.battleInfo;
            const pokemonAfter = battleInfo.battlePokemons?.PlayerBattlePokemons[0];
            
            if (pokemonAfter) {
                console.log(`ターン${turn}後: 状態 ${pokemonAfter.ailment ?? 'unknown'} (行動可能: ${result.actionFlag})`);
                
                if ((pokemonAfter.ailment ?? '') === 'none') {
                    console.log(`✓ ポケモンが${turn}ターン目に目を覚ましました`);
                    break;
                }
            }
        }
        
        if (turn === maxTurns) {
            console.log('✗ 最大ターン数に達しても起床しませんでした');
        }
    }
};

// 火傷状態の複数ターンテスト
const testBurnMultipleTurns = async () => {
    console.log('火傷状態のポケモンを5ターン処理してダメージを確認');
    
    const burnedPokemon = createMockPokemon(500, 'やけどテスト', { 
        ailment: 'burn', 
        max_hp: 100, 
        current_hp: 100 
    });
    const normalPokemon = createMockPokemon(501, 'ノーマル', {});
    
    let battleInfo = createInitialBattleInfo([burnedPokemon], [normalPokemon]);
    
    for (let turn = 1; turn <= 5; turn++) {
        if (!battleInfo.battlePokemons?.PlayerBattlePokemons[0]) break;
        
        const pokemon = battleInfo.battlePokemons.PlayerBattlePokemons[0];
        const hpBefore = pokemon?.current_hp ?? 0;
        
        console.log(`ターン${turn}前: HP ${hpBefore}/${pokemon?.max_hp ?? 100} (状態: ${pokemon?.ailment ?? 'unknown'})`);
        
        const result = ailmentHandler(battleInfo, "player");
        
        if (result && result.battleInfo) {
            battleInfo = result.battleInfo;
            const pokemonAfter = battleInfo.battlePokemons?.PlayerBattlePokemons[0];
            
            if (pokemonAfter) {
                const damage = hpBefore - (pokemonAfter.current_hp ?? 0);
                console.log(`ターン${turn}後: HP ${pokemonAfter.current_hp ?? 0}/${pokemonAfter.max_hp ?? 100} (ダメージ: ${damage}) (状態: ${pokemonAfter.ailment ?? 'unknown'})`);
                
                if ((pokemonAfter.current_hp ?? 0) <= 0) {
                    console.log('✓ ポケモンが火傷で倒れました');
                    break;
                }
            }
        }
    }
};

// 凍り状態の複数ターンテスト
const testFreezeMultipleTurns = async () => {
    console.log('凍り状態のポケモンを処理して回復するまで確認');
    
    const frozenPokemon = createMockPokemon(600, 'こおりテスト', { 
        ailment: 'freeze', 
        max_hp: 100, 
        current_hp: 100 
    });
    const normalPokemon = createMockPokemon(601, 'ノーマル', {});
    
    let battleInfo = createInitialBattleInfo([frozenPokemon], [normalPokemon]);
    let maxTurns = 10;
    
    for (let turn = 1; turn <= maxTurns; turn++) {
        if (!battleInfo.battlePokemons?.PlayerBattlePokemons[0]) break;
        
        const pokemon = battleInfo.battlePokemons.PlayerBattlePokemons[0];
        
        console.log(`ターン${turn}前: 状態 ${pokemon?.ailment ?? 'unknown'}`);
        
        const result = ailmentHandler(battleInfo, "player");
        
        if (result && result.battleInfo) {
            battleInfo = result.battleInfo;
            const pokemonAfter = battleInfo.battlePokemons?.PlayerBattlePokemons[0];
            
            if (pokemonAfter) {
                console.log(`ターン${turn}後: 状態 ${pokemonAfter.ailment ?? 'unknown'} (行動可能: ${result.actionFlag})`);
                
                if ((pokemonAfter.ailment ?? '') === 'none') {
                    console.log(`✓ ポケモンが${turn}ターン目に凍えが解けました`);
                    break;
                }
            }
        }
        
        if (turn === maxTurns) {
            console.log('✗ 最大ターン数に達しても凍えが解けませんでした');
        }
    }
};

// 混乱状態の複数ターンテスト
const testConfusionMultipleTurns = async () => {
    console.log('混乱状態のポケモンを10回処理して自傷・行動不能率を確認');
    
    let selfDamageCount = 0;
    let cannotActCount = 0;
    let totalTests = 10;
    
    for (let test = 1; test <= totalTests; test++) {
        const confusedPokemon = createMockPokemon(700 + test, 'こんらんテスト', { 
            ailment: 'confusion', 
            max_hp: 100, 
            current_hp: 100 
        });
        const normalPokemon = createMockPokemon(800 + test, 'ノーマル', {});
        
        const battleInfo = createInitialBattleInfo([confusedPokemon], [normalPokemon]);
        const hpBefore = confusedPokemon.current_hp ?? 0;
        
        const result = ailmentHandler(battleInfo, "player");
        
        if (result && result.battleInfo) {
            const pokemonAfter = result.battleInfo.battlePokemons?.PlayerBattlePokemons[0];
            
            if (pokemonAfter) {
                const damage = hpBefore - (pokemonAfter.current_hp ?? 0);
                
                if (damage > 0) {
                    selfDamageCount++;
                    console.log(`テスト${test}: 自傷ダメージ ${damage}`);
                } else if (!result.actionFlag) {
                    cannotActCount++;
                    console.log(`テスト${test}: 混乱で行動不能`);
                } else {
                    console.log(`テスト${test}: 正常に行動可能`);
                }
            }
        }
    }
    
    const selfDamageRate = (selfDamageCount / totalTests) * 100;
    const cannotActRate = (cannotActCount / totalTests) * 100;
    
    console.log(`自傷ダメージ: ${selfDamageCount}/${totalTests} (${selfDamageRate.toFixed(1)}%)`);
    console.log(`行動不能: ${cannotActCount}/${totalTests} (${cannotActRate.toFixed(1)}%)`);
    console.log(`理論値: 各50%の確率で自傷ダメージまたは行動不能`);
    
    if ((selfDamageRate + cannotActRate) >= 30) {
        console.log('✓ 混乱の効果が妥当な範囲内です');
    } else {
        console.log('✗ 混乱の効果が想定外です');
    }
};

// 状態異常治癒テスト
const testAilmentRecovery = async () => {
    console.log('状態異常の自然回復をテスト');
    
    // 眠りから目覚めるテスト
    let recoverCount = 0;
    let totalTests = 20;
    
    for (let test = 1; test <= totalTests; test++) {
        const sleepingPokemon = createMockPokemon(900 + test, 'すいみん回復テスト', { 
            ailment: 'sleep', 
            max_hp: 100, 
            current_hp: 100 
        });
        const normalPokemon = createMockPokemon(1000 + test, 'ノーマル', {});
        
        const battleInfo = createInitialBattleInfo([sleepingPokemon], [normalPokemon]);
        
        const result = ailmentHandler(battleInfo, "player");
        
        if (result && result.battleInfo) {
            const pokemonAfter = result.battleInfo.battlePokemons?.PlayerBattlePokemons[0];
            
            if (pokemonAfter && (pokemonAfter.ailment ?? '') === 'none') {
                recoverCount++;
            }
        }
    }
    
    const recoverRate = (recoverCount / totalTests) * 100;
    console.log(`眠りからの回復: ${recoverCount}/${totalTests} (${recoverRate.toFixed(1)}%)`);
    console.log(`理論値: 40% (60%の確率で眠り続ける)`);
    
    if (recoverRate >= 20 && recoverRate <= 60) {
        console.log('✓ 眠りからの回復率が妥当な範囲内です');
    } else {
        console.log('✗ 眠りからの回復率が想定外です');
    }
    
    // 凍りから回復するテスト
    recoverCount = 0;
    
    for (let test = 1; test <= totalTests; test++) {
        const frozenPokemon = createMockPokemon(1100 + test, 'こおり回復テスト', { 
            ailment: 'freeze', 
            max_hp: 100, 
            current_hp: 100 
        });
        const normalPokemon = createMockPokemon(1200 + test, 'ノーマル', {});
        
        const battleInfo = createInitialBattleInfo([frozenPokemon], [normalPokemon]);
        
        const result = ailmentHandler(battleInfo, "player");
        
        if (result && result.battleInfo) {
            const pokemonAfter = result.battleInfo.battlePokemons?.PlayerBattlePokemons[0];
            
            if (pokemonAfter && (pokemonAfter.ailment ?? '') === 'none') {
                recoverCount++;
            }
        }
    }
    
    const freezeRecoverRate = (recoverCount / totalTests) * 100;
    console.log(`凍りからの回復: ${recoverCount}/${totalTests} (${freezeRecoverRate.toFixed(1)}%)`);
    console.log(`理論値: 40% (60%の確率で凍り続ける)`);
    
    if (freezeRecoverRate >= 20 && freezeRecoverRate <= 60) {
        console.log('✓ 凍りからの回復率が妥当な範囲内です');
    } else {
        console.log('✗ 凍りからの回復率が想定外です');
    }
};

// --- 詳細テスト関数 ---
const testAttackHandler = async () => {
    console.log('\n=== 攻撃ハンドラーテスト ===');
    
    const attacker = createMockPokemon(1, 'アタッカー', { attack: 100, special_attack: 100 });
    const defender = createMockPokemon(2, 'ディフェンダー', { defence: 50, special_defence: 50, max_hp: 100, current_hp: 100 });
    
    const battleInfo = createInitialBattleInfo([attacker], [defender]);
    
    // 物理攻撃テスト
    console.log('物理攻撃テスト開始');
    console.log(`攻撃前 - ${defender.name ?? 'N/A'} HP: ${defender.current_hp ?? 0}/${defender.max_hp ?? 100}`);
    
    const physicalMove = MOCK_MOVES.find(m => m.damage_class === 'physical') || MOCK_MOVES[0];
    const afterPhysical = attackHandler(battleInfo, "player", physicalMove);
    
    if (afterPhysical && afterPhysical.battlePokemons && afterPhysical.battlePokemons.EnemyBattlePokemons[0]) {
        const defenderAfter = afterPhysical.battlePokemons.EnemyBattlePokemons[0];
        console.log(`攻撃後 - ${defenderAfter?.name ?? 'N/A'} HP: ${defenderAfter?.current_hp ?? 0}/${defenderAfter?.max_hp ?? 100}`);
        console.log(`ダメージ: ${(defender.current_hp ?? 0) - (defenderAfter?.current_hp ?? 0)}`);
        console.log('✓ 物理攻撃が正常に処理されました');
    } else {
        console.log('✗ 物理攻撃の処理に失敗しました');
    }
    
    // 特殊攻撃テスト
    console.log('\n特殊攻撃テスト開始');
    const defender2 = createMockPokemon(3, 'ディフェンダー2', { defence: 50, special_defence: 50, max_hp: 100, current_hp: 100 });
    const battleInfo2 = createInitialBattleInfo([attacker], [defender2]);
    
    console.log(`攻撃前 - ${defender2.name ?? 'N/A'} HP: ${defender2.current_hp ?? 0}/${defender2.max_hp ?? 100}`);
    
    const specialMove = MOCK_MOVES.find(m => m.damage_class === 'special') || MOCK_MOVES[2];
    const afterSpecial = attackHandler(battleInfo2, "player", specialMove);
    
    if (afterSpecial && afterSpecial.battlePokemons && afterSpecial.battlePokemons.EnemyBattlePokemons[0]) {
        const defender2After = afterSpecial.battlePokemons.EnemyBattlePokemons[0];
        console.log(`攻撃後 - ${defender2After?.name ?? 'N/A'} HP: ${defender2After?.current_hp ?? 0}/${defender2After?.max_hp ?? 100}`);
        console.log(`ダメージ: ${(defender2.current_hp ?? 0) - (defender2After?.current_hp ?? 0)}`);
        console.log('✓ 特殊攻撃が正常に処理されました');
    } else {
        console.log('✗ 特殊攻撃の処理に失敗しました');
    }
};

const testAilmentHandler = async () => {
    console.log('\n=== 状態異常ハンドラーテスト ===');
    
    // 毒状態のテスト
    console.log('毒状態テスト開始');
    const poisonedPokemon = createMockPokemon(1, 'どくポケモン', { 
        ailment: 'poison', 
        max_hp: 100, 
        current_hp: 100 
    });
    const normalPokemon = createMockPokemon(2, 'ノーマルポケモン', {});
    
    const battleInfo = createInitialBattleInfo([poisonedPokemon], [normalPokemon]);
    
    console.log(`処理前 - ${poisonedPokemon.name ?? 'N/A'} HP: ${poisonedPokemon.current_hp ?? 0}/${poisonedPokemon.max_hp ?? 100} (状態: ${poisonedPokemon.ailment ?? 'unknown'})`);
    
    const result = ailmentHandler(battleInfo, "player");
    
    if (result && result.battleInfo && result.battleInfo.battlePokemons && result.battleInfo.battlePokemons.PlayerBattlePokemons[0]) {
        const pokemonAfter = result.battleInfo.battlePokemons.PlayerBattlePokemons[0];
        console.log(`処理後 - ${pokemonAfter?.name ?? 'N/A'} HP: ${pokemonAfter?.current_hp ?? 0}/${pokemonAfter?.max_hp ?? 100} (状態: ${pokemonAfter?.ailment ?? 'unknown'})`);
        console.log(`行動可能フラグ: ${result.actionFlag}`);
        
        if ((pokemonAfter?.current_hp ?? 0) < (poisonedPokemon.current_hp ?? 0)) {
            console.log('✓ 毒ダメージが正常に処理されました');
        } else {
            console.log('✗ 毒ダメージが処理されませんでした');
        }
    } else {
        console.log('✗ 毒状態の処理に失敗しました');
    }
    
    // 麻痺状態のテスト
    console.log('\n麻痺状態テスト開始');
    const paralyzedPokemon = createMockPokemon(3, 'まひポケモン', { 
        ailment: 'paralysis', 
        max_hp: 100, 
        current_hp: 100 
    });
    
    const battleInfo2 = createInitialBattleInfo([paralyzedPokemon], [normalPokemon]);
    
    console.log(`処理前 - ${paralyzedPokemon.name ?? 'N/A'} (状態: ${paralyzedPokemon.ailment ?? 'unknown'})`);
    
    const result2 = ailmentHandler(battleInfo2, "player");
    
    if (result2) {
        console.log(`行動可能フラグ: ${result2.actionFlag}`);
        if (result2.actionFlag === false) {
            console.log('✓ 麻痺による行動不能が正常に処理されました');
        } else {
            console.log('✓ 麻痺状態でも行動可能でした（25%の確率）');
        }
    } else {
        console.log('✗ 麻痺状態の処理に失敗しました');
    }
};

// 詳細な状態異常テスト（複数ターンにわたる状態異常の動作検証）
const testDetailedAilmentStates = async () => {
    console.log('\n=== 詳細状態異常テスト（複数ターン検証） ===');
    
    // 毒状態の複数ターンテスト
    console.log('\n--- 毒状態 複数ターンテスト ---');
    await testPoisonMultipleTurns();
    
    // 麻痺状態の複数回判定テスト
    console.log('\n--- 麻痺状態 複数回判定テスト ---');
    await testParalysisMultipleChecks();
    
    // 眠り状態の複数ターンテスト
    console.log('\n--- 眠り状態 複数ターンテスト ---');
    await testSleepMultipleTurns();
    
    // 火傷状態の複数ターンテスト
    console.log('\n--- 火傷状態 複数ターンテスト ---');
    await testBurnMultipleTurns();
    
    // 凍り状態の複数ターンテスト
    console.log('\n--- 凍り状態 複数ターンテスト ---');
    await testFreezeMultipleTurns();
    
    // 混乱状態の複数ターンテスト
    console.log('\n--- 混乱状態 複数ターンテスト ---');
    await testConfusionMultipleTurns();
    
    // 状態異常治癒テスト
    console.log('\n--- 状態異常治癒テスト ---');
    await testAilmentRecovery();
};

const testShiftHandler = async () => {
    console.log('\n=== 交代ハンドラーテスト ===');
    
    // 交代可能なケース
    console.log('交代可能ケーステスト開始');
    const pokemon1 = createMockPokemon(1, 'ポケモン1', { current_hp: 0, max_hp: 100 }); // 瀕死
    const pokemon2 = createMockPokemon(2, 'ポケモン2', { current_hp: 80, max_hp: 100 }); // 生存
    const pokemon3 = createMockPokemon(3, 'ポケモン3', { current_hp: 60, max_hp: 100 }); // 生存
    
    const enemyPokemon = createMockPokemon(4, '相手ポケモン', {});
    
    const battleInfo = createInitialBattleInfo([pokemon1, pokemon2, pokemon3], [enemyPokemon]);
    
    console.log('交代前の手持ち状況:');
    if (battleInfo.battlePokemons) {
        battleInfo.battlePokemons.PlayerBattlePokemons.forEach((p, index) => {
            if (p) console.log(`  ${index}: ${p.name ?? 'N/A'} HP: ${p.current_hp ?? 0}/${p.max_hp ?? 100}`);
        });
    }
    
    const shiftResult = shiftHandler(battleInfo, "player");
    
    if (shiftResult && shiftResult.sucsess) {
        console.log('\n交代後の手持ち状況:');
        if (shiftResult.battleInfo && shiftResult.battleInfo.battlePokemons) {
            shiftResult.battleInfo.battlePokemons.PlayerBattlePokemons.forEach((p, index) => {
                if (p) console.log(`  ${index}: ${p.name ?? 'N/A'} HP: ${p.current_hp ?? 0}/${p.max_hp ?? 100}`);
            });
        }
        console.log('✓ 交代が正常に処理されました');
    } else {
        console.log('✗ 交代処理に失敗しました');
    }
    
    // 交代不可能なケース（全て瀕死）
    console.log('\n交代不可能ケーステスト開始');
    const allFaintedPokemon1 = createMockPokemon(5, '瀕死ポケモン1', { current_hp: 0, max_hp: 100 });
    const allFaintedPokemon2 = createMockPokemon(6, '瀕死ポケモン2', { current_hp: 0, max_hp: 100 });
    const allFaintedPokemon3 = createMockPokemon(7, '瀕死ポケモン3', { current_hp: 0, max_hp: 100 });
    
    const battleInfo2 = createInitialBattleInfo([allFaintedPokemon1, allFaintedPokemon2, allFaintedPokemon3], [enemyPokemon]);
    
    const shiftResult2 = shiftHandler(battleInfo2, "player");
    
    if (shiftResult2 && !shiftResult2.sucsess) {
        console.log('✓ 交代不可能な状況が正常に判定されました');
    } else {
        console.log('✗ 交代不可能な状況の判定に失敗しました');
    }
};

const testBattleFlow = async () => {
    console.log('\n=== バトルフロー統合テスト ===');
    
    // 複雑なバトルシナリオ
    console.log('複雑なバトルシナリオ開始');
    
    const playerPokemon1 = createMockPokemon(1, 'プレイヤー主力', { 
        attack: 80, 
        speed: 90, 
        max_hp: 120, 
        current_hp: 120,
        move_list: [1, 2, 4, 5] // でんこうせっか、たいあたり、でんきショック、どくのこな
    });
    
    const playerPokemon2 = createMockPokemon(2, 'プレイヤー控え', { 
        attack: 70, 
        speed: 80, 
        max_hp: 100, 
        current_hp: 100,
        move_list: [2, 3] // たいあたり、サイコキネシス
    });
    
    const enemyPokemon1 = createMockPokemon(3, '相手主力', { 
        attack: 85, 
        speed: 85, 
        max_hp: 110, 
        current_hp: 110,
        move_list: [1, 2] // でんこうせっか、たいあたり
    });
    
    const enemyPokemon2 = createMockPokemon(4, '相手控え', { 
        attack: 75, 
        speed: 75, 
        max_hp: 95, 
        current_hp: 95,
        move_list: [2, 3] // たいあたり、サイコキネシス
    });
    
    let battleInfo = createInitialBattleInfo([playerPokemon1, playerPokemon2], [enemyPokemon1, enemyPokemon2]);
    
    let turn = 1;
    const maxTurns = 15;
    
    while (turn <= maxTurns) {
        console.log(`\n--- ターン ${turn} ---`);
        
        if (!battleInfo.battlePokemons) {
            console.log('バトル終了: battlePokemons が存在しません');
            break;
        }
        
        const playerPokemon = battleInfo.battlePokemons.PlayerBattlePokemons[0];
        const enemyPokemon = battleInfo.battlePokemons.EnemyBattlePokemons[0];
        
        if (!playerPokemon || !enemyPokemon) {
            console.log('バトル終了: ポケモンが存在しません');
            break;
        }
        
        console.log(`プレイヤー: ${playerPokemon?.name ?? 'N/A'} HP:${playerPokemon?.current_hp ?? 0}/${playerPokemon?.max_hp ?? 100} 状態:${playerPokemon?.ailment ?? 'none'}`);
        console.log(`相手: ${enemyPokemon?.name ?? 'N/A'} HP:${enemyPokemon?.current_hp ?? 0}/${enemyPokemon?.max_hp ?? 100} 状態:${enemyPokemon?.ailment ?? 'none'}`);
        
        // バトルアクション実行
        const randomAction = Math.random() < 0.8 ? 'fight' : 'shift'; // 80%で攻撃、20%で交代
        const randomCommandId = Math.floor(Math.random() * 4); // 技のランダム選択
        
        const action: battleAction = { 
            action_name: randomAction, 
            command_id: randomCommandId 
        };
        
        console.log(`アクション: ${action.action_name} (コマンド: ${action.command_id})`);
        
        const newBattleInfo = await battleInfoService(battleInfo, action);
        
        if (!newBattleInfo) {
            console.log('バトル処理エラー');
            break;
        }
        
        battleInfo = newBattleInfo;
        
        // バトルログ表示
        if (battleInfo.battleLogs) {
            if (battleInfo.battleLogs.playerPokemonLog) {
                console.log(`プレイヤーログ: ${battleInfo.battleLogs.playerPokemonLog}`);
            }
            if (battleInfo.battleLogs.enemyPokemonLog) {
                console.log(`相手ログ: ${battleInfo.battleLogs.enemyPokemonLog}`);
            }
            if (battleInfo.battleLogs.battleLog) {
                console.log(`バトルログ: ${battleInfo.battleLogs.battleLog}`);
            }
        }
        
        // 勝敗判定
        if (!battleInfo.battlePokemons) {
            console.log('バトル終了: battlePokemons が存在しません');
            break;
        }
        
        const playerAlive = battleInfo.battlePokemons.PlayerBattlePokemons.some(p => p && (p.current_hp ?? 0) > 0);
        const enemyAlive = battleInfo.battlePokemons.EnemyBattlePokemons.some(p => p && (p.current_hp ?? 0) > 0);
        
        if (!playerAlive) {
            console.log('\n🎯 バトル終了: プレイヤー敗北');
            break;
        } else if (!enemyAlive) {
            console.log('\n🎉 バトル終了: プレイヤー勝利');
            break;
        }
        
        turn++;
        
        // ターン数制限
        if (turn > maxTurns) {
            console.log('\n⏰ 最大ターン数に達しました');
            break;
        }
    }
    
    console.log(`\n最終結果 (${turn-1}ターン):`);
    console.log('プレイヤーチーム:');
    if (battleInfo.battlePokemons) {
        battleInfo.battlePokemons.PlayerBattlePokemons.forEach((p, i) => {
            if (p) console.log(`  ${i+1}. ${p.name ?? 'N/A'} HP:${p.current_hp ?? 0}/${p.max_hp ?? 100} 状態:${p.ailment ?? 'none'}`);
        });
        console.log('相手チーム:');
        battleInfo.battlePokemons.EnemyBattlePokemons.forEach((p, i) => {
            if (p) console.log(`  ${i+1}. ${p.name ?? 'N/A'} HP:${p.current_hp ?? 0}/${p.max_hp ?? 100} 状態:${p.ailment ?? 'none'}`);
        });
    }
};

// --- 既存のコードを続ける ---
runAllTests();