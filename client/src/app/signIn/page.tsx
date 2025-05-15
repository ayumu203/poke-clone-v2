"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase/supabase";
import { useUser } from "../../../context/userContext";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { usePlayer } from "../../../context/playerContext";
import { log } from "console";

export default function SignInPage() {
  const { user } = useUser();
  const { player } = usePlayer();
  const router = useRouter();


  useEffect(() => {
    if (user && player) {
      router.push("/");
    }
  }, [user,player]);

  return (
    <div className="">
      <Header />
      {
        !user && 
      <>      
        <div className="flex justify-center">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["google"]}
            onlyThirdPartyProviders
          />
        </div>
      </>
      }
      {
        user && !player &&
        <>現在ログインの処理中...</>
      }
      <Footer />
    </div>
  );
}
