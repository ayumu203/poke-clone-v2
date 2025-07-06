type Prop = {
    name: string;
    type: string;
};

export default function PokemonName(prop: Prop) {
    const { name, type } = prop;

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

    const typeColor = typeColors[type?.toLowerCase()] || "#68D391";

    if (!name) return null;

    return (
        <div className="text-center space-y-4 animate-fade-in">
            {/* 選択中のラベル */}
            <div className="flex items-center justify-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xl font-semibold text-blue-200 tracking-wide">
                    選択中のポケモン
                </span>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            </div>

            {/* ポケモン名 */}
            <div className="relative">
                <h2 
                    className="text-4xl font-bold drop-shadow-2xl tracking-wider"
                    style={{ 
                        color: typeColor,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255,255,255,0.3)'
                    }}
                >
                    {name}
                </h2>
                
                {/* タイプバッジ */}
                <div className="mt-3 flex justify-center">
                    <span 
                        className="px-6 py-2 rounded-full text-white font-bold text-lg shadow-2xl border-2 border-white border-opacity-30"
                        style={{ 
                            backgroundColor: typeColor,
                            boxShadow: `0 4px 15px ${typeColor}40`
                        }}
                    >
                        {type}タイプ
                    </span>
                </div>
            </div>

            {/* 装飾的な星 */}
            <div className="flex justify-center space-x-2 mt-4">
                {[...Array(3)].map((_, i) => (
                    <div 
                        key={i}
                        className="w-2 h-2 bg-slate-300 rounded-full opacity-70 animate-twinkle"
                        style={{
                            animationDelay: `${i * 0.3}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
