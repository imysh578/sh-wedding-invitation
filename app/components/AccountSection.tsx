import React, { useState } from "react";
import { FaRegCopy, FaCheck, FaMoneyCheckAlt } from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageContext";
import { weddingConfig } from "../config";
import SectionTemplate from "./SectionTemplate";
import Modal from "./Modal";
import { account } from "../config/sections/account";

const getAccountList = (side: "groom" | "bride") => {
	if (side === "groom") {
		return [weddingConfig.groomFather, weddingConfig.groomMother, weddingConfig.groom];
	} else {
		return [weddingConfig.brideFather, weddingConfig.brideMother, weddingConfig.bride];
	}
};

export default function AccountSection({ backgroundColor }: { backgroundColor?: string }) {
	const { language } = useLanguage();
	const [openSide, setOpenSide] = useState<"groom" | "bride" | null>(null);
	const [copied, setCopied] = useState<string | null>(null);

	const handleCopy = (account: string) => {
		navigator.clipboard.writeText(account);
		setCopied(account);
		setTimeout(() => setCopied(null), 1500);
	};

	return (
		<SectionTemplate
			id="account"
			title={account.title[language]}
			subtitle={account.subtitle[language]}
			backgroundColor={backgroundColor}
		>
			<div className="flex flex-col gap-4 max-w-xs mx-auto">
				<div className="text-center text-gray-700 text-sm mb-2">
					{account.content?.[language]?.split("\n").map((line, i) =>
						i === 0 ? (
							line
						) : (
							<React.Fragment key={i}>
								<br />
								{line}
							</React.Fragment>
						)
					)}
				</div>
				<button
					className="w-full flex items-center justify-center gap-2 border border-blue-200 rounded-xl py-3 text-blue-700 text-base font-medium shadow-sm hover:bg-blue-50 transition"
					onClick={() => setOpenSide("groom")}
				>
					<FaMoneyCheckAlt className="mr-2" />
					{language === "ko" ? "신랑측 계좌번호 보기" : "Groom Side Accounts"}
				</button>
				<button
					className="w-full flex items-center justify-center gap-2 border border-pink-200 rounded-xl py-3 text-pink-700 text-base font-medium shadow-sm hover:bg-pink-50 transition"
					onClick={() => setOpenSide("bride")}
				>
					<FaMoneyCheckAlt className="mr-2" />
					{language === "ko" ? "신부측 계좌번호 보기" : "Bride Side Accounts"}
				</button>
			</div>

			{/* 계좌번호 모달 */}
			<Modal open={!!openSide} onClose={() => setOpenSide(null)} ariaLabel="계좌번호 모달">
				<button
					className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
					onClick={() => setOpenSide(null)}
					aria-label="닫기"
				>
					<span className="text-2xl">×</span>
				</button>
				<div className="mb-6 text-center">
					<div className={`text-lg font-semibold mb-2 ${openSide === "groom" ? "text-blue-900" : "text-pink-900"}`}>
						{openSide === "groom"
							? language === "ko"
								? "신랑측 계좌번호"
								: "Groom Side Accounts"
							: language === "ko"
							? "신부측 계좌번호"
							: "Bride Side Accounts"}
					</div>
					<hr className="mb-2" />
				</div>
				<div className="space-y-4">
					{openSide &&
						getAccountList(openSide).map((person) => (
							<div key={person.name.ko} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
								<div className="flex-1/2">
									<div className="font-semibold text-gray-800">
										{person.name[language]} ({person.label[language]})
									</div>
									<div className="text-gray-600 text-sm mt-1">{person.accountNumber}</div>
								</div>
								<button
									className="ml-3 text-gray-500 hover:text-blue-600 transition-colors"
									onClick={() => handleCopy(person.accountNumber)}
									aria-label="계좌번호 복사"
								>
									{copied === person.accountNumber ? <FaCheck className="text-green-500" /> : <FaRegCopy />}
								</button>
							</div>
						))}
				</div>
			</Modal>
		</SectionTemplate>
	);
}
