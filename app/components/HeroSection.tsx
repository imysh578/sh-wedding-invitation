import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "../contexts/LanguageContext";
import { weddingConfig } from "../config";

export default function HeroSection() {
	const { language } = useLanguage();
	const { announcement, content, image } = weddingConfig.hero;
	const groomName = weddingConfig.groom.name[language];
	const brideName = weddingConfig.bride.name[language];

	// 날짜/장소 정보 분리 (config의 content는 줄바꿈 포함)
	const [dateLine, ...placeLines] = content[language].split("\n");
	const place = placeLines.join(" ");

	return (
		<section className="relative h-screen w-full flex flex-col justify-bet">
			{/* 배경 이미지 */}
			<div className="absolute inset-0">
				<Image src={image} alt="Wedding Background" fill priority className="object-cover" sizes="100vw" />
			</div>
			{/* 오버레이 */}
			<div className="absolute inset-0 bg-black/30" />

			{/* 상단 announcement */}
			<div className="relative z-10 flex flex-col items-center pt-24">
				<motion.h1
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
					className="text-white text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg font-[cursive]"
					style={{ textShadow: "0 4px 16px rgba(0,0,0,0.25)" }}
				>
					{announcement}
				</motion.h1>
			</div>

			{/* 하단 카드 */}
			<div className="relative z-10 flex flex-col items-center pb-8">
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.3 }}
					className=" rounded-2xl shadow-xl px-8 py-8 w-[90%] max-w-md text-center"
				>
					{/* 이름 + 하트 */}
					<div className="flex items-center justify-center gap-3 mb-4">
						<span className="text-2xl md:text-3xl font-semibold text-white">{groomName}</span>
						<span className="text-2xl">❤️</span>
						<span className="text-2xl md:text-3xl font-semibold text-white">{brideName}</span>
					</div>
					{/* 날짜 */}
					<div className="text-white text-lg md:text-xl mb-2 font-medium">{dateLine}</div>
					{/* 장소 */}
					<div className="text-white text-base md:text-lg whitespace-pre-line">{place}</div>
				</motion.div>
			</div>
		</section>
	);
}
