import { Move } from "../../../type/move.type";

const fetchMove = async (url: string, headers: HeadersInit, move_id: number): Promise<Move> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('response error');
    }
    const data: any = await response.json();

    // ステータス変化
    let status_name = [];
    let status_rank = [];
    let status_target: string = "";
    if (data.stat_changes.length !== 0) {
        for (let i = 0; i < data.stat_changes.length; i++) {
            const name = data.stat_changes[i].stat.name;
            const rank = data.stat_changes[i].change;
            status_name.push(name);
            status_rank.push(rank);
        }
        status_target = data.target.name;
    }
    // 状態異常
    let ailment_effect = false;
    let ailment_name = "none";
    let ailment_chance = 0;
    if (data.meta.ailment.name !== "none") {
        ailment_effect = true;
        ailment_name = data.meta.ailment.name;
        ailment_chance = data.meta.ailment_chance;
    }

    // 回復技
    let healing_effect = false;
    let healing_amount = 0;
    if (data.meta.category.name === "heal") {
        healing_effect = true;
        healing_amount = data.meta.healing;
    }

    let description: string = "";
    for (let i = 1; i <= 20; i++) {
        if (data.flavor_text_entries[i].language.name === "ja") {
            description = data.flavor_text_entries[i].flavor_text;
        }
    }
    const move: Move = {
        move_id: move_id,
        category: data.meta.category.name,
        name: data.names[0].name,
        type: data.type.name,
        damage_class: data.damage_class.name,
        power: data.power,
        pp: data.pp,
        accuracy: data.accuracy,
        priority: data.priority,
        stat_name: status_name,
        stat_rank: status_rank,
        stat_target: status_target,
        stat_chance: 0,
        ailment: ailment_name,
        ailment_chance: ailment_chance,
        healing: healing_amount,
        drain: data.meta.drain,
        description: description,
    };
    return move;
};

export const fetchMoveInfo = async (move_id: number): Promise<Move> => {
    const url = `https://pokeapi.co/api/v2/move/${move_id}`;
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const move: Move = await fetchMove(url, headers, move_id);
        return move;
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        throw error;
    }
}