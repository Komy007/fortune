/**
 * 점성술 API Swagger 문서
 *
 * 정확도: OpenAPI 3.0 스펙 준수
 * 한계: 기본적인 API 문서화
 * 참고: https://swagger.io/specification/
 */
declare const swaggerDocument: {
    openapi: string;
    info: {
        title: string;
        description: string;
        version: string;
        contact: {
            name: string;
            url: string;
        };
    };
    servers: {
        url: string;
        description: string;
    }[];
    paths: {
        '/chart': {
            post: {
                summary: string;
                description: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    date: {
                                        type: string;
                                        format: string;
                                        example: string;
                                        description: string;
                                    };
                                    time: {
                                        type: string;
                                        pattern: string;
                                        example: string;
                                        description: string;
                                    };
                                    tz: {
                                        type: string;
                                        example: string;
                                        description: string;
                                    };
                                    lat: {
                                        type: string;
                                        minimum: number;
                                        maximum: number;
                                        example: number;
                                        description: string;
                                    };
                                    lon: {
                                        type: string;
                                        minimum: number;
                                        maximum: number;
                                        example: number;
                                        description: string;
                                    };
                                    houseSystem: {
                                        type: string;
                                        enum: string[];
                                        default: string;
                                        description: string;
                                    };
                                };
                            };
                            examples: {
                                '\uC11C\uC6B8 \uCD9C\uC0DD': {
                                    summary: string;
                                    value: {
                                        date: string;
                                        time: string;
                                        tz: string;
                                        lat: number;
                                        lon: number;
                                        houseSystem: string;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        result: {
                                            type: string;
                                            properties: {
                                                planets: {
                                                    type: string;
                                                };
                                                asc: {
                                                    type: string;
                                                };
                                                mc: {
                                                    type: string;
                                                };
                                                houses: {
                                                    type: string;
                                                };
                                                aspects: {
                                                    type: string;
                                                };
                                                metadata: {
                                                    type: string;
                                                };
                                                summary: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    '400': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        error: {
                                            type: string;
                                        };
                                        message: {
                                            type: string;
                                        };
                                        details: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        '/transits': {
            post: {
                summary: string;
                description: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    natal: {
                                        type: string;
                                        description: string;
                                    };
                                    date: {
                                        type: string;
                                        format: string;
                                        example: string;
                                        description: string;
                                    };
                                    rangeDays: {
                                        type: string;
                                        minimum: number;
                                        maximum: number;
                                        default: number;
                                        example: number;
                                        description: string;
                                    };
                                };
                            };
                            examples: {
                                '\uAE30\uBCF8 \uD2B8\uB79C\uC9D3': {
                                    summary: string;
                                    value: {
                                        natal: {
                                            date: string;
                                            time: string;
                                            tz: string;
                                            lat: number;
                                            lon: number;
                                        };
                                        date: string;
                                        rangeDays: number;
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        result: {
                                            type: string;
                                            properties: {
                                                natal: {
                                                    type: string;
                                                };
                                                transits: {
                                                    type: string;
                                                };
                                                date: {
                                                    type: string;
                                                };
                                                rangeDays: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        '/synastry': {
            post: {
                summary: string;
                description: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                required: string[];
                                properties: {
                                    personA: {
                                        type: string;
                                        description: string;
                                    };
                                    personB: {
                                        type: string;
                                        description: string;
                                    };
                                };
                            };
                            examples: {
                                '\uCEE4\uD50C \uD638\uD658\uC131': {
                                    summary: string;
                                    value: {
                                        personA: {
                                            date: string;
                                            time: string;
                                            tz: string;
                                            lat: number;
                                            lon: number;
                                        };
                                        personB: {
                                            date: string;
                                            time: string;
                                            tz: string;
                                            lat: number;
                                            lon: number;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        result: {
                                            type: string;
                                            properties: {
                                                personA: {
                                                    type: string;
                                                };
                                                personB: {
                                                    type: string;
                                                };
                                                aspects: {
                                                    type: string;
                                                };
                                                compatibility: {
                                                    type: string;
                                                    properties: {
                                                        score: {
                                                            type: string;
                                                        };
                                                        harmony: {
                                                            type: string;
                                                        };
                                                        challenge: {
                                                            type: string;
                                                        };
                                                        neutral: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
        '/health': {
            get: {
                summary: string;
                description: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                        content: {
                            'application/json': {
                                schema: {
                                    type: string;
                                    properties: {
                                        success: {
                                            type: string;
                                        };
                                        service: {
                                            type: string;
                                        };
                                        status: {
                                            type: string;
                                        };
                                        timestamp: {
                                            type: string;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    components: {
        schemas: {
            ChartInput: {
                type: string;
                required: string[];
                properties: {
                    date: {
                        type: string;
                        format: string;
                    };
                    time: {
                        type: string;
                        pattern: string;
                    };
                    tz: {
                        type: string;
                    };
                    lat: {
                        type: string;
                        minimum: number;
                        maximum: number;
                    };
                    lon: {
                        type: string;
                        minimum: number;
                        maximum: number;
                    };
                    houseSystem: {
                        type: string;
                        enum: string[];
                    };
                };
            };
            PlanetPosition: {
                type: string;
                properties: {
                    lon: {
                        type: string;
                        description: string;
                    };
                    lat: {
                        type: string;
                        description: string;
                    };
                    dist: {
                        type: string;
                        description: string;
                    };
                    speed: {
                        type: string;
                        description: string;
                    };
                };
            };
            Aspect: {
                type: string;
                properties: {
                    planet1: {
                        type: string;
                    };
                    planet2: {
                        type: string;
                    };
                    type: {
                        type: string;
                        enum: string[];
                    };
                    orb: {
                        type: string;
                    };
                    exact: {
                        type: string;
                    };
                };
            };
        };
    };
    tags: {
        name: string;
        description: string;
    }[];
};
export { swaggerDocument };
declare const _default: any;
export default _default;
export declare const swaggerUiSetup: any;
//# sourceMappingURL=swagger.d.ts.map