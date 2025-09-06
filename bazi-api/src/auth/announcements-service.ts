import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  isSticky?: boolean;
  
  // 다국어 지원
  titleKo?: string;
  contentKo?: string;
  titleEn?: string;
  contentEn?: string;
  titleZh?: string;
  contentZh?: string;
  
  // 게시 기간
  publishAt?: Date;
  expiresAt?: Date;
}

export interface UpdateAnnouncementInput extends Partial<CreateAnnouncementInput> {
  isActive?: boolean;
}

export interface AnnouncementListParams {
  page?: number;
  limit?: number;
  search?: string;
  priority?: string;
  isActive?: boolean;
  isSticky?: boolean;
  language?: string;
  sortBy?: 'createdAt' | 'publishAt' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 공지사항 생성
 */
export async function createAnnouncement(adminUserId: string, input: CreateAnnouncementInput) {
  const announcement = await prisma.announcement.create({
    data: {
      title: input.title,
      content: input.content,
      priority: input.priority || 'normal',
      isSticky: input.isSticky || false,
      titleKo: input.titleKo,
      contentKo: input.contentKo,
      titleEn: input.titleEn,
      contentEn: input.contentEn,
      titleZh: input.titleZh,
      contentZh: input.contentZh,
      publishAt: input.publishAt || new Date(),
      expiresAt: input.expiresAt,
      createdBy: adminUserId
    }
  });

  return announcement;
}

/**
 * 공지사항 목록 조회 (사용자용)
 */
export async function getActiveAnnouncements(params: AnnouncementListParams = {}) {
  const {
    page = 1,
    limit = 10,
    language = 'ko',
    sortBy = 'publishAt',
    sortOrder = 'desc'
  } = params;

  const skip = (page - 1) * limit;
  const now = new Date();

  // 활성화된 공지사항만 조회
  const where = {
    isActive: true,
    publishAt: { lte: now },
    OR: [
      { expiresAt: null },
      { expiresAt: { gt: now } }
    ]
  };

  // 정렬 조건 (sticky가 우선, 그 다음 선택한 정렬)
  const orderBy = [
    { isSticky: 'desc' as const },
    { [sortBy]: sortOrder as const }
  ];

  const [announcements, totalCount] = await Promise.all([
    prisma.announcement.findMany({
      where,
      orderBy,
      skip,
      take: limit
    }),
    prisma.announcement.count({ where })
  ]);

  // 언어별 제목과 내용 반환
  const processedAnnouncements = announcements.map(ann => ({
    id: ann.id,
    title: getLocalizedContent(ann, 'title', language),
    content: getLocalizedContent(ann, 'content', language),
    priority: ann.priority,
    isSticky: ann.isSticky,
    publishAt: ann.publishAt,
    expiresAt: ann.expiresAt,
    createdAt: ann.createdAt
  }));

  return {
    announcements: processedAnnouncements,
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
 * 공지사항 목록 조회 (관리자용)
 */
export async function getAnnouncementList(params: AnnouncementListParams = {}) {
  const {
    page = 1,
    limit = 20,
    search = '',
    priority = '',
    isActive,
    isSticky,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = params;

  const skip = (page - 1) * limit;

  // 검색 조건 구성
  const where: any = {};
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
      { titleKo: { contains: search, mode: 'insensitive' } },
      { contentKo: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  if (priority) {
    where.priority = priority;
  }
  
  if (typeof isActive === 'boolean') {
    where.isActive = isActive;
  }
  
  if (typeof isSticky === 'boolean') {
    where.isSticky = isSticky;
  }

  // 정렬 조건
  const orderBy: any = {};
  orderBy[sortBy] = sortOrder;

  const [announcements, totalCount] = await Promise.all([
    prisma.announcement.findMany({
      where,
      orderBy,
      skip,
      take: limit
    }),
    prisma.announcement.count({ where })
  ]);

  return {
    announcements,
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
 * 공지사항 상세 조회
 */
export async function getAnnouncementDetail(id: string, isAdmin: boolean = false) {
  const where: any = { id };
  
  // 일반 사용자는 활성화된 공지사항만 조회 가능
  if (!isAdmin) {
    const now = new Date();
    where.isActive = true;
    where.publishAt = { lte: now };
    where.OR = [
      { expiresAt: null },
      { expiresAt: { gt: now } }
    ];
  }

  const announcement = await prisma.announcement.findFirst({ where });

  if (!announcement) {
    throw new Error('공지사항을 찾을 수 없습니다');
  }

  return announcement;
}

/**
 * 공지사항 수정
 */
export async function updateAnnouncement(id: string, input: UpdateAnnouncementInput) {
  const updatedAnnouncement = await prisma.announcement.update({
    where: { id },
    data: input
  });

  return updatedAnnouncement;
}

/**
 * 공지사항 삭제
 */
export async function deleteAnnouncement(id: string) {
  await prisma.announcement.delete({
    where: { id }
  });

  return { success: true, message: '공지사항이 삭제되었습니다' };
}

/**
 * 공지사항 통계
 */
export async function getAnnouncementStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalAnnouncements,
    activeAnnouncements,
    stickyAnnouncements,
    expiredAnnouncements,
    newAnnouncementsThisMonth
  ] = await Promise.all([
    prisma.announcement.count(),
    prisma.announcement.count({
      where: {
        isActive: true,
        publishAt: { lte: now },
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } }
        ]
      }
    }),
    prisma.announcement.count({ where: { isSticky: true, isActive: true } }),
    prisma.announcement.count({
      where: {
        expiresAt: { lt: now },
        isActive: true
      }
    }),
    prisma.announcement.count({
      where: { createdAt: { gte: startOfMonth } }
    })
  ]);

  return {
    totalAnnouncements,
    activeAnnouncements,
    stickyAnnouncements,
    expiredAnnouncements,
    newAnnouncementsThisMonth
  };
}

/**
 * 공지사항 일괄 작업
 */
export async function bulkUpdateAnnouncements(ids: string[], updates: Partial<UpdateAnnouncementInput>) {
  const result = await prisma.announcement.updateMany({
    where: { id: { in: ids } },
    data: updates
  });

  return {
    success: true,
    updatedCount: result.count,
    message: `${result.count}개의 공지사항이 업데이트되었습니다`
  };
}

/**
 * 만료된 공지사항 자동 비활성화
 */
export async function deactivateExpiredAnnouncements() {
  const now = new Date();
  
  const result = await prisma.announcement.updateMany({
    where: {
      expiresAt: { lt: now },
      isActive: true
    },
    data: { isActive: false }
  });

  return {
    success: true,
    deactivatedCount: result.count,
    message: `${result.count}개의 만료된 공지사항이 비활성화되었습니다`
  };
}

/**
 * 언어별 콘텐츠 반환 헬퍼 함수
 */
function getLocalizedContent(announcement: any, field: 'title' | 'content', language: string): string {
  const langField = `${field}${language.charAt(0).toUpperCase() + language.slice(1)}`;
  return announcement[langField] || announcement[field];
}