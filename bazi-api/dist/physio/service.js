"use strict";
// 관상학 서비스 로직
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessImageQuality = assessImageQuality;
exports.extractFaceRatios = extractFaceRatios;
exports.performPhysioAnalysis = performPhysioAnalysis;
exports.generateLLMPrompt = generateLLMPrompt;
exports.analyzePhysiognomy = analyzePhysiognomy;
exports.getCacheKey = getCacheKey;
const rules_1 = require("./rules");
const schemas_1 = require("./schemas");
// 이미지 품질 평가 함수 (임시 구현)
function assessImageQuality(imageBase64) {
    // 실제 구현에서는 MediaPipe나 TensorFlow.js를 사용
    // 여기서는 임시로 랜덤 값 반환
    const frontalScore = 0.85 + Math.random() * 0.1;
    const profileScore = 0.80 + Math.random() * 0.1;
    const issues = [];
    if (frontalScore < 0.7)
        issues.push('정면 사진 품질이 낮습니다');
    if (profileScore < 0.7)
        issues.push('측면 사진 품질이 낮습니다');
    return {
        frontalScore: Math.min(frontalScore, 1),
        profileScore: Math.min(profileScore, 1),
        issues
    };
}
// 얼굴 랜드마크 추출 함수 (임시 구현)
function extractFaceRatios(frontalImage, profileImage) {
    // 실제 구현에서는 MediaPipe Face Mesh를 사용
    // 여기서는 임시로 랜덤 값 반환
    return {
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
}
// 관상학 분석 수행
function performPhysioAnalysis(ratios) {
    const forehead = (0, rules_1.analyzeForehead)(ratios);
    const eyes = (0, rules_1.analyzeEyes)(ratios);
    const nose = (0, rules_1.analyzeNose)(ratios);
    const mouth = (0, rules_1.analyzeMouth)(ratios);
    const jaw = (0, rules_1.analyzeJaw)(ratios);
    const asymmetry = (0, rules_1.analyzeAsymmetry)(ratios);
    return {
        forehead,
        eyes,
        nose,
        mouth,
        jaw,
        asymmetry
    };
}
// LLM 프롬프트 생성
function generateLLMPrompt(analysis, goal, lang) {
    const templates = rules_1.PHYSIO_TEMPLATES[lang] || rules_1.PHYSIO_TEMPLATES.ko;
    const goalTemplate = rules_1.GOAL_COACHING_TEMPLATES[goal] || rules_1.GOAL_COACHING_TEMPLATES.career;
    const goalLang = goalTemplate[lang] || goalTemplate.ko;
    return `당신은 관상학 전문 코치입니다. 다음 분석 결과를 바탕으로 개인 맞춤형 코칭 리포트를 작성해주세요.

## 분석 결과
- 이마 분석: ${JSON.stringify(analysis.forehead)}
- 눈 분석: ${JSON.stringify(analysis.eyes)}
- 코 분석: ${JSON.stringify(analysis.nose)}
- 입 분석: ${JSON.stringify(analysis.mouth)}
- 턱 분석: ${JSON.stringify(analysis.jaw)}
- 비대칭 분석: ${JSON.stringify(analysis.asymmetry)}

## 목표: ${goalLang.title}

## 작성 지침
1. 코칭 중심으로 작성 (단정/예언 금지)
2. 실행 가능한 구체적 행동 제안
3. 1,000-1,400자 내외
4. 다음 구조로 작성:
   - 요약 (3문장)
   - 핵심 특징 (표 형태)
   - 특징 해석 (이마/눈/코/입/턱/비대칭)
   - 분야별 코칭 체크리스트
   - 30일 루틴 (아침/낮/저녁)
   - 품질 및 한계

## 금지사항
- 민족/종교/정치/성적지향 추정 금지
- 질병 진단 금지
- 외모 비하 표현 금지
- 미신적 언어 사용 금지

마크다운 형식으로 작성해주세요.`;
}
// 메인 분석 함수
async function analyzePhysiognomy(input) {
    try {
        // 1. 이미지 품질 평가
        const frontalQuality = assessImageQuality(input.frontalImageBase64);
        const profileQuality = assessImageQuality(input.profileImageBase64);
        const quality = {
            frontalScore: frontalQuality.frontalScore,
            profileScore: profileQuality.frontalScore, // profileImage의 품질
            issues: [...frontalQuality.issues, ...profileQuality.issues]
        };
        // 2. 얼굴 랜드마크 추출
        const ratios = extractFaceRatios(input.frontalImageBase64, input.profileImageBase64);
        // 3. 관상학 분석
        const analysis = performPhysioAnalysis(ratios);
        // 4. 요약 생성
        const summary = generateSummary(analysis, input.lang || 'ko');
        // 5. LLM 리포트 생성 (실제로는 LLM API 호출)
        const reportMarkdown = await generateReport(analysis, input.goal || 'career', input.lang || 'ko');
        return {
            quality,
            ratios,
            summary,
            reportMarkdown
        };
    }
    catch (error) {
        console.error('관상학 분석 오류:', error);
        throw new Error('관상학 분석 중 오류가 발생했습니다');
    }
}
// 요약 생성 함수
function generateSummary(analysis, lang) {
    const templates = rules_1.PHYSIO_TEMPLATES[lang] || rules_1.PHYSIO_TEMPLATES.ko;
    const keyFeatures = [];
    if (analysis.forehead.upper.balanced)
        keyFeatures.push('균형잡힌 이마');
    if (analysis.eyes.spacing.type === 'balanced')
        keyFeatures.push('균형잡힌 눈 간격');
    if (analysis.nose.straightness.type === 'straight')
        keyFeatures.push('직선적 코');
    if (analysis.mouth.philtrum.type === 'balanced')
        keyFeatures.push('균형잡힌 입');
    if (analysis.jaw.chin.type === 'moderate')
        keyFeatures.push('적당한 턱');
    return `${templates.summary} 주요 특징: ${keyFeatures.join(', ')}`;
}
// 리포트 생성 함수 (임시 구현)
async function generateReport(analysis, goal, lang) {
    // 실제로는 LLM API를 호출하여 리포트 생성
    // 여기서는 템플릿 기반으로 임시 리포트 생성
    const templates = rules_1.PHYSIO_TEMPLATES[lang] || rules_1.PHYSIO_TEMPLATES.ko;
    const goalTemplate = rules_1.GOAL_COACHING_TEMPLATES[goal] || rules_1.GOAL_COACHING_TEMPLATES.career;
    const goalLang = goalTemplate[lang] || goalTemplate.ko;
    return `# ${templates.title}

## 요약
${analysis.forehead.upper.coaching} ${analysis.eyes.spacing.coaching} ${analysis.nose.straightness.coaching}

## ${templates.sections.keyFeatures}

| 특징 | 상태 | 설명 |
|------|------|------|
| 이마 | ${analysis.forehead.upper.balanced ? '균형' : '불균형'} | ${analysis.forehead.upper.coaching.substring(0, 50)}... |
| 눈 | ${analysis.eyes.spacing.type} | ${analysis.eyes.spacing.coaching.substring(0, 50)}... |
| 코 | ${analysis.nose.straightness.type} | ${analysis.nose.straightness.coaching.substring(0, 50)}... |
| 입 | ${analysis.mouth.philtrum.type} | ${analysis.mouth.philtrum.coaching.substring(0, 50)}... |
| 턱 | ${analysis.jaw.chin.type} | ${analysis.jaw.chin.coaching.substring(0, 50)}... |

## ${templates.sections.interpretation}

### 이마 분석
${analysis.forehead.upper.coaching}

### 눈 분석
${analysis.eyes.spacing.coaching}

### 코 분석
${analysis.nose.straightness.coaching}

### 입 분석
${analysis.mouth.philtrum.coaching}

### 턱 분석
${analysis.jaw.chin.coaching}

### 비대칭 분석
${analysis.asymmetry.coaching}

## ${templates.sections.coaching}

### ${goalLang.title}

**중점 영역:**
${goalLang.focus.map(f => `- ${f}`).join('\n')}

**실행 팁:**
${goalLang.tips.map(tip => `- ${tip}`).join('\n')}

## ${templates.sections.routine}

### 30일 미니 루틴

**아침 (30분)**
- 10분 명상 또는 호흡 운동
- 10분 목표 설정 및 계획 수립
- 10분 가벼운 스트레칭

**낮 (5분씩)**
- 점심 후 5분 산책
- 오후 중간 휴식 5분
- 업무 마무리 전 5분 정리

**저녁 (20분)**
- 10분 하루 회고
- 10분 내일 준비

## ${templates.sections.quality}

이 분석은 제공된 사진의 품질에 따라 정확도가 달라질 수 있습니다. 
더 정확한 분석을 위해서는 고품질의 정면 및 측면 사진을 사용하시기 바랍니다.

---
*이 리포트는 관상학적 특징을 바탕으로 한 개인 맞춤형 코칭 자료입니다. 
과학적 근거가 아닌 참고 자료로 활용하시기 바랍니다.*`;
}
// 캐시 키 생성
function getCacheKey(input) {
    return (0, schemas_1.generateCacheKey)(input);
}
