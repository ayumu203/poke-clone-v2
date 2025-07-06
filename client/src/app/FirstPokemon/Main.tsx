import React, { useEffect, useState } from 'react'
import { fetch_first_pokemon } from '../../../lib/first_pokemon/fetch_first_pokemon';
import { usePlayer } from '../../../context/playerContext';
import { Pokemon } from '../../../type/pokemon.type';
import { register_first_pokemon } from '../../../lib/first_pokemon/register_first_pokemon';
import { is_first_pokemon } from '../../../lib/first_pokemon/is_first_pokemon';
import { useRouter } from 'next/navigation';
import { TeamPokemon } from '../../../type/teamPokemon.type';
import { fetch_team_pokemon } from '../../../lib/team_pokemon/fetch_team_pokemon';
import PokemonImage from './pokemonImage';
import PokemonName from './pokemonName';

export default function Main() {
    const { player } = usePlayer();
    // 手持ちにポケモンがいるかを保持
    const [ pageFlag, setPageFlag ] = useState<boolean>(false);
    // 選択可能ポケモンを保持
    const [ firstPokemons, setFirstPokemons ] = useState<Pokemon[]>([]);
    // 選択したポケモンのIDを保持
    const [ selectId, setSelectId ] = useState<number>(-1);
    // 選択を送信済みかを保持
    const [ submitFlag, setSubmitFlag ] = useState<boolean>(false);
    // エラー状態を保持
    const [ error, setError ] = useState<string>("");
    const router = useRouter();


    // 以下は手持ちにポケモンがいる場合の処理
    useEffect(()=>{
        const handleExistTeamPokemon = async() =>{
            if(player){
                try {
                    const exist = await is_first_pokemon(player.player_id);
                    if(exist)router.push("/");
                    else setPageFlag(true);
                } catch (err) {
                    console.error('Team Pokemon check error:', err);
                    setError(`チーム確認エラー: ${err}`);
                    setPageFlag(true); // エラーでも画面は表示
                }
            }
        }
        handleExistTeamPokemon();
    },[player]);

    // 以下は初期ポケモン登録処理
    function handleSelect(id: number): void {
        setSelectId(id);
    }

    useEffect(()=>{
        const handleFetchFirstPokemon = async() => {
            try {
                console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
                
                // まずサーバーの基本的な接続をテスト
                const healthResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`);
                console.log('Health check response:', healthResponse.status);
                
                if (!healthResponse.ok) {
                    throw new Error(`サーバーが応答しません (Status: ${healthResponse.status})`);
                }
                
                const fpks:Pokemon[] = await fetch_first_pokemon();
                setFirstPokemons(fpks);
                setError(""); // エラーをクリア
            } catch (err: any) {
                console.error('First Pokemon fetch error:', err);
                const errorMessage = err?.message || 'Unknown error';
                setError(`ポケモン取得エラー: ${errorMessage}`);
                
                // ネットワークエラーの詳細情報も追加
                if (err.name === 'TypeError' && err.message.includes('fetch')) {
                    setError(`ネットワークエラー: サーバーに接続できません (${process.env.NEXT_PUBLIC_API_URL})`);
                }
            }
        }
        if(player)handleFetchFirstPokemon();
    },[player]);

    const handleSubmit = () => {
        if(!submitFlag && player){
            if(selectId === 494 || selectId === 495 || selectId === 501){
                setSubmitFlag(true);
            }
        }
    }

    useEffect(()=>{
        const handleRegister = async() => {
            if(submitFlag && player){
                await register_first_pokemon(player.player_id,selectId);
                const pokemon:TeamPokemon = await fetch_team_pokemon(player.player_id,0);
                if(pokemon)router.push("/");
            }
        }
        handleRegister();
    },[submitFlag]);

    return (
        <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 flex-1 flex flex-col text-white">
            <div className="flex-1 flex flex-col items-center justify-center p-6">
            
            <div className="relative z-10 w-full max-w-4xl mx-auto">
                {/* エラー表示 */}
                {error && (
                    <div className="mb-6 bg-red-500 bg-opacity-90 text-white p-4 rounded-lg">
                        <h3 className="font-bold">エラーが発生しました:</h3>
                        <p className="text-sm">{error}</p>
                        <p className="text-xs mt-2">API URL: {process.env.NEXT_PUBLIC_API_URL || '未設定'}</p>
                    </div>
                )}

                {/* ローディング状態 */}
                {submitFlag && (
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
                        <div className="text-3xl font-bold">
                            あなたの相棒を登録しています...
                        </div>
                    </div>
                )}

                {/* メインコンテンツ */}
                {!submitFlag && pageFlag && (
                    <div className="space-y-6 mb-8">
                        {/* タイトルセクション */}
                        <div className="text-center space-y-4">
                            <h1 className="text-5xl font-bold text-white drop-shadow-lg">
                                最初のパートナーを選ぼう！
                            </h1>
                            <p className="text-xl text-gray-200 drop-shadow">
                                あなたの冒険を共にするポケモンを選択してください
                            </p>
                        </div>

                        {/* 選択中のポケモン表示 */}
                        {selectId !== -1 && (
                            <div className="bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-600 border-opacity-50">
                                {firstPokemons.map((pokemon: Pokemon, index: number) => {
                                    if (pokemon?.pokemon_id === selectId) {
                                        return (
                                            <PokemonName 
                                                key={index} 
                                                name={pokemon.name} 
                                                type={pokemon.type1}
                                            />
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        )}

                        {/* ポケモン選択グリッド */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center px-4">
                            {firstPokemons.map((pokemon, index) => (
                                pokemon ? (
                                    <PokemonImage 
                                        key={index} 
                                        pokemon={pokemon} 
                                        onSelect={handleSelect}
                                        isSelected={selectId === pokemon.pokemon_id}
                                    />
                                ) : null
                            ))}
                        </div>

                        {/* 決定ボタン */}
                        {selectId !== -1 && (
                            <div className="flex justify-center pt-4 pb-8">
                                <button 
                                    className="px-12 py-4 bg-gradient-to-r from-slate-600 to-blue-700 hover:from-slate-700 hover:to-blue-800 text-white text-2xl font-bold rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleSubmit}
                                    disabled={selectId === -1}
                                >
                                    この子に決めた！
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* データ取得中 */}
                {!pageFlag && (
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="animate-pulse">
                            <div className="flex space-x-2">
                                <div className="w-4 h-4 bg-white rounded-full animate-bounce"></div>
                                <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-4 h-4 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                        </div>
                        <div className="text-3xl font-bold">
                            ポケモンたちを探しています...
                        </div>
                    </div>
                )}
            </div>
            </div>
        </div>
    )
}
