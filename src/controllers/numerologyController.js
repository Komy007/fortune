const NumerologyService = require('../services/numerologyService');
const BaziEngine = require('../../bazi-engine');

class NumerologyController {
  constructor() {
    this.numerologyService = new NumerologyService();
    this.baziEngine = new BaziEngine();
  }

  // 전화번호 길흉 분석
  async analyzePhoneNumber(req, res) {
    try {
      const { phoneNumber, birthYear, birthMonth, birthDay, birthHour } = req.body;
      const userId = req.user?.id;

      if (!phoneNumber || !birthYear || !birthMonth || !birthDay) {
        return res.status(400).json({
          success: false,
          message: '전화번호와 생년월일을 입력해주세요.'
        });
      }

      // 사주 계산
      const baziData = this.baziEngine.calculateBazi(birthYear, birthMonth, birthDay, birthHour || 0);
      
      // 전화번호 분석
      const analysis = this.numerologyService.analyzePhoneNumber(phoneNumber, baziData);

      // 결과 저장 (로그인된 사용자인 경우)
      if (userId) {
        const db = req.app.locals.db;
        db.prepare(`
          INSERT INTO readings (user_id, type, result) 
          VALUES (?, ?, ?)
        `).run(userId, 'phone_numerology', JSON.stringify(analysis));
      }

      res.json({
        success: true,
        data: analysis
      });

    } catch (error) {
      console.error('전화번호 분석 오류:', error);
      res.status(500).json({
        success: false,
        message: '전화번호 분석 중 오류가 발생했습니다.'
      });
    }
  }

  // 차량번호 길흉 분석
  async analyzeCarNumber(req, res) {
    try {
      const { carNumber, birthYear, birthMonth, birthDay, birthHour } = req.body;
      const userId = req.user?.id;

      if (!carNumber || !birthYear || !birthMonth || !birthDay) {
        return res.status(400).json({
          success: false,
          message: '차량번호와 생년월일을 입력해주세요.'
        });
      }

      // 사주 계산
      const baziData = this.baziEngine.calculateBazi(birthYear, birthMonth, birthDay, birthHour || 0);
      
      // 차량번호 분석
      const analysis = this.numerologyService.analyzeCarNumber(carNumber, baziData);

      // 결과 저장 (로그인된 사용자인 경우)
      if (userId) {
        const db = req.app.locals.db;
        db.prepare(`
          INSERT INTO readings (user_id, type, result) 
          VALUES (?, ?, ?)
        `).run(userId, 'car_numerology', JSON.stringify(analysis));
      }

      res.json({
        success: true,
        data: analysis
      });

    } catch (error) {
      console.error('차량번호 분석 오류:', error);
      res.status(500).json({
        success: false,
        message: '차량번호 분석 중 오류가 발생했습니다.'
      });
    }
  }

  // 개인 숫자 길흉 분석
  async analyzePersonalNumber(req, res) {
    try {
      const { personalNumber, birthYear, birthMonth, birthDay, birthHour } = req.body;
      const userId = req.user?.id;

      if (!personalNumber || !birthYear || !birthMonth || !birthDay) {
        return res.status(400).json({
          success: false,
          message: '개인 숫자와 생년월일을 입력해주세요.'
        });
      }

      // 사주 계산
      const baziData = this.baziEngine.calculateBazi(birthYear, birthMonth, birthDay, birthHour || 0);
      
      // 개인 숫자 분석
      const analysis = this.numerologyService.analyzePersonalNumber(personalNumber, baziData);

      // 결과 저장 (로그인된 사용자인 경우)
      if (userId) {
        const db = req.app.locals.db;
        db.prepare(`
          INSERT INTO readings (user_id, type, result) 
          VALUES (?, ?, ?)
        `).run(userId, 'personal_numerology', JSON.stringify(analysis));
      }

      res.json({
        success: true,
        data: analysis
      });

    } catch (error) {
      console.error('개인 숫자 분석 오류:', error);
      res.status(500).json({
        success: false,
        message: '개인 숫자 분석 중 오류가 발생했습니다.'
      });
    }
  }

  // 택일 서비스
  async selectDateForPurpose(req, res) {
    try {
      const { purpose, birthYear, birthMonth, birthDay, birthHour, startDate, days } = req.body;
      const userId = req.user?.id;

      if (!purpose || !birthYear || !birthMonth || !birthDay) {
        return res.status(400).json({
          success: false,
          message: '목적과 생년월일을 입력해주세요.'
        });
      }

      // 사주 계산
      const baziData = this.baziEngine.calculateBazi(birthYear, birthMonth, birthDay, birthHour || 0);
      
      // 택일 분석
      const start = startDate ? new Date(startDate) : new Date();
      const dayCount = days || 30;
      const recommendations = this.numerologyService.selectDateForPurpose(purpose, baziData, start, dayCount);

      // 결과 저장 (로그인된 사용자인 경우)
      if (userId) {
        const db = req.app.locals.db;
        db.prepare(`
          INSERT INTO readings (user_id, type, result) 
          VALUES (?, ?, ?)
        `).run(userId, 'date_selection', JSON.stringify({ purpose, recommendations }));
      }

      res.json({
        success: true,
        data: {
          purpose,
          recommendations
        }
      });

    } catch (error) {
      console.error('택일 분석 오류:', error);
      res.status(500).json({
        success: false,
        message: '택일 분석 중 오류가 발생했습니다.'
      });
    }
  }

  // 종합 숫자 운세 분석
  async getComprehensiveAnalysis(req, res) {
    try {
      const { phoneNumber, carNumber, personalNumber, birthYear, birthMonth, birthDay, birthHour } = req.body;
      const userId = req.user?.id;

      if (!birthYear || !birthMonth || !birthDay) {
        return res.status(400).json({
          success: false,
          message: '생년월일을 입력해주세요.'
        });
      }

      // 사주 계산
      const baziData = this.baziEngine.calculateBazi(birthYear, birthMonth, birthDay, birthHour || 0);
      
      // 종합 분석
      const userData = { phoneNumber, carNumber, personalNumber };
      const analysis = this.numerologyService.getComprehensiveAnalysis(userData, baziData);

      // 결과 저장 (로그인된 사용자인 경우)
      if (userId) {
        const db = req.app.locals.db;
        db.prepare(`
          INSERT INTO readings (user_id, type, result) 
          VALUES (?, ?, ?)
        `).run(userId, 'comprehensive_numerology', JSON.stringify(analysis));
      }

      res.json({
        success: true,
        data: analysis
      });

    } catch (error) {
      console.error('종합 분석 오류:', error);
      res.status(500).json({
        success: false,
        message: '종합 분석 중 오류가 발생했습니다.'
      });
    }
  }

  // 길한 숫자 추천
  async getLuckyNumbers(req, res) {
    try {
      const { birthYear, birthMonth, birthDay, birthHour } = req.body;

      if (!birthYear || !birthMonth || !birthDay) {
        return res.status(400).json({
          success: false,
          message: '생년월일을 입력해주세요.'
        });
      }

      // 사주 계산
      const baziData = this.baziEngine.calculateBazi(birthYear, birthMonth, birthDay, birthHour || 0);
      
      // 길한 숫자 분석
      const luckyNumbers = this.numerologyService.analyzeLuckyNumbers(baziData);
      const luckyColors = this.numerologyService.getLuckyColors(baziData);
      const luckyDirections = this.numerologyService.getLuckyDirections(baziData);

      res.json({
        success: true,
        data: {
          luckyNumbers,
          luckyColors,
          luckyDirections,
          baziData
        }
      });

    } catch (error) {
      console.error('길한 숫자 분석 오류:', error);
      res.status(500).json({
        success: false,
        message: '길한 숫자 분석 중 오류가 발생했습니다.'
      });
    }
  }

  // 사용자의 숫자 운세 히스토리 조회
  async getUserHistory(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '로그인이 필요합니다.'
        });
      }

      const db = req.app.locals.db;
      const readings = db.prepare(`
        SELECT * FROM readings 
        WHERE user_id = ? AND type IN ('phone_numerology', 'car_numerology', 'personal_numerology', 'date_selection', 'comprehensive_numerology')
        ORDER BY created_at DESC
        LIMIT 20
      `).all(userId);

      res.json({
        success: true,
        data: readings.map(reading => ({
          ...reading,
          result: JSON.parse(reading.result)
        }))
      });

    } catch (error) {
      console.error('히스토리 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '히스토리 조회 중 오류가 발생했습니다.'
      });
    }
  }
}

module.exports = NumerologyController;



