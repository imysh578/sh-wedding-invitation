import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const storyImages: { [key: string]: string[] } = {};
    const baseDir = path.join(process.cwd(), 'public/images/couple-story');
    if (!fs.existsSync(baseDir)) {
      return NextResponse.json(storyImages);
    }
    const storyFolders = fs.readdirSync(baseDir)
      .filter(file => fs.statSync(path.join(baseDir, file)).isDirectory())
      .sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, ''));
        const numB = parseInt(b.replace(/\D/g, ''));
        return numA - numB;
      });
    storyFolders.forEach(folder => {
      const folderPath = path.join(baseDir, folder);
      const images = fs.readdirSync(folderPath)
        .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
        .sort()
        .map(file => `/images/couple-story/${folder}/${file}`);
      storyImages[folder] = images;
    });
    return NextResponse.json(storyImages);
  } catch (error) {
    console.error('커플 스토리 이미지 로딩 중 오류:', error);
    return NextResponse.json({ error: '이미지 로딩 실패' }, { status: 500 });
  }
} 