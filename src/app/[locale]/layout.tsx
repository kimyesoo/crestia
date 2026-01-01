import type { Metadata } from "next";
import "@/app/globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Script from "next/script";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s | Crestia",
    default: "Crestia - 크레스티드 게코 혈통 플랫폼",
  },
  description: "크레스티드 게코 유전학 정보, 모프 계산기, 프리미엄 분양 플랫폼.",
  keywords: ["크레스티드 게코", "모프 계산기", "파충류 분양", "게코 혈통", "crested gecko", "morph calculator"],
  openGraph: {
    type: "website",
    siteName: "Crestia",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Crestia - 크레스티드 게코 혈통 플랫폼" }],
  },
  twitter: {
    card: "summary_large_image",
  },
  metadataBase: new URL("https://crestia.vercel.app"),
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
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />
        {/* Google AdSense - TODO: ca-pub-XXXXXXXXXXXXXXXX를 실제 Client ID로 교체 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0000000000000000"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`antialiased bg-background text-foreground font-sans min-h-screen flex flex-col overflow-x-hidden`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <Navbar user={user} />
          <main className="flex-1 relative pt-20 overflow-x-hidden">
            {children}
          </main>
          <Footer />
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
