import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { createAdminUser } from '../src/auth/admin-service';

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    console.log('🔧 슈퍼 관리자 계정 생성 스크립트를 시작합니다...');
    
    // 기존 슈퍼 관리자 확인
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: 'super_admin' }
    });

    if (existingSuperAdmin) {
      console.log('⚠️  이미 슈퍼 관리자 계정이 존재합니다:', existingSuperAdmin.email);
      return;
    }

    // 슈퍼 관리자 정보 설정
    const superAdminData = {
      email: 'admin@fortune-teller.com',
      password: 'Admin123!@#',  // 실제 운영 시에는 더 강력한 비밀번호 사용
      displayName: '시스템 관리자',
      role: 'super_admin' as const
    };

    // 슈퍼 관리자 생성
    const superAdmin = await createAdminUser(superAdminData);

    console.log('✅ 슈퍼 관리자 계정이 생성되었습니다!');
    console.log('📧 이메일:', superAdminData.email);
    console.log('🔑 비밀번호:', superAdminData.password);
    console.log('👤 표시명:', superAdminData.displayName);
    console.log('🎭 역할:', superAdminData.role);
    console.log('');
    console.log('⚠️  보안을 위해 첫 로그인 후 반드시 비밀번호를 변경하세요!');
    console.log('🌐 관리자 로그인 페이지: http://localhost:3001/login-admin.html');

  } catch (error) {
    console.error('❌ 슈퍼 관리자 생성 실패:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 추가 관리자 계정 생성 (선택사항)
async function createAdditionalAdmins() {
  try {
    console.log('\n🔧 추가 관리자 계정들을 생성합니다...');

    const additionalAdmins = [
      {
        email: 'manager@fortune-teller.com',
        password: 'Manager123!',
        displayName: '콘텐츠 관리자',
        role: 'admin' as const
      }
    ];

    for (const adminData of additionalAdmins) {
      try {
        const admin = await createAdminUser(adminData);
        console.log(`✅ ${adminData.displayName} 계정 생성 완료: ${adminData.email}`);
      } catch (error) {
        if (error instanceof Error && error.message.includes('이미 사용 중인 이메일')) {
          console.log(`⚠️  ${adminData.email}은 이미 존재하는 계정입니다.`);
        } else {
          console.error(`❌ ${adminData.email} 계정 생성 실패:`, error);
        }
      }
    }

  } catch (error) {
    console.error('❌ 추가 관리자 생성 실패:', error);
  }
}

// 데이터베이스 연결 테스트
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ 데이터베이스 연결 성공');
    
    // 테이블 존재 확인
    const userCount = await prisma.user.count();
    console.log(`📊 현재 사용자 수: ${userCount}`);
    
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error);
    throw error;
  }
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 관리자 계정 설정을 시작합니다...\n');
    
    // 데이터베이스 연결 테스트
    await testDatabaseConnection();
    
    // 슈퍼 관리자 생성
    await createSuperAdmin();
    
    // 추가 관리자 생성 (원하는 경우)
    await createAdditionalAdmins();
    
    console.log('\n🎉 관리자 계정 설정이 완료되었습니다!');
    console.log('이제 웹 인터페이스를 통해 관리자 기능을 사용할 수 있습니다.');
    
  } catch (error) {
    console.error('\n💥 관리자 계정 설정 중 오류가 발생했습니다:', error);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  main();
}

export { createSuperAdmin, createAdditionalAdmins };