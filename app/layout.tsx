import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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
    default: "Sportiva24 | Inteligencia deportiva",
    template: "%s | Sportiva24",
  },
  description: "Partidos, datos confirmados e inteligencia deportiva de Sportiva24.",
  applicationName: "Sportiva24",
  keywords: ["fútbol", "partidos de hoy", "inteligencia deportiva", "análisis deportivo"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://sportiva24.com",
    siteName: "Sportiva24",
    title: "Sportiva24 | Inteligencia deportiva",
    description: "Partidos, datos confirmados e inteligencia deportiva.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sportiva24 | Inteligencia deportiva",
    description: "Partidos, datos confirmados e inteligencia deportiva.",
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
        <Analytics />
      </body>
    </html>
  );
}
