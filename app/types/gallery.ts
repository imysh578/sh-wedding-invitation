export interface GalleryImage {
	src: string;
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
