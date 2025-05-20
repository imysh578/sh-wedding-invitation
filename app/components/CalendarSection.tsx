import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { weddingConfig } from '../config';

function getCalendarMatrix(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= lastDate; d++) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

const WEEKDAYS = {
  ko: ['일', '월', '화', '수', '목', '금', '토'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

export default function CalendarSection() {
  const { language } = useLanguage();
  const section = weddingConfig.sections.find(s => s.id === 'calendar');
  if (!section || !section.calendar) return null;
  const { subtitle, title, calendar, keyColor } = section;
  const { year, month, day, time } = calendar;
  const weeks = getCalendarMatrix(year, month);

  // 날짜 정보 생성
  const dateInfo = new Date(year, month - 1, day);
  const weekday = WEEKDAYS[language][dateInfo.getDay()];
  const dateText = language === 'ko' 
    ? `${year}년 ${month}월 ${day}일 ${weekday} ${time[language]}`
    : `${weekday}, ${month}/${day}/${year}, ${time[language]}`;

  return (
    <section className="relative flex flex-col bg-gray-50 py-12 px-4 ">
      {/* 상단 타이틀 영역 */}
      <div className="w-full text-center mb-6">
        <div className="uppercase text-gray-400 tracking-widest text-sm mb-1">{subtitle[language]}</div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-700">{title[language]}</h2>
      </div>

      {/* 중앙 컨텐츠 영역 */}
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        {/* 달력 */}
        <div className="w-full max-w-md bg-white rounded-xl p-4 shadow-sm">
          <div className="text-center text-gray-700 text-lg font-medium mb-6">
            {dateText}
          </div>
          <div className="grid grid-cols-7 text-center text-gray-400 font-semibold mb-2 text-base">
            {WEEKDAYS[language].map((w, i) => (
              <div key={i} className={i === 0 ? `text-[${keyColor}]` : ''}>{w}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 text-center text-gray-700 text-lg gap-y-2">
            {weeks.map((week, wi) =>
              week.map((d, di) => {
                const isWeddingDay = d === day;
                return (
                  <div key={wi + '-' + di} className="relative flex flex-col items-center justify-center min-h-[40px]">
                    {d && (
                      <>
                        <span
                          className={
                            `inline-flex w-9 h-9 items-center justify-center rounded-full mb-1 transition-all ` +
                            (isWeddingDay
                              ? `bg-[${keyColor}] text-white font-bold`
                              : di === 0
                              ? `text-[${keyColor}] bg-transparent font-normal`
                              : 'bg-transparent font-normal')
                          }
                        >
                          {d}
                        </span>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 