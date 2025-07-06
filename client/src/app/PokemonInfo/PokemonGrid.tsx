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
    pokemonData: PokemonData[];
    onPokemonSelect: (index: number) => void;
};

export default function PokemonGrid({ pokemonData, onPokemonSelect }: Props) {
    // 最大HP計算（レベルベースの簡易計算）
    const calculateMaxHP = (pokemon: Pokemon, level: number) => {
        if (!pokemon) return 0;
        return Math.floor(pokemon.base_hp * level / 100) + 10;
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8">
            <div className="text-white text-xl mb-8">ポケモンを選んでください</div>
            <div className="grid grid-cols-2 gap-4 max-w-4xl">
                {pokemonData.map((data, index) => {
                    if (!data.pokemon || !data.teamPokemon) return null;
                    
                    const maxHP = calculateMaxHP(data.pokemon, data.teamPokemon.level);
                    const currentHP = maxHP; // 現在は最大HPと同じに設定
                    
                    return (
                        <div
                            key={index}
                            onClick={() => onPokemonSelect(index)}
                            className="bg-gradient-to-r from-blue-600 to-blue-800 border-2 border-white rounded-lg p-4 cursor-pointer hover:from-blue-500 hover:to-blue-700 transition-all duration-200 min-w-80"
                        >
                            <div className="flex items-center space-x-4">
                                {/* ポケモン画像 */}
                                <div className="w-16 h-16 flex-shrink-0">
                                    <Image
                                        src={data.pokemon.front_image}
                                        alt={data.pokemon.name}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                
                                {/* ポケモン情報 */}
                                <div className="flex-1">
                                    {/* 名前とレベル */}
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-white font-bold text-lg">
                                            {data.pokemon.name}
                                        </span>
                                        <span className="text-yellow-300 font-bold">
                                            Lv.{data.teamPokemon.level}
                                        </span>
                                    </div>
                                    
                                    {/* HP バー */}
                                    <div className="mb-1">
                                        <div className="text-white text-sm mb-1">HP</div>
                                        <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                                            <div
                                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${Math.floor((currentHP / maxHP) * 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-white text-xs text-right">
                                            {Math.floor(currentHP)}/{Math.floor(maxHP)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                
                {/* 空のスロット */}
                {Array.from({ length: 6 - pokemonData.length }, (_, index) => (
                    <div
                        key={`empty-${index}`}
                        className="bg-gray-600 border-2 border-gray-500 rounded-lg p-4 min-w-80 opacity-50"
                    >
                        <div className="flex items-center justify-center h-24">
                            <span className="text-gray-400">空のスロット</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
