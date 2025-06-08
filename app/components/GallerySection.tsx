import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "../contexts/LanguageContext";
import { weddingConfig } from "../config";
import { GalleryImage } from "../types/gallery";
import { FaTimes, FaExpand, FaCompress, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const GRID_VIEW_COUNT = 9; // 3x3 그리드에 표시할 이미지 수

export default function GallerySection() {
	const { language } = useLanguage();
	const section = weddingConfig.sections.find((s) => s.id === "gallery");
	const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
	const [images, setImages] = useState<GalleryImage[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showAll, setShowAll] = useState(false);

	// 이미지 프리로딩을 위한 상태
	const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

	// 이미지 프리로딩 함수
	const preloadImage = (src: string) => {
		if (typeof window === "undefined" || preloadedImages.has(src)) return;
		const img = new window.Image();
		img.src = src;
		img.onload = () => {
			setPreloadedImages((prev) => new Set([...prev, src]));
		};
	};

	// 이미지 데이터 가져오기
	useEffect(() => {
		const fetchImages = async () => {
			try {
				const response = await fetch("/api/gallery-images");
				if (!response.ok) throw new Error("이미지를 불러오는데 실패했습니다");
				const data = await response.json();
				// 응답이 배열이 아니면 data.images로 할당
				setImages(Array.isArray(data) ? data : data.images);
				// 모든 이미지 프리로딩 시작
				(Array.isArray(data) ? data : data.images).forEach((image: GalleryImage) => {
					preloadImage(image.src);
				});
			} catch (err) {
				setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다");
			} finally {
				setIsLoading(false);
			}
		};

		fetchImages();
	}, []);

	// showAll이 변경될 때 추가 이미지 프리로딩
	useEffect(() => {
		if (showAll) {
			images.slice(GRID_VIEW_COUNT).forEach((image) => {
				preloadImage(image.src);
			});
		}
	}, [showAll, images]);

	// displayImages를 useMemo로 최적화
	const displayImages = useMemo(() => {
		return showAll ? images : images.slice(0, GRID_VIEW_COUNT);
	}, [showAll, images]);

	if (!section) return null;
	const { title, subtitle } = section;

	const handleImageClick = (image: GalleryImage) => {
		setSelectedImage(image);
		document.body.style.overflow = "hidden";
	};

	const handleCloseModal = () => {
		setSelectedImage(null);
		document.body.style.overflow = "auto";
	};

	const toggleView = () => {
		setShowAll(!showAll);
		// 스크롤 동작 제거
	};

	if (isLoading) {
		return (
			<section className="relative py-20 bg-gray-50">
				<div className="container max-w-6xl mx-auto px-4 text-center">
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
						<div className="h-6 bg-gray-200 rounded w-64 mx-auto mb-12"></div>
						<div className="grid grid-cols-3 gap-4">
							{[...Array(9)].map((_, i) => (
								<div key={i} className="aspect-[4/3] bg-gray-200 rounded-lg"></div>
							))}
						</div>
					</div>
				</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className="relative py-20 bg-gray-50">
				<div className="container max-w-6xl mx-auto px-4 text-center">
					<p className="text-red-500">{error}</p>
				</div>
			</section>
		);
	}

	if (images.length === 0) {
		return null;
	}

	return (
		<section className="relative py-20 bg-gray-50">
			<div className="container max-w-6xl mx-auto px-4">
				{/* 섹션 타이틀 */}
				<div className="text-center mb-12">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
					>
						{title[language]}
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="text-xl text-gray-600"
					>
						{subtitle[language]}
					</motion.p>
				</div>

				{/* 갤러리 그리드 */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="grid grid-cols-3 gap-4" // 항상 3열 그리드 유지
				>
					{displayImages.map((image, index) => (
						<motion.div
							key={image.src}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{
								duration: 0.5,
								delay: index === 0 ? 0 : 0.1 + index * 0.05, // 첫 번째 이미지는 딜레이 없음, 나머지는 순차적 딜레이
							}}
							className={`relative overflow-hidden rounded-lg cursor-pointer group ${
								!showAll && index >= GRID_VIEW_COUNT ? "hidden" : ""
							} aspect-square`} // 항상 정사각형 비율 유지
							onClick={() => handleImageClick(image)}
						>
							<Image
								src={image.src}
								alt={image.alt}
								fill
								className="object-cover object-center transition-transform duration-300 group-hover:scale-110" // 항상 중앙 기준으로 자르기
								sizes="33vw" // 항상 1/3 너비 유지
								priority={index < 3} // 처음 3개 이미지는 우선 로딩
							/>
							<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
						</motion.div>
					))}
				</motion.div>

				{/* 전체보기/접기 버튼 */}
				{images.length > GRID_VIEW_COUNT && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.6 }}
						className="mt-8 text-center"
					>
						<button
							onClick={toggleView}
							className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-colors border border-gray-200"
						>
							{showAll ? (
								<>
									<FaCompress className="text-gray-500" />
									<span>{language === "ko" ? "접기" : "Collapse"}</span>
								</>
							) : (
								<>
									<FaExpand className="text-gray-500" />
									<span>{language === "ko" ? "모두 보기" : "View All"}</span>
								</>
							)}
						</button>
					</motion.div>
				)}

				{/* 이미지 모달 */}
				<AnimatePresence>
					{selectedImage && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-50"
							onClick={handleCloseModal}
						>
							{/* 배경 오버레이 */}
							<div className="absolute inset-0 bg-black/95" />

							{/* 모달 컨텐츠 */}
							<div className="relative w-full h-full flex items-center justify-center">
								{/* 닫기 버튼 */}
								<button
									className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
									onClick={handleCloseModal}
									aria-label="닫기"
								>
									<FaTimes size={24} />
								</button>

								{/* 이미지 */}
								<div className="relative w-full h-full max-w-[95vw] max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
									<Image
										src={selectedImage.src}
										alt={selectedImage.alt}
										fill
										className="object-contain"
										sizes="95vw"
										priority
									/>
								</div>

								{/* 이전/다음 버튼 */}
								{images.length > 1 && (
									<>
										<button
											className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed"
											onClick={(e) => {
												e.stopPropagation();
												const currentIndex = images.findIndex((img) => img.src === selectedImage.src);
												const prevIndex = (currentIndex - 1 + images.length) % images.length;
												setSelectedImage(images[prevIndex]);
											}}
											aria-label="이전 이미지"
										>
											<FaChevronLeft size={24} />
										</button>
										<button
											className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed"
											onClick={(e) => {
												e.stopPropagation();
												const currentIndex = images.findIndex((img) => img.src === selectedImage.src);
												const nextIndex = (currentIndex + 1) % images.length;
												setSelectedImage(images[nextIndex]);
											}}
											aria-label="다음 이미지"
										>
											<FaChevronRight size={24} />
										</button>
									</>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</section>
	);
}
