import Image from "next/image";
import { Pokemon } from "../../../type/pokemon.type";
import { TeamPokemon } from "../../../type/teamPokemon.type";
import { Move } from "../../../type/move.type";

type PokemonData = {
    pokemon: Pokemon;
    teamPokemon: TeamPokemon;
    moves: Move[];
};

type Props = {
    pokemonData: PokemonData;
};

// タイプカラーマッピング
const typeColors: { [key: string]: string } = {
    normal: "bg-gray-400",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-blue-200",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-yellow-600",
    flying: "bg-indigo-400",
    psychic: "bg-pink-500",
    bug: "bg-green-400",
    rock: "bg-yellow-800",
    ghost: "bg-purple-700",
    dragon: "bg-indigo-700",
    dark: "bg-gray-800",
    steel: "bg-gray-500",
    fairy: "bg-pink-300",
};

export default function PokemonDetail({ pokemonData }: Props) {
    const { pokemon, teamPokemon, moves } = pokemonData;

    if (!pokemon || !teamPokemon) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-white text-xl">ポケモンデータが見つかりません</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col bg-gradient-to-b from-cyan-600 to-cyan-800 relative">
            {/* ヘッダー部分 */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-cyan-700 to-cyan-900">
                <div className="flex items-center space-x-4">
                    <div className="w-20 h-20">
                        <Image
                            src={pokemon.front_image}
                            alt={pokemon.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div>
                        <div className="text-white text-2xl font-bold">{pokemon.name}</div>
                        <div className="text-yellow-300 text-lg font-bold">Lv.{teamPokemon.level}</div>
                    </div>
                </div>
                <div className="text-white text-sm">
                    <div>もちもの</div>
                    <div>なし</div>
                </div>
            </div>

            {/* 技リスト */}
            <div className="flex-1 p-6">
                <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
                    {moves.filter(move => move !== null).map((move, index) => {
                        if (!move) return null;
                        
                        const typeColor = typeColors[move.type] || "bg-gray-400";
                        const maxPP = move.pp;
                        const currentPP = maxPP; // 現在は最大PPと同じに設定
                        
                        return (
                            <div
                                key={index}
                                className="bg-gradient-to-r from-cyan-500 to-cyan-700 border-2 border-cyan-300 rounded-lg p-4 hover:from-cyan-400 hover:to-cyan-600 transition-all duration-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        {/* 技のタイプアイコン */}
                                        <div className={`w-8 h-8 ${typeColor} rounded-full flex items-center justify-center`}>
                                            <span className="text-white text-xs font-bold">
                                                {move.type.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        
                                        {/* 技名 */}
                                        <div>
                                            <div className="text-white font-bold text-lg">{move.name}</div>
                                            <div className="text-cyan-100 text-sm">{move.type}</div>
                                        </div>
                                    </div>
                                    
                                    {/* PP */}
                                    <div className="text-right">
                                        <div className="text-white text-sm">PP</div>
                                        <div className="text-white font-bold">
                                            {currentPP}/{maxPP}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* 技の詳細情報 */}
                                <div className="mt-2 text-cyan-100 text-sm">
                                    <div className="flex justify-between">
                                        <span>威力: {move.power || "—"}</span>
                                        <span>命中: {move.accuracy || "—"}</span>
                                        <span>カテゴリ: {move.damage_class}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* 空の技スロット */}
                    {Array.from({ length: 4 - moves.filter(move => move !== null).length }, (_, index) => (
                        <div
                            key={`empty-${index}`}
                            className="bg-gray-600 border-2 border-gray-500 rounded-lg p-4 opacity-50"
                        >
                            <div className="flex items-center justify-center h-16">
                                <span className="text-gray-400">———</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* フッター部分 */}
            <div className="p-6 bg-gradient-to-r from-cyan-700 to-cyan-900">
                <div className="text-center text-cyan-100 text-sm">
                    ポケモンの詳細情報
                </div>
            </div>
        </div>
    );
}
