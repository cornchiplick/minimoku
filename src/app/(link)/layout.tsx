import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MiniMoku",
  description: "Nihongo Advanced Words",
};

export default function LinkHomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main>{children}</main>
  );
}
