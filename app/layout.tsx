import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteVisitCounter from "./components/SiteVisitCounter";
import CookieConsent from "./components/CookieConsent";
import ConsentAwareAnalytics from "./components/ConsentAwareAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sportiva24.com"),
  title: {
    default: "Sportiva24 | Inteligencia futbolística",
    template: "%s | Sportiva24",
  },
  description: "Partidos, datos confirmados e inteligencia futbolística de Sportiva24.",
  applicationName: "Sportiva24",
  keywords: ["fútbol", "partidos de hoy", "inteligencia futbolística", "análisis de fútbol"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://sportiva24.com",
    siteName: "Sportiva24",
    title: "Sportiva24 | Inteligencia futbolística",
    description: "Partidos, datos confirmados e inteligencia futbolística.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sportiva24 | Inteligencia futbolística",
    description: "Partidos, datos confirmados e inteligencia futbolística.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SiteVisitCounter />
        <CookieConsent />
        <ConsentAwareAnalytics />
      </body>
    </html>
  );
}
