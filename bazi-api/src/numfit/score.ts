// 명리학 기반 숫자 점수 계산 및 분석

import { SajuProfile, NumberAnalysis } from './types';
import { 
  getElementFromDigit, 
  analyzeElementRelationship, 
  getSeasonalStrength,
  calculateDigitalRoot,
  getLuckyNumbersByElement,
  getAvoidNumbersByElement,
  POSITION_WEIGHTS
} from './mapping';

export class NumberFitAnalyzer {
  private sajuProfile: SajuProfile;

  constructor(sajuProfile: SajuProfile) {
    this.sajuProfile = sajuProfile;
  }

  public analyzeNumber(number: string, type: 'phone' | 'plate' | 'personal' | 'date'): NumberAnalysis {
    const elements = this.extractElements(number);
    const score = this.calculateScore(elements, type);
    const compatibility = this.calculateCompatibility(elements);
    const analysis = this.generateAnalysis(elements, score, type);
    const fortune = this.calculateFortune(elements, score);

    return {
      number,
      type,
      score,
      elements,
      compatibility,
      analysis,
      fortune
    };
  }

  private extractElements(number: string): string[] {
    const digits = number.replace(/\D/g, '').split('').map(d => parseInt(d));
    const elements: string[] = [];
    let previousElement: string | undefined;

    for (const digit of digits) {
      const element = getElementFromDigit(digit, previousElement);
      elements.push(element);
      previousElement = element;
    }

    return elements;
  }

  private calculateScore(elements: string[], type: string): number {
    let baseScore = 50;
    let weightedSum = 0;
    let totalWeight = 0;

    // 사주 오행과의 조화도 계산
    const sajuElements = [
      this.sajuProfile.elements.year,
      this.sajuProfile.elements.month,
      this.sajuProfile.elements.day,
      this.sajuProfile.elements.hour
    ];

    // 용신, 희신, 기신, 구신 고려
    const importantElements = [
      this.sajuProfile.yongshin,
      this.sajuProfile.heeshin,
      this.sajuProfile.gishin,
      this.sajuProfile.gushin
    ].filter(Boolean);

    // 각 숫자 위치별 가중치 적용
    const weights = POSITION_WEIGHTS[type as keyof typeof POSITION_WEIGHTS] || POSITION_WEIGHTS.personal;
    const weightKeys = Object.keys(weights);
    
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const weight = this.getPositionWeight(i, elements.length, weights);
      
      // 사주 오행과의 관계 분석
      let elementScore = 0;
      for (const sajuElement of sajuElements) {
        const relationship = analyzeElementRelationship(element, sajuElement);
        elementScore += relationship.strength * 10;
      }

      // 중요 오행과의 관계 분석
      for (const importantElement of importantElements) {
        if (importantElement) {
          const relationship = analyzeElementRelationship(element, importantElement);
          elementScore += relationship.strength * 15;
        }
      }

      // 계절적 강도 고려
      const seasonalStrength = getSeasonalStrength(element, this.sajuProfile.month);
      elementScore *= seasonalStrength;

      weightedSum += elementScore * weight;
      totalWeight += weight;
    }

    // 패턴 보너스/페널티
    const patternBonus = this.calculatePatternBonus(elements);
    const digitalRootBonus = this.calculateDigitalRootBonus(number);

    // 최종 점수 계산
    const averageScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
    const finalScore = Math.min(100, Math.max(0, baseScore + averageScore + patternBonus + digitalRootBonus));

    return Math.round(finalScore);
  }

  private getPositionWeight(index: number, totalLength: number, weights: any): number {
    if (totalLength <= 3) return 1.0;
    
    const firstThird = Math.floor(totalLength / 3);
    const lastThird = totalLength - Math.floor(totalLength / 3);
    
    if (index < firstThird) return weights.first || 0.4;
    if (index >= lastThird) return weights.last || 0.3;
    return weights.middle || 0.3;
  }

  private calculatePatternBonus(elements: string[]): number {
    let bonus = 0;

    // 연속된 같은 오행 보너스
    for (let i = 0; i < elements.length - 1; i++) {
      if (elements[i] === elements[i + 1]) {
        bonus += 2;
      }
    }

    // 상생 관계 보너스
    for (let i = 0; i < elements.length - 1; i++) {
      const relationship = analyzeElementRelationship(elements[i], elements[i + 1]);
      if (relationship.type === 'generating') {
        bonus += 3;
      } else if (relationship.type === 'controlling') {
        bonus -= 2;
      }
    }

    // 오행 균형 보너스
    const elementCounts = elements.reduce((acc, element) => {
      acc[element] = (acc[element] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const uniqueElements = Object.keys(elementCounts).length;
    if (uniqueElements >= 3) bonus += 5; // 다양한 오행 조합

    return bonus;
  }

  private calculateDigitalRootBonus(number: string): number {
    const digitalRoot = calculateDigitalRoot(number);
    const luckyNumbers = getLuckyNumbersByElement(this.sajuProfile.yongshin || '토');
    const avoidNumbers = getAvoidNumbersByElement(this.sajuProfile.yongshin || '토');

    if (luckyNumbers.includes(digitalRoot)) return 5;
    if (avoidNumbers.includes(digitalRoot)) return -3;
    return 0;
  }

  private calculateCompatibility(elements: string[]): {
    yongshin: number;
    heeshin: number;
    overall: number;
  } {
    const yongshin = this.sajuProfile.yongshin;
    const heeshin = this.sajuProfile.heeshin;

    let yongshinScore = 0;
    let heeshinScore = 0;
    let overallScore = 0;

    for (const element of elements) {
      if (yongshin) {
        const relationship = analyzeElementRelationship(element, yongshin);
        yongshinScore += relationship.strength * 10;
      }
      if (heeshin) {
        const relationship = analyzeElementRelationship(element, heeshin);
        heeshinScore += relationship.strength * 10;
      }
    }

    // 전체 조화도 계산
    const sajuElements = [
      this.sajuProfile.elements.year,
      this.sajuProfile.elements.month,
      this.sajuProfile.elements.day,
      this.sajuProfile.elements.hour
    ];

    for (const element of elements) {
      for (const sajuElement of sajuElements) {
        const relationship = analyzeElementRelationship(element, sajuElement);
        overallScore += relationship.strength * 5;
      }
    }

    return {
      yongshin: Math.min(100, Math.max(0, yongshinScore / elements.length)),
      heeshin: Math.min(100, Math.max(0, heeshinScore / elements.length)),
      overall: Math.min(100, Math.max(0, overallScore / (elements.length * sajuElements.length)))
    };
  }

  private generateAnalysis(elements: string[], score: number, type: string): {
    positive: string[];
    negative: string[];
    suggestions: string[];
  } {
    const positive: string[] = [];
    const negative: string[] = [];
    const suggestions: string[] = [];

    // 긍정적 분석
    if (score >= 80) {
      positive.push('매우 길한 숫자 조합입니다');
      positive.push('사주와 완벽하게 조화를 이룹니다');
    } else if (score >= 60) {
      positive.push('길한 숫자 조합입니다');
      positive.push('사주와 조화롭습니다');
    }

    // 부정적 분석
    if (score < 40) {
      negative.push('사주와 상극인 숫자 조합입니다');
      negative.push('운세에 부정적 영향을 줄 수 있습니다');
    } else if (score < 60) {
      negative.push('사주와 다소 맞지 않는 조합입니다');
    }

    // 제안사항
    if (this.sajuProfile.yongshin) {
      const luckyNumbers = getLuckyNumbersByElement(this.sajuProfile.yongshin);
      suggestions.push(`${this.sajuProfile.yongshin} 오행에 해당하는 숫자 ${luckyNumbers.slice(0, 3).join(', ')} 등을 활용하세요`);
    }

    if (type === 'phone') {
      suggestions.push('전화번호는 자주 사용되므로 길한 숫자로 변경하는 것을 권장합니다');
    } else if (type === 'plate') {
      suggestions.push('차량번호는 이동과 관련되므로 안전과 관련된 길한 숫자를 선택하세요');
    }

    return { positive, negative, suggestions };
  }

  private calculateFortune(elements: string[], score: number): {
    health: number;
    wealth: number;
    career: number;
    relationship: number;
  } {
    const baseFortune = score / 100;

    // 오행별 운세 특성
    const elementFortune = elements.reduce((acc, element) => {
      switch (element) {
        case '목':
          acc.health += 10;
          acc.career += 8;
          break;
        case '화':
          acc.relationship += 10;
          acc.career += 6;
          break;
        case '토':
          acc.wealth += 10;
          acc.health += 6;
          break;
        case '금':
          acc.wealth += 8;
          acc.career += 10;
          break;
        case '수':
          acc.health += 8;
          acc.relationship += 6;
          break;
      }
      return acc;
    }, { health: 0, wealth: 0, career: 0, relationship: 0 });

    return {
      health: Math.min(100, Math.max(0, baseFortune * 60 + elementFortune.health)),
      wealth: Math.min(100, Math.max(0, baseFortune * 60 + elementFortune.wealth)),
      career: Math.min(100, Math.max(0, baseFortune * 60 + elementFortune.career)),
      relationship: Math.min(100, Math.max(0, baseFortune * 60 + elementFortune.relationship))
    };
  }
}



