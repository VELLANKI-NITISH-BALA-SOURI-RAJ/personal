import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reel Growth OS – Performance Intelligence for Short-Form Creators",
  description:
    "Stop guessing. Start growing. Reel Growth OS analyzes your reel performance data and generates optimized scripts, hooks, and growth strategies powered by AI.",
  keywords: "reel growth, instagram reels, content strategy, AI script generator, engagement analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1a1a2e",
                color: "#e2e8f0",
                border: "1px solid #334155",
                borderRadius: "12px",
                fontFamily: "var(--font-inter)",
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
