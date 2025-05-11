"use client"

import { AuthChangeEvent, Session, User } from "@supabase/supabase-js"
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase/supabase";

type UserContextType = {user:User | null};
const UserContext = createContext<UserContextType>({user:null});
export const useUser = () => useContext(UserContext);

export const UserProvider = ({children} : {children:ReactNode}) => {
    const [user,setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const {data:{ user } } = await supabase.auth.getUser();
            setUser(user);
        }

        fetchUser();

        const { data: listener } = supabase.auth.onAuthStateChange((_event:AuthChangeEvent, session:Session | null) => {
            setUser(session?.user ?? null);
        });

    return () => {
      listener?.subscription.unsubscribe();
    };

    },[]);

    return (
        <UserContext.Provider value={{ user }}>
          {children}
        </UserContext.Provider>
    );
}