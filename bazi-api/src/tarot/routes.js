const express = require('express');
const { TarotService } = require('./service');

const router = express.Router();
const tarotService = new TarotService();

// 타로 카드 뽑기
router.post('/draw', async (req, res) => {
  try {
    const { spread = 'three-card', question = '', userInfo = null } = req.body;
    
    console.log('🃏 타로 카드 뽑기 요청:', { spread, question, userInfo });
    
    const result = await tarotService.drawCards(spread, question, userInfo);
    
    res.json({
      success: true,
      result,
      message: '타로 카드를 뽑았습니다.'
    });
  } catch (error) {
    console.error('타로 카드 뽑기 오류:', error);
    res.status(500).json({
      success: false,
      error: 'internal_error',
      message: '타로 카드를 뽑는 중 오류가 발생했습니다.'
    });
  }
});

// 타로 스프레드 목록
router.get('/spreads', (req, res) => {
  const spreads = tarotService.getAvailableSpreads();
  res.json({
    success: true,
    spreads
  });
});

// 타로 카드 상세 정보
router.get('/cards/:id', (req, res) => {
  try {
    const { id } = req.params;
    const card = tarotService.getCardById(id);
    
    if (!card) {
      return res.status(404).json({
        success: false,
        error: 'card_not_found',
        message: '카드를 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      card
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'internal_error',
      message: '카드 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;




