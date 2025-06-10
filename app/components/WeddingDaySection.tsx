import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import SectionTemplate from "./SectionTemplate";
import { weddingDay } from "../config/sections/weddingDay";

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
	ko: ["일", "월", "화", "수", "목", "금", "토"],
	en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

export default function WeddingDaySection({ backgroundColor }: { backgroundColor?: string }) {
	const { language } = useLanguage();
	if (!weddingDay || !weddingDay.calendar) return null;
	const { subtitle, title, calendar } = weddingDay;
	const { year, month, day, time } = calendar;
	const weeks = getCalendarMatrix(year, month);

	// 날짜 정보 생성
	const dateInfo = new Date(year, month - 1, day);
	const weekday = WEEKDAYS[language][dateInfo.getDay()];
	const dateText =
		language === "ko"
			? `${year}년 ${month}월 ${day}일 (${weekday}) ${time[language]}`
			: `${month}/${day}/${year} (${weekday}) ${time[language]}`;

	return (
		<SectionTemplate
			id={weddingDay.id}
			title={title[language]}
			subtitle={subtitle[language]}
			backgroundColor={backgroundColor}
		>
			<div className="flex flex-col justify-center items-center px-4">
				<div className="text-center text-black text-md font-medium mb-6">{dateText}</div>
				{/* 달력 */}
				<div className="relative w-full max-w-md bg-white rounded-xl p-4 shadow-sm">
					{/* <div className="absolute top-0 left-0 w-full flex justify-between px-6 pt-2 z-10">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								className="w-3 h-3 bg-white border-2 border-gray-300 rounded-full shadow-xs"
								style={{
									marginLeft: i === 0 ? 0 : "auto",
									marginRight: i === 4 ? 0 : "auto",
								}}
							/>
						))}
					</div> */}

					<div className="text-center text-black text-xl mt-3 mb-5 font-bold">{month}월</div>
					<div className="grid grid-cols-7 text-center text-gray-600 font-semibold mb-2.5 text-base border-b border-gray-300 pb-2.5">
						{WEEKDAYS[language].map((w, i) => (
							<div key={i} className={i === 0 ? `text-[#F5898A]` : ""}>
								{w}
							</div>
						))}
					</div>
					<div className="grid grid-cols-7 text-center text-gray-700 text-lg gap-y-2.5">
						{weeks.map((week, wi) =>
							week.map((d, di) => {
								const isWeddingDay = d === day;
								return (
									<div key={wi + "-" + di} className="relative flex flex-col items-center justify-center min-h-[40px]">
										{d && (
											<>
												<span
													className={
														`inline-flex w-9 h-9 items-center justify-center rounded-full transition-all ` +
														(isWeddingDay
															? `bg-[#F5898A] text-white font-bold`
															: di === 0
															? `text-[#F5898A] bg-transparent font-normal`
															: "bg-transparent font-normal")
													}
												>
													{d}
												</span>
												{isWeddingDay && (
													<span className="absolute left-1/2 -translate-x-1/2 top-[calc(100%)] text-xs text-[#F5898A] whitespace-nowrap font-bold">
														{time[language]}
													</span>
												)}
											</>
										)}
									</div>
								);
							})
						)}
					</div>
				</div>
			</div>
		</SectionTemplate>
	);
}
