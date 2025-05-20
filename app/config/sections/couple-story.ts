import { Section } from '../../types';

export const coupleStory: Section = {
  id: 'couple-story',
  subtitle: {
    ko: '우리의 이야기',
    en: 'Our Story',
  },
  title: {
    ko: '우리가 만난 순간부터',
    en: 'From the Moment We Met',
  },
  content: {
    ko: '',
    en: ''
  },
  stories: [
    {
      date: { ko: '2023년 10월', en: 'October 2023' },
      title: { ko: '첫 만남', en: 'First Meeting' },
      description: {
        ko: '친구의 소개로 처음 만났습니다.',
        en: 'We met for the first time through a friend.',
      },
      folder: 'story1',
    },
    {
      date: { ko: '2023년 11월', en: 'November 2023' },
      title: { ko: '연인이 되었습니다', en: 'Became a Couple' },
      description: {
        ko: '서로의 마음을 확인하고 특별한 사이가 되었습니다.',
        en: 'We confirmed our feelings and became a special couple.',
      },
      folder: 'story2',
    },
    {
      date: { ko: '2024년 12월', en: 'December 2024' },
      title: { ko: '프로포즈', en: 'Proposal' },
      description: {
        ko: '발리에서 아름다운 프로포즈와 함께 평생을 약속했습니다.',
        en: 'We promised forever with a beautiful proposal in Bali.',
      },
      folder: 'story3',
    },
    {
      date: { ko: '2025년 9월', en: 'September 2025' },
      title: { ko: '결혼식', en: 'Wedding' },
      description: {
        ko: '여러분의 축복 속에 새로운 시작을 함께합니다.',
        en: 'We begin a new journey with your blessings.',
      },
      folder: 'story4',
    },
  ],
}; 