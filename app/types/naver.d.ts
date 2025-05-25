declare namespace naver.maps {
  class Map {
    constructor(element: HTMLElement | string, options: MapOptions);
  }

  class Marker {
    constructor(options: MarkerOptions);
  }

  class InfoWindow {
    constructor(options: InfoWindowOptions);
    open(map: Map, marker: Marker): void;
    close(): void;
    getMap(): Map | null;
  }

  class LatLng {
    constructor(lat: number, lng: number);
  }

  class Point {
    constructor(x: number, y: number);
  }

  interface MapOptions {
    center: LatLng;
    zoom: number;
    zoomControl?: boolean;
    zoomControlOptions?: {
      position: Position;
    };
  }

  interface MarkerOptions {
    position: LatLng;
    map: Map;
  }

  interface InfoWindowOptions {
    content: string;
  }

  enum Position {
    TOP_RIGHT = 1,
    TOP_LEFT = 2,
    BOTTOM_RIGHT = 3,
    BOTTOM_LEFT = 4,
    CENTER = 5,
  }

  namespace Event {
    function addListener(instance: any, eventName: string, listener: () => void): void;
  }
}

interface Window {
  naver: typeof naver;
} 