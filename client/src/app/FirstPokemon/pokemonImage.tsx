import Image from "next/image";
import { Pokemon } from "../../../type/pokemon.type";

type Prop = {
    pokemon: Pokemon;
    onSelect: (id: number) => void;
    isSelected?: boolean;
}

export default function PokemonImage(prop: Prop) {
    const { pokemon, onSelect, isSelected = false } = prop;
    
    if (!pokemon) return null;

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

    const typeColor = typeColors[pokemon.type1.toLowerCase()] || "#68D391";

    return (
        <div 
            className={`
                relative cursor-pointer transition-all duration-300 transform hover:scale-105
                ${isSelected 
                    ? 'ring-4 ring-blue-400 ring-opacity-80 shadow-2xl scale-105' 
                    : 'hover:shadow-xl'
                }
            `}
            onClick={() => onSelect(pokemon.pokemon_id)}
        >
            {/* カード背景 */}
            <div 
                className="w-64 h-96 rounded-3xl shadow-2xl overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${typeColor}20, ${typeColor}40)`
                }}
            >
                {/* 選択状態のインジケーター */}
                {isSelected && (
                    <div className="absolute top-4 right-4 z-20">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse border-2 border-white">
                            <span className="text-white font-bold text-lg">✓</span>
                        </div>
                    </div>
                )}

                {/* ポケモン画像エリア */}
                <div className="relative h-48 flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm">
                    <div className="relative">
                        <Image 
                            src={pokemon.front_image} 
                            alt={pokemon.name} 
                            width={120} 
                            height={120}
                            className="drop-shadow-lg"
                        />
                        {/* 画像の周りのグロー効果 */}
                        {isSelected && (
                            <div 
                                className="absolute inset-0 rounded-full opacity-30 animate-pulse"
                                style={{
                                    background: `radial-gradient(circle, ${typeColor}60, transparent 70%)`
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* ポケモン情報エリア */}
                <div className="p-6 text-center space-y-4">
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                        {pokemon.name}
                    </h3>
                    
                    {/* タイプバッジ */}
                    <div className="flex justify-center">
                        <span 
                            className="px-4 py-2 rounded-full text-white font-semibold text-sm shadow-lg"
                            style={{ 
                                backgroundColor: typeColor,
                                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                            }}
                        >
                            {pokemon.type1}タイプ
                        </span>
                    </div>

                    {/* 選択を促すテキスト */}
                    <div className="text-white text-opacity-80 text-sm font-medium mt-4">
                        {isSelected ? '選択中' : 'クリックして選択'}
                    </div>
                </div>

                {/* ホバー時のオーバーレイ */}
                <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300" />
            </div>
        </div>
    );
}
