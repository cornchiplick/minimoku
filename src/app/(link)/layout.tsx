import {Metadata} from "next";

export const metadata: Metadata = {
  title: "LinkLocker | MiniMoku",
  description: "나중에 읽을 링크를 폴더로 모아 둡니다.",
};

// <main> 은 아래 link/layout.tsx 에서 본문만 감싼다 (여기서 감싸면 사이드바까지 들어간다)
export default function LinkRootLayout({children}: {children: React.ReactNode}) {
  return children;
}
