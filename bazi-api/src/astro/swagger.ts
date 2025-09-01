/**
 * 점성술 API Swagger 문서
 * 
 * 정확도: OpenAPI 3.0 스펙 준수
 * 한계: 기본적인 API 문서화
 * 참고: https://swagger.io/specification/
 */

import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: '점성술 API',
    description: 'Swiss Ephemeris 기반 서양 점성술 계산 API',
    version: '1.0.0',
    contact: {
      name: 'Fortune Teller App',
      url: 'https://github.com/fortune-teller-app'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000/api/astro',
      description: '개발 서버'
    }
  ],
  paths: {
    '/chart': {
      post: {
        summary: '나탈 차트 생성',
        description: '출생 시간과 위치를 기반으로 나탈 차트를 생성합니다.',
        tags: ['Chart'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['date', 'time', 'tz', 'lat', 'lon'],
                properties: {
                  date: {
                    type: 'string',
                    format: 'date',
                    example: '1990-04-03',
                    description: '출생 날짜 (YYYY-MM-DD)'
                  },
                  time: {
                    type: 'string',
                    pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
                    example: '08:30',
                    description: '출생 시간 (HH:mm)'
                  },
                  tz: {
                    type: 'string',
                    example: 'Asia/Seoul',
                    description: 'IANA timezone'
                  },
                  lat: {
                    type: 'number',
                    minimum: -90,
                    maximum: 90,
                    example: 37.5665,
                    description: '위도 (도)'
                  },
                  lon: {
                    type: 'number',
                    minimum: -180,
                    maximum: 180,
                    example: 126.9780,
                    description: '경도 (도)'
                  },
                  houseSystem: {
                    type: 'string',
                    enum: ['whole-sign', 'placidus'],
                    default: 'whole-sign',
                    description: '하우스 시스템'
                  }
                }
              },
              examples: {
                '서울 출생': {
                  summary: '서울 출생 예시',
                  value: {
                    date: '1990-04-03',
                    time: '08:30',
                    tz: 'Asia/Seoul',
                    lat: 37.5665,
                    lon: 126.9780,
                    houseSystem: 'whole-sign'
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: '성공',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    result: {
                      type: 'object',
                      properties: {
                        planets: { type: 'object' },
                        asc: { type: 'number' },
                        mc: { type: 'number' },
                        houses: { type: 'array' },
                        aspects: { type: 'array' },
                        metadata: { type: 'object' },
                        summary: { type: 'object' }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': {
            description: '입력 검증 실패',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    error: { type: 'string' },
                    message: { type: 'string' },
                    details: { type: 'array' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/transits': {
      post: {
        summary: '트랜짓 계산',
        description: '나탈 차트를 기반으로 트랜짓을 계산합니다.',
        tags: ['Transits'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['natal'],
                properties: {
                  natal: {
                    type: 'object',
                    description: '나탈 차트 입력 데이터'
                  },
                  date: {
                    type: 'string',
                    format: 'date',
                    example: '2024-01-15',
                    description: '트랜짓 기준 날짜 (기본값: 오늘)'
                  },
                  rangeDays: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 30,
                    default: 7,
                    example: 7,
                    description: '기준일 전후 범위 (일)'
                  }
                }
              },
              examples: {
                '기본 트랜짓': {
                  summary: '기본 트랜짓 계산',
                  value: {
                    natal: {
                      date: '1990-04-03',
                      time: '08:30',
                      tz: 'Asia/Seoul',
                      lat: 37.5665,
                      lon: 126.9780
                    },
                    date: '2024-01-15',
                    rangeDays: 7
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: '성공',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    result: {
                      type: 'object',
                      properties: {
                        natal: { type: 'object' },
                        transits: { type: 'array' },
                        date: { type: 'string' },
                        rangeDays: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/synastry': {
      post: {
        summary: '시너스트리 계산',
        description: '두 사람의 나탈 차트를 비교하여 호환성을 분석합니다.',
        tags: ['Synastry'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['personA', 'personB'],
                properties: {
                  personA: {
                    type: 'object',
                    description: '첫 번째 사람의 출생 데이터'
                  },
                  personB: {
                    type: 'object',
                    description: '두 번째 사람의 출생 데이터'
                  }
                }
              },
              examples: {
                '커플 호환성': {
                  summary: '커플 호환성 분석',
                  value: {
                    personA: {
                      date: '1990-04-03',
                      time: '08:30',
                      tz: 'Asia/Seoul',
                      lat: 37.5665,
                      lon: 126.9780
                    },
                    personB: {
                      date: '1992-08-15',
                      time: '14:20',
                      tz: 'Asia/Seoul',
                      lat: 37.5665,
                      lon: 126.9780
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: '성공',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    result: {
                      type: 'object',
                      properties: {
                        personA: { type: 'object' },
                        personB: { type: 'object' },
                        aspects: { type: 'array' },
                        compatibility: {
                          type: 'object',
                          properties: {
                            score: { type: 'number' },
                            harmony: { type: 'number' },
                            challenge: { type: 'number' },
                            neutral: { type: 'number' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/health': {
      get: {
        summary: '헬스체크',
        description: '점성술 서비스 상태를 확인합니다.',
        tags: ['Health'],
        responses: {
          '200': {
            description: '서비스 정상',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    service: { type: 'string' },
                    status: { type: 'string' },
                    timestamp: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      ChartInput: {
        type: 'object',
        required: ['date', 'time', 'tz', 'lat', 'lon'],
        properties: {
          date: { type: 'string', format: 'date' },
          time: { type: 'string', pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$' },
          tz: { type: 'string' },
          lat: { type: 'number', minimum: -90, maximum: 90 },
          lon: { type: 'number', minimum: -180, maximum: 180 },
          houseSystem: { type: 'string', enum: ['whole-sign', 'placidus'] }
        }
      },
      PlanetPosition: {
        type: 'object',
        properties: {
          lon: { type: 'number', description: '황경 (도)' },
          lat: { type: 'number', description: '황위 (도)' },
          dist: { type: 'number', description: '거리 (AU)' },
          speed: { type: 'number', description: '속도 (도/일)' }
        }
      },
      Aspect: {
        type: 'object',
        properties: {
          planet1: { type: 'string' },
          planet2: { type: 'string' },
          type: { type: 'string', enum: ['conjunction', 'sextile', 'square', 'trine', 'opposition'] },
          orb: { type: 'number' },
          exact: { type: 'boolean' }
        }
      }
    }
  },
  tags: [
    {
      name: 'Chart',
      description: '나탈 차트 관련 API'
    },
    {
      name: 'Transits',
      description: '트랜짓 계산 API'
    },
    {
      name: 'Synastry',
      description: '시너스트리 분석 API'
    },
    {
      name: 'Health',
      description: '서비스 상태 확인 API'
    }
  ]
};

export { swaggerDocument };
export default swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: '점성술 API 문서'
});



