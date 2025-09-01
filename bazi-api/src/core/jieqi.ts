import { DateTime } from 'luxon';
import { JieQiData } from '../types';

// 24절기 정의 (태양 황경 기준)
export const JIEQI_DEFINITIONS = [
  { name: '입춘', longitude: 315, type: 'major' as const },
  { name: '우수', longitude: 330, type: 'minor' as const },
  { name: '경칩', longitude: 345, type: 'major' as const },
  { name: '춘분', longitude: 0, type: 'minor' as const },
  { name: '청명', longitude: 15, type: 'major' as const },
  { name: '곡우', longitude: 30, type: 'minor' as const },
  { name: '입하', longitude: 45, type: 'major' as const },
  { name: '소만', longitude: 60, type: 'minor' as const },
  { name: '망종', longitude: 75, type: 'major' as const },
  { name: '하지', longitude: 90, type: 'minor' as const },
  { name: '소서', longitude: 105, type: 'major' as const },
  { name: '대서', longitude: 120, type: 'minor' as const },
  { name: '입추', longitude: 135, type: 'major' as const },
  { name: '처서', longitude: 150, type: 'minor' as const },
  { name: '백로', longitude: 165, type: 'major' as const },
  { name: '추분', longitude: 180, type: 'minor' as const },
  { name: '한로', longitude: 195, type: 'major' as const },
  { name: '상강', longitude: 210, type: 'minor' as const },
  { name: '입동', longitude: 225, type: 'major' as const },
  { name: '소설', longitude: 240, type: 'minor' as const },
  { name: '대설', longitude: 255, type: 'major' as const },
  { name: '동지', longitude: 270, type: 'minor' as const },
  { name: '소한', longitude: 285, type: 'major' as const },
  { name: '대한', longitude: 300, type: 'minor' as const }
];

// 중기(태양 황경 0°, 30°, 60°, 90°, 120°, 150°, 180°, 210°, 240°, 270°, 300°, 330°)
export const MAJOR_JIEQI = JIEQI_DEFINITIONS.filter(j => j.type === 'major');

export class JieQiCalculator {
  private cache: Map<number, JieQiData[]> = new Map();

  /**
   * 특정 연도의 24절기 계산
   */
  calculateJieQiForYear(year: number): JieQiData[] {
    if (this.cache.has(year)) {
      return this.cache.get(year)!;
    }

    const jieqiList: JieQiData[] = [];

    for (const jieqi of JIEQI_DEFINITIONS) {
      const date = this.calculateJieQiDate(year, jieqi.longitude);
      jieqiList.push({
        name: jieqi.name,
        date: date.toISO() || '',
        solarLongitude: jieqi.longitude,
        type: jieqi.type
      });
    }

    // 날짜순으로 정렬
    jieqiList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    this.cache.set(year, jieqiList);
    return jieqiList;
  }

  /**
   * 태양 황경을 기반으로 절기 날짜 계산
   * 실제로는 Swiss Ephemeris를 사용해야 하지만, 여기서는 근사값 사용
   */
  private calculateJieQiDate(year: number, targetLongitude: number): DateTime {
    // 근사 계산: 태양이 하루에 약 1도씩 이동한다고 가정
    const baseDate = DateTime.fromObject({ year, month: 1, day: 1 });
    const daysOffset = Math.floor(targetLongitude);
    
    return baseDate.plus({ days: daysOffset });
  }

  /**
   * 주어진 날짜의 월주를 중기 기준으로 판정
   */
  getMonthPillarByJieQi(birthDate: DateTime): { month: number; confidence: number } {
    const year = birthDate.year;
    const jieqiList = this.calculateJieQiForYear(year);
    
    // 중기만 필터링
    const majorJieqi = jieqiList.filter(j => j.type === 'major');
    
    // 출생일 이전의 마지막 중기 찾기
    let monthPillar = 1; // 기본값
    let confidence = 1.0;
    
    for (let i = 0; i < majorJieqi.length; i++) {
      const jieqiDate = DateTime.fromISO(majorJieqi[i].date);
      
      if (birthDate >= jieqiDate) {
        monthPillar = i + 1;
      } else {
        break;
      }
    }
    
    // 경계 근처인지 확인 (7일 이내)
    const nextJieqi = majorJieqi.find(j => {
      const jieqiDate = DateTime.fromISO(j.date);
      return jieqiDate > birthDate;
    });
    
    if (nextJieqi) {
      const nextJieqiDate = DateTime.fromISO(nextJieqi.date);
      const daysToNext = nextJieqiDate.diff(birthDate, 'days').days;
      
      if (daysToNext <= 7) {
        confidence = Math.max(0.5, 1 - (daysToNext / 7));
      }
    }
    
    return { month: monthPillar, confidence };
  }

  /**
   * 경계 감도 검사
   */
  checkBoundarySensitivity(birthDate: DateTime): {
    hasMonthBoundary: boolean;
    hasYearBoundary: boolean;
    confidence: number;
  } {
    const year = birthDate.year;
    const jieqiList = this.calculateJieQiForYear(year);
    
    let hasMonthBoundary = false;
    let hasYearBoundary = false;
    let confidence = 1.0;
    
    // 월주 경계 검사 (중기 기준)
    const majorJieqi = jieqiList.filter(j => j.type === 'major');
    for (const jieqi of majorJieqi) {
      const jieqiDate = DateTime.fromISO(jieqi.date);
      const daysDiff = Math.abs(birthDate.diff(jieqiDate, 'days').days);
      
      if (daysDiff <= 3) {
        hasMonthBoundary = true;
        confidence = Math.min(confidence, 0.7);
      }
    }
    
    // 연주 경계 검사 (입춘 기준)
    const lichun = jieqiList.find(j => j.name === '입춘');
    if (lichun) {
      const lichunDate = DateTime.fromISO(lichun.date);
      const daysDiff = Math.abs(birthDate.diff(lichunDate, 'days').days);
      
      if (daysDiff <= 3) {
        hasYearBoundary = true;
        confidence = Math.min(confidence, 0.7);
      }
    }
    
    return { hasMonthBoundary, hasYearBoundary, confidence };
  }

  /**
   * 캐시 초기화
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// 싱글톤 인스턴스
export const jieqiCalculator = new JieQiCalculator();
