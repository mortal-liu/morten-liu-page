import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://morten-liu-notes.mortal060316.chatgpt.site"),
  title: "Morten-Liu — 一份安静的自我介绍",
  description: "Morten-Liu 的个人主页：音乐、电影、喜欢的文字，以及一些缓慢生长的想法。",
  icons: {
    icon: "/avatar.jpg",
    shortcut: "/avatar.jpg",
  },
  openGraph: {
    title: "Morten-Liu — A Quiet Personal Archive",
    description: "音乐、电影、喜欢的文字，以及一些缓慢生长的想法。",
    type: "website",
    images: [{ url: "/og-v2.png", width: 1536, height: 903, alt: "Morten-Liu personal archive" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Morten-Liu — A Quiet Personal Archive",
    description: "音乐、电影、喜欢的文字，以及一些缓慢生长的想法。",
    images: ["/og-v2.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
