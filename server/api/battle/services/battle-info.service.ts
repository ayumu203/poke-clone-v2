import { BattleAction } from "../../../types/battle/battle-action";
import { BattleInfo } from "../../../types/battle/battle-info";
import { BattlePokemon } from "../../../types/battle/battle-pokemon";
import { fightMode } from "../modes/fight.mode";
import { getMode } from "../modes/get.mode";
import { switchMode } from "../modes/switch.mode";
import prisma from "../../../database/prisma-service";
import { updateTeamPokemon } from "../../teamPokemon/updateTeamPokemon";
import { registerTeamPokemon } from "../../teamPokemon/resisterFirstPokemon";
import { registerCapturedPokemon } from "../../teamPokemon/registerCapturedPokemon";

export const battleInfoService = async (battleInfo: BattleInfo, battleAction: BattleAction): Promise<BattleInfo> => {
    if (!battleInfo || battleInfo === undefined || !battleAction || battleAction === undefined) {
        console.error("getBattleInfo: Required battleInfo or battleAction is missing");
        throw new Error("Required battleInfo or battleAction is missing");
    }

    console.log("📍 battleInfoService called with action:", battleAction.action_name, "command_id:", battleAction.command_id);

    const command_id: number = battleAction.command_id;
    console.log("📍 Processing action:", battleAction.action_name, "with command_id:", command_id);
    
    switch (battleAction.action_name) {
        case "fight":
            // 戦闘モードの処理を呼び出す
            console.log("📍 Calling fightMode...");
            battleInfo = await fightMode(battleInfo, command_id);
            console.log("📍 fightMode completed. BattleInfo updated:", battleInfo ? "✅" : "❌");
            break;
        case "switch":
            // command_idの位置のポケモンと交代する
            battleInfo = await switchMode(battleInfo, command_id);
            // 交代後プレイヤー側の攻撃は行わないまま,相手の攻撃に入る.
            battleInfo = await fightMode(battleInfo, -1);
            break;
        case "get":
            battleInfo = await getMode(battleInfo);
            // 捕獲に失敗した場合のみ敵の攻撃処理を実行
            if (battleInfo?.battleResult && !battleInfo.battleResult.isFinished) {
                battleInfo = await fightMode(battleInfo, -1);
            }
            break;
        case "run":
            if (battleInfo.battleLogs && battleInfo.battleResult) {
                battleInfo.battleLogs.playerPokemonLog = "逃げた！";
                battleInfo.battleResult.isFinished = true;
            }
            break;
    }

    battleInfo = await aggregateBattleResult(battleInfo);
    
    return battleInfo;
}

const aggregateBattleResult = async (battleInfo: BattleInfo): Promise<BattleInfo> => {
    if (!battleInfo || !battleInfo.battleLogs || !battleInfo.battleResult) {
        console.error("aggregateBattleResult: Required battleInfo, battleLogs or battleResult is missing");
        throw new Error("Required battleInfo, battleLogs or battleResult is missing");
    }

    if (battleInfo.battleResult.isFinished) {
        let gainExp = 0;
        battleInfo.battlePokemons?.EnemyBattlePokemons.forEach((enemyPokemon: BattlePokemon) => {
            gainExp += enemyPokemon!.level * 5;
        });
        battleInfo.battleResult.gainExp = gainExp;

        // バトル終了時のデータベース更新処理
        await updateBattleResults(battleInfo);
    }

    return battleInfo;
}

// バトル終了時のデータベース更新処理
const updateBattleResults = async (battleInfo: BattleInfo): Promise<void> => {
    if (!battleInfo || !battleInfo.battlePokemons || !battleInfo.battleResult) {
        console.error("Invalid battleInfo for database update");
        return;
    }

    try {
        console.log("🔄 Starting battle result database updates...");
        
        const playerPokemon = battleInfo.battlePokemons.PlayerBattlePokemons[0];
        const enemyPokemon = battleInfo.battlePokemons.EnemyBattlePokemons[0];
        const gainExp = battleInfo.battleResult.gainExp || 0;
        
        if (!playerPokemon) {
            console.error("Player pokemon not found for database update");
            return;
        }

        // プレイヤーIDをBattleInfoから取得
        const playerId = battleInfo.player_id;
        if (!playerId) {
            console.error("Player ID not found in BattleInfo");
            return;
        }

        console.log(`📊 Battle results: Player ID: ${playerId}, EXP gain: ${gainExp}, Enemy defeated: ${enemyPokemon?.current_hp === 0}`);
        
        // レベルアップ・捕獲のログのみ追加
        const playerWon = enemyPokemon?.current_hp === 0;
        const capturedPokemon = battleInfo.battleResult.gainPokemon;
        
        // バトル終了時に経験値を獲得する場合（勝敗に関係なく）
        if (gainExp > 0) {
            console.log(`📈 Battle ended! Processing EXP gain: ${gainExp} (Player won: ${playerWon})`);
            const levelUpResult = processLevelUp(playerPokemon, gainExp);
            
            // データベースに経験値とレベルを更新
            console.log(`💾 Updating database for Pokemon at index ${playerPokemon.pokemon_index}...`);
            const updateResult = await updateTeamPokemon(
                playerPokemon.player_id,
                playerPokemon.pokemon_index,
                {
                    level: playerPokemon.level,
                    exp: playerPokemon.exp
                }
            );
            
            if (updateResult) {
                console.log(`✅ Database update successful! New level: ${updateResult.level}, New EXP: ${updateResult.exp}`);
            } else {
                console.error(`❌ Database update failed for Pokemon at index ${playerPokemon.pokemon_index}`);
            }
            
            // レベルアップした場合のステータス更新とログ追加
            if (levelUpResult.leveledUp) {
                let levelUpMessage = `\n${playerPokemon.name}はレベル${levelUpResult.newLevel}になった！`;
                
                // ステータス上昇の詳細をログに追加
                const gains = levelUpResult.statGains;
                if (gains.hp > 0 || gains.attack > 0 || gains.defence > 0 || gains.special_attack > 0 || gains.special_defence > 0 || gains.speed > 0) {
                    levelUpMessage += `\nHP+${gains.hp} 攻撃+${gains.attack} 防御+${gains.defence} 特攻+${gains.special_attack} 特防+${gains.special_defence} 素早さ+${gains.speed}`;
                }
                
                if (battleInfo.battleLogs) {
                    battleInfo.battleLogs.battleLog += levelUpMessage;
                }
                console.log(`🎉 ${playerPokemon.name} leveled up from ${levelUpResult.oldLevel} to ${levelUpResult.newLevel}!`);
                console.log(`📊 Status increases: HP+${levelUpResult.statGains.hp}, ATK+${levelUpResult.statGains.attack}, DEF+${levelUpResult.statGains.defence}, SP.ATK+${levelUpResult.statGains.special_attack}, SP.DEF+${levelUpResult.statGains.special_defence}, SPD+${levelUpResult.statGains.speed}`);
            } else {
                console.log(`📈 ${playerPokemon.name} gained ${gainExp} EXP but did not level up. Current level: ${levelUpResult.newLevel}, EXP: ${playerPokemon.exp}`);
            }
        }
        
        // 捕獲成功時のログ
        if (capturedPokemon) {
            console.log(`🎯 Pokemon captured: ${capturedPokemon.name} (Level ${capturedPokemon.level})`);
            
            try {
                // 捕獲されたポケモンをデータベースに追加
                const registeredPokemon = await registerCapturedPokemon(playerId, capturedPokemon);
                
                if (registeredPokemon) {
                    console.log(`✅ Captured Pokemon successfully registered to team at index ${registeredPokemon.index}`);
                    
                    // バトルログに捕獲成功メッセージを追加
                    if (battleInfo.battleLogs) {
                        battleInfo.battleLogs.battleLog += `\n${capturedPokemon.name}を捕まえた！`;
                    }
                } else {
                    console.log(`⚠️ Captured Pokemon could not be registered (team might be full)`);
                    
                    // 手持ちが満杯の場合のメッセージ
                    if (battleInfo.battleLogs) {
                        battleInfo.battleLogs.battleLog += `\n${capturedPokemon.name}を捕まえた！\n（手持ちが満杯のため、ボックスに送られました）`;
                    }
                }
                
            } catch (error) {
                console.error(`❌ Error registering captured Pokemon:`, error);
                
                // エラーの場合でも捕獲成功メッセージは表示
                if (battleInfo.battleLogs) {
                    battleInfo.battleLogs.battleLog += `\n${capturedPokemon.name}を捕まえた！`;
                }
            }
        }
        
        console.log("🔄 Battle result updates completed!");
        
    } catch (error) {
        console.error("❌ Error updating battle results:", error);
    }
};

// レベルアップ処理関数
interface LevelUpResult {
    leveledUp: boolean;
    oldLevel: number;
    newLevel: number;
    statGains: {
        hp: number;
        attack: number;
        defence: number;
        special_attack: number;
        special_defence: number;
        speed: number;
    };
}

const processLevelUp = (pokemon: BattlePokemon, gainExp: number): LevelUpResult => {
    if (!pokemon) {
        console.error("processLevelUp: Pokemon is null or undefined");
        return {
            leveledUp: false,
            oldLevel: 0,
            newLevel: 0,
            statGains: { hp: 0, attack: 0, defence: 0, special_attack: 0, special_defence: 0, speed: 0 }
        };
    }
    
    console.log(`🔄 Processing level up for ${pokemon.name} (Current Level: ${pokemon.level}, Current EXP: ${pokemon.exp})`);
    
    const oldLevel = pokemon.level;
    const newExp = pokemon.exp + gainExp;
    let newLevel = oldLevel;
    
    // レベルアップ判定（経験値 = レベル * 100 でレベルアップ）
    while (newExp >= newLevel * 100 && newLevel < 100) {
        newLevel++;
    }
    
    const leveledUp = newLevel > oldLevel;
    
    // ステータス上昇値を計算
    const statGains = {
        hp: 0,
        attack: 0,
        defence: 0,
        special_attack: 0,
        special_defence: 0,
        speed: 0
    };
    
    if (leveledUp) {
        // レベルアップ回数分のステータス上昇を計算
        const levelGain = newLevel - oldLevel;
        
        // 基本ステータス上昇値（レベルごと）
        // ポケモンの種族値ベースで上昇量を計算（簡略化）
        statGains.hp = Math.floor((pokemon.max_hp / 10 + 5) * levelGain);
        statGains.attack = Math.floor((pokemon.attack / 20 + 2) * levelGain);
        statGains.defence = Math.floor((pokemon.defence / 20 + 2) * levelGain);
        statGains.special_attack = Math.floor((pokemon.special_attack / 20 + 2) * levelGain);
        statGains.special_defence = Math.floor((pokemon.special_defence / 20 + 2) * levelGain);
        statGains.speed = Math.floor((pokemon.speed / 20 + 2) * levelGain);
        
        // ステータス更新
        pokemon.max_hp += statGains.hp;
        pokemon.current_hp += statGains.hp; // HPも回復
        pokemon.attack += statGains.attack;
        pokemon.defence += statGains.defence;
        pokemon.special_attack += statGains.special_attack;
        pokemon.special_defence += statGains.special_defence;
        pokemon.speed += statGains.speed;
        
        console.log(`📈 ${pokemon.name} leveled up ${levelGain} time(s)! Stats increased.`);
    }
    
    // 経験値とレベルを更新
    pokemon.exp = newExp;
    pokemon.level = newLevel;
    
    return {
        leveledUp,
        oldLevel,
        newLevel,
        statGains
    };
};