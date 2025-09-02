"use strict";
// 관상학 규칙 엔진 및 템플릿
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOAL_COACHING_TEMPLATES = exports.PHYSIO_TEMPLATES = void 0;
exports.analyzeForehead = analyzeForehead;
exports.analyzeEyes = analyzeEyes;
exports.analyzeNose = analyzeNose;
exports.analyzeMouth = analyzeMouth;
exports.analyzeJaw = analyzeJaw;
exports.analyzeAsymmetry = analyzeAsymmetry;
const types_1 = require("./types");
// 관상학 규칙 매핑 함수들
function analyzeForehead(ratios) {
    const { upper, middle, lower } = ratios.faceThirds;
    const total = upper + middle + lower;
    const upperRatio = upper / total;
    const middleRatio = middle / total;
    const lowerRatio = lower / total;
    const results = {
        upper: {
            balanced: Math.abs(upperRatio - types_1.PHYSIO_RULES.FOREHEAD_RATIOS.IDEAL_UPPER) < 0.05,
            ratio: upperRatio,
            coaching: ''
        },
        middle: {
            balanced: Math.abs(middleRatio - types_1.PHYSIO_RULES.FOREHEAD_RATIOS.IDEAL_MIDDLE) < 0.05,
            ratio: middleRatio,
            coaching: ''
        },
        lower: {
            balanced: Math.abs(lowerRatio - types_1.PHYSIO_RULES.FOREHEAD_RATIOS.IDEAL_LOWER) < 0.05,
            ratio: lowerRatio,
            coaching: ''
        }
    };
    // 코칭 문장 생성
    if (upperRatio > 0.4) {
        results.upper.coaching = '사고와 기획에 많은 시간을 투자하는 경향이 있습니다. 실행력 향상을 위해 작은 목표부터 시작하는 루틴을 만들어보세요.';
    }
    else if (upperRatio < 0.25) {
        results.upper.coaching = '즉흥적이고 실용적인 접근을 선호합니다. 장기적 관점에서의 계획 수립 연습을 통해 균형을 맞춰보세요.';
    }
    else {
        results.upper.coaching = '사고와 실행의 균형이 잘 맞춰져 있습니다. 이 균형을 유지하면서 지속적으로 발전해나가세요.';
    }
    return results;
}
function analyzeEyes(ratios) {
    const { eyeSpacing, eyeCornerAngle } = ratios;
    const results = {
        spacing: {
            type: eyeSpacing < types_1.PHYSIO_RULES.EYE_SPACING.NARROW ? 'narrow' :
                eyeSpacing > types_1.PHYSIO_RULES.EYE_SPACING.WIDE ? 'wide' : 'balanced',
            ratio: eyeSpacing,
            coaching: ''
        },
        angle: {
            type: eyeCornerAngle > 5 ? 'upward' :
                eyeCornerAngle < -5 ? 'downward' : 'horizontal',
            angle: eyeCornerAngle,
            coaching: ''
        }
    };
    // 눈 간격 코칭
    if (results.spacing.type === 'narrow') {
        results.spacing.coaching = '세부사항에 집중하는 경향이 있습니다. 전체적인 맥락을 파악하는 연습을 통해 시야를 넓혀보세요.';
    }
    else if (results.spacing.type === 'wide') {
        results.spacing.coaching = '넓은 시야로 전체적인 관점을 잘 파악합니다. 세부사항 관리 능력을 향상시켜 완성도를 높여보세요.';
    }
    else {
        results.spacing.coaching = '균형잡힌 시야로 다양한 관점을 고려합니다. 이 균형을 유지하면서 깊이 있는 분석 능력을 키워보세요.';
    }
    // 눈꼬리 각도 코칭
    if (results.angle.type === 'upward') {
        results.angle.coaching = '낙관적이고 긍정적인 마인드를 가지고 있습니다. 현실적 판단과의 균형을 맞춰보세요.';
    }
    else if (results.angle.type === 'downward') {
        results.angle.coaching = '신중하고 체계적인 접근을 선호합니다. 때로는 긍정적 시각으로 도전해보세요.';
    }
    else {
        results.angle.coaching = '균형잡힌 시각으로 상황을 객관적으로 판단합니다. 이 균형을 유지하면서 직감도 활용해보세요.';
    }
    return results;
}
function analyzeNose(ratios) {
    const { nasalStraightness, nasalProjection } = ratios;
    const results = {
        straightness: {
            type: nasalStraightness > types_1.PHYSIO_RULES.NASAL_STRAIGHTNESS.STRAIGHT ? 'straight' :
                nasalStraightness < types_1.PHYSIO_RULES.NASAL_STRAIGHTNESS.CURVED ? 'curved' : 'moderate',
            score: nasalStraightness,
            coaching: ''
        },
        projection: {
            type: nasalProjection > types_1.PHYSIO_RULES.CHIN_PROJECTION.STRONG ? 'strong' :
                nasalProjection < types_1.PHYSIO_RULES.CHIN_PROJECTION.WEAK ? 'weak' : 'moderate',
            score: nasalProjection,
            coaching: ''
        }
    };
    // 코 직진성 코칭
    if (results.straightness.type === 'straight') {
        results.straightness.coaching = '직선적이고 논리적인 사고를 선호합니다. 때로는 유연한 접근으로 창의성을 발휘해보세요.';
    }
    else if (results.straightness.type === 'curved') {
        results.straightness.coaching = '창의적이고 유연한 사고를 가지고 있습니다. 체계적인 접근을 통해 안정성을 높여보세요.';
    }
    else {
        results.straightness.coaching = '균형잡힌 사고로 논리와 창의성을 조화롭게 활용합니다. 이 균형을 유지하면서 발전해나가세요.';
    }
    // 코 돌출도 코칭
    if (results.projection.type === 'strong') {
        results.projection.coaching = '강한 의지와 집중력을 가지고 있습니다. 때로는 여유를 두고 천천히 진행해보세요.';
    }
    else if (results.projection.type === 'weak') {
        results.projection.coaching = '유연하고 적응력이 뛰어납니다. 목표 의식과 끈기를 기르는 연습을 해보세요.';
    }
    else {
        results.projection.coaching = '균형잡힌 의지로 적절한 집중력을 발휘합니다. 이 균형을 유지하면서 지속적으로 발전해나가세요.';
    }
    return results;
}
function analyzeMouth(ratios) {
    const { philtrumToUpperLip, lipCornerSlope } = ratios;
    const results = {
        philtrum: {
            ratio: philtrumToUpperLip,
            type: philtrumToUpperLip > 1.5 ? 'long' :
                philtrumToUpperLip < 0.8 ? 'short' : 'balanced',
            coaching: ''
        },
        lipCorner: {
            slope: lipCornerSlope,
            type: lipCornerSlope > types_1.PHYSIO_RULES.LIP_CORNER_SLOPE.UPWARD ? 'upward' :
                lipCornerSlope < types_1.PHYSIO_RULES.LIP_CORNER_SLOPE.DOWNWARD ? 'downward' : 'horizontal',
            coaching: ''
        }
    };
    // 인중 코칭
    if (results.philtrum.type === 'long') {
        results.philtrum.coaching = '신중하고 깊이 있는 소통을 선호합니다. 간결하고 명확한 표현 연습을 통해 효율성을 높여보세요.';
    }
    else if (results.philtrum.type === 'short') {
        results.philtrum.coaching = '직관적이고 즉각적인 소통을 선호합니다. 깊이 있는 대화를 통해 관계를 더욱 발전시켜보세요.';
    }
    else {
        results.philtrum.coaching = '균형잡힌 소통 스타일로 다양한 상황에 적응합니다. 이 균형을 유지하면서 소통 능력을 향상시켜보세요.';
    }
    // 입꼬리 코칭
    if (results.lipCorner.type === 'upward') {
        results.lipCorner.coaching = '긍정적이고 친근한 소통을 선호합니다. 때로는 진지한 대화로 깊이를 더해보세요.';
    }
    else if (results.lipCorner.type === 'downward') {
        results.lipCorner.coaching = '신중하고 진지한 소통을 선호합니다. 긍정적 표현을 통해 관계를 더욱 따뜻하게 만들어보세요.';
    }
    else {
        results.lipCorner.coaching = '균형잡힌 소통으로 상황에 맞는 적절한 표현을 합니다. 이 균형을 유지하면서 소통의 깊이를 더해보세요.';
    }
    return results;
}
function analyzeJaw(ratios) {
    const { chinProjection, jawAngle, jawWidthToCheek } = ratios;
    const results = {
        chin: {
            projection: chinProjection,
            type: chinProjection > types_1.PHYSIO_RULES.CHIN_PROJECTION.STRONG ? 'strong' :
                chinProjection < types_1.PHYSIO_RULES.CHIN_PROJECTION.WEAK ? 'weak' : 'moderate',
            coaching: ''
        },
        angle: {
            degree: jawAngle,
            type: jawAngle < 120 ? 'sharp' : jawAngle > 140 ? 'round' : 'balanced',
            coaching: ''
        },
        width: {
            ratio: jawWidthToCheek,
            type: jawWidthToCheek < 0.8 ? 'narrow' : jawWidthToCheek > 1.2 ? 'wide' : 'balanced',
            coaching: ''
        }
    };
    // 턱 돌출도 코칭
    if (results.chin.type === 'strong') {
        results.chin.coaching = '강한 의지와 실행력을 가지고 있습니다. 때로는 유연성을 기르는 연습을 해보세요.';
    }
    else if (results.chin.type === 'weak') {
        results.chin.coaching = '유연하고 적응력이 뛰어납니다. 목표 의식과 끈기를 기르는 연습을 해보세요.';
    }
    else {
        results.chin.coaching = '균형잡힌 의지로 적절한 실행력을 발휘합니다. 이 균형을 유지하면서 지속적으로 발전해나가세요.';
    }
    // 하악각 코칭
    if (results.angle.type === 'sharp') {
        results.angle.coaching = '결단력과 집중력이 뛰어납니다. 때로는 여유를 두고 천천히 진행해보세요.';
    }
    else if (results.angle.type === 'round') {
        results.angle.coaching = '유연하고 포용적인 성격을 가지고 있습니다. 목표 의식과 끈기를 기르는 연습을 해보세요.';
    }
    else {
        results.angle.coaching = '균형잡힌 성격으로 다양한 상황에 적응합니다. 이 균형을 유지하면서 발전해나가세요.';
    }
    return results;
}
function analyzeAsymmetry(ratios) {
    const { asymmetry } = ratios;
    const results = {
        level: asymmetry,
        type: asymmetry < 0.05 ? 'balanced' :
            asymmetry < 0.1 ? 'slight' : 'noticeable',
        coaching: ''
    };
    if (results.type === 'balanced') {
        results.coaching = '좌우 균형이 잘 맞춰져 있어 안정적인 성격을 가지고 있습니다. 이 균형을 유지하면서 발전해나가세요.';
    }
    else if (results.type === 'slight') {
        results.coaching = '약간의 비대칭으로 독특한 개성을 가지고 있습니다. 이 개성을 활용하여 창의성을 발휘해보세요.';
    }
    else {
        results.coaching = '뚜렷한 개성으로 독창적인 사고를 가지고 있습니다. 때로는 균형을 맞추는 연습을 통해 안정성을 높여보세요.';
    }
    return results;
}
// 언어별 템플릿
exports.PHYSIO_TEMPLATES = {
    ko: {
        title: '관상학 전문 분석 리포트',
        summary: '얼굴의 특징을 바탕으로 한 개인 맞춤형 코칭 리포트',
        sections: {
            keyFeatures: '핵심 특징',
            interpretation: '특징 해석',
            coaching: '분야별 코칭',
            routine: '30일 루틴',
            quality: '품질 및 한계'
        }
    },
    en: {
        title: 'Physiognomy Analysis Report',
        summary: 'Personalized coaching report based on facial features',
        sections: {
            keyFeatures: 'Key Features',
            interpretation: 'Feature Interpretation',
            coaching: 'Area-specific Coaching',
            routine: '30-Day Routine',
            quality: 'Quality & Limitations'
        }
    },
    km: {
        title: 'របាយការណ៍វិភាគរូបរាង',
        summary: 'របាយការណ៍ការណែនាំផ្ទាល់ខ្លួនផ្អែកលើលក្ខណៈសម្បត្តិមុខ',
        sections: {
            keyFeatures: 'លក្ខណៈសម្បត្តិសំខាន់ៗ',
            interpretation: 'ការបកស្រាយលក្ខណៈសម្បត្តិ',
            coaching: 'ការណែនាំផ្អែកលើតំបន់',
            routine: 'វិធីសាស្ត្រ ៣០ ថ្ងៃ',
            quality: 'គុណភាព និងការកំណត់'
        }
    }
};
// 목표별 코칭 템플릿
exports.GOAL_COACHING_TEMPLATES = {
    career: {
        ko: {
            title: '경력 발전 코칭',
            focus: ['의사결정 능력', '리더십 스타일', '업무 효율성', '스트레스 관리'],
            tips: [
                '매일 아침 10분 목표 설정 시간을 가지세요',
                '주간 회고를 통해 성과를 점검하세요',
                '동료와의 소통을 통해 협업 능력을 향상시키세요',
                '스트레스 관리 루틴을 만들어 지속 가능한 성과를 유지하세요'
            ]
        },
        en: {
            title: 'Career Development Coaching',
            focus: ['Decision Making', 'Leadership Style', 'Work Efficiency', 'Stress Management'],
            tips: [
                'Set aside 10 minutes each morning for goal setting',
                'Conduct weekly reviews to check performance',
                'Improve collaboration skills through communication with colleagues',
                'Create a stress management routine for sustainable performance'
            ]
        },
        km: {
            title: 'ការណែនាំអភិវឌ្ឍន៍អាជីព',
            focus: ['សមត្ថភាពធ្វើការសម្រេចចិត្ត', 'រចនាបថភាពជាអ្នកដឹកនាំ', 'ប្រសិទ្ធភាពការងារ', 'ការគ្រប់គ្រងភាពតានតឹង'],
            tips: [
                'ដាក់ពេលវេលា ១០ នាទីរៀងរាល់ព្រឹកសម្រាប់ការកំណត់គោលដៅ',
                'ធ្វើការពិនិត្យឡើងវិញប្រចាំសប្តាហ៍ដើម្បីពិនិត្យផលដំណើរការ',
                'បង្កើនជំនាញការសហការតាមរយៈការទំនាក់ទំនងជាមួយសមមិត្តការងារ',
                'បង្កើតវិធីសាស្ត្រគ្រប់គ្រងភាពតានតឹងសម្រាប់ផលដំណើរការលើកទឹកចិត្ត'
            ]
        }
    },
    finance: {
        ko: {
            title: '재정 관리 코칭',
            focus: ['소비 습관', '투자 판단', '위험 관리', '장기 계획'],
            tips: [
                '매일 지출을 기록하여 소비 패턴을 파악하세요',
                '월별 예산을 설정하고 정기적으로 점검하세요',
                '위험 분산을 위한 포트폴리오 구성을 고려하세요',
                '장기 재정 목표를 설정하고 단계별로 실행하세요'
            ]
        },
        en: {
            title: 'Financial Management Coaching',
            focus: ['Spending Habits', 'Investment Decisions', 'Risk Management', 'Long-term Planning'],
            tips: [
                'Record daily expenses to understand spending patterns',
                'Set monthly budgets and review regularly',
                'Consider portfolio diversification for risk management',
                'Set long-term financial goals and execute step by step'
            ]
        },
        km: {
            title: 'ការណែនាំគ្រប់គ្រងហិរញ្ញវត្ថុ',
            focus: ['ទម្លាប់ចំណាយ', 'ការសម្រេចចិត្តវិនិយោគ', 'ការគ្រប់គ្រងហានិភ័យ', 'ការធ្វើផែនការរយៈពេលវែង'],
            tips: [
                'កត់ត្រាការចំណាយប្រចាំថ្ងៃដើម្បីយល់ពីគំរូចំណាយ',
                'កំណត់ថវិកាប្រចាំខែ និងពិនិត្យឡើងវិញជាប្រចាំ',
                'ពិចារណាការបែងចែកផលប័ត្រសម្រាប់ការគ្រប់គ្រងហានិភ័យ',
                'កំណត់គោលដៅហិរញ្ញវត្ថុរយៈពេលវែង និងអនុវត្តជាជំហាន'
            ]
        }
    },
    relationship: {
        ko: {
            title: '인간관계 코칭',
            focus: ['소통 스타일', '공감 능력', '갈등 해결', '신뢰 구축'],
            tips: [
                '적극적 경청을 통해 상대방의 감정을 이해하세요',
                '공감적 반응을 통해 관계를 더욱 깊게 만들어보세요',
                '갈등 상황에서 객관적 시각을 유지하세요',
                '정기적인 소통을 통해 신뢰 관계를 구축하세요'
            ]
        },
        en: {
            title: 'Relationship Coaching',
            focus: ['Communication Style', 'Empathy', 'Conflict Resolution', 'Trust Building'],
            tips: [
                'Understand others\' emotions through active listening',
                'Deepen relationships through empathetic responses',
                'Maintain objective perspective in conflict situations',
                'Build trust through regular communication'
            ]
        },
        km: {
            title: 'ការណែនាំទំនាក់ទំនងមនុស្ស',
            focus: ['រចនាបថទំនាក់ទំនង', 'ការយល់ដឹង', 'ការដោះស្រាយជម្លោះ', 'ការកសាងទំនុកចិត្ត'],
            tips: [
                'យល់ពីអារម្មណ៍អ្នកដទៃតាមរយៈការស្តាប់យ៉ាងសកម្ម',
                'ធ្វើឱ្យទំនាក់ទំនងកាន់តែជ្រៅតាមរយៈការឆ្លើយតបយ៉ាងយល់ដឹង',
                'រក្សាទិដ្ឋភាពគោលដៅក្នុងស្ថានភាពជម្លោះ',
                'កសាងទំនុកចិត្តតាមរយៈការទំនាក់ទំនងជាប្រចាំ'
            ]
        }
    },
    health: {
        ko: {
            title: '건강 관리 코칭',
            focus: ['스트레스 관리', '수면 품질', '운동 습관', '영양 균형'],
            tips: [
                '규칙적인 수면 패턴을 만들어 신체 리듬을 조절하세요',
                '스트레스 해소를 위한 명상이나 호흡 운동을 실천하세요',
                '주 3-4회 적당한 운동으로 체력을 기르세요',
                '균형 잡힌 영양 섭취로 건강한 몸을 유지하세요'
            ]
        },
        en: {
            title: 'Health Management Coaching',
            focus: ['Stress Management', 'Sleep Quality', 'Exercise Habits', 'Nutrition Balance'],
            tips: [
                'Create regular sleep patterns to regulate body rhythm',
                'Practice meditation or breathing exercises for stress relief',
                'Build stamina with moderate exercise 3-4 times a week',
                'Maintain a healthy body with balanced nutrition'
            ]
        },
        km: {
            title: 'ការណែនាំគ្រប់គ្រងសុខភាព',
            focus: ['ការគ្រប់គ្រងភាពតានតឹង', 'គុណភាពដំណេក', 'ទម្លាប់លំហាត់ប្រាណ', 'តុល្យកម្មអាហារូបត្ថម្ភ'],
            tips: [
                'បង្កើតគំរូដំណេកជាប្រចាំដើម្បីធ្វើឱ្យរំញ័ររាងកាយ',
                'អនុវត្តការធ្វើសមាធិ ឬលំហាត់ដកដង្ហើមសម្រាប់ការកាត់បន្ថយភាពតានតឹង',
                'បង្កើនភាពរឹងមាំជាមួយលំហាត់ប្រាណកម្រិតមធ្យម ៣-៤ ដងក្នុងមួយសប្តាហ៍',
                'រក្សារាងកាយធន់ជាមួយអាហារូបត្ថម្ភដែលមានតុល្យកម្ម'
            ]
        }
    }
};
