"use client";

import { LanguageProvider } from "./contexts/LanguageContext";

import { weddingConfig } from "./config";

import InvitationSection from "./components/InvitationSection";
import WeddingDaySection from "./components/WeddingDaySection";
import GallerySection from "./components/GallerySection";
import AccountSection from "./components/AccountSection";

import { useLanguage } from "./contexts/LanguageContext";

import { FaGlobe } from "react-icons/fa";
import HeroSection from "./components/HeroSection";
import LocationSection from "./components/LocationSection";
import NoticeSection from "./components/NoticeSection";

function LanguageToggle() {
	const { language, toggleLanguage } = useLanguage();

	return (
		<button
			onClick={toggleLanguage}
			className="language-toggle-btn fixed top-4 right-4 z-50 flex items-center gap-1 bg-black/60 rounded-md px-2 py-1 text-sm text-gray-300 hover:bg-black/80 transition-colors focus:outline-none"
			aria-label="언어 전환"
			style={{
				boxShadow: "none",
			}}
		>
			{" "}
			<FaGlobe className="text-gray-400 text-base" />{" "}
			<span className="font-semibold text-gray-200 uppercase"> {language}</span>{" "}
		</button>
	);
}

function WeddingContent() {
	const gray = "#f5f5f5";
	const white = "#fff";

	return (
		<main className="min-h-screen">
			{" "}
			{weddingConfig.theme.showLanguageToggle && <LanguageToggle />}
			<HeroSection /> <InvitationSection backgroundColor={white} /> <WeddingDaySection backgroundColor={gray} />{" "}
			<LocationSection backgroundColor={white} /> <GallerySection backgroundColor={gray} />{" "}
			<AccountSection backgroundColor={white} /> <NoticeSection backgroundColor={gray} />{" "}
		</main>
	);
}

export default function Home() {
	return (
		<LanguageProvider>
			{" "}
			<WeddingContent />{" "}
		</LanguageProvider>
	);
}
