// 명리학 기반 동적 운세 분석 시스템

// 천간지지 배열
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 오행 매핑
const ELEMENT_MAPPING = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土',
  '庚': '金', '辛': '金', '壬': '水', '癸': '水',
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 오행 상생상극 관계
const ELEMENT_RELATIONS = {
  generation: { '水': '木', '木': '火', '火': '土', '土': '金', '金': '水' },
  conflict: { '金': '木', '木': '土', '土': '水', '水': '火', '火': '金' }
};

// 사용자 명리학 정보 조회
function getUserBaziProfile() {
  const userData = localStorage.getItem('userProfile');
  if (userData) {
    const profile = JSON.parse(userData);
    return profile.bazi || null;
  }
  return null;
}

// 날짜별 천간지지 계산
function calculateDailyStemsBranches(targetDate) {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();
  
  // 간단한 천간지지 계산 (실제로는 복잡한 공식 필요)
  const yearStem = HEAVENLY_STEMS[(year - 4) % 10];
  const yearBranch = EARTHLY_BRANCHES[(year - 4) % 12];
  const monthStem = HEAVENLY_STEMS[(month - 1) % 10];
  const monthBranch = EARTHLY_BRANCHES[(month - 1) % 12];
  const dayStem = HEAVENLY_STEMS[(day - 1) % 10];
  const dayBranch = EARTHLY_BRANCHES[(day - 1) % 12];
  
  return {
    year: { stem: yearStem, branch: yearBranch },
    month: { stem: monthStem, branch: monthBranch },
    day: { stem: dayStem, branch: dayBranch }
  };
}

// 오행 강도 계산
function calculateElementStrength(userBazi, dailyBazi) {
  const elements = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  
  // 사용자 사주 오행
  if (userBazi) {
    const userElements = [
      ELEMENT_MAPPING[userBazi.year.stem], ELEMENT_MAPPING[userBazi.year.branch],
      ELEMENT_MAPPING[userBazi.month.stem], ELEMENT_MAPPING[userBazi.month.branch],
      ELEMENT_MAPPING[userBazi.day.stem], ELEMENT_MAPPING[userBazi.day.branch],
      ELEMENT_MAPPING[userBazi.hour.stem], ELEMENT_MAPPING[userBazi.hour.branch]
    ];
    
    userElements.forEach(element => {
      if (elements[element] !== undefined) {
        elements[element] += 1;
      }
    });
  }
  
  // 당일 오행 추가
  const dailyElements = [
    ELEMENT_MAPPING[dailyBazi.year.stem], ELEMENT_MAPPING[dailyBazi.year.branch],
    ELEMENT_MAPPING[dailyBazi.month.stem], ELEMENT_MAPPING[dailyBazi.month.branch],
    ELEMENT_MAPPING[dailyBazi.day.stem], ELEMENT_MAPPING[dailyBazi.day.branch]
  ];
  
  dailyElements.forEach(element => {
    if (elements[element] !== undefined) {
      elements[element] += 0.5; // 당일 오행은 가중치 낮게
    }
  });
  
  return elements;
}

// 용신/희신/기신/구신 분석
function analyzeTenGods(userBazi, dailyBazi) {
  if (!userBazi) return null;
  
  const dayStem = userBazi.day.stem;
  const dayElement = ELEMENT_MAPPING[dayStem];
  
  const tenGods = {
    yongshin: [], // 용신 (도움되는 오행)
    heeshin: [],  // 희신 (좋은 오행)
    gishin: [],   // 기신 (나쁜 오행)
    gushin: []    // 구신 (가장 나쁜 오행)
  };
  
  // 오행 관계에 따른 십신 분류
  Object.keys(ELEMENT_MAPPING).forEach(stem => {
    const element = ELEMENT_MAPPING[stem];
    const relation = getElementRelation(dayElement, element);
    
    if (relation === 'generation') {
      tenGods.yongshin.push(element);
    } else if (relation === 'conflict') {
      tenGods.gishin.push(element);
    } else if (element === dayElement) {
      tenGods.heeshin.push(element);
    } else {
      tenGods.gushin.push(element);
    }
  });
  
  return tenGods;
}

// 오행 관계 확인
function getElementRelation(dayElement, targetElement) {
  if (ELEMENT_RELATIONS.generation[dayElement] === targetElement) {
    return 'generation';
  } else if (ELEMENT_RELATIONS.conflict[dayElement] === targetElement) {
    return 'conflict';
  }
  return 'neutral';
}

// 날짜별 운세 분석
function analyzeDailyFortune(dayIndex, userBazi) {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + dayIndex);
  
  const dailyBazi = calculateDailyStemsBranches(targetDate);
  const elementStrength = calculateElementStrength(userBazi, dailyBazi);
  const tenGods = analyzeTenGods(userBazi, dailyBazi);
  
  // 운세 점수 계산
  let score = 50; // 기본 점수
  
  if (tenGods) {
    // 용신 오행이 강하면 점수 상승
    tenGods.yongshin.forEach(element => {
      score += elementStrength[element] * 2;
    });
    
    // 희신 오행이 강하면 점수 상승
    tenGods.heeshin.forEach(element => {
      score += elementStrength[element] * 1;
    });
    
    // 기신 오행이 강하면 점수 하락
    tenGods.gishin.forEach(element => {
      score -= elementStrength[element] * 2;
    });
    
    // 구신 오행이 강하면 점수 하락
    tenGods.gushin.forEach(element => {
      score -= elementStrength[element] * 3;
    });
  }
  
  // 점수를 0-100 범위로 제한
  score = Math.max(0, Math.min(100, score));
  
  // 운세 텍스트 생성
  const fortuneText = generateFortuneText(score, elementStrength, tenGods, dayIndex);
  
  // 행운 색상과 숫자 계산
  const luckyColor = calculateLuckyColor(elementStrength);
  const luckyNumber = calculateLuckyNumber(elementStrength);
  
  return {
    score: Math.round(score),
    text: fortuneText,
    luckyColor: luckyColor,
    luckyNumber: luckyNumber,
    elementStrength: elementStrength,
    tenGods: tenGods
  };
}

// 운세 텍스트 생성
function generateFortuneText(score, elementStrength, tenGods, dayIndex) {
  const dayNames = ['오늘', '내일', '3일차', '4일차', '5일차', '6일차', '7일차'];
  const dayName = dayNames[dayIndex];
  
  let text = `${dayName}은 `;
  
  if (score >= 80) {
    text += "매우 좋은 날입니다. 중요한 결정이나 새로운 시작에 적합합니다.";
  } else if (score >= 60) {
    text += "좋은 날입니다. 계획한 일들을 진행하기에 좋습니다.";
  } else if (score >= 40) {
    text += "보통의 날입니다. 신중한 판단이 필요합니다.";
  } else if (score >= 20) {
    text += "주의가 필요한 날입니다. 큰 결정은 피하세요.";
  } else {
    text += "어려운 날입니다. 휴식을 취하고 내일을 준비하세요.";
  }
  
  // 오행별 조언 추가
  const maxElement = Object.keys(elementStrength).reduce((a, b) => 
    elementStrength[a] > elementStrength[b] ? a : b
  );
  
  const elementAdvice = {
    '木': "창의적 활동이나 새로운 아이디어에 집중하세요.",
    '火': "에너지가 넘치는 날입니다. 적극적인 행동이 필요합니다.",
    '土': "안정과 균형을 추구하세요. 기다림의 미덕이 중요합니다.",
    '金': "정리정돈과 계획 수립에 좋은 날입니다.",
    '水': "직감과 영감이 중요한 날입니다. 깊이 생각해보세요."
  };
  
  text += ` ${elementAdvice[maxElement]}`;
  
  return text;
}

// 행운 색상 계산
function calculateLuckyColor(elementStrength) {
  const maxElement = Object.keys(elementStrength).reduce((a, b) => 
    elementStrength[a] > elementStrength[b] ? a : b
  );
  
  const colorMap = {
    '木': '초록색',
    '火': '빨간색',
    '土': '노란색',
    '金': '흰색',
    '水': '파란색'
  };
  
  return colorMap[maxElement] || '보라색';
}

// 행운 숫자 계산
function calculateLuckyNumber(elementStrength) {
  const maxElement = Object.keys(elementStrength).reduce((a, b) => 
    elementStrength[a] > elementStrength[b] ? a : b
  );
  
  const numberMap = {
    '木': [3, 8],
    '火': [2, 7],
    '土': [5, 0],
    '金': [4, 9],
    '水': [1, 6]
  };
  
  const numbers = numberMap[maxElement] || [1, 2, 3];
  return numbers[Math.floor(Math.random() * numbers.length)];
}

// Today 섹션 표시
function showTodaySection() {
  hideAllSections();
  document.getElementById('today').style.display = 'block';
  document.body.setAttribute('data-section', 'today');
  
  // 7일간의 날짜 설정
  setWeekDates();
  
  // 명리학 분석 데이터 로드
  loadTodayAnalysis();
}

// 7일간의 날짜 설정
function setWeekDates() {
  const today = new Date();
  const dayCards = document.querySelectorAll('.day-card');
  
  dayCards.forEach((card, index) => {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + index);
    
    const dateElement = card.querySelector('.day-date');
    const month = targetDate.getMonth() + 1;
    const date = targetDate.getDate();
    const day = ['일', '월', '화', '수', '목', '금', '토'][targetDate.getDay()];
    
    dateElement.textContent = `${month}/${date} (${day})`;
  });
}

// 명리학 분석 데이터 로드
function loadTodayAnalysis() {
  const userBazi = getUserBaziProfile();
  
  if (userBazi) {
    // 사용자 명리학 정보가 있는 경우
    for (let i = 0; i < 7; i++) {
      const analysis = analyzeDailyFortune(i, userBazi);
      updateDayCard(i, analysis);
    }
  } else {
    // 명리학 정보가 없는 경우 기본 분석
    showDefaultTodayAnalysis();
  }
}

// 일별 카드 업데이트
function updateDayCard(dayIndex, analysis) {
  const dayCard = document.querySelector(`[data-day="${dayIndex}"]`);
  const analysisText = dayCard.querySelector('.analysis-text');
  const luckyColor = dayCard.querySelector('.lucky-color');
  const luckyNumber = dayCard.querySelector('.lucky-number');
  const elements = dayCard.querySelectorAll('.element');
  
  // 분석 텍스트 업데이트
  analysisText.textContent = analysis.text;
  luckyColor.textContent = `행운의 색: ${analysis.luckyColor}`;
  luckyNumber.textContent = `행운의 숫자: ${analysis.luckyNumber}`;
  
  // 오행 바 업데이트
  const elementNames = ['木', '火', '土', '金', '水'];
  elements.forEach((element, index) => {
    const elementName = elementNames[index];
    const strength = analysis.elementStrength[elementName] / 8; // 정규화
    element.style.opacity = Math.max(0.3, strength);
    element.style.transform = `scaleY(${Math.max(0.3, strength)})`;
  });
  
  // 운세 점수에 따른 카드 색상 변경
  if (analysis.score >= 80) {
    dayCard.style.borderColor = 'rgba(76, 175, 80, 0.6)';
  } else if (analysis.score >= 60) {
    dayCard.style.borderColor = 'rgba(33, 150, 243, 0.6)';
  } else if (analysis.score >= 40) {
    dayCard.style.borderColor = 'rgba(255, 193, 7, 0.6)';
  } else if (analysis.score >= 20) {
    dayCard.style.borderColor = 'rgba(255, 152, 0, 0.6)';
  } else {
    dayCard.style.borderColor = 'rgba(244, 67, 54, 0.6)';
  }
}

// 기본 분석 데이터 표시
function showDefaultTodayAnalysis() {
  for (let i = 0; i < 7; i++) {
    const analysis = analyzeDailyFortune(i, null);
    updateDayCard(i, analysis);
  }
}

// 기존 함수들 유지
function hideAllSections() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.style.display = 'none';
  });
}

function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const content = dropdown.querySelector('.dropdown-content');
  content.style.display = content.style.display === 'block' ? 'none' : 'block';
}

// 메뉴 클릭 이벤트
document.addEventListener('DOMContentLoaded', function() {
  const todayLinks = document.querySelectorAll('a[data-section="today"]');
  todayLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      showTodaySection();
    });
  });
});
