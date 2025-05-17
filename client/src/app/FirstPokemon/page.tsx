"use client"
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Main from "./Main";

export default function Home() {    
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
