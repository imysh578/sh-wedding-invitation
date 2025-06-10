import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { weddingConfig } from "./config";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

// 절대경로용 SITE_URL 환경변수 사용
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

export const metadata: Metadata = {
	title: `${weddingConfig.meta.title}`,
	description: `${weddingConfig.meta.description}`,
	openGraph: {
		title: `${weddingConfig.meta.title}`,
		description: `${weddingConfig.meta.description}`,
		images: [
			{
				url: `${SITE_URL}${weddingConfig.meta.ogImage}`,
				width: 1200,
				height: 630,
				alt: "청첩장 썸네일",
			},
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	);
}
