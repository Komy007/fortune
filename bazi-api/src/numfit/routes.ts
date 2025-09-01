// 명리학 기반 숫자 택일 서비스 API 라우트

const express = require('express');
const { z } = require('zod');
const { NumberFitAnalyzer } = require('./score');
const { SajuAdapter } = require('./saju-adapter');

const router = express.Router();

// 요청 스키마 검증
const numberFitSchema = z.object({
  userId: z.number().positive(),
  numberType: z.enum(['phone', 'plate', 'personal']),
  number: z.string().min(1).max(20),
  purpose: z.string().optional()
});

const dateSelectionSchema = z.object({
  userId: z.number().positive(),
  purpose: z.enum(['meeting', 'business', 'travel', 'wedding', 'moving', 'general']),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  preferredElements: z.array(z.string()).optional(),
  avoidElements: z.array(z.string()).optional()
});

const batchAnalysisSchema = z.object({
  userId: z.number().positive(),
  numbers: z.array(z.object({
    type: z.enum(['phone', 'plate', 'personal']),
    number: z.string().min(1).max(20),
    purpose: z.string().optional()
  })).min(1).max(10)
});

// 숫자 길일 분석 API
router.post('/analyze', async (req, res) => {
  try {
    const validatedData = numberFitSchema.parse(req.body);
    const { userId, numberType, number, purpose } = validatedData;

    // 사주 정보 조회
    const sajuAdapter = new SajuAdapter('./data/app.db');
    const sajuProfile = await sajuAdapter.getSajuProfile(userId);

    if (!sajuProfile) {
      return res.status(404).json({
        success: false,
        message: '사주 정보를 찾을 수 없습니다. 먼저 사주 분석을 완료해주세요.'
      });
    }

    // 숫자 분석 수행
    const analyzer = new NumberFitAnalyzer(sajuProfile);
    const analysis = analyzer.analyzeNumber(number, numberType);

    const response: NumberFitResponse = {
      success: true,
      data: analysis
    };

    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: '잘못된 요청 데이터입니다.',
        errors: error.errors
      });
    }

    console.error('숫자 분석 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

// 날짜 택일 API
router.post('/date-selection', async (req, res) => {
  try {
    const validatedData = dateSelectionSchema.parse(req.body);
    const { userId, purpose, startDate, endDate, preferredElements, avoidElements } = validatedData;

    // 사주 정보 조회
    const sajuAdapter = new SajuAdapter('./data/app.db');
    const sajuProfile = await sajuAdapter.getSajuProfile(userId);

    if (!sajuProfile) {
      return res.status(404).json({
        success: false,
        message: '사주 정보를 찾을 수 없습니다. 먼저 사주 분석을 완료해주세요.'
      });
    }

    // 날짜 범위 내 모든 날짜 분석
    const analyzer = new NumberFitAnalyzer(sajuProfile);
    const selectedDates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      const dateNumber = dateStr.replace(/-/g, '');
      
      const analysis = analyzer.analyzeNumber(dateNumber, 'date');
      
      // 목적에 따른 필터링
      let shouldInclude = true;
      if (preferredElements && preferredElements.length > 0) {
        shouldInclude = preferredElements.some(element => 
          analysis.elements.includes(element)
        );
      }
      
      if (avoidElements && avoidElements.length > 0) {
        shouldInclude = !avoidElements.some(element => 
          analysis.elements.includes(element)
        );
      }

      if (shouldInclude) {
        selectedDates.push({
          date: dateStr,
          score: analysis.score,
          elements: analysis.elements,
          analysis: analysis.analysis.positive.join(', '),
          recommendations: analysis.analysis.suggestions
        });
      }
    }

    // 점수순으로 정렬 (높은 점수 우선)
    selectedDates.sort((a, b) => b.score - a.score);

    // 상위 10개만 반환
    const topDates = selectedDates.slice(0, 10);

    const response: DateSelectionResponse = {
      success: true,
      data: {
        purpose,
        startDate,
        endDate,
        selectedDates: topDates
      }
    };

    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: '잘못된 요청 데이터입니다.',
        errors: error.errors
      });
    }

    console.error('날짜 택일 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

// 일괄 분석 API
router.post('/batch-analyze', async (req, res) => {
  try {
    const validatedData = batchAnalysisSchema.parse(req.body);
    const { userId, numbers } = validatedData;

    // 사주 정보 조회
    const sajuAdapter = new SajuAdapter('./data/app.db');
    const sajuProfile = await sajuAdapter.getSajuProfile(userId);

    if (!sajuProfile) {
      return res.status(404).json({
        success: false,
        message: '사주 정보를 찾을 수 없습니다. 먼저 사주 분석을 완료해주세요.'
      });
    }

    // 모든 숫자 분석
    const analyzer = new NumberFitAnalyzer(sajuProfile);
    const analyses = numbers.map(num => 
      analyzer.analyzeNumber(num.number, num.type)
    );

    // 요약 정보 생성
    const sortedAnalyses = [...analyses].sort((a, b) => b.score - a.score);
    const bestNumber = sortedAnalyses[0];
    const worstNumber = sortedAnalyses[sortedAnalyses.length - 1];
    const averageScore = analyses.reduce((sum, analysis) => sum + analysis.score, 0) / analyses.length;

    // 종합 권장사항 생성
    const recommendations = [];
    if (bestNumber.score >= 80) {
      recommendations.push(`${bestNumber.number}은 매우 길한 숫자입니다. 적극 활용하세요.`);
    }
    if (worstNumber.score < 40) {
      recommendations.push(`${worstNumber.number}은 피하는 것이 좋습니다.`);
    }
    if (averageScore < 60) {
      recommendations.push('전반적으로 숫자 조합을 개선하는 것이 좋겠습니다.');
    }

    const response: BatchAnalysisResponse = {
      success: true,
      data: analyses,
      summary: {
        bestNumber,
        worstNumber,
        averageScore: Math.round(averageScore),
        recommendations
      }
    };

    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: '잘못된 요청 데이터입니다.',
        errors: error.errors
      });
    }

    console.error('일괄 분석 오류:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
});

// 사용 가능한 숫자 타입 조회
router.get('/types', (req, res) => {
  res.json({
    success: true,
    data: {
      types: [
        { id: 'phone', name: '전화번호', description: '휴대폰, 집전화 등' },
        { id: 'plate', name: '차량번호', description: '자동차 번호판' },
        { id: 'personal', name: '개인숫자', description: '자주 사용하는 숫자' }
      ]
    }
  });
});

// 목적별 날짜 택일 가이드
router.get('/date-purposes', (req, res) => {
  res.json({
    success: true,
    data: {
      purposes: [
        { id: 'meeting', name: '미팅/회의', description: '업무 미팅, 협상 등' },
        { id: 'business', name: '사업/계약', description: '계약 체결, 사업 시작' },
        { id: 'travel', name: '여행/이동', description: '여행, 이사, 출장' },
        { id: 'wedding', name: '결혼/행사', description: '결혼식, 기념일' },
        { id: 'moving', name: '이사/입주', description: '집 이사, 입주' },
        { id: 'general', name: '일반', description: '기타 중요한 일정' }
      ]
    }
  });
});

module.exports = router;
