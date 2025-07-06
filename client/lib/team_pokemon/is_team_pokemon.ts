import { devLog, devError } from "../../src/utils/dev-utils";
export const is_team_pokemon = async (player_id:string,index:number):Promise<boolean> => {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    devLog(base_url);
    const url = `${base_url}/team-pokemon`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                player_id: player_id,
                index: index
            })
        });
        if (!response.ok) {
            throw new Error('response error');
        }
        const data = await response.json();
        if(!data)return false;
        else return true;
    } catch (error) {
        devError(error);
        throw error;
    }
}