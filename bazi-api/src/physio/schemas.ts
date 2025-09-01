// 관상학 모듈 Zod 스키마

import { z } from 'zod';

// 입력 데이터 검증 스키마
export const PhysioInputSchema = z.object({
  frontalImageBase64: z.string()
    .min(1000, '정면 이미지가 필요합니다')
    .refine((val) => {
      try {
        // Base64 형식 검증
        const header = val.substring(0, 30);
        return header.includes('data:image/') || header.includes('/9j/') || header.includes('iVBORw0KGgo');
      } catch {
        return false;
      }
    }, '올바른 이미지 형식이 아닙니다'),
  
  profileImageBase64: z.string()
    .min(1000, '측면 이미지가 필요합니다')
    .refine((val) => {
      try {
        const header = val.substring(0, 30);
        return header.includes('data:image/') || header.includes('/9j/') || header.includes('iVBORw0KGgo');
      } catch {
        return false;
      }
    }, '올바른 이미지 형식이 아닙니다'),
  
  goal: z.enum(['career', 'finance', 'relationship', 'health']).optional(),
  lang: z.enum(['ko', 'en', 'km']).optional().default('ko')
});

// 품질 메트릭스 스키마
export const QualityMetricsSchema = z.object({
  frontalScore: z.number().min(0).max(1),
  profileScore: z.number().min(0).max(1),
  issues: z.array(z.string())
});

// 얼굴 비율 스키마
export const FaceRatiosSchema = z.object({
  faceThirds: z.object({
    upper: z.number().min(0).max(2),
    middle: z.number().min(0).max(2),
    lower: z.number().min(0).max(2)
  }),
  eyeSpacing: z.number().min(0).max(2),
  eyeCornerAngle: z.number().min(-45).max(45),
  nasalStraightness: z.number().min(0).max(1),
  nasalProjection: z.number().min(0).max(1),
  philtrumToUpperLip: z.number().min(0).max(3),
  lipCornerSlope: z.number().min(-45).max(45),
  chinProjection: z.number().min(0).max(1),
  jawAngle: z.number().min(0).max(180),
  jawWidthToCheek: z.number().min(0).max(2),
  asymmetry: z.number().min(0).max(1)
});

// 분석 결과 스키마
export const PhysioAnalysisSchema = z.object({
  quality: QualityMetricsSchema,
  ratios: FaceRatiosSchema,
  summary: z.string().min(50).max(200),
  reportMarkdown: z.string().min(1000).max(5000)
});

// 응답 스키마
export const PhysioResponseSchema = z.object({
  success: z.boolean(),
  result: PhysioAnalysisSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional()
});

// 이미지 품질 검증 스키마
export const ImageQualitySchema = z.object({
  width: z.number().min(720, '최소 720px 해상도가 필요합니다'),
  height: z.number().min(720, '최소 720px 해상도가 필요합니다'),
  faceDetected: z.boolean().refine(val => val, '얼굴이 검출되지 않았습니다'),
  tiltAngle: z.number().max(15, '15도 이하의 기울기만 허용됩니다'),
  brightness: z.number().min(0.3).max(0.9, '적절한 밝기가 아닙니다'),
  contrast: z.number().min(0.4).max(0.8, '적절한 대비가 아닙니다')
});

// 캐시 키 생성 함수
export function generateCacheKey(input: z.infer<typeof PhysioInputSchema>): string {
  const { frontalImageBase64, profileImageBase64, goal, lang } = input;
  const hash = require('crypto').createHash('md5');
  hash.update(frontalImageBase64.substring(0, 1000));
  hash.update(profileImageBase64.substring(0, 1000));
  hash.update(goal || '');
  hash.update(lang || 'ko');
  return `physio:${hash.digest('hex')}`;
}




