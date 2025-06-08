"use client";

import { LanguageProvider } from "./contexts/LanguageContext";
import { weddingConfig } from "./config";
import HeroSection from "./components/HeroSection";
import { useLanguage } from "./contexts/LanguageContext";
import { FaGlobe } from "react-icons/fa";
import InvitationSection from "./components/InvitationSection";
import WeddingDaySection from "./components/WeddingDaySection";
import LocationSection from "./components/LocationSection";
import GallerySection from "./components/GallerySection";

function LanguageToggle() {
	const { language, toggleLanguage } = useLanguage();
	return (
		<button
			onClick={toggleLanguage}
			className="fixed top-4 right-4 z-50 flex items-center gap-1 bg-black/60 rounded-md px-2 py-1 text-sm text-gray-300 hover:bg-black/80 transition-colors focus:outline-none"
			aria-label="언어 전환"
			style={{ boxShadow: "none" }}
		>
			<FaGlobe className="text-gray-400 text-base" />
			<span className="font-semibold text-gray-200 uppercase">{language}</span>
		</button>
	);
}

function WeddingContent() {
	return (
		<main className="min-h-screen">
			{weddingConfig.theme.showLanguageToggle && <LanguageToggle />}

			{/* Hero 섹션 */}
			<HeroSection />

			{/* Invitation 섹션 */}
			<InvitationSection />

			{/* Wedding Day 섹션 */}
			<WeddingDaySection />

			{/* Location 섹션 */}
			<LocationSection />

			{/* Gallery 섹션 */}
			<GallerySection />
		</main>
	);
}

export default function Home() {
	return (
		<LanguageProvider>
			<WeddingContent />
		</LanguageProvider>
	);
}
