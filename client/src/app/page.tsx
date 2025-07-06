"use client"
import { useEffect } from "react";
import { useUser } from "../../context/userContext";
import { useRouter } from "next/navigation";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import Main from "./Main/Main";
import { usePlayer } from "../../context/playerContext";

export default function Home() {
  const { user } = useUser();
  const { player } = usePlayer();
  const router = useRouter();


  useEffect(() => {
    if (!user) {
      router.push("/signIn");
    }
  }, [user, router])

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        {user && player && <Main />}
        <Footer />
      </div>
    </>
  );
}
