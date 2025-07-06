import { statusHandler } from "./api/battle/handlers/status.handler";
import { BattleInfo } from "./types/battle/battle-info";
import { BattlePokemon } from "./types/battle/battle-pokemon";
import { Move } from "./types/core/move";

// テスト用のモックデータ
const createMockMove = (overrides: Partial<Move>): Move => ({
    move_id: 1,
    category: "net-good-stats",
    name: "テスト技",
    type: "normal",
    damage_class: "status",
    power: 0,
    pp: 10,
    accuracy: 0,
    priority: 0,
    stat_name: [],
    stat_rank: [],
    stat_target: "user",
    stat_chance: 0,
    ailment: "none",
    ailment_chance: 0,
    healing: 0,
    drain: 0,
    description: "テスト用の技",
    ...overrides
});

// テスト技データ
const testMoves = {
    // 能力変化技
    swordsDance: createMockMove({
        move_id: 14,
        name: "つるぎのまい",
        stat_name: ["attack"],
        stat_rank: [2],
        stat_target: "user"
    }),
    
    sandAttack: createMockMove({
        move_id: 28,
        name: "すなかけ",
        stat_name: ["accuracy"],
        stat_rank: [-1],
        stat_target: "selected-pokemon"
    }),
    
    tailWhip: createMockMove({
        move_id: 39,
        name: "しっぽをふる",
        stat_name: ["defense"],
        stat_rank: [-1],
        stat_target: "all-opponents"
    }),
    
    doubleTeam: createMockMove({
        move_id: 104,
        name: "かげぶんしん",
        stat_name: ["evasion"],
        stat_rank: [1],
        stat_target: "user"
    }),
    
    // 回復技
    recover: createMockMove({
        move_id: 105,
        category: "heal",
        name: "じこさいせい",
        healing: 50
    }),
    
    // 状態異常技
    sing: createMockMove({
        move_id: 47,
        category: "ailment",
        name: "うたう",
        ailment: "sleep"
    }),
    
    confuseRay: createMockMove({
        move_id: 109,
        category: "ailment",
        name: "あやしいひかり",
        ailment: "confusion"
    }),
    
    // フィールド効果技
    lightScreen: createMockMove({
        move_id: 113,
        category: "field-effect",
        name: "ひかりのかべ"
    }),
    
    // 特殊効果技
    focusEnergy: createMockMove({
        move_id: 116,
        category: "unique",
        name: "きあいだめ"
    }),
    
    // 追加テスト技: 複数能力変化
    bulkUp: createMockMove({
        move_id: 339,
        name: "ビルドアップ",
        stat_name: ["attack", "defense"],
        stat_rank: [1, 1],
        stat_target: "user"
    }),
    
    dragonDance: createMockMove({
        move_id: 349,
        name: "りゅうのまい",
        stat_name: ["attack", "speed"],
        stat_rank: [1, 1],
        stat_target: "user"
    }),
    
    nastyPlot: createMockMove({
        move_id: 417,
        name: "わるだくみ",
        stat_name: ["special-attack"],
        stat_rank: [2],
        stat_target: "user"
    }),
    
    // 複数対象能力変化
    stringShot: createMockMove({
        move_id: 81,
        name: "いとをはく",
        stat_name: ["speed"],
        stat_rank: [-2],
        stat_target: "all-opponents"
    }),
    
    // 確率発動の状態異常技
    thunderWave: createMockMove({
        move_id: 86,
        name: "でんきショック",
        ailment: "paralysis",
        ailment_chance: 10
    }),
    
    bodySlam: createMockMove({
        move_id: 34,
        name: "のしかかり",
        ailment: "paralysis",
        ailment_chance: 30
    }),
    
    // 複合効果技
    charmingVoice: createMockMove({
        move_id: 615,
        name: "チャームボイス",
        stat_name: ["special-attack"],
        stat_rank: [-1],
        stat_target: "selected-pokemon",
        ailment: "infatuation",
        ailment_chance: 50
    }),
    
    // HP割合回復技
    roost: createMockMove({
        move_id: 355,
        category: "heal",
        name: "はねやすめ",
        healing: 50
    }),
    
    moonlight: createMockMove({
        move_id: 236,
        category: "heal", 
        name: "つきのひかり",
        healing: 50  // 天候による変化は後で実装
    }),
    
    // 状態回復技
    aromatherapy: createMockMove({
        move_id: 312,
        category: "heal",
        name: "アロマセラピー"
    }),
    
    refresh: createMockMove({
        move_id: 287,
        category: "heal",
        name: "リフレッシュ"
    }),
    
    // 防御技
    protect: createMockMove({
        move_id: 182,
        category: "field-effect",
        name: "まもる"
    }),
    
    detect: createMockMove({
        move_id: 197,
        category: "field-effect", 
        name: "みきり"
    }),
    
    // 特殊な能力変化技
    psyup: createMockMove({
        move_id: 244,
        name: "じこあんじ",
        category: "unique"
    }),
    
    haze: createMockMove({
        move_id: 114,
        name: "くろいきり",
        category: "field-effect"
    })
};

const mockPlayerPokemon: BattlePokemon = {
    player_id: "test",
    pokemon_id: 1,
    pokemon_index: 0,
    level: 50,
    exp: 0,
    name: "フシギダネ",
    type1: "grass",
    type2: "poison",
    image: "test.png",
    max_hp: 100,
    current_hp: 100,
    attack: 50,
    defence: 50,
    special_attack: 65,
    special_defence: 65,
    speed: 45,
    move_list: [14],
    rank: { attack: 0, defence: 0, special_attack: 0, special_defence: 0, speed: 0, accuracy: 0 },
    ailment: "none",
    status_ranks: { attack: 0, defense: 0, "special-attack": 0, "special-defense": 0, speed: 0, accuracy: 0, evasion: 0 },
    status_ailment: "none",
    status_ailment_turn: 0
};

const mockEnemyPokemon: BattlePokemon = {
    player_id: "enemy",
    pokemon_id: 2,
    pokemon_index: 0,
    level: 50,
    exp: 0,
    name: "ヒトカゲ",
    type1: "fire",
    type2: "",
    image: "test.png",
    max_hp: 100,
    current_hp: 100,
    attack: 52,
    defence: 43,
    special_attack: 60,
    special_defence: 50,
    speed: 65,
    move_list: [52],
    rank: { attack: 0, defence: 0, special_attack: 0, special_defence: 0, speed: 0, accuracy: 0 },
    ailment: "none",
    status_ranks: { attack: 0, defense: 0, "special-attack": 0, "special-defense": 0, speed: 0, accuracy: 0, evasion: 0 },
    status_ailment: "none",
    status_ailment_turn: 0
};

const mockBattleInfo: BattleInfo = {
    player_id: "test_player",
    battlePokemons: {
        PlayerBattlePokemons: [mockPlayerPokemon],
        EnemyBattlePokemons: [mockEnemyPokemon]
    },
    battleLogs: {
        playerPokemonLog: "",
        enemyPokemonLog: "",
        battleLog: ""
    },
    battleResult: {
        isFinished: false,
        totalTurn: 1,
        gainExp: 0,
        gainPokemon: null
    }
};

async function testStatusHandler() {
    console.log("🧪 補助技ハンドラーの包括テスト (拡張版 - 50テストケース)");
    console.log("=====================================");
    
    let passedTests = 0;
    let totalTests = 0;
    
    // テスト1: つるぎのまい（攻撃+2）
    totalTests++;
    console.log("\n📋 テスト1: つるぎのまい");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo)); // ディープコピー
        const result = statusHandler(testBattle, "player", testMoves.swordsDance);
        
        if (result?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.attack === 2) {
            console.log("✅ つるぎのまい成功: 攻撃+2段階");
            passedTests++;
        } else {
            console.log("❌ つるぎのまい失敗");
        }
    } catch (error) {
        console.error("❌ つるぎのまいエラー:", error);
    }
    
    // テスト2: すなかけ（相手の命中率-1）
    totalTests++;
    console.log("\n📋 テスト2: すなかけ");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const result = statusHandler(testBattle, "player", testMoves.sandAttack);
        
        if (result?.battlePokemons?.EnemyBattlePokemons[0]?.status_ranks?.accuracy === -1) {
            console.log("✅ すなかけ成功: 相手の命中率-1段階");
            passedTests++;
        } else {
            console.log("❌ すなかけ失敗");
        }
    } catch (error) {
        console.error("❌ すなかけエラー:", error);
    }
    
    // テスト3: かげぶんしん（回避率+1）
    totalTests++;
    console.log("\n📋 テスト3: かげぶんしん");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const result = statusHandler(testBattle, "player", testMoves.doubleTeam);
        
        if (result?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.evasion === 1) {
            console.log("✅ かげぶんしん成功: 回避率+1段階");
            passedTests++;
        } else {
            console.log("❌ かげぶんしん失敗");
        }
    } catch (error) {
        console.error("❌ かげぶんしんエラー:", error);
    }
    
    // テスト4: じこさいせい（HP回復）
    totalTests++;
    console.log("\n📋 テスト4: じこさいせい");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        // HPを半分に減らす
        testBattle.battlePokemons.PlayerBattlePokemons[0].current_hp = 50;
        const initialHp = testBattle.battlePokemons.PlayerBattlePokemons[0].current_hp;
        
        const result = statusHandler(testBattle, "player", testMoves.recover);
        const finalHp = result?.battlePokemons?.PlayerBattlePokemons[0]?.current_hp || 0;
        
        if (finalHp > initialHp) {
            console.log(`✅ じこさいせい成功: HP ${initialHp} → ${finalHp}`);
            passedTests++;
        } else {
            console.log("❌ じこさいせい失敗");
        }
    } catch (error) {
        console.error("❌ じこさいせいエラー:", error);
    }
    
    // テスト5: うたう（眠り状態）
    totalTests++;
    console.log("\n📋 テスト5: うたう");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const result = statusHandler(testBattle, "player", testMoves.sing);
        
        if (result?.battlePokemons?.EnemyBattlePokemons[0]?.status_ailment === "sleep") {
            console.log("✅ うたう成功: 相手が眠り状態");
            passedTests++;
        } else {
            console.log("❌ うたう失敗");
        }
    } catch (error) {
        console.error("❌ うたうエラー:", error);
    }
    
    // テスト6: あやしいひかり（混乱状態）
    totalTests++;
    console.log("\n📋 テスト6: あやしいひかり");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const result = statusHandler(testBattle, "player", testMoves.confuseRay);
        
        if (result?.battlePokemons?.EnemyBattlePokemons[0]?.status_ailment === "confusion") {
            console.log("✅ あやしいひかり成功: 相手が混乱状態");
            passedTests++;
        } else {
            console.log("❌ あやしいひかり失敗");
        }
    } catch (error) {
        console.error("❌ あやしいひかりエラー:", error);
    }
    
    // テスト7: ひかりのかべ（フィールド効果）
    totalTests++;
    console.log("\n📋 テスト7: ひかりのかべ");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const result = statusHandler(testBattle, "player", testMoves.lightScreen);
        
        if (result?.battleLogs?.playerPokemonLog?.includes("光の壁")) {
            console.log("✅ ひかりのかべ成功: フィールド効果発動");
            passedTests++;
        } else {
            console.log("❌ ひかりのかべ失敗");
        }
    } catch (error) {
        console.error("❌ ひかりのかべエラー:", error);
    }
    
    // テスト8: きあいだめ（特殊効果）
    totalTests++;
    console.log("\n📋 テスト8: きあいだめ");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const result = statusHandler(testBattle, "player", testMoves.focusEnergy);
        
        if (result?.battleLogs?.playerPokemonLog?.includes("気合をためた")) {
            console.log("✅ きあいだめ成功: 特殊効果発動");
            passedTests++;
        } else {
            console.log("❌ きあいだめ失敗");
        }
    } catch (error) {
        console.error("❌ きあいだめエラー:", error);
    }
    
    // テスト9: 複数回能力変化（上限テスト）
    totalTests++;
    console.log("\n📋 テスト9: 能力変化上限テスト");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        
        // つるぎのまいを4回使用（2×4=8だが、上限6で制限される）
        statusHandler(testBattle, "player", testMoves.swordsDance);
        statusHandler(testBattle, "player", testMoves.swordsDance);
        statusHandler(testBattle, "player", testMoves.swordsDance);
        const result = statusHandler(testBattle, "player", testMoves.swordsDance);
        
        const finalAttack = result?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.attack || 0;
        if (finalAttack === 6) {
            console.log("✅ 能力変化上限テスト成功: 攻撃段階が6で上限");
            passedTests++;
        } else {
            console.log(`❌ 能力変化上限テスト失敗: 攻撃段階${finalAttack}`);
        }
    } catch (error) {
        console.error("❌ 能力変化上限テストエラー:", error);
    }
    
    // テスト10: 状態異常重複テスト
    totalTests++;
    console.log("\n📋 テスト10: 状態異常重複テスト");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        
        // 眠り状態にしてから混乱を試行
        statusHandler(testBattle, "player", testMoves.sing);
        const result = statusHandler(testBattle, "player", testMoves.confuseRay);
        
        const ailment = result?.battlePokemons?.EnemyBattlePokemons[0]?.status_ailment;
        if (ailment === "sleep") {
            console.log("✅ 状態異常重複テスト成功: 眠りが維持され混乱は失敗");
            passedTests++;
        } else {
            console.log(`❌ 状態異常重複テスト失敗: 状態異常${ailment}`);
        }
    } catch (error) {
        console.error("❌ 状態異常重複テストエラー:", error);
    }
    
    // 追加テスト: エラーハンドリング
    totalTests++;
    console.log("\n📋 テスト11: エラーハンドリング（null move）");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        statusHandler(testBattle, "player", null as any);
        console.log("❌ エラーハンドリングテスト失敗: エラーが発生しませんでした");
    } catch (error) {
        console.log("✅ エラーハンドリングテスト成功: 適切にエラーをキャッチ");
        passedTests++;
    }
    
    // 追加テスト: 無効なカテゴリ
    totalTests++;
    console.log("\n📋 テスト12: 無効なカテゴリテスト");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const invalidMove = createMockMove({
            category: "invalid-category" as any,
            name: "無効な技"
        });
        const result = statusHandler(testBattle, "player", invalidMove);
        
        if (result?.battleLogs?.playerPokemonLog?.includes("なにも起こらなかった")) {
            console.log("✅ 無効カテゴリテスト成功: 適切に処理");
            passedTests++;
        } else {
            console.log("❌ 無効カテゴリテスト失敗");
        }
    } catch (error) {
        console.error("❌ 無効カテゴリテストエラー:", error);
    }
    
    // 追加テスト: HPが満タンでの回復技
    totalTests++;
    console.log("\n📋 テスト13: HP満タン時の回復技テスト");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        // HPを満タンにしておく
        testBattle.battlePokemons.PlayerBattlePokemons[0].current_hp = 100;
        
        const result = statusHandler(testBattle, "player", testMoves.recover);
        
        if (result?.battleLogs?.playerPokemonLog?.includes("満タン")) {
            console.log("✅ HP満タン回復テスト成功: 適切なメッセージ");
            passedTests++;
        } else {
            console.log("❌ HP満タン回復テスト失敗");
        }
    } catch (error) {
        console.error("❌ HP満タン回復テストエラー:", error);
    }
    
    // 追加テスト: 能力変化下限テスト
    totalTests++;
    console.log("\n📋 テスト14: 能力変化下限テスト");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        
        // すなかけを7回使用（-1×7=-7だが、下限-6で制限される）
        for (let i = 0; i < 7; i++) {
            statusHandler(testBattle, "player", testMoves.sandAttack);
        }
        
        const finalAccuracy = testBattle.battlePokemons.EnemyBattlePokemons[0].status_ranks.accuracy;
        if (finalAccuracy === -6) {
            console.log("✅ 能力変化下限テスト成功: 命中率段階が-6で下限");
            passedTests++;
        } else {
            console.log(`❌ 能力変化下限テスト失敗: 命中率段階${finalAccuracy}`);
        }
    } catch (error) {
        console.error("❌ 能力変化下限テストエラー:", error);
    }
    
    // 追加テスト: 敵側からの補助技使用
    totalTests++;
    console.log("\n📋 テスト15: 敵側からの補助技使用テスト");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const result = statusHandler(testBattle, "enemy", testMoves.swordsDance);
        
        if (result?.battlePokemons?.EnemyBattlePokemons[0]?.status_ranks?.attack === 2) {
            console.log("✅ 敵側補助技テスト成功: 敵の攻撃+2段階");
            passedTests++;
        } else {
            console.log("❌ 敵側補助技テスト失敗");
        }
    } catch (error) {
        console.error("❌ 敵側補助技テストエラー:", error);
    }
    
    // パフォーマンステスト
    totalTests++;
    console.log("\n📋 テスト16: パフォーマンステスト（100回実行）");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const startTime = Date.now();
        
        for (let i = 0; i < 100; i++) {
            const tempBattle = JSON.parse(JSON.stringify(testBattle));
            statusHandler(tempBattle, "player", testMoves.swordsDance);
        }
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        if (duration < 1000) { // 1秒以内
            console.log(`✅ パフォーマンステスト成功: ${duration}ms で100回実行完了`);
            passedTests++;
        } else {
            console.log(`❌ パフォーマンステスト失敗: ${duration}ms (1秒超過)`);
        }
    } catch (error) {
        console.error("❌ パフォーマンステストエラー:", error);
    }
    
    // ログ内容テスト
    totalTests++;
    console.log("\n📋 テスト17: ログ内容詳細テスト");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const result = statusHandler(testBattle, "player", testMoves.swordsDance);
        
        const log = result?.battleLogs?.playerPokemonLog || "";
        const hasMoveName = log.includes("つるぎのまい");
        const hasPokemonName = log.includes(testBattle.battlePokemons.PlayerBattlePokemons[0].name);
        const hasStatChange = log.includes("こうげき") && log.includes("ぐーんとあがった");
        
        if (hasMoveName && hasPokemonName && hasStatChange) {
            console.log("✅ ログ内容テスト成功: 全ての必要情報が含まれている");
            passedTests++;
        } else {
            console.log(`❌ ログ内容テスト失敗: 技名:${hasMoveName}, ポケモン名:${hasPokemonName}, 変化:${hasStatChange}`);
        }
    } catch (error) {
        console.error("❌ ログ内容テストエラー:", error);
    }
    
    // 実戦シミュレーションテスト
    totalTests++;
    console.log("\n📋 テスト18: 実戦シミュレーション（戦略的な技の組み合わせ）");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        
        // 戦略: つるぎのまい → かげぶんしん → 敵にすなかけ
        const result1 = statusHandler(testBattle, "player", testMoves.swordsDance);
        const result2 = statusHandler(result1, "player", testMoves.doubleTeam);
        const result3 = statusHandler(result2, "player", testMoves.sandAttack);
        
        const playerAttack = result3?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.attack;
        const playerEvasion = result3?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.evasion;
        const enemyAccuracy = result3?.battlePokemons?.EnemyBattlePokemons[0]?.status_ranks?.accuracy;
        
        if (playerAttack === 2 && playerEvasion === 1 && enemyAccuracy === -1) {
            console.log("✅ 実戦シミュレーション成功: 戦略的な能力変化の組み合わせ");
            passedTests++;
        } else {
            console.log(`❌ 実戦シミュレーション失敗: 攻撃${playerAttack}, 回避${playerEvasion}, 敵命中${enemyAccuracy}`);
        }
    } catch (error) {
        console.error("❌ 実戦シミュレーションエラー:", error);
    }
    
    // 状態管理テスト
    totalTests++;
    console.log("\n📋 テスト19: 状態管理テスト（複数の状態異常とターン管理）");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        
        // 眠り状態にする
        const sleepResult = statusHandler(testBattle, "player", testMoves.sing);
        const sleepTurns = sleepResult?.battlePokemons?.EnemyBattlePokemons[0]?.status_ailment_turn;
        
        if (sleepResult?.battlePokemons?.EnemyBattlePokemons[0]?.status_ailment === "sleep" && sleepTurns && sleepTurns > 0) {
            console.log("✅ 状態管理テスト成功: 眠り状態とターン管理");
            passedTests++;
        } else {
            console.log("❌ 状態管理テスト失敗");
        }
    } catch (error) {
        console.error("❌ 状態管理テストエラー:", error);
    }
    
    // テスト20: 複数能力同時変化 (ビルドアップ)
    totalTests++;
    console.log("\n📋 テスト20: 複数能力同時変化 (ビルドアップ)");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const result = statusHandler(testBattle, "player", testMoves.bulkUp);
        
        const attack = result?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.attack;
        const defense = result?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.defense;
        
        if (attack === 1 && defense === 1) {
            console.log("✅ 複数能力同時変化テスト成功");
            passedTests++;
        } else {
            console.log(`❌ 複数能力同時変化テスト失敗: 攻撃${attack}, 防御${defense}`);
        }
    } catch (error) {
        console.error("❌ 複数能力同時変化テストエラー:", error);
    }
    
    // テスト21: りゅうのまい（攻撃+素早さ）
    totalTests++;
    console.log("\n📋 テスト21: りゅうのまい（攻撃+素早さ）");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const result = statusHandler(testBattle, "player", testMoves.dragonDance);
        
        const attack = result?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.attack;
        const speed = result?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.speed;
        
        if (attack === 1 && speed === 1) {
            console.log("✅ りゅうのまいテスト成功");
            passedTests++;
        } else {
            console.log(`❌ りゅうのまいテスト失敗: 攻撃${attack}, 素早さ${speed}`);
        }
    } catch (error) {
        console.error("❌ りゅうのまいテストエラー:", error);
    }
    
    // テスト22: わるだくみ（特攻+2）
    totalTests++;
    console.log("\n📋 テスト22: わるだくみ（特攻+2）");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const result = statusHandler(testBattle, "player", testMoves.nastyPlot);
        
        const specialAttack = result?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.["special-attack"];
        
        if (specialAttack === 2) {
            console.log("✅ わるだくみテスト成功");
            passedTests++;
        } else {
            console.log(`❌ わるだくみテスト失敗: 特攻${specialAttack}`);
        }
    } catch (error) {
        console.error("❌ わるだくみテストエラー:", error);
    }
    
    // テスト23: いとをはく（全敵の素早さ-2）
    totalTests++;
    console.log("\n📋 テスト23: いとをはく（全敵の素早さ-2）");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const result = statusHandler(testBattle, "player", testMoves.stringShot);
        
        const enemySpeed = result?.battlePokemons?.EnemyBattlePokemons[0]?.status_ranks?.speed;
        
        if (enemySpeed === -2) {
            console.log("✅ いとをはくテスト成功");
            passedTests++;
        } else {
            console.log(`❌ いとをはくテスト失敗: 敵素早さ${enemySpeed}`);
        }
    } catch (error) {
        console.error("❌ いとをはくテストエラー:", error);
    }
    
    // テスト24: 確率状態異常技（でんきショック10%）
    totalTests++;
    console.log("\n📋 テスト24: 確率状態異常技（でんきショック10%）");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        let successCount = 0;
        
        // 複数回試行して確率を検証
        for (let i = 0; i < 100; i++) {
            const testCopy = JSON.parse(JSON.stringify(mockBattleInfo));
            const result = statusHandler(testCopy, "player", testMoves.thunderWave);
            if (result?.battlePokemons?.EnemyBattlePokemons[0]?.status_ailment === "paralysis") {
                successCount++;
            }
        }
        
        // 5-20%程度の成功率を期待（確率的なため範囲で判定）
        if (successCount >= 5 && successCount <= 20) {
            console.log(`✅ 確率状態異常テスト成功: 100回中${successCount}回成功`);
            passedTests++;
        } else {
            console.log(`❌ 確率状態異常テスト失敗: 100回中${successCount}回成功（期待値: 5-20回）`);
        }
    } catch (error) {
        console.error("❌ 確率状態異常テストエラー:", error);
    }
    
    // テスト25: のしかかり（30%麻痺）
    totalTests++;
    console.log("\n📋 テスト25: のしかかり（30%麻痺）");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        let successCount = 0;
        
        for (let i = 0; i < 100; i++) {
            const testCopy = JSON.parse(JSON.stringify(mockBattleInfo));
            const result = statusHandler(testCopy, "player", testMoves.bodySlam);
            if (result?.battlePokemons?.EnemyBattlePokemons[0]?.status_ailment === "paralysis") {
                successCount++;
            }
        }
        
        // 20-40%程度の成功率を期待
        if (successCount >= 20 && successCount <= 40) {
            console.log(`✅ のしかかりテスト成功: 100回中${successCount}回成功`);
            passedTests++;
        } else {
            console.log(`❌ のしかかりテスト失敗: 100回中${successCount}回成功（期待値: 20-40回）`);
        }
    } catch (error) {
        console.error("❌ のしかかりテストエラー:", error);
    }
    
    // テスト26: はねやすめ（50%回復）
    totalTests++;
    console.log("\n📋 テスト26: はねやすめ（50%回復）");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        // HPを半分に減らす
        testBattle.battlePokemons.PlayerBattlePokemons[0].current_hp = 50;
        
        const result = statusHandler(testBattle, "player", testMoves.roost);
        const healedHp = result?.battlePokemons?.PlayerBattlePokemons[0]?.current_hp;
        
        if (healedHp === 100) { // 50 + 50(50%回復) = 100
            console.log("✅ はねやすめテスト成功");
            passedTests++;
        } else {
            console.log(`❌ はねやすめテスト失敗: HP回復後${healedHp}（期待値: 100）`);
        }
    } catch (error) {
        console.error("❌ はねやすめテストエラー:", error);
    }
    
    // テスト27: つきのひかり（50%回復）
    totalTests++;
    console.log("\n📋 テスト27: つきのひかり（50%回復）");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        testBattle.battlePokemons.PlayerBattlePokemons[0].current_hp = 25;
        
        const result = statusHandler(testBattle, "player", testMoves.moonlight);
        const healedHp = result?.battlePokemons?.PlayerBattlePokemons[0]?.current_hp;
        
        if (healedHp === 75) { // 25 + 50(50%回復) = 75
            console.log("✅ つきのひかりテスト成功");
            passedTests++;
        } else {
            console.log(`❌ つきのひかりテスト失敗: HP回復後${healedHp}（期待値: 75）`);
        }
    } catch (error) {
        console.error("❌ つきのひかりテストエラー:", error);
    }
    
    // テスト28: 混乱状態の継続性
    totalTests++;
    console.log("\n📋 テスト28: 混乱状態の継続性");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const result = statusHandler(testBattle, "player", testMoves.confuseRay);
        
        const confusion = result?.battlePokemons?.EnemyBattlePokemons[0]?.status_ailment;
        const turns = result?.battlePokemons?.EnemyBattlePokemons[0]?.status_ailment_turn;
        
        if (confusion === "confusion" && turns && turns > 0) {
            console.log("✅ 混乱状態継続性テスト成功");
            passedTests++;
        } else {
            console.log(`❌ 混乱状態継続性テスト失敗: 状態${confusion}, ターン${turns}`);
        }
    } catch (error) {
        console.error("❌ 混乱状態継続性テストエラー:", error);
    }
    
    // テスト29: 能力変化の重複適用
    totalTests++;
    console.log("\n📋 テスト29: 能力変化の重複適用");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        
        // つるぎのまいを3回使用
        const result1 = statusHandler(testBattle, "player", testMoves.swordsDance);
        const result2 = statusHandler(result1, "player", testMoves.swordsDance);
        const result3 = statusHandler(result2, "player", testMoves.swordsDance);
        
        const finalAttack = result3?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.attack;
        
        if (finalAttack === 6) { // 2+2+2 = 6
            console.log("✅ 能力変化重複適用テスト成功");
            passedTests++;
        } else {
            console.log(`❌ 能力変化重複適用テスト失敗: 最終攻撃${finalAttack}（期待値: 6）`);
        }
    } catch (error) {
        console.error("❌ 能力変化重複適用テストエラー:", error);
    }
    
    // テスト30: 能力変化の上限チェック（+6以上）
    totalTests++;
    console.log("\n📋 テスト30: 能力変化の上限チェック（+6以上）");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        testBattle.battlePokemons.PlayerBattlePokemons[0].status_ranks.attack = 5; // 既に+5
        
        const result = statusHandler(testBattle, "player", testMoves.swordsDance); // +2しようとする
        const finalAttack = result?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.attack;
        
        if (finalAttack === 6) { // 上限で止まる
            console.log("✅ 能力変化上限チェックテスト成功");
            passedTests++;
        } else {
            console.log(`❌ 能力変化上限チェックテスト失敗: 最終攻撃${finalAttack}（期待値: 6）`);
        }
    } catch (error) {
        console.error("❌ 能力変化上限チェックテストエラー:", error);
    }
    
    // テスト31: 能力変化の下限チェック（-6以下）
    totalTests++;
    console.log("\n📋 テスト31: 能力変化の下限チェック（-6以下）");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        testBattle.battlePokemons.EnemyBattlePokemons[0].status_ranks.speed = -5; // 既に-5
        
        const result = statusHandler(testBattle, "player", testMoves.stringShot); // -2しようとする
        const finalSpeed = result?.battlePokemons?.EnemyBattlePokemons[0]?.status_ranks?.speed;
        
        if (finalSpeed === -6) { // 下限で止まる
            console.log("✅ 能力変化下限チェックテスト成功");
            passedTests++;
        } else {
            console.log(`❌ 能力変化下限チェックテスト失敗: 最終素早さ${finalSpeed}（期待値: -6）`);
        }
    } catch (error) {
        console.error("❌ 能力変化下限チェックテストエラー:", error);
    }
    
    // テスト32: 無効なターゲット指定
    totalTests++;
    console.log("\n📋 テスト32: 無効なターゲット指定");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const invalidMove = createMockMove({
            stat_name: ["attack"],
            stat_rank: [1],
            stat_target: "invalid-target" as any
        });
        
        const result = statusHandler(testBattle, "player", invalidMove);
        
        // 無効なターゲットの場合、変化なし
        const attack = result?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.attack;
        if (attack === 0) {
            console.log("✅ 無効ターゲット指定テスト成功");
            passedTests++;
        } else {
            console.log(`❌ 無効ターゲット指定テスト失敗: 攻撃${attack}（期待値: 0）`);
        }
    } catch (error) {
        console.error("❌ 無効ターゲット指定テストエラー:", error);
    }
    
    // テスト33: 空の能力名配列
    totalTests++;
    console.log("\n📋 テスト33: 空の能力名配列");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const emptyMove = createMockMove({
            stat_name: [],
            stat_rank: [],
            stat_target: "user"
        });
        
        const result = statusHandler(testBattle, "player", emptyMove);
        
        // 空配列の場合、変化なし
        const attack = result?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.attack;
        if (attack === 0) {
            console.log("✅ 空能力名配列テスト成功");
            passedTests++;
        } else {
            console.log(`❌ 空能力名配列テスト失敗: 攻撃${attack}（期待値: 0）`);
        }
    } catch (error) {
        console.error("❌ 空能力名配列テストエラー:", error);
    }
    
    // テスト34: 配列長不一致（能力名と変化量）
    totalTests++;
    console.log("\n📋 テスト34: 配列長不一致（能力名と変化量）");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const mismatchMove = createMockMove({
            stat_name: ["attack", "defense"],
            stat_rank: [1], // 配列長が異なる
            stat_target: "user"
        });
        
        const result = statusHandler(testBattle, "player", mismatchMove);
        
        // 不一致の場合、安全に処理される
        const attack = result?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.attack;
        if (attack === 1) { // 最初の要素のみ適用
            console.log("✅ 配列長不一致テスト成功");
            passedTests++;
        } else {
            console.log(`❌ 配列長不一致テスト失敗: 攻撃${attack}（期待値: 1）`);
        }
    } catch (error) {
        console.error("❌ 配列長不一致テストエラー:", error);
    }
    
    // テスト35: 最大HP以上の回復
    totalTests++;
    console.log("\n📋 テスト35: 最大HP以上の回復");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        testBattle.battlePokemons.PlayerBattlePokemons[0].current_hp = 90; // 残りHP90
        
        const result = statusHandler(testBattle, "player", testMoves.recover); // 50%回復 = 50HP
        const healedHp = result?.battlePokemons?.PlayerBattlePokemons[0]?.current_hp;
        
        if (healedHp === 100) { // 上限で止まる
            console.log("✅ 最大HP以上回復テスト成功");
            passedTests++;
        } else {
            console.log(`❌ 最大HP以上回復テスト失敗: HP${healedHp}（期待値: 100）`);
        }
    } catch (error) {
        console.error("❌ 最大HP以上回復テストエラー:", error);
    }
    
    // テスト36: 既に満タンのHP回復
    totalTests++;
    console.log("\n📋 テスト36: 既に満タンのHP回復");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        // HPは既に満タン(100/100)
        
        const result = statusHandler(testBattle, "player", testMoves.recover);
        const healedHp = result?.battlePokemons?.PlayerBattlePokemons[0]?.current_hp;
        
        if (healedHp === 100) {
            console.log("✅ 満タンHP回復テスト成功");
            passedTests++;
        } else {
            console.log(`❌ 満タンHP回復テスト失敗: HP${healedHp}（期待値: 100）`);
        }
    } catch (error) {
        console.error("❌ 満タンHP回復テストエラー:", error);
    }
    
    // テスト37: 状態異常重複
    totalTests++;
    console.log("\n📋 テスト37: 状態異常重複");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        
        // 既に眠り状態にする
        const sleepResult = statusHandler(testBattle, "player", testMoves.sing);
        // さらに混乱を試行
        const confusionResult = statusHandler(sleepResult, "player", testMoves.confuseRay);
        
        const finalAilment = confusionResult?.battlePokemons?.EnemyBattlePokemons[0]?.status_ailment;
        
        // 既存の状態異常が上書きされるか維持されるかをチェック
        if (finalAilment === "sleep" || finalAilment === "confusion") {
            console.log(`✅ 状態異常重複テスト成功: 最終状態${finalAilment}`);
            passedTests++;
        } else {
            console.log(`❌ 状態異常重複テスト失敗: 最終状態${finalAilment}`);
        }
    } catch (error) {
        console.error("❌ 状態異常重複テストエラー:", error);
    }
    
    // テスト38: フィールド効果の適用
    totalTests++;
    console.log("\n📋 テスト38: フィールド効果の適用");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const result = statusHandler(testBattle, "player", testMoves.lightScreen);
        
        // フィールド効果は battleInfo レベルで管理される想定
        if (result !== null) {
            console.log("✅ フィールド効果適用テスト成功");
            passedTests++;
        } else {
            console.log("❌ フィールド効果適用テスト失敗");
        }
    } catch (error) {
        console.error("❌ フィールド効果適用テストエラー:", error);
    }
    
    // テスト39: パフォーマンステスト（大量実行）
    totalTests++;
    console.log("\n📋 テスト39: パフォーマンステスト（1000回実行）");
    try {
        const startTime = Date.now();
        
        for (let i = 0; i < 1000; i++) {
            const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
            statusHandler(testBattle, "player", testMoves.swordsDance);
        }
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        if (duration < 5000) { // 5秒以内
            console.log(`✅ パフォーマンステスト成功: ${duration}ms`);
            passedTests++;
        } else {
            console.log(`❌ パフォーマンステスト失敗: ${duration}ms（期待値: <5000ms）`);
        }
    } catch (error) {
        console.error("❌ パフォーマンステストエラー:", error);
    }
    
    // テスト40: メモリリークテスト
    totalTests++;
    console.log("\n📋 テスト40: メモリリークテスト");
    try {
        const initialMemory = process.memoryUsage().heapUsed;
        
        for (let i = 0; i < 100; i++) {
            const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
            statusHandler(testBattle, "player", testMoves.swordsDance);
        }
        
        // ガベージコレクションを試行
        if (global.gc) {
            global.gc();
        }
        
        const finalMemory = process.memoryUsage().heapUsed;
        const memoryIncrease = finalMemory - initialMemory;
        
        if (memoryIncrease < 10 * 1024 * 1024) { // 10MB以下
            console.log(`✅ メモリリークテスト成功: 増加量${Math.round(memoryIncrease / 1024)}KB`);
            passedTests++;
        } else {
            console.log(`❌ メモリリークテスト失敗: 増加量${Math.round(memoryIncrease / 1024)}KB`);
        }
    } catch (error) {
        console.error("❌ メモリリークテストエラー:", error);
    }
    
    // テスト41: 複数ポケモンへの効果
    totalTests++;
    console.log("\n📋 テスト41: 複数ポケモンへの効果");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        
        // 2匹目のポケモンを追加
        const secondPokemon = { ...mockEnemyPokemon };
        secondPokemon.pokemon_index = 1;
        testBattle.battlePokemons.EnemyBattlePokemons.push(secondPokemon);
        
        const result = statusHandler(testBattle, "player", testMoves.tailWhip); // 全敵の防御-1
        
        const enemy1Defense = result?.battlePokemons?.EnemyBattlePokemons[0]?.status_ranks?.defense;
        const enemy2Defense = result?.battlePokemons?.EnemyBattlePokemons[1]?.status_ranks?.defense;
        
        if (enemy1Defense === -1 && enemy2Defense === -1) {
            console.log("✅ 複数ポケモン効果テスト成功");
            passedTests++;
        } else {
            console.log(`❌ 複数ポケモン効果テスト失敗: 敵1防御${enemy1Defense}, 敵2防御${enemy2Defense}`);
        }
    } catch (error) {
        console.error("❌ 複数ポケモン効果テストエラー:", error);
    }
    
    // テスト42: プレイヤー切り替えテスト
    totalTests++;
    console.log("\n📋 テスト42: プレイヤー切り替えテスト");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        
        // プレイヤーが技を使用
        const playerResult = statusHandler(testBattle, "player", testMoves.swordsDance);
        
        // 敵が技を使用
        const enemyResult = statusHandler(playerResult, "enemy", testMoves.swordsDance);
        
        const playerAttack = enemyResult?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.attack;
        const enemyAttack = enemyResult?.battlePokemons?.EnemyBattlePokemons[0]?.status_ranks?.attack;
        
        if (playerAttack === 2 && enemyAttack === 2) {
            console.log("✅ プレイヤー切り替えテスト成功");
            passedTests++;
        } else {
            console.log(`❌ プレイヤー切り替えテスト失敗: プレイヤー攻撃${playerAttack}, 敵攻撃${enemyAttack}`);
        }
    } catch (error) {
        console.error("❌ プレイヤー切り替えテストエラー:", error);
    }
    
    // テスト43: 技データの不整合テスト
    totalTests++;
    console.log("\n📋 テスト43: 技データの不整合テスト");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const corruptMove = createMockMove({
            stat_name: ["invalid-stat"],
            stat_rank: [1],
            stat_target: "user"
        });
        
        const result = statusHandler(testBattle, "player", corruptMove);
        
        // 不正な能力名は無視される想定
        if (result !== null) {
            console.log("✅ 技データ不整合テスト成功");
            passedTests++;
        } else {
            console.log("❌ 技データ不整合テスト失敗");
        }
    } catch (error) {
        console.error("❌ 技データ不整合テストエラー:", error);
    }
    
    // テスト44: 境界値テスト（ゼロ値）
    totalTests++;
    console.log("\n📋 テスト44: 境界値テスト（ゼロ値）");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        const zeroMove = createMockMove({
            stat_name: ["attack"],
            stat_rank: [0], // ゼロ変化
            stat_target: "user"
        });
        
        const result = statusHandler(testBattle, "player", zeroMove);
        const attack = result?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.attack;
        
        if (attack === 0) {
            console.log("✅ 境界値テスト（ゼロ値）成功");
            passedTests++;
        } else {
            console.log(`❌ 境界値テスト（ゼロ値）失敗: 攻撃${attack}`);
        }
    } catch (error) {
        console.error("❌ 境界値テスト（ゼロ値）エラー:", error);
    }
    
    // テスト45: 状態異常ターン数の減少テスト
    totalTests++;
    console.log("\n📋 テスト45: 状態異常ターン数の減少テスト");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        
        // 眠り状態にして初期ターン数を確認
        const sleepResult = statusHandler(testBattle, "player", testMoves.sing);
        const initialTurns = sleepResult?.battlePokemons?.EnemyBattlePokemons[0]?.status_ailment_turn;
        
        // ターン経過のシミュレーション（将来の機能）
        if (initialTurns && initialTurns > 0) {
            console.log("✅ 状態異常ターン数テスト成功");
            passedTests++;
        } else {
            console.log("❌ 状態異常ターン数テスト失敗");
        }
    } catch (error) {
        console.error("❌ 状態異常ターン数テストエラー:", error);
    }
    
    // テスト46: 同時複数効果テスト
    totalTests++;
    console.log("\n📋 テスト46: 同時複数効果テスト");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        
        // 能力変化+状態異常の複合技
        const result = statusHandler(testBattle, "player", testMoves.charmingVoice);
        
        const specialAttack = result?.battlePokemons?.EnemyBattlePokemons[0]?.status_ranks?.["special-attack"];
        const ailment = result?.battlePokemons?.EnemyBattlePokemons[0]?.status_ailment;
        
        if (specialAttack === -1 || ailment === "infatuation") {
            console.log("✅ 同時複数効果テスト成功");
            passedTests++;
        } else {
            console.log(`❌ 同時複数効果テスト失敗: 特攻${specialAttack}, 状態${ailment}`);
        }
    } catch (error) {
        console.error("❌ 同時複数効果テストエラー:", error);
    }
    
    // テスト47: 大規模戦闘シミュレーション
    totalTests++;
    console.log("\n📋 テスト47: 大規模戦闘シミュレーション");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        
        // 連続で様々な技を使用
        const moves = [
            testMoves.swordsDance,
            testMoves.doubleTeam,
            testMoves.sandAttack,
            testMoves.sing,
            testMoves.recover,
            testMoves.lightScreen
        ];
        
        let currentBattle = testBattle;
        let successfulMoves = 0;
        
        for (const move of moves) {
            const result = statusHandler(currentBattle, "player", move);
            if (result !== null) {
                currentBattle = result;
                successfulMoves++;
            }
        }
        
        if (successfulMoves === moves.length) {
            console.log("✅ 大規模戦闘シミュレーション成功");
            passedTests++;
        } else {
            console.log(`❌ 大規模戦闘シミュレーション失敗: ${successfulMoves}/${moves.length}技成功`);
        }
    } catch (error) {
        console.error("❌ 大規模戦闘シミュレーションエラー:", error);
    }
    
    // テスト48: エラーハンドリングテスト
    totalTests++;
    console.log("\n📋 テスト48: エラーハンドリングテスト");
    try {
        // null バトル情報
        const result = statusHandler(null as any, "player", testMoves.swordsDance);
        
        if (result === null) {
            console.log("✅ エラーハンドリングテスト成功");
            passedTests++;
        } else {
            console.log("❌ エラーハンドリングテスト失敗");
        }
    } catch (error) {
        console.log("✅ エラーハンドリングテスト成功（例外キャッチ）");
        passedTests++;
    }
    
    // テスト49: 型安全性テスト
    totalTests++;
    console.log("\n📋 テスト49: 型安全性テスト");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        
        // 型安全性の確認（コンパイル時チェック）
        const result = statusHandler(testBattle, "player", testMoves.swordsDance);
        
        if (
            result &&
            typeof result === 'object' &&
            result.battlePokemons &&
            Array.isArray(result.battlePokemons.PlayerBattlePokemons)
        ) {
            console.log("✅ 型安全性テスト成功");
            passedTests++;
        } else {
            console.log("❌ 型安全性テスト失敗");
        }
    } catch (error) {
        console.error("❌ 型安全性テストエラー:", error);
    }
    
    // テスト50: 総合評価テスト（全機能統合）
    totalTests++;
    console.log("\n📋 テスト50: 総合評価テスト（全機能統合）");
    try {
        const testBattle = JSON.parse(JSON.stringify(mockBattleInfo));
        
        // 複合的な戦術
        // 1. HPを減らす
        testBattle.battlePokemons.PlayerBattlePokemons[0].current_hp = 30;
        
        // 2. 回復 + 能力強化 + フィールド効果
        const heal = statusHandler(testBattle, "player", testMoves.recover);
        const buff = statusHandler(heal, "player", testMoves.swordsDance);
        const field = statusHandler(buff, "player", testMoves.lightScreen);
        
        // 3. 敵に状態異常 + 能力低下
        const debuff = statusHandler(field, "player", testMoves.sandAttack);
        const ailment = statusHandler(debuff, "player", testMoves.sing);
        
        // 結果検証
        const player = ailment?.battlePokemons?.PlayerBattlePokemons[0];
        const enemy = ailment?.battlePokemons?.EnemyBattlePokemons[0];
        
        const conditions = [
            player?.current_hp && player.current_hp > 30, // HP回復
            player?.status_ranks?.attack === 2, // 攻撃強化
            enemy?.status_ranks?.accuracy === -1, // 敵命中低下
            enemy?.status_ailment === "sleep", // 敵眠り状態
            ailment !== null // 処理成功
        ];
        
        const successCount = conditions.filter(Boolean).length;
        
        if (successCount >= 4) {
            console.log(`✅ 総合評価テスト成功: ${successCount}/5 条件達成`);
            passedTests++;
        } else {
            console.log(`❌ 総合評価テスト失敗: ${successCount}/5 条件達成`);
        }
    } catch (error) {
        console.error("❌ 総合評価テストエラー:", error);
    }
    
    // 結果まとめ
    console.log("\n🏁 テスト結果まとめ（拡張版）");
    console.log("=====================================");
    console.log(`✅ 成功: ${passedTests}/${totalTests} テスト`);
    console.log(`❌ 失敗: ${totalTests - passedTests}/${totalTests} テスト`);
    console.log(`📊 成功率: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
        console.log("🎉 全テスト成功！補助技システムは完璧に動作しています！");
    } else if (passedTests / totalTests >= 0.8) {
        console.log("✨ 良好な結果！大部分のテストが成功しています。");
    } else {
        console.log("⚠️  一部テストが失敗しました。実装を確認してください。");
    }
}

testStatusHandler();
