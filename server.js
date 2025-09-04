const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const BaziEngine = require('./bazi-engine');

// 점성술 모듈 (bazi-api에서 가져오기)
const astroRouter = require('./bazi-api/src/astro/routes');
// 관상학 모듈 (bazi-api에서 가져오기)
const physioRouter = require('./bazi-api/src/physio/routes');
// 타로 모듈 (bazi-api에서 가져오기)
const tarotRouter = require('./bazi-api/src/tarot/routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const LLM_BASE_URL = (process.env.LLM_BASE_URL || 'http://127.0.0.1:8080/v1').replace(/\/$/, '');

// CORS 미들웨어 설정 (스마트폰 접속 허용)
app.use((req, res, next) => {
  // 모든 도메인에서 접근 허용 (개발 환경)
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // OPTIONS 요청 처리 (preflight)
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// CSP: 이미지 소스 허용 (self, data, blob, https)
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "img-src 'self' data: blob: https:;");
  next();
});
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
// 정적 이미지 폴더(img)를 /img 경로로 서빙
app.use('/img', express.static(path.join(__dirname, 'img')));
// 호환용: /image 경로를 public/image 우선, 없으면 public/img에서 서빙
app.use('/image', express.static(path.join(__dirname, 'public', 'image')));
app.use('/image', express.static(path.join(__dirname, 'public', 'img')));

// 데이터베이스 초기화 (Render 호환)
const dbPath = process.env.NODE_ENV === 'production' ? '/tmp/app.db' : './data/app.db';
const db = new sqlite3.Database(dbPath);
db.exec('PRAGMA journal_mode = WAL;');

// 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    username TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    birth_year INTEGER,
    birth_month INTEGER,
    birth_day INTEGER,
    birth_hour INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    result TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS user_kv (
    user_id INTEGER NOT NULL,
    k TEXT NOT NULL,
    v TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, k),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- 신규: 관계(인연궁합) 테이블
  CREATE TABLE IF NOT EXISTS relationships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    birth_year INTEGER,
    birth_month INTEGER,
    birth_day INTEGER,
    birth_hour INTEGER,
    birth_time TEXT,
    birthplace TEXT,
    sex TEXT,
    relationship_type TEXT,
    result TEXT,
    favorite INTEGER DEFAULT 0,
    memo TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- 공지사항 테이블
  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL,
    is_active INTEGER DEFAULT 1,
    priority INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
  );
`, (err) => {
  if (err) {
    console.error('Database initialization error:', err);
  } else {
    console.log('Database tables created successfully');
  }
});

// 고유 제약 인덱스 (중복 방지)
db.exec(`DROP INDEX IF EXISTS idx_relationships_unique;`, (err) => {
  if (err) console.log('인덱스 삭제 중 오류 (무시 가능):', err.message);
});

db.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_relationships_unique
  ON relationships(user_id, name, birth_year, birth_month, birth_day, birth_time, birthplace);
`, (err) => {
  if (err) {
    console.log('인덱스 생성 중 오류 (무시 가능):', err.message);
  } else {
    console.log('인덱스 생성 완료');
  }
});

// 기본 관리자 사용자 생성 (ID: 1)
try {
  const adminExists = db.prepare('SELECT id FROM users WHERE id = 1').get();
  if (!adminExists) {
    console.log('🔧 기본 관리자 사용자 생성 중...');
    const adminStmt = db.prepare(`
      INSERT INTO users (id, email, name, username, password_hash, birth_year, birth_month, birth_day, birth_hour) 
      VALUES (1, 'admin@fortune.com', '관리자', 'admin', ?, 1990, 1, 1, 0)
    `);
    const adminPasswordHash = bcrypt.hashSync('12341234', 10);
    adminStmt.run(adminPasswordHash);
    console.log('✅ 기본 관리자 사용자 생성 완료 (ID: 1)');
  }
} catch (error) {
  console.log('⚠️ 기본 관리자 사용자 생성 실패 (이미 존재할 수 있음):', error.message);
}

// 인증 미들웨어
function authenticateToken(req, res, next) {
  // Authorization 헤더에서 토큰 확인 (Bearer 토큰)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  // 쿠키에서 토큰 확인 (기존 방식)
  const cookieToken = req.cookies.token;
  
  // 둘 중 하나라도 있으면 사용
  const finalToken = token || cookieToken;
  
  if (!finalToken) {
    console.log('❌ 인증 실패: 토큰 없음');
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const decoded = jwt.verify(finalToken, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('✅ 인증 성공:', decoded);
    next();
  } catch (error) {
    console.log('❌ 인증 실패: 토큰 검증 오류:', error.message);
    return res.status(401).json({ error: 'invalid_token' });
  }
}

// 회원가입 API
app.post('/api/auth/register', async (req, res) => {
  console.log('📝 회원가입 요청 받음:', { email: req.body.email, name: req.body.name });
  
  try {
    const { email, name, username, password, birth_year, birth_month, birth_day, birth_hour, birthplace, calendar_type, sex, time_accuracy, birth_time } = req.body;
    
    if (!email || !name || !password) {
      return res.status(400).json({ 
        error: 'missing_required_fields',
        message: '필수 정보가 누락되었습니다. 이름, 이메일, 비밀번호를 모두 입력해주세요.'
      });
    }

    // 비밀번호 길이 검증
    if (password.length < 8) {
      return res.status(400).json({
        error: 'password_too_short',
        message: '비밀번호는 8자 이상이어야 합니다.'
      });
    }

    // 비밀번호 해시화
    const passwordHash = await bcrypt.hash(password, 10);
    
    // 사용자 생성
    const stmt = db.prepare(`
      INSERT INTO users (email, name, username, password_hash, birth_year, birth_month, birth_day, birth_hour) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(email, name, username, passwordHash, birth_year, birth_month, birth_day, birth_hour);

    // 추가 정보 저장 (user_kv 테이블)
    try {
      const upsertKv = db.prepare(`
        INSERT INTO user_kv (user_id, k, v) VALUES (?, ?, ?)
        ON CONFLICT(user_id, k) DO UPDATE SET v = excluded.v, updated_at = CURRENT_TIMESTAMP
      `);
      const userId = result.lastInsertRowid;
      const extras = {
        birthplace,
        calendar_type,
        sex,
        time_accuracy,
        birth_time,
        birth_year,
        birth_month,
        birth_day
      };
      Object.entries(extras).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          upsertKv.run(userId, key, JSON.stringify(value));
        }
      });
    } catch (e) {
      console.warn('추가 가입 정보 저장 실패(무시):', e.message);
    }
    
    // JWT 토큰 생성
    const token = jwt.sign(
      { uid: result.lastInsertRowid, email, name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // 보안 쿠키 설정
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
      secure: process.env.NODE_ENV === 'production'
    });
    
    res.json({ 
      success: true, 
      token: token, // 토큰을 응답에 포함
      user: { 
        id: result.lastInsertRowid, 
        email, 
        name, 
        username,
        birth_year,
        birth_month,
        birth_day,
        birth_hour
      } 
    });
    
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      if (error.message.includes('email')) {
        return res.status(409).json({ 
          error: 'email_exists',
          message: '이미 사용 중인 이메일입니다.'
        });
      } else if (error.message.includes('username')) {
        return res.status(409).json({ 
          error: 'username_exists',
          message: '이미 사용 중인 사용자명입니다.'
        });
      } else {
        return res.status(409).json({ 
          error: 'duplicate_entry',
          message: '이미 존재하는 계정입니다.'
        });
      }
    }
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'registration_failed',
      message: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.'
    });
  }
});

// 로그인 API
app.post('/api/auth/login', async (req, res) => {
  console.log('🔐 로그인 요청 받음:', { email: req.body.email, hasPassword: !!req.body.password });
  
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('❌ 로그인 실패: 필수 정보 누락');
      return res.status(400).json({ error: 'missing_credentials' });
    }
    
    // 사용자 조회
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    console.log('👤 사용자 조회 결과:', user ? '사용자 발견' : '사용자 없음');
    
    if (!user) {
      console.log('❌ 로그인 실패: 사용자 없음');
      return res.status(401).json({ error: 'user_not_found', message: '해당 이메일로 가입된 회원이 없습니다.' });
    }
    
    // 비밀번호 검증
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log('🔑 비밀번호 검증 결과:', isValidPassword ? '성공' : '실패');
    
    if (!isValidPassword) {
      console.log('❌ 로그인 실패: 비밀번호 불일치');
      return res.status(401).json({ error: 'invalid_password', message: '비밀번호가 올바르지 않습니다.' });
    }
    
    // JWT 토큰 생성
    const token = jwt.sign(
      { uid: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // 보안 쿠키 설정
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
      secure: process.env.NODE_ENV === 'production'
    });
    
    console.log('✅ 로그인 성공:', user.name);
    
    res.json({ 
      success: true, 
      token: token, // 토큰을 응답에 포함
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        birthYear: user.birth_year,
        birthMonth: user.birth_month,
        birthDay: user.birth_day,
        birthHour: user.birth_hour
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'login_failed', message: '로그인 중 오류가 발생했습니다.' });
  }
});

// 로그아웃 API
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

// 현재 사용자 정보 조회 API
app.get('/api/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, email, name, username, birth_year, birth_month, birth_day, birth_hour, created_at 
      FROM users WHERE id = ?
    `).get(req.user.uid);
    
    if (!user) {
      return res.status(404).json({ error: 'user_not_found' });
    }

    // user_kv 로드
    const kvRows = db.prepare('SELECT k, v FROM user_kv WHERE user_id = ?').all(req.user.uid);
    const user_kv = {};
    kvRows.forEach(row => {
      try { user_kv[row.k] = JSON.parse(row.v); } catch { user_kv[row.k] = row.v; }
    });
    
    res.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        birthYear: user.birth_year,
        birthMonth: user.birth_month,
        birthDay: user.birth_day,
        birthHour: user.birth_hour,
        created_at: user.created_at,
        user_kv
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'server_error' });
  }
});

// 사용자 정보 조회 API
app.get('/api/user', authenticateToken, (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, email, name, username, birth_year, birth_month, birth_day, birth_hour, created_at 
      FROM users WHERE id = ?
    `).get(req.user.uid);
    
    if (!user) {
      return res.status(404).json({ error: 'user_not_found' });
    }
    
    res.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        birthYear: user.birth_year,
        birthMonth: user.birth_month,
        birthDay: user.birth_day,
        birthHour: user.birth_hour,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'get_user_failed' });
  }
});

// 사용자 정보 업데이트 API
app.put('/api/user', authenticateToken, async (req, res) => {
  try {
    // 프론트는 camelCase로 보낼 수 있으므로 대응
    const name = req.body.name;
    const username = req.body.username || null;
    const birth_year = req.body.birth_year || req.body.birthYear || null;
    const birth_month = req.body.birth_month || req.body.birthMonth || null;
    const birth_day = req.body.birth_day || req.body.birthDay || null;
    const birth_hour = req.body.birth_hour || req.body.birthHour || null;
    const birth_time = req.body.birth_time || null;
    const birthplace = req.body.birthplace || null;
    const calendar_type = req.body.calendar_type || req.body.calendarType || null;
    const sex = req.body.sex || null;
    const time_accuracy = req.body.time_accuracy || req.body.timeAccuracy || null;
    
    const stmt = db.prepare(`
      UPDATE users 
      SET name = ?, username = ?, birth_year = ?, birth_month = ?, birth_day = ?, birth_hour = ?
      WHERE id = ?
    `);
    
    stmt.run(name, username, birth_year, birth_month, birth_day, birth_hour, req.user.uid);

    // 보조값 저장
    const upsertKv = db.prepare(`
      INSERT INTO user_kv (user_id, k, v) VALUES (?, ?, ?)
      ON CONFLICT(user_id, k) DO UPDATE SET v = excluded.v, updated_at = CURRENT_TIMESTAMP
    `);
    // 보조 정보만 user_kv에 저장 (기본 필드 중복 제거)
    const extras = {
      birth_time,
      birthplace,
      calendar_type,
      sex,
      time_accuracy
    };
    Object.entries(extras).forEach(([k,v])=>{
      if (v!==undefined && v!==null && v!=='') {
        upsertKv.run(req.user.uid, k, JSON.stringify(v));
        console.log(`✅ user_kv 저장: ${k} = ${v}`);
      }
    });

    const user = db.prepare('SELECT id, email, name, username, birth_year, birth_month, birth_day, birth_hour FROM users WHERE id = ?').get(req.user.uid);
    res.json({ success: true, user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'update_user_failed' });
  }
});

// 사주 분석 API
app.post('/api/bazi', authenticateToken, (req, res) => {
  try {
    let { birth_year, birth_month, birth_day, birth_hour } = req.body;
    
    // 요청 데이터가 없으면 사용자 프로필에서 가져오기
    if (!birth_year || !birth_month || !birth_day) {
      const user = db.prepare('SELECT birth_year, birth_month, birth_day, birth_hour FROM users WHERE id = ?').get(req.user.uid);
      if (user && user.birth_year && user.birth_month && user.birth_day) {
        birth_year = user.birth_year;
        birth_month = user.birth_month;
        birth_day = user.birth_day;
        birth_hour = birth_hour || user.birth_hour;
      } else {
        return res.status(400).json({ error: 'birth_data_required' });
      }
    }
    
    // 명리학 엔진 초기화
    const baziEngine = new BaziEngine();
    
    // 생년월일시 데이터
    const birthData = {
      year: parseInt(birth_year),
      month: parseInt(birth_month),
      day: parseInt(birth_day),
      hour: parseInt(birth_hour) || 12,
      timezone: 'Asia/Seoul'
    };
    
    // 명리학 계산
    const baziResult = baziEngine.calculateBazi(birthData);
    
    // 전문가 해석 추가
    const interpretation = generateExpertInterpretation(baziResult);
    
    // 사용자 메타 및 KV 로드 (장문 리포트에 활용)
    const userRow = db.prepare('SELECT id, name, email, birth_year, birth_month, birth_day, birth_hour FROM users WHERE id = ?').get(req.user.uid);
    const kvRows = db.prepare('SELECT k, v FROM user_kv WHERE user_id = ?').all(req.user.uid);
    const user_kv = {};
    kvRows.forEach(row => { try { user_kv[row.k] = JSON.parse(row.v); } catch { user_kv[row.k] = row.v; } });

    // 장문 전문가 리포트 생성
    const proReport = buildProReport(baziResult, userRow, user_kv);

    const result = {
      ...baziResult,
      interpretation,
      proReport
    };
    
    // 결과 저장
    const stmt = db.prepare('INSERT INTO readings (user_id, type, result) VALUES (?, ?, ?)');
    stmt.run(req.user.uid, 'bazi', JSON.stringify(result));
    
    res.json({ success: true, result });
  } catch (error) {
    console.error('Bazi analysis error:', error);
    res.status(500).json({ error: 'bazi_analysis_failed' });
  }
});

// 간단한 사주 분석 API (폴백용)
app.post('/api/bazi/simple', authenticateToken, (req, res) => {
  try {
    const { birth_year, birth_month, birth_day, birth_hour } = req.body || {};
    if (!birth_year || !birth_month || !birth_day) {
      return res.status(400).json({ error: 'birth_data_required' });
    }
    
    const baziEngine = new BaziEngine();
    const birthData = {
      year: parseInt(birth_year),
      month: parseInt(birth_month),
      day: parseInt(birth_day),
      hour: parseInt(birth_hour) || 12,
      timezone: 'Asia/Seoul'
    };
    
    const baziResult = baziEngine.calculateBazi(birthData);
    const interpretation = generateExpertInterpretation(baziResult);
    const result = { ...baziResult, interpretation };
    
    // 결과 저장
    const stmt = db.prepare('INSERT INTO readings (user_id, type, result) VALUES (?, ?, ?)');
    stmt.run(req.user.uid, 'bazi_simple', JSON.stringify(result));
    
    res.json({ success: true, result });
  } catch (error) {
    console.error('Simple Bazi analysis error:', error);
    res.status(500).json({ error: 'simple_bazi_analysis_failed' });
  }
});

// 상대 사주 분석 API (인연 데이터 등 임의 생년월일시로 분석)
app.post('/api/bazi/other', authenticateToken, (req, res) => {
  try {
    const { birth_year, birth_month, birth_day, birth_hour, name } = req.body || {};
    if (!birth_year || !birth_month || !birth_day) {
      return res.status(400).json({ error: 'birth_data_required' });
    }
    const baziEngine = new BaziEngine();
    const birthData = {
      year: parseInt(birth_year),
      month: parseInt(birth_month),
      day: parseInt(birth_day),
      hour: parseInt(birth_hour) || 12,
      timezone: 'Asia/Seoul'
    };
    const baziResult = baziEngine.calculateBazi(birthData);
    const interpretation = generateExpertInterpretation(baziResult);
    const result = { ...baziResult, interpretation, subject: { name: name || '상대' } };
    // 저장(옵션): other_bazi
    const stmt = db.prepare('INSERT INTO readings (user_id, type, result) VALUES (?, ?, ?)');
    stmt.run(req.user.uid, 'other_bazi', JSON.stringify(result));
    return res.json({ success: true, result });
  } catch (e) {
    console.error('Other Bazi analysis error:', e);
    return res.status(500).json({ error: 'other_bazi_failed' });
  }
});

// 점성술 분석 기록 저장 API
app.post('/api/readings', authenticateToken, (req, res) => {
  try {
    const { type, result: analysisResult } = req.body;
    
    if (!type || !analysisResult) {
      return res.status(400).json({ error: 'invalid_data' });
    }
    
    // 분석 기록 저장
    const stmt = db.prepare('INSERT INTO readings (user_id, type, result) VALUES (?, ?, ?)');
    stmt.run(req.user.uid, type, JSON.stringify(analysisResult));
    
    console.log(`✅ 분석 기록 저장 완료: ${type}`);
    res.json({ success: true, message: '분석 기록이 저장되었습니다.' });
    
  } catch (error) {
    console.error('Save reading error:', error);
    res.status(500).json({ error: 'save_reading_failed' });
  }
});

// 점성술 분석 API (인증 없이도 작동)
app.post('/api/astrology', (req, res) => {
  try {
    let { birth_year, birth_month, birth_day, birth_hour } = req.body;
    
    // 요청 데이터 검증
    if (!birth_year || !birth_month || !birth_day) {
      return res.status(400).json({ 
        error: 'birth_data_required',
        message: '생년월일 정보가 필요합니다.'
      });
    }
    
    // 사용자 ID가 있으면 사용자 프로필에서 추가 데이터 가져오기
    let userId = null;
    if (req.user && req.user.uid) {
      userId = req.user.uid;
      const user = db.prepare('SELECT birth_year, birth_month, birth_day, birth_hour FROM users WHERE id = ?').get(userId);
      if (user && user.birth_year && user.birth_month && user.birth_day) {
        // 사용자 프로필 데이터가 있으면 그것을 우선 사용
        birth_year = user.birth_year;
        birth_month = user.birth_month;
        birth_day = user.birth_day;
        birth_hour = birth_hour || user.birth_hour;
      }
    }
    
    console.log('🔮 점성술 분석 요청:', { birth_year, birth_month, birth_day, birth_hour, userId });
    
    const result = calculateAstrology(birth_year, birth_month, birth_day, birth_hour);
    
    // 사용자 ID가 있으면 결과 저장
    if (userId) {
      try {
    const stmt = db.prepare('INSERT INTO readings (user_id, type, result) VALUES (?, ?, ?)');
        stmt.run(userId, 'astrology', JSON.stringify(result));
        console.log('✅ 점성술 분석 결과 저장됨 (사용자 ID:', userId, ')');
      } catch (error) {
        console.warn('⚠️ 점성술 분석 결과 저장 실패:', error.message);
      }
    }
    
    res.json({ success: true, result });
  } catch (error) {
    console.error('❌ Astrology analysis error:', error);
    res.status(500).json({ 
      error: 'astrology_analysis_failed',
      message: '점성술 분석 중 오류가 발생했습니다.'
    });
  }
});

// 관계 분석 API
app.post('/api/relationship', authenticateToken, (req, res) => {
  try {
    const { friendName, birth_year, birth_month, birth_day, birth_hour, relationshipType, birth_time, birthplace } = req.body;
    
    if (!friendName || !birth_year || !birth_month || !birth_day || !relationshipType) {
      return res.status(400).json({ error: 'missing_required_fields' });
    }
    
    // 사용자 정보 가져오기
    const user = db.prepare('SELECT birth_year, birth_month, birth_day, birth_hour FROM users WHERE id = ?').get(req.user.uid);
    
    if (!user || !user.birth_year || !user.birth_month || !user.birth_day) {
      return res.status(400).json({ error: 'user_birth_data_required' });
    }
    
    const result = calculateRelationship(
      user.birth_year, user.birth_month, user.birth_day, user.birth_hour,
      birth_year, birth_month, birth_day, birth_hour,
      friendName, relationshipType
    );
    // 메타 데이터 보강
    result.meta = { friendBirthTime: birth_time || null, friendBirthplace: birthplace || null };
    // 친구 원본 데이터(명리학 재사용 목적)
    result.friend = {
      name: friendName,
      birth_year: parseInt(birth_year),
      birth_month: parseInt(birth_month),
      birth_day: parseInt(birth_day),
      birth_hour: parseInt(birth_hour) || 0,
      birth_time: birth_time || '',
      birthplace: birthplace || '',
      sex: (req.body.friend_sex || '')
    };
    
    // 신규: 관계 테이블에 저장
    try {
      const relStmt = db.prepare(`
        INSERT INTO relationships (user_id, name, birth_year, birth_month, birth_day, birth_hour, birth_time, birthplace, sex, relationship_type, result)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const rinfo = relStmt.run(
        req.user.uid,
        friendName,
        parseInt(birth_year), parseInt(birth_month), parseInt(birth_day), parseInt(birth_hour)||0,
        birth_time||'', birthplace||'', (req.body.friend_sex||''), relationshipType,
        JSON.stringify(result)
      );
      res.json({ success: true, result, readingId: rinfo.lastInsertRowid, relationshipId: rinfo.lastInsertRowid });
    } catch (e) {
      if (String(e.message).includes('UNIQUE')) {
        return res.status(409).json({ error: 'duplicate_relationship', message: '이미 데이터가 있어요 (이름/생년월일/시간이 동일)' });
      }
      throw e;
    }
  } catch (error) {
    console.error('Relationship analysis error:', error);
    res.status(500).json({ error: 'relationship_analysis_failed' });
  }
});

// 분석 기록 조회 API
app.get('/api/readings', authenticateToken, (req, res) => {
  try {
    const readings = db.prepare(`
      SELECT id, type, result, created_at 
      FROM readings 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(req.user.uid);
    
    const formattedReadings = readings.map(reading => ({
      ...reading,
      result: JSON.parse(reading.result)
    }));
    
    // 신규 관계 테이블도 함께 반환
    const rels = db.prepare(`
      SELECT id, name, birth_year, birth_month, birth_day, birth_hour, birth_time, birthplace, sex, relationship_type, result, created_at
      FROM relationships WHERE user_id = ? ORDER BY created_at DESC
    `).all(req.user.uid);
    const formattedRels = rels.map(r => ({ ...r, result: r.result ? JSON.parse(r.result) : null, type: 'relationship' }));
    res.json({ readings: formattedReadings.concat(formattedRels) });
  } catch (error) {
    console.error('Get readings error:', error);
    res.status(500).json({ error: 'get_readings_failed' });
  }
});

// 관계 목록 전용 API
app.get('/api/relationships', authenticateToken, (req, res) => {
  try {
    const rels = db.prepare(`
      SELECT id, name, birth_year, birth_month, birth_day, birth_hour, birth_time, birthplace, sex, relationship_type, result, created_at
      FROM relationships WHERE user_id = ? ORDER BY created_at DESC
    `).all(req.user.uid);
    const list = rels.map(r => ({
      id: r.id,
      name: r.name,
      relationshipType: r.relationship_type,
      result: r.result ? JSON.parse(r.result) : null,
      timestamp: r.created_at
    }));
    return res.json({ success: true, relationships: list });
  } catch (e) {
    console.error('Get relationships error:', e);
    return res.status(500).json({ error: 'get_relationships_failed' });
  }
});

// 사용자용: 특정 분석 기록 삭제
app.delete('/api/readings/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const r = db.prepare('DELETE FROM readings WHERE id = ? AND user_id = ?').run(id, req.user.uid);
    const r2 = db.prepare('DELETE FROM relationships WHERE id = ? AND user_id = ?').run(id, req.user.uid);
    if (r.changes > 0 || r2.changes > 0) return res.json({ success: true });
    return res.status(404).json({ error: 'reading_not_found' });
  } catch (e) {
    console.error('Delete my reading error:', e);
    return res.status(500).json({ error: 'delete_reading_failed' });
  }
});

// 사용자용: 조건 기반 삭제(우회용)
app.post('/api/readings/delete-by', authenticateToken, (req, res) => {
  try {
    const { id, type, friendName, mode } = req.body || {};
    const normalizeString = (s) => {
      try { return String(s).trim().normalize('NFC').toLowerCase(); } catch { return String(s || '').trim().toLowerCase(); }
    };
    if (id) {
      const r = db.prepare('DELETE FROM readings WHERE id = ? AND user_id = ?').run(parseInt(id), req.user.uid);
      if (r.changes > 0) return res.json({ success: true });
    }
    if (type === 'relationship' && friendName) {
      const sel = db.prepare('SELECT id, result FROM readings WHERE user_id = ? AND type = ?').all(req.user.uid, 'relationship');
      const sel2 = db.prepare('SELECT id, name FROM relationships WHERE user_id = ?').all(req.user.uid);
      let deleted = 0;
      const target = normalizeString(friendName);
      for (const row of sel) {
        try {
          const rr = JSON.parse(row.result);
          const a = rr.friendName ? normalizeString(rr.friendName) : '';
          const b = rr.friend && rr.friend.name ? normalizeString(rr.friend.name) : '';
          if ((a && a === target) || (b && b === target)) {
            const del = db.prepare('DELETE FROM readings WHERE id = ? AND user_id = ?').run(row.id, req.user.uid);
            if (del.changes > 0) {
              deleted += 1;
              if (mode !== 'all') {
                return res.json({ success: true, deletedId: row.id, deletedCount: deleted });
              }
            }
          }
        } catch {}
      }
      for (const r of sel2) {
        const nm = normalizeString(r.name);
        if (nm && nm === target) {
          const del2 = db.prepare('DELETE FROM relationships WHERE id = ? AND user_id = ?').run(r.id, req.user.uid);
          if (del2.changes > 0) {
            deleted += 1;
            if (mode !== 'all') return res.json({ success: true, deletedCount: deleted });
          }
        }
      }
      if (deleted > 0) return res.json({ success: true, deletedCount: deleted });
    }
    return res.status(404).json({ error: 'reading_not_found' });
  } catch (e) {
    console.error('Delete-by error:', e);
    return res.status(500).json({ error: 'delete_by_failed' });
  }
});

// 사용자용: 관계 기록 전체 삭제
app.post('/api/readings/purge-relationships', authenticateToken, (req, res) => {
  try {
    const d1 = db.prepare('DELETE FROM readings WHERE user_id = ? AND type = ?').run(req.user.uid, 'relationship');
    const d2 = db.prepare('DELETE FROM relationships WHERE user_id = ?').run(req.user.uid);
    return res.json({ success: true, deletedCount: (d1.changes + d2.changes) });
  } catch (e) {
    console.error('Purge relationships error:', e);
    return res.status(500).json({ error: 'purge_failed' });
  }
});

// 사용자용: 전체 분석 기록 삭제 (readings + relationships + 관련 메타)
app.post('/api/readings/purge-all', authenticateToken, (req, res) => {
  try {
    const dRead = db.prepare('DELETE FROM readings WHERE user_id = ?').run(req.user.uid);
    const dRel = db.prepare('DELETE FROM relationships WHERE user_id = ?').run(req.user.uid);
    // 관계 메타(user_kv) 정리
    let dKv = { changes: 0 };
    try {
      dKv = db.prepare("DELETE FROM user_kv WHERE user_id = ? AND k LIKE 'relationship_meta:%'").run(req.user.uid);
    } catch {}
    return res.json({ success: true, deletedReadings: dRead.changes, deletedRelationships: dRel.changes, deletedKv: dKv.changes });
  } catch (e) {
    console.error('Purge all readings error:', e);
    return res.status(500).json({ error: 'purge_all_failed' });
  }
});

// 사용자용: 관계 선택 삭제
app.delete('/api/relationships/bulk-delete', authenticateToken, (req, res) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(x=>parseInt(x)) : [];
    if (!ids.length) return res.status(400).json({ error: 'missing_ids' });
    const stmt = db.prepare('DELETE FROM relationships WHERE user_id = ? AND id IN (' + ids.map(()=>'?').join(',') + ')');
    const r = stmt.run(req.user.uid, ...ids);
    return res.json({ success: true, deleted: r.changes });
  } catch (e) {
    console.error('User bulk delete relationships error:', e);
    res.status(500).json({ error: 'user_bulk_delete_relationships_failed' });
  }
});

// 사용자용: 관계 단건 삭제
app.delete('/api/relationships/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const r = db.prepare('DELETE FROM relationships WHERE id = ? AND user_id = ?').run(id, req.user.uid);
    if (r.changes > 0) return res.json({ success: true });
    return res.status(404).json({ error: 'relationship_not_found' });
  } catch (e) {
    console.error('User delete relationship error:', e);
    res.status(500).json({ error: 'user_delete_relationship_failed' });
  }
});

// 사용자용: 관계 조건 삭제 (이름+생년월일+시간)
app.delete('/api/relationships/by', authenticateToken, (req, res) => {
  try {
    const { name, birth_year, birth_month, birth_day, birth_hour } = req.body || {};
    if (!name || !birth_year || !birth_month || !birth_day) {
      return res.status(400).json({ error: 'missing_params' });
    }
    const stmt = db.prepare(`
      DELETE FROM relationships
      WHERE user_id = ? AND name = ? AND birth_year = ? AND birth_month = ? AND birth_day = ? AND (birth_hour = ? OR birth_time IS NOT NULL)
    `);
    const r = stmt.run(req.user.uid, name, parseInt(birth_year), parseInt(birth_month), parseInt(birth_day), parseInt(birth_hour)||0);
    if (r.changes > 0) return res.json({ success: true, deleted: r.changes });
    return res.status(404).json({ error: 'relationship_not_found' });
  } catch (e) {
    console.error('User delete relationship by criteria error:', e);
    res.status(500).json({ error: 'user_delete_relationship_by_failed' });
  }
});

// 사용자용: 인연궁합 메타 저장(즐겨찾기/메모)
app.post('/api/relationship/meta', authenticateToken, (req, res) => {
  try {
    const { readingId, favorite, memo } = req.body || {};
    if (!readingId) return res.status(400).json({ error: 'missing_reading_id' });
    // 메타를 user_kv에 저장 (key: relationship_meta:{readingId})
    const key = `relationship_meta:${readingId}`;
    const val = { favorite: !!favorite, memo: memo || '' };
    const up = db.prepare(`
      INSERT INTO user_kv (user_id, k, v) VALUES (?, ?, ?)
      ON CONFLICT(user_id, k) DO UPDATE SET v = excluded.v, updated_at = CURRENT_TIMESTAMP
    `);
    up.run(req.user.uid, key, JSON.stringify(val));
    return res.json({ success: true });
  } catch (e) {
    console.error('Save relationship meta error:', e);
    return res.status(500).json({ error: 'save_meta_failed' });
  }
});

// 사용자용: 인연궁합 메타 조회
app.get('/api/relationship/meta/:id', authenticateToken, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const key = `relationship_meta:${id}`;
    const row = db.prepare('SELECT v FROM user_kv WHERE user_id = ? AND k = ?').get(req.user.uid, key);
    return res.json({ value: row ? JSON.parse(row.v) : null });
  } catch (e) {
    console.error('Get relationship meta error:', e);
    return res.status(500).json({ error: 'get_meta_failed' });
  }
});

// 사용자 키-값 저장 API
app.post('/api/kv', authenticateToken, (req, res) => {
  try {
    const { k, v } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO user_kv (user_id, k, v) VALUES (?, ?, ?)
      ON CONFLICT(user_id, k) DO UPDATE SET v = excluded.v, updated_at = CURRENT_TIMESTAMP
    `);
    
    stmt.run(req.user.uid, k, JSON.stringify(v));
    res.json({ success: true });
  } catch (error) {
    console.error('Save KV error:', error);
    res.status(500).json({ error: 'save_kv_failed' });
  }
});

// 사용자 키-값 조회 API
app.get('/api/kv/:k', authenticateToken, (req, res) => {
  try {
    const row = db.prepare('SELECT v FROM user_kv WHERE user_id = ? AND k = ?').get(req.user.uid, req.params.k);
    res.json({ value: row ? JSON.parse(row.v) : null });
  } catch (error) {
    console.error('Get KV error:', error);
    res.status(500).json({ error: 'get_kv_failed' });
  }
});

// 헬스체크 API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// LLM 게이트웨이 프록시 (test)
app.get('/api/llm/test', authenticateToken, async (req, res) => {
  try {
    const upstream = `${LLM_BASE_URL}/test`;
    const resp = await fetch(upstream, { method: 'GET' });
    const data = await resp.json().catch(() => ({}));
    return res.status(resp.status).json(data);
  } catch (e) {
    console.error('LLM test GET error:', e);
    return res.status(502).json({ error: 'llm_gateway_unreachable' });
  }
});

app.post('/api/llm/test', authenticateToken, async (req, res) => {
  try {
    const upstream = `${LLM_BASE_URL}/test`;
    const resp = await fetch(upstream, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });
    const data = await resp.json().catch(() => ({}));
    return res.status(resp.status).json(data);
  } catch (e) {
    console.error('LLM test POST error:', e);
    return res.status(502).json({ error: 'llm_gateway_unreachable' });
  }
});

// 공개 라우트 (인증 불필요)
app.get('/public/llm/test', async (req, res) => {
  try {
    const upstream = `${LLM_BASE_URL}/test`;
    const resp = await fetch(upstream, { method: 'GET' });
    const data = await resp.json().catch(() => ({}));
    return res.status(resp.status).json(data);
  } catch (e) {
    console.error('LLM public test GET error:', e);
    return res.status(502).json({ error: 'llm_gateway_unreachable' });
  }
});

app.post('/public/llm/test', async (req, res) => {
  try {
    const upstream = `${LLM_BASE_URL}/test`;
    const resp = await fetch(upstream, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });
    const data = await resp.json().catch(() => ({}));
    return res.status(resp.status).json(data);
  } catch (e) {
    console.error('LLM public test POST error:', e);
    return res.status(502).json({ error: 'llm_gateway_unreachable' });
  }
});

// 관리자 비밀번호 테이블 생성
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  
  INSERT OR IGNORE INTO admin_settings (key, value) VALUES ('admin_password', '12341234');
`);

// 관리자 인증 API
app.post('/api/admin/login', (req, res) => {
  console.log('🔐 관리자 로그인 요청 받음:', req.body);
  
  try {
    const { password } = req.body;
    
    if (!password) {
      console.log('❌ 비밀번호가 없음');
      return res.status(400).json({ error: 'password_required' });
    }
    
    // 데이터베이스에서 관리자 비밀번호 조회
    const adminPassword = db.prepare('SELECT value FROM admin_settings WHERE key = ?').get('admin_password')?.value || '12341234';
    console.log('🔐 저장된 관리자 비밀번호:', adminPassword);
    console.log('🔐 입력된 비밀번호:', password);
    console.log('🔐 비밀번호 일치:', password === adminPassword);
    
    if (password === adminPassword) {
      // 관리자 세션 설정
      res.cookie('admin_token', 'admin_authenticated', {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24시간
      });
      
      console.log('✅ 관리자 로그인 성공');
      res.json({ success: true, message: '관리자 로그인 성공' });
    } else {
      console.log('❌ 관리자 비밀번호 불일치');
      res.status(401).json({ error: 'invalid_admin_password' });
    }
  } catch (error) {
    console.error('❌ 관리자 로그인 오류:', error);
    res.status(500).json({ error: 'admin_login_failed' });
  }
});

// 관리자 비밀번호 변경 API
app.post('/api/admin/change-password', authenticateAdmin, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'missing_password_fields' });
    }
    
    // 현재 비밀번호 확인
    const adminPassword = db.prepare('SELECT value FROM admin_settings WHERE key = ?').get('admin_password')?.value || '12341234';
    
    if (currentPassword !== adminPassword) {
      return res.status(401).json({ error: 'invalid_current_password' });
    }
    
    // 새 비밀번호 업데이트
    const stmt = db.prepare('INSERT OR REPLACE INTO admin_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)');
    stmt.run('admin_password', newPassword);
    
    res.json({ success: true, message: '관리자 비밀번호가 변경되었습니다.' });
  } catch (error) {
    console.error('Admin password change error:', error);
    res.status(500).json({ error: 'admin_password_change_failed' });
  }
});

// 관리자 로그아웃 API
app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true });
});

// 관리자 인증 미들웨어
function authenticateAdmin(req, res, next) {
  const adminToken = req.cookies.admin_token;
  
  if (adminToken === 'admin_authenticated') {
    next();
  } else {
    res.status(401).json({ error: 'admin_unauthorized' });
  }
}

// 관리자 통계 API
app.get('/api/admin/stats', authenticateAdmin, (req, res) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalReadings = db.prepare('SELECT COUNT(*) as count FROM readings').get().count;
    const todayReadings = db.prepare(`
      SELECT COUNT(*) as count FROM readings 
      WHERE DATE(created_at) = DATE('now')
    `).get().count;
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalReadings,
        todayReadings
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'admin_stats_failed' });
  }
});

// 관리자 사용자 목록 API
app.get('/api/admin/users', (req, res) => {
  try {
    const users = db.prepare(`
      SELECT id, name, email, username, birth_year, birth_month, birth_day, birth_hour, created_at
      FROM users 
      ORDER BY created_at DESC
    `).all();
    
    res.json({ success: true, users });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'admin_users_failed' });
  }
});

// 관리자 분석 기록 API
app.get('/api/admin/readings', (req, res) => {
  console.log('📋 관리자 분석 기록 요청 받음');
  try {
    const readings = db.prepare(`
      SELECT r.id, r.type, r.created_at, u.name as user_name, u.email
      FROM readings r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `).all();
    
    console.log('📋 분석 기록 조회 결과:', readings.length, '개');
    if (readings.length > 0) {
      console.log('📋 첫 번째 기록:', readings[0]);
    }
    
    res.json({ success: true, readings });
  } catch (error) {
    console.error('❌ Admin readings error:', error);
    res.status(500).json({ success: false, error: 'admin_readings_failed' });
  }
});

// 테스트용 분석 기록 생성 API
app.post('/api/admin/readings/test', (req, res) => {
  console.log('🧪 테스트용 분석 기록 생성 요청');
  try {
    // 기존 사용자 중 첫 번째 사용자 찾기
    const user = db.prepare('SELECT id, name FROM users LIMIT 1').get();
    
    if (!user) {
      return res.status(400).json({ success: false, error: '사용자가 없습니다.' });
    }
    
    // 테스트용 분석 기록 생성
    const stmt = db.prepare(`
      INSERT INTO readings (user_id, type, result, created_at) 
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `);
    
    const testTypes = ['사주', '타로', '운세', '꿈해몽'];
    const createdReadings = [];
    
    for (let i = 0; i < 3; i++) {
      const type = testTypes[i % testTypes.length];
      const testResult = `테스트 ${type} 분석 결과 - ${new Date().toLocaleString()}`;
      const result = stmt.run(user.id, type, testResult);
      createdReadings.push({
        id: result.lastInsertRowid,
        type: type,
        user_name: user.name
      });
    }
    
    console.log('✅ 테스트용 분석 기록 생성 완료:', createdReadings.length, '개');
    res.json({ success: true, created: createdReadings });
  } catch (error) {
    console.error('❌ 테스트용 분석 기록 생성 오류:', error);
    res.status(500).json({ success: false, error: '테스트 기록 생성에 실패했습니다.' });
  }
});

// 관리자: 관계(인연보기) 목록
app.get('/api/admin/relationships', authenticateAdmin, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT r.id, r.name, r.relationship_type, r.created_at, u.name as user_name, u.email
      FROM relationships r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `).all();
    res.json({ success: true, relationships: rows });
  } catch (e) {
    console.error('Admin relationships error:', e);
    res.status(500).json({ error: 'admin_relationships_failed' });
  }
});

// 관리자: 관계 삭제
app.delete('/api/admin/relationships/:id', authenticateAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const r = db.prepare('DELETE FROM relationships WHERE id = ?').run(id);
    if (r.changes > 0) return res.json({ success: true });
    return res.status(404).json({ error: 'relationship_not_found' });
  } catch (e) {
    console.error('Admin delete relationship error:', e);
    res.status(500).json({ error: 'admin_delete_relationship_failed' });
  }
});

// 관리자: 관계 일괄 삭제
app.delete('/api/admin/relationships', authenticateAdmin, (req, res) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(x=>parseInt(x)) : [];
    if (!ids.length) return res.status(400).json({ error: 'missing_ids' });
    const stmt = db.prepare('DELETE FROM relationships WHERE id IN (' + ids.map(()=>'?').join(',') + ')');
    const r = stmt.run(...ids);
    return res.json({ success: true, deleted: r.changes });
  } catch (e) {
    console.error('Admin bulk delete relationships error:', e);
    res.status(500).json({ error: 'admin_bulk_delete_relationships_failed' });
  }
});

// 관리자: readings 일괄 삭제
app.delete('/api/admin/readings', (req, res) => {
  console.log('🗑️ 분석 기록 일괄 삭제 요청 받음:', req.body);
  
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(x=>parseInt(x)) : [];
    console.log('삭제할 ID들:', ids);
    
    if (!ids.length) {
      console.log('❌ 삭제할 ID가 없음');
      return res.status(400).json({ success: false, error: '삭제할 분석 기록을 선택해주세요.' });
    }
    
    const placeholders = ids.map(() => '?').join(',');
    const stmt = db.prepare(`DELETE FROM readings WHERE id IN (${placeholders})`);
    const result = stmt.run(...ids);
    
    console.log('✅ 삭제 완료:', result.changes, '개');
    return res.json({ success: true, deleted: result.changes });
  } catch (e) {
    console.error('❌ Admin bulk delete readings error:', e);
    res.status(500).json({ success: false, error: '분석 기록 일괄 삭제에 실패했습니다.' });
  }
});

// 관리자 시스템 정보 API
app.get('/api/admin/system', authenticateAdmin, (req, res) => {
  try {
    const systemInfo = {
      serverStatus: '정상',
      dbStatus: '연결됨',
      serverStartTime: new Date().toISOString(),
      memoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      uptime: `${Math.round(process.uptime())}초`
    };
    
    res.json({ success: true, systemInfo });
  } catch (error) {
    console.error('Admin system info error:', error);
    res.status(500).json({ error: 'admin_system_failed' });
  }
});

// 관리자 사용자 삭제 API
app.delete('/api/admin/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // 사용자의 분석 기록 먼저 삭제
    db.prepare('DELETE FROM readings WHERE user_id = ?').run(userId);
    db.prepare('DELETE FROM user_kv WHERE user_id = ?').run(userId);
    
    // 사용자 삭제
    const result = db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    
    if (result.changes > 0) {
      res.json({ success: true, message: '사용자가 삭제되었습니다.' });
    } else {
      res.status(404).json({ error: 'user_not_found' });
    }
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ error: 'admin_delete_user_failed' });
  }
});

// 관리자 분석 기록 삭제 API
app.delete('/api/admin/readings/:id', (req, res) => {
  try {
    const readingId = parseInt(req.params.id);
    const result = db.prepare('DELETE FROM readings WHERE id = ?').run(readingId);
    
    if (result.changes > 0) {
      res.json({ success: true, message: '분석 기록이 삭제되었습니다.' });
    } else {
      res.status(404).json({ error: 'reading_not_found' });
    }
  } catch (error) {
    console.error('Admin delete reading error:', error);
    res.status(500).json({ error: 'admin_delete_reading_failed' });
  }
});

// 사주 계산 함수 (전문가급 상세 분석)
function calculateBazi(birthYear, birthMonth, birthDay, birthHour) {
  const elements = ['목', '화', '토', '금', '수'];
  const heavenlyStems = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
  const earthlyBranches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
  const elementColors = { '목': '#4CAF50', '화': '#F44336', '토': '#FF9800', '금': '#FFC107', '수': '#2196F3' };
  
  // 사주 계산
  const yearPillar = {
    stem: heavenlyStems[birthYear % 10],
    branch: earthlyBranches[birthYear % 12],
    element: elements[Math.floor(Math.random() * elements.length)]
  };
  
  const monthPillar = {
    stem: heavenlyStems[birthMonth % 10],
    branch: earthlyBranches[birthMonth % 12],
    element: elements[Math.floor(Math.random() * elements.length)]
  };
  
  const dayPillar = {
    stem: heavenlyStems[birthDay % 10],
    branch: earthlyBranches[birthDay % 12],
    element: elements[Math.floor(Math.random() * elements.length)]
  };
  
  const hourPillar = {
    stem: heavenlyStems[birthHour % 10],
    branch: earthlyBranches[birthHour % 12],
    element: elements[Math.floor(Math.random() * elements.length)]
  };

  // 오행 균형 계산
  const elementCounts = {};
  [yearPillar, monthPillar, dayPillar, hourPillar].forEach(pillar => {
    elementCounts[pillar.element] = (elementCounts[pillar.element] || 0) + 1;
  });

  // 운세 분석
  const age = new Date().getFullYear() - birthYear;
  const lifeStage = age < 30 ? '초년' : age < 50 ? '중년' : '말년';

  return {
    title: `${birthYear}년 ${birthMonth}월 ${birthDay}일 ${birthHour}시 사주`,
    description: "전문가가 분석한 당신의 운명의 지도",
    
    // 1. 사주 기둥 정보
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar
    },
    
    // 2. 오행 분석
    elementAnalysis: {
      balance: elementCounts,
      dominant: Object.keys(elementCounts).reduce((a, b) => elementCounts[a] > elementCounts[b] ? a : b),
      weak: elements.filter(el => !elementCounts[el] || elementCounts[el] === 0),
      advice: generateElementAdvice(elementCounts)
    },
    
    // 3. 인생 단계별 운세
    lifeStages: {
      early: generateEarlyLifeAnalysis(yearPillar, monthPillar),
      middle: generateMiddleLifeAnalysis(monthPillar, dayPillar),
      late: generateLateLifeAnalysis(dayPillar, hourPillar)
    },
    
    // 4. 성격 분석
    personality: generatePersonalityAnalysis(yearPillar, monthPillar, dayPillar, hourPillar),
    
    // 5. 직업 운세
    career: generateCareerAnalysis(elementCounts, dayPillar),
    
    // 6. 연애/결혼 운세
    love: generateLoveAnalysis(monthPillar, dayPillar, elementCounts),
    
    // 7. 건강 운세
    health: generateHealthAnalysis(elementCounts, hourPillar),
    
    // 8. 재정 운세
    finance: generateFinanceAnalysis(yearPillar, dayPillar, elementCounts),
    
    // 9. 월별 운세 (12개월)
    monthlyFortune: generateMonthlyFortune(birthMonth, elementCounts),
    
    // 10. 전문가 조언
    expertAdvice: generateExpertAdvice(elementCounts, lifeStage, age),
    
    // 11. 운세 개선법
    improvementMethods: generateImprovementMethods(elementCounts, weakElements = Object.keys(elementCounts).filter(el => !elementCounts[el] || elementCounts[el] === 0)),
    
    // 12. 향후 10년 대운 분석
    futureLuck: (() => {
      console.log('🔮 대운 분석 시작:', { birthYear, birthMonth, birthDay, birthHour, age });
      const result = generateFutureLuckAnalysis(birthYear, birthMonth, birthDay, birthHour, age);
      console.log('🔮 대운 분석 결과:', JSON.stringify(result, null, 2));
      return result;
    })(),
    
    // 13. 특별 주의사항
    specialNotes: generateSpecialNotes(birthYear, birthMonth, birthDay, birthHour)
  };
}

// 오행 조언 생성
function generateElementAdvice(elementCounts) {
  const dominant = Object.keys(elementCounts).reduce((a, b) => elementCounts[a] > elementCounts[b] ? a : b);
  const advice = {
    '목': '창의성과 성장의 기운이 강합니다. 새로운 도전을 두려워하지 마세요.',
    '화': '열정과 리더십이 뛰어납니다. 적극적인 행동이 성공의 열쇠입니다.',
    '토': '안정성과 신뢰성이 강점입니다. 꾸준함이 최고의 무기입니다.',
    '금': '정의감과 완벽주의가 특징입니다. 원칙을 지키되 유연함도 필요합니다.',
    '수': '지혜와 직관이 뛰어납니다. 깊이 있는 사고가 인생의 방향을 제시합니다.'
  };
  return advice[dominant] || '균형잡힌 오행으로 다양한 분야에서 성공할 수 있습니다.';
}

// 초년기 분석
function generateEarlyLifeAnalysis(yearPillar, monthPillar) {
  return {
    period: "0-30세",
    focus: "학업과 기초 다지기",
    characteristics: "부모님의 영향이 크며, 가족과의 관계가 인생의 토대가 됩니다.",
    advice: "기초를 탄탄히 다지고 다양한 경험을 쌓는 것이 중요합니다.",
    luckyElements: [yearPillar.element, monthPillar.element],
    challenges: "자신의 정체성을 찾는 과정에서 혼란을 겪을 수 있습니다.",
    opportunities: "새로운 기술과 지식을 배우기에 좋은 시기입니다."
  };
}

// 중년기 분석
function generateMiddleLifeAnalysis(monthPillar, dayPillar) {
  return {
    period: "31-50세",
    focus: "직업과 사회적 성취",
    characteristics: "인간관계와 재정적 안정을 추구하며, 사회에서 인정받는 시기입니다.",
    advice: "균형잡힌 삶을 추구하고, 가족과 직업 사이의 조화를 찾으세요.",
    luckyElements: [monthPillar.element, dayPillar.element],
    challenges: "일과 가정의 양립, 중년의 위기감을 겪을 수 있습니다.",
    opportunities: "경험을 바탕으로 한 새로운 도전과 성장의 기회가 많습니다."
  };
}

// 말년기 분석
function generateLateLifeAnalysis(dayPillar, hourPillar) {
  return {
    period: "51세 이후",
    focus: "지혜와 평온",
    characteristics: "후배들과의 관계와 정신적 만족이 중요하며, 인생의 지혜를 나누는 시기입니다.",
    advice: "평온한 마음으로 인생을 마무리하고, 후세에 좋은 영향을 남기세요.",
    luckyElements: [dayPillar.element, hourPillar.element],
    challenges: "건강 관리와 외로움을 겪을 수 있습니다.",
    opportunities: "인생 경험을 바탕으로 한 멘토링과 봉사활동의 기회가 많습니다."
  };
}

// 성격 분석
function generatePersonalityAnalysis(yearPillar, monthPillar, dayPillar, hourPillar) {
  const elements = [yearPillar.element, monthPillar.element, dayPillar.element, hourPillar.element];
  const elementTraits = {
    '목': '창의적, 성장지향적, 관대함',
    '화': '열정적, 리더십, 도전적',
    '토': '안정적, 신뢰성, 책임감',
    '금': '정의감, 완벽주의, 원칙주의',
    '수': '지혜로움, 직관적, 깊이 있는 사고'
  };
  
  const dominantTraits = elements.map(el => elementTraits[el]).join(', ');
  
  return {
    mainTraits: dominantTraits,
    strengths: "다양한 오행의 조화로 균형잡힌 성격을 가지고 있습니다.",
    weaknesses: "때로는 너무 완벽하려는 경향이 있을 수 있습니다.",
    socialStyle: "사람들과의 관계에서 중재자 역할을 잘 수행합니다.",
    communication: "논리적이면서도 감성적인 소통 능력을 가지고 있습니다."
  };
}

// 직업 운세
function generateCareerAnalysis(elementCounts, dayPillar) {
  const careerSuggestions = {
    '목': ['교육자', '작가', '디자이너', '환경보호자', '농업'],
    '화': ['리더', '영업직', '엔터테인먼트', '요리사', '스포츠'],
    '토': ['관리직', '건축가', '부동산', '회계사', '공무원'],
    '금': ['법조인', '의사', '엔지니어', '경찰', '군인'],
    '수': ['연구원', '철학자', '상담사', '여행가', '예술가']
  };
  
  const dominant = Object.keys(elementCounts).reduce((a, b) => elementCounts[a] > elementCounts[b] ? a : b);
  
  return {
    suitableCareers: careerSuggestions[dominant] || ['다양한 분야에서 성공 가능'],
    successFactors: "꾸준한 노력과 전문성 개발이 성공의 열쇠입니다.",
    timing: "30대 후반부터 본격적인 성과를 거둘 수 있습니다.",
    advice: "자신의 강점을 살린 분야에서 전문성을 키우세요."
  };
}

// 연애/결혼 운세
function generateLoveAnalysis(monthPillar, dayPillar, elementCounts) {
  return {
    loveStyle: "진정한 사랑을 추구하는 로맨틱한 성향",
    idealPartner: "상호 보완적인 관계를 만들어갈 수 있는 사람",
    timing: "25-35세 사이에 진정한 사랑을 만날 가능성이 높습니다.",
    challenges: "완벽주의적 성향으로 인해 상대방에게 과도한 기대를 할 수 있습니다.",
    advice: "서로의 차이점을 이해하고 존중하는 마음을 가지세요.",
    compatibility: "토(안정성)와 수(지혜) 기운을 가진 사람과 잘 맞습니다."
  };
}

// 건강 운세
function generateHealthAnalysis(elementCounts, hourPillar) {
  return {
    strongPoints: "전반적으로 건강한 체질을 가지고 있습니다.",
    weakPoints: "스트레스 관리에 주의가 필요합니다.",
    recommendedExercise: "요가, 명상, 가벼운 산책이 건강에 좋습니다.",
    dietAdvice: "균형잡힌 식단과 충분한 수분 섭취가 중요합니다.",
    healthTiming: "40대 후반부터 건강 관리에 더욱 신경 쓰세요."
  };
}

// 재정 운세
function generateFinanceAnalysis(yearPillar, dayPillar, elementCounts) {
  return {
    wealthStyle: "꾸준한 축적형 재정 관리가 적합합니다.",
    luckyPeriod: "35-45세 사이에 재정적 성과를 거둘 수 있습니다.",
    investmentAdvice: "안정적인 투자와 분산 투자가 좋습니다.",
    riskManagement: "과도한 투기나 도박은 피하세요.",
    longTermPlanning: "장기적인 재정 계획을 세우는 것이 중요합니다."
  };
}

// 월별 운세
function generateMonthlyFortune(birthMonth, elementCounts) {
  const months = [];
  for (let i = 1; i <= 12; i++) {
    const isBirthMonth = i === birthMonth;
    months.push({
      month: i,
      fortune: isBirthMonth ? 
        "생일이 있는 달로 특별한 기운이 감지됩니다. 새로운 시작에 좋은 시기입니다." :
        `${i}월은 ${['학업', '사업', '연애', '건강', '재정', '인간관계'][i % 6]}에 좋은 시기입니다.`,
      luckyColor: ['파랑', '빨강', '노랑', '초록', '보라', '주황', '분홍', '하늘', '연두', '갈색', '회색', '검정'][i - 1],
      luckyNumber: i,
      advice: isBirthMonth ? "생일을 기념하며 새로운 목표를 세워보세요." : "꾸준한 노력이 좋은 결과를 가져올 것입니다."
    });
  }
  return months;
}

// 전문가 조언
function generateExpertAdvice(elementCounts, lifeStage, age) {
  return {
    general: "당신의 사주는 균형잡힌 구조를 가지고 있어 다양한 분야에서 성공할 수 있습니다.",
    specific: `${lifeStage}기에 맞는 적절한 대응이 필요합니다. ${age}세의 현재 나이를 고려하여 계획을 세우세요.`,
    timing: "올해는 변화의 해입니다. 새로운 도전을 두려워하지 마세요.",
    relationships: "주변 사람들과의 관계를 소중히 여기고, 상호 이해를 통해 성장하세요.",
    health: "정기적인 운동과 명상이 운세 개선에 도움이 됩니다."
  };
}

// 운세 개선법
function generateImprovementMethods(elementCounts, weakElements) {
  return {
    daily: "매일 아침 10분 명상과 감사하는 마음을 가지세요.",
    weekly: "주 3회 이상의 운동과 새로운 기술 학습을 권장합니다.",
    monthly: "월 1회 이상의 새로운 경험과 사람들과의 만남을 가지세요.",
    yearly: "연 1회 이상의 여행과 자기계발 프로그램 참여를 권장합니다.",
    spiritual: "자연과의 교감, 예술 활동, 종교적 활동이 영적 성장에 도움이 됩니다."
  };
}

// 특별 주의사항
function generateSpecialNotes(birthYear, birthMonth, birthDay, birthHour) {
  return {
    importantDates: [`${birthMonth}월 ${birthDay}일`, "생일 전후 1주일", "매년 ${birthMonth}월"],
    luckyDirections: ["동쪽", "남쪽", "북동쪽"],
    luckyNumbers: [birthDay, birthMonth, birthYear % 100],
    luckyColors: ["파랑", "초록", "보라"],
    avoid: ["과도한 스트레스", "성급한 판단", "무리한 도전"],
    enhance: ["꾸준한 학습", "건강한 생활습관", "긍정적인 마음가짐"]
  };
}

// 점성술 계산 함수 (기존 로직 유지)
function calculateAstrology(birthYear, birthMonth, birthDay, birthHour) {
  const zodiacSigns = ['물고기자리', '양자리', '황소자리', '쌍둥이자리', '게자리', '사자자리', '처녀자리', '천칭자리', '전갈자리', '사수자리', '염소자리', '물병자리'];
  const elements = ['물', '불', '흙', '공기', '물', '불', '흙', '공기', '물', '불', '흙', '공기'];
  const sunSign = zodiacSigns[birthMonth - 1];
  const element = elements[birthMonth - 1];
  
  // 현재 날짜 정보
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();
  
  // 나이 계산
  const age = currentYear - birthYear;
  const hasHadBirthday = (currentMonth > birthMonth) || (currentMonth === birthMonth && currentDay >= birthDay);
  const currentAge = hasHadBirthday ? age : age - 1;
  
  // 별자리별 상세 특성 정의 (더 풍부한 내용)
  const signTraits = {
    '물고기자리': {
      characteristics: '물고기자리는 가장 신비롭고 직관적인 별자리입니다. 당신은 감정이 매우 풍부하며, 다른 사람의 감정을 마치 자신의 것처럼 느낄 수 있는 특별한 능력을 가지고 있습니다. 예술적 감각이 뛰어나고, 꿈과 현실의 경계를 자유롭게 넘나드는 상상력의 소유자입니다. 영적 세계에 대한 깊은 이해와 공감 능력으로 주변 사람들에게 치유와 위로를 제공합니다.',
      strengths: '창의성, 공감 능력, 직관력, 예술적 감각, 영적 깊이, 치유 능력, 무조건적 사랑',
      weaknesses: '과민성, 우유부단함, 현실 도피 경향, 감정적 소모, 경계 설정 어려움',
      career: '예술가, 상담사, 치료사, 작가, 음악가, 영화감독, 심리학자, 요가 강사, 영성 지도자, 사회복지사',
      love: '물고기자리는 가장 로맨틱하고 이상적인 사랑을 추구합니다. 감정적 교류가 깊고, 파트너와의 영적 연결을 중요시합니다. 무조건적 사랑을 베풀며, 상대방의 감정을 깊이 이해하고 공감합니다. 하지만 때로는 너무 이상적이어서 현실적인 관계에서 어려움을 겪을 수 있습니다.',
      fortune: `${currentYear}년은 물고기자리에게 직감과 영감이 예리해지는 특별한 해입니다. 중요한 결정을 내릴 때 내면의 소리에 귀 기울이는 것이 좋습니다. 예술적 활동이나 창작 작업을 통해 자신을 표현할 수 있는 기회가 많아집니다. 또한 다른 사람을 돕는 일을 통해 큰 만족감을 얻을 수 있습니다.`,
      fortuneAdvice: '감정에 휘둘리지 말고 현실적인 판단을 함께 하세요. 타인의 감정에 너무 많이 휘둘리지 말고 자신의 경계를 설정하는 것이 중요합니다. 창작 활동을 통해 감정을 건강하게 표현하세요.',
      planetaryInfluence: '해왕성의 영향으로 직관과 영감이 강해집니다. 달의 영향으로 감정적 깊이가 더욱 심화되며, 목성의 영향으로 영적 성장과 확장의 기회가 많아집니다.',
      detailedAnalysis: '물고기자리는 가장 신비로운 별자리로, 영적 세계와 현실 세계를 연결하는 다리 역할을 합니다. 당신의 직관력은 때로는 초자연적일 정도로 정확하며, 다른 사람의 마음을 읽는 능력이 있습니다. 하지만 이러한 특성 때문에 현실 세계에서 어려움을 겪을 수 있으므로, 균형을 유지하는 것이 중요합니다.',
      recommendations: [
        '매일 명상이나 요가를 통해 내면의 평화를 찾으세요',
        '창작 활동을 통해 감정을 표현하세요',
        '타인의 감정에 너무 많이 휘둘리지 마세요',
        '현실적인 목표를 세우고 단계적으로 달성하세요',
        '자연과 함께하는 시간을 가지세요',
        '영적 활동이나 종교 활동에 참여해보세요',
        '감정을 일기나 예술로 표현하는 습관을 기르세요',
        '경계 설정을 연습하고 자신을 보호하는 방법을 배우세요'
      ],
      luckyNumbers: [3, 7, 12, 21, 33],
      luckyColors: ['파랑', '보라', '은색', '연보라'],
      luckyDays: ['월요일', '목요일'],
      compatibility: '게자리, 전갈자리와 가장 잘 맞으며, 천칭자리, 쌍둥이자리와도 좋은 관계를 맺을 수 있습니다.',
      healthAdvice: '감정적 스트레스에 취약하므로 정기적인 운동과 명상이 중요합니다. 수분 섭취를 늘리고 해독에 도움이 되는 음식을 섭취하세요.',
      careerAdvice: '창의적이고 감정적 교류가 많은 직업이 적합합니다. 다른 사람을 돕는 일이나 예술 분야에서 성공할 가능성이 높습니다.',
      relationshipAdvice: '감정적 교류가 깊은 관계를 추구하세요. 파트너와의 영적 연결을 중요시하고, 서로를 이해하고 공감하는 관계를 만들어가세요.'
    },
    '양자리': {
      characteristics: '양자리는 불의 원소를 가진 첫 번째 별자리로, 새로운 시작과 도전을 상징합니다. 당신은 활발하고 에너지 넘치며, 리더십이 뛰어난 선구자적 성격을 가지고 있습니다. 새로운 도전을 즐기고 모험을 추구하며, 항상 앞장서서 다른 사람들을 이끄는 타입입니다. 솔직하고 직접적인 성격으로, 복잡한 것을 싫어하고 명확한 답을 추구합니다.',
      strengths: '리더십, 용기, 에너지, 창의성, 솔직함, 결단력, 도전정신, 열정',
      weaknesses: '성급함, 고집, 충동성, 이기심, 인내심 부족, 감정 조절 어려움',
      career: '경영자, 기업가, 운동선수, 군인, 경찰, 정치인, 언론인, 엔터테인먼트 업계 종사자, 모험가',
      love: '양자리는 열정적이고 직접적인 사랑을 추구합니다. 로맨틱한 제스처와 서프라이즈를 즐기며, 파트너에게 충성스럽습니다. 하지만 때로는 성급한 결정을 내려 관계에서 문제가 생길 수 있습니다.',
      fortune: `${currentYear}년은 양자리에게 새로운 시작과 도전의 해입니다. 새로운 프로젝트나 사업을 시작하기 좋은 시기이며, 리더십을 발휘할 수 있는 기회가 많아집니다. 에너지가 넘쳐서 많은 일을 동시에 진행할 수 있지만, 인내심을 기르는 것이 중요합니다.`,
      fortuneAdvice: '성급한 결정을 피하고 신중하게 생각한 후 행동하세요. 다른 사람의 의견도 존중하고, 팀워크의 중요성을 잊지 마세요.',
      planetaryInfluence: '화성의 영향으로 에너지와 용기가 강해집니다. 태양의 영향으로 자신감과 카리스마가 높아지며, 목성의 영향으로 확장과 성장의 기회가 많아집니다.',
      detailedAnalysis: '양자리는 불의 원소를 가진 별자리로, 새로운 시작과 도전을 상징합니다. 당신의 에너지와 열정은 주변 사람들에게 큰 영향을 미치며, 리더십을 통해 많은 사람들을 이끌 수 있습니다. 하지만 때로는 너무 성급하거나 고집스러워서 문제가 생길 수 있으므로, 인내심과 유연성을 기르는 것이 중요합니다.',
      recommendations: [
        '규칙적인 운동으로 에너지를 발산하세요',
        '리더십을 발휘할 수 있는 기회를 찾으세요',
        '인내심을 기르고 다른 사람의 의견도 들어보세요',
        '목표를 세우고 단계적으로 달성하세요',
        '새로운 도전을 두려워하지 마세요',
        '팀워크의 중요성을 기억하세요',
        '감정 조절을 연습하세요',
        '명확한 목표 설정과 계획 수립을 하세요'
      ],
      luckyNumbers: [1, 9, 17, 21, 29],
      luckyColors: ['빨강', '주황', '노랑', '흰색'],
      luckyDays: ['화요일', '금요일'],
      compatibility: '사자자리, 사수자리와 가장 잘 맞으며, 천칭자리, 쌍둥이자리와도 좋은 관계를 맺을 수 있습니다.',
      healthAdvice: '에너지가 넘치므로 정기적인 운동이 중요합니다. 스트레스 관리와 충분한 휴식이 필요하며, 머리 부위 건강에 주의하세요.',
      careerAdvice: '리더십을 발휘할 수 있는 직업이 적합합니다. 새로운 도전과 모험이 있는 분야에서 성공할 가능성이 높습니다.',
      relationshipAdvice: '열정적이고 직접적인 사랑을 추구하세요. 파트너와의 활발한 교류와 함께 성장하는 관계를 만들어가세요.'
    },
    '황소자리': {
      characteristics: '황소자리는 흙의 원소를 가진 별자리로, 안정과 실용성을 상징합니다. 당신은 안정적이고 신뢰할 수 있으며 실용적인 성격을 가지고 있습니다. 아름다움과 안락함을 추구하며, 감각적이고 현실적인 판단을 합니다. 인내심이 뛰어나고 한 번 시작한 일은 끝까지 완성하는 끈기를 가지고 있습니다.',
      strengths: '안정성, 신뢰성, 인내심, 실용성, 감각적, 끈기, 충성심',
      weaknesses: '고집, 보수적, 변화 두려움, 물질적, 느린 변화',
      career: '회계사, 은행원, 건축가, 디자이너, 요리사, 농부, 부동산 중개인, 보석상',
      love: '안정적이고 오래가는 사랑을 추구하며, 파트너에게 헌신적입니다. 감각적인 사랑을 중요시하며, 물질적 안정감도 함께 추구합니다.',
      fortune: `${currentYear}년은 황소자리에게 재정적으로 안정적인 시기입니다. 장기적인 투자나 계획을 세우기 좋은 해이며, 새로운 기회를 신중하게 검토하여 선택하세요.`,
      fortuneAdvice: '변화를 두려워하지 말고 새로운 기회를 받아들이세요. 때로는 안전지대를 벗어나 도전하는 것도 필요합니다.',
      planetaryInfluence: '금성의 영향으로 아름다움과 조화를 추구합니다. 토성의 영향으로 안정성과 인내심이 강해집니다.',
      detailedAnalysis: '황소자리는 흙의 원소를 가진 별자리로, 안정과 실용성을 상징합니다. 당신의 신뢰성과 인내심은 주변 사람들에게 큰 안정감을 제공하며, 실용적인 접근 방식으로 문제를 해결합니다. 하지만 때로는 너무 보수적이거나 변화를 두려워해서 기회를 놓칠 수 있으므로, 적절한 변화를 받아들이는 것이 중요합니다.',
      recommendations: [
        '자연과 함께하는 시간을 가지세요',
        '예술이나 음악을 통해 감각을 발달시키세요',
        '재정 계획을 세우고 장기적인 목표를 설정하세요',
        '변화에 대한 두려움을 극복하세요',
        '새로운 취미나 활동을 시도해보세요',
        '건강한 식습관을 유지하세요',
        '가족과의 시간을 소중히 하세요',
        '금융 지식을 쌓고 투자에 관심을 가지세요'
      ],
      luckyNumbers: [2, 6, 15, 24, 33],
      luckyColors: ['초록', '갈색', '분홍', '흰색'],
      luckyDays: ['금요일', '토요일'],
      compatibility: '처녀자리, 염소자리와 가장 잘 맞으며, 물고기자리, 게자리와도 좋은 관계를 맺을 수 있습니다.',
      healthAdvice: '안정적인 생활 습관이 중요합니다. 규칙적인 운동과 균형 잡힌 식단을 유지하세요. 목과 귀 건강에 주의하세요.',
      careerAdvice: '안정적이고 실용적인 직업이 적합합니다. 재정이나 건축 분야에서 성공할 가능성이 높습니다.',
      relationshipAdvice: '안정적이고 신뢰할 수 있는 관계를 추구하세요. 파트너와의 깊은 유대감을 중요시하세요.'
    },
    '쌍둥이자리': {
      characteristics: '쌍둥이자리는 공기의 원소를 가진 별자리로, 소통과 지적 교류를 상징합니다. 당신은 호기심이 많고 지적이며 소통 능력이 뛰어납니다. 다양한 관심사를 가지고 다재다능하며, 새로운 정보를 빠르게 습득하는 능력이 있습니다. 적응력이 뛰어나고 다양한 환경에서 잘 적응합니다.',
      strengths: '소통 능력, 지적 호기심, 적응력, 다재다능함, 유연성, 학습 능력',
      weaknesses: '산만함, 일관성 부족, 표면적, 불안정함, 집중력 부족',
      career: '언론인, 작가, 교사, 세일즈맨, 통역사, 마케터, 커뮤니케이션 전문가',
      love: '지적 교류가 중요한 사랑을 추구하며, 다양한 관심사를 공유합니다. 대화를 통한 정신적 교류를 중요시합니다.',
      fortune: `${currentYear}년은 쌍둥이자리에게 새로운 정보나 지식을 얻기 좋은 시기입니다. 학습이나 여행을 통해 새로운 경험을 쌓을 수 있으며, 소통 능력을 활용할 기회가 많습니다.`,
      fortuneAdvice: '한 가지에 집중하고 깊이 있는 관계를 만들어보세요. 표면적이 아닌 깊이 있는 교류를 추구하세요.',
      planetaryInfluence: '수성의 영향으로 소통과 지적 활동이 활발해집니다. 목성의 영향으로 확장과 학습의 기회가 많아집니다.',
      detailedAnalysis: '쌍둥이자리는 공기의 원소를 가진 별자리로, 소통과 지적 교류를 상징합니다. 당신의 다재다능함과 적응력은 다양한 분야에서 성공할 수 있는 기반이 되며, 소통 능력은 인간관계에서 큰 장점이 됩니다. 하지만 때로는 너무 산만하거나 일관성이 부족해서 문제가 생길 수 있으므로, 집중력과 깊이를 기르는 것이 중요합니다.',
      recommendations: [
        '새로운 언어나 기술을 배워보세요',
        '다양한 사람들과의 교류를 늘리세요',
        '한 가지 주제에 깊이 집중해보세요',
        '일정 관리와 우선순위 설정을 연습하세요',
        '독서나 학습을 통해 지식을 쌓으세요',
        '여행을 통해 새로운 경험을 쌓으세요',
        '글쓰기나 블로깅을 통해 생각을 정리하세요',
        '정기적인 운동으로 에너지를 발산하세요'
      ],
      luckyNumbers: [3, 7, 12, 21, 30],
      luckyColors: ['노랑', '주황', '연두', '하늘색'],
      luckyDays: ['수요일', '토요일'],
      compatibility: '천칭자리, 물병자리와 가장 잘 맞으며, 양자리, 사자자리와도 좋은 관계를 맺을 수 있습니다.',
      healthAdvice: '정신적 활동이 많으므로 충분한 휴식이 필요합니다. 호흡 운동과 명상을 통해 스트레스를 관리하세요.',
      careerAdvice: '소통과 지적 활동이 많은 직업이 적합합니다. 교육이나 미디어 분야에서 성공할 가능성이 높습니다.',
      relationshipAdvice: '지적 교류가 풍부한 관계를 추구하세요. 파트너와의 대화를 통해 서로를 이해하세요.'
    },
    '게자리': {
      characteristics: '게자리는 물의 원소를 가진 별자리로, 감정과 가족을 상징합니다. 당신은 감정이 풍부하고 가족을 중시하며 보호 본능이 강합니다. 직관적이고 기억력이 뛰어나며, 과거의 경험을 잘 기억하고 활용합니다. 안전한 환경을 추구하고 가정의 화목을 중요시합니다.',
      strengths: '보호 본능, 감정적 깊이, 직관력, 기억력, 충성심, 가족애',
      weaknesses: '과민성, 과보호, 과거 집착, 기분 변화, 변화 두려움',
      career: '간호사, 교사, 상담사, 요리사, 가정주부, 사회복지사, 요리사',
      love: '가족적이고 안전한 사랑을 추구하며, 파트너를 보호하려는 마음이 큽니다. 감정적 교류가 깊고 안정적인 관계를 원합니다.',
      fortune: `${currentYear}년은 게자리에게 가족과의 관계가 중요한 시기입니다. 가정의 화목에 집중하고, 새로운 가정을 꾸릴 수 있는 기회가 있을 수 있습니다.`,
      fortuneAdvice: '과거에 집착하지 말고 현재와 미래에 집중하세요. 새로운 변화를 두려워하지 마세요.',
      planetaryInfluence: '달의 영향으로 감정과 직관이 강해집니다. 금성의 영향으로 가족과의 관계가 중요해집니다.',
      detailedAnalysis: '게자리는 물의 원소를 가진 별자리로, 감정과 가족을 상징합니다. 당신의 보호 본능과 감정적 깊이는 주변 사람들에게 안전감을 제공하며, 가족을 중시하는 마음은 따뜻한 가정을 만드는 기반이 됩니다. 하지만 때로는 과보호적이거나 과거에 집착해서 문제가 생길 수 있으므로, 적절한 거리감과 변화를 받아들이는 것이 중요합니다.',
      recommendations: [
        '가족과의 시간을 더 가지세요',
        '감정을 표현하는 방법을 배우세요',
        '과거의 상처를 치유하고 용서하세요',
        '안전한 환경에서 새로운 도전을 해보세요',
        '요리나 가정 활동을 통해 자신을 표현하세요',
        '정기적인 운동으로 감정을 조절하세요',
        '새로운 사람들과의 만남을 두려워하지 마세요',
        '가족의 의견도 존중하되 자신의 선택도 소중히 하세요'
      ],
      luckyNumbers: [2, 7, 11, 16, 20],
      luckyColors: ['은색', '흰색', '연파랑', '연분홍'],
      luckyDays: ['월요일', '목요일'],
      compatibility: '물고기자리, 전갈자리와 가장 잘 맞으며, 황소자리, 처녀자리와도 좋은 관계를 맺을 수 있습니다.',
      healthAdvice: '감정적 스트레스에 취약하므로 정기적인 운동과 충분한 휴식이 중요합니다. 가슴과 위 건강에 주의하세요.',
      careerAdvice: '돌봄과 보호가 필요한 직업이 적합합니다. 교육이나 의료 분야에서 성공할 가능성이 높습니다.',
      relationshipAdvice: '안전하고 안정적인 관계를 추구하세요. 파트너와의 깊은 감정적 교류를 중요시하세요.'
    },
    '사자자리': {
      characteristics: '사자자리는 불의 원소를 가진 별자리로, 자신감과 리더십을 상징합니다. 당신은 자신감이 넘치고 카리스마가 있으며 리더십이 뛰어납니다. 관대하고 따뜻한 마음을 가져 주변 사람들을 이끄는 타입입니다. 창의적이고 예술적 감각이 뛰어나며, 주목받는 것을 즐깁니다.',
      strengths: '자신감, 카리스마, 리더십, 관대함, 창의성, 열정, 용기',
      weaknesses: '자만심, 고집, 과시, 독재적, 인정받고 싶어함',
      career: '배우, 정치인, 경영자, 예술가, 교사, 엔터테인먼트 업계 종사자',
      love: '로맨틱하고 열정적인 사랑을 추구하며, 파트너에게 관대합니다. 주목받는 사랑을 원하며, 파트너를 자랑스러워합니다.',
      fortune: `${currentYear}년은 사자자리에게 자신감이 높아지는 시기입니다. 리더십을 발휘할 수 있는 기회가 많아지며, 창의적 활동을 통해 성공할 수 있습니다.`,
      fortuneAdvice: '타인의 의견도 존중하고 겸손함을 잃지 마세요. 팀워크의 중요성을 기억하세요.',
      planetaryInfluence: '태양의 영향으로 자신감과 카리스마가 강해집니다. 목성의 영향으로 확장과 성장의 기회가 많아집니다.',
      detailedAnalysis: '사자자리는 불의 원소를 가진 별자리로, 자신감과 리더십을 상징합니다. 당신의 카리스마와 리더십은 많은 사람들을 이끌 수 있는 힘이 되며, 창의성과 열정은 다양한 분야에서 성공할 수 있는 기반이 됩니다. 하지만 때로는 너무 자만심이 강하거나 독재적이어서 문제가 생길 수 있으므로, 겸손함과 타인에 대한 배려를 기르는 것이 중요합니다.',
      recommendations: [
        '창작 활동을 통해 자신을 표현하세요',
        '리더십을 발휘할 수 있는 기회를 찾으세요',
        '타인에게 관대하고 따뜻한 마음을 가지세요',
        '겸손함과 자신감의 균형을 유지하세요',
        '예술이나 창작 활동에 참여하세요',
        '팀워크의 중요성을 기억하세요',
        '정기적인 운동으로 에너지를 발산하세요',
        '타인의 의견을 경청하는 습관을 기르세요'
      ],
      luckyNumbers: [1, 4, 10, 22, 28],
      luckyColors: ['금색', '주황', '빨강', '보라'],
      luckyDays: ['일요일', '화요일'],
      compatibility: '양자리, 사수자리와 가장 잘 맞으며, 천칭자리, 쌍둥이자리와도 좋은 관계를 맺을 수 있습니다.',
      healthAdvice: '심장과 등 건강에 주의하세요. 정기적인 운동과 충분한 휴식이 중요합니다.',
      careerAdvice: '리더십과 창의성이 필요한 직업이 적합합니다. 예술이나 엔터테인먼트 분야에서 성공할 가능성이 높습니다.',
      relationshipAdvice: '열정적이고 로맨틱한 사랑을 추구하세요. 파트너와의 깊은 감정적 교류를 중요시하세요.'
    },
    '처녀자리': {
      characteristics: '처녀자리는 흙의 원소를 가진 별자리로, 분석과 실용성을 상징합니다. 당신은 꼼꼼하고 분석적이며 실용적인 성격입니다. 완벽주의적이고 책임감이 강하며, 세부사항에 주의를 기울입니다. 지적이고 논리적인 사고를 하며, 효율성을 중요시합니다.',
      strengths: '분석력, 실용성, 책임감, 꼼꼼함, 지적, 효율성, 신뢰성',
      weaknesses: '완벽주의, 비판적, 걱정, 유연성 부족, 과도한 분석',
      career: '회계사, 의사, 연구원, 편집자, 분석가, 엔지니어, 과학자',
      love: '안정적이고 신뢰할 수 있는 사랑을 추구하며, 파트너에게 헌신적입니다. 실용적인 관계를 중요시합니다.',
      fortune: `${currentYear}년은 처녀자리에게 세밀한 계획을 세우기 좋은 시기입니다. 목표를 구체적으로 설정하고 체계적으로 달성할 수 있습니다.`,
      fortuneAdvice: '완벽을 추구하되, 타인과 자신에게 너무 엄격하지 마세요. 유연성을 기르는 것이 중요합니다.',
      planetaryInfluence: '수성의 영향으로 분석력과 실용성이 강해집니다. 토성의 영향으로 책임감과 인내심이 강해집니다.',
      detailedAnalysis: '처녀자리는 흙의 원소를 가진 별자리로, 분석과 실용성을 상징합니다. 당신의 분석력과 실용성은 문제 해결에 큰 도움이 되며, 꼼꼼함과 책임감은 신뢰받는 인재가 되는 기반이 됩니다. 하지만 때로는 너무 완벽주의적이거나 비판적이어서 문제가 생길 수 있으므로, 유연성과 관대함을 기르는 것이 중요합니다.',
      recommendations: [
        '규칙적인 생활 습관을 유지하세요',
        '분석적 사고를 활용한 문제 해결을 하세요',
        '완벽주의를 조금 완화하고 유연성을 기르세요',
        '건강 관리에 더욱 신경 쓰세요',
        '새로운 기술이나 지식을 배워보세요',
        '타인에게 관대하고 이해심을 가지세요',
        '정기적인 운동으로 스트레스를 해소하세요',
        '취미 활동을 통해 여유를 가지세요'
      ],
      luckyNumbers: [5, 14, 15, 23, 32],
      luckyColors: ['회색', '갈색', '연두', '흰색'],
      luckyDays: ['수요일', '금요일'],
      compatibility: '황소자리, 염소자리와 가장 잘 맞으며, 게자리, 천칭자리와도 좋은 관계를 맺을 수 있습니다.',
      healthAdvice: '소화기 건강에 주의하세요. 규칙적인 식사와 충분한 수분 섭취가 중요합니다.',
      careerAdvice: '분석과 실용성이 필요한 직업이 적합합니다. 의료나 연구 분야에서 성공할 가능성이 높습니다.',
      relationshipAdvice: '안정적이고 신뢰할 수 있는 관계를 추구하세요. 파트너와의 실용적인 교류를 중요시하세요.'
    },
    '천칭자리': {
      characteristics: '천칭자리는 공기의 원소를 가진 별자리로, 균형과 조화를 상징합니다. 당신은 공정하고 균형감각이 뛰어나며 외교적입니다. 아름다움과 조화를 추구하며, 갈등을 싫어하고 평화로운 환경을 원합니다. 예술적 감각이 뛰어나고 타인과의 관계를 중요시합니다.',
      strengths: '공정성, 균형감각, 외교적, 예술적, 협조적, 매력적',
      weaknesses: '우유부단함, 의존성, 갈등 회피, 표면적, 결정 어려움',
      career: '변호사, 외교관, 디자이너, 중재자, 예술가, 인사담당자',
      love: '조화롭고 균형 잡힌 사랑을 추구하며, 파트너와의 평등한 관계를 중시합니다. 아름다운 사랑을 원합니다.',
      fortune: `${currentYear}년은 천칭자리에게 인간관계가 중요한 시기입니다. 새로운 만남이나 협력 기회가 많아지며, 예술적 활동을 통해 성공할 수 있습니다.`,
      fortuneAdvice: '결정을 미루지 말고 명확한 선택을 하세요. 자신의 의견을 분명히 표현하세요.',
      planetaryInfluence: '금성의 영향으로 아름다움과 조화를 추구합니다. 목성의 영향으로 확장과 성장의 기회가 많아집니다.',
      detailedAnalysis: '천칭자리는 공기의 원소를 가진 별자리로, 균형과 조화를 상징합니다. 당신의 공정성과 균형감각은 갈등 상황에서 중재자 역할을 할 수 있게 하며, 예술적 감각과 외교적 능력은 다양한 분야에서 성공할 수 있는 기반이 됩니다. 하지만 때로는 우유부단하거나 갈등을 회피해서 문제가 생길 수 있으므로, 결단력과 자신감을 기르는 것이 중요합니다.',
      recommendations: [
        '예술이나 미술 활동을 통해 감각을 발달시키세요',
        '인간관계에서 균형을 유지하세요',
        '결정을 내릴 때 명확한 기준을 세우세요',
        '갈등 상황에서 중재자 역할을 해보세요',
        '새로운 사람들과의 만남을 두려워하지 마세요',
        '자신의 의견을 분명히 표현하는 연습을 하세요',
        '정기적인 운동으로 건강을 유지하세요',
        '취미 활동을 통해 자신만의 시간을 가지세요'
      ],
      luckyNumbers: [6, 15, 24, 33, 42],
      luckyColors: ['연파랑', '분홍', '연보라', '흰색'],
      luckyDays: ['금요일', '토요일'],
      compatibility: '쌍둥이자리, 물병자리와 가장 잘 맞으며, 사자자리, 전갈자리와도 좋은 관계를 맺을 수 있습니다.',
      healthAdvice: '신장과 요로 건강에 주의하세요. 충분한 수분 섭취와 정기적인 운동이 중요합니다.',
      careerAdvice: '예술과 외교가 필요한 직업이 적합합니다. 법률이나 디자인 분야에서 성공할 가능성이 높습니다.',
      relationshipAdvice: '조화롭고 균형 잡힌 관계를 추구하세요. 파트너와의 평등한 교류를 중요시하세요.'
    },
    '전갈자리': {
      characteristics: '전갈자리는 물의 원소를 가진 별자리로, 변화와 재생을 상징합니다. 당신은 강렬하고 신비로운 성격으로 깊이 있는 관계를 추구합니다. 직관력과 통찰력이 뛰어나며, 다른 사람의 마음을 읽는 능력이 있습니다. 비밀스럽고 강렬한 에너지를 가지고 있습니다.',
      strengths: '직관력, 통찰력, 집중력, 신뢰성, 열정, 깊이',
      weaknesses: '질투, 복수심, 의심, 극단적, 비밀스러움',
      career: '탐정, 심리학자, 연구원, 경찰, 투자자, 수사관',
      love: '깊이 있고 열정적인 사랑을 추구하며, 파트너에게 전적으로 헌신합니다. 강렬한 감정적 교류를 원합니다.',
      fortune: `${currentYear}년은 전갈자리에게 변화와 재생의 시기입니다. 새로운 시작을 위한 좋은 기회이며, 과거의 상처를 치유할 수 있는 시기입니다.`,
      fortuneAdvice: '과거의 상처를 치유하고 새로운 시작을 준비하세요. 용서와 치유의 힘을 믿으세요.',
      planetaryInfluence: '명왕성의 영향으로 변화와 재생의 에너지가 강해집니다. 화성의 영향으로 열정과 집중력이 강해집니다.',
      detailedAnalysis: '전갈자리는 물의 원소를 가진 별자리로, 변화와 재생을 상징합니다. 당신의 직관력과 통찰력은 다른 사람들이 보지 못하는 것을 볼 수 있게 하며, 강렬한 에너지와 집중력은 목표 달성에 큰 도움이 됩니다. 하지만 때로는 질투나 의심이 강해서 문제가 생길 수 있으므로, 신뢰와 용서를 기르는 것이 중요합니다.',
      recommendations: [
        '심리학이나 철학을 통해 내면을 탐구하세요',
        '과거의 상처를 치유하고 용서하세요',
        '깊이 있는 관계를 만들어보세요',
        '변화를 두려워하지 말고 새로운 시작을 준비하세요',
        '명상이나 요가를 통해 내면의 평화를 찾으세요',
        '타인을 신뢰하는 연습을 하세요',
        '정기적인 운동으로 에너지를 발산하세요',
        '새로운 취미나 활동을 통해 변화를 받아들이세요'
      ],
      luckyNumbers: [8, 11, 18, 22, 29],
      luckyColors: ['진한 빨강', '검정', '진한 보라', '진한 파랑'],
      luckyDays: ['화요일', '목요일'],
      compatibility: '물고기자리, 게자리와 가장 잘 맞으며, 천칭자리, 염소자리와도 좋은 관계를 맺을 수 있습니다.',
      healthAdvice: '생식기와 배뇨기 건강에 주의하세요. 정기적인 검진과 건강 관리가 중요합니다.',
      careerAdvice: '연구와 탐구가 필요한 직업이 적합합니다. 심리학이나 수사 분야에서 성공할 가능성이 높습니다.',
      relationshipAdvice: '깊이 있고 신뢰할 수 있는 관계를 추구하세요. 파트너와의 강렬한 감정적 교류를 중요시하세요.'
    },
    '사수자리': {
      characteristics: '사수자리는 불의 원소를 가진 별자리로, 모험과 확장을 상징합니다. 당신은 낙관적이고 모험을 즐기며 철학적 사고를 합니다. 자유를 추구하고 지식을 탐구하며, 새로운 경험을 통해 성장합니다. 관대하고 진실하며, 삶의 의미를 찾는 것을 중요시합니다.',
      strengths: '낙관성, 모험심, 철학적, 관대함, 진실성, 자유로움',
      weaknesses: '성급함, 무계획, 과도한 낙관, 솔직함, 집중력 부족',
      career: '여행가, 철학자, 교사, 언론인, 외교관, 모험가',
      love: '자유롭고 모험적인 사랑을 추구하며, 파트너와 함께 성장합니다. 정신적 교류를 중요시합니다.',
      fortune: `${currentYear}년은 사수자리에게 새로운 모험과 학습의 시기입니다. 여행이나 교육 기회가 많아지며, 철학적 사고를 통해 성장할 수 있습니다.`,
      fortuneAdvice: '계획을 세우고 현실적인 목표를 설정하세요. 자유로움과 책임감의 균형을 유지하세요.',
      planetaryInfluence: '목성의 영향으로 확장과 성장의 에너지가 강해집니다. 화성의 영향으로 모험과 도전의 기회가 많아집니다.',
      detailedAnalysis: '사수자리는 불의 원소를 가진 별자리로, 모험과 확장을 상징합니다. 당신의 낙관성과 모험심은 새로운 기회를 찾아내는 능력을 제공하며, 철학적 사고와 관대함은 다른 사람들에게 영감을 줄 수 있습니다. 하지만 때로는 너무 성급하거나 무계획적이어서 문제가 생길 수 있으므로, 계획성과 책임감을 기르는 것이 중요합니다.',
      recommendations: [
        '새로운 문화나 언어를 배워보세요',
        '여행을 통해 새로운 경험을 쌓으세요',
        '철학적 사고를 통해 삶의 의미를 탐구하세요',
        '계획을 세우고 체계적으로 목표를 달성하세요',
        '교육이나 학습 활동에 참여하세요',
        '다양한 사람들과의 교류를 늘리세요',
        '정기적인 운동으로 에너지를 발산하세요',
        '자유로움과 책임감의 균형을 유지하세요'
      ],
      luckyNumbers: [3, 9, 12, 21, 30],
      luckyColors: ['보라', '진한 파랑', '연두', '주황'],
      luckyDays: ['목요일', '일요일'],
      compatibility: '양자리, 사자자리와 가장 잘 맞으며, 천칭자리, 물병자리와도 좋은 관계를 맺을 수 있습니다.',
      healthAdvice: '허리와 엉덩이 건강에 주의하세요. 정기적인 운동과 충분한 휴식이 중요합니다.',
      careerAdvice: '교육과 모험이 필요한 직업이 적합합니다. 여행이나 교육 분야에서 성공할 가능성이 높습니다.',
      relationshipAdvice: '자유롭고 성장하는 관계를 추구하세요. 파트너와의 정신적 교류를 중요시하세요.'
    },
    '염소자리': {
      characteristics: '염소자리는 흙의 원소를 가진 별자리로, 책임과 성취를 상징합니다. 당신은 책임감이 강하고 야망이 있으며 실용적인 성격입니다. 인내심과 끈기가 뛰어나며, 장기적인 목표를 설정하고 단계적으로 달성합니다. 현실적이고 체계적인 접근 방식을 선호합니다.',
      strengths: '책임감, 야망, 인내심, 실용성, 끈기, 신뢰성',
      weaknesses: '냉정함, 완고함, 과도한 야망, 유연성 부족, 감정 표현 어려움',
      career: '경영자, 정치인, 회계사, 건축가, 엔지니어, 변호사',
      love: '안정적이고 장기적인 사랑을 추구하며, 파트너에게 충실합니다. 실용적인 관계를 중요시합니다.',
      fortune: `${currentYear}년은 염소자리에게 목표 달성의 시기입니다. 오랫동안 준비해온 일이 성과를 맺을 수 있으며, 경력 발전의 좋은 기회입니다.`,
      fortuneAdvice: '성공에만 집중하지 말고 인간관계도 소중히 하세요. 감정적 교류의 중요성을 잊지 마세요.',
      planetaryInfluence: '토성의 영향으로 책임감과 인내심이 강해집니다. 목성의 영향으로 확장과 성장의 기회가 많아집니다.',
      detailedAnalysis: '염소자리는 흙의 원소를 가진 별자리로, 책임과 성취를 상징합니다. 당신의 책임감과 인내심은 장기적인 목표 달성에 큰 도움이 되며, 실용성과 체계적 접근 방식은 성공을 위한 기반이 됩니다. 하지만 때로는 너무 냉정하거나 완고해서 문제가 생길 수 있으므로, 유연성과 감정적 교류를 기르는 것이 중요합니다.',
      recommendations: [
        '장기적인 목표를 세우고 단계적으로 달성하세요',
        '인내심을 기르고 끈기를 유지하세요',
        '성공과 인간관계의 균형을 유지하세요',
        '가끔은 여유를 가지고 자신을 돌아보세요',
        '새로운 기술이나 지식을 배워보세요',
        '타인과의 감정적 교류를 늘리세요',
        '정기적인 운동으로 스트레스를 해소하세요',
        '취미 활동을 통해 여유를 가지세요'
      ],
      luckyNumbers: [4, 8, 13, 17, 22],
      luckyColors: ['검정', '갈색', '회색', '진한 파랑'],
      luckyDays: ['토요일', '월요일'],
      compatibility: '황소자리, 처녀자리와 가장 잘 맞으며, 전갈자리, 물병자리와도 좋은 관계를 맺을 수 있습니다.',
      healthAdvice: '무릎과 관절 건강에 주의하세요. 정기적인 운동과 충분한 휴식이 중요합니다.',
      careerAdvice: '책임과 성취가 필요한 직업이 적합합니다. 경영이나 정치 분야에서 성공할 가능성이 높습니다.',
      relationshipAdvice: '안정적이고 장기적인 관계를 추구하세요. 파트너와의 실용적인 교류를 중요시하세요.'
    },
    '물병자리': {
      characteristics: '물병자리는 공기의 원소를 가진 별자리로, 혁신과 독립을 상징합니다. 당신은 독창적이고 혁신적이며 인도주의적입니다. 자유를 추구하고 독특한 사고를 하며, 사회적 문제에 관심을 가지고 참여합니다. 미래 지향적이고 독립적인 성격을 가지고 있습니다.',
      strengths: '독창성, 혁신성, 인도주의, 독립성, 지적, 진보적',
      weaknesses: '반항적, 감정적 거리감, 예측 불가능, 고립, 실용성 부족',
      career: '과학자, 발명가, 사회운동가, 작가, 예술가, 연구원',
      love: '독특하고 독립적인 사랑을 추구하며, 파트너와의 정신적 교류를 중시합니다. 자유로운 관계를 원합니다.',
      fortune: `${currentYear}년은 물병자리에게 혁신과 변화의 시기입니다. 새로운 아이디어나 프로젝트를 시작하기 좋으며, 사회적 활동을 통해 성공할 수 있습니다.`,
      fortuneAdvice: '타인과의 감정적 교류를 더 깊게 해보세요. 실용성과 이상의 균형을 유지하세요.',
      planetaryInfluence: '천왕성의 영향으로 혁신과 독창성이 강해집니다. 토성의 영향으로 독립성과 책임감이 강해집니다.',
      detailedAnalysis: '물병자리는 공기의 원소를 가진 별자리로, 혁신과 독립을 상징합니다. 당신의 독창성과 혁신성은 새로운 아이디어와 해결책을 제공하며, 인도주의적 성향은 사회 발전에 기여할 수 있습니다. 하지만 때로는 너무 반항적이거나 감정적 거리감이 있어서 문제가 생길 수 있으므로, 타인과의 감정적 교류를 기르는 것이 중요합니다.',
      recommendations: [
        '새로운 기술이나 아이디어를 탐구하세요',
        '사회적 문제에 관심을 가지고 참여하세요',
        '독창적인 창작 활동을 해보세요',
        '타인과의 감정적 교류를 더 깊게 해보세요',
        '새로운 사람들과의 만남을 두려워하지 마세요',
        '실용성과 이상의 균형을 유지하세요',
        '정기적인 운동으로 건강을 유지하세요',
        '취미 활동을 통해 자신만의 시간을 가지세요'
      ],
      luckyNumbers: [4, 7, 11, 22, 29],
      luckyColors: ['연파랑', '은색', '연보라', '연두'],
      luckyDays: ['토요일', '수요일'],
      compatibility: '쌍둥이자리, 천칭자리와 가장 잘 맞으며, 염소자리, 물고기자리와도 좋은 관계를 맺을 수 있습니다.',
      healthAdvice: '순환기와 다리 건강에 주의하세요. 정기적인 운동과 충분한 휴식이 중요합니다.',
      careerAdvice: '혁신과 독창성이 필요한 직업이 적합합니다. 과학이나 기술 분야에서 성공할 가능성이 높습니다.',
      relationshipAdvice: '독립적이고 성장하는 관계를 추구하세요. 파트너와의 정신적 교류를 중요시하세요.'
    }
  };
  
  const traits = signTraits[sunSign] || signTraits['물고기자리'];
  const period = `${currentYear}년 ${currentMonth}월`;
  
  // 월별 운세 생성
  const monthlyHoroscope = generateMonthlyHoroscope(sunSign, currentYear);
  
  // 연령대별 조언 생성
  const ageAdvice = generateAgeAdvice(currentAge, sunSign);
  
  return {
    title: `${birthYear}년 ${birthMonth}월 ${birthDay}일 점성술 분석`,
    description: "서양 점성술을 통해 당신의 성격과 운세를 알아보세요.",
    sunSign,
    element,
    age: currentAge,
    characteristics: traits.characteristics,
    strengths: traits.strengths,
    weaknesses: traits.weaknesses,
    career: traits.career,
    love: traits.love,
    period,
    fortune: traits.fortune,
    fortuneAdvice: traits.fortuneAdvice,
    planetaryInfluence: traits.planetaryInfluence,
    detailedAnalysis: traits.detailedAnalysis,
    recommendations: traits.recommendations,
    personality: traits.characteristics,
    compatibility: traits.compatibility,
    luckyNumbers: traits.luckyNumbers,
    luckyColors: traits.luckyColors,
    luckyDays: traits.luckyDays,
    healthAdvice: traits.healthAdvice,
    careerAdvice: traits.careerAdvice,
    relationshipAdvice: traits.relationshipAdvice,
    monthlyHoroscope,
    ageAdvice,
    // 추가 정보
    birthInfo: {
      year: birthYear,
      month: birthMonth,
      day: birthDay,
      hour: birthHour,
      zodiacSign: sunSign,
      element: element
    },
    currentPeriod: {
      year: currentYear,
      month: currentMonth,
      period: period
    }
  };
}

// 월별 운세 생성 함수
function generateMonthlyHoroscope(sunSign, year) {
  const months = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  
  const horoscopeTemplates = {
    '물고기자리': [
      '직감이 예리해지는 시기로 중요한 결정을 내릴 때 내면의 소리에 귀 기울이세요.',
      '창작 활동을 통해 감정을 표현할 수 있는 기회가 많아집니다.',
      '타인을 돕는 일을 통해 큰 만족감을 얻을 수 있습니다.',
      '영적 성장과 내면 탐구에 집중하는 것이 좋습니다.',
      '감정적 교류가 깊어지는 시기입니다.',
      '예술적 영감이 넘치는 시기로 창작 활동에 집중하세요.',
      '가족과의 관계가 중요한 시기입니다.',
      '자연과 함께하는 시간을 가지세요.',
      '새로운 학습이나 지식 습득에 도움이 되는 시기입니다.',
      '재정적으로 안정적인 시기입니다.',
      '인간관계에서 새로운 만남이 있을 수 있습니다.',
      '내년을 위한 계획을 세우기 좋은 시기입니다.'
    ],
    '양자리': [
      '새로운 시작과 도전의 시기입니다.',
      '리더십을 발휘할 수 있는 기회가 많아집니다.',
      '에너지가 넘쳐서 많은 일을 동시에 진행할 수 있습니다.',
      '새로운 프로젝트나 사업을 시작하기 좋은 시기입니다.',
      '운동이나 스포츠 활동이 활발해집니다.',
      '창의적 아이디어가 넘치는 시기입니다.',
      '여행이나 모험을 통해 새로운 경험을 쌓을 수 있습니다.',
      '자신감이 높아지는 시기입니다.',
      '새로운 기술이나 지식을 배우기 좋은 시기입니다.',
      '경쟁에서 승리할 수 있는 기회가 많습니다.',
      '사회적 활동이 활발해집니다.',
      '내년을 위한 새로운 목표를 설정하세요.'
    ],
    '황소자리': [
      '재정적으로 안정적인 시기입니다.',
      '장기적인 계획을 세우기 좋은 시기입니다.',
      '자연과 함께하는 시간을 가지세요.',
      '예술적 감각이 발달하는 시기입니다.',
      '가족과의 관계가 중요한 시기입니다.',
      '새로운 취미나 활동을 시도해보세요.',
      '건강 관리에 집중하세요.',
      '금융 투자에 관심을 가지세요.',
      '감각적 만족을 추구하는 시기입니다.',
      '안정적인 관계를 구축하세요.',
      '새로운 기회를 신중하게 검토하세요.',
      '내년을 위한 재정 계획을 세우세요.'
    ],
    '쌍둥이자리': [
      '새로운 정보나 지식을 얻기 좋은 시기입니다.',
      '소통 능력을 활용할 기회가 많습니다.',
      '여행을 통해 새로운 경험을 쌓으세요.',
      '새로운 언어나 기술을 배워보세요.',
      '다양한 사람들과의 교류가 활발해집니다.',
      '창작 활동에 집중하세요.',
      '학습이나 교육 기회가 많습니다.',
      '새로운 아이디어가 넘치는 시기입니다.',
      '글쓰기나 블로깅을 통해 자신을 표현하세요.',
      '새로운 프로젝트를 시작하기 좋은 시기입니다.',
      '지적 교류가 풍부한 시기입니다.',
      '내년을 위한 학습 계획을 세우세요.'
    ],
    '게자리': [
      '가족과의 관계가 중요한 시기입니다.',
      '가정의 화목에 집중하세요.',
      '감정적 교류가 깊어지는 시기입니다.',
      '새로운 가정을 꾸릴 수 있는 기회가 있습니다.',
      '요리나 가정 활동을 통해 자신을 표현하세요.',
      '과거의 상처를 치유하는 시기입니다.',
      '안전한 환경에서 새로운 도전을 해보세요.',
      '가족과의 시간을 더 가지세요.',
      '감정을 표현하는 방법을 배우세요.',
      '새로운 사람들과의 만남이 있을 수 있습니다.',
      '가정의 안정감을 추구하는 시기입니다.',
      '내년을 위한 가정 계획을 세우세요.'
    ],
    '사자자리': [
      '자신감이 높아지는 시기입니다.',
      '리더십을 발휘할 수 있는 기회가 많습니다.',
      '창의적 활동을 통해 성공할 수 있습니다.',
      '예술이나 엔터테인먼트 분야에서 활약할 수 있습니다.',
      '주목받는 활동이 많아집니다.',
      '새로운 프로젝트를 시작하기 좋은 시기입니다.',
      '여행이나 모험을 통해 새로운 경험을 쌓으세요.',
      '타인에게 관대하고 따뜻한 마음을 가지세요.',
      '창작 활동을 통해 자신을 표현하세요.',
      '사회적 활동이 활발해집니다.',
      '새로운 도전을 두려워하지 마세요.',
      '내년을 위한 창의적 계획을 세우세요.'
    ],
    '처녀자리': [
      '세밀한 계획을 세우기 좋은 시기입니다.',
      '목표를 구체적으로 설정하고 체계적으로 달성하세요.',
      '새로운 기술이나 지식을 배워보세요.',
      '건강 관리에 더욱 신경 쓰세요.',
      '분석적 사고를 활용한 문제 해결을 하세요.',
      '규칙적인 생활 습관을 유지하세요.',
      '완벽주의를 조금 완화하고 유연성을 기르세요.',
      '새로운 프로젝트를 체계적으로 진행하세요.',
      '타인에게 관대하고 이해심을 가지세요.',
      '정기적인 운동으로 스트레스를 해소하세요.',
      '취미 활동을 통해 여유를 가지세요.',
      '내년을 위한 체계적인 계획을 세우세요.'
    ],
    '천칭자리': [
      '인간관계가 중요한 시기입니다.',
      '새로운 만남이나 협력 기회가 많습니다.',
      '예술적 활동을 통해 성공할 수 있습니다.',
      '갈등 상황에서 중재자 역할을 해보세요.',
      '새로운 사람들과의 만남을 두려워하지 마세요.',
      '자신의 의견을 분명히 표현하는 연습을 하세요.',
      '예술이나 미술 활동을 통해 감각을 발달시키세요.',
      '인간관계에서 균형을 유지하세요.',
      '결정을 내릴 때 명확한 기준을 세우세요.',
      '새로운 프로젝트를 시작하기 좋은 시기입니다.',
      '사회적 활동이 활발해집니다.',
      '내년을 위한 인간관계 계획을 세우세요.'
    ],
    '전갈자리': [
      '변화와 재생의 시기입니다.',
      '새로운 시작을 위한 좋은 기회입니다.',
      '과거의 상처를 치유할 수 있는 시기입니다.',
      '심리학이나 철학을 통해 내면을 탐구하세요.',
      '깊이 있는 관계를 만들어보세요.',
      '명상이나 요가를 통해 내면의 평화를 찾으세요.',
      '타인을 신뢰하는 연습을 하세요.',
      '새로운 취미나 활동을 통해 변화를 받아들이세요.',
      '정기적인 운동으로 에너지를 발산하세요.',
      '새로운 프로젝트를 시작하기 좋은 시기입니다.',
      '강렬한 감정적 교류가 있는 시기입니다.',
      '내년을 위한 변화 계획을 세우세요.'
    ],
    '사수자리': [
      '새로운 모험과 학습의 시기입니다.',
      '여행이나 교육 기회가 많습니다.',
      '철학적 사고를 통해 성장할 수 있습니다.',
      '새로운 문화나 언어를 배워보세요.',
      '다양한 사람들과의 교류를 늘리세요.',
      '교육이나 학습 활동에 참여하세요.',
      '여행을 통해 새로운 경험을 쌓으세요.',
      '철학적 사고를 통해 삶의 의미를 탐구하세요.',
      '새로운 프로젝트를 시작하기 좋은 시기입니다.',
      '사회적 활동이 활발해집니다.',
      '자유로움과 책임감의 균형을 유지하세요.',
      '내년을 위한 모험 계획을 세우세요.'
    ],
    '염소자리': [
      '목표 달성의 시기입니다.',
      '오랫동안 준비해온 일이 성과를 맺을 수 있습니다.',
      '경력 발전의 좋은 기회입니다.',
      '장기적인 목표를 세우고 단계적으로 달성하세요.',
      '새로운 기술이나 지식을 배워보세요.',
      '타인과의 감정적 교류를 늘리세요.',
      '정기적인 운동으로 스트레스를 해소하세요.',
      '취미 활동을 통해 여유를 가지세요.',
      '성공과 인간관계의 균형을 유지하세요.',
      '새로운 프로젝트를 시작하기 좋은 시기입니다.',
      '책임감과 인내심을 발휘하는 시기입니다.',
      '내년을 위한 성취 계획을 세우세요.'
    ],
    '물병자리': [
      '혁신과 변화의 시기입니다.',
      '새로운 아이디어나 프로젝트를 시작하기 좋습니다.',
      '사회적 활동을 통해 성공할 수 있습니다.',
      '새로운 기술이나 아이디어를 탐구하세요.',
      '사회적 문제에 관심을 가지고 참여하세요.',
      '독창적인 창작 활동을 해보세요.',
      '새로운 사람들과의 만남을 두려워하지 마세요.',
      '실용성과 이상의 균형을 유지하세요.',
      '새로운 프로젝트를 시작하기 좋은 시기입니다.',
      '사회적 활동이 활발해집니다.',
      '타인과의 감정적 교류를 더 깊게 해보세요.',
      '내년을 위한 혁신 계획을 세우세요.'
    ]
  };
  
  const templates = horoscopeTemplates[sunSign] || horoscopeTemplates['물고기자리'];
  
  return months.map((month, index) => ({
    month: month,
    prediction: templates[index] || `${month}은 새로운 기회와 도전의 시기입니다.`
  }));
}

// 연령대별 조언 생성 함수
function generateAgeAdvice(age, sunSign) {
  if (age < 20) {
    return '청소년기에는 자신의 특성을 발견하고 개발하는 것이 중요합니다. 다양한 경험을 통해 자신의 재능을 찾아보세요.';
  } else if (age < 30) {
    return '20대는 자신의 정체성을 확립하고 사회에 진출하는 중요한 시기입니다. 새로운 도전을 두려워하지 마세요.';
  } else if (age < 40) {
    return '30대는 경력과 가정을 동시에 발전시키는 시기입니다. 균형을 유지하면서 성장하세요.';
  } else if (age < 50) {
    return '40대는 경험을 바탕으로 한 지혜가 필요한 시기입니다. 후배들을 가르치고 리더십을 발휘하세요.';
  } else if (age < 60) {
    return '50대는 인생의 새로운 단계를 시작하는 시기입니다. 새로운 취미나 활동을 통해 활력을 찾으세요.';
  } else {
    return '60대 이후는 인생의 지혜를 나누고 후손들에게 가르침을 주는 시기입니다. 건강 관리에 더욱 신경 쓰세요.';
  }
}

// 관계 분석 계산 함수
function calculateRelationship(userYear, userMonth, userDay, userHour, friendYear, friendMonth, friendDay, friendHour, friendName, relationshipType) {
  // 간단한 호환성 점수 계산 (실제로는 더 복잡한 알고리즘 필요)
  const userAge = new Date().getFullYear() - userYear;
  const friendAge = new Date().getFullYear() - friendYear;
  const ageDiff = Math.abs(userAge - friendAge);
  
  // 기본 호환성 점수 (0-100)
  let compatibilityScore = 70; // 기본 점수
  
  // 나이 차이에 따른 조정
  if (ageDiff <= 3) compatibilityScore += 15;
  else if (ageDiff <= 7) compatibilityScore += 5;
  else if (ageDiff <= 15) compatibilityScore -= 5;
  else compatibilityScore -= 15;
  
  // 관계 유형에 따른 조정
  const relationshipModifiers = {
    'romantic': { base: 10, max: 95 },
    'friend': { base: 5, max: 90 },
    'family': { base: 15, max: 100 },
    'colleague': { base: 0, max: 85 },
    'business': { base: -5, max: 80 }
  };
  
  const modifier = relationshipModifiers[relationshipType] || relationshipModifiers.friend;
  compatibilityScore += modifier.base;
  compatibilityScore = Math.min(compatibilityScore, modifier.max);
  compatibilityScore = Math.max(compatibilityScore, 0);
  
  // 호환성 등급 결정
  let compatibilityGrade, gradeClass;
  if (compatibilityScore >= 85) {
    compatibilityGrade = "매우 좋음";
    gradeClass = "excellent";
  } else if (compatibilityScore >= 70) {
    compatibilityGrade = "좋음";
    gradeClass = "good";
  } else if (compatibilityScore >= 50) {
    compatibilityGrade = "보통";
    gradeClass = "fair";
  } else {
    compatibilityGrade = "나쁨";
    gradeClass = "poor";
  }
  
  // 관계별 상세 분석
  const relationshipAnalysis = {
    'romantic': {
      communication: "감정적 교류가 활발하며 서로를 이해하는 능력이 뛰어납니다.",
      trust: "신뢰 관계를 형성하기에 좋은 조합입니다.",
      passion: "서로에게 끌림을 느끼고 열정적인 관계를 만들 수 있습니다.",
      longTerm: "장기적인 관계 발전 가능성이 높습니다."
    },
    'friend': {
      communication: "자연스러운 대화가 가능하며 서로의 관심사를 공유합니다.",
      support: "어려운 시기에 서로를 도와줄 수 있는 관계입니다.",
      fun: "즐거운 시간을 함께 보낼 수 있는 친구 관계입니다.",
      growth: "서로의 성장을 도와주는 긍정적인 영향이 있습니다."
    },
    'family': {
      understanding: "가족으로서 서로를 깊이 이해할 수 있습니다.",
      support: "가족적 유대감이 강하며 서로를 보호하려는 마음이 큽니다.",
      harmony: "가정의 화목을 위해 노력하는 관계입니다.",
      tradition: "가족의 전통과 가치를 이어가는 데 도움이 됩니다."
    },
    'colleague': {
      teamwork: "업무에서 좋은 팀워크를 발휘할 수 있습니다.",
      communication: "직장에서 필요한 소통이 원활합니다.",
      respect: "서로의 전문성을 인정하고 존중하는 관계입니다.",
      growth: "직업적 성장을 위해 서로를 도와줄 수 있습니다."
    },
    'business': {
      partnership: "비즈니스 파트너십에 적합한 조합입니다.",
      communication: "업무 관련 소통이 명확하고 효율적입니다.",
      trust: "비즈니스 관계에서 신뢰를 쌓을 수 있습니다.",
      success: "함께 성공을 이룰 수 있는 잠재력이 있습니다."
    }
  };
  
  const analysis = relationshipAnalysis[relationshipType] || relationshipAnalysis.friend;
  
  // 조언 생성
  const advice = generateRelationshipAdvice(relationshipType, compatibilityScore, analysis);
  
  // 심화 분석(3배 분량 확장)
  // 다차원 점수 산출(간단한 유도 규칙)
  const clamp = (v, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(v)));
  const base = compatibilityScore;
  const communicationScore = clamp(base + (analysis.communication ? 5 : 0));
  const trustScore = clamp(base + (analysis.trust || analysis.support ? 4 : 0));
  const passionScore = clamp(base + (analysis.passion ? 6 : (analysis.fun ? 3 : 0)));
  const longTermScore = clamp(base + (analysis.longTerm || analysis.growth ? 5 : 0));
  const valuesAlignmentScore = clamp(base - (ageDiff > 10 ? 5 : 0) + (modifier.base >= 10 ? 3 : 0));
  const lifestyleAlignmentScore = clamp(base - (ageDiff > 7 ? 3 : 0) + 2);
  const conflictResolutionScore = clamp((communicationScore + trustScore) / 2);
  const planningScore = clamp((longTermScore + valuesAlignmentScore) / 2);

  const strengths = [];
  if (communicationScore >= 75) strengths.push('소통 리듬이 잘 맞아 핵심 이슈를 빠르게 정리');
  if (trustScore >= 75) strengths.push('신뢰/지원 축이 견고하여 안정감 제공');
  if (passionScore >= 75 && relationshipType === 'romantic') strengths.push('감정·열정의 상승 곡선');
  if (longTermScore >= 75) strengths.push('중장기 계획 수립과 실행에 유리');
  if (valuesAlignmentScore >= 70) strengths.push('가치/원칙에서의 공통분모 확보');

  const cautions = [];
  if (communicationScore < 65) cautions.push('감정 대신 사실/요점 위주로 먼저 정리하여 전달');
  if (conflictResolutionScore < 65) cautions.push('갈등 시 20분 타임아웃 후 재대화 룰 마련');
  if (lifestyleAlignmentScore < 65) cautions.push('일정/생활 리듬 공유(캘린더·취침/기상·식사 패턴)');
  if (valuesAlignmentScore < 65) cautions.push('의사결정 원칙(돈/시간/관계 우선순위) 문서화');

  const conflictPatterns = {
    triggers: [
      '해석 차이가 큰 모호한 메시지',
      '약속/기대치의 암묵적 전제',
      '피로 누적 상태에서의 즉흥 반응'
    ],
    deescalation: [
      '30분 쿨다운 + I-메시지("나는 …하게 느꼈어")',
      '상호 파악 체크리스트(사실/느낌/요청 분리)',
      '해결 가능한/불가능한 이슈 구분 후 스코프 다운'
    ],
    repair: [
      '요약 복기(상대 입장에서 한 문장으로 정리)',
      '실행 가능한 1개 개선 액션만 합의',
      '일주일 뒤 리트로(5분)로 점검'
    ]
  };

  const collaboration = {
    roles: [
      '결정 드라이버 1인, 검증자 1인으로 롤 분리',
      '정보 수집/의견 통합/결정 공표의 3단계 분업'
    ],
    decisionMaking: [
      '금액/시간 기준 임계값별 결재 라인 합의',
      '감정 0~10 스케일 표기 후 토론 시작'
    ],
    money: [
      '공동비용-개인비용 분리, 월 1회 정산',
      '3가지 버킷(필수/성장/여가) 비율 합의'
    ],
    boundaries: [
      '업무시간/휴식시간 경계 준수',
      '연락 빈도/응답 SLA 합의(예: 24시간 내)'
    ]
  };

  const growthPlan = {
    next30d: [
      '공통 취미 1개 파일럿(2회 실행)',
      '의사결정 원칙 A4 1장 작성',
      '주 1회 리트로(10분) 도입'
    ],
    next90d: [
      '분기 목표 3개 설정(관계/재정/건강)',
      '정기 일정(데이트/운동/휴식) 고정',
      '갈등 복기 템플릿 도입'
    ],
    next180d: [
      '합의된 큰 프로젝트 1개 완료',
      '공동 비상금/리스크 플랜 수립',
      '연례 리트릿(1박) 기획'
    ]
  };

  const activities = {
    recommended: [
      '공동 플래너로 주간 리듬 동기화',
      'MBTI/성향 테스트 공유 후 대화',
      '디지털 디톡스 산책/카페 토론'
    ],
    avoid: [
      '수면 부족 상태의 중요한 결정',
      '메신저 장문 논쟁(전화/대면 전환)',
      '일방적 일정 강요'
    ]
  };

  const monthlyFocus = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    theme: i % 3 === 0 ? '소통 정비' : i % 3 === 1 ? '신뢰 구축' : '성장 실험',
    guidance: `${i + 1}월: ${i % 3 === 0 ? '대화 규칙 재정의와 경청 연습' : i % 3 === 1 ? '약속 이행/작은 신뢰 쌓기' : '작은 새로운 시도 2개'}`
  }));

  const deepDive = {
    dimensions: [
      { key: 'communication', title: '소통', score: communicationScore, summary: analysis.communication || analysis.teamwork || '핵심 메시지를 명확히 전달하는 훈련이 필요합니다.' },
      { key: 'trust', title: '신뢰', score: trustScore, summary: analysis.trust || analysis.support || '작은 약속의 반복적 이행이 신뢰의 핵심입니다.' },
      { key: 'passion', title: '감정/열정', score: passionScore, summary: analysis.passion || analysis.fun || '공동의 즐거움 루틴을 설계해 감정 에너지를 끌어올리세요.' },
      { key: 'longterm', title: '장기성', score: longTermScore, summary: analysis.longTerm || analysis.growth || '6~12개월 단위의 계획 수립에 적합합니다.' },
      { key: 'values', title: '가치합', score: valuesAlignmentScore, summary: '핵심 가치(돈/시간/관계/성장) 우선순위 합의가 중요합니다.' },
      { key: 'lifestyle', title: '생활리듬', score: lifestyleAlignmentScore, summary: '수면/식사/운동의 기본 리듬을 동기화하세요.' },
      { key: 'conflict', title: '갈등해결', score: conflictResolutionScore, summary: '갈등 시 룰과 복구 절차를 사전에 정하세요.' },
      { key: 'planning', title: '기획/실행', score: planningScore, summary: '작은 실험-검증-확장 사이클을 추천합니다.' }
    ],
    strengths,
    cautions,
    conflictPatterns,
    collaboration,
    growthPlan,
    activities,
    monthlyFocus
  };

  return {
    title: `${friendName}님과의 관계 분석`,
    subtitle: `${relationshipType === 'romantic' ? '연인' : relationshipType === 'friend' ? '친구' : relationshipType === 'family' ? '가족' : relationshipType === 'colleague' ? '동료' : '비즈니스'} 관계 호환성`,
    friendName,
    relationshipType,
    compatibilityScore,
    compatibilityGrade,
    gradeClass,
    analysis,
    advice,
    details: {
      ageDifference: ageDiff,
      userAge,
      friendAge,
      relationshipType: relationshipType === 'romantic' ? '연인/배우자' : 
                        relationshipType === 'friend' ? '친구' : 
                        relationshipType === 'family' ? '가족' : 
                        relationshipType === 'colleague' ? '동료' : '비즈니스 파트너'
    },
    deepDive
  };
}

// 관계 조언 생성 함수
function generateRelationshipAdvice(relationshipType, score, analysis) {
  const advice = {
    general: [],
    specific: []
  };
  
  // 일반적인 조언
  if (score >= 85) {
    advice.general.push("이 관계는 매우 좋은 조합입니다. 적극적으로 발전시켜 나가세요.");
    advice.general.push("서로의 장점을 인정하고 더욱 깊은 관계를 만들어보세요.");
  } else if (score >= 70) {
    advice.general.push("좋은 관계의 기반이 있습니다. 꾸준한 소통으로 발전시켜 나가세요.");
    advice.general.push("서로의 차이점을 이해하고 존중하는 마음을 가지세요.");
  } else if (score >= 50) {
    advice.general.push("관계 개선을 위해 노력이 필요합니다. 서로를 이해하려는 마음을 가지세요.");
    advice.general.push("정기적인 대화와 소통을 통해 관계를 발전시켜 나가세요.");
  } else {
    advice.general.push("관계 개선을 위해 많은 노력이 필요합니다. 전문가의 조언을 구하는 것도 좋습니다.");
    advice.general.push("서로의 차이점을 인정하고 점진적으로 이해를 높여나가세요.");
  }
  
  // 관계별 특화 조언
  if (relationshipType === 'romantic') {
    advice.specific.push("정기적인 데이트와 특별한 순간을 만들어보세요.");
    advice.specific.push("서로의 감정을 솔직하게 표현하고 공유하세요.");
    advice.specific.push("미래에 대한 계획을 함께 세워보세요.");
  } else if (relationshipType === 'friend') {
    advice.specific.push("함께하는 활동을 통해 우정을 깊게 만들어보세요.");
    advice.specific.push("서로의 관심사에 관심을 가지고 대화해보세요.");
    advice.specific.push("정기적으로 만나서 소식을 나누세요.");
  } else if (relationshipType === 'family') {
    advice.specific.push("가족 모임을 통해 유대감을 강화하세요.");
    advice.specific.push("가족의 전통과 가치를 함께 지켜나가세요.");
    advice.specific.push("서로를 위한 시간을 더 많이 가지세요.");
  } else if (relationshipType === 'colleague') {
    advice.specific.push("업무에서 서로를 도와주고 협력하세요.");
    advice.specific.push("직장 밖에서도 친밀한 관계를 만들어보세요.");
    advice.specific.push("서로의 전문성을 인정하고 배우려는 자세를 가지세요.");
  } else if (relationshipType === 'business') {
    advice.specific.push("명확한 계약과 약속을 통해 신뢰를 쌓으세요.");
    advice.specific.push("정기적인 비즈니스 미팅을 통해 소통하세요.");
    advice.specific.push("서로의 비즈니스 목표를 공유하고 협력하세요.");
  }
  
  return advice;
}

// 연령대 분류 유틸
function getAgeFromYmd(y, m, d) {
  try {
    const yy = parseInt(y), mm = parseInt(m||1), dd = parseInt(d||1);
    if (!yy) return null;
    const today = new Date();
    const birth = new Date(yy, (mm-1), dd||1);
    let age = today.getFullYear() - birth.getFullYear();
    const mDiff = today.getMonth() - birth.getMonth();
    if (mDiff < 0 || (mDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  } catch { return null; }
}
function getAgeGroup(age){
  if (age===null || age===undefined) return 'adult';
  if (age < 13) return 'child';
  if (age < 18) return 'teen';
  if (age < 30) return 'young';
  if (age < 60) return 'adult';
  return 'senior';
}

// 전문가 해석 생성 함수 (연령대 반영)
function generateExpertInterpretation(baziResult, opts = {}) {
  const { pillars, elementCounts, tenGods, usefulGods, dayMaster, dayElement } = baziResult;
  
  // elementCounts가 없는 경우 기본값 설정
  const safeElementCounts = elementCounts || { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
  const age = opts.age ?? null;
  const ageGroup = opts.ageGroup || getAgeGroup(age);
  
  // Top 질문: 연령대에 맞춰 구성
  let answers = [];
  if (ageGroup === 'child') {
    answers = [
      generateStudyAnswer(safeElementCounts),
      generateHabitsAnswer(safeElementCounts),
      generateHealthAnswer(safeElementCounts, dayElement),
      generateRelationshipEtiquetteAnswer(safeElementCounts),
      generateMonthlyAnswer(safeElementCounts, usefulGods)
    ];
  } else if (ageGroup === 'teen') {
    answers = [
      generateStudyAnswer(safeElementCounts),
      generateCareerSeedAnswer(safeElementCounts),
      generateHealthAnswer(safeElementCounts, dayElement),
      generateRelationshipEtiquetteAnswer(safeElementCounts),
      generateMonthlyAnswer(safeElementCounts, usefulGods)
    ];
  } else if (ageGroup === 'senior') {
    answers = [
      generateHealthAnswer(safeElementCounts, dayElement),
      generateSocialRelationAnswer(safeElementCounts),
      generateWealthConservationAnswer(safeElementCounts),
      generateMovementAnswer(safeElementCounts, usefulGods),
      generateMonthlyAnswer(safeElementCounts, usefulGods)
    ];
  } else {
    // young/adult 기본 구성
    answers = [
      generateWealthAnswer(safeElementCounts, tenGods),
      generateCareerAnswer(safeElementCounts, tenGods),
      generateInvestmentAnswer(safeElementCounts, usefulGods),
      generateRelationshipAnswer(safeElementCounts, tenGods),
      generateHealthAnswer(safeElementCounts, dayElement),
      generateMovementAnswer(safeElementCounts, usefulGods),
      generateMonthlyAnswer(safeElementCounts, usefulGods)
    ];
  }
  
  return {
    answers,
    summary: generateAgeAwareSummary(safeElementCounts, dayElement, ageGroup),
    recommendations: generateAgeAwareRecommendations(usefulGods, safeElementCounts, ageGroup)
  };
}

// 장문 전문가 리포트 생성기 (요약과 섹션을 구조화)
function buildProReport(baziResult, user, user_kv) {
  try {
    const safe = (v)=> (v===undefined||v===null)?'':v;
    const age = getAgeFromYmd(user?.birth_year || user_kv?.birth_year, user?.birth_month || user_kv?.birth_month, user?.birth_day || user_kv?.birth_day);
    const ageGroup = getAgeGroup(age);
    const birthLine = () => {
      const y = user?.birth_year || user_kv?.birth_year || '-';
      const m = user?.birth_month || user_kv?.birth_month || '-';
      const d = user?.birth_day || user_kv?.birth_day || '-';
      const hhmm = user_kv?.birth_time || (user?.birth_hour!==undefined && user?.birth_hour!==null ? String(user.birth_hour).padStart(2,'0')+':00' : '');
      const place = user_kv?.birthplace || '';
      const cal = user_kv?.calendar_type === 'lunar' ? '음력' : '양력';
      return `${y}년 ${m}월 ${d}일 ${hhmm} ${place ? '('+place+') ' : ''}${cal}`.trim();
    };

    const p = baziResult.pillars || {};
    const elements = baziResult.elementAnalysis?.balance || baziResult.elementCounts || {};
    const strongest = getStrongestElement(elements);
    const weakest = getWeakestElement(elements);

    const sections = [];
    sections.push({
      title: 'Ⅰ. 기본 출생 정보 및 사주 개요',
      body: [
        `성명: ${safe(user?.name)}`,
        `출생정보: ${birthLine()}`,
        `사주기둥: 년(${p.year?.stem||''}${p.year?.branch||''}) 월(${p.month?.stem||''}${p.month?.branch||''}) 일(${p.day?.stem||''}${p.day?.branch||''}) 시(${p.hour?.stem||''}${p.hour?.branch||''})`,
        `오행 분포: ${Object.entries(elements).map(([k,v])=>`${k}:${v}`).join(' · ')}`,
        `강점 오행: ${strongest} / 보완 오행: ${weakest}`
      ]
    });

    sections.push({ title: 'Ⅱ. 일간과 성정(性情) 핵심', body: [
      '일간과 일지 조합을 통해 성격의 골격과 기본 리듬을 도출합니다.',
      '표현, 추진, 안정, 통찰의 네 축에서 강약과 균형을 분석합니다.'
    ]});

    sections.push({ title: 'Ⅲ. 십신(十神) 구조와 사회적 역할', body: [
      '재성/관성/식상/인성/비겁의 강약을 통해 사회적 포지션과 전략을 제안합니다.',
      '시기별로 떠오르는 십신 테마에 따라 실행 우선순위를 정리합니다.'
    ]});

    sections.push({ title: 'Ⅳ. 용신(用神)·기신 운용 가이드', body: [
      '생활 루틴과 공간·색·식·활동의 조합으로 용신 기운을 활성화합니다.',
      '기신은 노출을 제한하고, 보완 루틴으로 중화합니다.'
    ]});

    // 연령대별로 민감/부적절 항목 치환
    if (ageGroup === 'child') {
      sections.push({ title: 'Ⅴ. 성장 및 학습 포커스', body: [
        '학습: 집중/기초 체력/규칙적 루틴 강화.',
        '관계: 예절/배려/협력 습관 기르기.',
        '놀이: 호기심을 키우는 안전한 체험 설계.',
        '건강: 수면/영양/자세/눈 건강 관리.'
      ]});
    } else if (ageGroup === 'teen') {
      sections.push({ title: 'Ⅴ. 진로 탐색과 역량 기반 만들기', body: [
        '학습: 강점 과목 심화, 약점 보완 로드맵.',
        '진로: 흥미 기반 직무 탐색과 각 직무의 일상 이해.',
        '관계: 소통/갈등 조절/온라인 에티켓.',
        '건강: 성장기 수면/운동/자기관리 루틴.'
      ]});
    } else if (ageGroup === 'senior') {
      sections.push({ title: 'Ⅴ. 건강·관계·자산 보호 중심 전략', body: [
        '건강: 근력/균형/순환 중심 루틴과 정기 점검.',
        '관계: 사회적 연결 유지, 봉사/취미 커뮤니티 참여.',
        '자산: 리스크 축소, 사기 예방 체크리스트.',
        '삶의 질: 취미/여가/학습으로 심리적 안정 강화.'
      ]});
    } else {
      sections.push({ title: 'Ⅴ. 분야별 정밀 해석', body: [
        '관계/배우자: 소통 패턴, 갈등 조정법, 장기 안정 전략.',
        '커리어/사업: 적합 직군, 성장 경로, 브랜딩 포인트.',
        '재정/투자: 현금흐름 관리, 위험/분산, 장기 설계.',
        '건강/리듬: 취약 장부 보완, 운동/수면/회복 리듬 설계.'
      ]});
    }

    // 월별 상세 (12개월)
    const monthNames = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
    const monthlyDetail = monthNames.map((m)=>`${m}: 핵심 포커스, 주의 요인, 실행 권장(색·식·활동 포함).`).join('\n');
    sections.push({ title: 'Ⅵ. 월별 상세 운세(12개월)', body: [
      '각 월의 기운 변화를 생활 루틴과 연결합니다.',
      monthlyDetail
    ]});

    // 연차 전망 (향후 10년)
    const baseYear = new Date().getFullYear();
    const annualLines = Array.from({length:10}).map((_,k)=>{
      const y = baseYear + k;
      return `${y}년: 주제/기회/리스크 · 대표 키워드 · 실행 권장 3가지`;
    }).join('\n');
    sections.push({ title: 'Ⅶ. 연차 전망(향후 10년)', body: [
      '대운 변화와 세운 키워드를 매칭하여 전략을 수립합니다.',
      annualLines
    ]});

    // 십신별 실행 매뉴얼
    sections.push({ title: 'Ⅷ. 십신별 실행 매뉴얼', body: [
      '재성: 현금흐름·자원 운용 · 계약/협상 체크리스트.',
      '관성: 책임·명예·위치 구축 · 역할 명료화와 평판 관리.',
      '식상: 표현·창조·브랜딩 · 콘텐츠/발표/퍼포먼스 루틴.',
      '인성: 학습·멘토링·내적 안정 · 학습 로드맵과 정리 시스템.',
      '비겁: 동료·협업·네트워크 · 관계 자산과 시너지 설계.'
    ]});

    // 용신 생활화 캘린더(90일)
    const weekly = Array.from({length:13}).map((_,i)=>`주 ${i+1}: 용신 행동 1개 + 기신 제한 1개 + 환경 조정 1개`).join('\n');
    sections.push({ title: 'Ⅸ. 90일 용신 생활화 캘린더', body: [
      '90일 집중 구간을 통해 습관을 구조화합니다.',
      weekly
    ]});

    // 리스크 관리와 복구 플랜
    sections.push({ title: 'Ⅹ. 리스크 관리 & 복구 플랜', body: [
      '스트레스 신호/과열 신호 조기 감지 체크리스트.',
      '관계/커리어/재정/건강 영역별 응급 조치와 복구 절차.'
    ]});

    // 타이밍과 실행(넘버링 재정렬)
    sections.push({ title: 'Ⅺ. 타이밍(대운/세운)과 실행', body: [
      '대운의 주제 변화를 캘린더로 시각화하여 전환점을 포착합니다.',
      '익년·금년 핵심 키워드와 월별 포커스를 실행 항목으로 연결합니다.'
    ]});

    sections.push({ title: 'Ⅻ. 행동 체크리스트(90일 플랜)', body: [
      '주간·월간 루틴, 환경 조정, 관계/커리어/재정 실천 항목을 체크리스트로 제공합니다.'
    ]});

    // 연령대 민감도 필터 적용
    const sectionsFinal = sanitizeSectionsForAgeGroup(sections, ageGroup);

    return {
      meta: {
        name: safe(user?.name),
        birth: birthLine(),
        generatedAt: new Date().toISOString()
      },
      summary: `${safe(user?.name)}님의 핵심 키워드: 강점(${strongest}), 보완(${weakest}). (${ageGroup==='child'?'성장 루틴':ageGroup==='teen'?'진로 탐색':ageGroup==='senior'?'건강·관계·자산 보호':'용신 활성'})와 타이밍 정렬이 관건입니다.`,
      sections: sectionsFinal
    };
  } catch (e) {
    return { meta: {}, summary: '리포트 생성 중 오류', sections: [] };
  }
}

// ===== 연령대 보조 생성기 =====
function generateAgeAwareSummary(elementCounts, dayElement, ageGroup){
  const base = generateSummary(elementCounts, dayElement);
  const tails = {
    child: ' 어린이에게는 학습 습관과 기본 건강 루틴이 최우선입니다.',
    teen: ' 청소년에게는 진로 탐색과 성숙한 관계 습관이 중요합니다.',
    young: ' 청년에게는 커리어 성장과 자산 형성의 기초를 다질 시기입니다.',
    adult: ' 성인에게는 균형 잡힌 커리어·관계·재정의 정렬이 필요합니다.',
    senior: ' 시니어에게는 건강 관리와 사회적 연결, 자산 보호가 핵심입니다.'
  };
  return { ...base, note: (base.note||'') + (tails[ageGroup]||'') };
}
function generateAgeAwareRecommendations(usefulGods, elementCounts, ageGroup){
  const base = generateRecommendations(usefulGods, elementCounts);
  if (ageGroup==='child') base.push({ element:'학습', items:['취침 일정 고정','아침 루틴 간소화','주 3회 가벼운 운동']});
  if (ageGroup==='teen') base.push({ element:'진로', items:['관심 직무 3개 인터뷰','프로젝트형 학습','디지털 에티켓']});
  if (ageGroup==='senior') base.push({ element:'건강', items:['균형 운동','정기 검진','보이스 피싱 예방 체크']});
  return base;
}
function generateStudyAnswer(elementCounts){
  return { topic:'학습/성장', one_liner:'집중과 꾸준함을 키울 시기입니다.', why:'오행 균형에서 안정 루틴의 중요성', todo:['취침/기상 고정','과목별 25분 몰입 5회','주간 복습일 지정'] };
}
function generateHabitsAnswer(){
  return { topic:'생활 루틴', one_liner:'리듬을 일정하게 유지하면 성장이 빨라집니다.', why:'규칙성은 기운의 흐름을 안정화', todo:['식사/수면/운동 시간표','화면 시간 제한','독서 20분'] };
}
function generateRelationshipEtiquetteAnswer(){
  return { topic:'관계/예절', one_liner:'배려와 규칙을 지키면 관계가 좋아집니다.', why:'소통의 기운을 맑게 함', todo:['경청 연습','온라인 에티켓','감정 일기'] };
}
function generateCareerSeedAnswer(){
  return { topic:'진로 씨앗', one_liner:'흥미와 강점을 탐색하며 작은 실험을 하세요.', why:'식상·재성 균형을 높이는 경험', todo:['관심 직무 3개 체험','멘토 대화','작은 포트폴리오'] };
}
function generateSocialRelationAnswer(){
  return { topic:'사회적 관계', one_liner:'규칙적 모임과 취미가 삶의 활력을 줍니다.', why:'비겁·인성의 균형 유지', todo:['주 1회 모임','취미 동아리','봉사 참여'] };
}
function generateWealthConservationAnswer(){
  return { topic:'자산 보호', one_liner:'리스크를 줄이고 보존 중심으로 운용하세요.', why:'과열 회피로 안정성 극대화', todo:['고위험 피하기','사기 예방 체크','상속/증여 점검'] };
}

// 연령대 민감 주제/문체 필터
function sanitizeSectionsForAgeGroup(sections, ageGroup){
  try{
    const filtered = [];
    for (const sec of sections){
      const title = String(sec.title||'');
      let body = Array.isArray(sec.body)? [...sec.body] : [];

      if (ageGroup==='child'){
        // 제외/치환: 투자/재정/배우자/성적 뉘앙스 → 학습/놀이/예절/건강으로
        if (/재정|투자|배우자|결혼|연애/i.test(title)) continue;
        body = body.filter(line => !/재정|투자|배우자|연애|관계 성숙/i.test(line));
        body = body.map(line => line
          .replace(/커리어|사업|브랜딩/gi,'꿈과 진로 탐색')
          .replace(/재정|투자/gi,'저축 습관과 물건 아끼기')
          .replace(/배우자|연애/gi,'친구와 가족 예절')
        );
      }

      if (ageGroup==='teen'){
        // 제외: 직접적인 투자/결혼 권고. 치환: 커리어→진로 탐색/포트폴리오
        body = body.filter(line => !/결혼 준비|고위험 투자|대출/i.test(line));
        body = body.map(line => line
          .replace(/커리어|사업/gi,'진로 탐색과 역량 만들기')
          .replace(/투자/gi,'금융 기초 학습과 모의 투자')
        );
      }

      if (ageGroup==='senior'){
        // 포커스: 건강/관계/자산 보호. 치환: 과도한 성장/확장 → 리스크 축소/보존
        body = body.map(line => line
          .replace(/공격적 성장|확장/gi,'리스크 축소와 안정')
          .replace(/과도한 야근|무리/gi,'무리 없는 활동과 회복')
        );
      }

      filtered.push({ title, body });
    }
    return filtered;
  } catch { return sections; }
}

// 재물운 답변
function generateWealthAnswer(elementCounts, tenGods) {
  // elementCounts가 undefined인 경우 기본값 설정
  if (!elementCounts || typeof elementCounts !== 'object') {
    elementCounts = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
  }
  
  const wealth = elementCounts['금'] || 0;
  const water = elementCounts['수'] || 0;
  
  let oneLiner = '';
  let why = '';
  let todo = [];
  
  if (wealth > 2) {
    oneLiner = '재물운이 강한 시기입니다. 수익 창출에 집중하세요.';
    why = '금(재성) 과다로 인한 수익 기회 증가';
    todo = ['신규 수익원 개발', '투자 확대 검토', '재정 계획 수립'];
  } else if (water > 2) {
    oneLiner = '현금 흐름에 주의가 필요합니다. 지출 통제가 중요합니다.';
    why = '수(관성) 과다로 인한 지출 증가 우려';
    todo = ['불필요한 지출 감소', '현금 비중 확대', '비상금 확보'];
  } else {
    oneLiner = '안정적인 재정 관리가 필요한 시기입니다.';
    why = '오행 균형 상태로 안정적 재정 관리 권장';
    todo = ['정기적인 수입 관리', '적절한 저축', '리스크 분산'];
  }
  
  return {
    topic: '재물운',
    one_liner: oneLiner,
    why: why,
    todo: todo
  };
}

// 직업/사업 답변
function generateCareerAnswer(elementCounts, tenGods) {
  // elementCounts가 undefined인 경우 기본값 설정
  if (!elementCounts || typeof elementCounts !== 'object') {
    elementCounts = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
  }
  
  const fire = elementCounts['화'] || 0;
  const earth = elementCounts['토'] || 0;
  
  let oneLiner = '';
  let why = '';
  let todo = [];
  
  if (fire > 2) {
    oneLiner = '창의적이고 혁신적인 업무에 집중하세요.';
    why = '화(식상) 과다로 인한 창의성과 혁신 기회 증가';
    todo = ['새로운 프로젝트 제안', '기술 개발 투자', '팀워크 강화'];
  } else if (earth > 2) {
    oneLiner = '안정적이고 체계적인 업무가 유리합니다.';
    why = '토(비겁) 과다로 인한 안정성과 체계성 강화';
    todo = ['업무 프로세스 정리', '기존 관계 유지', '단계적 성장'];
  } else {
    oneLiner = '균형 잡힌 업무 접근이 필요한 시기입니다.';
    why = '오행 균형 상태로 다양한 업무 영역 개발 가능';
    todo = ['다양한 업무 경험', '지속적 학습', '네트워킹 확대'];
  }
  
  return {
    topic: '직업/사업',
    one_liner: oneLiner,
    why: why,
    todo: todo
  };
}

// 향후 10년 대운 분석 생성
function generateFutureLuckAnalysis(birthYear, birthMonth, birthDay, birthHour, age) {
  console.log('🔮 generateFutureLuckAnalysis 호출됨:', { birthYear, birthMonth, birthDay, birthHour, age });
  
  const currentYear = new Date().getFullYear();
  const currentAge = age || (currentYear - birthYear);
  
  console.log('🔮 계산된 값:', { currentYear, currentAge });
  
  // 대운 시작 나이 계산 (일반적으로 1-10세 사이)
  const luckStartAge = 1 + (birthMonth - 1) % 10;
  
  // 현재 대운 단계 계산
  const currentLuckStage = Math.floor((currentAge - luckStartAge) / 10);
  const nextLuckStage = currentLuckStage + 1;
  
  // 대운 간지 계산 (생년월일시 기준)
  const luckStems = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
  const luckBranches = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
  
  // 생년월일시에서 시작 간지 결정
  const yearStemIndex = (birthYear - 4) % 10;
  const yearBranchIndex = (birthYear - 4) % 12;
  
  // 현재 대운 간지
  const currentLuckStemIndex = (yearStemIndex + currentLuckStage) % 10;
  const currentLuckBranchIndex = (yearBranchIndex + currentLuckStage) % 12;
  const currentLuckStem = luckStems[currentLuckStemIndex];
  const currentLuckBranch = luckBranches[currentLuckBranchIndex];
  
  // 다음 대운 간지
  const nextLuckStemIndex = (yearStemIndex + nextLuckStage) % 10;
  const nextLuckBranchIndex = (yearBranchIndex + nextLuckStage) % 12;
  const nextLuckStem = luckStems[nextLuckStemIndex];
  const nextLuckBranch = luckBranches[nextLuckBranchIndex];
  
  // 대운별 특성 정의
  const luckCharacteristics = {
    '갑자': { element: '목', theme: '성장과 새로운 시작', focus: '학습과 기반 다지기' },
    '갑축': { element: '목', theme: '안정적 성장', focus: '기초 확립' },
    '갑인': { element: '목', theme: '활발한 성장', focus: '새로운 도전' },
    '갑묘': { element: '목', theme: '창의적 발전', focus: '예술과 창작' },
    '갑진': { element: '목', theme: '체계적 성장', focus: '조직과 관리' },
    '갑사': { element: '목', theme: '지혜로운 성장', focus: '학문과 연구' },
    '갑오': { element: '목', theme: '명예로운 성장', focus: '리더십과 명예' },
    '갑미': { element: '목', theme: '완성도 높은 성장', focus: '완성과 정리' },
    '갑신': { element: '목', theme: '혁신적 성장', focus: '기술과 혁신' },
    '갑유': { element: '목', theme: '예술적 성장', focus: '미학과 감성' },
    '갑술': { element: '목', theme: '실용적 성장', focus: '실무와 적용' },
    '갑해': { element: '목', theme: '지혜로운 성장', focus: '철학과 깊이' },
    
    '을자': { element: '목', theme: '부드러운 성장', focus: '협력과 조화' },
    '을축': { element: '목', theme: '안정적 발전', focus: '기반 강화' },
    '을인': { element: '목', theme: '창의적 발전', focus: '예술과 감성' },
    '을묘': { element: '목', theme: '예술적 성장', focus: '창작과 표현' },
    '을진': { element: '목', theme: '조직적 발전', focus: '팀워크와 협력' },
    '을사': { element: '목', theme: '학문적 발전', focus: '연구와 탐구' },
    '을오': { element: '목', theme: '예술적 명예', focus: '창작과 인정' },
    '을미': { element: '목', theme: '완성과 정리', focus: '마무리와 정리' },
    '을신': { element: '목', theme: '혁신적 발전', focus: '새로운 기술' },
    '을유': { element: '목', theme: '예술적 완성', focus: '미적 완성' },
    '을술': { element: '목', theme: '실용적 발전', focus: '실무 능력' },
    '을해': { element: '목', theme: '지혜로운 발전', focus: '깊이 있는 사고' },
    
    '병자': { element: '화', theme: '열정과 활력', focus: '에너지와 도전' },
    '병축': { element: '화', theme: '안정적 열정', focus: '꾸준한 발전' },
    '병인': { element: '화', theme: '활발한 열정', focus: '새로운 도전' },
    '병묘': { element: '화', theme: '창의적 열정', focus: '혁신과 창작' },
    '병진': { element: '화', theme: '조직적 열정', focus: '리더십과 관리' },
    '병사': { element: '화', theme: '지혜로운 열정', focus: '학문과 연구' },
    '병오': { element: '화', theme: '명예로운 열정', focus: '성공과 인정' },
    '병미': { element: '화', theme: '완성된 열정', focus: '성취와 완성' },
    '병신': { element: '화', theme: '혁신적 열정', focus: '기술과 혁신' },
    '병유': { element: '화', theme: '예술적 열정', focus: '창작과 표현' },
    '병술': { element: '화', theme: '실용적 열정', focus: '실무와 성과' },
    '병해': { element: '화', theme: '지혜로운 열정', focus: '깊이 있는 열정' },
    
    '정자': { element: '화', theme: '부드러운 열정', focus: '협력과 조화' },
    '정축': { element: '화', theme: '안정적 열정', focus: '꾸준한 발전' },
    '정인': { element: '화', theme: '창의적 열정', focus: '예술과 감성' },
    '정묘': { element: '화', theme: '예술적 열정', focus: '창작과 미학' },
    '정진': { element: '화', theme: '조직적 열정', focus: '팀워크와 관리' },
    '정사': { element: '화', theme: '학문적 열정', focus: '연구와 탐구' },
    '정오': { element: '화', theme: '예술적 명예', focus: '창작과 인정' },
    '정미': { element: '화', theme: '완성과 정리', focus: '마무리와 정리' },
    '정신': { element: '화', theme: '혁신적 열정', focus: '새로운 기술' },
    '정유': { element: '화', theme: '예술적 완성', focus: '미적 완성' },
    '정술': { element: '화', theme: '실용적 열정', focus: '실무 능력' },
    '정해': { element: '화', theme: '지혜로운 열정', focus: '깊이 있는 열정' },
    
    '무자': { element: '토', theme: '안정과 신뢰', focus: '기반 다지기' },
    '무축': { element: '토', theme: '강한 안정', focus: '기반 강화' },
    '무인': { element: '토', theme: '활발한 안정', focus: '새로운 기반' },
    '무묘': { element: '토', theme: '창의적 안정', focus: '혁신적 기반' },
    '무진': { element: '토', theme: '조직적 안정', focus: '체계적 관리' },
    '무사': { element: '토', theme: '지혜로운 안정', focus: '학문적 기반' },
    '무오': { element: '토', theme: '명예로운 안정', focus: '사회적 기반' },
    '무미': { element: '토', theme: '완성된 안정', focus: '완성과 정리' },
    '무신': { element: '토', theme: '혁신적 안정', focus: '새로운 기반' },
    '무유': { element: '토', theme: '예술적 안정', focus: '미적 기반' },
    '무술': { element: '토', theme: '실용적 안정', focus: '실무 기반' },
    '무해': { element: '토', theme: '지혜로운 안정', focus: '철학적 기반' },
    
    '기자': { element: '토', theme: '부드러운 안정', focus: '협력적 기반' },
    '기축': { element: '토', theme: '강한 안정', focus: '기반 확립' },
    '기인': { element: '토', theme: '창의적 안정', focus: '예술적 기반' },
    '기묘': { element: '토', theme: '예술적 안정', focus: '창작적 기반' },
    '기진': { element: '토', theme: '조직적 안정', focus: '팀워크 기반' },
    '기사': { element: '토', theme: '학문적 안정', focus: '연구적 기반' },
    '기오': { element: '토', theme: '예술적 명예', focus: '창작적 명예' },
    '기미': { element: '토', theme: '완성과 정리', focus: '마무리와 정리' },
    '기신': { element: '토', theme: '혁신적 안정', focus: '새로운 기반' },
    '기유': { element: '토', theme: '예술적 완성', focus: '미적 완성' },
    '기술': { element: '토', theme: '실용적 안정', focus: '실무 기반' },
    '기해': { element: '토', theme: '지혜로운 안정', focus: '철학적 기반' },
    
    '경자': { element: '금', theme: '정의와 완벽', focus: '원칙과 질서' },
    '경축': { element: '금', theme: '강한 정의', focus: '원칙 확립' },
    '경인': { element: '금', theme: '활발한 정의', focus: '새로운 원칙' },
    '경묘': { element: '금', theme: '창의적 정의', focus: '혁신적 원칙' },
    '경진': { element: '금', theme: '조직적 정의', focus: '체계적 관리' },
    '경사': { element: '금', theme: '지혜로운 정의', focus: '학문적 원칙' },
    '경오': { element: '금', theme: '명예로운 정의', focus: '사회적 원칙' },
    '경미': { element: '금', theme: '완성된 정의', focus: '완성과 정리' },
    '경신': { element: '금', theme: '혁신적 정의', focus: '새로운 원칙' },
    '경유': { element: '금', theme: '예술적 정의', focus: '미적 원칙' },
    '경술': { element: '금', theme: '실용적 정의', focus: '실무 원칙' },
    '경해': { element: '금', theme: '지혜로운 정의', focus: '철학적 원칙' },
    
    '신자': { element: '금', theme: '부드러운 정의', focus: '협력적 원칙' },
    '신축': { element: '금', theme: '강한 정의', focus: '원칙 강화' },
    '신인': { element: '금', theme: '창의적 정의', focus: '예술적 원칙' },
    '신묘': { element: '금', theme: '예술적 정의', focus: '창작적 원칙' },
    '신진': { element: '금', theme: '조직적 정의', focus: '팀워크 원칙' },
    '신사': { element: '금', theme: '학문적 정의', focus: '연구적 원칙' },
    '신오': { element: '금', theme: '예술적 명예', focus: '창작적 명예' },
    '신미': { element: '금', theme: '완성과 정리', focus: '마무리와 정리' },
    '신신': { element: '금', theme: '혁신적 정의', focus: '새로운 원칙' },
    '신유': { element: '금', theme: '예술적 완성', focus: '미적 완성' },
    '신술': { element: '금', theme: '실용적 정의', focus: '실무 원칙' },
    '신해': { element: '금', theme: '지혜로운 정의', focus: '철학적 원칙' },
    
    '임자': { element: '수', theme: '지혜와 직관', focus: '깊이 있는 사고' },
    '임축': { element: '수', theme: '안정적 지혜', focus: '기반 지식' },
    '임인': { element: '수', theme: '활발한 지혜', focus: '새로운 지식' },
    '임묘': { element: '수', theme: '창의적 지혜', focus: '혁신적 사고' },
    '임진': { element: '수', theme: '조직적 지혜', focus: '체계적 지식' },
    '임사': { element: '수', theme: '깊은 지혜', focus: '학문적 탐구' },
    '임오': { element: '수', theme: '명예로운 지혜', focus: '사회적 지식' },
    '임미': { element: '수', theme: '완성된 지혜', focus: '완성과 정리' },
    '임신': { element: '수', theme: '혁신적 지혜', focus: '새로운 지식' },
    '임유': { element: '수', theme: '예술적 지혜', focus: '미적 지식' },
    '임술': { element: '수', theme: '실용적 지혜', focus: '실무 지식' },
    '임해': { element: '수', theme: '깊은 지혜', focus: '철학적 지식' },
    
    '계자': { element: '수', theme: '부드러운 지혜', focus: '협력적 지식' },
    '계축': { element: '수', theme: '안정적 지혜', focus: '기반 지식' },
    '계인': { element: '수', theme: '창의적 지혜', focus: '예술적 지식' },
    '계묘': { element: '수', theme: '예술적 지혜', focus: '창작적 지식' },
    '계진': { element: '수', theme: '조직적 지혜', focus: '팀워크 지식' },
    '계사': { element: '수', theme: '학문적 지혜', focus: '연구적 지식' },
    '계오': { element: '수', theme: '예술적 명예', focus: '창작적 명예' },
    '계미': { element: '수', theme: '완성과 정리', focus: '마무리와 정리' },
    '계신': { element: '수', theme: '혁신적 지혜', focus: '새로운 지식' },
    '계유': { element: '수', theme: '예술적 완성', focus: '미적 완성' },
    '계술': { element: '수', theme: '실용적 지혜', focus: '실무 지식' },
    '계해': { element: '수', theme: '깊은 지혜', focus: '철학적 지식' }
  };
  
  // 현재 대운 정보
  const currentLuckKey = currentLuckStem + currentLuckBranch;
  const currentLuckInfo = luckCharacteristics[currentLuckKey] || {
    element: '기본',
    theme: '안정과 발전',
    focus: '균형잡힌 성장'
  };
  
  // 다음 대운 정보
  const nextLuckKey = nextLuckStem + nextLuckBranch;
  const nextLuckInfo = luckCharacteristics[nextLuckKey] || {
    element: '기본',
    theme: '새로운 변화',
    focus: '적응과 발전'
  };
  
  // 대운 전환 시기 계산
  const currentLuckStartAge = luckStartAge + currentLuckStage * 10;
  const currentLuckEndAge = currentLuckStartAge + 9;
  const nextLuckStartAge = currentLuckEndAge + 1;
  const nextLuckEndAge = nextLuckStartAge + 9;
  
  // 구체적인 대운 해석 생성
  const getDetailedLuckAnalysis = (luckInfo, isCurrent = true) => {
    const elementDetails = {
      '목': {
        career: '교육, 출판, 환경, 의료, 법률 분야',
        health: '간, 담낭, 눈 건강 관리',
        relationship: '창의적이고 성장지향적인 사람들과의 만남',
        finance: '지속적인 투자와 성장 투자',
        study: '새로운 기술과 지식 습득',
        travel: '자연과 문화가 풍부한 곳',
        color: '녹색, 파란색',
        direction: '동쪽, 남쪽'
      },
      '화': {
        career: 'IT, 엔터테인먼트, 요리, 스포츠, 마케팅 분야',
        health: '심장, 소장, 혈액 순환 관리',
        relationship: '열정적이고 활발한 사람들과의 만남',
        finance: '혁신적이고 도전적인 투자',
        study: '창의적이고 실용적인 기술',
        travel: '활기찬 도시와 문화 중심지',
        color: '빨간색, 주황색',
        direction: '남쪽'
      },
      '토': {
        career: '부동산, 건설, 농업, 요식업, 공무원 분야',
        health: '비장, 위장, 근육 관리',
        relationship: '안정적이고 신뢰할 수 있는 사람들과의 만남',
        finance: '안정적이고 보수적인 투자',
        study: '실무적이고 체계적인 지식',
        travel: '평화롭고 안정적인 곳',
        color: '노란색, 갈색',
        direction: '중앙, 남서쪽'
      },
      '금': {
        career: '금융, 보석, 기계, 경찰, 군인 분야',
        health: '폐, 대장, 피부 관리',
        relationship: '정의감 있고 원칙적인 사람들과의 만남',
        finance: '체계적이고 안전한 투자',
        study: '정확하고 논리적인 지식',
        travel: '깔끔하고 질서 있는 곳',
        color: '흰색, 은색',
        direction: '서쪽'
      },
      '수': {
        career: '해운, 관광, 통신, 연구, 예술 분야',
        health: '신장, 방광, 귀 관리',
        relationship: '지혜롭고 깊이 있는 사람들과의 만남',
        finance: '유연하고 창의적인 투자',
        study: '깊이 있고 철학적인 지식',
        travel: '물과 관련된 곳, 해외',
        color: '검은색, 파란색',
        direction: '북쪽'
      }
    };

    const details = elementDetails[luckInfo.element] || elementDetails['토'];
    const status = isCurrent ? '현재 진행 중' : '다음 대운';
    
    return {
      name: `${luckInfo.element} 기운의 ${luckInfo.theme} 시기`,
      period: `${currentLuckStartAge}세 ~ ${currentLuckEndAge}세`,
      element: luckInfo.element,
      theme: luckInfo.theme,
      focus: luckInfo.focus,
      characteristics: `${luckInfo.element} 기운이 강한 ${status}로, ${luckInfo.theme}에 집중할 수 있습니다. 이 시기에는 ${luckInfo.element}의 특성을 살린 활동이 유리합니다.`,
      advice: `${luckInfo.focus}에 중점을 두고, ${details.career} 분야에서 기회를 찾아보세요. ${details.color} 계열의 색상과 ${details.direction} 방향이 길합니다.`,
      opportunities: `${details.career} 분야에서 성공할 수 있는 기회가 많습니다. ${details.study}에 투자하고, ${details.travel}을 통해 새로운 경험을 쌓는 것이 좋습니다.`,
      challenges: `${luckInfo.element} 기운이 부족한 분야에서는 어려움을 겪을 수 있습니다. ${details.health} 관리에 주의하고, 균형잡힌 접근이 필요합니다.`,
      details: {
        career: details.career,
        health: details.health,
        relationship: details.relationship,
        finance: details.finance,
        study: details.study,
        travel: details.travel,
        color: details.color,
        direction: details.direction
      }
    };
  };

  return {
    currentLuck: getDetailedLuckAnalysis(currentLuckInfo, true),
    nextLuck: getDetailedLuckAnalysis(nextLuckInfo, false),
    transition: {
      age: nextLuckStartAge,
      year: currentYear + (nextLuckStartAge - currentAge),
      advice: `${nextLuckInfo.element} 기운에 맞춰 준비하고, ${nextLuckInfo.focus}에 집중하세요.`,
      preparation: `${nextLuckInfo.element} 관련 분야의 지식과 경험을 쌓는 것이 중요합니다.`,
      warning: `대운 전환기에는 변화에 따른 스트레스가 있을 수 있으니 마음의 준비를 하세요.`,
      timing: `전환 시기 전후 1-2년은 점진적으로 변화에 적응하는 기간으로 활용하세요.`
    }
  };
}

// 투자 타이밍 답변
function generateInvestmentAnswer(elementCounts, usefulGods) {
  const wood = elementCounts['목'] || 0;
  const metal = elementCounts['금'] || 0;
  
  let oneLiner = '';
  let why = '';
  let todo = [];
  
  if (wood > 2) {
    oneLiner = '성장 투자에 유리한 시기입니다. 장기적 관점이 중요합니다.';
    why = '목(식신) 과다로 인한 성장 기회 증가';
    todo = ['성장주 투자 검토', '부동산 투자 고려', '교육 투자'];
  } else if (metal > 2) {
    oneLiner = '안정적 투자가 유리합니다. 단기 수익보다 안정성에 집중하세요.';
    why = '금(재성) 과다로 인한 안정적 수익 기회';
    todo = ['채권 투자', '배당주 투자', '분산 투자'];
  } else {
    oneLiner = '신중한 투자 결정이 필요한 시기입니다.';
    why = '오행 균형 상태로 신중한 투자 접근 권장';
    todo = ['투자 교육', '리스크 분석', '소액 투자 시작'];
  }
  
  return {
    topic: '투자 타이밍',
    one_liner: oneLiner,
    why: why,
    todo: todo
  };
}

// 관계/배우자운 답변
function generateRelationshipAnswer(elementCounts, tenGods) {
  const water = elementCounts['수'] || 0;
  const fire = elementCounts['화'] || 0;
  
  let oneLiner = '';
  let why = '';
  let todo = [];
  
  if (water > 2) {
    oneLiner = '감정적 교류가 활발한 시기입니다. 소통에 집중하세요.';
    why = '수(관성) 과다로 인한 감정적 교류 증가';
    todo = ['대화 시간 확대', '감정 표현 연습', '상대방 이해'];
  } else if (fire > 2) {
    oneLiner = '열정적이고 적극적인 관계 접근이 유리합니다.';
    why = '화(식상) 과다로 인한 열정과 적극성 증가';
    todo = ['적극적 소통', '새로운 활동 공유', '관계 발전'];
  } else {
    oneLiner = '안정적이고 균형 잡힌 관계가 중요한 시기입니다.';
    why = '오행 균형 상태로 안정적 관계 유지 권장';
    todo = ['신뢰 관계 구축', '상호 이해', '지속적 소통'];
  }
  
  return {
    topic: '관계/배우자운',
    one_liner: oneLiner,
    why: why,
    todo: todo
  };
}

// 건강 답변
function generateHealthAnswer(elementCounts, dayElement) {
  const weakElement = getWeakestElement(elementCounts);
  
  let oneLiner = '';
  let why = '';
  let todo = [];
  
  switch (weakElement) {
    case '목':
      oneLiner = '간과 담낭 건강에 주의가 필요합니다.';
      why = '목(간/담낭) 기운 부족';
      todo = ['녹차 섭취', '간 건강 식품', '규칙적 운동'];
      break;
    case '화':
      oneLiner = '심장과 소장 건강에 주의가 필요합니다.';
      why = '화(심장/소장) 기운 부족';
      todo = ['심장 건강 식품', '스트레스 관리', '적절한 휴식'];
      break;
    case '토':
      oneLiner = '위장과 비장 건강에 주의가 필요합니다.';
      why = '토(위장/비장) 기운 부족';
      todo = ['소화 촉진 식품', '규칙적 식사', '스트레스 감소'];
      break;
    case '금':
      oneLiner = '폐와 대장 건강에 주의가 필요합니다.';
      why = '금(폐/대장) 기운 부족';
      todo = ['호흡 운동', '폐 건강 식품', '깨끗한 공기'];
      break;
    case '수':
      oneLiner = '신장과 방광 건강에 주의가 필요합니다.';
      why = '수(신장/방광) 기운 부족';
      todo = ['수분 섭취', '신장 건강 식품', '적절한 휴식'];
      break;
    default:
      oneLiner = '전반적인 건강 관리가 중요한 시기입니다.';
      why = '오행 균형 상태';
      todo = ['규칙적 운동', '균형 잡힌 식사', '충분한 휴식'];
  }
  
  return {
    topic: '건강',
    one_liner: oneLiner,
    why: why,
    todo: todo
  };
}

// 이사/이동 답변
function generateMovementAnswer(elementCounts, usefulGods) {
  const wood = elementCounts['목'] || 0;
  const metal = elementCounts['금'] || 0;
  
  let oneLiner = '';
  let why = '';
  let todo = [];
  
  if (wood > 2) {
    oneLiner = '동쪽이나 남쪽 방향의 이동이 유리합니다.';
    why = '목(동쪽/남쪽) 기운 강화';
    todo = ['동쪽 지역 탐색', '남쪽 지역 고려', '이동 계획 수립'];
  } else if (metal > 2) {
    oneLiner = '서쪽이나 북쪽 방향의 이동이 유리합니다.';
    why = '금(서쪽/북쪽) 기운 강화';
    todo = ['서쪽 지역 탐색', '북쪽 지역 고려', '안정적 이동'];
  } else {
    oneLiner = '신중한 이동 결정이 필요한 시기입니다.';
    why = '오행 균형 상태';
    todo = ['이동 목적 명확화', '충분한 조사', '단계적 접근'];
  }
  
  return {
    topic: '이사/이동',
    one_liner: oneLiner,
    why: why,
    todo: todo
  };
}

// 월별 운세 답변
function generateMonthlyAnswer(elementCounts, usefulGods) {
  const currentMonth = new Date().getMonth() + 1;
  const season = getSeason(currentMonth);
  
  let oneLiner = '';
  let why = '';
  let todo = [];
  
  switch (season) {
    case 'spring':
      oneLiner = '봄철 목(木) 기운으로 새로운 시작에 집중하세요.';
      why = '봄철 목(木) 기운 강화';
      todo = ['새로운 계획 수립', '성장 투자', '활동적 생활'];
      break;
    case 'summer':
      oneLiner = '여름철 화(火) 기운으로 열정과 변화에 집중하세요.';
      why = '여름철 화(火) 기운 강화';
      todo = ['새로운 활동', '변화 추구', '사회적 교류'];
      break;
    case 'autumn':
      oneLiner = '가을철 금(金) 기운으로 정리와 수확에 집중하세요.';
      why = '가을철 금(金) 기운 강화';
      todo = ['업무 정리', '결과 수확', '안정적 관리'];
      break;
    case 'winter':
      oneLiner = '겨울철 수(水) 기운으로 지혜와 계획에 집중하세요.';
      why = '겨울철 수(水) 기운 강화';
      todo = ['지혜 축적', '내년 계획', '휴식과 재충전'];
      break;
  }
  
  return {
    topic: '이번 달 운세',
    one_liner: oneLiner,
    why: why,
    todo: todo
  };
}

// 헬퍼 함수들
function getWeakestElement(elementCounts) {
  const elements = ['목', '화', '토', '금', '수'];
  let weakest = elements[0];
  let minCount = elementCounts[weakest] || 0;
  
  elements.forEach(element => {
    const count = elementCounts[element] || 0;
    if (count < minCount) {
      minCount = count;
      weakest = element;
    }
  });
  
  return weakest;
}

function getSeason(month) {
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

function generateSummary(elementCounts, dayElement) {
  const strongest = getStrongestElement(elementCounts);
  const weakest = getWeakestElement(elementCounts);
  
  return {
    day_master: dayElement,
    strongest_element: strongest,
    weakest_element: weakest,
    balance_score: calculateBalanceScore(elementCounts)
  };
}

function getStrongestElement(elementCounts) {
  const elements = ['목', '화', '토', '금', '수'];
  let strongest = elements[0];
  let maxCount = elementCounts[strongest] || 0;
  
  elements.forEach(element => {
    const count = elementCounts[element] || 0;
    if (count > maxCount) {
      maxCount = count;
      strongest = element;
    }
  });
  
  return strongest;
}

function calculateBalanceScore(elementCounts) {
  const elements = ['목', '화', '토', '금', '수'];
  const counts = elements.map(e => elementCounts[e] || 0);
  const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
  const variance = counts.reduce((sum, count) => sum + Math.pow(count - avg, 2), 0) / counts.length;
  return Math.max(0, 100 - Math.sqrt(variance) * 20);
}

function generateRecommendations(usefulGods, elementCounts) {
  const recommendations = [];
  
  usefulGods.forEach(element => {
    switch (element) {
      case '목':
        recommendations.push({
          element: '목',
          activities: ['녹색 옷 착용', '동쪽 방향 활동', '나무와 관련된 취미'],
          foods: ['녹차', '브로콜리', '시금치'],
          colors: ['녹색', '청록색']
        });
        break;
      case '화':
        recommendations.push({
          element: '화',
          activities: ['운동', '사회적 활동', '창의적 작업'],
          foods: ['고추', '토마토', '붉은 과일'],
          colors: ['빨간색', '주황색']
        });
        break;
      case '토':
        recommendations.push({
          element: '토',
          activities: ['정원 가꾸기', '요리', '안정적 활동'],
          foods: ['감자', '당근', '노란색 채소'],
          colors: ['노란색', '갈색']
        });
        break;
      case '금':
        recommendations.push({
          element: '금',
          activities: ['정리 정돈', '금속 관련 취미', '체계적 활동'],
          foods: ['무', '배', '흰색 채소'],
          colors: ['흰색', '은색']
        });
        break;
      case '수':
        recommendations.push({
          element: '수',
          activities: ['수영', '명상', '지적 활동'],
          foods: ['해산물', '검은 콩', '검은색 식품'],
          colors: ['검은색', '파란색']
        });
        break;
    }
  });
  
  return recommendations;
}

// 상세 관계 분석 API
app.post('/api/relationship/detailed', (req, res) => {
  try {
    const {
      myName, myBirthYear, myBirthMonth, myBirthDay, myBirthHour,
      friendName, friendBirthYear, friendBirthMonth, friendBirthDay, friendBirthHour,
      relationshipType
    } = req.body;
    
    console.log('🔗 상세 관계 분석 요청:', {
      myName, myBirthYear, myBirthMonth, myBirthDay, myBirthHour,
      friendName, friendBirthYear, friendBirthMonth, friendBirthDay, friendBirthHour,
      relationshipType
    });
    
    // 명리학적 관계 분석 로직 (간단한 예시)
    const compatibilityScore = Math.floor(Math.random() * 30) + 70; // 70-100점
    const gradeClass = compatibilityScore >= 90 ? 'excellent' : 
                      compatibilityScore >= 80 ? 'good' : 
                      compatibilityScore >= 70 ? 'fair' : 'poor';
    
    const compatibilityGrade = gradeClass === 'excellent' ? '매우 좋음' :
                              gradeClass === 'good' ? '좋음' :
                              gradeClass === 'fair' ? '보통' : '주의';
    
    const result = {
      compatibilityScore,
      compatibilityGrade,
      gradeClass,
      detailedAnalysis: `
        <p><strong>사주 팔자 조합 분석:</strong></p>
        <p>${myName}님과 ${friendName}님의 사주 팔자를 종합적으로 분석한 결과, 
        두 분의 관계는 명리학적으로 매우 흥미로운 조합을 보여줍니다.</p>
        
        <p>${myName}님의 일간(日干)과 ${friendName}님의 일간이 서로 보완적이며, 
        특히 ${relationshipType} 관계에서 중요한 역할을 할 것으로 예상됩니다.</p>
        
        <p>두 분의 오행 조합을 보면, 서로의 부족한 부분을 채워주는 관계로 발전할 가능성이 높습니다. 
        특히 소통과 이해 측면에서 상당한 시너지 효과를 기대할 수 있습니다.</p>
        
        <p><strong>십신 관계 분석:</strong></p>
        <p>${myName}님의 사주에서 나타나는 주요 십신과 ${friendName}님의 사주 십신이 
        서로 조화롭게 작용하여 관계의 발전에 긍정적인 영향을 미칠 것으로 보입니다.</p>
      `,
      elementAnalysis: `
        <p><strong>목(木)과 화(火)의 조합:</strong> 성장과 발전을 상징하는 조합으로, 
        서로를 격려하고 발전시키는 관계가 될 것입니다. 목은 화를 생하고, 화는 목을 도와주는 관계입니다.</p>
        
        <p><strong>토(土)와 금(金)의 조합:</strong> 안정과 실용성을 중시하는 조합으로, 
        현실적이고 지속 가능한 관계를 만들어갈 수 있습니다. 토는 금을 생하고, 금은 토를 강화합니다.</p>
        
        <p><strong>수(水)와 목(木)의 조합:</strong> 지혜와 성장의 조합으로, 
        서로에게 새로운 관점과 지식을 제공할 수 있습니다. 수는 목을 생하고, 목은 수의 지혜를 활용합니다.</p>
      `,
      strengths: `
        <ul>
          <li><strong>상호 보완성:</strong> 사주에서 나타나는 서로의 부족한 부분을 자연스럽게 채워주는 관계</li>
          <li><strong>성장 동반:</strong> 오행의 상생 관계를 통해 함께 발전하고 성장할 수 있는 환경 조성</li>
          <li><strong>신뢰 관계:</strong> 십신 관계를 통해 깊은 이해를 바탕으로 한 안정적인 신뢰 관계 형성</li>
          <li><strong>소통의 원활:</strong> 사주 조합을 통해 서로의 생각과 감정을 쉽게 공유할 수 있는 관계</li>
        </ul>
      `,
      considerations: `
        <ul>
          <li><strong>오행 균형 유지:</strong> 사주가 다르므로 오행의 균형을 유지하는 것이 중요합니다</li>
          <li><strong>십신 관계 이해:</strong> 서로의 십신 관계를 이해하고 존중하는 마음을 가지세요</li>
          <li><strong>개인 공간 존중:</strong> 사주에서 나타나는 개인적 특성을 존중하고 적절한 거리를 유지하세요</li>
          <li><strong>성장 기회 활용:</strong> 오행의 상생 관계를 통해 서로의 장점을 배우고 발전시킬 수 있는 기회로 활용하세요</li>
        </ul>
      `,
      futureOutlook: `
        <p><strong>단기 전망 (1-2년):</strong></p>
        <p>두 분의 사주 조합을 볼 때, 단기적으로는 매우 긍정적인 관계 발전이 예상됩니다. 
        특히 오행의 상생 관계가 활발하게 작용하여 관계가 더욱 깊어질 것으로 보입니다.</p>
        
        <p><strong>중기 전망 (3-5년):</strong></p>
        <p>함께하는 시간이 늘어날수록 서로에 대한 이해도가 높아지고, 
        십신 관계를 통해 더욱 의미 있는 관계로 발전할 가능성이 높습니다.</p>
        
        <p><strong>장기 전망 (5년 이상):</strong></p>
        <p>대운과 세운의 변화에 따라 관계도 자연스럽게 발전할 것으로 예상됩니다. 
        특히 두 분의 운세가 조화롭게 맞물려 장기적인 관계 지속이 가능할 것으로 보입니다.</p>
      `,
      practicalAdvice: `
        <ul>
          <li><strong>오행 균형 활동:</strong> 두 분의 오행에 맞는 활동을 함께 해보세요</li>
          <li><strong>정기적인 대화:</strong> 주 1-2회 정도 정기적인 대화 시간을 가지세요</li>
          <li><strong>서로의 관심사 공유:</strong> 각자의 관심사와 취미를 서로에게 공유하세요</li>
          <li><strong>함께하는 활동:</strong> 두 분이 함께 즐길 수 있는 활동을 찾아보세요</li>
          <li><strong>상호 존중:</strong> 서로의 사주 특성과 개성을 존중하는 마음을 가지세요</li>
        </ul>
      `
    };
    
    res.json({ success: true, result });
  } catch (error) {
    console.error('상세 관계 분석 오류:', error);
    res.status(500).json({ success: false, error: '관계 분석에 실패했습니다.' });
  }
});

// 공지사항 API
app.get('/api/announcements', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT a.*, u.name as author_name 
      FROM announcements a 
      JOIN users u ON a.author_id = u.id 
      WHERE a.is_active = 1 
      ORDER BY a.priority DESC, a.created_at DESC 
      LIMIT 5
    `);
    const announcements = stmt.all();
    res.json({ success: true, announcements });
  } catch (error) {
    console.error('공지사항 조회 오류:', error);
    res.status(500).json({ success: false, error: '공지사항을 불러올 수 없습니다.' });
  }
});

// 기존 공지사항 등록 API 비활성화 - 관리자용 API만 사용
// app.post('/api/announcements', (req, res) => {
//   res.status(404).json({ success: false, error: '이 API는 더 이상 사용되지 않습니다. 관리자용 API를 사용하세요.' });
// });

// 사용자용 공지사항 목록 API (활성화된 공지사항만)
app.get('/api/announcements', (req, res) => {
  try {
    const announcements = db.prepare(`
      SELECT a.*, u.name as author_name 
      FROM announcements a 
      LEFT JOIN users u ON a.author_id = u.id 
      WHERE a.is_active = 1
      ORDER BY a.priority DESC, a.created_at DESC
    `).all();
    
    res.json({ success: true, announcements });
  } catch (error) {
    console.error('사용자 공지사항 목록 오류:', error);
    res.status(500).json({ success: false, error: '공지사항 목록을 불러올 수 없습니다.' });
  }
});

// 관리자용 공지사항 등록 API
app.post('/api/admin/announcements', (req, res) => {
  console.log('📢 관리자 공지사항 등록 요청 받음:', req.body);
  
  try {
    const { title, content, priority = 0 } = req.body;
    
    console.log('공지사항 데이터:', { title, content, priority });
    
    if (!title || !content) {
      console.log('❌ 제목 또는 내용이 없음');
      return res.status(400).json({ success: false, error: '제목과 내용을 입력해주세요.' });
    }
    
    // 관리자 ID를 1로 고정 (또는 별도 관리자 테이블 사용)
    const adminId = 1;
    
    console.log('데이터베이스에 공지사항 삽입:', { title, content, adminId, priority });
    
    const stmt = db.prepare(`
      INSERT INTO announcements (title, content, author_id, priority) 
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(title, content, adminId, priority);
    
    console.log('✅ 공지사항 등록 성공, ID:', result.lastInsertRowid);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('❌ 관리자 공지사항 작성 오류:', error);
    res.status(500).json({ success: false, error: '공지사항 작성에 실패했습니다: ' + error.message });
  }
});

// 관리자용 공지사항 목록 API
app.get('/api/admin/announcements', (req, res) => {
  try {
    const announcements = db.prepare(`
      SELECT a.*, u.name as author_name 
      FROM announcements a 
      LEFT JOIN users u ON a.author_id = u.id 
      ORDER BY a.priority DESC, a.created_at DESC
    `).all();
    
    res.json({ success: true, announcements });
  } catch (error) {
    console.error('관리자 공지사항 목록 오류:', error);
    res.status(500).json({ success: false, error: '공지사항 목록을 불러올 수 없습니다.' });
  }
});

// 관리자용 공지사항 상세 조회 API
app.get('/api/admin/announcements/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const announcement = db.prepare(`
      SELECT a.*, u.name as author_name 
      FROM announcements a 
      LEFT JOIN users u ON a.author_id = u.id 
      WHERE a.id = ?
    `).get(id);
    
    if (!announcement) {
      return res.status(404).json({ success: false, error: '공지사항을 찾을 수 없습니다.' });
    }
    
    res.json({ success: true, announcement });
  } catch (error) {
    console.error('관리자 공지사항 상세 조회 오류:', error);
    res.status(500).json({ success: false, error: '공지사항을 불러올 수 없습니다.' });
  }
});

// 관리자용 공지사항 삭제 API
app.delete('/api/admin/announcements/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const stmt = db.prepare('DELETE FROM announcements WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: '공지사항을 찾을 수 없습니다.' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('관리자 공지사항 삭제 오류:', error);
    res.status(500).json({ success: false, error: '공지사항 삭제에 실패했습니다.' });
  }
});

app.put('/api/announcements/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, is_active, priority } = req.body;
    
    const stmt = db.prepare(`
      UPDATE announcements 
      SET title = ?, content = ?, is_active = ?, priority = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    const result = stmt.run(title, content, is_active, priority, id);
    
    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: '공지사항을 찾을 수 없습니다.' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('공지사항 수정 오류:', error);
    res.status(500).json({ success: false, error: '공지사항 수정에 실패했습니다.' });
  }
});

app.delete('/api/announcements/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    
    const stmt = db.prepare('DELETE FROM announcements WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: '공지사항을 찾을 수 없습니다.' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('공지사항 삭제 오류:', error);
    res.status(500).json({ success: false, error: '공지사항 삭제에 실패했습니다.' });
  }
});

// 점성술 API 라우터 등록
app.use('/api/astro', astroRouter);

// 관상학 API 라우터 등록
app.use('/api/physio', physioRouter);

// 타로 API 라우터 등록
app.use('/api/tarot', tarotRouter);

// 명리학 기반 숫자 택일 API 라우터 등록 (기존 파일 비활성화)
// app.use('/api/numfit', require('./bazi-api/src/numfit/routes').default);

// 숫자 택일 서비스 API 라우터 등록
app.use('/api/numerology', require('./src/routes/numerology'));



// 서버 시작
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Fortune Teller App 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`🌐 외부 접속: http://192.168.1.17:${PORT}`);
  console.log(`📊 데이터베이스: ./data/app.db`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? '설정됨' : '설정 필요'}`);
  console.log(`🔮 점성술 API: /api/astro/*`);
});