const express = require('express');
const NumerologyController = require('../controllers/numerologyController');

const router = express.Router();
const numerologyController = new NumerologyController();

// JWT 토큰 검증 미들웨어
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return next(); // 토큰이 없어도 서비스 이용 가능 (로그인하지 않은 사용자)
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    next(); // 토큰이 유효하지 않아도 서비스 이용 가능
  }
};

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// 전화번호 길흉 분석
router.post('/phone-analysis', (req, res) => {
  numerologyController.analyzePhoneNumber(req, res);
});

// 차량번호 길흉 분석
router.post('/car-analysis', (req, res) => {
  numerologyController.analyzeCarNumber(req, res);
});

// 개인 숫자 길흉 분석
router.post('/personal-analysis', (req, res) => {
  numerologyController.analyzePersonalNumber(req, res);
});

// 택일 서비스
router.post('/date-selection', (req, res) => {
  numerologyController.selectDateForPurpose(req, res);
});

// 종합 숫자 운세 분석
router.post('/comprehensive-analysis', (req, res) => {
  numerologyController.getComprehensiveAnalysis(req, res);
});

// 길한 숫자 추천
router.post('/lucky-numbers', (req, res) => {
  numerologyController.getLuckyNumbers(req, res);
});

// 사용자의 숫자 운세 히스토리 조회 (로그인 필요)
router.get('/history', (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: '로그인이 필요합니다.'
    });
  }
  numerologyController.getUserHistory(req, res);
});

module.exports = router;



