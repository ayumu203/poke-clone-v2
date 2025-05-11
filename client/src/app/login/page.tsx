"use client"
import { useState } from "react";
import { supabase } from "../../../lib/supabase/supabase";

const Home = () => {
    const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });
    const u = await supabase.auth.getUser();
    console.log(u);
    if (error) {
        console.error('Error logging in:', error);
    } else {
        console.log('User logged in:', data);
    }
    };

    const handleSignOut = async () => {
    await supabase.auth.signOut();
    }
    return (
    <div>
        <h1>Welcome to My App</h1>
        <button onClick={handleLogin}>Sign in with Google</button>
        <button onClick={handleSignOut}>Sign Out</button>
    </div>
    );
};

export default Home;