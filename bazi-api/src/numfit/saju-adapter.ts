// 사주 정보 어댑터 - 사용자 사주 정보 조회 및 검증

import { SajuProfile } from './types';
import Database from 'better-sqlite3';

export class SajuAdapter {
  private db: Database.Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
  }

  public async getSajuProfile(userId: number): Promise<SajuProfile | null> {
    try {
      // 사용자 기본 정보 조회
      const userQuery = `
        SELECT 
          u.birth_year, u.birth_month, u.birth_day, u.birth_hour, u.gender,
          b.year_element, b.month_element, b.day_element, b.hour_element,
          b.year_branch, b.month_branch, b.day_branch, b.hour_branch,
          b.yongshin, b.heeshin, b.gishin, b.gushin
        FROM users u
        LEFT JOIN bazi_profiles b ON u.id = b.user_id
        WHERE u.id = ?
      `;

      const user = this.db.prepare(userQuery).get(userId) as any;
      
      if (!user) {
        return null;
      }

      // 사주 정보가 없는 경우 기본 오행 계산
      if (!user.year_element) {
        const calculatedSaju = this.calculateBasicSaju(
          user.birth_year,
          user.birth_month,
          user.birth_day,
          user.birth_hour
        );
        
        return {
          year: user.birth_year,
          month: user.birth_month,
          day: user.birth_day,
          hour: user.birth_hour,
          gender: user.gender === 'M' ? 'male' : 'female',
          elements: calculatedSaju.elements,
          branches: calculatedSaju.branches
        };
      }

      return {
        year: user.birth_year,
        month: user.birth_month,
        day: user.birth_day,
        hour: user.birth_hour,
        gender: user.gender === 'M' ? 'male' : 'female',
        elements: {
          year: user.year_element,
          month: user.month_element,
          day: user.day_element,
          hour: user.hour_element
        },
        branches: {
          year: user.year_branch,
          month: user.month_branch,
          day: user.day_branch,
          hour: user.hour_branch
        },
        yongshin: user.yongshin,
        heeshin: user.heeshin,
        gishin: user.gishin,
        gushin: user.gushin
      };
    } catch (error) {
      console.error('사주 정보 조회 오류:', error);
      return null;
    }
  }

  private calculateBasicSaju(year: number, month: number, day: number, hour: number): {
    elements: { year: string; month: string; day: string; hour: string };
    branches: { year: string; month: string; day: string; hour: string };
  } {
    // 간단한 천간 계산 (실제로는 더 복잡한 계산이 필요)
    const heavenlyStems = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
    const earthlyBranches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
    
    const yearStemIndex = (year - 4) % 10;
    const yearBranchIndex = (year - 4) % 12;
    
    const monthStemIndex = (yearStemIndex * 2 + month - 1) % 10;
    const monthBranchIndex = (month + 1) % 12;
    
    const dayStemIndex = Math.floor((year * 5 + year / 4 + day) % 10);
    const dayBranchIndex = Math.floor((year * 5 + year / 4 + day) % 12);
    
    const hourStemIndex = (dayStemIndex * 2 + Math.floor(hour / 2)) % 10;
    const hourBranchIndex = Math.floor(hour / 2) % 12;

    return {
      elements: {
        year: heavenlyStems[yearStemIndex],
        month: heavenlyStems[monthStemIndex],
        day: heavenlyStems[dayStemIndex],
        hour: heavenlyStems[hourStemIndex]
      },
      branches: {
        year: earthlyBranches[yearBranchIndex],
        month: earthlyBranches[monthBranchIndex],
        day: earthlyBranches[dayBranchIndex],
        hour: earthlyBranches[hourBranchIndex]
      }
    };
  }

  public validateSajuProfile(profile: SajuProfile): boolean {
    if (!profile.year || !profile.month || !profile.day || !profile.hour) {
      return false;
    }

    if (profile.year < 1900 || profile.year > 2100) {
      return false;
    }

    if (profile.month < 1 || profile.month > 12) {
      return false;
    }

    if (profile.day < 1 || profile.day > 31) {
      return false;
    }

    if (profile.hour < 0 || profile.hour > 23) {
      return false;
    }

    return true;
  }

  public getElementFromStem(stem: string): string {
    const stemToElement: Record<string, string> = {
      '갑': '목', '을': '목',
      '병': '화', '정': '화',
      '무': '토', '기': '토',
      '경': '금', '신': '금',
      '임': '수', '계': '수'
    };
    return stemToElement[stem] || '토';
  }

  public getElementFromBranch(branch: string): string {
    const branchToElement: Record<string, string> = {
      '자': '수', '축': '토', '인': '목', '묘': '목',
      '진': '토', '사': '화', '오': '화', '미': '토',
      '신': '금', '유': '금', '술': '토', '해': '수'
    };
    return branchToElement[branch] || '토';
  }
}



