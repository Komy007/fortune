import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateContactInput {
  name: string;
  relationship: string;
  email?: string;
  phone?: string;
  notes?: string;
  
  // 출생 정보 (선택사항)
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  birthCountry?: string;
  birthTimezone?: string;
  sexAtBirth?: string;
}

export interface UpdateContactInput extends Partial<CreateContactInput> {
  isVisible?: boolean;
  canViewProfile?: boolean;
}

export interface ContactListParams {
  page?: number;
  limit?: number;
  search?: string;
  relationship?: string;
  sortBy?: 'createdAt' | 'name' | 'relationship';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 지인 등록
 */
export async function createContact(userId: string, input: CreateContactInput) {
  // 이미 등록된 이메일이 있는지 확인 (이메일이 제공된 경우)
  let linkedUserId = null;
  if (input.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true, displayName: true }
    });
    
    if (existingUser) {
      linkedUserId = existingUser.id;
    }
  }

  const contact = await prisma.contact.create({
    data: {
      registeredBy: userId,
      name: input.name,
      relationship: input.relationship,
      email: input.email,
      phone: input.phone,
      notes: input.notes,
      birthDate: input.birthDate,
      birthTime: input.birthTime,
      birthPlace: input.birthPlace,
      birthCountry: input.birthCountry,
      birthTimezone: input.birthTimezone,
      sexAtBirth: input.sexAtBirth,
      userId: linkedUserId
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          displayName: true,
          isActive: true
        }
      }
    }
  });

  return contact;
}

/**
 * 사용자의 지인 목록 조회
 */
export async function getContactList(userId: string, params: ContactListParams = {}) {
  const {
    page = 1,
    limit = 20,
    search = '',
    relationship = '',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = params;

  const skip = (page - 1) * limit;

  // 검색 조건 구성
  const where: any = {
    registeredBy: userId,
    isVisible: true
  };
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  if (relationship) {
    where.relationship = relationship;
  }

  // 정렬 조건
  const orderBy: any = {};
  orderBy[sortBy] = sortOrder;

  // 지인 목록 조회
  const [contacts, totalCount] = await Promise.all([
    prisma.contact.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            isActive: true,
            lastLoginAt: true
          }
        }
      },
      orderBy,
      skip,
      take: limit
    }),
    prisma.contact.count({ where })
  ]);

  return {
    contacts,
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
 * 지인 상세 정보 조회
 */
export async function getContactDetail(userId: string, contactId: string) {
  const contact = await prisma.contact.findFirst({
    where: {
      id: contactId,
      registeredBy: userId,
      isVisible: true
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          displayName: true,
          isActive: true,
          lastLoginAt: true
        }
      }
    }
  });

  if (!contact) {
    throw new Error('지인 정보를 찾을 수 없습니다');
  }

  return contact;
}

/**
 * 지인 정보 수정
 */
export async function updateContact(userId: string, contactId: string, input: UpdateContactInput) {
  // 권한 확인
  const existingContact = await prisma.contact.findFirst({
    where: {
      id: contactId,
      registeredBy: userId
    }
  });

  if (!existingContact) {
    throw new Error('수정할 권한이 없거나 지인 정보를 찾을 수 없습니다');
  }

  // 이메일이 변경된 경우 연결된 사용자 확인
  let linkedUserId = existingContact.userId;
  if (input.email && input.email !== existingContact.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true }
    });
    
    linkedUserId = existingUser?.id || null;
  }

  const updatedContact = await prisma.contact.update({
    where: { id: contactId },
    data: {
      ...input,
      userId: linkedUserId
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          displayName: true,
          isActive: true
        }
      }
    }
  });

  return updatedContact;
}

/**
 * 지인 삭제 (논리적 삭제)
 */
export async function deleteContact(userId: string, contactId: string) {
  // 권한 확인
  const existingContact = await prisma.contact.findFirst({
    where: {
      id: contactId,
      registeredBy: userId
    }
  });

  if (!existingContact) {
    throw new Error('삭제할 권한이 없거나 지인 정보를 찾을 수 없습니다');
  }

  // 논리적 삭제 (isVisible = false)
  await prisma.contact.update({
    where: { id: contactId },
    data: { isVisible: false }
  });

  return { success: true, message: '지인 정보가 삭제되었습니다' };
}

/**
 * 나를 등록한 사람들 조회
 */
export async function getContactedByList(userId: string) {
  const contacts = await prisma.contact.findMany({
    where: {
      userId: userId,
      isVisible: true
    },
    include: {
      registeredUser: {
        select: {
          id: true,
          email: true,
          displayName: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return contacts;
}

/**
 * 지인 관계 분석
 */
export async function getContactAnalytics(userId: string) {
  const [
    totalContacts,
    relationships,
    recentContacts,
    linkedUsers
  ] = await Promise.all([
    // 전체 지인 수
    prisma.contact.count({
      where: { registeredBy: userId, isVisible: true }
    }),
    
    // 관계별 통계
    prisma.contact.groupBy({
      by: ['relationship'],
      where: { registeredBy: userId, isVisible: true },
      _count: { relationship: true }
    }),
    
    // 최근 등록된 지인들
    prisma.contact.count({
      where: {
        registeredBy: userId,
        isVisible: true,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 최근 30일
        }
      }
    }),
    
    // 실제 가입한 지인들
    prisma.contact.count({
      where: {
        registeredBy: userId,
        isVisible: true,
        userId: { not: null }
      }
    })
  ]);

  return {
    totalContacts,
    relationshipBreakdown: relationships.map(r => ({
      relationship: r.relationship,
      count: r._count.relationship
    })),
    recentContacts,
    linkedUsers,
    registrationRate: totalContacts > 0 ? (linkedUsers / totalContacts * 100).toFixed(1) : '0'
  };
}

/**
 * 지인 초대 (이메일 기반)
 */
export async function inviteContact(userId: string, contactId: string) {
  const contact = await prisma.contact.findFirst({
    where: {
      id: contactId,
      registeredBy: userId,
      isVisible: true
    },
    include: {
      registeredUser: {
        select: {
          displayName: true
        }
      }
    }
  });

  if (!contact) {
    throw new Error('지인 정보를 찾을 수 없습니다');
  }

  if (!contact.email) {
    throw new Error('초대할 이메일이 등록되지 않았습니다');
  }

  if (contact.userId) {
    throw new Error('이미 가입한 사용자입니다');
  }

  // 실제 구현에서는 이메일 발송 서비스와 연동
  // 여기서는 초대 정보만 반환
  return {
    success: true,
    message: `${contact.name}에게 초대 이메일이 발송되었습니다`,
    inviteData: {
      email: contact.email,
      name: contact.name,
      inviterName: contact.registeredUser.displayName
    }
  };
}