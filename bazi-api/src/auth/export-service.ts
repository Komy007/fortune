import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

export interface ExportOptions {
  format: 'json' | 'csv';
  includePersonalData?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

/**
 * 사용자 데이터 내보내기
 */
export async function exportUserData(options: ExportOptions) {
  try {
    const { format, includePersonalData = true, dateRange } = options;

    // 날짜 범위 조건 구성
    const whereCondition: any = {};
    if (dateRange) {
      whereCondition.createdAt = {
        gte: dateRange.from,
        lte: dateRange.to
      };
    }

    // 사용자 데이터 조회
    const users = await prisma.user.findMany({
      where: whereCondition,
      include: {
        prefs: true,
        birthData: includePersonalData,
        contacts: {
          select: {
            id: true,
            name: true,
            relationship: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 개인정보 제거 (선택사항)
    const processedUsers = users.map(user => ({
      id: user.id,
      email: includePersonalData ? user.email : '***',
      displayName: includePersonalData ? user.displayName : '***',
      role: user.role,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      prefs: user.prefs ? {
        language: user.prefs.language,
        reportTimezone: user.prefs.reportTimezone,
        notificationEmailOptIn: user.prefs.notificationEmailOptIn,
        currentResidenceCity: includePersonalData ? user.prefs.currentResidenceCity : '***',
        occupation: includePersonalData ? user.prefs.occupation : '***'
      } : null,
      birthData: includePersonalData && user.birthData ? {
        birthDate: user.birthData.birthDate,
        birthPlace: user.birthData.birthPlace,
        birthCountry: user.birthData.birthCountry,
        sexAtBirth: user.birthData.sexAtBirth
      } : null,
      contactsCount: user.contacts.length
    }));

    // 파일 생성
    const fileName = `users_export_${new Date().toISOString().split('T')[0]}.${format}`;
    const filePath = await createExportFile(processedUsers, fileName, format);

    return {
      success: true,
      fileName,
      filePath,
      recordCount: processedUsers.length,
      createdAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('사용자 데이터 내보내기 실패:', error);
    throw new Error('사용자 데이터 내보내기에 실패했습니다');
  }
}

/**
 * 지인 데이터 내보내기
 */
export async function exportContactData(options: ExportOptions) {
  try {
    const { format, includePersonalData = true, dateRange } = options;

    // 날짜 범위 조건 구성
    const whereCondition: any = {
      isVisible: true
    };
    if (dateRange) {
      whereCondition.createdAt = {
        gte: dateRange.from,
        lte: dateRange.to
      };
    }

    // 지인 데이터 조회
    const contacts = await prisma.contact.findMany({
      where: whereCondition,
      include: {
        registeredUser: {
          select: {
            id: true,
            email: true,
            displayName: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            isActive: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 개인정보 제거 (선택사항)
    const processedContacts = contacts.map(contact => ({
      id: contact.id,
      name: includePersonalData ? contact.name : '***',
      relationship: contact.relationship,
      email: includePersonalData ? contact.email : '***',
      phone: includePersonalData ? contact.phone : '***',
      birthDate: includePersonalData ? contact.birthDate : null,
      birthPlace: includePersonalData ? contact.birthPlace : null,
      isLinkedUser: !!contact.userId,
      registeredBy: {
        id: contact.registeredUser.id,
        email: includePersonalData ? contact.registeredUser.email : '***',
        displayName: includePersonalData ? contact.registeredUser.displayName : '***'
      },
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt
    }));

    // 파일 생성
    const fileName = `contacts_export_${new Date().toISOString().split('T')[0]}.${format}`;
    const filePath = await createExportFile(processedContacts, fileName, format);

    return {
      success: true,
      fileName,
      filePath,
      recordCount: processedContacts.length,
      createdAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('지인 데이터 내보내기 실패:', error);
    throw new Error('지인 데이터 내보내기에 실패했습니다');
  }
}

/**
 * 공지사항 데이터 내보내기
 */
export async function exportAnnouncementData(options: ExportOptions) {
  try {
    const { format, dateRange } = options;

    // 날짜 범위 조건 구성
    const whereCondition: any = {};
    if (dateRange) {
      whereCondition.createdAt = {
        gte: dateRange.from,
        lte: dateRange.to
      };
    }

    // 공지사항 데이터 조회
    const announcements = await prisma.announcement.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 파일 생성
    const fileName = `announcements_export_${new Date().toISOString().split('T')[0]}.${format}`;
    const filePath = await createExportFile(announcements, fileName, format);

    return {
      success: true,
      fileName,
      filePath,
      recordCount: announcements.length,
      createdAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('공지사항 데이터 내보내기 실패:', error);
    throw new Error('공지사항 데이터 내보내기에 실패했습니다');
  }
}

/**
 * 전체 시스템 백업
 */
export async function createFullBackup(options: Partial<ExportOptions> = {}) {
  try {
    const backupOptions: ExportOptions = {
      format: 'json',
      includePersonalData: true,
      ...options
    };

    const backupData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        includePersonalData: backupOptions.includePersonalData
      },
      users: await exportUserData(backupOptions),
      contacts: await exportContactData(backupOptions),
      announcements: await exportAnnouncementData(backupOptions)
    };

    // 백업 파일 생성
    const fileName = `full_backup_${new Date().toISOString().split('T')[0]}.json`;
    const filePath = await createExportFile(backupData, fileName, 'json');

    return {
      success: true,
      fileName,
      filePath,
      backupData: {
        userCount: backupData.users.recordCount,
        contactCount: backupData.contacts.recordCount,
        announcementCount: backupData.announcements.recordCount
      },
      createdAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('전체 백업 실패:', error);
    throw new Error('전체 백업에 실패했습니다');
  }
}

/**
 * 통계 데이터 내보내기
 */
export async function exportStatistics() {
  try {
    const [
      userStats,
      contactStats,
      announcementStats
    ] = await Promise.all([
      getUserStatistics(),
      getContactStatistics(),
      getAnnouncementStatistics()
    ]);

    const statsData = {
      generatedAt: new Date().toISOString(),
      users: userStats,
      contacts: contactStats,
      announcements: announcementStats
    };

    const fileName = `statistics_${new Date().toISOString().split('T')[0]}.json`;
    const filePath = await createExportFile(statsData, fileName, 'json');

    return {
      success: true,
      fileName,
      filePath,
      createdAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('통계 데이터 내보내기 실패:', error);
    throw new Error('통계 데이터 내보내기에 실패했습니다');
  }
}

/**
 * 파일 생성 헬퍼 함수
 */
async function createExportFile(data: any, fileName: string, format: 'json' | 'csv'): Promise<string> {
  // exports 디렉토리 생성
  const exportsDir = path.join(process.cwd(), 'exports');
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  const filePath = path.join(exportsDir, fileName);

  if (format === 'json') {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } else if (format === 'csv') {
    const csvContent = convertToCSV(data);
    fs.writeFileSync(filePath, csvContent, 'utf8');
  }

  return filePath;
}

/**
 * JSON을 CSV로 변환
 */
function convertToCSV(data: any[]): string {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }

  // 헤더 추출
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  // 데이터 행 추가
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // 값이 객체인 경우 JSON 문자열로 변환
      if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      // 문자열에 쉼표나 따옴표가 포함된 경우 따옴표로 감싸기
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

/**
 * 사용자 통계 조회
 */
async function getUserStatistics() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
  const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

  const [
    totalUsers,
    activeUsers,
    newUsersLast30Days,
    newUsersLast7Days,
    usersByRole,
    usersByLanguage
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.groupBy({
      by: ['role'],
      _count: { role: true }
    }),
    prisma.userPrefs.groupBy({
      by: ['language'],
      _count: { language: true }
    })
  ]);

  return {
    totalUsers,
    activeUsers,
    newUsersLast30Days,
    newUsersLast7Days,
    usersByRole: usersByRole.map(r => ({ role: r.role, count: r._count.role })),
    usersByLanguage: usersByLanguage.map(l => ({ language: l.language, count: l._count.language }))
  };
}

/**
 * 지인 통계 조회
 */
async function getContactStatistics() {
  const [
    totalContacts,
    contactsByRelationship,
    linkedContacts,
    contactsWithBirthData
  ] = await Promise.all([
    prisma.contact.count({ where: { isVisible: true } }),
    prisma.contact.groupBy({
      by: ['relationship'],
      where: { isVisible: true },
      _count: { relationship: true }
    }),
    prisma.contact.count({ where: { isVisible: true, userId: { not: null } } }),
    prisma.contact.count({ where: { isVisible: true, birthDate: { not: null } } })
  ]);

  return {
    totalContacts,
    contactsByRelationship: contactsByRelationship.map(r => ({ 
      relationship: r.relationship, 
      count: r._count.relationship 
    })),
    linkedContacts,
    contactsWithBirthData
  };
}

/**
 * 공지사항 통계 조회
 */
async function getAnnouncementStatistics() {
  const now = new Date();

  const [
    totalAnnouncements,
    activeAnnouncements,
    announcementsByPriority,
    stickyAnnouncements
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
    prisma.announcement.groupBy({
      by: ['priority'],
      _count: { priority: true }
    }),
    prisma.announcement.count({ where: { isSticky: true, isActive: true } })
  ]);

  return {
    totalAnnouncements,
    activeAnnouncements,
    announcementsByPriority: announcementsByPriority.map(p => ({ 
      priority: p.priority, 
      count: p._count.priority 
    })),
    stickyAnnouncements
  };
}