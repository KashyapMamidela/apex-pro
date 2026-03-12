import type { Metadata } from "next";
import { Poppins, Inter, Space_Mono, Bebas_Neue } from "next/font/google";
import "../styles/globals.css";

// ── Headings: Poppins (modern, rounded, SaaS standard) ──
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// ── Body: Inter (best-in-class UI text) ──
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// ── Mono: Space Mono ──
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// ── Impact: Bebas Neue ──
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "APEX — Train. Eat. Dominate.",
  description: "Science-backed workout plans & precision nutrition. Built for serious athletes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} ${spaceMono.variable} ${bebasNeue.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
