import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { z } from 'zod';
import { BaziEngine } from './core/bazi';
import { 
  BaziRequestSchema, 
  BaziResponse, 
  ApiResponse,
  RectificationRequestSchema,
  BirthData
} from './types';
import authExtendedRouter from './auth/routes-extended';
import adminRouter from './auth/admin-routes';
import contactsRouter from './auth/contacts-routes';
import announcementsRouter from './auth/announcements-routes';
import exportRouter from './auth/export-routes';
import astroRouter from './astro/routes';
import physioRouter from './physio/routes';

import { initSwissEphemeris } from './astro/swe';
import { swaggerUiSetup } from './astro/swagger';

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙
app.use(express.static('public'));

// Bazi 엔진 인스턴스
const baziEngine = new BaziEngine();

// Swiss Ephemeris 초기화
try {
  initSwissEphemeris();
  console.log('✅ Swiss Ephemeris initialized successfully');
} catch (error) {
  console.error('❌ Swiss Ephemeris initialization failed:', error);
  console.log('📋 Please run: npm run fetch-ephe');
}

// Auth 라우터 연결
app.use('/api/auth', authExtendedRouter);

// Admin 라우터 연결
app.use('/api/admin', adminRouter);

// Admin Export 라우터 연결
app.use('/api/admin/export', exportRouter);

// Contacts 라우터 연결
app.use('/api/contacts', contactsRouter);

// Announcements 라우터 연결
app.use('/api/announcements', announcementsRouter);

// Astrology 라우터 연결
app.use('/api/astro', astroRouter);

// Physiognomy 라우터 연결
app.use('/api/physio', physioRouter);



// Swagger UI 문서
app.use('/docs', swaggerUiSetup);

// 입력 검증 스키마
const BaziInputSchema = z.object({
  fullName: z.string().min(2, '이름은 2자 이상이어야 합니다').max(40, '이름은 40자 이하여야 합니다'),
  sexAtBirth: z.enum(['male', 'female']),
  birth: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 형식이어야 합니다'),
    time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'HH:mm 또는 HH:mm:ss 형식이어야 합니다'),
    place: z.string().min(1, '출생지가 필요합니다'),
    unknownTime: z.boolean().optional(),
    placeGeo: z.object({
      lat: z.number(),
      lon: z.number()
    }).optional()
  }),
  calendarNote: z.literal('solar').optional(),
  contact: z.string().email('올바른 이메일 형식이어야 합니다').optional(),
  locale: z.enum(['ko', 'en', 'km']).default('ko')
});

// 명리학 분석 메인 엔드포인트
app.post('/api/bazi', async (req, res) => {
  try {
    console.log('🔮 명리학 분석 요청 받음:', req.body);
    
    // 입력 검증
    const validatedData = BaziInputSchema.parse(req.body);
    
    // Bazi 계산 수행
    const result = baziEngine.calculateBazi(validatedData.birth, validatedData.sexAtBirth);
    
    const response: ApiResponse<BaziResponse> = {
      success: true,
      result
    };
    
    console.log('✅ 명리학 분석 완료');
    return res.json(response);
    
  } catch (error) {
    console.error('❌ 명리학 분석 오류:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'validation_error',
        message: '입력 데이터 검증 실패',
        details: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: '서버 내부 오류가 발생했습니다.'
    });
  }
});

// Rectification 엔드포인트
app.post('/api/rectify', async (req, res) => {
  try {
    console.log('🔧 Rectification 요청 받음:', req.body);
    
    // 입력 검증
    const validatedData = RectificationRequestSchema.parse(req.body);
    
    // 여기서는 간단한 응답만 반환
    // 실제로는 사용자 응답을 기반으로 후보를 확정하는 로직 필요
    const response: ApiResponse<{ confirmed: boolean; confidence: number }> = {
      success: true,
      result: {
        confirmed: true,
        confidence: 0.9
      }
    };
    
    console.log('✅ Rectification 완료');
    return res.json(response);
    
  } catch (error) {
    console.error('❌ Rectification 오류:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'validation_error',
        message: '입력 데이터 검증 실패',
        details: error.errors
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'internal_error',
      message: '서버 내부 오류가 발생했습니다.'
    });
  }
});

// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Bazi Analysis API',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };
  
  res.json(healthCheck);
});

// 기존 호환성 엔드포인트들
app.post('/api/bazi/simple', async (req, res) => {
  try {
    const { birthData } = req.body;
    
    if (!birthData) {
      return res.status(400).json({
        success: false,
        error: 'missing_birth_data',
        message: '생년월일 정보가 필요합니다.'
      });
    }
    
    // 기존 형식으로 변환
    const convertedBirthData: BirthData = {
      date: `${birthData.year}-${birthData.month.toString().padStart(2, '0')}-${birthData.day.toString().padStart(2, '0')}`,
      time: `${birthData.hour.toString().padStart(2, '0')}:00`,
      place: birthData.place || '서울',
      unknownTime: false
    };
    
    const result = baziEngine.calculateBazi(convertedBirthData, 'male');
    
    return res.json({
      success: true,
      result: {
        pillars: result.pillars,
        dayMaster: result.pillars.day.stem,
        dayElement: result.pillars.day.element,
        elementCounts: result.five_elements,
        calculationTime: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Simple Bazi analysis error:', error);
    return res.status(500).json({
      success: false,
      error: 'analysis_failed',
      message: '분석 중 오류가 발생했습니다.'
    });
  }
});

// 오행 분석 엔드포인트
app.post('/api/elements', async (req, res) => {
  try {
    const { birthData } = req.body;
    
    if (!birthData) {
      return res.status(400).json({
        success: false,
        error: 'missing_birth_data',
        message: '생년월일 정보가 필요합니다.'
      });
    }
    
    // 기존 형식으로 변환
    const convertedBirthData: BirthData = {
      date: `${birthData.year}-${birthData.month.toString().padStart(2, '0')}-${birthData.day.toString().padStart(2, '0')}`,
      time: `${birthData.hour.toString().padStart(2, '0')}:00`,
      place: birthData.place || '서울',
      unknownTime: false
    };
    
    const result = baziEngine.calculateBazi(convertedBirthData, 'male');
    
    const elementAnalysis = {
      dayElement: result.pillars.day.element,
      elementCounts: result.five_elements,
      strongestElement: Object.entries(result.five_elements)
        .reduce((a, b) => result.five_elements[a[0] as keyof typeof result.five_elements] > result.five_elements[b[0] as keyof typeof result.five_elements] ? a : b)[0] || '목',
      weakestElement: Object.entries(result.five_elements)
        .reduce((a, b) => result.five_elements[a[0] as keyof typeof result.five_elements] < result.five_elements[b[0] as keyof typeof result.five_elements] ? a : b)[0] || '수',
      balanceScore: calculateBalanceScore(result.five_elements as unknown as Record<string, number>)
    };
    
    return res.json({
      success: true,
      result: elementAnalysis
    });
    
  } catch (error) {
    console.error('Elements analysis error:', error);
    return res.status(500).json({
      success: false,
      error: 'analysis_failed',
      message: '분석 중 오류가 발생했습니다.'
    });
  }
});

// 운세 기둥 엔드포인트
app.post('/api/luck-pillars', async (req, res) => {
  try {
    const { birthData } = req.body;
    
    if (!birthData) {
      return res.status(400).json({
        success: false,
        error: 'missing_birth_data',
        message: '생년월일 정보가 필요합니다.'
      });
    }
    
    // 기존 형식으로 변환
    const convertedBirthData: BirthData = {
      date: `${birthData.year}-${birthData.month.toString().padStart(2, '0')}-${birthData.day.toString().padStart(2, '0')}`,
      time: `${birthData.hour.toString().padStart(2, '0')}:00`,
      place: birthData.place || '서울',
      unknownTime: false
    };
    
    const result = baziEngine.calculateBazi(convertedBirthData, 'male');
    
    return res.json({
      success: true,
      result: {
        timeline: result.timeline,
        answers: result.answers
      }
    });
    
  } catch (error) {
    console.error('Luck pillars analysis error:', error);
    return res.status(500).json({
      success: false,
      error: 'analysis_failed',
      message: '분석 중 오류가 발생했습니다.'
    });
  }
});

// 오행 균형 점수 계산
function calculateBalanceScore(elementCounts: Record<string, number>): number {
  const values = Object.values(elementCounts);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const standardDeviation = Math.sqrt(variance);
  
  // 표준편차가 작을수록 균형잡힌 상태 (0~100 점수)
  const balanceScore = Math.max(0, 100 - (standardDeviation * 100));
  
  return Math.round(balanceScore);
}

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: '요청한 엔드포인트를 찾을 수 없습니다'
  });
});

// 전역 에러 핸들러
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('🚨 서버 오류:', error);
  
  res.status(500).json({
    success: false,
    error: '서버 내부 오류가 발생했습니다'
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Bazi Analysis API 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`📊 환경: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔮 서비스: 명리학 분석 API`);
  console.log(`📅 버전: 1.0.0`);
});

export default app;
