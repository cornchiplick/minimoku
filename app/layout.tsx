import Nav from "@/components/common/Nav";
import Typography from "@/components/home/atomic/Typography";
import Providers from "@/providers/providers";
import type {Metadata} from "next";
import "./globals.css";

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
      <body className={`antialiased`}>
        {/* SessionProvider is a client component, so it's separated into a component with 'use client' directive */}
        <Providers>
          <div className="min-h-screen bg-gray-50">
            {/* 네비게이션 바 */}
            <Nav />

            {/* 메인 컨텐츠 */}
            <main className="flex min-h-screen flex-row justify-center pb-8">{children}</main>

            {/* 푸터 */}
            <footer className="bg-gray-800 p-4 text-white">
              <div className="container mx-auto text-center">
                <Typography.P2>&copy; 2025 일본어 회화 암기노트 - 모든 권리 보유</Typography.P2>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
