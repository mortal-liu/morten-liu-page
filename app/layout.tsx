import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Morten-Liu — 一份安静的自我介绍",
  description: "Morten-Liu 的个人主页：音乐、电影、喜欢的文字，以及一些缓慢生长的想法。",
  icons: {
    icon: "/avatar.jpg",
    shortcut: "/avatar.jpg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
