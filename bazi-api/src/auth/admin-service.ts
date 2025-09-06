import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: 'createdAt' | 'lastLoginAt' | 'email' | 'displayName';
  sortOrder?: 'asc' | 'desc';
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  newUsersThisMonth: number;
  newUsersToday: number;
}

/**
 * 사용자 목록 조회 (관리자용)
 */
export async function getUserList(params: UserListParams = {}) {
  const {
    page = 1,
    limit = 20,
    search = '',
    role = '',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = params;

  const skip = (page - 1) * limit;

  // 검색 조건 구성
  const where: any = {};
  
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { displayName: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  if (role) {
    where.role = role;
  }

  // 정렬 조건
  const orderBy: any = {};
  orderBy[sortBy] = sortOrder;

  // 사용자 목록 조회
  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        prefs: {
          select: {
            language: true,
            currentResidenceCity: true,
            occupation: true
          }
        },
        birthData: {
          select: {
            birthDate: true,
            birthPlace: true
          }
        }
      },
      orderBy,
      skip,
      take: limit
    }),
    prisma.user.count({ where })
  ]);

  return {
    users: users.map(user => ({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      language: user.prefs?.language,
      city: user.prefs?.currentResidenceCity,
      occupation: user.prefs?.occupation,
      birthDate: user.birthData?.birthDate,
      birthPlace: user.birthData?.birthPlace
    })),
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNext: skip + limit < totalCount,
      hasPrev: page > 1
    }
  };
}

/**
 * 사용자 통계 조회
 */
export async function getUserStats(): Promise<UserStats> {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalUsers,
    activeUsers,
    adminUsers,
    newUsersThisMonth,
    newUsersToday
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: { in: ['admin', 'super_admin'] } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfToday } } })
  ]);

  return {
    totalUsers,
    activeUsers,
    inactiveUsers: totalUsers - activeUsers,
    adminUsers,
    newUsersThisMonth,
    newUsersToday
  };
}

/**
 * 사용자 상세 정보 조회
 */
export async function getUserDetail(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      prefs: true,
      birthData: true,
      contacts: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              displayName: true
            }
          }
        }
      },
      contactedBy: {
        include: {
          registeredUser: {
            select: {
              id: true,
              email: true,
              displayName: true
            }
          }
        }
      }
    }
  });

  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다');
  }

  return user;
}

/**
 * 사용자 역할 변경
 */
export async function updateUserRole(userId: string, newRole: string, adminUserId: string) {
  // 슈퍼 관리자 역할은 슈퍼 관리자만 변경 가능
  const adminUser = await prisma.user.findUnique({
    where: { id: adminUserId },
    select: { role: true }
  });

  if (newRole === 'super_admin' && adminUser?.role !== 'super_admin') {
    throw new Error('슈퍼 관리자 권한은 슈퍼 관리자만 부여할 수 있습니다');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true
    }
  });

  return updatedUser;
}

/**
 * 사용자 활성화/비활성화
 */
export async function toggleUserStatus(userId: string, isActive: boolean) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive },
    select: {
      id: true,
      email: true,
      displayName: true,
      isActive: true
    }
  });

  return updatedUser;
}

/**
 * 사용자 계정 삭제 (관리자용)
 */
export async function deleteUser(userId: string) {
  // 관련 데이터가 CASCADE로 삭제됨
  await prisma.user.delete({
    where: { id: userId }
  });

  return { success: true, message: '사용자가 삭제되었습니다' };
}

/**
 * 관리자 계정 생성
 */
export async function createAdminUser(data: {
  email: string;
  password: string;
  displayName: string;
  role: 'admin' | 'super_admin';
}) {
  // 이메일 중복 검사
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existingUser) {
    throw new Error('이미 사용 중인 이메일입니다');
  }

  // 비밀번호 해시화
  const passwordHash = await argon2.hash(data.password);

  // 관리자 계정 생성
  const admin = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: data.email,
        passwordHash,
        displayName: data.displayName,
        role: data.role
      }
    });

    // 기본 설정 생성
    await tx.userPrefs.create({
      data: {
        userId: user.id,
        language: 'ko',
        termsAcceptedAt: new Date().toISOString(),
        privacyAcceptedAt: new Date().toISOString()
      }
    });

    return user;
  });

  return {
    id: admin.id,
    email: admin.email,
    displayName: admin.displayName,
    role: admin.role
  };
}

/**
 * 사용자 비밀번호 재설정 (관리자용)
 */
export async function resetUserPassword(userId: string, newPassword: string) {
  const passwordHash = await argon2.hash(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash }
  });

  return { success: true, message: '비밀번호가 재설정되었습니다' };
}

/**
 * 사용자 활동 로그 조회
 */
export async function getUserActivityLog(userId: string, limit: number = 50) {
  // 실제 구현에서는 별도의 로그 테이블을 사용할 수 있음
  // 현재는 기본 정보만 반환
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return {
    userId,
    activities: [
      {
        type: 'account_created',
        timestamp: user?.createdAt,
        description: '계정이 생성되었습니다'
      },
      {
        type: 'last_login',
        timestamp: user?.lastLoginAt,
        description: '마지막 로그인'
      }
    ].filter(activity => activity.timestamp)
  };
}