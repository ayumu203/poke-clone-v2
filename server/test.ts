// /pkcv2/server/test.ts

import { getBattleInfo } from './api/Battle/getBattleInfo';
import { handleShift } from './api/Battle/module/handleShift';
import { BattleInfo } from './type/Battle/battleInfo.type';
import { BattlePokemon } from './type/Battle/battlePokemon.type';
import { Move } from './type/move.type';
import { battleAction } from './type/Battle/battleAction.type';

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
        move_list: [1, 2],
        // rankの型から 'accuracy' を削除
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
    console.log(`プレイヤー: ${initialBattleInfo.battlePokemons.PlayerBattlePokemons.map(p => p ? `${p.name}(HP:${p.current_hp})` : 'N/A').join(', ')}`);
    console.log(`相手: ${initialBattleInfo.battlePokemons.EnemyBattlePokemons.map(p => p ? `${p.name}(HP:${p.current_hp})` : 'N/A').join(', ')}`);
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
        if (playerPokemon?.current_hp <= 0 || enemyPokemon?.current_hp <= 0) {
            break; // どちらかの手持ちが全滅したらループを抜ける
        }

        if (!playerPokemon || playerPokemon.current_hp === 0) {
            const shiftResult = handleShift(battleInfo, "player");
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
        if (!enemyPokemon || enemyPokemon.current_hp === 0) {
            const shiftResult = handleShift(battleInfo, "enemy");
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
        console.log(`プレイヤー: ${playerPokemon.name} (HP: ${playerPokemon.current_hp}) (状態: ${playerPokemon.ailment})`);
        console.log(`相手: ${enemyPokemon.name} (HP: ${enemyPokemon.current_hp}) (状態: ${enemyPokemon.ailment})`);

        const action: battleAction = { action_name: 'fight', command_id: 0 };
        battleInfo = await getBattleInfo(battleInfo, action);
        console.log("バトルログ:", battleInfo?.battleLogs);
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

    const p11_1 = createMockPokemon(129, 'コイキング', { max_hp: 10, current_hp: 10, move_list: [2]});
    const p11_2 = createMockPokemon(130, 'ギャラドス', { attack: 125, speed: 81, move_list: [3] });
    const e11 = createMockPokemon(68, 'カイリキー', { attack: 130, speed: 55, move_list: [2] });
    await runBattleSimulation(11, createInitialBattleInfo([p11_1, p11_2], [e11]));

    // --- ここから追加 ---
    // シナリオ12: 相手の交代処理テスト
    // 1. プレイヤーの攻撃で相手のキャタピー(HP10)が倒される
    // 2. 次のターン、相手の控えのバタフリーが場に出ることを確認する
    const p12 = createMockPokemon(150, 'ミュウツー', { special_attack: 154, speed: 130, move_list: [3] });
    const e12_1 = createMockPokemon(10, 'キャタピー', { max_hp: 10, current_hp: 10, move_list: [2] });
    const e12_2 = createMockPokemon(12, 'バタフリー', { special_attack: 90, speed: 70, move_list: [3] });
    await runBattleSimulation(12, createInitialBattleInfo([p12], [e12_1, e12_2]));
};

runAllTests();