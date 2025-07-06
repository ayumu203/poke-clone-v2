/**
 * 能力値ランクによる補正を適用する関数
 * ランク: -6 ～ +6
 * 補正倍率: 2/8 ～ 8/2 (0.25倍 ～ 4.0倍)
 */
export const applyStatModifier = (baseStat: number, rank: number): number => {
    // ランクを-6～+6の範囲に制限
    const clampedRank = Math.max(-6, Math.min(6, rank));
    
    // ポケモンの能力値補正式
    // プラス補正: (2 + rank) / 2
    // マイナス補正: 2 / (2 + |rank|)
    let multiplier: number;
    if (clampedRank >= 0) {
        multiplier = (2 + clampedRank) / 2;
    } else {
        multiplier = 2 / (2 + Math.abs(clampedRank));
    }
    
    return Math.floor(baseStat * multiplier);
};

/**
 * 能力値ランクの補正倍率を計算する関数（表示用）
 */
export const getStatModifierMultiplier = (rank: number): number => {
    const clampedRank = Math.max(-6, Math.min(6, rank));
    
    if (clampedRank >= 0) {
        return (2 + clampedRank) / 2;
    } else {
        return 2 / (2 + Math.abs(clampedRank));
    }
};
