"use client"
import { useEffect } from "react";
import { useUser } from "../../context/userContext";
import { useRouter } from "next/navigation";
import { usePlayer } from "../../context/playerContext";

export default function Home() {
  const { user } = useUser();
  const { player } = usePlayer();
  const router = useRouter();
  console.log(user);

  useEffect(()=>{
    if(!user){
      router.push("/signIn");
    }
  },[])
  
  return (
    <>
    Hi <br></br>
    {player?.player_id} <br></br>
    {player?.name} <br></br>
    </>
  );
}
