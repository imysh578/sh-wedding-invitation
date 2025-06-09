import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { weddingConfig } from "../config";
import { location } from "../config/sections/location";
import SectionTemplate from "./SectionTemplate";
import Script from "next/script";

const VENUE_COORDINATES = {
	lat: 37.559098,
	lng: 126.984442,
};

export default function LocationSection({ backgroundColor }: { backgroundColor?: string }) {
	const { language } = useLanguage();
	const { venue } = weddingConfig;

	const handleMapLoad = useCallback(() => {
		if (window.naver && window.naver.maps) {
			const map = new window.naver.maps.Map("map", {
				center: new window.naver.maps.LatLng(VENUE_COORDINATES.lat, VENUE_COORDINATES.lng),
				zoom: 16,
			});
			new window.naver.maps.Marker({
				position: new window.naver.maps.LatLng(VENUE_COORDINATES.lat, VENUE_COORDINATES.lng),
				map,
			});
		}
	}, []);

	return (
		<SectionTemplate
			id="location"
			title={location.title[language]}
			subtitle={location.subtitle[language]}
			backgroundColor={backgroundColor}
		>
			<div className="w-full max-w-lg mx-auto px-4">
				{/* 지도 설명 텍스트 */}
				<div className="text-center mb-2">
					<div className="text-base font-semibold text-gray-800">
						{venue.name} {venue.hall}
					</div>
					<div className="text-sm text-gray-500">{venue.address}</div>
				</div>
				{/* 동적 네이버 지도 */}
				<div className="w-full h-[300px] rounded-2xl overflow-hidden shadow-lg mb-8">
					<Script
						strategy="afterInteractive"
						src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
						onLoad={handleMapLoad}
					/>
					<div id="map" style={{ width: "100%", height: "100%" }} />
				</div>

				{/* 상세 정보 */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className="max-w-2xl mx-auto"
				>
					<div className="mt-2 flex gap-4 justify-center">
						<a
							href={venue.naverMapUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-4 py-2 border border-green-200 text-green-800 rounded-lg hover:bg-green-100 transition-colors font-semibold text-base"
						>
							<img src="/images/location/naverMap.png" alt="네이버 지도" className="w-6 h-6" />
							네이버 지도
						</a>
						<a
							href={venue.kakaoMapUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-4 py-2 border border-yellow-200 text-yellow-800 rounded-lg hover:bg-yellow-100 transition-colors font-semibold text-base"
						>
							<img src="/images/location/kakaoMap.png" alt="카카오 지도" className="w-6 h-6" />
							카카오 지도
						</a>
					</div>
				</motion.div>
			</div>
		</SectionTemplate>
	);
}
