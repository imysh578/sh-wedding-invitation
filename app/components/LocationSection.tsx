import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { weddingConfig } from '../config';
import { location } from '../config/location';
import Script from 'next/script';

export default function LocationSection() {
  const { language } = useLanguage();
  const { venue } = weddingConfig;

  useEffect(() => {
    // 네이버 지도 API가 로드된 후 실행
    if (window.naver && window.naver.maps) {
      const mapOptions = {
        center: new window.naver.maps.LatLng(37.5635, 126.9857), // 명동역 좌표
        zoom: 17,
        zoomControl: true,
        zoomControlOptions: {
          position: window.naver.maps.Position.TOP_RIGHT,
        },
      };

      const map = new window.naver.maps.Map('map', mapOptions);
      
      // 마커 생성
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(37.5635, 126.9857),
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
      window.naver.maps.Event.addListener(marker, 'click', () => {
        if (infowindow.getMap()) {
          infowindow.close();
        } else {
          infowindow.open(map, marker);
        }
      });
    }
  }, []);

  return (
    <section className="relative py-20 bg-white">
      {/* 네이버 지도 API 스크립트 */}
      <Script
        strategy="afterInteractive"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
      />

      <div className="container mx-auto px-4">
        {/* 섹션 타이틀 */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            {location.title[language]}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            {location.subtitle[language]}
          </motion.p>
        </div>

        {/* 지도 컨테이너 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg mb-8"
        >
          <div id="map" className="w-full h-full" />
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
            <div className="space-y-4 text-gray-700 whitespace-pre-line">
              {location.content?.[language]}
            </div>
            
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
    </section>
  );
} 