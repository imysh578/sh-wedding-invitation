export type Language = 'ko' | 'en';

export interface Person {
  name: {
    ko: string;
    en: string;
  };
  phone: string;
  accountNumber: string;
}

export interface Venue {
  name: string;
  hall: string;
  address: string;
  detailInfo: string;
  parking: string;
  naverMapUrl: string;
  kakaoMapUrl: string;
}

export interface Story {
  date: {
    ko: string;
    en: string;
  };
  title: {
    ko: string;
    en: string;
  };
  description: {
    ko: string;
    en: string;
  };
  folder: string;
}

export interface Meta {
  title: string;
  description: string;
  ogImage: string;
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  showLanguageToggle?: boolean;
}

export interface HeroSection {
  id: 'hero';
  announcement: string;
  content: {
    ko: string;
    en: string;
  };
  image: string;
  animation?: 'fade' | 'slide' | 'zoom';
}

export interface Section {
  id: string;
  subtitle: {
    ko: string;
    en: string;
  };
  title: {
    ko: string;
    en: string;
  };
  content?: {
    ko: string;
    en: string;
  };
  image?: string;
  images?: string[];
  animation?: 'fade' | 'slide' | 'zoom';
  stories?: Story[];
  family?: {
    groom: {
      label: { ko: string; en: string };
      name: { ko: string; en: string };
      parents: { label: { ko: string; en: string }; name: { ko: string; en: string }; phone: string }[];
      phone: string;
    };
    bride: {
      label: { ko: string; en: string };
      name: { ko: string; en: string };
      parents: { label: { ko: string; en: string }; name: { ko: string; en: string }; phone: string }[];
      phone: string;
    };
  };
  button?: {
    ko: string;
    en: string;
  };
  calendar?: {
    year: number;
    month: number;
    day: number;
    time: {
      ko: string;
      en: string;
    };
    heart?: boolean;
  };
}

export interface WeddingConfig {
  meta: Meta;
  theme: Theme;
  groom: Person;
  groomFather: Person;
  groomMother: Person;
  bride: Person;
  brideFather: Person;
  brideMother: Person;
  venue: Venue;
  hero: HeroSection;
  sections: Section[];
} 