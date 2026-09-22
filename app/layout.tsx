import type { Metadata, Viewport } from "next";
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://mis-detalles-three.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tengo un detalle para ti... ✨ Abre tu universo",
    template: "%s | Mis Detalles",
  },
  description:
    "Abre este enlace para descubrir el universo de recuerdos, flores amarillas y palabras que preparé para ti.",
  openGraph: {
    title: "Tengo un detalle especial para ti... ✨🌻",
    description:
      "Abre este enlace para descubrir el universo cósmico, flores amarillas y recuerdos que preparé para ti.",
    url: siteUrl,
    siteName: "Mis Detalles",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Flores Amarillas - Tengo un detalle especial para ti",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tengo un detalle especial para ti... ✨🌻",
    description:
      "Abre este enlace para descubrir el universo cósmico, flores amarillas y recuerdos que preparé para ti.",
    images: [`${siteUrl}/og-image.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#02040a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} min-h-screen w-full antialiased bg-black`}
    >
      <body className="min-h-screen w-full bg-black text-white m-0 p-0">
        {children}
      </body>
    </html>
  );
}
