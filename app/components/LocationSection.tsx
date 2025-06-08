import React, { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { weddingConfig } from "../config";
import { location } from "../config/sections/location";
import Script from "next/script";
import { Coordinates, NaverMap, MapOptions } from "../types/map";
import SectionTemplate from "./SectionTemplate";

const MAP_ID = "wedding-location-map";
const VENUE_COORDINATES: Coordinates = {
	lat: 37.5635,
	lng: 126.9857,
};

export default function LocationSection({ backgroundColor }: { backgroundColor?: string }) {
	const { language } = useLanguage();
	const { venue } = weddingConfig;
	const mapRef = useRef<NaverMap | null>(null);

	const initializeMap = useCallback(() => {
		if (!window.naver || !window.naver.maps) return;

		const mapOptions: MapOptions = {
			center: new window.naver.maps.LatLng(VENUE_COORDINATES.lat, VENUE_COORDINATES.lng),
			zoom: 17,
			scaleControl: true,
			mapDataControl: true,
			zoomControl: true,
			zoomControlOptions: {
				position: window.naver.maps.Position.TOP_RIGHT,
			},
			logoControlOptions: {
				position: window.naver.maps.Position.BOTTOM_LEFT,
			},
		};

		const map = new window.naver.maps.Map(MAP_ID, mapOptions);
		mapRef.current = map;

		// 마커 생성
		const marker = new window.naver.maps.Marker({
			position: new window.naver.maps.LatLng(VENUE_COORDINATES.lat, VENUE_COORDINATES.lng),
			map: map,
		});

		// 인포윈도우 생성
		const infowindow = new window.naver.maps.InfoWindow({
			content: `
        <div style="padding:10px;min-width:200px;text-align:center;">
          <b>${venue.name}</b><br/>
          ${venue.address}
        </div>
      `,
		});

		// 마커 클릭 이벤트
		window.naver.maps.Event.addListener(marker, "click", () => {
			if (infowindow.getMap()) {
				infowindow.close();
			} else {
				infowindow.open(map, marker);
			}
		});
	}, [venue.name, venue.address]);

	return (
		<SectionTemplate
			id="location"
			title={location.title[language]}
			subtitle={location.subtitle[language]}
			backgroundColor={backgroundColor}
		>
			{/* 네이버 지도 API 스크립트 */}
			<Script
				strategy="afterInteractive"
				src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
				onReady={initializeMap}
			/>

			<div className="w-full max-w-lg mx-auto px-4">
				{/* 지도 컨테이너 */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg mb-8"
				>
					<div id={MAP_ID} className="w-full h-full" />
				</motion.div>

				{/* 상세 정보 */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className="max-w-2xl mx-auto"
				>
					<div className="bg-gray-50 rounded-xl p-6">
						<div className="space-y-4 text-gray-700 whitespace-pre-line">{location.content?.[language]}</div>

						{/* 지도 링크 버튼 */}
						<div className="mt-6 flex gap-4 justify-center">
							<a
								href={venue.naverMapUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
							>
								네이버 지도
							</a>
							<a
								href={venue.kakaoMapUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors"
							>
								카카오 지도
							</a>
						</div>
					</div>
				</motion.div>
			</div>
		</SectionTemplate>
	);
}
