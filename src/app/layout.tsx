// @ts-ignore: side-effect CSS import without type declarations
import "@/app/globals.css";
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
      <body className="antialiased">
        <ThemeProvider>
          {/* SessionProvider is a client component, so it's separated into a component with 'use client' directive */}
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
