import fs from 'fs';
import path from 'path';

export function getStoryImages() {
  const storyImages: { [key: string]: string[] } = {};
  const storyDir = path.join(process.cwd(), 'public/images/couple-story');

  // story-1, story-2 등의 폴더들을 찾습니다
  const storyFolders = fs.readdirSync(storyDir)
    .filter(file => fs.statSync(path.join(storyDir, file)).isDirectory())
    .sort((a, b) => {
      const numA = parseInt(a.replace('story-', ''));
      const numB = parseInt(b.replace('story-', ''));
      return numA - numB;
    });

  // 각 폴더의 이미지들을 가져옵니다
  storyFolders.forEach(folder => {
    const folderPath = path.join(storyDir, folder);
    const images = fs.readdirSync(folderPath)
      .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .sort()
      .map(file => `/images/couple-story/${folder}/${file}`);
    
    storyImages[folder] = images;
  });

  return storyImages;
} 