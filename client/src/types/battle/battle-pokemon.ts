export type Rank = {
  attack: number;
  defence: number;
  special_attack: number;
  special_defence: number;
  speed: number;
  accuracy: number;
  evasion: number;
};

export type BattlePokemon = {
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
} | null | undefined;
