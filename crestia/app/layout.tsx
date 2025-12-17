import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";
import { Toaster } from "@/components/ui/sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crestia",
  description: "Luxury Gecko Pedigree Platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${lato.variable} antialiased bg-background text-foreground font-sans min-h-screen flex flex-col`}
      >
        <Navbar user={user} />
        <main className="flex-1 mt-[88px] md:mt-[96px]">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
