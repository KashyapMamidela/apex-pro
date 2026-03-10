import type { Metadata } from "next";
import { Syne, DM_Sans, Space_Mono, Bebas_Neue, Space_Grotesk } from "next/font/google";
import "./globals.css";

// ── Creative Display Font: Syne (geometric bold, very unique) ──
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// ── Modern Body: DM Sans (clean, humanist, premium) ──
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// ── Mono Data: Space Mono ──
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// ── Impact Headlines: Bebas Neue ──
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

// ── Subheadings: Space Grotesk (techy, editorial) ──
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
      <head>
        {/* Satoshi from Fontshare — creative sans for titles */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap"
        />
      </head>
      <body
        className={`${syne.variable} ${dmSans.variable} ${spaceMono.variable} ${bebasNeue.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
