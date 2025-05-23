type Prop = {
    name: string;
    type: string;
};

export default function PokemonName(prop: Prop) {
    const name = prop.name;
    const type = prop.type;

    // タイプに応じた色を設定
    const typeColors: { [key: string]: string } = {
        normal: "#A8A878",
        fire: "#F08030",
        water: "#6890F0",
        electric: "#F8D030",
        grass: "#78C850",
        ice: "#98D8D8",
        fighting: "#C03028",
        poison: "#A040A0",
        ground: "#E0C068",
        flying: "#A890F0",
        psychic: "#F85888",
        bug: "#A8B820",
        rock: "#B8A038",
        ghost: "#705898",
        dragon: "#7038F8",
        dark: "#705848",
        steel: "#B8B8D0",
        fairy: "#EE99AC",
    };

    const textColor = typeColors[type];
    if(name){
        return (
            <>
                <span className="text-[28px] text-white">選択中のポケモン</span>
                <span className="text-[32px]" style={{color:textColor}}>{name}</span>
            </>
        );
    }
}
