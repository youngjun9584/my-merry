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
  title: "박용준 ❤️ 김이슬 결혼식 초대합니다",
  description:
    "2025년 12월 20일 (토) 오후 3시 30분 | 강남 상제리제 센터 2층 르비르모어 | 저희 두 사람의 소중한 시작에 함께 해주세요.",
  keywords: [
    "결혼식",
    "모바일청첩장",
    "박용준",
    "김이슬",
    "웨딩",
    "초대장",
    "르비르모어",
  ],
  authors: [{ name: "박용준 & 김이슬" }],
  creator: "박용준 & 김이슬",
  publisher: "박용준 & 김이슬",
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: false,
  },
  openGraph: {
    title: "박용준 ❤️ 김이슬 결혼식 초대합니다",
    description:
      "2025년 12월 20일 (토) 오후 3시 30분\n강남 상제리제 센터 2층 르비르모어\n저희 두 사람의 소중한 시작에 함께 해주세요 💒",
    type: "website",
    locale: "ko_KR",
    siteName: "박용준 ❤️ 김이슬 결혼식",
    images: [
      {
        url: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_4981.jpg",
        width: 1200,
        height: 630,
        alt: "박용준 & 김이슬 결혼식 초대장",
      },
      {
        url: "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_4981-2.jpg",
        width: 1200,
        height: 630,
        alt: "박용준 & 김이슬",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "박용준 ❤️ 김이슬 결혼식 초대합니다",
    description:
      "2025년 12월 20일 (토) 오후 3시 30분 | 강남 상제리제 센터 2층 르비르모어",
    images: [
      "https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_4981.jpg",
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* 카카오톡, 네이버 등 한국 메신저 최적화 */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />

        {/* 카카오톡 전용 메타 태그 */}
        <meta property="og:site_name" content="박용준 ❤️ 김이슬 결혼식" />
        <meta property="og:locale" content="ko_KR" />

        {/* 네이버 메타 태그 */}
        <meta name="naver-site-verification" content="" />

        {/* 모바일 앱 아이콘 */}
        <link
          rel="apple-touch-icon"
          href="https://edi-img.s3.ap-northeast-2.amazonaws.com/uploads/merry/IMG_4981-2.jpg"
        />

        {/* 테마 컬러 */}
        <meta name="theme-color" content="#d08c95" />
        <meta name="msapplication-TileColor" content="#d08c95" />

        {/* 프리로드 - 중요 리소스 */}
        <link
          rel="preconnect"
          href="https://edi-img.s3.ap-northeast-2.amazonaws.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://edi-img.s3.ap-northeast-2.amazonaws.com"
        />
        <link rel="preconnect" href="https://openapi.map.naver.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
