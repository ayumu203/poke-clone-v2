export const fetch_player = async(player_id:string) =>{
    // const base_url = "";
    const url = `https://poke-clone-server-118138030176.us-central1.run.app/player`;
    // const url = `http://localhost:3001/player`;
    try {
        const response = await fetch(url,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({player_id:player_id}),
        });
        if (!response.ok) {
            throw new Error('response error');
        }
        const data = await response.json();
        return data;
    } catch(error){
        console.error(error);
        throw error;
    }
}