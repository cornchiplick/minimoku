import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "로그인 | MiniMoku",
  description: "MiniMoku 에 로그인하거나 로그인 없이 둘러봅니다.",
};

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return children;
}
