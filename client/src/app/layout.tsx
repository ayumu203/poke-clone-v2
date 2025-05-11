import type { Metadata } from "next";
import { DotGothic16 } from "next/font/google";
import { UserProvider } from "../../context/userContext";
import { PlayerProvider } from "../../context/playerContext";
import "./globals.css";


const inter = DotGothic16({
  weight:'400',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "Poke-Clone",
  description: "This is a clone app of Pokemon.",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={inter.className}
      >
        <UserProvider>
          <PlayerProvider>
            {children}
          </PlayerProvider>
        </UserProvider>
      </body>
    </html>
  );
}
