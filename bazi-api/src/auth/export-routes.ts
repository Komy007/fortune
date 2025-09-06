import { Router } from 'express';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { authenticateToken, requireAdmin } from './admin-middleware';
import {
  exportUserData,
  exportContactData,
  exportAnnouncementData,
  createFullBackup,
  exportStatistics
} from './export-service';

const router = Router();

// 내보내기 옵션 스키마
const exportOptionsSchema = z.object({
  format: z.enum(['json', 'csv']).default('json'),
  includePersonalData: z.boolean().default(true),
  dateRange: z.object({
    from: z.string().datetime().transform(str => new Date(str)),
    to: z.string().datetime().transform(str => new Date(str))
  }).optional()
});

/**
 * POST /api/admin/export/users
 * 사용자 데이터 내보내기
 */
router.post('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const options = exportOptionsSchema.parse(req.body);
    const result = await exportUserData(options);

    res.json({
      success: true,
      data: result,
      message: '사용자 데이터가 성공적으로 내보내졌습니다'
    });
  } catch (error) {
    console.error('사용자 데이터 내보내기 오류:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : '사용자 데이터 내보내기에 실패했습니다'
    });
  }
});

/**
 * POST /api/admin/export/contacts
 * 지인 데이터 내보내기
 */
router.post('/contacts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const options = exportOptionsSchema.parse(req.body);
    const result = await exportContactData(options);

    res.json({
      success: true,
      data: result,
      message: '지인 데이터가 성공적으로 내보내졌습니다'
    });
  } catch (error) {
    console.error('지인 데이터 내보내기 오류:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : '지인 데이터 내보내기에 실패했습니다'
    });
  }
});

/**
 * POST /api/admin/export/announcements
 * 공지사항 데이터 내보내기
 */
router.post('/announcements', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const options = exportOptionsSchema.parse(req.body);
    const result = await exportAnnouncementData(options);

    res.json({
      success: true,
      data: result,
      message: '공지사항 데이터가 성공적으로 내보내졌습니다'
    });
  } catch (error) {
    console.error('공지사항 데이터 내보내기 오류:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : '공지사항 데이터 내보내기에 실패했습니다'
    });
  }
});

/**
 * POST /api/admin/export/backup
 * 전체 시스템 백업
 */
router.post('/backup', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const options = exportOptionsSchema.partial().parse(req.body);
    const result = await createFullBackup(options);

    res.json({
      success: true,
      data: result,
      message: '전체 백업이 성공적으로 생성되었습니다'
    });
  } catch (error) {
    console.error('전체 백업 오류:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : '전체 백업에 실패했습니다'
    });
  }
});

/**
 * GET /api/admin/export/statistics
 * 통계 데이터 내보내기
 */
router.get('/statistics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await exportStatistics();

    res.json({
      success: true,
      data: result,
      message: '통계 데이터가 성공적으로 내보내졌습니다'
    });
  } catch (error) {
    console.error('통계 데이터 내보내기 오류:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : '통계 데이터 내보내기에 실패했습니다'
    });
  }
});

/**
 * GET /api/admin/export/download/:fileName
 * 내보내기 파일 다운로드
 */
router.get('/download/:fileName', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(process.cwd(), 'exports', fileName);

    // 파일 존재 확인
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: '요청한 파일을 찾을 수 없습니다'
      });
    }

    // 파일명 보안 검사 (디렉토리 탐색 방지)
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 파일명입니다'
      });
    }

    // 파일 다운로드
    res.download(filePath, fileName, (error) => {
      if (error) {
        console.error('파일 다운로드 오류:', error);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: '파일 다운로드에 실패했습니다'
          });
        }
      }
    });

  } catch (error) {
    console.error('파일 다운로드 오류:', error);
    res.status(500).json({
      success: false,
      message: '파일 다운로드에 실패했습니다'
    });
  }
});

/**
 * GET /api/admin/export/files
 * 내보내기 파일 목록 조회
 */
router.get('/files', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const exportsDir = path.join(process.cwd(), 'exports');
    
    if (!fs.existsSync(exportsDir)) {
      return res.json({
        success: true,
        data: [],
        message: '내보내기 파일이 없습니다'
      });
    }

    const files = fs.readdirSync(exportsDir).map(fileName => {
      const filePath = path.join(exportsDir, fileName);
      const stats = fs.statSync(filePath);
      
      return {
        fileName,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      };
    }).sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime());

    res.json({
      success: true,
      data: files,
      message: '내보내기 파일 목록을 조회했습니다'
    });

  } catch (error) {
    console.error('파일 목록 조회 오류:', error);
    res.status(500).json({
      success: false,
      message: '파일 목록 조회에 실패했습니다'
    });
  }
});

/**
 * DELETE /api/admin/export/files/:fileName
 * 내보내기 파일 삭제
 */
router.delete('/files/:fileName', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(process.cwd(), 'exports', fileName);

    // 파일명 보안 검사
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 파일명입니다'
      });
    }

    // 파일 존재 확인
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: '삭제할 파일을 찾을 수 없습니다'
      });
    }

    // 파일 삭제
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: '파일이 성공적으로 삭제되었습니다'
    });

  } catch (error) {
    console.error('파일 삭제 오류:', error);
    res.status(500).json({
      success: false,
      message: '파일 삭제에 실패했습니다'
    });
  }
});

export default router;