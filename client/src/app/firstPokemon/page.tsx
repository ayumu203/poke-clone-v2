"use client"
import { useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useRouter } from "next/navigation";
import { usePlayer } from "../../../context/playerContext";
import { useUser } from "../../../context/userContext";
import Main from "./Main";

export default function Home() {
    const { user } = useUser();
    const { player } = usePlayer();
    const router = useRouter();

    // useEffect(() => {
    //     if (!user) {
    //         router.push("/signIn");
    //     }
    // }, [])
    
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
