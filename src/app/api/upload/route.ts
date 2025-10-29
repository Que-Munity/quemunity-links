import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (type === 'image' && !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid image file type' }, { status: 400 });
    }
    
    if (type === 'video' && !file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'Invalid video file type' }, { status: 400 });
    }

    // Validate file size
    const maxSize = type === 'image' ? 10 * 1024 * 1024 : 50 * 1024 * 1024; // 10MB for images, 50MB for videos
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Max size is ${type === 'image' ? '10MB' : '50MB'}` 
      }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `${type}_${timestamp}_${randomString}.${fileExtension}`;

    // Create upload directories if they don't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', type + 's');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = join(uploadDir, filename);
    
    await writeFile(filepath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/${type}s/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename: filename,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}