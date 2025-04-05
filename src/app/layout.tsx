import './globals.css';
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { setupVercelProductionLogs, setupUncaughtErrorLogger } from '@/lib/vercel-logger';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roteiro YouTube - Gerador de Conteúdo",
  description: "Crie roteiros, títulos, imagens e áudio para seus vídeos do YouTube com facilidade e rapidez",
};

// Se estivermos em produção, configure o sistema de logs
if (process.env.NODE_ENV === 'production') {
  setupVercelProductionLogs();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>

        {/* Script para configurar o logger de erros não capturados */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                (${setupUncaughtErrorLogger.toString()})();
              } catch (e) {
                console.error("Erro ao configurar logger:", e);
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
