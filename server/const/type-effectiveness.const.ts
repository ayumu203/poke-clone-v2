// ポケモンのタイプ相性表
// 倍率: 2.0(効果抜群), 1.0(通常), 0.5(効果今ひとつ), 0.0(無効)

export const TYPE_EFFECTIVENESS: { [attackType: string]: { [defenseType: string]: number } } = {
    // ノーマル
    normal: {
        normal: 1.0, fire: 1.0, water: 1.0, electric: 1.0, grass: 1.0, ice: 1.0,
        fighting: 1.0, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 1.0, bug: 1.0,
        rock: 0.5, ghost: 0.0, dragon: 1.0, dark: 1.0, steel: 0.5, fairy: 1.0
    },
    // ほのお
    fire: {
        normal: 1.0, fire: 0.5, water: 0.5, electric: 1.0, grass: 2.0, ice: 2.0,
        fighting: 1.0, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 1.0, bug: 2.0,
        rock: 0.5, ghost: 1.0, dragon: 0.5, dark: 1.0, steel: 2.0, fairy: 1.0
    },
    // みず
    water: {
        normal: 1.0, fire: 2.0, water: 0.5, electric: 1.0, grass: 0.5, ice: 1.0,
        fighting: 1.0, poison: 1.0, ground: 2.0, flying: 1.0, psychic: 1.0, bug: 1.0,
        rock: 2.0, ghost: 1.0, dragon: 0.5, dark: 1.0, steel: 1.0, fairy: 1.0
    },
    // でんき
    electric: {
        normal: 1.0, fire: 1.0, water: 2.0, electric: 0.5, grass: 0.5, ice: 1.0,
        fighting: 1.0, poison: 1.0, ground: 0.0, flying: 2.0, psychic: 1.0, bug: 1.0,
        rock: 1.0, ghost: 1.0, dragon: 0.5, dark: 1.0, steel: 1.0, fairy: 1.0
    },
    // くさ
    grass: {
        normal: 1.0, fire: 0.5, water: 2.0, electric: 1.0, grass: 0.5, ice: 1.0,
        fighting: 1.0, poison: 0.5, ground: 2.0, flying: 0.5, psychic: 1.0, bug: 0.5,
        rock: 2.0, ghost: 1.0, dragon: 0.5, dark: 1.0, steel: 0.5, fairy: 1.0
    },
    // こおり
    ice: {
        normal: 1.0, fire: 0.5, water: 0.5, electric: 1.0, grass: 2.0, ice: 0.5,
        fighting: 1.0, poison: 1.0, ground: 2.0, flying: 2.0, psychic: 1.0, bug: 1.0,
        rock: 1.0, ghost: 1.0, dragon: 2.0, dark: 1.0, steel: 0.5, fairy: 1.0
    },
    // かくとう
    fighting: {
        normal: 2.0, fire: 1.0, water: 1.0, electric: 1.0, grass: 1.0, ice: 2.0,
        fighting: 1.0, poison: 0.5, ground: 1.0, flying: 0.5, psychic: 0.5, bug: 0.5,
        rock: 2.0, ghost: 0.0, dragon: 1.0, dark: 2.0, steel: 2.0, fairy: 0.5
    },
    // どく
    poison: {
        normal: 1.0, fire: 1.0, water: 1.0, electric: 1.0, grass: 2.0, ice: 1.0,
        fighting: 1.0, poison: 0.5, ground: 0.5, flying: 1.0, psychic: 1.0, bug: 1.0,
        rock: 0.5, ghost: 0.5, dragon: 1.0, dark: 1.0, steel: 0.0, fairy: 2.0
    },
    // じめん
    ground: {
        normal: 1.0, fire: 2.0, water: 1.0, electric: 2.0, grass: 0.5, ice: 1.0,
        fighting: 1.0, poison: 2.0, ground: 1.0, flying: 0.0, psychic: 1.0, bug: 0.5,
        rock: 2.0, ghost: 1.0, dragon: 1.0, dark: 1.0, steel: 2.0, fairy: 1.0
    },
    // ひこう
    flying: {
        normal: 1.0, fire: 1.0, water: 1.0, electric: 0.5, grass: 2.0, ice: 1.0,
        fighting: 2.0, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 1.0, bug: 2.0,
        rock: 0.5, ghost: 1.0, dragon: 1.0, dark: 1.0, steel: 0.5, fairy: 1.0
    },
    // エスパー
    psychic: {
        normal: 1.0, fire: 1.0, water: 1.0, electric: 1.0, grass: 1.0, ice: 1.0,
        fighting: 2.0, poison: 2.0, ground: 1.0, flying: 1.0, psychic: 0.5, bug: 1.0,
        rock: 1.0, ghost: 1.0, dragon: 1.0, dark: 0.0, steel: 0.5, fairy: 1.0
    },
    // むし
    bug: {
        normal: 1.0, fire: 0.5, water: 1.0, electric: 1.0, grass: 2.0, ice: 1.0,
        fighting: 0.5, poison: 0.5, ground: 1.0, flying: 0.5, psychic: 2.0, bug: 1.0,
        rock: 1.0, ghost: 0.5, dragon: 1.0, dark: 2.0, steel: 0.5, fairy: 0.5
    },
    // いわ
    rock: {
        normal: 1.0, fire: 2.0, water: 1.0, electric: 1.0, grass: 1.0, ice: 2.0,
        fighting: 0.5, poison: 1.0, ground: 0.5, flying: 2.0, psychic: 1.0, bug: 2.0,
        rock: 1.0, ghost: 1.0, dragon: 1.0, dark: 1.0, steel: 0.5, fairy: 1.0
    },
    // ゴースト
    ghost: {
        normal: 0.0, fire: 1.0, water: 1.0, electric: 1.0, grass: 1.0, ice: 1.0,
        fighting: 1.0, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 2.0, bug: 1.0,
        rock: 1.0, ghost: 2.0, dragon: 1.0, dark: 0.5, steel: 1.0, fairy: 1.0
    },
    // ドラゴン
    dragon: {
        normal: 1.0, fire: 1.0, water: 1.0, electric: 1.0, grass: 1.0, ice: 1.0,
        fighting: 1.0, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 1.0, bug: 1.0,
        rock: 1.0, ghost: 1.0, dragon: 2.0, dark: 1.0, steel: 0.5, fairy: 0.0
    },
    // あく
    dark: {
        normal: 1.0, fire: 1.0, water: 1.0, electric: 1.0, grass: 1.0, ice: 1.0,
        fighting: 0.5, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 2.0, bug: 1.0,
        rock: 1.0, ghost: 2.0, dragon: 1.0, dark: 0.5, steel: 1.0, fairy: 0.5
    },
    // はがね
    steel: {
        normal: 1.0, fire: 0.5, water: 0.5, electric: 0.5, grass: 1.0, ice: 2.0,
        fighting: 1.0, poison: 1.0, ground: 1.0, flying: 1.0, psychic: 1.0, bug: 1.0,
        rock: 2.0, ghost: 1.0, dragon: 1.0, dark: 1.0, steel: 0.5, fairy: 2.0
    },
    // フェアリー
    fairy: {
        normal: 1.0, fire: 0.5, water: 1.0, electric: 1.0, grass: 1.0, ice: 1.0,
        fighting: 2.0, poison: 0.5, ground: 1.0, flying: 1.0, psychic: 1.0, bug: 1.0,
        rock: 1.0, ghost: 1.0, dragon: 2.0, dark: 2.0, steel: 0.5, fairy: 1.0
    }
};

/**
 * タイプ相性の倍率を取得する
 * @param attackType 攻撃技のタイプ
 * @param defenseType1 防御側の第1タイプ
 * @param defenseType2 防御側の第2タイプ（nullの場合もある）
 * @returns タイプ相性の倍率
 */
export function getTypeEffectiveness(attackType: string, defenseType1: string, defenseType2: string | null = null): number {
    // 攻撃技のタイプが存在しない場合は通常倍率
    if (!TYPE_EFFECTIVENESS[attackType]) {
        console.warn(`Unknown attack type: ${attackType}`);
        return 1.0;
    }

    // 第1タイプの相性
    const effectiveness1 = TYPE_EFFECTIVENESS[attackType][defenseType1] ?? 1.0;
    
    // 第2タイプがない場合は第1タイプのみ
    if (!defenseType2 || defenseType2 === defenseType1) {
        return effectiveness1;
    }
    
    // 第2タイプの相性
    const effectiveness2 = TYPE_EFFECTIVENESS[attackType][defenseType2] ?? 1.0;
    
    // 両方のタイプの倍率を掛け合わせる
    return effectiveness1 * effectiveness2;
}

/**
 * タイプ相性のテキストメッセージを取得する
 * @param effectiveness タイプ相性の倍率
 * @returns 表示用のメッセージ
 */
export function getEffectivenessMessage(effectiveness: number): string {
    if (effectiveness === 0) return "効果がないようだ...";
    if (effectiveness >= 2.0) return "効果は抜群だ！";
    if (effectiveness <= 0.5) return "効果は今ひとつのようだ...";
    return "";
}

/**
 * タイプ一致補正を取得する (STAB: Same Type Attack Bonus)
 * @param moveType 技のタイプ
 * @param pokemonType1 ポケモンの第1タイプ
 * @param pokemonType2 ポケモンの第2タイプ（nullの場合もある）
 * @returns タイプ一致の場合1.5倍、そうでなければ1.0倍
 */
export function getSTAB(moveType: string, pokemonType1: string, pokemonType2: string | null = null): number {
    if (moveType === pokemonType1 || moveType === pokemonType2) {
        return 1.5;
    }
    return 1.0;
}
