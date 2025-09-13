import "@/app/globals.css";
import Providers from "@/shared/providers/providers";
import ThemeBody from "@/widgets/theme/ThemeBody";
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
        <ThemeBody>
          {/* SessionProvider is a client component, so it's separated into a component with 'use client' directive */}
          <Providers>{children}</Providers>
        </ThemeBody>
      </body>
    </html>
  );
}
