import { NextResponse } from 'next/server';
import type { JournalResponse } from '@/types/journal';
import { API_CONFIG } from '@/config/constants';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const journal = searchParams.get('journal');

  if (!journal) {
    return NextResponse.json({ error: '请提供期刊名称' }, { status: 400 });
  }

  try {
    const response = await axios.get<JournalResponse>(`${API_CONFIG.BASE_URL}`, {
      params: {
        secretKey: API_CONFIG.SECRET_KEY,
        publicationName: journal
      }
    });

    // if (response.data.data.customRank.rankInfo.length === 0) {
    //   return NextResponse.json({ error: '未找到该期刊信息' }, { status: 404 });
    // }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('API请求失败:', error);
    return NextResponse.json({ error: '服务器错误，请稍后重试' }, { status: 500 });
  }
} 