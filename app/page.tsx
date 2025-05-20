'use client';

import { LanguageProvider } from './contexts/LanguageContext';
import { weddingConfig } from './config';
import { AnimatedSection } from './components/AnimatedSection';
import HeroSection from './components/HeroSection';
import { useLanguage } from './contexts/LanguageContext';
import { FaGlobe } from 'react-icons/fa';
import InvitationSection from './components/InvitationSection';
import CalendarSection from './components/CalendarSection';
import CoupleStorySection from './components/CoupleStorySection';
function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 flex items-center gap-1 bg-black/60 rounded-md px-2 py-1 text-sm text-gray-300 hover:bg-black/80 transition-colors focus:outline-none"
      aria-label="언어 전환"
      style={{ boxShadow: 'none' }}
    >
      <FaGlobe className="text-gray-400 text-base" />
      <span className="font-semibold text-gray-200 uppercase">{language}</span>
    </button>
  );
}

function WeddingContent() {
  const { language } = useLanguage();

  return (
    <main className="min-h-screen">
      {weddingConfig.theme.showLanguageToggle && <LanguageToggle />}
      
      {/* Hero 섹션 */}
      <HeroSection />
      
      {/* Invitation 섹션 */}
      <InvitationSection />

      {/* Calendar 섹션 */}
      <CalendarSection />

      {/* Couple Story 섹션 */}
      <CoupleStorySection />
      
      {/* 나머지 섹션들 */}
      {weddingConfig.sections
        .filter((section) => section.id !== 'hero' && section.id !== 'invitation' && section.id !== 'calendar' && section.id !== 'couple-story')
        .map((section) => (
          <AnimatedSection
            key={section.id}
            animation={section.animation}
            className={`min-h-screen p-8 ${
              section.id === 'gallery' ? 'bg-white' : 'bg-gray-50'
            }`}
          >
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">
                {section.title[language]}
              </h2>
              <p className="text-lg text-center mb-8">
                {section.content?.[language]}
              </p>
              
              {section.id === 'invitation' && (
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-4">
                      {weddingConfig.groom.name[language]}
                    </h3>
                    <p>{weddingConfig.groomFather.name[language]}</p>
                    <p>{weddingConfig.groomMother.name[language]}</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-4">
                      {weddingConfig.bride.name[language]}
                    </h3>
                    <p>{weddingConfig.brideFather.name[language]}</p>
                    <p>{weddingConfig.brideMother.name[language]}</p>
                  </div>
                </div>
              )}
              
              {section.id === 'gallery' && (
                <div className="grid grid-cols-2 gap-4">
                  {/* 갤러리 이미지들은 여기에 동적으로 로드됩니다 */}
                </div>
              )}
            </div>
          </AnimatedSection>
        ))}
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
