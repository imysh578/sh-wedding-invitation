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
			<div className="text-gray-700 text-base text-center whitespace-pre-line">{notice.content?.[language]}</div>
		</SectionTemplate>
	);
}
