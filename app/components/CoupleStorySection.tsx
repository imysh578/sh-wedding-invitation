import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { weddingConfig } from '../config';
import Image from 'next/image';
import { Section } from '../types';
import { useInView } from 'react-intersection-observer';

interface Story {
  date: { ko: string; en: string };
  title: { ko: string; en: string };
  description: { ko: string; en: string };
  folder: string;
}

interface StoryCardProps {
  date: { ko: string; en: string };
  title: { ko: string; en: string };
  description: { ko: string; en: string };
  images: string[];
  index: number;
  total: number;
}

const StoryCard: React.FC<StoryCardProps> = ({ date, title, description, images, index }) => {
  const { language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  // 번갈아 기울기
  const initialRotate = index % 2 === 0 ? '-rotate-6' : 'rotate-6';

  return (
    <div
      ref={ref}
      className={`
        relative w-full max-w-xs mx-auto mb-10 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col items-center pb-6 pt-4 px-3
        transition-transform duration-700 ease-out
        ${inView ? 'rotate-0' : initialRotate}
      `}
      style={{ willChange: 'transform' }}
    >
      {/* 폴라로이드 이미지 */}
      <div className="relative w-full aspect-[4/5] rounded-md overflow-hidden bg-gray-100 mb-4 shadow">
        {images.length > 0 ? images.map((image, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ pointerEvents: idx === currentImageIndex ? 'auto' : 'none' }}
          >
            <Image
              src={image}
              alt={`${title[language]} - ${idx + 1}`}
              fill
              className="object-cover"
              priority={idx === 0}
            />
          </div>
        )) : (
          <span className="text-gray-300 flex items-center justify-center w-full h-full">이미지가 없습니다</span>
        )}
      </div>
      {/* 폴라로이드 아래 여백과 텍스트 */}
      <div className="w-full flex flex-col items-center mt-2">
        <div className="text-pink-400 font-medium mb-1 text-sm">{date[language]}</div>
        <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">{title[language]}</h3>
        <p className="text-gray-600 text-center text-sm whitespace-pre-line">{description[language]}</p>
      </div>
    </div>
  );
};

export default function CoupleStorySection() {
  const { language } = useLanguage();

  // 커플 스토리 이미지 API에서 이미지 목록을 받아옴
  const [storyImages, setStoryImages] = useState<{ [key: string]: string[] }>({});
  useEffect(() => {
    fetch('/api/couple-story-images')
      .then(res => res.json())
      .then(data => setStoryImages(data));
  }, []);

  const section = weddingConfig.sections.find(s => s.id === 'couple-story') as Section & { stories: Story[] };
  if (!section || !section.stories) return null;
  const { subtitle, title, stories } = section;

  return (
    <section className="relative flex flex-col bg-white py-16 px-4">
      {/* 상단 타이틀 영역 */}
      <div className="w-full text-center mb-12">
        <div className="uppercase text-gray-400 tracking-widest text-sm mb-1">{subtitle[language]}</div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-700">{title[language]}</h2>
      </div>

      {/* 스토리 카드들 */}
      <div className="flex-1 flex flex-col items-center">
        {stories.map((story: Story, index: number) => (
          <StoryCard
            key={index}
            date={story.date}
            title={story.title}
            description={story.description}
            images={storyImages[story.folder] || []}
            index={index}
            total={stories.length}
          />
        ))}
      </div>
    </section>
  );
} 