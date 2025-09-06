import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken, requireAdmin, requireSuperAdmin } from './admin-middleware';
import {
  getUserList,
  getUserStats,
  getUserDetail,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  createAdminUser,
  resetUserPassword,
  getUserActivityLog
} from './admin-service';

const router = Router();

// 사용자 목록 조회 스키마
const userListSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  search: z.string().optional(),
  role: z.string().optional(),
  sortBy: z.enum(['createdAt', 'lastLoginAt', 'email', 'displayName']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

// 역할 변경 스키마
const roleUpdateSchema = z.object({
  role: z.enum(['user', 'admin', 'super_admin'])
});

// 상태 변경 스키마
const statusUpdateSchema = z.object({
  isActive: z.boolean()
});

// 관리자 생성 스키마
const createAdminSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
  displayName: z.string().min(1, '표시명을 입력해주세요'),
  role: z.enum(['admin', 'super_admin'])
});

// 비밀번호 재설정 스키마
const passwordResetSchema = z.object({
  newPassword: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다')
});

/**
 * GET /api/admin/users
 * 사용자 목록 조회
 */
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const params = userListSchema.parse(req.query);
    const result = await getUserList(params);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('사용자 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '사용자 목록 조회에 실패했습니다'
    });
  }
});

/**
 * GET /api/admin/stats
 * 사용자 통계 조회
 */
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await getUserStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '통계 조회에 실패했습니다'
    });
  }
});

/**
 * GET /api/admin/users/:userId
 * 사용자 상세 정보 조회
 */
router.get('/users/:userId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await getUserDetail(userId);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('사용자 상세 조회 오류:', error);
    res.status(404).json({
      success: false,
      message: error instanceof Error ? error.message : '사용자 조회에 실패했습니다'
    });
  }
});

/**
 * PATCH /api/admin/users/:userId/role
 * 사용자 역할 변경
 */
router.patch('/users/:userId/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = roleUpdateSchema.parse(req.body);
    
    const updatedUser = await updateUserRole(userId, role, req.user!.userId);

    res.json({
      success: true,
      data: updatedUser,
      message: `사용자 역할이 ${role}로 변경되었습니다`
    });
  } catch (error) {
    console.error('역할 변경 오류:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '역할 변경에 실패했습니다'
    });
  }
});

/**
 * PATCH /api/admin/users/:userId/status
 * 사용자 활성화/비활성화
 */
router.patch('/users/:userId/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = statusUpdateSchema.parse(req.body);
    
    const updatedUser = await toggleUserStatus(userId, isActive);

    res.json({
      success: true,
      data: updatedUser,
      message: `사용자가 ${isActive ? '활성화' : '비활성화'}되었습니다`
    });
  } catch (error) {
    console.error('상태 변경 오류:', error);
    res.status(400).json({
      success: false,
      message: '상태 변경에 실패했습니다'
    });
  }
});

/**
 * DELETE /api/admin/users/:userId
 * 사용자 삭제
 */
router.delete('/users/:userId', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // 자신을 삭제하는 것을 방지
    if (userId === req.user!.userId) {
      return res.status(400).json({
        success: false,
        message: '본인 계정은 삭제할 수 없습니다'
      });
    }
    
    const result = await deleteUser(userId);

    res.json({
      success: true,
      data: result,
      message: '사용자가 삭제되었습니다'
    });
  } catch (error) {
    console.error('사용자 삭제 오류:', error);
    res.status(400).json({
      success: false,
      message: '사용자 삭제에 실패했습니다'
    });
  }
});

/**
 * POST /api/admin/create-admin
 * 관리자 계정 생성
 */
router.post('/create-admin', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const adminData = createAdminSchema.parse(req.body);
    const newAdmin = await createAdminUser(adminData);

    res.status(201).json({
      success: true,
      data: newAdmin,
      message: '관리자 계정이 생성되었습니다'
    });
  } catch (error) {
    console.error('관리자 생성 오류:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : '관리자 계정 생성에 실패했습니다'
    });
  }
});

/**
 * POST /api/admin/users/:userId/reset-password
 * 사용자 비밀번호 재설정
 */
router.post('/users/:userId/reset-password', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = passwordResetSchema.parse(req.body);
    
    const result = await resetUserPassword(userId, newPassword);

    res.json({
      success: true,
      data: result,
      message: '비밀번호가 재설정되었습니다'
    });
  } catch (error) {
    console.error('비밀번호 재설정 오류:', error);
    res.status(400).json({
      success: false,
      message: '비밀번호 재설정에 실패했습니다'
    });
  }
});

/**
 * GET /api/admin/users/:userId/activity
 * 사용자 활동 로그 조회
 */
router.get('/users/:userId/activity', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    
    const activityLog = await getUserActivityLog(userId, limit);

    res.json({
      success: true,
      data: activityLog
    });
  } catch (error) {
    console.error('활동 로그 조회 오류:', error);
    res.status(400).json({
      success: false,
      message: '활동 로그 조회에 실패했습니다'
    });
  }
});

export default router;