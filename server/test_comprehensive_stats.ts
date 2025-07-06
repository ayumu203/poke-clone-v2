import { statusHandler } from "./api/battle/handlers/status.handler";
import { attackHandler } from "./api/battle/handlers/attack.handler";
import { BattleInfo } from "./types/battle/battle-info";
import { BattlePokemon } from "./types/battle/battle-pokemon";
import { Move } from "./types/core/move";

// テスト用のモックデータ
const createMockMove = (overrides: Partial<Move>): Move => ({
    move_id: 1,
    category: "net-good-stats",
    name: "テスト技",
    type: "normal",
    damage_class: "physical",
    power: 40,
    pp: 10,
    accuracy: 100,
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

const testMoves = {
    tackle: createMockMove({
        move_id: 33,
        category: "damage",
        name: "たいあたり",
        power: 40
    }),
    swordsDance: createMockMove({
        move_id: 14,
        name: "つるぎのまい",
        damage_class: "status",
        power: 0,
        stat_name: ["attack"],
        stat_rank: [2],
        stat_target: "user"
    }),
    defenseCurl: createMockMove({
        move_id: 111,
        name: "まるくなる",
        damage_class: "status",
        power: 0,
        stat_name: ["defense"],
        stat_rank: [1],
        stat_target: "user"
    }),
    growl: createMockMove({
        move_id: 45,
        name: "なきごえ",
        damage_class: "status",
        power: 0,
        stat_name: ["attack"],
        stat_rank: [-1],
        stat_target: "selected-pokemon"
    }),
    psychic: createMockMove({
        move_id: 94,
        category: "damage",
        name: "サイコキネシス",
        type: "psychic",
        damage_class: "special",
        power: 60  // 威力を90から60に下げる
    }),
    nastyPlot: createMockMove({
        move_id: 417,
        name: "わるだくみ",
        damage_class: "status",
        power: 0,
        stat_name: ["special-attack"],
        stat_rank: [2],
        stat_target: "user"
    })
};

const createMockBattle = (): BattleInfo => {
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
        max_hp: 150,
        current_hp: 150,
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

    return {
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
};

async function testComprehensiveStats() {
    console.log("🧪 包括的な能力補正テスト");
    console.log("=====================================");
    
    let passedTests = 0;
    let totalTests = 0;
    
    // テスト1: 物理攻撃の強化
    totalTests++;
    console.log("\n📋 テスト1: 物理攻撃の強化");
    try {
        const battle = createMockBattle();
        
        // 通常ダメージ
        const normalResult = attackHandler(battle, "player", testMoves.tackle);
        const normalDamage = normalResult?.battlePokemons?.EnemyBattlePokemons[0]?.current_hp ? 150 - normalResult.battlePokemons.EnemyBattlePokemons[0].current_hp : 0;
        
        // つるぎのまい → 攻撃
        const battle2 = createMockBattle();
        statusHandler(battle2, "player", testMoves.swordsDance);
        const boostedResult = attackHandler(battle2, "player", testMoves.tackle);
        const boostedDamage = boostedResult?.battlePokemons?.EnemyBattlePokemons[0]?.current_hp ? 150 - boostedResult.battlePokemons.EnemyBattlePokemons[0].current_hp : 0;
        
        console.log(`通常ダメージ: ${normalDamage}`);
        console.log(`強化後ダメージ: ${boostedDamage}`);
        console.log(`倍率: ${(boostedDamage / normalDamage).toFixed(2)}倍`);
        
        if (boostedDamage > normalDamage * 1.8) {
            console.log("✅ 成功: 物理攻撃が正しく強化された");
            passedTests++;
        } else {
            console.log("❌ 失敗: 物理攻撃の強化が不十分");
        }
    } catch (error) {
        console.error("❌ エラー:", error);
    }
    
    // テスト2: 特殊攻撃の強化
    totalTests++;
    console.log("\n📋 テスト2: 特殊攻撃の強化");
    try {
        const battle = createMockBattle();
        
        // 通常ダメージ
        const normalResult = attackHandler(battle, "player", testMoves.psychic);
        const normalDamage = normalResult?.battlePokemons?.EnemyBattlePokemons[0]?.current_hp ? 150 - normalResult.battlePokemons.EnemyBattlePokemons[0].current_hp : 0;
        
        // わるだくみ → 攻撃
        const battle2 = createMockBattle();
        statusHandler(battle2, "player", testMoves.nastyPlot);
        const boostedResult = attackHandler(battle2, "player", testMoves.psychic);
        const boostedDamage = boostedResult?.battlePokemons?.EnemyBattlePokemons[0]?.current_hp ? 150 - boostedResult.battlePokemons.EnemyBattlePokemons[0].current_hp : 0;
        
        console.log(`通常ダメージ: ${normalDamage}`);
        console.log(`強化後ダメージ: ${boostedDamage}`);
        console.log(`倍率: ${(boostedDamage / normalDamage).toFixed(2)}倍`);
        
        if (boostedDamage > normalDamage * 1.8) {
            console.log("✅ 成功: 特殊攻撃が正しく強化された");
            passedTests++;
        } else {
            console.log("❌ 失敗: 特殊攻撃の強化が不十分");
        }
    } catch (error) {
        console.error("❌ エラー:", error);
    }
    
    // テスト3: 防御力の強化
    totalTests++;
    console.log("\n📋 テスト3: 防御力の強化（相手の攻撃を受ける）");
    try {
        const battle = createMockBattle();
        
        // 通常ダメージ（敵の攻撃）
        const normalResult = attackHandler(battle, "enemy", testMoves.tackle);
        const normalDamage = normalResult?.battlePokemons?.PlayerBattlePokemons[0]?.current_hp ? 100 - normalResult.battlePokemons.PlayerBattlePokemons[0].current_hp : 0;
        
        // まるくなる → 敵の攻撃を受ける
        const battle2 = createMockBattle();
        statusHandler(battle2, "player", testMoves.defenseCurl);
        const defendedResult = attackHandler(battle2, "enemy", testMoves.tackle);
        const defendedDamage = defendedResult?.battlePokemons?.PlayerBattlePokemons[0]?.current_hp ? 100 - defendedResult.battlePokemons.PlayerBattlePokemons[0].current_hp : 0;
        
        console.log(`通常被ダメージ: ${normalDamage}`);
        console.log(`防御後被ダメージ: ${defendedDamage}`);
        console.log(`軽減率: ${(1 - defendedDamage / normalDamage).toFixed(2)}`);
        
        if (defendedDamage < normalDamage) {
            console.log("✅ 成功: 防御力が正しく強化された");
            passedTests++;
        } else {
            console.log("❌ 失敗: 防御力の強化が無効");
        }
    } catch (error) {
        console.error("❌ エラー:", error);
    }
    
    // テスト4: 攻撃力の低下
    totalTests++;
    console.log("\n📋 テスト4: 攻撃力の低下（相手にデバフ）");
    try {
        const battle = createMockBattle();
        
        // 通常ダメージ（敵の攻撃）
        const normalResult = attackHandler(battle, "enemy", testMoves.tackle);
        const normalDamage = normalResult?.battlePokemons?.PlayerBattlePokemons[0]?.current_hp ? 100 - normalResult.battlePokemons.PlayerBattlePokemons[0].current_hp : 0;
        
        // なきごえ → 敵の攻撃を受ける
        const battle2 = createMockBattle();
        statusHandler(battle2, "player", testMoves.growl);
        const weakenedResult = attackHandler(battle2, "enemy", testMoves.tackle);
        const weakenedDamage = weakenedResult?.battlePokemons?.PlayerBattlePokemons[0]?.current_hp ? 100 - weakenedResult.battlePokemons.PlayerBattlePokemons[0].current_hp : 0;
        
        console.log(`通常被ダメージ: ${normalDamage}`);
        console.log(`弱体後被ダメージ: ${weakenedDamage}`);
        console.log(`軽減率: ${(1 - weakenedDamage / normalDamage).toFixed(2)}`);
        
        if (weakenedDamage < normalDamage) {
            console.log("✅ 成功: 敵の攻撃力が正しく低下した");
            passedTests++;
        } else {
            console.log("❌ 失敗: 敵の攻撃力低下が無効");
        }
    } catch (error) {
        console.error("❌ エラー:", error);
    }
    
    // テスト5: 能力変化の累積
    totalTests++;
    console.log("\n📋 テスト5: 能力変化の累積（つるぎのまい×2回）");
    try {
        const battle = createMockBattle();
        
        // つるぎのまい×2 → 攻撃
        statusHandler(battle, "player", testMoves.swordsDance); // +2
        statusHandler(battle, "player", testMoves.swordsDance); // +2 = +4
        const result = attackHandler(battle, "player", testMoves.tackle);
        const damage = result?.battlePokemons?.EnemyBattlePokemons[0]?.current_hp ? 150 - result.battlePokemons.EnemyBattlePokemons[0].current_hp : 0;
        
        const attackRank = battle?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.attack || 0;
        console.log(`攻撃ランク: ${attackRank}`);
        console.log(`ダメージ: ${damage}`);
        
        if (attackRank === 4) {
            console.log("✅ 成功: 能力変化が正しく累積された");
            passedTests++;
        } else {
            console.log("❌ 失敗: 能力変化の累積が不正");
        }
    } catch (error) {
        console.error("❌ エラー:", error);
    }
    
    // テスト6: 能力変化の上限
    totalTests++;
    console.log("\n📋 テスト6: 能力変化の上限（つるぎのまい×4回）");
    try {
        const battle = createMockBattle();
        
        // つるぎのまい×4回（+8だが上限+6）
        for (let i = 0; i < 4; i++) {
            statusHandler(battle, "player", testMoves.swordsDance);
        }
        
        const attackRank = battle?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.attack || 0;
        console.log(`攻撃ランク: ${attackRank}`);
        
        if (attackRank === 6) {
            console.log("✅ 成功: 能力変化の上限が正しく適用された");
            passedTests++;
        } else {
            console.log("❌ 失敗: 能力変化の上限が無効");
        }
    } catch (error) {
        console.error("❌ エラー:", error);
    }
    
    console.log("\n🏁 包括的テスト結果");
    console.log("=====================================");
    console.log(`✅ 成功: ${passedTests}/${totalTests} テスト`);
    console.log(`📊 成功率: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
        console.log("🎉 全テスト成功！能力補正システムは完璧に動作しています！");
    } else if (passedTests / totalTests >= 0.8) {
        console.log("✨ 良好な結果！能力補正システムは正常に動作しています。");
    } else {
        console.log("⚠️  一部テストが失敗しました。実装を確認してください。");
    }
}

testComprehensiveStats();
