import React, { useState } from "react";
import { FaRegCopy, FaTimes } from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageContext";
import { weddingConfig } from "../config";

const GROOM_SIDE = [
	{ label: "신랑", person: weddingConfig.groom },
	{ label: "신랑 아버지", person: weddingConfig.groomFather },
	{ label: "신랑 어머니", person: weddingConfig.groomMother },
];
const BRIDE_SIDE = [
	{ label: "신부", person: weddingConfig.bride },
	{ label: "신부 아버지", person: weddingConfig.brideFather },
	{ label: "신부 어머니", person: weddingConfig.brideMother },
];

export default function AccountSection() {
	const { language } = useLanguage();
	const [modalOpen, setModalOpen] = useState<"groom" | "bride" | null>(null);
	const [copied, setCopied] = useState<string | null>(null);

	const handleCopy = (account: string) => {
		navigator.clipboard.writeText(account);
		setCopied(account);
		setTimeout(() => setCopied(null), 1500);
	};

	return (
		<section className="bg-white py-12 px-4 relative overflow-hidden">
			<div className="max-w-xl mx-auto text-center">
				<div className="text-pink-400 text-2xl mb-2">♥</div>
				<h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6">마음 전하실 곳</h2>
				<p className="text-gray-600 leading-relaxed mb-8">
					필요한 분들을 위해 안내드리니 양해 부탁드립니다.
					<br />
					참석하지 못하더라도 축복해주시는 그 마음 감사히 간직하겠습니다.
				</p>
				<div className="flex flex-col gap-4 max-w-xs mx-auto">
					<button
						className="w-full py-3 rounded-lg bg-blue-900 text-white font-semibold text-lg hover:bg-blue-800 transition"
						onClick={() => setModalOpen("groom")}
					>
						신랑측 계좌번호 보기
					</button>
					<button
						className="w-full py-3 rounded-lg bg-rose-900 text-white font-semibold text-lg hover:bg-rose-800 transition"
						onClick={() => setModalOpen("bride")}
					>
						신부측 계좌번호 보기
					</button>
				</div>
			</div>
			{/* 계좌번호 모달 */}
			{modalOpen && (
				<div
					className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
					onClick={() => setModalOpen(null)}
				>
					<div
						className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md relative"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
							onClick={() => setModalOpen(null)}
							aria-label="닫기"
						>
							<FaTimes size={22} />
						</button>
						<div className="mb-4 text-center text-lg font-semibold">
							{modalOpen === "groom" ? "신랑측 계좌번호" : "신부측 계좌번호"}
						</div>
						<div className="space-y-4">
							{(modalOpen === "groom" ? GROOM_SIDE : BRIDE_SIDE).map(({ label, person }) => (
								<div key={label} className="text-left">
									<div className="text-gray-700 text-base font-medium mb-1">
										{label} <span className="text-gray-500">({person.name[language]})</span>
									</div>
									<div className="flex items-center gap-2">
										<input
											className="w-full px-3 py-2 rounded bg-gray-100 text-gray-800 font-mono text-base border border-gray-200"
											value={person.accountNumber}
											readOnly
										/>
										<button
											className={`p-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
												copied === person.accountNumber ? "text-green-600" : "text-gray-600"
											}`}
											onClick={() => handleCopy(person.accountNumber)}
											aria-label="계좌번호 복사"
										>
											<FaRegCopy size={18} />
										</button>
									</div>
									{copied === person.accountNumber && (
										<div className="text-green-600 text-xs mt-1">복사되었습니다!</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
