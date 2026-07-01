import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Manrope } from "next/font/google";
import { AuthHydrator } from "@/modules/auth/components/AuthHydrator";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "TalentFlow — Sistema de Reclutamiento",
  description: "Encuentra tu próxima oportunidad o gestiona tus procesos de reclutamiento con TalentFlow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} ${inter.variable} ${ibmPlexMono.variable} antialiased`}>
        <AuthHydrator />
        {children}
      </body>
    </html>
  );
}
