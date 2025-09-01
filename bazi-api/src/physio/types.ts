// 관상학 모듈 타입 정의

export interface PhysioInput {
  frontalImageBase64: string;
  profileImageBase64: string;
  goal?: 'career' | 'finance' | 'relationship' | 'health';
  lang?: 'ko' | 'en' | 'km';
}

export interface QualityMetrics {
  frontalScore: number; // 0-1
  profileScore: number; // 0-1
  issues: string[]; // 품질 문제 목록
}

export interface FaceRatios {
  // 얼굴 3등분 비율
  faceThirds: {
    upper: number;   // 헤어라인-미간
    middle: number;  // 미간-코끝
    lower: number;   // 코끝-턱끝
  };
  
  // 눈 관련
  eyeSpacing: number;        // 눈 사이 간격 비율
  eyeCornerAngle: number;    // 눈꼬리 각도 (도)
  
  // 코 관련
  nasalStraightness: number; // 코 라인 직진성 (0-1)
  nasalProjection: number;   // 코 돌출도 (0-1)
  
  // 입 관련
  philtrumToUpperLip: number; // 인중 길이 비율
  lipCornerSlope: number;     // 입꼬리 경사 (도)
  
  // 턱 관련
  chinProjection: number;     // 턱 돌출도 (0-1)
  jawAngle: number;          // 하악각 (도)
  
  // 전체 비율
  jawWidthToCheek: number;   // 턱 폭 대비 광대 폭
  asymmetry: number;         // 좌우 비대칭도 (0-1)
}

export interface PhysioAnalysis {
  quality: QualityMetrics;
  ratios: FaceRatios;
  summary: string;
  reportMarkdown: string;
}

export interface PhysioResponse {
  success: boolean;
  result?: PhysioAnalysis;
  error?: string;
  message?: string;
}

// 품질 기준 상수
export const QUALITY_THRESHOLDS = {
  MIN_RESOLUTION: 720,
  MAX_TILT_ANGLE: 15,
  MIN_FACE_SCORE: 0.7,
  MIN_QUALITY_SCORE: 0.6
} as const;

// 관상학 규칙 상수
export const PHYSIO_RULES = {
  // 이마 관련
  FOREHEAD_RATIOS: {
    IDEAL_UPPER: 0.33,
    IDEAL_MIDDLE: 0.33,
    IDEAL_LOWER: 0.34
  },
  
  // 눈 관련
  EYE_SPACING: {
    NARROW: 0.8,
    WIDE: 1.2
  },
  
  // 코 관련
  NASAL_STRAIGHTNESS: {
    STRAIGHT: 0.9,
    CURVED: 0.6
  },
  
  // 입 관련
  LIP_CORNER_SLOPE: {
    UPWARD: 0.1,
    DOWNWARD: -0.1
  },
  
  // 턱 관련
  CHIN_PROJECTION: {
    STRONG: 0.8,
    WEAK: 0.4
  }
} as const;

// 언어별 텍스트 템플릿
export interface PhysioTemplates {
  ko: {
    title: string;
    summary: string;
    sections: {
      keyFeatures: string;
      interpretation: string;
      coaching: string;
      routine: string;
      quality: string;
    };
  };
  en: {
    title: string;
    summary: string;
    sections: {
      keyFeatures: string;
      interpretation: string;
      coaching: string;
      routine: string;
      quality: string;
    };
  };
  km: {
    title: string;
    summary: string;
    sections: {
      keyFeatures: string;
      interpretation: string;
      coaching: string;
      routine: string;
      quality: string;
    };
  };
}



