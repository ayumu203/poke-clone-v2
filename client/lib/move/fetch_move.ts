import { devLog, devError } from "../../src/utils/dev-utils";
import { Move } from "../../type/move.type";

export const fetch_move = async (move_id:number): Promise<Move> => {
    const base_url = process.env.NEXT_PUBLIC_API_URL;
    devLog(base_url);
    const url = `${base_url}/data/move`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                move_id: move_id
            })

        });
        if (!response.ok) {
            throw new Error('response error');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        devError(error);
        throw error;
    }
}