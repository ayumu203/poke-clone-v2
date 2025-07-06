"use client"
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Main from "./Main";
import EnvDebugComponent from "../../components/EnvDebugComponent";

export default function Home() {    
    return (
        <>
            <EnvDebugComponent />
            <div className="min-h-screen flex flex-col">
                <Header />
                <Main />
                <Footer />
            </div>
        </>
    );
}
