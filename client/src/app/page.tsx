"use client"
import { useEffect } from "react";
import { useUser } from "../../context/userContext";
import { useRouter } from "next/navigation";
import { usePlayer } from "../../context/playerContext";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import Main from "./Home/Home";

export default function Home() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/signIn");
    }
  }, [])

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Main />
        <Footer />
      </div>
    </>
  );
}
