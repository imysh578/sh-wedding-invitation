import React, { useState } from 'react';
import { FaPhoneAlt, FaTimes } from 'react-icons/fa';
import { FaRegMessage} from "react-icons/fa6";
import { useLanguage } from '../contexts/LanguageContext';
import { weddingConfig } from '../config';

export default function InvitationSection() {
  const { language } = useLanguage();
  const section = weddingConfig.sections.find(s => s.id === 'invitation');
  const [modalOpen, setModalOpen] = useState(false);

  if (!section) return null;

  const { subtitle, title, content, button } = section;
  const groom = weddingConfig.groom;
  const bride = weddingConfig.bride;
  const groomFather = weddingConfig.groomFather;
  const groomMother = weddingConfig.groomMother;
  const brideFather = weddingConfig.brideFather;
  const brideMother = weddingConfig.brideMother;

  return (
    <section className="bg-white py-12 px-4 relative overflow-hidden">
      {/* 배경 효과(노란 점 등은 추후 커스텀 가능) */}
      <div className="max-w-xl mx-auto text-center">
        <div className="uppercase text-gray-400 tracking-widest text-sm mb-2">{subtitle[language]}</div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6">{title[language]}</h2>
        <p className="text-gray-600 whitespace-pre-line leading-relaxed mb-8">{content[language]}</p>
        <hr className="my-8 border-gray-200" />
        {/* 가족 정보 */}
        <div className="text-gray-700 text-lg mb-8 max-w-xs mx-auto">
          <div className="grid grid-cols-4 gap-0 mb-2 text-center">
            <span className="font-bold inline-block mx-1 col-span-1">{groomFather.name[language]}</span>
            <span className="font-bold inline-block mx-1 col-span-1">{groomMother.name[language]}</span>
            <span className="inline-block mx-1 col-span-1">{language === 'ko' ? '의 아들' : 'son of'}</span>
            <span className="font-bold inline-block mx-1 col-span-1">{groom.name[language]}</span>
          </div>
          <div className="grid grid-cols-4 gap-0 text-center">
            <span className="font-bold inline-block mx-1 col-span-1">{brideFather.name[language]}</span>
            <span className="font-bold inline-block mx-1 col-span-1">{brideMother.name[language]}</span>
            <span className="inline-block mx-1 col-span-1">{language === 'ko' ? '의 딸' : 'daughter of'}</span>
            <span className="font-bold inline-block mx-1 col-span-1">{bride.name[language]}</span>
          </div>
        </div>
        <hr className="my-8 border-gray-200" />
        {/* 축하 인사 버튼 */}
        <button
          className="w-full max-w-md mx-auto flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3 text-gray-700 text-base font-medium shadow-sm hover:bg-gray-50 transition"
          onClick={() => setModalOpen(true)}
        >
          <FaPhoneAlt className="mr-2" />
          {button?.[language]}
        </button>
      </div>
      {/* 연락처 모달 */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setModalOpen(false)}
              aria-label="닫기"
            >
              <FaTimes size={22} />
            </button>
            {/* 신랑측 */}
            <div className="mb-6">
              <div className="text-lg font-semibold text-blue-900 mb-2 text-center">{language === 'ko' ? '신랑측' : 'Groom Side'}</div>
              <hr className="mb-2" />
              <ContactRow label={language === 'ko' ? '신랑' : 'Groom'} name={groom.name[language]} phone={groom.phone} />
              <ContactRow label={language === 'ko' ? '혼주' : 'Father'} name={groomFather.name[language]} phone={groomFather.phone} />
              <ContactRow label={language === 'ko' ? '혼주' : 'Mother'} name={groomMother.name[language]} phone={groomMother.phone} />
            </div>
            {/* 신부측 */}
            <div>
              <div className="text-lg font-semibold text-pink-900 mb-2 text-center">{language === 'ko' ? '신부측' : 'Bride Side'}</div>
              <hr className="mb-2" />
              <ContactRow label={language === 'ko' ? '신부' : 'Bride'} name={bride.name[language]} phone={bride.phone} />
              <ContactRow label={language === 'ko' ? '혼주' : 'Father'} name={brideFather.name[language]} phone={brideFather.phone} />
              <ContactRow label={language === 'ko' ? '혼주' : 'Mother'} name={brideMother.name[language]} phone={brideMother.phone} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ContactRow({ label, name, phone }: { label?: string; name?: string; phone?: string }) {
  return (
    <div className="flex items-center justify-between py-1 px-2 text-gray-700">
      <div>
        <span className="mr-2 text-base">{label}</span>
        <span className="font-semibold text-base">{name}</span>
      </div>
      <div className="flex gap-3">
        {phone && (
          <a href={`tel:${phone}`} className="hover:text-blue-600" aria-label="전화걸기">
            <FaPhoneAlt size={18} />
          </a>
        )}
        {phone && (
          <a href={`sms:${phone}`} className="hover:text-green-600" aria-label="문자보내기">
            <FaRegMessage size={18} />
          </a>
        )}
      </div>
    </div>
  );
} 