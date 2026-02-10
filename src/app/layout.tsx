import "@/app/globals.css";
import {Toaster} from "@/shared/components/atoms/sonner";
import Providers from "@/shared/providers/providers";
import ThemeProvider from "@/widgets/theme/ThemeProvider";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "MiniMoku",
  description: "Nihongo Advanced Words",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="text-foreground antialiased">
        <ThemeProvider>
          <Toaster />
          {/* SessionProvider is a client component, so it's separated into a component with 'use client' directive */}
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
