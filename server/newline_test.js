// 改行テスト
const testLog = "ピカチュウのでんきショック\nピカチュウは相手に30のダメージを与えた！";

console.log("=== 改行テスト ===");
console.log("テストログ:");
console.log(testLog);
console.log("=================");

console.log("オブジェクト形式:");
const battleLogs = {
    playerPokemonLog: "ピカチュウの10まんボルト\nピカチュウは相手に50のダメージを与えた！",
    enemyPokemonLog: "イーブイのたいあたり\nイーブイはピカチュウに20のダメージを与えた！",
    battleLog: "ターン1開始\n両者構えている"
};

if (battleLogs.playerPokemonLog) {
    console.log(`プレイヤーログ: ${battleLogs.playerPokemonLog}`);
}
if (battleLogs.enemyPokemonLog) {
    console.log(`相手ログ: ${battleLogs.enemyPokemonLog}`);
}
if (battleLogs.battleLog) {
    console.log(`バトルログ: ${battleLogs.battleLog}`);
}
