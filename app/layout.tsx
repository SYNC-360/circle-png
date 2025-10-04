import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Circle PNG - Free Transparent Circle Images Generator & Download",
  description: "Create and download custom circle PNG images with transparent backgrounds. Free circle generator with colors, borders, gradients, and shadows. Instant download, no signup required.",
  keywords: "circle png, transparent circle, circle images, circle generator, free circle png, circle download, png circle, transparent background",
  authors: [{ name: "Circle PNG" }],
  openGraph: {
    title: "Circle PNG - Free Generator & Download",
    description: "Create custom circle PNGs instantly with our free generator. Transparent backgrounds, any color, any size.",
    url: "https://circlepng.com",
    siteName: "Circle PNG",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Circle PNG Generator",
    description: "Create and download custom circle PNG images instantly.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6CPYVQBJ9Q"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6CPYVQBJ9Q');
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}