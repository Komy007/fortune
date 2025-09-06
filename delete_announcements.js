const sqlite3 = require('sqlite3').verbose();

// 데이터베이스 연결
const db = new sqlite3.Database('./data/app.db', (err) => {
  if (err) {
    console.error('❌ 데이터베이스 연결 실패:', err);
    process.exit(1);
  } else {
    console.log('✅ 데이터베이스 연결 성공');
  }
});

// 모든 공지사항 삭제
db.run('DELETE FROM announcements', function(err) {
  if (err) {
    console.error('❌ 공지사항 삭제 실패:', err);
  } else {
    console.log(`✅ 공지사항 ${this.changes}개 삭제 완료`);
  }
  
  // 데이터베이스 연결 종료
  db.close((err) => {
    if (err) {
      console.error('❌ 데이터베이스 연결 종료 실패:', err);
    } else {
      console.log('✅ 데이터베이스 연결 종료');
    }
    process.exit(0);
  });
});




