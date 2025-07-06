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
    power: 80,
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

// テスト技データ
const testMoves = {
    swordsDance: createMockMove({
        move_id: 14,
        name: "つるぎのまい",
        category: "net-good-stats",
        damage_class: "status",
        power: 0,
        stat_name: ["attack"],
        stat_rank: [2],
        stat_target: "user"
    }),
    
    tackle: createMockMove({
        move_id: 33,
        name: "たいあたり",
        category: "damage",
        damage_class: "physical",
        power: 40,
        type: "normal"
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
    move_list: [14, 33],
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

async function testStatModification() {
    console.log("🧪 能力補正ダメージテスト");
    console.log("=====================================");
    
    // テスト1: 通常のダメージ計算
    console.log("\n📋 テスト1: 通常のダメージ（攻撃+0）");
    const testBattle1 = JSON.parse(JSON.stringify(mockBattleInfo));
    const result1 = attackHandler(testBattle1, "player", testMoves.tackle);
    
    if (!result1?.battlePokemons?.EnemyBattlePokemons?.[0]) {
        console.error("❌ テスト1失敗: 結果データが不正です");
        return;
    }
    
    const damage1 = 100 - result1.battlePokemons.EnemyBattlePokemons[0].current_hp;
    console.log(`ダメージ: ${damage1}`);
    
    // テスト2: つるぎのまい後のダメージ計算
    console.log("\n📋 テスト2: つるぎのまい後のダメージ（攻撃+2）");
    const testBattle2 = JSON.parse(JSON.stringify(mockBattleInfo));
    
    // つるぎのまいを使用
    statusHandler(testBattle2, "player", testMoves.swordsDance);
    console.log("つるぎのまい使用後の攻撃ランク:", testBattle2.battlePokemons.PlayerBattlePokemons[0].status_ranks.attack);
    
    // 敵のHPをリセット
    testBattle2.battlePokemons.EnemyBattlePokemons[0].current_hp = 100;
    
    // 攻撃
    const result2 = attackHandler(testBattle2, "player", testMoves.tackle);
    
    if (!result2?.battlePokemons?.EnemyBattlePokemons?.[0]) {
        console.error("❌ テスト2失敗: 結果データが不正です");
        return;
    }
    
    const damage2 = 100 - result2.battlePokemons.EnemyBattlePokemons[0].current_hp;
    console.log(`ダメージ: ${damage2}`);
    
    // テスト3: ダメージ比較
    console.log("\n📋 テスト3: ダメージ比較");
    console.log(`通常ダメージ: ${damage1}`);
    console.log(`強化後ダメージ: ${damage2}`);
    console.log(`倍率: ${(damage2 / damage1).toFixed(2)}倍`);
    
    if (damage2 > damage1) {
        console.log("✅ 成功: つるぎのまいによってダメージが増加しました！");
    } else {
        console.log("❌ 失敗: ダメージが増加していません");
    }
    
    // 理論値の確認
    console.log("\n📋 理論値確認:");
    console.log("攻撃ランク+2の倍率は2倍のはずです");
    const expectedDamage = damage1 * 2;
    console.log(`期待値: ${expectedDamage}`);
    console.log(`実際: ${damage2}`);
    
    if (Math.abs(damage2 - expectedDamage) <= 2) { // 誤差2ポイント以内
        console.log("✅ 理論値と一致しています！");
    } else {
        console.log("⚠️  理論値と若干異なります（計算式の違いかもしれません）");
    }
}

testStatModification();
