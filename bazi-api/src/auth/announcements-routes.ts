import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken, requireAdmin } from './admin-middleware';
import {
  createAnnouncement,
  getActiveAnnouncements,
  getAnnouncementList,
  getAnnouncementDetail,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementStats,
  bulkUpdateAnnouncements,
  deactivateExpiredAnnouncements
} from './announcements-service';

const router = Router();

// 공지사항 생성 스키마
const createAnnouncementSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
  isSticky: z.boolean().optional(),
  
  // 다국어 지원
  titleKo: z.string().optional(),
  contentKo: z.string().optional(),
  titleEn: z.string().optional(),
  contentEn: z.string().optional(),
  titleZh: z.string().optional(),
  contentZh: z.string().optional(),
  
  // 게시 기간
  publishAt: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
  expiresAt: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined)
});

// 공지사항 수정 스키마
const updateAnnouncementSchema = createAnnouncementSchema.partial().extend({
  isActive: z.boolean().optional()
});

// 공지사항 목록 조회 스키마
const announcementListSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  search: z.string().optional(),
  priority: z.string().optional(),
  isActive: z.string().optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined),
  isSticky: z.string().optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined),
  language: z.string().optional(),
  sortBy: z.enum(['createdAt', 'publishAt', 'priority', 'title']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

// 일괄 업데이트 스키마
const bulkUpdateSchema = z.object({
  ids: z.array(z.string()),
  updates: z.object({
    isActive: z.boolean().optional(),
    priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
    isSticky: z.boolean().optional()
  })
});

/**
 * GET /api/announcements/public
 * 활성화된 공지사항 조회 (인증 불필요)
 */
router.get('/public', async (req, res) => {
  try {
    const params = announcementListSchema.parse(req.query);
    const result = await getActiveAnnouncements(params);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('공지사항 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '공지사항 조회에 실패했습니다'
    });
  }
});

/**
 * GET /api/announcements/public/:id
 * 공지사항 상세 조회 (인증 불필요)
 */
router.get('/public/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const language = req.query.language as string || 'ko';
    
    const announcement = await getAnnouncementDetail(id, false);

    // 언어별 콘텐츠 반환
    const localizedAnnouncement = {
      id: announcement.id,
      title: getLocalizedField(announcement, 'title', language),
      content: getLocalizedField(announcement, 'content', language),
      priority: announcement.priority,
      isSticky: announcement.isSticky,
      publishAt: announcement.publishAt,
      expiresAt: announcement.expiresAt,
      createdAt: announcement.createdAt
    };

    res.json({
      success: true,
      data: localizedAnnouncement
    });
  } catch (error) {
    console.error('공지사항 상세 조회 오류:', error);
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : '공지사항 조회에 실패했습니다'
    });
  }
});

/**
 * POST /api/announcements
 * 공지사항 생성 (관리자 전용)
 */
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const announcementData = createAnnouncementSchema.parse(req.body);
    const announcement = await createAnnouncement(req.user!.userId, announcementData);

    res.status(201).json({
      success: true,
      data: announcement,
      message: '공지사항이 생성되었습니다'
    });
  } catch (error) {
    console.error('공지사항 생성 오류:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '공지사항 생성에 실패했습니다'
    });
  }
});

/**
 * GET /api/announcements
 * 공지사항 목록 조회 (관리자 전용)
 */
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const params = announcementListSchema.parse(req.query);
    const result = await getAnnouncementList(params);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('공지사항 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '공지사항 목록 조회에 실패했습니다'
    });
  }
});

/**
 * GET /api/announcements/stats
 * 공지사항 통계 (관리자 전용)
 */
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await getAnnouncementStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('공지사항 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '통계 조회에 실패했습니다'
    });
  }
});

/**
 * GET /api/announcements/:id
 * 공지사항 상세 조회 (관리자 전용)
 */
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await getAnnouncementDetail(id, true);

    res.json({
      success: true,
      data: announcement
    });
  } catch (error) {
    console.error('공지사항 상세 조회 오류:', error);
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : '공지사항 조회에 실패했습니다'
    });
  }
});

/**
 * PATCH /api/announcements/:id
 * 공지사항 수정 (관리자 전용)
 */
router.patch('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = updateAnnouncementSchema.parse(req.body);
    
    const updatedAnnouncement = await updateAnnouncement(id, updateData);

    res.json({
      success: true,
      data: updatedAnnouncement,
      message: '공지사항이 수정되었습니다'
    });
  } catch (error) {
    console.error('공지사항 수정 오류:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '공지사항 수정에 실패했습니다'
    });
  }
});

/**
 * DELETE /api/announcements/:id
 * 공지사항 삭제 (관리자 전용)
 */
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteAnnouncement(id);

    res.json({
      success: true,
      data: result,
      message: '공지사항이 삭제되었습니다'
    });
  } catch (error) {
    console.error('공지사항 삭제 오류:', error);
    res.status(400).json({
      success: false,
      message: '공지사항 삭제에 실패했습니다'
    });
  }
});

/**
 * POST /api/announcements/bulk-update
 * 공지사항 일괄 업데이트 (관리자 전용)
 */
router.post('/bulk-update', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { ids, updates } = bulkUpdateSchema.parse(req.body);
    const result = await bulkUpdateAnnouncements(ids, updates);

    res.json({
      success: true,
      data: result,
      message: '공지사항이 일괄 업데이트되었습니다'
    });
  } catch (error) {
    console.error('일괄 업데이트 오류:', error);
    res.status(400).json({
      success: false,
      message: '일괄 업데이트에 실패했습니다'
    });
  }
});

/**
 * POST /api/announcements/cleanup-expired
 * 만료된 공지사항 정리 (관리자 전용)
 */
router.post('/cleanup-expired', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await deactivateExpiredAnnouncements();

    res.json({
      success: true,
      data: result,
      message: '만료된 공지사항이 정리되었습니다'
    });
  } catch (error) {
    console.error('만료된 공지사항 정리 오류:', error);
    res.status(500).json({
      success: false,
      message: '만료된 공지사항 정리에 실패했습니다'
    });
  }
});

/**
 * 언어별 필드 반환 헬퍼 함수
 */
function getLocalizedField(obj: any, field: string, language: string): string {
  const langField = `${field}${language.charAt(0).toUpperCase() + language.slice(1)}`;
  return obj[langField] || obj[field];
}

export default router;