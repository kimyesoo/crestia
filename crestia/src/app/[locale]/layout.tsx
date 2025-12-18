import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "@/app/globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

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
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();


  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body
        className={`${playfair.variable} ${lato.variable} antialiased bg-background text-foreground font-sans min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider messages={messages}>
          <Navbar user={user} />
          <main className="flex-1 mt-[88px] md:mt-[96px]">
            {children}
          </main>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
