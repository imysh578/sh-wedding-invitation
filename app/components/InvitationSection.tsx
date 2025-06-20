import React, { useState } from "react";
import { FaPhoneAlt, FaTimes } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { useLanguage } from "../contexts/LanguageContext";
import { weddingConfig } from "../config";
import { invitation } from "../config/sections/invitation";
import SectionTemplate from "./SectionTemplate";

export default function InvitationSection({ backgroundColor }: { backgroundColor?: string }) {
	const { language } = useLanguage();
	const [modalOpen, setModalOpen] = useState(false);

	if (!invitation) return null;

	const { subtitle, title, content, button } = invitation;
	const groom = weddingConfig.groom;
	const bride = weddingConfig.bride;
	const groomFather = weddingConfig.groomFather;
	const groomMother = weddingConfig.groomMother;
	const brideFather = weddingConfig.brideFather;
	const brideMother = weddingConfig.brideMother;

	return (
		<SectionTemplate
			id={invitation.id}
			title={title[language]}
			subtitle={subtitle[language]}
			backgroundColor={backgroundColor}
		>
			<p className="text-gray-600 whitespace-pre-line leading-relaxed mb-8 text-md">{content?.[language]}</p>
			{/* 가족 정보 */}
			<div className="text-gray-700 text-lg mb-8 max-w-xs mx-auto">
				<hr className="my-8 border-gray-200" />
				<div className="grid grid-cols-13 gap-0 mb-2 text-center">
					<span className="font-bold inline-block mx-1 col-span-3">{groomFather.name[language]}</span>
					<span className="font-bold inline-block mx-1 col-span-1">⋅</span>
					<span className="font-bold inline-block mx-1 col-span-3">{groomMother.name[language]}</span>
					<span className="inline-block mx-1 col-span-3">{language === "ko" ? "의 아들" : ""}</span>
					<span className="font-bold inline-block mx-1 col-span-3">{groom.name[language]}</span>
				</div>
				<div className="grid grid-cols-13 gap-0 text-center">
					<span className="font-bold inline-block mx-1 col-span-3">{brideFather.name[language]}</span>
					<span className="font-bold inline-block mx-1 col-span-1">⋅</span>
					<span className="font-bold inline-block mx-1 col-span-3">{brideMother.name[language]}</span>
					<span className="inline-block mx-1 col-span-3">{language === "ko" ? "의 딸" : ""}</span>
					<span className="font-bold inline-block mx-1 col-span-3">{bride.name[language]}</span>
				</div>
				<hr className="my-8 border-gray-200" />
			</div>
			{/* 축하 인사 버튼 */}
			<button
				className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 border border-gray-300 rounded-xl py-3 text-gray-700 text-base font-medium shadow-sm hover:bg-gray-50 transition"
				onClick={() => setModalOpen(true)}
			>
				<FaPhoneAlt className="mr-2" />
				{button?.[language]}
			</button>

			{/* 연락처 모달 */}
			{modalOpen && (
				<div
					className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
					onClick={() => setModalOpen(false)}
				>
					<div
						className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md relative"
						onClick={(e) => e.stopPropagation()}
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
							<div className="text-lg font-semibold text-blue-900 mb-2 text-center">
								{language === "ko" ? "신랑측" : "Groom Side"}
							</div>
							<hr className="mb-2" />
							<ContactRow
								label={language === "ko" ? "신랑" : "Groom"}
								name={groom.name[language]}
								phone={groom.phone}
							/>
							<ContactRow
								label={language === "ko" ? "혼주" : "Father"}
								name={groomFather.name[language]}
								phone={groomFather.phone}
							/>
							<ContactRow
								label={language === "ko" ? "혼주" : "Mother"}
								name={groomMother.name[language]}
								phone={groomMother.phone}
							/>
						</div>
						{/* 신부측 */}
						<div>
							<div className="text-lg font-semibold text-pink-900 mb-2 text-center">
								{language === "ko" ? "신부측" : "Bride Side"}
							</div>
							<hr className="mb-2" />
							<ContactRow
								label={language === "ko" ? "신부" : "Bride"}
								name={bride.name[language]}
								phone={bride.phone}
							/>
							<ContactRow
								label={language === "ko" ? "혼주" : "Father"}
								name={brideFather.name[language]}
								phone={brideFather.phone}
							/>
							<ContactRow
								label={language === "ko" ? "혼주" : "Mother"}
								name={brideMother.name[language]}
								phone={brideMother.phone}
							/>
						</div>
					</div>
				</div>
			)}
		</SectionTemplate>
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
