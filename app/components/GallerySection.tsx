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
	const [modalSlideDirection, setModalSlideDirection] = useState<"left" | "right" | null>(null);
	const [modalAnimationType, setModalAnimationType] = useState<"slide" | "fade" | null>(null);

	// 터치 이벤트 상태 추가
	const [touchStart, setTouchStart] = useState<number | null>(null);
	const [touchEnd, setTouchEnd] = useState<number | null>(null);

	// 그리드 터치 상태 추가
	const [gridTouchStart, setGridTouchStart] = useState<{ x: number; y: number } | null>(null);
	const [gridTouchEnd, setGridTouchEnd] = useState<{ x: number; y: number } | null>(null);

	// 썸네일 경로 변환 함수
	const getThumbnailPath = (originalPath: string) => {
		return originalPath.replace("/images/gallery/", "/images/gallery/thumbnails/");
	};

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

	// 캐러셀 페이지별 이미지
	const totalPages = Math.ceil(images.length / GRID_VIEW_COUNT);
	const pageImages = useMemo(() => {
		const start = currentPage * GRID_VIEW_COUNT;
		return images.slice(start, start + GRID_VIEW_COUNT);
	}, [images, currentPage]);

	// 점진적 프리로딩 함수 - 현재 페이지 + 다음/이전 페이지만 프리로딩
	const preloadCurrentAndAdjacentPages = (currentPageIndex: number) => {
		const pagesToPreload = [currentPageIndex];

		// 이전 페이지가 있으면 추가
		if (currentPageIndex > 0) {
			pagesToPreload.push(currentPageIndex - 1);
		}

		// 다음 페이지가 있으면 추가
		if (currentPageIndex < totalPages - 1) {
			pagesToPreload.push(currentPageIndex + 1);
		}

		// 해당 페이지들의 이미지들만 프리로딩
		pagesToPreload.forEach((pageIndex) => {
			const start = pageIndex * GRID_VIEW_COUNT;
			const pageImages = images.slice(start, start + GRID_VIEW_COUNT);
			pageImages.forEach((image) => {
				// 그리드용 썸네일 프리로딩
				preloadImage(getThumbnailPath(image.src));
				// 모달용 원본 이미지도 프리로딩
				preloadImage(image.src);
			});
		});
	};

	// 이미지 데이터 가져오기
	useEffect(() => {
		const fetchImages = async () => {
			try {
				const response = await fetch("/api/gallery-images");
				if (!response.ok) throw new Error("이미지를 불러오는데 실패했습니다");
				const data = await response.json();
				setImages(Array.isArray(data) ? data : data.images);
				// 초기 로딩 시에는 첫 번째 페이지만 프리로딩
				const initialImages = Array.isArray(data) ? data : data.images;
				const firstPageImages = initialImages.slice(0, GRID_VIEW_COUNT);
				firstPageImages.forEach((image: GalleryImage) => {
					// 그리드용 썸네일 프리로딩
					preloadImage(getThumbnailPath(image.src));
					// 모달용 원본 이미지도 프리로딩
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

	// 페이지 변경 시 점진적 프리로딩
	useEffect(() => {
		if (images.length > 0 && totalPages > 0) {
			preloadCurrentAndAdjacentPages(currentPage);
		}
	}, [currentPage, images, totalPages]);

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

	// 터치 이벤트 핸들러
	const handleTouchStart = (e: React.TouchEvent) => {
		if (e.touches.length === 1) {
			setTouchStart(e.targetTouches[0].clientX);
		} else {
			setTouchStart(null); // 멀티터치면 스와이프 무시
		}
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (e.touches.length === 1) {
			setTouchEnd(e.targetTouches[0].clientX);
		} else {
			setTouchEnd(null);
		}
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		// 한 손가락 터치에서만 스와이프 동작
		if (touchStart !== null && touchEnd !== null && e.changedTouches.length === 1) {
			const distance = touchStart - touchEnd;
			const isLeftSwipe = distance > 50;
			const isRightSwipe = distance < -50;

			if (isLeftSwipe) handleModalNextImage();
			if (isRightSwipe) handleModalPrevImage();
		}
		setTouchStart(null);
		setTouchEnd(null);
	};

	if (!gallery) return null;
	const { title, subtitle } = gallery;

	const handleImageClick = (image: GalleryImage, e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setSelectedImage(image);
		setModalSlideDirection(null);
		setModalAnimationType(null);
		document.body.style.overflow = "hidden";
	};

	const handleCloseModal = () => {
		setSelectedImage(null);
		setModalSlideDirection(null);
		setModalAnimationType(null);
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

	// 모달 내 이미지 네비게이션
	const handleModalPrevImage = (e?: React.MouseEvent) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		if (!selectedImage) return;

		setModalSlideDirection("right");
		setModalAnimationType("fade");
		const currentIndex = images.findIndex((img) => img.src === selectedImage.src);
		const prevIndex = (currentIndex - 1 + images.length) % images.length;
		setSelectedImage(images[prevIndex]);
	};

	const handleModalNextImage = (e?: React.MouseEvent) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		if (!selectedImage) return;

		setModalSlideDirection("left");
		setModalAnimationType("fade");
		const currentIndex = images.findIndex((img) => img.src === selectedImage.src);
		const nextIndex = (currentIndex + 1) % images.length;
		setSelectedImage(images[nextIndex]);
	};

	// 그리드 터치 상태 추가
	const handleGridTouchStart = (e: React.TouchEvent) => {
		if (e.touches.length === 1) {
			setGridTouchStart({
				x: e.targetTouches[0].clientX,
				y: e.targetTouches[0].clientY,
			});
		}
	};

	const handleGridTouchMove = (e: React.TouchEvent) => {
		if (e.touches.length === 1) {
			setGridTouchEnd({
				x: e.targetTouches[0].clientX,
				y: e.targetTouches[0].clientY,
			});
		}
	};

	const handleGridTouchEnd = () => {
		if (gridTouchStart && gridTouchEnd) {
			const dx = gridTouchEnd.x - gridTouchStart.x;
			const dy = gridTouchEnd.y - gridTouchStart.y;
			if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
				// 수평 스와이프만 페이지 넘김
				if (dx < 0) handleNextPage();
				else handlePrevPage();
			}
		}
		setGridTouchStart(null);
		setGridTouchEnd(null);
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
						drag={false} // 모바일에서 drag 비활성화
						onTouchStart={handleGridTouchStart}
						onTouchMove={handleGridTouchMove}
						onTouchEnd={handleGridTouchEnd}
					>
						{pageImages.map((image) => (
							<div
								key={image.src}
								className="relative overflow-hidden rounded-lg cursor-pointer group aspect-square"
								onClick={(e) => handleImageClick(image, e)}
							>
								<Image
									src={getThumbnailPath(image.src)}
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
					<>
						{/* 배경 오버레이 - 클릭 시 모달 닫기 */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/95 z-40"
							onClick={handleCloseModal}
						/>

						{/* 모달 컨텐츠 */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-50 pointer-events-none"
						>
							{/* 닫기 버튼 */}
							<button
								className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2 pointer-events-auto"
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
								<div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-black/60 text-white rounded-full px-4 py-1 text-sm font-semibold pointer-events-auto">
									{images.findIndex((img) => img.src === selectedImage.src) + 1} / {images.length}
								</div>
							)}

							{/* 이미지 컨테이너 */}
							<div className="relative w-full h-full flex items-center justify-center pointer-events-none">
								<AnimatePresence custom={modalSlideDirection} mode="popLayout">
									{selectedImage && (
										<motion.div
											key={selectedImage.src}
											custom={modalSlideDirection}
											initial={
												modalAnimationType === "slide"
													? {
															x: modalSlideDirection === "left" ? 300 : modalSlideDirection === "right" ? -300 : 0,
															opacity: 1,
													  }
													: { opacity: 0 }
											}
											animate={{ x: 0, opacity: 1 }}
											exit={
												modalAnimationType === "slide"
													? {
															x: modalSlideDirection === "left" ? -300 : modalSlideDirection === "right" ? 300 : 0,
															opacity: 1,
													  }
													: { opacity: 0 }
											}
											transition={{ duration: 0.6, ease: "easeInOut" }}
											className="relative pointer-events-auto"
											style={{ maxWidth: "95vw", maxHeight: "95vh", touchAction: "auto" }}
											onTouchStart={handleTouchStart}
											onTouchMove={handleTouchMove}
											onTouchEnd={handleTouchEnd}
										>
											<Image
												src={selectedImage.src}
												alt={selectedImage.alt}
												width={0}
												height={0}
												className="object-contain w-auto h-auto max-w-[95vw] max-h-[95vh]"
												sizes="95vw"
												priority
												style={{ width: "auto", height: "auto" }}
											/>
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* 이전/다음 버튼 */}
							{images.length > 1 && (
								<>
									<button
										className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
										onClick={handleModalPrevImage}
										aria-label="이전 이미지"
									>
										<FaChevronLeft size={20} />
									</button>
									<button
										className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
										onClick={handleModalNextImage}
										aria-label="다음 이미지"
									>
										<FaChevronRight size={20} />
									</button>
								</>
							)}
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</SectionTemplate>
	);
}
