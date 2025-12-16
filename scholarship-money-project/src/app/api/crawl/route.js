// app/api/cron/route.js
// Vercel Cron Jobs를 위한 스케줄러
import { NextResponse } from 'next/server';
import DataCrawler from '@/lib/crawler';

// vercel.json에 아래 설정 추가 필요:
// {
//   "crons": [{
//     "path": "/api/cron",
//     "schedule": "0 */6 * * *"
//   }]
// }

const CRAWL_TARGETS = [
  {
    url: 'https://example.com/news',
    selectors: {
      title: '.article-title',
      content: '.article-content p',
      links: '.article-content a'
    }
  },
  {
    url: 'https://example.com/blog',
    selectors: {
      title: 'h1.post-title',
      content: '.post-body p',
      images: '.post-body img'
    }
  }
];

export async function GET(request) {
  // Vercel Cron Secret 검증 (production에서 사용)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log(`[CRON] 자동 크롤링 시작: ${new Date().toISOString()}`);
    
    const crawler = new DataCrawler();
    const allResults = [];

    for (const target of CRAWL_TARGETS) {
      const data = await crawler.crawlWebsite(target.url, {
        selectors: target.selectors
      });

      if (data) {
        await crawler.saveToFirestore(data);
        allResults.push(data);
      }

      // 서버 부하 방지를 위한 딜레이
      await crawler.delay(3000);
    }

    const errorLog = crawler.getErrorLog();

    console.log(`[CRON] 완료: ${allResults.length}개 수집, ${errorLog.length}개 오류`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      collected: allResults.length,
      errors: errorLog.length,
      data: allResults
    });

  } catch (error) {
    console.error('[CRON ERROR]', error);
    return NextResponse.json(
      { 
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// 수동 트리거용
export async function POST(request) {
  const { url, selectors } = await request.json();

  try {
    const crawler = new DataCrawler();
    const data = await crawler.crawlWebsite(url, { selectors });

    if (data) {
      await crawler.saveToFirestore(data);
      return NextResponse.json({
        success: true,
        data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '데이터 수집 실패',
        errors: crawler.getErrorLog()
      }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
