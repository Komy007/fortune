import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken } from './admin-middleware';
import {
  createContact,
  getContactList,
  getContactDetail,
  updateContact,
  deleteContact,
  getContactedByList,
  getContactAnalytics,
  inviteContact
} from './contacts-service';

const router = Router();

// 지인 생성 스키마
const createContactSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  relationship: z.string().min(1, '관계를 선택해주세요'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  
  // 출생 정보 (선택사항)
  birthDate: z.string().optional(),
  birthTime: z.string().optional(),
  birthPlace: z.string().optional(),
  birthCountry: z.string().optional(),
  birthTimezone: z.string().optional(),
  sexAtBirth: z.enum(['male', 'female']).optional()
});

// 지인 수정 스키마
const updateContactSchema = createContactSchema.partial().extend({
  isVisible: z.boolean().optional(),
  canViewProfile: z.boolean().optional()
});

// 지인 목록 조회 스키마
const contactListSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  search: z.string().optional(),
  relationship: z.string().optional(),
  sortBy: z.enum(['createdAt', 'name', 'relationship']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

/**
 * POST /api/contacts
 * 지인 등록
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const contactData = createContactSchema.parse(req.body);
    const contact = await createContact(req.user!.userId, contactData);

    res.status(201).json({
      success: true,
      data: contact,
      message: '지인이 등록되었습니다'
    });
  } catch (error) {
    console.error('지인 등록 오류:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '지인 등록에 실패했습니다'
    });
  }
});

/**
 * GET /api/contacts
 * 내가 등록한 지인 목록 조회
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const params = contactListSchema.parse(req.query);
    const result = await getContactList(req.user!.userId, params);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('지인 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '지인 목록 조회에 실패했습니다'
    });
  }
});

/**
 * GET /api/contacts/analytics
 * 지인 관계 분석
 */
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const analytics = await getContactAnalytics(req.user!.userId);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('지인 분석 오류:', error);
    res.status(500).json({
      success: false,
      message: '지인 분석에 실패했습니다'
    });
  }
});

/**
 * GET /api/contacts/contacted-by
 * 나를 등록한 사람들 조회
 */
router.get('/contacted-by', authenticateToken, async (req, res) => {
  try {
    const contacts = await getContactedByList(req.user!.userId);

    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('나를 등록한 사람들 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '조회에 실패했습니다'
    });
  }
});

/**
 * GET /api/contacts/:contactId
 * 지인 상세 정보 조회
 */
router.get('/:contactId', authenticateToken, async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactDetail(req.user!.userId, contactId);

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('지인 상세 조회 오류:', error);
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : '지인 정보 조회에 실패했습니다'
    });
  }
});

/**
 * PATCH /api/contacts/:contactId
 * 지인 정보 수정
 */
router.patch('/:contactId', authenticateToken, async (req, res) => {
  try {
    const { contactId } = req.params;
    const updateData = updateContactSchema.parse(req.body);
    
    const updatedContact = await updateContact(req.user!.userId, contactId, updateData);

    res.json({
      success: true,
      data: updatedContact,
      message: '지인 정보가 수정되었습니다'
    });
  } catch (error) {
    console.error('지인 정보 수정 오류:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '지인 정보 수정에 실패했습니다'
    });
  }
});

/**
 * DELETE /api/contacts/:contactId
 * 지인 삭제
 */
router.delete('/:contactId', authenticateToken, async (req, res) => {
  try {
    const { contactId } = req.params;
    const result = await deleteContact(req.user!.userId, contactId);

    res.json({
      success: true,
      data: result,
      message: '지인 정보가 삭제되었습니다'
    });
  } catch (error) {
    console.error('지인 삭제 오류:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '지인 삭제에 실패했습니다'
    });
  }
});

/**
 * POST /api/contacts/:contactId/invite
 * 지인 초대
 */
router.post('/:contactId/invite', authenticateToken, async (req, res) => {
  try {
    const { contactId } = req.params;
    const result = await inviteContact(req.user!.userId, contactId);

    res.json({
      success: true,
      data: result,
      message: '초대가 발송되었습니다'
    });
  } catch (error) {
    console.error('지인 초대 오류:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '초대 발송에 실패했습니다'
    });
  }
});

export default router;