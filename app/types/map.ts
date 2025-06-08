export interface Coordinates {
	lat: number;
	lng: number;
}

export type NaverMap = naver.maps.Map;

export interface MapOptions {
	center: naver.maps.LatLng;
	zoom: number;
	scaleControl?: boolean;
	mapDataControl?: boolean;
	logoControlOptions?: {
		position: naver.maps.Position;
	};
	zoomControl?: boolean;
	zoomControlOptions?: {
		position: naver.maps.Position;
	};
}
