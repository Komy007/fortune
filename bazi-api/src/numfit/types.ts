export interface SajuProfile {
  id: string;
  userId: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  birthPlace: string;
  gender: string;
  elements: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  branches: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  yongshin: string;
  heeshin: string;
  gishin: string;
  gushin: string;
  createdAt: string;
  updatedAt: string;
}

export interface NumberAnalysis {
  number: string;
  type: string;
  score: number;
  elements: string[];
  analysis: {
    positive: string[];
    negative: string[];
    suggestions: string[];
  };
}

export interface NumberFitResponse {
  success: boolean;
  data: NumberAnalysis;
}

export interface DateSelectionResponse {
  success: boolean;
  data: Array<{
    date: string;
    score: number;
    elements: string[];
    analysis: string;
    recommendations: string[];
    purpose?: string;
  }>;
}

export interface BatchAnalysisResponse {
  success: boolean;
  data: {
    analyses: NumberAnalysis[];
    averageScore: number;
    recommendations: string[];
  };
  summary?: {
    bestNumber: NumberAnalysis;
    worstNumber: NumberAnalysis;
    averageScore: number;
    recommendations: string[];
  };
}
