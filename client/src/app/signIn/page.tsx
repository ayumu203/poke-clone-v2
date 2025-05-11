"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "../../../lib/supabase/supabase";
import { useUser } from "../../../context/userContext";

export default function SignInPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  return (
    <div className="">
      <div className="justify-items-center mt-10 mb-8">
      </div>
      <div className="flex justify-center">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
          onlyThirdPartyProviders
        />
      </div>
    </div>
  );
}
