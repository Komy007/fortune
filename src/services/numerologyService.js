const BaziEngine = require('../../bazi-engine');

class NumerologyService {
  constructor() {
    this.baziEngine = new BaziEngine();
  }

  // 천간의 오행 반환
  getHeavenlyStemElement(stem) {
    const stemElements = {
      '甲': '木', '乙': '木',
      '丙': '火', '丁': '火', 
      '戊': '土', '己': '土',
      '庚': '金', '辛': '金',
      '壬': '水', '癸': '水'
    };
    return stemElements[stem] || '土';
  }

  // 지지의 오행 반환
  getEarthlyBranchElement(branch) {
    const branchElements = {
      '寅': '木', '卯': '木',
      '巳': '火', '午': '火',
      '辰': '土', '戌': '土', '丑': '土', '未': '土',
      '申': '金', '酉': '金',
      '亥': '水', '子': '水'
    };
    return branchElements[branch] || '土';
  }

  // 숫자를 오행으로 변환
  numberToElement(number) {
    const elementMap = {
      1: '水', 2: '土', 3: '木', 4: '木',
      5: '土', 6: '金', 7: '金', 8: '土',
      9: '火', 0: '土'
    };
    return elementMap[number] || '土';
  }

  // 오행 상생 관계
  isGenerating(element1, element2) {
    const generating = {
      '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
    };
    return generating[element1] === element2;
  }

  // 오행 상극 관계
  isControlling(element1, element2) {
    const controlling = {
      '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
    };
    return controlling[element1] === element2;
  }

  // 사주 기반 길한 숫자 분석
  analyzeLuckyNumbers(baziData) {
    const { yearStem, yearBranch, monthStem, monthBranch, dayStem, dayBranch, hourStem, hourBranch } = baziData;
    
    // 사주의 오행 분석
    const elements = [
      this.getHeavenlyStemElement(yearStem),
      this.getEarthlyBranchElement(yearBranch),
      this.getHeavenlyStemElement(monthStem),
      this.getEarthlyBranchElement(monthBranch),
      this.getHeavenlyStemElement(dayStem),
      this.getEarthlyBranchElement(dayBranch),
      this.getHeavenlyStemElement(hourStem),
      this.getEarthlyBranchElement(hourBranch)
    ];

    // 오행 빈도 계산
    const elementCount = {};
    elements.forEach(element => {
      elementCount[element] = (elementCount[element] || 0) + 1;
    });

    // 부족한 오행 찾기
    const allElements = ['木', '火', '土', '金', '水'];
    const missingElements = allElements.filter(element => !elementCount[element] || elementCount[element] < 1);

    // 길한 숫자 추천 (부족한 오행 기반)
    const luckyNumbers = [];
    missingElements.forEach(element => {
      Object.entries(this.numberToElement).forEach(([num, numElement]) => {
        if (numElement === element) {
          luckyNumbers.push(parseInt(num));
        }
      });
    });

    // 상생 관계의 숫자도 추가
    elements.forEach(element => {
      Object.entries(this.numberToElement).forEach(([num, numElement]) => {
        if (this.isGenerating(element, numElement)) {
          luckyNumbers.push(parseInt(num));
        }
      });
    });

    return [...new Set(luckyNumbers)].sort((a, b) => a - b);
  }

  // 전화번호 길흉 분석
  analyzePhoneNumber(phoneNumber, baziData) {
    const digits = phoneNumber.replace(/\D/g, '').split('').map(Number);
    const luckyNumbers = this.analyzeLuckyNumbers(baziData);
    
    let score = 0;
    const analysis = [];

    digits.forEach((digit, index) => {
      const element = this.numberToElement(digit);
      const isLucky = luckyNumbers.includes(digit);
      
      if (isLucky) {
        score += 10;
        analysis.push({
          position: index + 1,
          digit,
          element,
          status: '길',
          reason: '사주에 길한 숫자'
        });
      } else {
        score += 5;
        analysis.push({
          position: index + 1,
          digit,
          element,
          status: '보통',
          reason: '중성적인 숫자'
        });
      }
    });

    const maxScore = digits.length * 10;
    const percentage = Math.round((score / maxScore) * 100);

    return {
      phoneNumber,
      score,
      percentage,
      grade: this.getGrade(percentage),
      analysis,
      recommendation: this.getPhoneRecommendation(percentage)
    };
  }

  // 차량번호 길흉 분석
  analyzeCarNumber(carNumber, baziData) {
    const digits = carNumber.replace(/\D/g, '').split('').map(Number);
    const luckyNumbers = this.analyzeLuckyNumbers(baziData);
    
    let score = 0;
    const analysis = [];

    digits.forEach((digit, index) => {
      const element = this.numberToElement(digit);
      const isLucky = luckyNumbers.includes(digit);
      
      if (isLucky) {
        score += 15;
        analysis.push({
          position: index + 1,
          digit,
          element,
          status: '길',
          reason: '사주에 길한 숫자'
        });
      } else {
        score += 7;
        analysis.push({
          position: index + 1,
          digit,
          element,
          status: '보통',
          reason: '중성적인 숫자'
        });
      }
    });

    const maxScore = digits.length * 15;
    const percentage = Math.round((score / maxScore) * 100);

    return {
      carNumber,
      score,
      percentage,
      grade: this.getGrade(percentage),
      analysis,
      recommendation: this.getCarRecommendation(percentage)
    };
  }

  // 개인 숫자 길흉 분석
  analyzePersonalNumber(number, baziData) {
    const digits = number.toString().split('').map(Number);
    const luckyNumbers = this.analyzeLuckyNumbers(baziData);
    
    let score = 0;
    const analysis = [];

    digits.forEach((digit, index) => {
      const element = this.numberToElement(digit);
      const isLucky = luckyNumbers.includes(digit);
      
      if (isLucky) {
        score += 20;
        analysis.push({
          position: index + 1,
          digit,
          element,
          status: '길',
          reason: '사주에 길한 숫자'
        });
      } else {
        score += 10;
        analysis.push({
          position: index + 1,
          digit,
          element,
          status: '보통',
          reason: '중성적인 숫자'
        });
      }
    });

    const maxScore = digits.length * 20;
    const percentage = Math.round((score / maxScore) * 100);

    return {
      number,
      score,
      percentage,
      grade: this.getGrade(percentage),
      analysis,
      recommendation: this.getPersonalRecommendation(percentage)
    };
  }

  // 택일 서비스 - 특정 목적의 날짜 선택
  selectDateForPurpose(purpose, baziData, startDate = new Date(), days = 30) {
    const luckyNumbers = this.analyzeLuckyNumbers(baziData);
    const recommendations = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      
      let score = 0;
      const reasons = [];

      // 날짜 숫자 분석
      if (luckyNumbers.includes(day)) {
        score += 30;
        reasons.push(`일자 ${day}이(가) 사주에 길함`);
      }
      if (luckyNumbers.includes(month)) {
        score += 20;
        reasons.push(`월 ${month}이(가) 사주에 길함`);
      }

      // 목적별 특별 점수
      switch (purpose) {
        case '미팅':
          if ([1, 3, 5, 7, 9].includes(day)) score += 15;
          break;
        case '계약':
          if ([2, 4, 6, 8, 10].includes(day)) score += 15;
          break;
        case '이사':
          if ([1, 6, 11, 16, 21, 26].includes(day)) score += 15;
          break;
        case '결혼':
          if ([2, 8, 14, 20, 26].includes(day)) score += 15;
          break;
        case '사업':
          if ([3, 9, 15, 21, 27].includes(day)) score += 15;
          break;
      }

      if (score > 0) {
        recommendations.push({
          date: date.toISOString().split('T')[0],
          score,
          grade: this.getGrade(score),
          reasons
        });
      }
    }

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  // 등급 반환
  getGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'D';
  }

  // 전화번호 추천 메시지
  getPhoneRecommendation(percentage) {
    if (percentage >= 80) return '매우 좋은 전화번호입니다. 현재 번호를 유지하시기 바랍니다.';
    if (percentage >= 60) return '괜찮은 전화번호입니다. 약간의 개선 여지가 있습니다.';
    if (percentage >= 40) return '보통 수준의 전화번호입니다. 더 나은 번호로 변경을 고려해보세요.';
    return '전화번호 변경을 권장합니다. 더 길한 번호를 찾아보세요.';
  }

  // 차량번호 추천 메시지
  getCarRecommendation(percentage) {
    if (percentage >= 80) return '매우 좋은 차량번호입니다. 안전 운전에 도움이 될 것입니다.';
    if (percentage >= 60) return '괜찮은 차량번호입니다. 운전 시 주의를 기울이세요.';
    if (percentage >= 40) return '보통 수준의 차량번호입니다. 번호 변경을 고려해보세요.';
    return '차량번호 변경을 권장합니다. 더 길한 번호를 찾아보세요.';
  }

  // 개인 숫자 추천 메시지
  getPersonalRecommendation(percentage) {
    if (percentage >= 80) return '매우 좋은 개인 숫자입니다. 자주 사용하시기 바랍니다.';
    if (percentage >= 60) return '괜찮은 개인 숫자입니다. 적당히 사용하세요.';
    if (percentage >= 40) return '보통 수준의 개인 숫자입니다. 다른 숫자 사용을 고려해보세요.';
    return '다른 개인 숫자 사용을 권장합니다. 더 길한 숫자를 찾아보세요.';
  }

  // 종합 숫자 운세 분석
  getComprehensiveAnalysis(userData, baziData) {
    const luckyNumbers = this.analyzeLuckyNumbers(baziData);
    
    const analysis = {
      luckyNumbers,
      phoneAnalysis: userData.phoneNumber ? this.analyzePhoneNumber(userData.phoneNumber, baziData) : null,
      carAnalysis: userData.carNumber ? this.analyzeCarNumber(userData.carNumber, baziData) : null,
      personalAnalysis: userData.personalNumber ? this.analyzePersonalNumber(userData.personalNumber, baziData) : null,
      recommendations: {
        bestNumbers: luckyNumbers.slice(0, 3),
        avoidNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].filter(num => !luckyNumbers.includes(num)).slice(0, 3),
        luckyColors: this.getLuckyColors(baziData),
        luckyDirections: this.getLuckyDirections(baziData)
      }
    };

    return analysis;
  }

  // 길한 색상 추천
  getLuckyColors(baziData) {
    const luckyNumbers = this.analyzeLuckyNumbers(baziData);
    const colorMap = {
      1: '검정색', 2: '노란색', 3: '초록색', 4: '초록색',
      5: '노란색', 6: '흰색', 7: '흰색', 8: '노란색',
      9: '빨간색', 0: '노란색'
    };
    
    return luckyNumbers.map(num => colorMap[num]).filter((color, index, arr) => arr.indexOf(color) === index);
  }

  // 길한 방향 추천
  getLuckyDirections(baziData) {
    const luckyNumbers = this.analyzeLuckyNumbers(baziData);
    const directionMap = {
      1: '북쪽', 2: '중앙', 3: '동쪽', 4: '동쪽',
      5: '중앙', 6: '서쪽', 7: '서쪽', 8: '중앙',
      9: '남쪽', 0: '중앙'
    };
    
    return luckyNumbers.map(num => directionMap[num]).filter((direction, index, arr) => arr.indexOf(direction) === index);
  }
}

module.exports = NumerologyService;



