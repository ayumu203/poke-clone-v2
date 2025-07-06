import { Rank } from "../game/rank";

export type BattlePokemon = {
    player_id: string;
    pokemon_id: number;
    pokemon_index: number;
    level: number;
    exp: number;
    name: string;
    type1: string;
    type2: string;
    image: string;
    max_hp: number;
    current_hp: number;
    attack: number;
    defence: number;
    special_attack: number;
    special_defence: number;
    speed: number;
    move_list: number[];
    rank: Rank;
    ailment: string;
    // 補助技用フィールド
    status_ranks: { [key: string]: number }; // 能力値の変化段階
    status_ailment: string; // 現在の状態異常
    status_ailment_turn: number; // 状態異常の残りターン数
} | null | undefined;
