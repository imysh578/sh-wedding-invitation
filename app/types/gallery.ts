export interface GalleryImage {
	src: string;
	alt: string;
	width: number;
	height: number;
	category?: "couple" | "groom" | "bride";
}

export interface GallerySection {
	id: "gallery";
	title: {
		ko: string;
		en: string;
	};
	subtitle: {
		ko: string;
		en: string;
	};
	images: GalleryImage[];
	animation?: "fade" | "slide" | "zoom";
}
