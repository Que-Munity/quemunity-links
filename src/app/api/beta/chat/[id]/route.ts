import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Simple file-based chat storage
const getChatsDir = () => {
  const dir = path.join(process.cwd(), 'data', 'chats');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

const getChatFilePath = (betaTesterId: string) => {
  return path.join(getChatsDir(), `${betaTesterId}.json`);
};

const loadMessages = (betaTesterId: string) => {
  try {
    const filePath = getChatFilePath(betaTesterId);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading messages:', error);
    return [];
  }
};

const saveMessages = (betaTesterId: string, messages: any[]) => {
  try {
    const filePath = getChatFilePath(betaTesterId);
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
};

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ error: 'Beta feature removed' }, { status: 404 });
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ error: 'Beta feature removed' }, { status: 404 });
}