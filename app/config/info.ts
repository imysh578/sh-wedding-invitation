import { Meta, Person, Venue } from "../types";

export const meta: Meta = {
	title: "윤석훈 ❤️ 김세희 결혼합니다.",
	description: "2025년 9월 13일 토요일 오후 5시 30분, 라루체 웨딩 그레이스홀",
	ogImage: "/images/hero/main.jpg",
};

export const groom: Person = {
	label: {
		ko: "신랑",
		en: "Groom",
	},
	name: { ko: "윤석훈", en: "Seokhun Yoon" },
	phone: "010-7292-1080",
	accountNumber: "신한은행 110-123-456789",
};

export const groomFather: Person = {
	label: {
		ko: "신랑 아버지",
		en: "Groom's Father",
	},
	name: { ko: "윤기채", en: "Kichae Yoon" },
	phone: "010-3333-4444",
	accountNumber: "농협 123-4567-8901-23",
};

export const groomMother: Person = {
	label: {
		ko: "신랑 어머니",
		en: "Groom's Mother",
	},
	name: { ko: "전태자", en: "Taeja Jeon" },
	phone: "010-4444-5555",
	accountNumber: "기업은행 123-456789",
};

export const bride: Person = {
	label: {
		ko: "신부",
		en: "Bride",
	},
	name: { ko: "김세희", en: "Sehee Kim" },
	phone: "010-2532-9383",
	accountNumber: "하나은행 123-456789-01234",
};

export const brideFather: Person = {
	label: {
		ko: "신부 아버지",
		en: "Bride's Father",
	},
	name: { ko: "김달수", en: "Dalsu Kim" },
	phone: "010-1111-2222",
	accountNumber: "국민은행 123-456-789012",
};

export const brideMother: Person = {
	label: {
		ko: "신부 어머니",
		en: "Bride's Mother",
	},
	name: { ko: "최현주", en: "Hyunjoo Choi" },
	phone: "010-2222-3333",
	accountNumber: "우리은행 1234-56-789012",
};

export const venue: Venue = {
	name: "라루체 웨딩",
	hall: "5층 그레이스홀",
	address: "서울 중구 퇴계로18길 46 라루체웨딩",
	detailInfo: "4호선 명동역 3번 출구에서 도보 2분 (208m)",
	parking: "웨딩홀 연계 주차장 이용 가능",
	naverMapUrl: "https://naver.me/IgJGrKmE",
	kakaoMapUrl: "https://kko.kakao.com/3ugCYdr-0P",
};
