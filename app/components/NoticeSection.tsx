import React from "react";
import Snowfall from "react-snowfall";
import { useLanguage } from "../contexts/LanguageContext";
import SectionTemplate from "./SectionTemplate";
import { notice } from "../config/sections/notice";

export default function NoticeSection({ backgroundColor }: { backgroundColor?: string }) {
	const { language } = useLanguage();
	return (
		<SectionTemplate
			id={notice.id}
			title={notice.title[language]}
			subtitle={notice.subtitle[language]}
			backgroundColor={backgroundColor}
		>
			{/* 하트 흩날림 효과 */}
			<div className="absolute inset-0 pointer-events-none z-0">
				<Snowfall color="pink" snowflakeCount={20} radius={[1, 5]} speed={[0.2, 1]} style={{ opacity: 0.35 }} />
			</div>
			{/* 메인 컨텐츠 */}
			<div className="relative z-10 max-w-2xl mx-auto px-6">
				<div className="text-center">
					<div className="text-2xl mb-6">🌸</div>
					<div className="text-gray-700 text-lg md:text-xl leading-relaxed">
						{notice.content?.[language]?.split("\n\n").map((paragraph, idx) => (
							<p key={idx} className="mb-6 last:mb-0">
								{paragraph.split("\n").map((line, i, arr) =>
									i < arr.length - 1 ? (
										<React.Fragment key={i}>
											{line}
											<br />
										</React.Fragment>
									) : (
										line
									)
								)}
							</p>
						))}
					</div>
				</div>
			</div>
		</SectionTemplate>
	);
}
