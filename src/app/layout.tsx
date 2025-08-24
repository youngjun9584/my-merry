import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "박용준 ❤️ 김이슬 결혼식 초대장",
  description:
    "박용준과 김이슬의 결혼식에 초대합니다. 2025년 가을, 새로운 시작을 함께 축복해주세요.",
  openGraph: {
    title: "박용준 ❤️ 김이슬 결혼식 초대장",
    description: "박용준과 김이슬의 결혼식에 초대합니다.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
