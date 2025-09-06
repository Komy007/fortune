import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from './jwt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 인증된 사용자 정보를 Request에 추가
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        displayName: string;
        role: string;
      };
    }
  }
}

/**
 * JWT 토큰 검증 미들웨어
 */
export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: '토큰이 제공되지 않았습니다' 
      });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ 
        success: false, 
        message: '유효하지 않은 토큰입니다' 
      });
    }

    // 사용자 정보 조회 (역할 포함)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: '사용자를 찾을 수 없거나 비활성화된 계정입니다' 
      });
    }

    // 마지막 로그인 시간 업데이트
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    req.user = {
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('토큰 인증 오류:', error);
    return res.status(401).json({ 
      success: false, 
      message: '인증에 실패했습니다' 
    });
  }
}

/**
 * 관리자 권한 확인 미들웨어
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: '인증이 필요합니다' 
    });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({ 
      success: false, 
      message: '관리자 권한이 필요합니다' 
    });
  }

  next();
}

/**
 * 슈퍼 관리자 권한 확인 미들웨어
 */
export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: '인증이 필요합니다' 
    });
  }

  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ 
      success: false, 
      message: '슈퍼 관리자 권한이 필요합니다' 
    });
  }

  next();
}

/**
 * 사용자 자신의 데이터이거나 관리자인지 확인하는 미들웨어
 */
export function requireOwnerOrAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: '인증이 필요합니다' 
    });
  }

  const targetUserId = req.params.userId || req.body.userId;
  const isOwner = req.user.userId === targetUserId;
  const isAdmin = req.user.role === 'admin' || req.user.role === 'super_admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: '본인의 데이터이거나 관리자 권한이 필요합니다' 
    });
  }

  next();
}

/**
 * 역할별 권한 확인 유틸리티 함수
 */
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * 관리자 권한 레벨 확인
 */
export function getAdminLevel(role: string): number {
  switch (role) {
    case 'super_admin': return 3;
    case 'admin': return 2;
    case 'user': return 1;
    default: return 0;
  }
}