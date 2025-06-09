import React from "react";
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
