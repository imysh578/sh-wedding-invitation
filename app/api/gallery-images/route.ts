import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const galleryImages: string[] = [];
    const baseDir = path.join(process.cwd(), 'public/images/gallery');
    if (!fs.existsSync(baseDir)) {
      return NextResponse.json(galleryImages);
    }
    const files = fs.readdirSync(baseDir)
      .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .sort();
    files.forEach(file => {
      galleryImages.push(`/images/gallery/${file}`);
    });
    return NextResponse.json(galleryImages);
  } catch (error) {
    console.error('갤러리 이미지 로딩 중 오류:', error);
    return NextResponse.json({ error: '이미지 로딩 실패' }, { status: 500 });
  }
} 