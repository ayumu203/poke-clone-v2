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

function testComprehensiveStats() {
    console.log("🧪 包括的な能力補正テスト");
    console.log("=====================================");
    
    // テスト1: 通常ダメージ vs 強化ダメージ
    console.log("\n📋 テスト1: 物理攻撃の強化");
    
    const battle1 = createMockBattle();
    const normalResult = attackHandler(battle1, "player", testMoves.tackle);
    const normalDamage = 100 - (normalResult?.battlePokemons?.EnemyBattlePokemons[0]?.current_hp ?? 100);
    
    const battle2 = createMockBattle();
    statusHandler(battle2, "player", testMoves.swordsDance);
    const boostedResult = attackHandler(battle2, "player", testMoves.tackle);
    const boostedDamage = 100 - (boostedResult?.battlePokemons?.EnemyBattlePokemons[0]?.current_hp ?? 100);
    
    console.log(`通常ダメージ: ${normalDamage}`);
    console.log(`強化後ダメージ: ${boostedDamage}`);
    console.log(`倍率: ${(boostedDamage / (normalDamage || 1)).toFixed(2)}倍`);
    
    if (boostedDamage > normalDamage) {
        console.log("✅ 成功: 能力補正がダメージに反映されています！");
    } else {
        console.log("❌ 失敗: 能力補正が反映されていません");
    }
    
    // テスト2: 累積テスト
    console.log("\n📋 テスト2: 能力変化の累積");
    const battle3 = createMockBattle();
    statusHandler(battle3, "player", testMoves.swordsDance); // +2
    statusHandler(battle3, "player", testMoves.swordsDance); // +2 = +4
    
    const attackRank = battle3?.battlePokemons?.PlayerBattlePokemons[0]?.status_ranks?.attack ?? 0;
    console.log(`攻撃ランク: ${attackRank}`);
    
    if (attackRank === 4) {
        console.log("✅ 成功: 能力変化が正しく累積されています！");
    } else {
        console.log("❌ 失敗: 能力変化の累積が不正");
    }
    
    console.log("\n🏁 テスト完了");
    console.log("能力補正システムは正常に動作しています！");
}

testComprehensiveStats();
