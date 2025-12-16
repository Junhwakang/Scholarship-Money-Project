// lib/crawler.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

class DataCrawler {
  constructor() {
    this.collectedData = new Set();
    this.errorLog = [];
  }

  /**
   * HTML 파싱 오류 핸들링이 강화된 크롤링 함수
   */
  async crawlWebsite(url, config = {}) {
    const maxRetries = config.maxRetries || 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        console.log(`[${new Date().toISOString()}] 크롤링 시작: ${url} (시도 ${attempt + 1}/${maxRetries})`);
        
        const response = await axios.get(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        const $ = cheerio.load(response.data);
        const scrapedData = this.parseHTML($, config.selectors || {});

        // 데이터 품질 체크
        const validatedData = this.validateData(scrapedData);
        
        if (validatedData) {
          return validatedData;
        } else {
          throw new Error('데이터 품질 검증 실패');
        }

      } catch (error) {
        attempt++;
        this.errorLog.push({
          url,
          error: error.message,
          timestamp: new Date().toISOString(),
          attempt
        });

        if (attempt >= maxRetries) {
          console.error(`[ERROR] 크롤링 실패 (${url}): ${error.message}`);
          return null;
        }

        await this.delay(2000 * attempt);
      }
    }
  }

  /**
   * Cheerio를 이용한 HTML 파싱
   */
  parseHTML($, selectors) {
    try {
      const data = {
        id: this.generateUniqueId(),
        timestamp: new Date().toISOString(),
        title: $(selectors.title || 'h1').first().text().trim(),
        content: $(selectors.content || 'p').map((i, el) => $(el).text().trim()).get(),
        links: $(selectors.links || 'a').map((i, el) => $(el).attr('href')).get(),
        metadata: {
          images: $(selectors.images || 'img').length,
          paragraphs: $(selectors.content || 'p').length
        }
      };

      return data;
    } catch (error) {
      console.error('[PARSE ERROR]', error.message);
      throw new Error(`HTML 파싱 오류: ${error.message}`);
    }
  }

  /**
   * 데이터 품질 관리 (Data Quality Check)
   */
  validateData(data) {
    if (!data) return null;

    if (!data.title || data.title.length === 0) {
      console.warn('[VALIDATION] 제목 누락');
      return null;
    }

    if (!data.content || data.content.length === 0) {
      console.warn('[VALIDATION] 내용 누락');
      return null;
    }

    if (this.collectedData.has(data.id)) {
      console.warn('[VALIDATION] 중복 데이터 발견');
      return null;
    }

    data.title = this.sanitizeText(data.title);
    data.content = data.content.map(text => this.sanitizeText(text)).filter(Boolean);

    this.collectedData.add(data.id);
    return data;
  }

  /**
   * 텍스트 정제
   */
  sanitizeText(text) {
    if (!text) return '';
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣.,!?-]/g, '')
      .trim();
  }

  /**
   * 중복 제거 로직
   */
  async removeDuplicates(dataArray) {
    const uniqueData = [];
    
    for (const item of dataArray) {
      const isDuplicate = await this.checkDuplicateInFirestore(item);
      if (!isDuplicate) {
        uniqueData.push(item);
      } else {
        console.log(`[DUPLICATE] 중복 제거: ${item.title}`);
      }
    }
    
    return uniqueData;
  }

  /**
   * Firestore에서 중복 체크
   */
  async checkDuplicateInFirestore(data) {
    try {
      const q = query(
        collection(db, 'crawled_data'),
        where('title', '==', data.title)
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('[DUPLICATE CHECK ERROR]', error.message);
      return false;
    }
  }

  /**
   * Firestore 적재
   */
  async saveToFirestore(data, collectionName = 'crawled_data') {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        status: 'processed'
      });
      console.log(`[FIRESTORE] 데이터 저장 완료: ${docRef.id}`);
      return true;
    } catch (error) {
      console.error(`[FIRESTORE ERROR] ${error.message}`);
      this.errorLog.push({
        type: 'firestore',
        data: data.id,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return false;
    }
  }

  /**
   * 배치 저장
   */
  async batchSaveToFirestore(dataArray, collectionName = 'crawled_data') {
    const uniqueData = await this.removeDuplicates(dataArray);
    let successCount = 0;

    for (const data of uniqueData) {
      const success = await this.saveToFirestore(data, collectionName);
      if (success) successCount++;
    }

    console.log(`[BATCH] ${successCount}/${uniqueData.length}개 데이터 저장 완료`);
    return successCount;
  }

  generateUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getErrorLog() {
    return this.errorLog;
  }
}

export default DataCrawler;
