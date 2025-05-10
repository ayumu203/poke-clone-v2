export type Pokemon = {
    pokemon_id: number;
    name: string;
    type1: string;
    type2: string;
    front_image: string;
    back_image: string;
    base_hp: number;
    base_attack: number;
    base_defence: number;
    base_special_attack: number;
    base_special_defence: number;
    base_speed: number;
    evolve_level: number;
    move_list: number[];
} | null;