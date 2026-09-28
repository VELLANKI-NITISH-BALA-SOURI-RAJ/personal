import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "TGID Smart Accessories Advisor | AI-Powered Tech Recommendation Engine",
  description: "Stop buying products based on sponsored hype. Discover durable, high-value electronic accessories including TWS earbuds, gaming headsets, mechanical keyboards, chargers, and mouse devices, rated using rigorous multi-dimensional specs, Reddit sentiment, and real user complaint audits.",
  keywords: ["tech advisor", "buying assistant", "earbuds advisor", "mechanical keyboards guide", "durable chargers", "accessories ranking", "honest electronics reviews"],
  authors: [{ name: "TGID Smart Tech Advisor" }],
  openGraph: {
    title: "TGID Smart Accessories Advisor",
    description: "Get honest, data-backed recommendations for earbuds, speakers, chargers, and keyboards based on real-world reviews and structural durability.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} dark scroll-smooth h-full antialiased`}>
      <head>
        <meta name="theme-color" content="#08090c" />
      </head>
      <body className="min-h-full font-sans bg-background text-foreground flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 bg-grid-tech min-h-screen flex flex-col overflow-y-auto px-4 md:px-8 py-8 select-text">
          {children}
        </main>
      </body>
    </html>
  );
}
