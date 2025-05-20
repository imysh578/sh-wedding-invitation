import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { weddingConfig } from '../config';

export default function HeroSection() {
  const { language } = useLanguage();
  const { announcement, content, image } = weddingConfig.hero;
  const groomName = weddingConfig.groom.name[language];
  const brideName = weddingConfig.bride.name[language];

  // 날짜/장소 정보 분리 (config의 content는 줄바꿈 포함)
  const [dateLine, ...placeLines] = content[language].split('\n');
  const place = placeLines.join(' ');

  return (
    <section className="relative h-screen w-full flex flex-col justify-between">
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt="Wedding Background"
          className="h-full w-full object-cover"
        />
      </div>
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/30" />

      {/* 상단 announcement */}
      <div className="relative z-10 flex flex-col items-center pt-24">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-white text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg font-[cursive]"
          style={{ textShadow: '0 4px 16px rgba(0,0,0,0.25)' }}
        >
          {announcement}
        </motion.h2>
      </div>

      {/* 하단 카드 */}
      <div className="relative z-10 flex flex-col items-center pb-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="bg-white/95 rounded-2xl shadow-xl px-8 py-8 w-[90%] max-w-md text-center"
        >
          {/* 이름 + 하트 */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-2xl md:text-3xl font-semibold text-gray-900">{groomName}</span>
            <span className="text-2xl">❤️</span>
            <span className="text-2xl md:text-3xl font-semibold text-gray-900">{brideName}</span>
          </div>
          {/* 날짜 */}
          <div className="text-gray-700 text-lg md:text-xl mb-2 font-medium">{dateLine}</div>
          {/* 장소 */}
          <div className="text-gray-600 text-base md:text-lg whitespace-pre-line">{place}</div>
        </motion.div>
      </div>
    </section>
  );
} 