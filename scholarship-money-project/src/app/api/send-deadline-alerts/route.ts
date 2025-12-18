import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { 
  getFavoriteJobs, 
  checkNotificationSent, 
  saveNotificationLog 
} from '@/lib/firebase/profile';

export const dynamic = 'force-dynamic';

// 이메일 발송 함수 (실제로는 Resend, SendGrid 등을 사용)
async function sendEmail(to: string, subject: string, html: string) {
  // TODO: 실제 이메일 서비스 API 연동
  // 예시: Resend API 사용
  console.log(`📧 이메일 발송: ${to}`);
  console.log(`제목: ${subject}`);
  console.log(`내용:\n${html}`);
  
  // 실제 구현 예시 (Resend):
  // const response = await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     from: 'noreply@your-domain.com',
  //     to,
  //     subject,
  //     html
  //   })
  // });
  
  return { success: true };
}

export async function POST(request: NextRequest) {
  try {
    // CRON_SECRET 검증 (보안)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: '인증되지 않은 요청입니다.' },
        { status: 401 }
      );
    }

    console.log('=== 마감 임박 알림 발송 시작 ===');
    
    const now = new Date();
    const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const oneDayLater = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
    
    // 모든 채용 공고 가져오기
    const jobsRef = collection(db, 'jobs');
    const jobsSnapshot = await getDocs(jobsRef);
    
    const jobs = jobsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Array<{id: string; deadline?: string; [key: string]: any}>;
    
    // 알림 설정이 켜진 사용자들 가져오기
    const usersRef = collection(db, 'users');
    const usersQuery = query(
      usersRef, 
      where('notifications.deadlineAlert', '==', true)
    );
    const usersSnapshot = await getDocs(usersQuery);
    
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Array<{id: string; email?: string; name?: string; [key: string]: any}>;
    
    console.log(`✅ 사용자 ${users.length}명 확인`);
    console.log(`✅ 채용 공고 ${jobs.length}개 확인`);
    
    let sentCount = 0;
    
    // 각 사용자에 대해 처리
    for (const user of users) {
      try {
        // 사용자의 관심 공고 가져오기
        const favoriteJobs = await getFavoriteJobs(user.id);
        
        if (favoriteJobs.length === 0) continue;
        
        for (const favorite of favoriteJobs) {
          const job = jobs.find((j: any) => j.id === favorite.jobId);
          if (!job || !(job as any).deadline) continue;
          
          const deadline = new Date((job as any).deadline);
          const daysDiff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          // D-3 알림
          if (daysDiff === 3) {
            const alreadySent = await checkNotificationSent(user.id, (job as any).id, 'D-3');
            
            if (!alreadySent) {
              const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #2563eb;">⏰ 마감 임박 알림 (D-3)</h2>
                  <p>안녕하세요, ${(user as any).name || '회원'}님!</p>
                  <p>관심 공고가 <strong>3일 후</strong> 마감됩니다.</p>
                  
                  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">${(job as any).position || '채용 공고'}</h3>
                    <p style="margin: 5px 0;"><strong>회사:</strong> ${(job as any).company || '회사명'}</p>
                    <p style="margin: 5px 0;"><strong>지역:</strong> ${(job as any).location || '전국'}</p>
                    <p style="margin: 5px 0;"><strong>마감일:</strong> ${(job as any).deadline}</p>
                    <a href="${(job as any).website || '#'}" 
                       style="display: inline-block; margin-top: 15px; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">
                      공고 확인하기
                    </a>
                  </div>
                  
                  <p style="color: #6b7280; font-size: 14px;">
                    ※ 마감일 하루 전에도 다시 알림을 보내드립니다.
                  </p>
                </div>
              `;
              
              await sendEmail(
                (user as any).email,
                `⏰ [마감 D-3] ${(job as any).position || '채용 공고'} 마감 임박`,
                emailHtml
              );
              
              await saveNotificationLog(user.id, (job as any).id, 'D-3', (user as any).email);
              sentCount++;
              console.log(`✅ D-3 알림 발송: ${(user as any).email} - ${(job as any).position}`);
            }
          }
          
          // D-1 알림
          if (daysDiff === 1) {
            const alreadySent = await checkNotificationSent(user.id, (job as any).id, 'D-1');
            
            if (!alreadySent) {
              const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #dc2626;">🚨 마감 임박 알림 (D-1)</h2>
                  <p>안녕하세요, ${(user as any).name || '회원'}님!</p>
                  <p>관심 공고가 <strong>내일</strong> 마감됩니다!</p>
                  
                  <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #dc2626;">
                    <h3 style="margin-top: 0; color: #dc2626;">${(job as any).position || '채용 공고'}</h3>
                    <p style="margin: 5px 0;"><strong>회사:</strong> ${(job as any).company || '회사명'}</p>
                    <p style="margin: 5px 0;"><strong>지역:</strong> ${(job as any).location || '전국'}</p>
                    <p style="margin: 5px 0;"><strong>마감일:</strong> ${(job as any).deadline}</p>
                    <a href="${(job as any).website || '#'}" 
                       style="display: inline-block; margin-top: 15px; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                      지금 지원하기
                    </a>
                  </div>
                  
                  <p style="color: #dc2626; font-weight: bold;">
                    ⚠️ 서두르세요! 내일이 마지막 날입니다!
                  </p>
                </div>
              `;
              
              await sendEmail(
                (user as any).email,
                `🚨 [마감 D-1] ${(job as any).position || '채용 공고'} 내일 마감!`,
                emailHtml
              );
              
              await saveNotificationLog(user.id, (job as any).id, 'D-1', (user as any).email);
              sentCount++;
              console.log(`✅ D-1 알림 발송: ${(user as any).email} - ${(job as any).position}`);
            }
          }
        }
      } catch (userError) {
        console.error(`❌ 사용자 ${user.id} 처리 중 오류:`, userError);
        continue;
      }
    }
    
    console.log(`✅ 총 ${sentCount}개의 알림 발송 완료`);
    
    return NextResponse.json({
      success: true,
      message: `${sentCount}개의 알림을 발송했습니다.`,
      sentCount
    });
    
  } catch (error: any) {
    console.error('❌ 알림 발송 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '알림 발송 중 오류가 발생했습니다.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET 요청으로 테스트 가능하게
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: '이 엔드포인트는 POST 요청만 받습니다.',
    usage: 'POST /api/send-deadline-alerts with Authorization: Bearer <CRON_SECRET>',
    note: '실제 운영 환경에서는 Cloud Scheduler나 cron job으로 호출해야 합니다.'
  });
}
