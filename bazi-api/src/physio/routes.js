// 관상학 API 라우터 (JavaScript 버전)

const express = require('express');
const router = express.Router();

// LRU 캐시 설정 (10분 TTL)
const { LRUCache } = require('lru-cache');
const cache = new LRUCache({
  max: 100,
  ttl: 1000 * 60 * 10, // 10분
  updateAgeOnGet: true
});

// 간단한 관상학 분석 함수 (임시)
function analyzePhysiognomy(input) {
  const { frontalImageBase64, profileImageBase64, goal = 'career', lang = 'ko' } = input;
  
  // 이미지 품질 평가 (임시)
  const quality = {
    frontalScore: 0.85 + Math.random() * 0.1,
    profileScore: 0.80 + Math.random() * 0.1,
    issues: []
  };
  
  // 얼굴 비율 추출 (임시)
  const ratios = {
    faceThirds: {
      upper: 0.32 + Math.random() * 0.06,
      middle: 0.33 + Math.random() * 0.06,
      lower: 0.34 + Math.random() * 0.06
    },
    eyeSpacing: 0.9 + Math.random() * 0.2,
    eyeCornerAngle: (Math.random() - 0.5) * 20,
    nasalStraightness: 0.7 + Math.random() * 0.3,
    nasalProjection: 0.6 + Math.random() * 0.3,
    philtrumToUpperLip: 1.0 + Math.random() * 0.5,
    lipCornerSlope: (Math.random() - 0.5) * 10,
    chinProjection: 0.6 + Math.random() * 0.3,
    jawAngle: 120 + Math.random() * 20,
    jawWidthToCheek: 0.9 + Math.random() * 0.2,
    asymmetry: Math.random() * 0.15
  };
  
  // 관상학 분석 수행
  const analysis = performPhysioAnalysis(ratios);
  
  // 요약 생성
  const summary = generateSummary(analysis, lang);
  
  // 리포트 생성
  const reportMarkdown = generateReport(analysis, goal, lang);
  
  return {
    quality,
    ratios,
    summary,
    reportMarkdown
  };
}

// 관상학 분석 수행
function performPhysioAnalysis(ratios) {
  const { faceThirds, eyeSpacing, nasalStraightness, philtrumToUpperLip, chinProjection, asymmetry } = ratios;
  
  const forehead = analyzeForehead(ratios);
  const eyes = analyzeEyes(ratios);
  const nose = analyzeNose(ratios);
  const mouth = analyzeMouth(ratios);
  const jaw = analyzeJaw(ratios);
  const asymmetryAnalysis = analyzeAsymmetry(ratios);
  
  return {
    forehead,
    eyes,
    nose,
    mouth,
    jaw,
    asymmetry: asymmetryAnalysis
  };
}

// 이마 분석
function analyzeForehead(ratios) {
  const { upper, middle, lower } = ratios.faceThirds;
  const total = upper + middle + lower;
  
  const upperRatio = upper / total;
  const middleRatio = middle / total;
  const lowerRatio = lower / total;
  
  let coaching = '';
  if (upperRatio > 0.4) {
    coaching = '당신의 이마는 마치 천문학자가 별을 관찰하듯이 깊이 있는 사고와 철저한 기획을 선호하는 특징을 보여줍니다. 마치 건축가가 청사진을 그리듯이 체계적으로 접근하는 스타일로, 이는 당신만의 독특한 강점입니다. 작은 목표부터 시작하여 이 뛰어난 계획 능력을 실행력과 조화롭게 연결해보세요.';
  } else if (upperRatio < 0.25) {
    coaching = '당신의 이마는 현장에서 문제를 해결하는 엔지니어처럼 즉흥적이고 실용적인 접근을 선호하는 특징을 나타냅니다. 마치 예술가가 순간의 영감을 포착하듯이 직관적인 해결책을 찾아내는 능력이 뛰어납니다. 장기적 관점에서의 계획 수립 연습을 통해 이 즉흥성을 더욱 빛나게 해보세요.';
  } else {
    coaching = '당신의 이마는 마치 교향악단의 지휘자처럼 사고와 실행의 완벽한 조화를 이루고 있습니다. 계획과 즉흥, 논리와 직감이 균형을 이루어 어떤 상황에서도 유연하게 대처할 수 있는 능력을 가지고 있습니다. 이 균형감을 유지하면서 더욱 깊이 있는 발전을 이어가보세요.';
  }
  
  return {
    balanced: Math.abs(upperRatio - 0.33) < 0.05,
    ratio: upperRatio,
    coaching
  };
}

// 눈 분석
function analyzeEyes(ratios) {
  const { eyeSpacing } = ratios;
  
  let coaching = '';
  if (eyeSpacing < 0.8) {
    coaching = '당신의 눈은 마치 현미경으로 미세한 세부사항을 관찰하는 과학자처럼 정밀한 집중력을 가지고 있습니다. 마치 보석 세공인이 다이아몬드의 각 면을 세심하게 다듬듯이 완벽함을 추구하는 성향이 있습니다. 전체적인 맥락을 파악하는 연습을 통해 이 뛰어난 세밀함을 더욱 빛나게 해보세요.';
  } else if (eyeSpacing > 1.2) {
    coaching = '당신의 눈은 마치 망원경으로 광활한 우주를 바라보는 천문학자처럼 넓은 시야와 포용력을 가지고 있습니다. 마치 조감도로 도시 전체를 한눈에 보듯이 전체적인 관점을 잘 파악하는 능력이 뛰어납니다. 세부사항 관리 능력을 향상시켜 이 넓은 시야를 더욱 완성도 있게 만들어보세요.';
  } else {
    coaching = '당신의 눈은 마치 카메라 렌즈가 자동으로 초점을 맞추듯이 균형잡힌 시야로 다양한 관점을 고려합니다. 마치 다재다능한 예술가가 여러 장르를 조화롭게 표현하듯이 유연한 관찰력을 가지고 있습니다. 이 균형감을 유지하면서 더욱 깊이 있는 분석 능력을 키워보세요.';
  }
  
  return {
    type: eyeSpacing < 0.8 ? 'narrow' : eyeSpacing > 1.2 ? 'wide' : 'balanced',
    ratio: eyeSpacing,
    coaching
  };
}

// 코 분석
function analyzeNose(ratios) {
  const { nasalStraightness } = ratios;
  
  let coaching = '';
  if (nasalStraightness > 0.9) {
    coaching = '당신의 코는 마치 수학자가 정확한 공식을 세우듯이 직선적이고 논리적인 사고를 선호하는 특징을 보여줍니다. 마치 건축가가 수직선을 그어 완벽한 대칭을 이루듯이 체계적인 판단력을 가지고 있습니다. 때로는 유연한 접근으로 창의성을 발휘하여 이 뛰어난 논리성을 더욱 빛나게 해보세요.';
  } else if (nasalStraightness < 0.6) {
    coaching = '당신의 코는 마치 예술가가 자유로운 곡선을 그리듯이 창의적이고 유연한 사고를 가지고 있습니다. 마치 음악가가 즉흥적으로 멜로디를 만들어내듯이 직감적인 판단 스타일을 선호합니다. 체계적인 접근을 통해 안정성을 높여 이 창의성을 더욱 완성도 있게 만들어보세요.';
  } else {
    coaching = '당신의 코는 마치 조화로운 교향곡처럼 논리와 창의성을 조화롭게 활용하는 균형잡힌 사고를 가지고 있습니다. 마치 다재다능한 디자이너가 기능성과 미학을 동시에 고려하듯이 유연하면서도 체계적인 판단력을 발휘합니다. 이 균형감을 유지하면서 더욱 깊이 있는 발전을 이어가보세요.';
  }
  
  return {
    type: nasalStraightness > 0.9 ? 'straight' : nasalStraightness < 0.6 ? 'curved' : 'moderate',
    score: nasalStraightness,
    coaching
  };
}

// 입 분석
function analyzeMouth(ratios) {
  const { philtrumToUpperLip } = ratios;
  
  let coaching = '';
  if (philtrumToUpperLip > 1.5) {
    coaching = '당신의 입은 마치 철학자가 깊이 있는 사색을 하듯이 신중하고 의미 있는 소통을 선호하는 특징을 보여줍니다. 마치 시인이 한 줄의 시를 완성하기 위해 오랜 시간을 들이듯이 깊이 있는 대화를 통해 진정한 이해를 추구합니다. 간결하고 명확한 표현 연습을 통해 이 뛰어난 깊이를 더욱 효율적으로 전달해보세요.';
  } else if (philtrumToUpperLip < 0.8) {
    coaching = '당신의 입은 마치 즉흥 연주하는 재즈 뮤지션처럼 직관적이고 생동감 있는 소통을 선호합니다. 마치 친구와 편안하게 대화하듯이 자연스럽고 즉각적인 표현으로 상대방과의 거리를 좁히는 능력이 뛰어납니다. 깊이 있는 대화를 통해 이 매력적인 즉흥성을 더욱 의미 있게 만들어보세요.';
  } else {
    coaching = '당신의 입은 마치 다재다능한 통역가처럼 다양한 상황에 맞춰 유연하게 소통하는 균형잡힌 스타일을 가지고 있습니다. 마치 경험 많은 교사가 학생의 수준에 맞춰 설명하듯이 상대방을 이해하고 적절한 소통 방식을 선택합니다. 이 균형감을 유지하면서 더욱 효과적인 소통 능력을 향상시켜보세요.';
  }
  
  return {
    type: philtrumToUpperLip > 1.5 ? 'long' : philtrumToUpperLip < 0.8 ? 'short' : 'balanced',
    ratio: philtrumToUpperLip,
    coaching
  };
}

// 턱 분석
function analyzeJaw(ratios) {
  const { chinProjection } = ratios;
  
  let coaching = '';
  if (chinProjection > 0.8) {
    coaching = '당신의 턱은 마치 산을 뚫는 터널 공사처럼 강한 의지와 확고한 실행력을 가지고 있습니다. 마치 올림픽 선수가 목표를 향해 끊임없이 달리듯이 한번 정한 목표를 반드시 달성하는 끈기를 보여줍니다. 때로는 유연성을 기르는 연습을 통해 이 뛰어난 의지력을 더욱 지혜롭게 활용해보세요.';
  } else if (chinProjection < 0.4) {
    coaching = '당신의 턱은 마치 물이 흐르는 강물처럼 유연하고 적응력이 뛰어납니다. 마치 춤추는 발레리나가 음악에 맞춰 자연스럽게 움직이듯이 변화하는 상황에 유연하게 대처하는 능력이 있습니다. 목표 의식과 끈기를 기르는 연습을 통해 이 매력적인 유연성을 더욱 방향성 있게 만들어보세요.';
  } else {
    coaching = '당신의 턱은 마치 경험 많은 선장이 바다를 항해하듯이 균형잡힌 의지로 적절한 실행력을 발휘합니다. 마치 조화로운 교향곡처럼 강함과 유연함이 조화를 이루어 어떤 상황에서도 안정적으로 목표를 향해 나아갑니다. 이 균형감을 유지하면서 더욱 지속 가능한 발전을 이어가보세요.';
  }
  
  return {
    type: chinProjection > 0.8 ? 'strong' : chinProjection < 0.4 ? 'weak' : 'moderate',
    projection: chinProjection,
    coaching
  };
}

// 비대칭 분석
function analyzeAsymmetry(ratios) {
  const { asymmetry } = ratios;
  
  let coaching = '';
  if (asymmetry < 0.05) {
    coaching = '당신의 얼굴은 마치 고대 그리스의 완벽한 조각상처럼 좌우 균형이 조화롭게 맞춰져 있어 안정적이고 신뢰감 있는 성격을 나타냅니다. 마치 교향악단의 완벽한 하모니처럼 일관성 있고 예측 가능한 행동 패턴을 가지고 있습니다. 이 균형감을 유지하면서 더욱 깊이 있는 발전을 이어가보세요.';
  } else if (asymmetry < 0.1) {
    coaching = '당신의 얼굴은 마치 독특한 예술 작품처럼 약간의 비대칭으로 개성 있고 매력적인 특징을 가지고 있습니다. 마치 재즈 음악의 즉흥적인 멜로디처럼 예측할 수 없는 창의적인 아이디어를 만들어내는 능력이 있습니다. 이 독특한 개성을 활용하여 더욱 창의적인 영역을 개척해보세요.';
  } else {
    coaching = '당신의 얼굴은 마치 현대 미술의 추상화처럼 뚜렷한 개성으로 독창적이고 혁신적인 사고를 가지고 있습니다. 마치 아방가르드 예술가가 기존의 틀을 깨고 새로운 경지를 개척하듯이 남다른 관점과 창의성을 발휘합니다. 때로는 균형을 맞추는 연습을 통해 이 뛰어난 창의성을 더욱 안정적으로 활용해보세요.';
  }
  
  return {
    level: asymmetry,
    type: asymmetry < 0.05 ? 'balanced' : asymmetry < 0.1 ? 'slight' : 'noticeable',
    coaching
  };
}

// 요약 생성
function generateSummary(analysis, lang) {
  const keyFeatures = [];
  if (analysis.forehead.balanced) keyFeatures.push('균형잡힌 이마');
  if (analysis.eyes.type === 'balanced') keyFeatures.push('균형잡힌 눈 간격');
  if (analysis.nose.type === 'straight') keyFeatures.push('직선적 코');
  if (analysis.mouth.type === 'balanced') keyFeatures.push('균형잡힌 입');
  if (analysis.jaw.type === 'moderate') keyFeatures.push('적당한 턱');
  
  return `관상학 전문 분석 리포트 주요 특징: ${keyFeatures.join(', ')}`;
}

// 리포트 생성
function generateReport(analysis, goal, lang) {
  // 데이터 라벨링 함수
  function getLabel(value, type) {
    if (!value) return 'N/A';
    
    switch(type) {
      case 'eyeSpacing':
        return value < 0.95 ? '좁음' : value > 1.05 ? '넓음' : '보통';
      case 'canthusTilt':
        return value < 0 ? '하향' : value > 2 ? '상향' : '수평';
      case 'philtrumToUpperLip':
        return value < 1.0 ? '짧음' : value > 1.4 ? '김' : '보통';
      case 'nasolabialAngle':
        return value < 95 ? '예각' : value > 105 ? '둔각' : '중간';
      case 'mandibularAngle':
        return value < 120 ? '각진' : value > 130 ? '완만' : '보통';
      case 'asymmetry':
        return value < 0.05 ? '매우 낮음' : value > 0.1 ? '높음' : '낮음';
      default:
        return value.toFixed(2);
    }
  }

  // 아키타입 생성
  function generateArchetype(ratios) {
    const eyeTilt = ratios.canthusTilt || 0;
    const noseStraight = ratios.nasalStraightness || 0;
    const jawAngle = ratios.mandibularAngle || 0;
    const eyeSpacing = ratios.eyeSpacing || 1;
    const lipSlope = ratios.lipCornerSlope || 0;
    const asymmetry = ratios.asymmetry || 0;

    if (eyeTilt > 2 && noseStraight > 0.8 && jawAngle < 120) return '개척자 🚀';
    if (Math.abs(eyeTilt) <= 2 && lipSlope > 0 && asymmetry < 0.05) return '조율가 🎛️';
    if (eyeTilt < 0 && (ratios.philtrumToUpperLip || 0) > 1.4 && jawAngle > 130) return '사색가 📚';
    if (eyeTilt > 2 && noseStraight > 0.8) return '전략가 🎯';
    if (eyeSpacing > 1.05 && asymmetry > 0.1) return '혁신가 💡';
    if (lipSlope > 0 && jawAngle < 120) return '리더 🏆';
    if (eyeTilt < 0 && noseStraight < 0.6) return '예술가 🎨';
    return '균형자 ⚖️';
  }

  // Top 3 강조축 찾기
  function getTopFeatures(ratios) {
    const features = [
      { name: '눈꼬리', value: Math.abs(ratios.canthusTilt || 0), label: getLabel(ratios.canthusTilt, 'canthusTilt') },
      { name: '코 라인', value: Math.abs((ratios.nasalStraightness || 0.5) - 0.5), label: ratios.nasalStraightness > 0.8 ? '직선적' : '곡선적' },
      { name: '턱 각도', value: Math.abs((ratios.mandibularAngle || 125) - 125), label: getLabel(ratios.mandibularAngle, 'mandibularAngle') },
      { name: '눈 간격', value: Math.abs((ratios.eyeSpacing || 1) - 1), label: getLabel(ratios.eyeSpacing, 'eyeSpacing') },
      { name: '인중 길이', value: Math.abs((ratios.philtrumToUpperLip || 1.2) - 1.2), label: getLabel(ratios.philtrumToUpperLip, 'philtrumToUpperLip') },
      { name: '비대칭', value: ratios.asymmetry || 0, label: getLabel(ratios.asymmetry, 'asymmetry') }
    ];
    
    return features.sort((a, b) => b.value - a.value).slice(0, 3);
  }

  const quality = analysis.quality || { frontalScore: 0.9, profileScore: 0.9, issues: [] };
  const ratios = analysis.ratios || {};
  const topFeatures = getTopFeatures(ratios);
  const archetype = generateArchetype(ratios);

  // 목표별 코칭 템플릿
  const goalTemplates = {
    career: {
      title: '일·사업',
      tips: [
        '매일 아침 10분 목표 시각화로 하루의 방향성 확립하기',
        '주간 단위로 성과를 측정하고 피드백 루틴 만들기',
        '업무 환경에서 자신만의 리듬과 패턴 발견하기',
        '동료와의 협업 시 상호 보완점을 적극 활용하기',
        '스트레스 상황에서도 일관된 성과를 유지하는 시스템 구축하기',
        '장기적 비전과 단기적 목표의 조화점 찾기'
      ]
    },
    finance: {
      title: '재정',
      tips: [
        '월별 수입·지출 패턴을 분석하여 예측 가능한 재정 계획 세우기',
        '투자 결정 시 감정보다 데이터 기반 판단 우선하기',
        '비상금과 투자금의 적절한 비율로 안정성 확보하기',
        '소비 습관을 기록하고 개선점을 지속적으로 모니터링하기',
        '수익 창출 기회를 체계적으로 발굴하고 실행력 키우기',
        '재정 목표 달성을 위한 단계별 마일스톤 설정하기'
      ]
    },
    relationship: {
      title: '인간관계',
      tips: [
        '대화 시 상대방의 관점을 먼저 이해하는 경청 기술 연마하기',
        '감정 표현과 소통 스타일을 상황에 맞게 조절하는 유연성 기르기',
        '관계에서 상호 성장할 수 있는 기회를 적극 창출하기',
        '갈등 상황에서도 건설적 해결책을 찾는 창의적 사고 훈련하기',
        '다양한 배경의 사람들과의 교류를 통해 시야 확장하기',
        '관계의 질을 높이는 소통 패턴을 일상에 적용하기'
      ]
    },
    health: {
      title: '건강·리듬',
      tips: [
        '개인 맞춤형 운동 루틴을 일상에 자연스럽게 통합하기',
        '스트레스 관리와 휴식의 조화를 유지하는 생활 패턴 만들기',
        '영양 섭취와 수면의 질을 지속적으로 모니터링하기',
        '정신적 건강을 위한 자기 돌봄 활동을 정기적으로 실천하기',
        '신체적 한계를 인정하고 지속 가능한 건강 관리 계획 세우기',
        '건강한 습관 형성을 위한 환경 조성과 동기 부여 시스템 구축하기'
      ]
    }
  };
  
  const goalTemplate = goalTemplates[goal] || goalTemplates.career;

  // 품질 경고 생성
  let qualityWarning = '';
  if (quality.frontalScore < 0.8 || quality.profileScore < 0.8 || quality.issues.length > 0) {
    qualityWarning = `
> 📸 **촬영 가이드**
> - 정면: 눈코입이 수평, 기울기 < 15°, 가림 없음, 해상도 ≥ 720px, 균일 조명
> - 측면: 코끝·턱끝·귓바퀴가 프레임 내, 배경 단색, 그림자 최소화
> - 카메라 높이: 눈높이, 팔 길이 50~60cm, 기본 표정(무표정)
`;
  }

  return `# 관상학 전문 분석 리포트

## 요약
**${archetype}** - ${topFeatures[0].name}이 ${topFeatures[0].label}한 특징으로 ${goalTemplate.title}에서 독특한 강점을 발휘합니다. 오늘부터 ${goalTemplate.tips[0].split(' ').slice(0, 3).join(' ')} 루틴을 시작해보세요.

${qualityWarning}
## 핵심 지표 한눈에 보기
| 항목 | 측정/라벨 | 의미 한 줄 | 코칭 한 줄 |
|---|---|---|---|
| 이마 3분할 | ${ratios.faceThirds?.upper?.toFixed(2) || 'N/A'}/${ratios.faceThirds?.middle?.toFixed(2) || 'N/A'}/${ratios.faceThirds?.lower?.toFixed(2) || 'N/A'} | 사고·감정·행동의 균형점 | ${ratios.faceThirds?.upper > 0.35 ? '계획 수립 시간을 늘려보세요' : '즉시 실행하는 습관을 기르세요'} |
| 눈 간격/꼬리 | ${getLabel(ratios.eyeSpacing, 'eyeSpacing')}/${getLabel(ratios.canthusTilt, 'canthusTilt')} | 관찰력과 집중력의 방향성 | ${ratios.canthusTilt > 2 ? '목표 지향적 접근이 강점입니다' : '세부사항에 주목하는 능력을 활용하세요'} |
| 코 라인 | ${ratios.nasalStraightness?.toFixed(2) || 'N/A'}/${getLabel(ratios.nasolabialAngle, 'nasolabialAngle')} | 직감과 판단력의 조화 | ${ratios.nasalStraightness > 0.8 ? '직감을 신뢰하되 데이터로 검증하세요' : '체계적 분석 과정을 거쳐 결정하세요'} |
| 입/인중 | ${getLabel(ratios.philtrumToUpperLip, 'philtrumToUpperLip')}/${ratios.lipRatio?.toFixed(2) || 'N/A'}/${ratios.lipCornerSlope > 0 ? '상향' : '하향'} | 소통 스타일과 감정 표현 | ${ratios.philtrumToUpperLip > 1.4 ? '깊이 있는 대화를 선호하는 경향' : '효율적 소통을 추구하는 스타일'} |
| 턱/하악 | ${getLabel(ratios.mandibularAngle, 'mandibularAngle')}/${ratios.chinProjection?.toFixed(2) || 'N/A'}/${ratios.jawWidthToCheek?.toFixed(2) || 'N/A'} | 실행력과 회복력의 강도 | ${ratios.mandibularAngle < 120 ? '강한 실행력이 특징입니다' : '유연한 적응력을 활용하세요'} |
| 비대칭 | ${getLabel(ratios.asymmetry, 'asymmetry')} | 개성과 창의성의 표현 | ${ratios.asymmetry > 0.1 ? '독특한 관점이 강점입니다' : '균형 잡힌 접근이 특징입니다'} |

## 해석 — 부위별 스토리

### 이마(사고·기획)
${ratios.faceThirds?.upper > 0.35 ? '이마가 넓어 사고와 기획에 많은 에너지를 투자하는 경향이 있습니다. 마치 건축가가 청사진을 그리듯 체계적으로 접근하는 스타일입니다.' : '실용적이고 즉흥적인 사고 방식을 가지고 있습니다. 현장에서 문제를 해결하는 엔지니어 같은 접근법이 강점입니다.'} 

**오늘부터 할 일 3개:**
- 아침 10분 목표 시각화 시간 만들기
- 주간 계획을 3단계로 나누어 실행하기
- 아이디어를 즉시 메모하는 습관 기르기

### 눈(관계·집중)
${ratios.canthusTilt > 2 ? '상향된 눈꼬리가 목표 지향적이고 야망 있는 성격을 나타냅니다. 독수리가 먹이를 노리듯 집중력이 뛰어납니다.' : ratios.canthusTilt < 0 ? '하향된 눈꼬리가 신중하고 사색적인 성향을 보여줍니다. 깊이 있는 관찰력을 가지고 있습니다.' : '균형 잡힌 눈꼬리가 객관적이고 공정한 판단력을 나타냅니다.'}

**오늘부터 할 일 3개:**
- 대화 시 상대방 눈을 바라보는 연습
- 집중력 향상을 위한 25분 작업 루틴
- 주변 환경의 세부사항 관찰하기

### 코(결단·집중력/재정 습관)
${ratios.nasalStraightness > 0.8 ? '직선적인 코 라인이 논리적이고 체계적인 판단력을 나타냅니다. 재정 관리에서도 체계적인 접근을 선호합니다.' : '곡선적인 코 라인이 직감적이고 유연한 판단 스타일을 보여줍니다. 상황에 따라 적응하는 능력이 뛰어납니다.'}

**오늘부터 할 일 3개:**
- 의사결정 전 3초 생각하는 습관
- 월별 재정 계획 수립하기
- 직감과 데이터를 조합한 판단 연습

### 입(소통·감정 표현)
${ratios.lipCornerSlope > 0 ? '상향된 입꼬리가 긍정적이고 낙관적인 성격을 나타냅니다. 대화할 때 상대방을 기쁘게 하는 능력이 있습니다.' : '하향된 입꼬리가 신중하고 진지한 소통 스타일을 보여줍니다. 깊이 있는 대화를 선호합니다.'}

**오늘부터 할 일 3개:**
- 감정 표현을 위한 "나는 ~라고 느껴" 연습
- 적극적 경청을 위한 질문 기술 향상
- 긍정적 피드백을 주는 습관 기르기

### 턱/턱선(실행·회복력)
${ratios.mandibularAngle < 120 ? '각진 턱이 강한 의지와 실행력을 나타냅니다. 도전적인 목표를 달성하는 능력이 뛰어납니다.' : '완만한 턱선이 유연하고 적응력 있는 성격을 보여줍니다. 변화하는 상황에 잘 대처합니다.'}

**오늘부터 할 일 3개:**
- 목표 달성을 위한 단계별 실행 계획
- 스트레스 상황에서의 회복 루틴 만들기
- 지속 가능한 에너지 관리 연습

### 좌우 비대칭(개성·회복전략)
${ratios.asymmetry > 0.1 ? '비대칭이 독특한 개성과 창의성을 나타냅니다. 남다른 관점으로 문제를 해결하는 능력이 있습니다.' : '대칭성이 균형 잡힌 성격을 보여줍니다. 안정적이고 일관된 접근을 선호합니다.'}

**오늘부터 할 일 3개:**
- 독창적 아이디어를 기록하는 습관
- 다양한 관점에서 문제 바라보기
- 개성 있는 표현 방법 찾기

## 분야별 코칭

### ${goalTemplate.title}
${goalTemplate.tips.map(tip => `- ${tip}`).join('\n')}

## 30일 퀘스트(게임화)

### 아침 미션(5분) 3개
- **미션 1**: 침대에서 일어나자마자 "오늘의 승리" 3가지 상상하기
- **미션 2**: 거울 보며 자신에게 "넌 할 수 있어!" 3번 말하기  
- **미션 3**: 창밖을 30초 바라보며 감사한 일 1가지 찾기

### 낮 미션(5분) 3개
- **미션 1**: 점심 후 5분 산책하며 주변 소리 듣기
- **미션 2**: 오후 3시에 목·어깨 스트레칭 5분
- **미션 3**: 업무 중간에 "지금 이 순간" 집중하기

### 저녁 미션(10분) 3개
- **미션 1**: 하루를 3줄로 요약하는 일기 쓰기
- **미션 2**: 내일을 위한 "작은 승리" 1가지 계획하기
- **미션 3**: 감사한 사람에게 마음으로 인사하기

### 보너스: "만약 ~라면(IF-THEN) 카드" 3개
- **카드 1**: 회의 중 목소리가 떨리면 → 메모 한 줄 읽고 시작
- **카드 2**: 스트레스가 밀려오면 → 심호흡 3번 후 10초 침묵
- **카드 3**: 의사결정이 막막하면 → 3가지 옵션을 적어보기

## 사이드바
**한 줄 슬로건**: "매일 조금씩, 나만의 방식으로"  
**금주 파워 키워드**: ${['집중', '균형', '실행'].join(' · ')}  
**피해야 할 함정**: 완벽주의, 즉흥적 판단  
**시그니처 제스처**: 자신감 있는 미소와 함께 고개 끄덕이기

## 품질과 한계
이 분석은 제공된 사진의 품질과 각도에 따라 정확도가 달라질 수 있습니다. 더 정확한 결과를 위해 고품질의 정면·측면 사진을 사용하시기 바랍니다.

**중요**: 이 리포트는 관상학적 특징을 바탕으로 한 개인 맞춤형 코칭 자료입니다. 민감한 개인정보 추정이나 의료 진단이 아니며, 참고 자료로 활용하시기 바랍니다.

---
*당신의 독특한 특징들이 만들어내는 특별한 이야기, 이제 그 이야기의 주인공이 되어보세요!* ✨`;
}

// 캐시 키 생성
function generateCacheKey(input) {
  const crypto = require('crypto');
  const { frontalImageBase64, profileImageBase64, goal, lang } = input;
  const hash = crypto.createHash('md5');
  hash.update(frontalImageBase64.substring(0, 1000));
  hash.update(profileImageBase64.substring(0, 1000));
  hash.update(goal || '');
  hash.update(lang || 'ko');
  return `physio:${hash.digest('hex')}`;
}

// 관상학 분석 API
router.post('/analyze', async (req, res) => {
  try {
    console.log('🔍 관상학 분석 요청 받음');
    
    const input = req.body;
    
    // 기본 검증
    if (!input.frontalImageBase64 || !input.profileImageBase64) {
      return res.status(400).json({
        success: false,
        error: 'invalid_input',
        message: '정면과 측면 이미지가 모두 필요합니다'
      });
    }
    
    console.log('✅ 입력 데이터 검증 완료');
    
    // 캐시 확인
    const cacheKey = generateCacheKey(input);
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log('✅ 캐시된 결과 반환');
      return res.json({
        success: true,
        result: cachedResult,
        message: '관상학 분석이 완료되었습니다 (캐시)'
      });
    }
    
    // 관상학 분석 수행
    console.log('🔄 관상학 분석 시작');
    const result = analyzePhysiognomy(input);
    
    // 캐시에 저장
    cache.set(cacheKey, result);
    console.log('✅ 분석 완료 및 캐시 저장');
    
    res.json({
      success: true,
      result,
      message: '관상학 분석이 완료되었습니다'
    });
    
  } catch (error) {
    console.error('❌ 관상학 분석 오류:', error);
    res.status(500).json({
      success: false,
      error: 'internal_error',
      message: '서버 내부 오류가 발생했습니다'
    });
  }
});

// 캐시 상태 확인 API
router.get('/cache/status', (req, res) => {
  try {
    const stats = {
      size: cache.size,
      max: cache.max,
      ttl: cache.ttl,
      keys: Array.from(cache.keys())
    };
    
    res.json({
      success: true,
      cache: stats
    });
  } catch (error) {
    console.error('캐시 상태 확인 오류:', error);
    res.status(500).json({
      success: false,
      error: 'cache_error',
      message: '캐시 상태 확인에 실패했습니다'
    });
  }
});

// 캐시 초기화 API
router.post('/cache/clear', (req, res) => {
  try {
    cache.clear();
    console.log('✅ 관상학 캐시 초기화 완료');
    
    res.json({
      success: true,
      message: '캐시가 초기화되었습니다'
    });
  } catch (error) {
    console.error('캐시 초기화 오류:', error);
    res.status(500).json({
      success: false,
      error: 'cache_clear_error',
      message: '캐시 초기화에 실패했습니다'
    });
  }
});

// 헬스체크 API
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'physiognomy',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API 문서
router.get('/docs', (req, res) => {
  const docs = {
    title: '관상학 API 문서',
    version: '1.0.0',
    endpoints: {
      'POST /analyze': {
        description: '관상학 분석 수행',
        body: {
          frontalImageBase64: 'string (정면 이미지 Base64)',
          profileImageBase64: 'string (측면 이미지 Base64)',
          goal: 'string (선택: career, finance, relationship, health)',
          lang: 'string (선택: ko, en, km)'
        },
        response: {
          success: 'boolean',
          result: 'PhysioAnalysis object',
          message: 'string'
        }
      },
      'GET /health': {
        description: '서비스 상태 확인',
        response: {
          success: 'boolean',
          service: 'string',
          status: 'string'
        }
      },
      'GET /cache/status': {
        description: '캐시 상태 확인',
        response: {
          success: 'boolean',
          cache: 'object'
        }
      },
      'POST /cache/clear': {
        description: '캐시 초기화',
        response: {
          success: 'boolean',
          message: 'string'
        }
      }
    }
  };
  
  res.json(docs);
});

module.exports = router;
