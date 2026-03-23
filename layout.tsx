import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import { LanguageProvider } from "@/lib/language-context";
import { SoundProvider } from "@/components/SoundToggle";
import PWAInstall from "@/components/PWAInstall";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "First Frame - Creative Production & Studio",
  description: "First Frame is a creative production and post-production studio based in Paris, France. We leverage the next generation of creatives to craft memorable experiences through imagery and storytelling.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "First Frame",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://firstframe.fr",
    siteName: "First Frame",
    title: "First Frame - Creative Production & Studio",
    description: "Creative production and post-production studio based in Paris, France.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "First Frame",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "First Frame - Creative Production & Studio",
    description: "Creative production and post-production studio based in Paris, France.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* PWA Meta Tags */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-152x152.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        {/* Splash screens for iOS */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512x512.png" />
      </head>
      <body className="bg-black text-white min-h-screen antialiased">
        <LanguageProvider>
          <SoundProvider>
            <CustomCursor />
            <Header />
            <main>
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <Footer />
            <CookieBanner />
            <PWAInstall />
          </SoundProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
