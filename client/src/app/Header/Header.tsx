import React, { useState } from 'react'
import { usePlayer } from '../../../context/playerContext';

export default function Header() {
    const { player } = usePlayer();
    const [date] = useState(new Date());

    return (
        <div className="flex w-full bg-gray-300 justify-between text-cyan-800 text-lg">
            <span className="mr-5">
                {date.getMonth()}/{date.getDate()} XD:IL
            </span>
            <span>
                {player && <>こんにちは, {player.name}</>}
                {!player && <>まずはログインをしてね</>}
            </span>
            <span className="ml-5">
                天気:OY
            </span>
        </div>
  )
}
