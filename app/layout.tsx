import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "LensLab — AI Reality Lens",
  description:
    "Reveal the parallel reality hidden in your photos. Upload an image, pick a style, and explore the AI-generated world through a magic lens. Powered by Google Gemini.",
  keywords: [
    "AI",
    "image generation",
    "Gemini",
    "lens",
    "parallel reality",
    "style transfer",
    "open source",
  ],
  openGraph: {
    title: "LensLab — AI Reality Lens",
    description: "Reveal the parallel reality hidden in your photos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased noise`}
      >
        {children}
      </body>
    </html>
  );
}
