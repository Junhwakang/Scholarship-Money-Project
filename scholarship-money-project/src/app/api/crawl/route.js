// app/api/crawl/route.js
import { NextResponse } from 'next/server';
import DataCrawler from '@/lib/crawler';

export async function POST(request) {
  try {
    const { urls, selectors } = await request.json();

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: '유효한 URL 배열이 필요합니다' },
        { status: 400 }
      );
    }

    const crawler = new DataCrawler();
    const results = [];

    for (const url of urls) {
      const data = await crawler.crawlWebsite(url, { selectors });
      if (data) {
        await crawler.saveToFirestore(data);
        results.push(data);
      }
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      data: results,
      errors: crawler.getErrorLog()
    });

  } catch (error) {
    console.error('[API ERROR]', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Crawler API',
    endpoints: {
      POST: '/api/crawl - URL 배열과 selectors를 전달하여 크롤링 실행'
    }
  });
}
