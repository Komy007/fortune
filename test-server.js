const fetch = require('node-fetch');

async function testServer() {
    console.log('🔧 서버 테스트 시작...\n');
    
    try {
        // 1. 헬스체크 테스트
        console.log('1️⃣ 헬스체크 테스트');
        const healthResponse = await fetch('http://localhost:3000/api/health');
        const healthData = await healthResponse.json();
        console.log('✅ 헬스체크 성공:', healthData);
        
        // 2. 회원가입 테스트
        console.log('\n2️⃣ 회원가입 테스트');
        const registerData = {
            name: '테스트사용자',
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            birth_year: 1990,
            birth_month: 6,
            birth_day: 15,
            birth_hour: 12
        };
        
        const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });
        
        const registerResult = await registerResponse.json();
        if (registerResult.success) {
            console.log('✅ 회원가입 성공:', registerResult.user);
        } else {
            console.log('⚠️ 회원가입 결과:', registerResult.error);
        }
        
        // 3. 로그인 테스트
        console.log('\n3️⃣ 로그인 테스트');
        const loginData = {
            email: 'test@example.com',
            password: 'password123'
        };
        
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        
        const loginResult = await loginResponse.json();
        if (loginResult.success) {
            console.log('✅ 로그인 성공:', loginResult.user);
            console.log('🔐 토큰 발급됨:', loginResult.token ? '있음' : '없음');
        } else {
            console.log('❌ 로그인 실패:', loginResult.error);
        }
        
        console.log('\n🎉 테스트 완료!');
        
    } catch (error) {
        console.error('❌ 테스트 중 오류 발생:', error.message);
    }
}

testServer();
