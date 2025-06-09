import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "../contexts/LanguageContext";
import { GalleryImage } from "../types/gallery";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SectionTemplate from "./SectionTemplate";
import { gallery } from "../config/sections/gallery";

const GRID_VIEW_COUNT = 9; // 3x3 그리드에 표시할 이미지 수

export default function GallerySection({ backgroundColor }: { backgroundColor?: string }) {
	const { language } = useLanguage();
	const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
	const [images, setImages] = useState<GalleryImage[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(0);
	const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null);

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
				setImages(Array.isArray(data) ? data : data.images);
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

	// 캐러셀 페이지별 이미지
	const totalPages = Math.ceil(images.length / GRID_VIEW_COUNT);
	const pageImages = useMemo(() => {
		const start = currentPage * GRID_VIEW_COUNT;
		return images.slice(start, start + GRID_VIEW_COUNT);
	}, [images, currentPage]);

	// ESC 키로 모달 닫기 (모달이 열려있을 때만)
	useEffect(() => {
		if (!selectedImage) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				e.preventDefault();
				e.stopPropagation();
				handleCloseModal();
			}
		};

		window.addEventListener("keydown", handleKeyDown, { capture: true });
		return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
	}, [selectedImage]);

	if (!gallery) return null;
	const { title, subtitle } = gallery;

	const handleImageClick = (image: GalleryImage, e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setSelectedImage(image);
		document.body.style.overflow = "hidden";
	};

	const handleCloseModal = () => {
		setSelectedImage(null);
		document.body.style.overflow = "auto";
	};

	const handlePrevPage = (e?: React.MouseEvent) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		setSlideDirection("right");
		setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
	};

	const handleNextPage = (e?: React.MouseEvent) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		setSlideDirection("left");
		setCurrentPage((prev) => (prev + 1) % totalPages);
	};

	// 그리드 드래그 핸들러 (모달이 닫혀있을 때만 동작)
	const handleGridDragEnd = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: { offset: { x: number; y: number } }
	) => {
		if (selectedImage) return; // 모달이 열려있으면 그리드 드래그 무시

		if (info.offset.x < -100) {
			handleNextPage();
		} else if (info.offset.x > 100) {
			handlePrevPage();
		}
	};

	// 모달 드래그 핸들러 (모달이 열려있을 때만 동작)
	const handleModalDragEnd = (
		event: MouseEvent | TouchEvent | PointerEvent,
		info: { offset: { x: number; y: number } }
	) => {
		if (!selectedImage) return; // 모달이 닫혀있으면 모달 드래그 무시

		if (info.offset.x < -100) {
			setSlideDirection("left");
			// 모달에서 다음 이미지로 이동
			const currentIndex = images.findIndex((img) => img.src === selectedImage.src);
			const nextIndex = (currentIndex + 1) % images.length;
			setSelectedImage(images[nextIndex]);
		} else if (info.offset.x > 100) {
			setSlideDirection("right");
			// 모달에서 이전 이미지로 이동
			const currentIndex = images.findIndex((img) => img.src === selectedImage.src);
			const prevIndex = (currentIndex - 1 + images.length) % images.length;
			setSelectedImage(images[prevIndex]);
		}
	};

	// 모달 내 이미지 네비게이션
	const handleModalPrevImage = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!selectedImage) return;

		const currentIndex = images.findIndex((img) => img.src === selectedImage.src);
		const prevIndex = (currentIndex - 1 + images.length) % images.length;
		setSelectedImage(images[prevIndex]);
	};

	const handleModalNextImage = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!selectedImage) return;

		const currentIndex = images.findIndex((img) => img.src === selectedImage.src);
		const nextIndex = (currentIndex + 1) % images.length;
		setSelectedImage(images[nextIndex]);
	};

	if (isLoading) {
		return (
			<SectionTemplate
				id={gallery.id}
				title={title[language]}
				subtitle={subtitle[language]}
				backgroundColor={backgroundColor}
			>
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
					<div className="h-6 bg-gray-200 rounded w-64 mx-auto mb-12"></div>
					<div className="grid grid-cols-3 gap-4">
						{[...Array(9)].map((_, i) => (
							<div key={i} className="aspect-[4/3] bg-gray-200 rounded-lg"></div>
						))}
					</div>
				</div>
			</SectionTemplate>
		);
	}

	if (error) {
		return (
			<SectionTemplate id={gallery.id} title={title[language]} subtitle={subtitle[language]}>
				<p className="text-red-500">{error}</p>
			</SectionTemplate>
		);
	}

	if (images.length === 0) {
		return null;
	}

	return (
		<SectionTemplate
			id={gallery.id}
			title={title[language]}
			subtitle={subtitle[language]}
			backgroundColor={backgroundColor}
		>
			{/* 3x3 그리드 캐러셀 - 다음/이전 그리드 미리보기 */}
			<div className="relative overflow-hidden">
				{/* 이전 페이지 미리보기 (왼쪽) */}
				{currentPage > 0 && (
					<div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-white/20 to-transparent z-10 pointer-events-none" />
				)}

				{/* 다음 페이지 미리보기 (오른쪽) */}
				{currentPage < totalPages - 1 && (
					<div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-white/20 to-transparent z-10 pointer-events-none" />
				)}

				<AnimatePresence custom={slideDirection} mode="popLayout">
					<motion.div
						key={currentPage}
						custom={slideDirection}
						initial={{ x: slideDirection === "left" ? 300 : slideDirection === "right" ? -300 : 0, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: slideDirection === "left" ? -300 : slideDirection === "right" ? 300 : 0, opacity: 0 }}
						transition={{ duration: 0.45, ease: "easeInOut" }}
						className="grid grid-cols-3 gap-4"
						drag={!selectedImage ? "x" : false} // 모달이 열려있으면 드래그 비활성화
						dragConstraints={{ left: 0, right: 0 }}
						onDragEnd={handleGridDragEnd}
					>
						{pageImages.map((image) => (
							<div
								key={image.src}
								className="relative overflow-hidden rounded-lg cursor-pointer group aspect-square"
								onClick={(e) => handleImageClick(image, e)}
							>
								<Image
									src={image.src}
									alt={image.alt}
									fill
									className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
									sizes="33vw"
									priority={false}
								/>
								<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
							</div>
						))}
					</motion.div>
				</AnimatePresence>

				{/* 페이지 인디케이터 */}
				{totalPages > 1 && (
					<div className="flex justify-center mt-4 gap-2">
						{Array.from({ length: totalPages }, (_, i) => (
							<button
								key={i}
								onClick={() => {
									setSlideDirection(i > currentPage ? "left" : "right");
									setCurrentPage(i);
								}}
								className={`w-2 h-2 rounded-full transition-all duration-300 ${
									i === currentPage ? "bg-gray-600 w-6" : "bg-gray-300 hover:bg-gray-400"
								}`}
								aria-label={`${i + 1}페이지로 이동`}
							/>
						))}
					</div>
				)}
			</div>

			{/* 이미지 모달 */}
			<AnimatePresence>
				{selectedImage && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-999"
						onClick={handleCloseModal}
					>
						{/* 배경 오버레이 */}
						<div className="absolute inset-0 bg-black/95" />

						{/* 모달 컨텐츠 */}
						<div className="relative w-full h-full flex items-center justify-center">
							{/* 닫기 버튼 */}
							<button
								className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									handleCloseModal();
								}}
								aria-label="닫기"
							>
								<FaTimes size={24} />
							</button>

							{/* 이미지 인덱스 표시 */}
							{selectedImage && (
								<div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/60 text-white rounded-full px-4 py-1 text-sm font-semibold">
									{images.findIndex((img) => img.src === selectedImage.src) + 1} / {images.length}
								</div>
							)}

							<AnimatePresence custom={slideDirection} mode="popLayout">
								{selectedImage && (
									<motion.div
										key={selectedImage.src}
										custom={slideDirection}
										initial={{ x: slideDirection === "left" ? 300 : slideDirection === "right" ? -300 : 0, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										exit={{ x: slideDirection === "left" ? -300 : slideDirection === "right" ? 300 : 0, opacity: 0 }}
										transition={{ duration: 0.6, ease: "easeInOut" }}
										className="relative w-full h-full max-w-[95vw] max-h-[95vh]"
										onClick={(e) => e.stopPropagation()}
										drag="x"
										dragConstraints={{ left: 0, right: 0 }}
										onDragEnd={handleModalDragEnd}
									>
										<Image
											src={selectedImage.src}
											alt={selectedImage.alt}
											fill
											className="object-contain"
											sizes="95vw"
											priority
										/>
									</motion.div>
								)}
							</AnimatePresence>

							{/* 이전/다음 버튼 */}
							{images.length > 1 && (
								<>
									<button
										className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
										onClick={handleModalPrevImage}
										aria-label="이전 이미지"
									>
										<FaChevronLeft size={20} />
									</button>
									<button
										className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed"
										onClick={handleModalNextImage}
										aria-label="다음 이미지"
									>
										<FaChevronRight size={20} />
									</button>
								</>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</SectionTemplate>
	);
}
