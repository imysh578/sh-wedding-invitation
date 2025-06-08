import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
	try {
		const galleryDir = path.join(process.cwd(), "public/images/gallery");

		// 디렉토리가 존재하는지 확인
		if (!fs.existsSync(galleryDir)) {
			return NextResponse.json({ images: [] });
		}

		// 이미지 파일 목록 읽기
		const files = fs
			.readdirSync(galleryDir)
			.filter((file) => {
				const ext = path.extname(file).toLowerCase();
				return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
			})
			.sort(); // 파일명 오름차순 정렬

		// 이미지 정보 생성
		const images = files.map((file) => ({
			src: `/images/gallery/${file}`,
			alt: path.parse(file).name, // 파일명에서 확장자 제외
			width: 800, // 기본값 설정
			height: 600, // 기본값 설정
		}));

		return NextResponse.json({ images });
	} catch (error) {
		console.error("갤러리 이미지 로드 중 오류:", error);
		return NextResponse.json({ error: "이미지를 불러오는데 실패했습니다." }, { status: 500 });
	}
}
