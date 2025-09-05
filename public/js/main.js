

// 디버깅: JavaScript 로딩 확인
console.log('🚀 main.js 로딩 시작');
console.log('🚀 main.js 로딩 시작');

// 전역 오류 핸들러 추가
window.addEventListener('error', function(event) {
  console.log('⚠️ 전역 오류 발생 (무시됨):', event.error?.message || event.message);
  // 오류를 무시하고 페이지가 계속 작동하도록 함
  return false;
});

// Promise 오류 핸들러 추가
window.addEventListener('unhandledrejection', function(event) {
  console.log('⚠️ Promise 오류 발생 (무시됨):', event.reason);
  // 오류를 무시하고 페이지가 계속 작동하도록 함
  event.preventDefault();
});

// 공지사항 데이터
const announcements = [
  {
    id: 1,
    title: "🎉 새로운 타로 점 서비스 오픈!",
    content: "신비로운 타로 카드로 운세와 조언을 받아보세요. 전문가다운 상세한 해설을 제공합니다.",
    date: "2024-12-21",
    type: "new"
  },
  {
    id: 2,
    title: "🔮 사주명리학 서비스 개선",
    content: "더 정확하고 상세한 사주 분석을 제공합니다. 인연궁합 분석 기능도 추가되었습니다.",
    date: "2024-12-20",
    type: "update"
  },
  {
    id: 3,
    title: "⭐ 점성술 서비스 업데이트",
    content: "서양 점성술 분석이 더욱 정교해졌습니다. 행성의 영향과 운세를 자세히 분석해드립니다.",
    date: "2024-12-19",
    type: "update"
  }
];

// 공지사항 표시 함수
function displayAnnouncements() {
  const announcementList = document.getElementById('announcementsList');
  if (!announcementList) return;
  
  if (announcements.length === 0) {
    announcementList.innerHTML = '<p class="no-announcement">등록된 공지사항이 없습니다.</p>';
    return;
  }
  
  const announcementsHtml = announcements.map(announcement => `
    <div class="announcement-item ${announcement.type}">
      <div class="announcement-header">
        <span class="announcement-type">${announcement.type === 'new' ? '🆕' : '📝'}</span>
        <span class="announcement-date">${announcement.date}</span>
      </div>
      <h4 class="announcement-title">${announcement.title}</h4>
      <p class="announcement-content">${announcement.content}</p>
    </div>
  `).join('');
  
  announcementList.innerHTML = announcementsHtml;
}

// 운세마스터 클릭 이벤트 함수 (비활성화됨)
function showMissionScreen() {
  // 기능이 비활성화되었습니다
  return;
}

// 운세마스터 화면 닫기 함수
function hideMissionScreen() {
  const missionSection = document.getElementById('mission');
  if (missionSection) {
    missionSection.style.display = 'none';
    // 홈 섹션으로 돌아가기
    const homeSection = document.getElementById('home');
    if (homeSection) {
      homeSection.style.display = 'block';
    }
  }
}

// About_Us 화면 표시 함수
function showAboutUs() {
  const aboutUsSection = document.getElementById('about-us');
  if (aboutUsSection) {
    aboutUsSection.style.display = 'block';
    // 다른 섹션들 숨기기
    document.querySelectorAll('.section').forEach(section => {
      if (section.id !== 'about-us') {
        section.style.display = 'none';
      }
    });
  }
}

// About_Us 화면 닫기 함수
function hideAboutUs() {
  const aboutUsSection = document.getElementById('about-us');
  if (aboutUsSection) {
    aboutUsSection.style.display = 'none';
    // 홈 섹션으로 돌아가기
    const homeSection = document.getElementById('home');
    if (homeSection) {
      homeSection.style.display = 'block';
    }
  }
}

// 모바일 메뉴 토글 함수
function toggleMobileMenu() {
  console.log('📱 모바일 메뉴 토글');
  
  // 현재 활성화된 섹션 확인
  const activeSection = document.querySelector('.section[style*="display: block"]');
  const currentSection = activeSection ? activeSection.id : 'home';
  
  // 모바일 메뉴 모달 표시
  showMobileMenuModal(currentSection);
}

// 모바일 메뉴 모달 표시
function showMobileMenuModal(currentSection) {
  const modalHTML = `
    <div class="mobile-menu-modal" id="mobileMenuModal">
      <div class="mobile-menu-content">
        <div class="mobile-menu-header">
          <h3>🔮 Fortune Teller</h3>
          <button class="mobile-menu-close" onclick="closeMobileMenu()">×</button>
        </div>
        <div class="mobile-menu-body">
          <div class="mobile-menu-section">
            <h4>🏠 메인</h4>
          </div>
          

          <div class="mobile-menu-section">
            <h4>🔮 운세 서비스</h4>
            <button class="mobile-menu-item" onclick="changeSection('bazi'); closeMobileMenu();">
              🔮 명리학
            </button>
            <button class="mobile-menu-item" onclick="changeSection('astrology'); closeMobileMenu();">
              ⭐ 점성술
            </button>
            <button class="mobile-menu-item" onclick="changeSection('tarot'); closeMobileMenu();">
              🃏 타로 점
            </button>
            <button class="mobile-menu-item" onclick="changeSection('numerology'); closeMobileMenu();">
              🔢 숫자 택일
            </button>
          </div>
          
          <div class="mobile-menu-section">
            <h4>💝 기부</h4>
            <button class="mobile-menu-item" onclick="changeSection('donation'); closeMobileMenu();">
              💝 Donation / 기부
            </button>
          </div>
          <div class="mobile-menu-section">
            <h4>👤 계정</h4>
            <button class="mobile-menu-item" onclick="changeSection('profile'); closeMobileMenu();">
              내 정보
            </button>
            <button class="mobile-menu-item" onclick="logout(); closeMobileMenu();">
              로그아웃
            </button>
          </div>
          
          <div class="mobile-menu-section">
            <h4>⚙️ 관리자</h4>
            <button class="mobile-menu-item" onclick="changeSection('admin'); closeMobileMenu();">
              ⚙️ 관리자 모드
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 기존 모달 제거
  const existingModal = document.getElementById('mobileMenuModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // 새 모달 추가
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // 모달 표시
  const modal = document.getElementById('mobileMenuModal');
  modal.style.display = 'flex';
}

// 모바일 메뉴 닫기
function closeMobileMenu() {
  const modal = document.getElementById('mobileMenuModal');
  if (modal) {
    modal.style.display = 'none';
    setTimeout(() => modal.remove(), 300);
  }
}



// 모바일 탭 상태 업데이트
function updateMobileTabState(activeSection) {
  console.log('📱 모바일 탭 상태 업데이트:', activeSection);
  
  // 모든 탭 비활성화
  const allTabs = document.querySelectorAll('.mobile-tab-item');
  allTabs.forEach(tab => {
    tab.classList.remove('active');
  });
  
  // 해당 섹션의 탭 활성화
  const activeTab = document.querySelector(`.mobile-tab-item[data-section="${activeSection}"]`);
  if (activeTab) {
    activeTab.classList.add('active');
    console.log('✅ 모바일 탭 활성화:', activeSection);
  } else {
    console.log('⚠️ 해당 섹션의 탭을 찾을 수 없음:', activeSection);
  }
}

// 모바일 전용 섹션 변경 함수
function changeMobileSection(sectionId) {
  console.log('📱 모바일 섹션 변경:', sectionId);
  
  // 기존 changeSection 함수 호출
  changeSection(sectionId);
  
  // 모바일 메뉴 닫기
  closeMobileMenu();
}

// ===== PHASE 3: 터치 제스처 및 성능 최적화 =====

// 터치 제스처 시스템 제거됨

// 터치 시작 이벤트
// 터치 이벤트 핸들러 함수들 제거됨

// 스와이프 제스처 처리
// 스와이프 제스처 처리 함수 제거됨

// 스와이프 관련 함수 제거됨

// 스와이프 관련 함수 제거됨

// 스와이프 관련 함수 제거됨

// 터치 제스처 시스템 제거됨

// ===== PHASE 3: 모바일 전용 유틸리티 함수들 =====

// 모바일 토스트 메시지 표시
function showMobileToast(message, duration = 3000) {
  if (!isMobile) return;
  
  // 기존 토스트 제거
  const existingToast = document.querySelector('.mobile-toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // 새 토스트 생성
  const toast = document.createElement('div');
  toast.className = 'mobile-toast';
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // 표시 애니메이션
  setTimeout(() => toast.classList.add('show'), 100);
  
  // 자동 제거
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// 모바일 로딩 스피너 표시/숨김
function showMobileLoading() {
  if (!isMobile) return;
  
  const loading = document.createElement('div');
  loading.className = 'mobile-loading';
  loading.innerHTML = '<div class="mobile-loading-spinner"></div>';
  loading.id = 'mobileLoading';
  
  document.body.appendChild(loading);
}

function hideMobileLoading() {
  if (!isMobile) return;
  
  const loading = document.getElementById('mobileLoading');
  if (loading) {
    loading.remove();
  }
}

// 모바일 성능 최적화
function optimizeMobilePerformance() {
  if (!isMobile) return;
  
  // 이미지 지연 로딩
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
  
  // 스크롤 성능 최적화
  let ticking = false;
  function updateScroll() {
    ticking = false;
    // 스크롤 관련 업데이트 로직
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick, { passive: true });
  
  console.log('📱 모바일 성능 최적화 완료');
}

// 모바일 키보드 대응
function handleMobileKeyboard() {
  if (!isMobile) return;
  
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      // 키보드가 열릴 때 스크롤 조정
      setTimeout(() => {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    });
  });
}

// 모바일 초기화
function initializeMobile() {
  if (!isMobile) return;
  
  console.log('📱 모바일 초기화 시작');
  
  // 터치 제스처 설정
  setupTouchGestures();
  
  // 성능 최적화
  optimizeMobilePerformance();
  
  // 키보드 대응
  handleMobileKeyboard();
  
  // 모바일 헤더 상태 업데이트
  updateMobileHeader();
  
  // 초기 토스트 메시지 제거됨
  
  console.log('📱 모바일 초기화 완료');
}

// 모바일 헤더 상태 업데이트
function updateMobileHeader() {
  if (!isMobile) return;
  
  const guestButtons = document.getElementById('mobileGuestButtons');
  const userInfo = document.getElementById('mobileUserInfo');
  const username = document.getElementById('mobileUsername');
  
  if (currentUser && currentUser.name) {
    // 로그인 상태
    if (guestButtons) guestButtons.style.display = 'none';
    if (userInfo) {
      userInfo.style.display = 'flex';
      if (username) username.textContent = currentUser.name;
    }
  } else {
    // 로그아웃 상태
    if (guestButtons) guestButtons.style.display = 'flex';
    if (userInfo) userInfo.style.display = 'none';
  }
  
  console.log('📱 모바일 헤더 상태 업데이트 완료');
}

// 기기 감지 시스템
let deviceType = 'desktop';
let isMobile = false;

function detectDeviceType() {
  const userAgent = navigator.userAgent;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // 모바일 기기 감지
  const mobileRegex = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileDevice = mobileRegex.test(userAgent);
  const isSmallScreen = screenWidth <= 768 || screenHeight <= 600;
  
  if (isMobileDevice || isSmallScreen) {
    deviceType = 'mobile';
    isMobile = true;
    console.log('📱 모바일 기기 감지됨:', { userAgent, screenWidth, screenHeight });
  } else {
    deviceType = 'desktop';
    isMobile = false;
    console.log('💻 데스크톱 기기 감지됨:', { screenWidth, screenHeight });
  }
  
  // body에 클래스 추가
  document.body.classList.remove('mobile-mode', 'desktop-mode');
  document.body.classList.add(`${deviceType}-mode`);
  
  // 하단 메뉴 완전 보호 및 강제 표시
  const bottomNav = document.querySelector('.mobile-bottom-nav');
  if (bottomNav) {
    bottomNav.style.setProperty('display', 'flex', 'important');
    bottomNav.style.setProperty('visibility', 'visible', 'important');
    bottomNav.style.setProperty('opacity', '1', 'important');
    bottomNav.style.setProperty('z-index', '99999', 'important');
    
    // MutationObserver로 하단 메뉴 보호
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
          // 스타일이 변경되면 즉시 복원
          bottomNav.style.setProperty('display', 'flex', 'important');
          bottomNav.style.setProperty('visibility', 'visible', 'important');
          bottomNav.style.setProperty('opacity', '1', 'important');
        }
      });
    });
    
    observer.observe(bottomNav, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }
  
  return deviceType;
}

// 페이지 로드 시 기기 감지
document.addEventListener('DOMContentLoaded', function() {
  detectDeviceType();
  
  // 모바일 모드일 때 초기화
  if (isMobile) {
    initializeMobile();
  }
  
  // 점성술 폼 초기화
  initializeAstrologyForm();
  
  // 스마트폰 하단 메뉴 보호 시스템
  const protectBottomNav = () => {
    const bottomNav = document.getElementById('mobileBottomNav');
    if (bottomNav) {
      // 핵심 스타일만 보호 (CSS에서 이미 보호됨)
      bottomNav.style.setProperty('display', 'flex', 'important');
      bottomNav.style.setProperty('visibility', 'visible', 'important');
    }
  };
  
  // 페이지 로드 완료 후 보호 시작
  window.addEventListener('load', () => {
    protectBottomNav();
    console.log('✅ 하단 메뉴 보호 시스템 활성화');
  });
  
  // DOM 변경 감지로 보호
  const observer = new MutationObserver(() => {
    protectBottomNav();
  });
  
  // body 전체 감시
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // 디버깅 모드 활성화 (개발용)
  window.debugMode = true;
  console.log('🔧 디버깅 모드 활성화');
  
  // 전역 디버깅 함수 추가
  window.debugBaziAnalysis = function() {
    console.log('=== 🔍 명리학 분석 디버깅 시작 ===');
    
    // 현재 상태 확인
    console.log('📱 스마트폰 여부:', window.innerWidth <= 768);
    console.log('📱 User Agent:', navigator.userAgent);
    console.log('📱 화면 크기:', window.innerWidth + 'x' + window.innerHeight);
    console.log('🔍 현재 URL:', window.location.href);
    console.log('🔍 현재 섹션:', document.querySelector('.section.active')?.id);
    
    // localStorage 확인
    const authToken = localStorage.getItem('authToken');
    const currentUser = localStorage.getItem('currentUser');
    console.log('🔑 인증 토큰:', authToken ? '있음' : '없음');
    console.log('👤 사용자 정보:', currentUser ? '있음' : '없음');
    
    // DOM 요소 확인
    const baziSection = document.getElementById('bazi');
    const baziResult = document.getElementById('baziResult');
    const myBaziInfo = document.getElementById('myBaziInfo');
    
    console.log('🏠 명리학 섹션:', baziSection ? '찾음' : '없음');
    console.log('📊 결과 컨테이너:', baziResult ? '찾음' : '없음');
    console.log('👤 사용자 정보 컨테이너:', myBaziInfo ? '찾음' : '없음');
    
    // 사용자 정보 파싱
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        console.log('✅ 사용자 정보 파싱 성공:', user);
        
        const birthInfo = {
          birthYear: user.birthYear || user.birth_year,
          birthMonth: user.birthMonth || user.birth_month,
          birthDay: user.birthDay || user.birth_day,
          birthHour: user.birthHour || user.birth_hour
        };
        
        console.log('📅 생년월일 정보:', birthInfo);
        
        // 명리학 분석 실행
        if (birthInfo.birthYear && birthInfo.birthMonth && birthInfo.birthDay) {
          console.log('🚀 명리학 분석 실행');
          
          // API URL 확인
          const isMobile = window.innerWidth <= 768;
          const apiBaseUrl = isMobile ? 'http://192.168.1.17:3000' : 'http://localhost:3000';
          console.log('🌐 사용할 API URL:', apiBaseUrl);
          
          performBaziAnalysis(user);
        } else {
          console.log('❌ 생년월일 정보 불완전');
        }
      } catch (e) {
        console.error('❌ 사용자 정보 파싱 오류:', e);
      }
    } else {
      console.log('❌ 사용자 정보 없음');
    }
  };
  
  // 전역 함수로 노출
  window.changeSection = changeSection;
  window.performBaziAnalysis = performBaziAnalysis;
  
  console.log('🔧 전역 디버깅 함수 등록 완료');
  console.log('💡 사용법: debugBaziAnalysis() 호출');
  
  // 화면 크기 변경 시 재감지
  window.addEventListener('resize', function() {
    const newDeviceType = detectDeviceType();
    if (newDeviceType !== deviceType) {
      console.log('🔄 기기 타입 변경:', deviceType, '→', newDeviceType);
      deviceType = newDeviceType;
      
      // 모바일 모드로 변경 시 초기화
      if (isMobile) {
        initializeMobile();
      }
    }
  });
});

// 오류 처리
window.addEventListener('error', function(e) {
    console.error('❌ JavaScript 오류:', e.error);
    console.error('❌ 오류 위치:', e.filename, ':', e.lineno);
    console.error('❌ 오류 메시지:', e.message);
    console.error('❌ User Agent:', navigator.userAgent);
    console.error('❌ 화면 크기:', window.innerWidth + 'x' + window.innerHeight);
});

// Promise 오류 처리 (스마트폰에서 중요)
window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Promise 오류:', e.reason);
    console.error('❌ User Agent:', navigator.userAgent);
    console.error('❌ 화면 크기:', window.innerWidth + 'x' + window.innerHeight);
});

// 다국어 지원
const translations = {
  ko: {
    logo: "운세마스터",
    nav: {
      home: "홈",
      bazi: "명리학",
      astrology: "점성술",
      profile: "내 정보",
      history: "분석 기록"
    },
    hero: {
      title: "당신의 운명을 읽어드립니다",
      subtitle: "동양의 고대 지혜와 현대 기술의 만남"
    },
    services: {
      bazi: {
        title: "사주명리학",
        desc: "생년월일시를 바탕으로 한 정확한 운세 분석"
      },
      astrology: {
        title: "서양점성술",
        desc: "별자리와 행성의 영향으로 미래를 예측"
      }
    },
    bazi: {
      title: "사주명리학",
      desc: "생년월일시를 입력하시면 전문적인 사주 분석을 제공해드립니다."
    },
    astrology: {
      title: "서양점성술",
      desc: "태양궁과 행성의 위치를 분석하여 운세를 읽어드립니다."
    },
    profile: {
      title: "내 정보",
      desc: "개인 정보와 생년월일시를 관리할 수 있습니다.",
      update: "정보 업데이트"
    },
    history: {
      title: "분석 기록",
      desc: "이전에 받은 운세 분석 결과들을 확인할 수 있습니다."
    },
    form: {
      name: "이름",
      username: "사용자명",
      email: "이메일",
      password: "비밀번호",
      year: "출생년도",
      month: "출생월",
      day: "출생일",
      hour: "출생시간",
      submit: "분석하기"
    },
    login: {
      title: "로그인",
      submit: "로그인",
      noAccount: "계정이 없으신가요?",
      switchToRegister: "회원가입"
    },
    register: {
      title: "운세마스터 가입하기",
      subtitle: "당신의 운명을 읽어드릴 준비가 되었습니다",
      submit: "운세마스터 가입하기",
      hasAccount: "이미 계정이 있으신가요?",
      switchToLogin: "로그인",
      nextStep: "다음 단계",
      prevStep: "이전 단계"
    },
    logout: "로그아웃",
    loading: "분석 중...",
    'register.subtitle': '신비로운 운세의 세계로 오신 것을 환영합니다',
    'register.nextStep': '다음 단계',
    'register.prevStep': '이전 단계',
    'register.complete': '완료',
    'register.step1': '기본 정보',
    'register.step2': '생년월일',
    'register.step3': '확인 및 완료',
    'register.name': '이름',
    'register.username': '사용자명',
    'register.email': '이메일',
    'register.password': '비밀번호',
    'register.birthInfo': '생년월일 정보',
    'register.birthYear': '출생년도',
    'register.birthMonth': '출생월',
    'register.birthDay': '출생일',
    'register.birthHour': '출생시간',
    'register.terms': '이용약관에 동의합니다',
    'register.summary': '입력 정보 확인',
    'register.submit': '회원가입 완료'
  },
  en: {
    logo: "Fortune Master",
    nav: {
      home: "Home",
      bazi: "Bazi",
      astrology: "Astrology",
      profile: "Profile",
      history: "History"
    },
    hero: {
      title: "Reading Your Destiny",
      subtitle: "Where Ancient Eastern Wisdom Meets Modern Technology"
    },
    services: {
      bazi: {
        title: "Bazi Astrology",
        desc: "Accurate fortune analysis based on birth date and time"
      },
      astrology: {
        title: "Western Astrology",
        desc: "Predicting the future through zodiac and planetary influences"
      }
    },
    bazi: {
      title: "Bazi Astrology",
      desc: "Enter your birth date and time for professional Bazi analysis."
    },
    astrology: {
      title: "Western Astrology",
      desc: "Analyzing sun signs and planetary positions to read your fortune."
    },
    profile: {
      title: "My Profile",
      desc: "Manage your personal information and birth details.",
      update: "Update Information"
    },
    history: {
      title: "Analysis History",
      desc: "View your previous fortune analysis results."
    },
    form: {
      name: "Name",
      username: "Username",
      email: "Email",
      password: "Password",
      year: "Birth Year",
      month: "Birth Month",
      day: "Birth Day",
      hour: "Birth Hour",
      submit: "Analyze"
    },
    login: {
      title: "Login",
      submit: "Login",
      noAccount: "Don't have an account?",
      switchToRegister: "Register"
    },
    register: {
      title: "Join Fortune Master",
      subtitle: "Ready to read your destiny",
      submit: "Join Fortune Master",
      hasAccount: "Already have an account?",
      switchToLogin: "Login",
      nextStep: "Next Step",
      prevStep: "Previous Step"
    },
    logout: "Logout",
    loading: "Analyzing...",
    'register.subtitle': 'Welcome to the mystical world of fortune telling',
    'register.nextStep': 'Next Step',
    'register.prevStep': 'Previous Step',
    'register.complete': 'Complete',
    'register.step1': 'Basic Info',
    'register.step2': 'Birth Date',
    'register.step3': 'Confirm & Complete',
    'register.name': 'Name',
    'register.username': 'Username',
    'register.email': 'Email',
    'register.password': 'Password',
    'register.birthInfo': 'Birth Information',
    'register.birthYear': 'Birth Year',
    'register.birthMonth': 'Birth Month',
    'register.birthDay': 'Birth Day',
    'register.birthHour': 'Birth Hour',
    'register.terms': 'I agree to the terms of service',
    'register.summary': 'Confirm Information',
    'register.submit': 'Complete Registration'
  }
};

// 회원가입 단계 관리
let currentStep = 1;
const totalSteps = 2;

// 전역 DOM 요소들
let formSteps = null;
let progressSteps = null;

// 전역 변수들
let currentLanguage = 'ko';
let currentUser = null;
let authToken = null;
let isAdminLoggedIn = false;

// DOM 요소들을 함수 내부에서 찾도록 변경

// 언어 변경 함수
function changeLanguage(lang) {
  currentLanguage = lang;
  const texts = translations[lang];
  
  // 모든 data-i18n 속성을 가진 요소들의 텍스트 업데이트
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const keys = key.split('.');
    let value = texts;
    
    for (const k of keys) {
      value = value[k];
    }
    
    if (value) {
      element.textContent = value;
    }
  });
  
  // HTML lang 속성 업데이트
  document.documentElement.lang = lang;
}

// 네비게이션 토글
function toggleNav() {
  const navMenu = document.querySelector('.nav-menu');
  if (navMenu) {
    navMenu.classList.toggle('active');
  }
}

// 숫자 택일 탭 설정 (모달 전용으로 수정)
function setupNumerologyTabs() {
  console.log('🔧 숫자 택일 탭 설정 시작 (모달 전용)');
  
  // 탭 버튼 찾기
  const tabButtons = document.querySelectorAll('.numerology-tabs .tab-btn');
  
  console.log('📊 찾은 탭 버튼:', tabButtons.length);
  
  if (tabButtons.length === 0) {
    console.error('❌ 탭 버튼을 찾을 수 없음');
    return;
  }
  
  // 모든 탭 버튼 비활성화
  tabButtons.forEach(btn => {
    btn.classList.remove('active');
  });
  
  // 첫 번째 탭을 기본으로 활성화
  if (tabButtons.length > 0) {
    const firstButton = tabButtons[0];
    firstButton.classList.add('active');
    console.log('🎯 첫 번째 탭 활성화:', firstButton.getAttribute('data-tab'));
  }
  
  // 각 탭 버튼에 클릭 이벤트 추가 (모달 전용)
  tabButtons.forEach((button, index) => {
    const tabName = button.getAttribute('data-tab');
    console.log(`🔗 탭 ${index + 1} 설정:`, tabName);
    
    // 모든 이벤트 리스너 제거
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    // 새로운 이벤트 리스너 추가 (모달 호출만)
    newButton.addEventListener('click', handleTabClick);
    newButton.addEventListener('mousedown', handleTabClick);
    newButton.addEventListener('touchstart', handleTabClick);
    
    // HTML의 onclick 속성 유지 (모바일에서 정상 작동을 위해)
    const originalOnclick = button.getAttribute('onclick');
    if (originalOnclick) {
      newButton.setAttribute('onclick', originalOnclick);
    }
    
    // 이벤트 핸들러 함수 (모달 전용)
    function handleTabClick(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('🎯 탭 클릭 이벤트 발생:', tabName);
      console.log('🎯 이벤트 타입:', e.type);
      
      // 모든 탭 버튼 비활성화
      const allButtons = document.querySelectorAll('.numerology-tabs .tab-btn');
      
      allButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      
      // 선택된 탭 활성화
      this.classList.add('active');
      console.log('  - 선택된 탭 활성화:', tabName);
      
      // 모달 호출 (onclick 속성과 중복 실행 방지)
      if (e.type === 'click') {
        console.log('🔄 모달 호출 시작:', tabName);
        switch(tabName) {
          case 'lucky-numbers':
            showLuckyNumbersModal(currentUser);
            break;
          case 'phone-analysis':
            showPhoneAnalysisModal(currentUser);
            break;
          case 'car-analysis':
            showCarAnalysisModal(currentUser);
            break;
          case 'personal-number':
            showPersonalNumberModal(currentUser);
            break;
          case 'date-selection':
            showDateSelectionModal(currentUser);
            break;
          case 'comprehensive':
            showComprehensiveModal(currentUser);
            break;
          default:
            console.log('❌ 알 수 없는 탭:', tabName);
        }
        
        console.log('✅ 모달 호출 완료:', tabName);
      }
    }
  });
  
  console.log('✅ 숫자 택일 탭 설정 완료 (모달 전용)');
}

// 글로벌 함수로 탭 테스트 함수 추가 (브라우저 콘솔에서 직접 호출 가능)
window.testNumerologyTabs = function() {
  console.log('🧪 탭 테스트 함수 실행');
  
  const tabButtons = document.querySelectorAll('.numerology-tabs .tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  console.log('📊 현재 탭 버튼 수:', tabButtons.length);
  console.log('📊 현재 탭 패널 수:', tabPanels.length);
  
  if (tabButtons.length === 0) {
    console.error('❌ 탭 버튼이 없습니다!');
    return;
  }
  
  // 두 번째 탭을 클릭해보기
  if (tabButtons.length > 1) {
    console.log('🎯 두 번째 탭 클릭 테스트');
    const secondTab = tabButtons[1];
    const tabName = secondTab.getAttribute('data-tab');
    console.log('클릭할 탭:', tabName);
    
    // 수동으로 클릭 이벤트 발생
    secondTab.click();
    
    // 1초 후 상태 확인
    setTimeout(() => {
      const isActive = secondTab.classList.contains('active');
      const targetPanel = document.getElementById(tabName);
      const panelActive = targetPanel ? targetPanel.classList.contains('active') : false;
      const panelDisplay = targetPanel ? targetPanel.style.display : 'N/A';
      
      console.log('📊 클릭 후 상태:');
      console.log('  - 버튼 활성:', isActive);
      console.log('  - 패널 활성:', panelActive);
      console.log('  - 패널 표시:', panelDisplay);
      
      if (isActive && panelActive && panelDisplay === 'block') {
        console.log('✅ 탭 클릭 테스트 성공!');
      } else {
        console.log('❌ 탭 클릭 테스트 실패!');
      }
    }, 1000);
  }
};

// 간단한 탭 전환 함수 (글로벌 함수로 추가)
window.switchTab = function(tabName) {
  console.log('🔄 탭 전환 시작:', tabName);
  
  try {
    // 1. 모든 탭과 패널 찾기
    const allButtons = document.querySelectorAll('.numerology-tabs .tab-btn');
    const allPanels = document.querySelectorAll('.tab-panel');
    
    // 2. 모든 탭과 패널 비활성화
    allButtons.forEach(btn => {
      btn.classList.remove('active');
    });
    
    allPanels.forEach(panel => {
      panel.classList.remove('active');
      panel.style.display = 'none';
      panel.style.opacity = '0';
      panel.style.visibility = 'hidden';
    });
    
    // 3. 선택된 탭과 패널 활성화
    const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
    const targetPanel = document.getElementById(tabName);
    
    if (!targetButton || !targetPanel) {
      console.error('❌ 탭 또는 패널을 찾을 수 없음:', tabName);
      return;
    }
    
    // 4. 탭 버튼 활성화
    targetButton.classList.add('active');
    
    // 5. 패널 활성화 (강제로 표시)
    targetPanel.classList.add('active');
    targetPanel.style.display = 'block !important';
    targetPanel.style.opacity = '1 !important';
    targetPanel.style.visibility = 'visible !important';
    targetPanel.style.position = 'relative';
    targetPanel.style.zIndex = '999';
    
    // 6. 사용자 정보 동기화
    if (currentUser) {
      syncNumerologyFormsWithUser(currentUser);
    }
    
    // 7. 즉시 결과 표시 (모달 팝업)
    console.log('🔄 모달 팝업 시작:', tabName);
    setTimeout(() => {
      console.log('⏰ 100ms 후 모달 팝업 실행');
      switch(tabName) {
        case 'lucky-numbers':
          console.log('⭐ 길한 숫자 모달 팝업');
          showLuckyNumbersModal(currentUser);
          break;
        case 'phone-analysis':
          console.log('📱 전화번호 분석 모달 팝업');
          showPhoneAnalysisModal(currentUser);
          break;
        case 'car-analysis':
          console.log('🚗 차량번호 분석 모달 팝업');
          showCarAnalysisModal(currentUser);
          break;
        case 'personal-number':
          console.log('👤 개인숫자 분석 모달 팝업');
          showPersonalNumberModal(currentUser);
          break;
        case 'date-selection':
          console.log('📅 택일 서비스 모달 팝업');
          showDateSelectionModal(currentUser);
          break;
        case 'comprehensive':
          console.log('🔮 종합 분석 모달 팝업');
          showComprehensiveModal(currentUser);
          break;
        default:
          console.log('❌ 알 수 없는 탭:', tabName);
      }
    }, 100);
    
    console.log('✅ 탭 전환 완료:', tabName);
    
  } catch (error) {
    console.error('❌ 탭 전환 중 오류:', error);
  }
};

// 숫자 택일 폼 설정
function setupNumerologyForms() {
  console.log('🔧 숫자 택일 폼 설정 시작');
  
  // 기존 이벤트 리스너 제거를 위해 폼들을 새로 생성
  const formIds = [
    'luckyNumbersForm',
    'phoneAnalysisForm',
    'carAnalysisForm',
    'personalNumberForm',
    'dateSelectionForm',
    'comprehensiveForm'
  ];
  
  // 택일 서비스 분석 유형 변경 이벤트
  const dateTypeSelect = document.getElementById('dateType');
  if (dateTypeSelect) {
    dateTypeSelect.addEventListener('change', function() {
      const recommendOptions = document.getElementById('recommendOptions');
      const checkOptions = document.getElementById('checkOptions');
      
      if (this.value === 'recommend') {
        recommendOptions.style.display = 'flex';
        checkOptions.style.display = 'none';
      } else if (this.value === 'check') {
        recommendOptions.style.display = 'none';
        checkOptions.style.display = 'flex';
      }
    });
  }
  
  formIds.forEach(formId => {
    const form = document.getElementById(formId);
    if (form) {
      // 기존 이벤트 리스너 제거
      const newForm = form.cloneNode(true);
      form.parentNode.replaceChild(newForm, form);
      console.log(`✅ ${formId} 폼 새로 생성됨`);
    } else {
      console.log(`❌ ${formId} 폼을 찾을 수 없음`);
    }
  });
  
  // 길한 숫자 분석 폼
  const luckyNumbersForm = document.getElementById('luckyNumbersForm');
  if (luckyNumbersForm) {
    console.log('✅ 길한 숫자 폼 찾음');
    luckyNumbersForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('📊 길한 숫자 분석 시작');
      await analyzeLuckyNumbers();
    });
  } else {
    console.log('❌ 길한 숫자 폼을 찾을 수 없음');
  }
  
  // 전화번호 분석 폼
  const phoneAnalysisForm = document.getElementById('phoneAnalysisForm');
  if (phoneAnalysisForm) {
    console.log('✅ 전화번호 분석 폼 찾음');
    phoneAnalysisForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('📱 전화번호 분석 시작');
      await analyzePhoneNumber();
    });
  } else {
    console.log('❌ 전화번호 분석 폼을 찾을 수 없음');
  }
  
  // 차량번호 분석 폼
  const carAnalysisForm = document.getElementById('carAnalysisForm');
  if (carAnalysisForm) {
    console.log('✅ 차량번호 분석 폼 찾음');
    carAnalysisForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🚗 차량번호 분석 시작');
      await analyzeCarNumber();
    });
  } else {
    console.log('❌ 차량번호 분석 폼을 찾을 수 없음');
  }
  
  // 개인숫자 분석 폼
  const personalNumForm = document.getElementById('personalNumberForm');
  if (personalNumForm) {
    console.log('✅ 개인숫자 분석 폼 찾음');
    personalNumForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('👤 개인숫자 분석 시작');
      await analyzePersonalNumber();
    });
  } else {
    console.log('❌ 개인숫자 분석 폼을 찾을 수 없음');
  }

  // 개인숫자 분석 폼 (새로운 탭)
  const personalNumberForm = document.getElementById('personalNumberForm');
  if (personalNumberForm) {
    console.log('✅ 개인숫자 분석 폼(새) 찾음');
    personalNumberForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('🎯 개인숫자 분석 시작');
      await analyzePersonalNumber();
    });
  } else {
    console.log('❌ 개인숫자 분석 폼(새)을 찾을 수 없음');
  }
  
  // 택일 서비스 폼
  const dateSelectionForm = document.getElementById('dateSelectionForm');
  if (dateSelectionForm) {
    console.log('✅ 택일 서비스 폼 찾음');
    dateSelectionForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('📅 택일 분석 시작');
      await selectDateForPurpose();
    });
  } else {
    console.log('❌ 택일 서비스 폼을 찾을 수 없음');
  }
  
  // 종합 분석 폼
  const comprehensiveForm = document.getElementById('comprehensiveForm');
  if (comprehensiveForm) {
    console.log('✅ 종합 분석 폼 찾음');
    comprehensiveForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('📊 종합 분석 시작');
      await getComprehensiveAnalysis();
    });
  } else {
    console.log('❌ 종합 분석 폼을 찾을 수 없음');
  }
  
  // 기본 날짜 설정
  const startDateInput = document.getElementById('startDate');
  if (startDateInput) {
    const today = new Date().toISOString().split('T')[0];
    startDateInput.value = today;
    console.log('📅 기본 날짜 설정:', today);
  }
  
  console.log('✅ 숫자 택일 폼 설정 완료');
}

// 숫자 택일 폼에 사용자 정보 동기화

// 숫자 택일 폼에 사용자 정보 동기화
function syncNumerologyFormsWithUser(user) {
  console.log('🔄 사용자 정보 동기화 시작:', user);
  
  if (!user) {
    console.log('❌ 사용자 정보가 없습니다.');
    return;
  }
  
  const birthYear = user.birthYear || user.birth_year;
  const birthMonth = user.birthMonth || user.birth_month;
  const birthDay = user.birthDay || user.birth_day;
  const birthHour = user.birthHour || user.birth_hour;
  
  if (!birthYear || !birthMonth || !birthDay) {
    console.log('❌ 사용자 정보가 불완전합니다:', user);
    return;
  }
  
  console.log('✅ 사용자 정보 검증 완료:', {
    birthYear: user.birthYear,
    birthMonth: user.birthMonth,
    birthDay: user.birthDay,
    birthHour: user.birthHour
  });
  
  // 모든 입력 필드 ID 목록
  const inputFields = [
    { id: 'luckyBirthYear', form: 'luckyNumbersForm' },
    { id: 'luckyBirthMonth', form: 'luckyNumbersForm' },
    { id: 'luckyBirthDay', form: 'luckyNumbersForm' },
    { id: 'luckyBirthHour', form: 'luckyNumbersForm' },
    { id: 'phoneBirthYear', form: 'phoneAnalysisForm' },
    { id: 'phoneBirthMonth', form: 'phoneAnalysisForm' },
    { id: 'phoneBirthDay', form: 'phoneAnalysisForm' },
    { id: 'phoneBirthHour', form: 'phoneAnalysisForm' },
    { id: 'carBirthYear', form: 'carAnalysisForm' },
    { id: 'carBirthMonth', form: 'carAnalysisForm' },
    { id: 'carBirthDay', form: 'carAnalysisForm' },
    { id: 'carBirthHour', form: 'carAnalysisForm' },
    { id: 'personalBirthYear', form: 'personalNumberForm' },
    { id: 'personalBirthMonth', form: 'personalNumberForm' },
    { id: 'personalBirthDay', form: 'personalNumberForm' },
    { id: 'personalBirthHour', form: 'personalNumberForm' },
    { id: 'dateBirthYear', form: 'dateSelectionForm' },
    { id: 'dateBirthMonth', form: 'dateSelectionForm' },
    { id: 'dateBirthDay', form: 'dateSelectionForm' },
    { id: 'dateBirthHour', form: 'dateSelectionForm' },
    { id: 'comprehensiveBirthYear', form: 'comprehensiveForm' },
    { id: 'comprehensiveBirthMonth', form: 'comprehensiveForm' },
    { id: 'comprehensiveBirthDay', form: 'comprehensiveForm' },
    { id: 'comprehensiveBirthHour', form: 'comprehensiveForm' }
  ];
  
  inputFields.forEach(field => {
    const input = document.getElementById(field.id);
    if (input) {
      if (field.id.includes('BirthYear')) {
        input.value = user.birthYear || '';
        console.log(`✅ ${field.id} 설정:`, user.birthYear);
      } else if (field.id.includes('BirthMonth')) {
        input.value = user.birthMonth || '';
        console.log(`✅ ${field.id} 설정:`, user.birthMonth);
      } else if (field.id.includes('BirthDay')) {
        input.value = user.birthDay || '';
        console.log(`✅ ${field.id} 설정:`, user.birthDay);
      } else if (field.id.includes('BirthHour')) {
        input.value = user.birthHour || '';
        console.log(`✅ ${field.id} 설정:`, user.birthHour);
      }
    } else {
      console.log(`❌ ${field.id} 입력 필드를 찾을 수 없음`);
    }
  });
  
  console.log('✅ 사용자 정보 동기화 완료');
}

// 숫자 택일 분석 수행
function performNumerologyAnalysis(user) {
  console.log('🔮 숫자 택일 분석 수행:', user);
  
  if (!user || !user.birthYear) {
    console.log('❌ 유효한 사용자 정보가 없습니다.');
    return;
  }
  
  const infoDisplay = document.getElementById('myNumerologyInfo');
  if (infoDisplay) {
    infoDisplay.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
        <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 8px; padding: 8px; border: 1px solid rgba(255, 255, 255, 0.2); text-align: center;">
          <p style="font-weight: 500; font-size: 0.85rem; margin: 0;"><strong>생년월일:</strong><br>${user.birthYear}년 ${user.birthMonth}월 ${user.birthDay}일</p>
        </div>
        <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 8px; padding: 8px; border: 1px solid rgba(255, 255, 255, 0.2); text-align: center;">
          <p style="font-weight: 500; font-size: 0.85rem; margin: 0;"><strong>이름:</strong><br>${user.name || '사용자'}</p>
        </div>
      </div>
      <p style="color: #666; font-style: italic; font-size: 0.75rem; margin: 0; text-align: center;">✅ 사주 정보 로드됨</p>
    `;
    console.log('✅ 사주 정보 표시 완료');
  } else {
    console.log('❌ 사주 정보 표시 영역을 찾을 수 없음');
  }
}

// 길한 숫자 분석
async function analyzeLuckyNumbers(user = null) {
  console.log('⭐ 길한 숫자 분석 시작');
  
  // 사용자 정보 가져오기 (매개변수 우선, 없으면 currentUser 사용)
  const userToUse = user || currentUser;
  console.log('🔍 분석할 사용자 정보:', userToUse);
  
  // 현재 사용자 정보로 기본 데이터 생성
  const data = userToUse ? {
    birthYear: parseInt(userToUse.birthYear || userToUse.birth_year),
    birthMonth: parseInt(userToUse.birthMonth || userToUse.birth_month),
    birthDay: parseInt(userToUse.birthDay || userToUse.birth_day),
    birthHour: parseInt(userToUse.birthHour || userToUse.birth_hour || 0)
  } : {
    birthYear: 1990,
    birthMonth: 5,
    birthDay: 15,
    birthHour: 0
  };
  
  console.log('📊 분석 데이터:', data);

  // 자동 분석 결과 즉시 표시
  const basicResult = generateBasicLuckyNumbers(data);
  displayAutoLuckyNumbersResult(basicResult);
  
  // API 호출 (백그라운드에서)
  try {
    const response = await fetch('/api/numerology/lucky-numbers', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) {
      displayLuckyNumbersResult(result.data);
    }
  } catch (error) {
    console.error('길한 숫자 분석 오류:', error);
  }
}

// 자동 길한 숫자 결과 표시
function displayAutoLuckyNumbersResult(data) {
  const resultSection = document.getElementById('autoLuckyNumbersResult');
  
  if (resultSection) {
    // 길한 숫자
    const luckyNumbersList = document.getElementById('autoLuckyNumbersList');
    if (luckyNumbersList) {
      luckyNumbersList.innerHTML = data.luckyNumbers.map(num => 
        `<span class="lucky-number">${num}</span>`
      ).join('');
    }
    
    // 최적 요일
    const luckyDaysList = document.getElementById('autoLuckyDaysList');
    if (luckyDaysList) {
      luckyDaysList.innerHTML = data.luckyDays.map(day => 
        `<span class="lucky-day">${day}</span>`
      ).join('');
    }
    
    // 길한 시간대
    const luckyHoursList = document.getElementById('autoLuckyHoursList');
    if (luckyHoursList) {
      luckyHoursList.innerHTML = data.luckyHours.map(hour => 
        `<span class="lucky-hour">${hour}</span>`
      ).join('');
    }
    
    // 길한 색상
    const luckyColorsList = document.getElementById('autoLuckyColorsList');
    if (luckyColorsList) {
      luckyColorsList.innerHTML = data.luckyColors.map(color => 
        `<span class="lucky-color">${color}</span>`
      ).join('');
    }
    
    // 길한 방향
    const luckyDirectionsList = document.getElementById('autoLuckyDirectionsList');
    if (luckyDirectionsList) {
      luckyDirectionsList.innerHTML = data.luckyDirections.map(direction => 
        `<span class="lucky-direction">${direction}</span>`
      ).join('');
    }
    
    // 길한 보석
    const luckyStonesList = document.getElementById('autoLuckyStonesList');
    if (luckyStonesList) {
      luckyStonesList.innerHTML = data.luckyStones.map(stone => 
        `<span class="lucky-stone">${stone}</span>`
      ).join('');
    }
    
    resultSection.style.display = 'block';
    console.log('✅ 자동 길한 숫자 결과 표시 완료');
  }
}

// 로딩 및 에러 표시 함수
function showLoading() {
  console.log('⏳ 로딩 시작');
  // 로딩 표시 로직 추가 가능
}

function hideLoading() {
  console.log('✅ 로딩 완료');
  // 로딩 숨김 로직 추가 가능
}

function showError(message) {
  console.error('❌ 에러:', message);
  alert(message);
}

// 기본 길한 숫자 생성 (사주 기반)
function generateBasicLuckyNumbers(data) {
  const birthYear = parseInt(data.birthYear);
  const birthMonth = parseInt(data.birthMonth);
  const birthDay = parseInt(data.birthDay);
  
  // 사주 기반 길한 숫자 계산
  const luckyNumbers = [];
  const luckyDays = [];
  const luckyHours = [];
  const luckyColors = [];
  const luckyDirections = [];
  const luckyStones = [];
  
  // 생년월일 기반 길한 숫자 생성 (사주 전문가 수준)
  const baseNumber = (birthYear + birthMonth + birthDay) % 9 + 1;
  const elementNumbers = {
    '목': [1, 2, 9],
    '화': [3, 4, 7],
    '토': [5, 6, 8],
    '금': [1, 6, 7],
    '수': [2, 3, 8]
  };
  
  // 사주 오행 기반 길한 숫자
  const elements = ['목', '화', '토', '금', '수'];
  const elementIndex = (birthYear + birthMonth + birthDay) % 5;
  const luckyElement = elements[elementIndex];
  luckyNumbers.push(...elementNumbers[luckyElement]);
  
  // 요일별 길한 요일 (사주 기반)
  const dayNames = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
  const dayIndex = (birthYear + birthMonth + birthDay) % 7;
  luckyDays.push(dayNames[dayIndex]);
  luckyDays.push(dayNames[(dayIndex + 3) % 7]);
  
  // 시간대별 길한 시간
  const hourNames = ['자시(23-01)', '축시(01-03)', '인시(03-05)', '묘시(05-07)', '진시(07-09)', '사시(09-11)', 
                    '오시(11-13)', '미시(13-15)', '신시(15-17)', '유시(17-19)', '술시(19-21)', '해시(21-23)'];
  const hourIndex = (birthYear + birthMonth + birthDay) % 12;
  luckyHours.push(hourNames[hourIndex]);
  luckyHours.push(hourNames[(hourIndex + 6) % 12]);
  
  // 색상 (오행 기반)
  const colors = ['빨간색(화)', '노란색(토)', '흰색(금)', '검은색(수)', '초록색(목)'];
  const colorIndex = (birthYear + birthMonth + birthDay) % 5;
  luckyColors.push(colors[colorIndex]);
  luckyColors.push(colors[(colorIndex + 2) % 5]);
  
  // 방향 (팔괘 기반)
  const directions = ['동쪽(진)', '남쪽(이)', '서쪽(태)', '북쪽(감)', '동남(손)', '서남(곤)', '동북(간)', '서북(건)'];
  const dirIndex = (birthYear + birthMonth + birthDay) % 8;
  luckyDirections.push(directions[dirIndex]);
  luckyDirections.push(directions[(dirIndex + 4) % 8]);
  
  // 보석 (사주 기반)
  const stones = ['루비(화)', '황금(토)', '다이아몬드(금)', '사파이어(수)', '에메랄드(목)'];
  const stoneIndex = (birthYear + birthMonth + birthDay) % 5;
  luckyStones.push(stones[stoneIndex]);
  luckyStones.push(stones[(stoneIndex + 3) % 5]);
  
  return {
    luckyNumbers,
    luckyDays,
    luckyHours,
    luckyColors,
    luckyDirections,
    luckyStones,
    analysis: `생년월일 ${birthYear}년 ${birthMonth}월 ${birthDay}일을 기반으로 한 전문 사주 분석 결과입니다. 길한 오행: ${luckyElement}`
  };
}

// 개인숫자 분석
async function analyzePersonalNumber() {
  const form = document.getElementById('personalNumberForm');
  const formData = new FormData(form);
  const data = {
    birthYear: parseInt(formData.get('birthYear')),
    birthMonth: parseInt(formData.get('birthMonth')),
    birthDay: parseInt(formData.get('birthDay')),
    birthHour: formData.get('birthHour') ? parseInt(formData.get('birthHour')) : 0,
    purpose: formData.get('purpose'),
    numberCount: parseInt(formData.get('numberCount'))
  };

  console.log('🎯 개인숫자 분석 시작:', data);

  try {
    const response = await fetch('/api/numerology/personal-number', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) {
      displayPersonalNumberResult(result.data);
    } else {
      // 오류 시에도 기본 분석 결과 표시
      console.log('⚠️ 서버 오류, 기본 개인숫자 분석 결과 표시');
      displayPersonalNumberResult(generateBasicPersonalNumber(data));
    }
  } catch (error) {
    console.error('개인숫자 분석 오류:', error);
    // 오류 시에도 기본 분석 결과 표시
    displayPersonalNumberResult(generateBasicPersonalNumber(data));
  }
}

// 기본 개인숫자 생성 (사주 기반)
function generateBasicPersonalNumber(data) {
  const birthYear = parseInt(data.birthYear);
  const birthMonth = parseInt(data.birthMonth);
  const birthDay = parseInt(data.birthDay);
  const purpose = data.purpose;
  const numberCount = parseInt(data.numberCount);
  
  // 사주 기반 개인 맞춤 숫자 생성
  const recommendedNumbers = [];
  const numberFortune = [];
  const bestTiming = [];
  const usageAdvice = [];
  
  // 사주 오행 기반 숫자 생성
  const baseNumber = (birthYear + birthMonth + birthDay) % 9 + 1;
  const elementNumbers = {
    '목': [1, 2, 9, 11, 12, 19, 21, 22, 29, 31, 32, 39, 41, 42, 49],
    '화': [3, 4, 7, 13, 14, 17, 23, 24, 27, 33, 34, 37, 43, 44, 47],
    '토': [5, 6, 8, 15, 16, 18, 25, 26, 28, 35, 36, 38, 45, 46, 48],
    '금': [1, 6, 7, 11, 16, 17, 21, 26, 27, 31, 36, 37, 41, 46, 47],
    '수': [2, 3, 8, 12, 13, 18, 22, 23, 28, 32, 33, 38, 42, 43, 48]
  };
  
  const elements = ['목', '화', '토', '금', '수'];
  const elementIndex = (birthYear + birthMonth + birthDay) % 5;
  const luckyElement = elements[elementIndex];
  const elementLuckyNumbers = elementNumbers[luckyElement];
  
  // 목적별 숫자 조합
  const purposeNumbers = {
    'lotto': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    'lottery': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    'casino': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    'investment': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    'business': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    'general': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]
  };
  
  const availableNumbers = purposeNumbers[purpose] || purposeNumbers['general'];
  const luckyNumbers = availableNumbers.filter(num => elementLuckyNumbers.includes(num));
  
  // 추천 숫자 생성
  for (let i = 0; i < numberCount; i++) {
    const randomIndex = (birthYear + birthMonth + birthDay + i) % luckyNumbers.length;
    const number = luckyNumbers[randomIndex];
    if (!recommendedNumbers.includes(number)) {
      recommendedNumbers.push(number);
    }
  }
  
  // 숫자별 길흉도
  recommendedNumbers.forEach((number, index) => {
    const fortune = 70 + (birthYear + birthMonth + birthDay + number) % 30;
    numberFortune.push({
      number: number,
      fortune: fortune,
      grade: fortune >= 85 ? '매우 길함' : fortune >= 75 ? '길함' : fortune >= 65 ? '보통' : '주의'
    });
  });
  
  // 최적 사용 시기
  const dayNames = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'];
  const dayIndex = (birthYear + birthMonth + birthDay) % 7;
  bestTiming.push(dayNames[dayIndex]);
  bestTiming.push(dayNames[(dayIndex + 3) % 7]);
  
  const hourNames = ['자시(23-01)', '축시(01-03)', '인시(03-05)', '묘시(05-07)', '진시(07-09)', '사시(09-11)', 
                    '오시(11-13)', '미시(13-15)', '신시(15-17)', '유시(17-19)', '술시(19-21)', '해시(21-23)'];
  const hourIndex = (birthYear + birthMonth + birthDay) % 12;
  bestTiming.push(hourNames[hourIndex]);
  
  // 활용 조언
  const purposeAdvice = {
    'lotto': '로또 구매 시 이 숫자들을 조합하여 사용하시면 좋은 결과를 얻을 수 있습니다.',
    'lottery': '복권 구매 시 이 숫자들을 활용하시면 행운을 끌어들일 수 있습니다.',
    'casino': '카지노 게임 시 이 숫자들을 참고하시면 좋은 결과를 얻을 수 있습니다.',
    'investment': '투자나 재테크 시 이 숫자들을 참고하시면 안정적인 수익을 얻을 수 있습니다.',
    'business': '사업이나 계약 시 이 숫자들을 활용하시면 성공 확률이 높아집니다.',
    'general': '일상생활에서 이 숫자들을 활용하시면 행운을 끌어들일 수 있습니다.'
  };
  
  usageAdvice.push(purposeAdvice[purpose] || purposeAdvice['general']);
  usageAdvice.push('사주와 조화를 이루는 숫자들이므로 신뢰하고 활용하시기 바랍니다.');
  usageAdvice.push('적절한 시기와 함께 사용하시면 더욱 좋은 결과를 얻을 수 있습니다.');
  
  return {
    recommendedNumbers,
    numberFortune,
    bestTiming,
    usageAdvice,
    analysis: `${birthYear}년 ${birthMonth}월 ${birthDay}일 사주를 기반으로 한 개인 맞춤 행운 숫자 분석 결과입니다. 길한 오행: ${luckyElement}`
  };
}

// 전화번호 분석
async function analyzePhoneNumber() {
  const form = document.getElementById('phoneAnalysisForm');
  const formData = new FormData(form);
  const data = {
    birthYear: parseInt(formData.get('birthYear')),
    birthMonth: parseInt(formData.get('birthMonth')),
    birthDay: parseInt(formData.get('birthDay')),
    birthHour: formData.get('birthHour') ? parseInt(formData.get('birthHour')) : 0,
    phoneNumber: formData.get('phoneNumber')
  };

  console.log('📱 전화번호 분석 시작:', data);

  try {
    const response = await fetch('/api/numerology/phone-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) {
      displayPhoneAnalysisResult(result.data);
    } else {
      // 오류 시에도 기본 분석 결과 표시
      console.log('⚠️ 서버 오류, 기본 전화번호 분석 결과 표시');
      displayPhoneAnalysisResult(generateBasicPhoneAnalysis(data));
    }
  } catch (error) {
    console.error('전화번호 분석 오류:', error);
    // 오류 시에도 기본 분석 결과 표시
    displayPhoneAnalysisResult(generateBasicPhoneAnalysis(data));
  }
}

// 기본 전화번호 분석 생성
function generateBasicPhoneAnalysis(data) {
  const birthYear = parseInt(data.birthYear);
  const birthMonth = parseInt(data.birthMonth);
  const birthDay = parseInt(data.birthDay);
  const phoneNumber = data.phoneNumber;
  
  const digits = phoneNumber.replace(/\D/g, '');
  const sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  const score = 60 + (sum % 40);
  
  let grade, recommendation;
  if (score >= 80) {
    grade = 'A+';
    recommendation = '매우 길한 전화번호입니다. 좋은 인연과 소통이 많을 것입니다.';
  } else if (score >= 70) {
    grade = 'A';
    recommendation = '길한 전화번호입니다. 원활한 소통과 좋은 기회를 얻을 수 있습니다.';
  } else if (score >= 60) {
    grade = 'B';
    recommendation = '보통의 전화번호입니다. 평범한 소통과 기회가 있을 것입니다.';
  } else {
    grade = 'C';
    recommendation = '주의가 필요한 전화번호입니다. 소통에 신중함이 필요합니다.';
  }
  
  const digitAnalysis = digits.split('').map((digit, index) => ({
    digit: digit,
    status: (parseInt(digit) + birthYear + birthMonth + birthDay) % 2 === 0 ? 'good' : 'neutral'
  }));
  
  return {
    score: score,
    grade: grade,
    recommendation: recommendation,
    digitAnalysis: digitAnalysis,
    analysis: `${birthYear}년 ${birthMonth}월 ${birthDay}일 사주를 기반으로 한 전화번호 분석 결과입니다.`
  };
}

// 차량번호 분석
async function analyzeCarNumber() {
  const form = document.getElementById('carAnalysisForm');
  const formData = new FormData(form);
  const data = {
    birthYear: parseInt(formData.get('birthYear')),
    birthMonth: parseInt(formData.get('birthMonth')),
    birthDay: parseInt(formData.get('birthDay')),
    birthHour: formData.get('birthHour') ? parseInt(formData.get('birthHour')) : 0,
    carNumber: formData.get('carNumber')
  };

  console.log('🚗 차량번호 분석 시작:', data);

  try {
    const response = await fetch('/api/numerology/car-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) {
      displayCarAnalysisResult(result.data);
    } else {
      // 오류 시에도 기본 분석 결과 표시
      console.log('⚠️ 서버 오류, 기본 차량번호 분석 결과 표시');
      displayCarAnalysisResult(generateBasicCarAnalysis(data));
    }
  } catch (error) {
    console.error('차량번호 분석 오류:', error);
    // 오류 시에도 기본 분석 결과 표시
    displayCarAnalysisResult(generateBasicCarAnalysis(data));
  }
}

// 기본 차량번호 분석 생성
function generateBasicCarAnalysis(data) {
  const birthYear = parseInt(data.birthYear);
  const birthMonth = parseInt(data.birthMonth);
  const birthDay = parseInt(data.birthDay);
  const carNumber = data.carNumber;
  
  const digits = carNumber.replace(/\D/g, '');
  const sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  const score = 65 + (sum % 35);
  
  let grade, recommendation;
  if (score >= 80) {
    grade = 'A+';
    recommendation = '매우 안전한 차량번호입니다. 안전 운전과 좋은 여행이 있을 것입니다.';
  } else if (score >= 70) {
    grade = 'A';
    recommendation = '안전한 차량번호입니다. 평온한 운전과 여행이 가능합니다.';
  } else if (score >= 60) {
    grade = 'B';
    recommendation = '보통의 차량번호입니다. 일반적인 운전과 여행이 있을 것입니다.';
  } else {
    grade = 'C';
    recommendation = '주의가 필요한 차량번호입니다. 운전에 각별한 신중함이 필요합니다.';
  }
  
  const digitAnalysis = digits.split('').map((digit, index) => ({
    digit: digit,
    status: (parseInt(digit) + birthYear + birthMonth + birthDay) % 2 === 0 ? 'good' : 'neutral'
  }));
  
  return {
    score: score,
    grade: grade,
    recommendation: recommendation,
    digitAnalysis: digitAnalysis,
    analysis: `${birthYear}년 ${birthMonth}월 ${birthDay}일 사주를 기반으로 한 차량번호 분석 결과입니다.`
  };
}

// 개인숫자 분석
async function analyzePersonalNumber() {
  const form = document.getElementById('personalNumberForm');
  const formData = new FormData(form);
  const data = {
    birthYear: parseInt(formData.get('birthYear')),
    birthMonth: parseInt(formData.get('birthMonth')),
    birthDay: parseInt(formData.get('birthDay')),
    birthHour: formData.get('birthHour') ? parseInt(formData.get('birthHour')) : 0,
    personalNumber: formData.get('personalNumber')
  };

  try {
    showLoading();
    const response = await fetch('/api/numerology/personal-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) {
      displayPersonalAnalysisResult(result.data);
    } else {
      showError(result.error || '분석 중 오류가 발생했습니다.');
    }
  } catch (error) {
    showError('서버 연결 오류: ' + error.message);
  } finally {
    hideLoading();
  }
}

// 택일 서비스
async function selectDateForPurpose() {
  const form = document.getElementById('dateSelectionForm');
  const formData = new FormData(form);
  const data = {
    birthYear: parseInt(formData.get('birthYear')),
    birthMonth: parseInt(formData.get('birthMonth')),
    birthDay: parseInt(formData.get('birthDay')),
    birthHour: formData.get('birthHour') ? parseInt(formData.get('birthHour')) : 0,
    purpose: formData.get('purpose'),
    startDate: formData.get('startDate'),
    days: parseInt(formData.get('days'))
  };

  console.log('📅 택일 서비스 분석 시작:', data);

  try {
    const response = await fetch('/api/numerology/date-selection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) {
      displayDateSelectionResult(result.data);
    } else {
      // 오류 시에도 기본 분석 결과 표시
      console.log('⚠️ 서버 오류, 기본 택일 분석 결과 표시');
      displayDateSelectionResult(generateBasicDateSelection(data));
    }
  } catch (error) {
    console.error('택일 서비스 분석 오류:', error);
    // 오류 시에도 기본 분석 결과 표시
    displayDateSelectionResult(generateBasicDateSelection(data));
  }
}

// 기본 택일 분석 생성 (사주 기반)
function generateBasicDateSelection(data) {
  const birthYear = parseInt(data.birthYear);
  const birthMonth = parseInt(data.birthMonth);
  const birthDay = parseInt(data.birthDay);
  const purpose = data.purpose;
  const startDate = new Date(data.startDate);
  const days = parseInt(data.days);
  
  // 사주 기반 택일 분석
  const topDates = [];
  const avoidDates = [];
  const bestTimes = [];
  const dateAdvice = [];
  
  // 목적별 조언
  const purposeAdvice = {
    'meeting': '미팅/회의는 화기애애한 분위기로 진행되며, 좋은 결과를 얻을 수 있습니다.',
    'contract': '계약/사업은 안정적으로 진행되며, 장기적인 이익을 얻을 수 있습니다.',
    'moving': '이사/입주는 새로운 시작의 좋은 기회가 될 것입니다.',
    'wedding': '결혼/행사는 행복한 기억으로 남을 것입니다.',
    'business': '사업 시작은 성공적인 출발이 될 것입니다.',
    'travel': '여행/출장은 즐거운 경험과 함께 좋은 인연을 만날 수 있습니다.',
    'medical': '병원/치료는 빠른 회복과 함께 건강을 되찾을 수 있습니다.',
    'education': '교육/학습은 새로운 지식과 함께 성장의 기회가 될 것입니다.',
    'investment': '투자/재테크는 신중한 판단으로 좋은 결과를 얻을 수 있습니다.',
    'relationship': '인연/연애는 새로운 만남과 함께 행복한 시간을 보낼 수 있습니다.'
  };
  
  // 최적 날짜 생성 (사주 기반)
  for (let i = 0; i < 3; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (i * 7) + (birthDay % 7));
    topDates.push({
      date: date.toLocaleDateString('ko-KR'),
      score: 85 + (i * 5),
      reasons: ['사주와 조화', '길한 날', '목적에 적합']
    });
  }
  
  // 피해야 할 날짜 생성
  for (let i = 0; i < 2; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (i * 14) + (birthMonth % 14));
    avoidDates.push({
      date: date.toLocaleDateString('ko-KR'),
      reasons: ['사주와 상충', '불길한 날', '목적에 부적합']
    });
  }
  
  // 최적 시간대
  const hourNames = ['자시(23-01)', '축시(01-03)', '인시(03-05)', '묘시(05-07)', '진시(07-09)', '사시(09-11)', 
                    '오시(11-13)', '미시(13-15)', '신시(15-17)', '유시(17-19)', '술시(19-21)', '해시(21-23)'];
  const hourIndex = (birthYear + birthMonth + birthDay) % 12;
  bestTimes.push(hourNames[hourIndex]);
  bestTimes.push(hourNames[(hourIndex + 6) % 12]);
  
  // 택일 조언
  dateAdvice.push(purposeAdvice[purpose] || '선택하신 목적에 맞는 좋은 날짜입니다.');
  dateAdvice.push('사주와 조화를 이루는 날짜를 선택하셨습니다.');
  dateAdvice.push('적절한 시간대를 활용하시면 더욱 좋은 결과를 얻을 수 있습니다.');
  
  return {
    topDates,
    avoidDates,
    bestTimes,
    dateAdvice,
    analysis: `${birthYear}년 ${birthMonth}월 ${birthDay}일 사주를 기반으로 한 택일 분석 결과입니다.`
  };
}

// 종합 분석
async function getComprehensiveAnalysis() {
  console.log('🔮 종합 분석 시작');
  
  // 현재 사용자 정보로 기본 데이터 생성
  const data = currentUser ? {
    birthYear: parseInt(currentUser.birthYear || currentUser.birth_year),
    birthMonth: parseInt(currentUser.birthMonth || currentUser.birth_month),
    birthDay: parseInt(currentUser.birthDay || currentUser.birth_day),
    birthHour: parseInt(currentUser.birthHour || currentUser.birth_hour || 0),
    phoneNumber: '',
    carNumber: '',
    personalNumber: ''
  } : {
    birthYear: 1990,
    birthMonth: 5,
    birthDay: 15,
    birthHour: 0,
    phoneNumber: '',
    carNumber: '',
    personalNumber: ''
  };

  // 자동 분석 결과 즉시 표시
  const basicResult = generateBasicComprehensiveAnalysis(data);
  displayAutoComprehensiveResult(basicResult);
  
  // API 호출 (백그라운드에서)
  try {
    const response = await fetch('/api/numerology/comprehensive-analysis', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) {
      displayComprehensiveResult(result.data);
    }
  } catch (error) {
    console.error('종합 분석 오류:', error);
  }
}

// 자동 종합 분석 결과 표시
function displayAutoComprehensiveResult(data) {
  const resultSection = document.getElementById('autoComprehensiveResult');
  
  if (resultSection) {
    // 전체 운세 점수
    const overallScore = document.getElementById('autoOverallScore');
    if (overallScore) {
      overallScore.innerHTML = `<span class="score-number">${data.overallScore}점</span>`;
    }
    
    // 숫자별 운세
    const numberFortune = document.getElementById('autoNumberFortune');
    if (numberFortune) {
      numberFortune.innerHTML = `
        <div class="fortune-item">
          <span class="fortune-label">전화번호:</span>
          <span class="fortune-value">${data.phoneFortune}</span>
        </div>
        <div class="fortune-item">
          <span class="fortune-label">차량번호:</span>
          <span class="fortune-value">${data.carFortune}</span>
        </div>
        <div class="fortune-item">
          <span class="fortune-label">개인숫자:</span>
          <span class="fortune-value">${data.personalFortune}</span>
        </div>
      `;
    }
    
    // 최적 시기
    const bestTiming = document.getElementById('autoBestTiming');
    if (bestTiming) {
      bestTiming.innerHTML = `<p class="timing-text">${data.futureFortune}</p>`;
    }
    
    // 개선 방안
    const improvement = document.getElementById('autoImprovement');
    if (improvement) {
      improvement.innerHTML = `<p class="improvement-text">${data.overallAdvice}</p>`;
    }
    
    // 길한 요소
    const luckyElements = document.getElementById('autoLuckyElements');
    if (luckyElements) {
      luckyElements.innerHTML = `<p class="lucky-text">길한 숫자와 색상을 활용하여 운세를 개선하세요.</p>`;
    }
    
    // 주의사항
    const warnings = document.getElementById('autoWarnings');
    if (warnings) {
      warnings.innerHTML = `<p class="warning-text">분석 결과는 참고용이며, 실제 행동에 신중함을 기하세요.</p>`;
    }
    
    resultSection.style.display = 'block';
    console.log('✅ 자동 종합 분석 결과 표시 완료');
  }
}

// 데모 결과 표시 함수들
function showLuckyNumbersDemo() {
  console.log('⭐ 길한 숫자 데모 시작');
  const data = {
    birthYear: 1990,
    birthMonth: 5,
    birthDay: 15
  };
  const result = generateBasicLuckyNumbers(data);
  console.log('길한 숫자 결과:', result);
  displayAutoLuckyNumbersResult(result);
}

function showPhoneAnalysisDemo() {
  const resultSection = document.getElementById('phoneAnalysisResult');
  if (resultSection) {
    const scoreElement = document.getElementById('phoneScore');
    const gradeElement = document.getElementById('phoneGrade');
    const recommendationElement = document.getElementById('phoneRecommendation');
    const digitAnalysisElement = document.getElementById('phoneDigitAnalysis');
    
    if (scoreElement) {
      scoreElement.innerHTML = `<span class="score-number">85점</span>`;
    }
    
    if (gradeElement) {
      gradeElement.innerHTML = `<span class="grade-text">A+</span>`;
    }
    
    if (recommendationElement) {
      recommendationElement.innerHTML = `<p class="recommendation-text">매우 길한 전화번호입니다. 좋은 인연과 소통이 많을 것입니다.</p>`;
    }
    
    if (digitAnalysisElement) {
      digitAnalysisElement.innerHTML = `
        <div class="digit-item good">0</div>
        <div class="digit-item good">1</div>
        <div class="digit-item neutral">0</div>
        <div class="digit-item good">1</div>
        <div class="digit-item good">2</div>
        <div class="digit-item neutral">3</div>
        <div class="digit-item good">4</div>
        <div class="digit-item good">5</div>
        <div class="digit-item neutral">6</div>
        <div class="digit-item good">7</div>
        <div class="digit-item good">8</div>
      `;
    }
    
    resultSection.style.display = 'block';
    console.log('✅ 전화번호 분석 데모 결과 표시 완료');
  }
}

function showCarAnalysisDemo() {
  const resultSection = document.getElementById('carAnalysisResult');
  if (resultSection) {
    const scoreElement = document.getElementById('carScore');
    const gradeElement = document.getElementById('carGrade');
    const recommendationElement = document.getElementById('carRecommendation');
    const digitAnalysisElement = document.getElementById('carDigitAnalysis');
    
    if (scoreElement) {
      scoreElement.innerHTML = `<span class="score-number">78점</span>`;
    }
    
    if (gradeElement) {
      gradeElement.innerHTML = `<span class="grade-text">A</span>`;
    }
    
    if (recommendationElement) {
      recommendationElement.innerHTML = `<p class="recommendation-text">안전한 차량번호입니다. 평온한 운전과 여행이 가능합니다.</p>`;
    }
    
    if (digitAnalysisElement) {
      digitAnalysisElement.innerHTML = `
        <div class="digit-item good">1</div>
        <div class="digit-item good">2</div>
        <div class="digit-item neutral">3</div>
        <div class="digit-item good">4</div>
        <div class="digit-item good">5</div>
        <div class="digit-item neutral">6</div>
      `;
    }
    
    resultSection.style.display = 'block';
    console.log('✅ 차량번호 분석 데모 결과 표시 완료');
  }
}

function showPersonalNumberDemo() {
  const resultSection = document.getElementById('personalNumberResult');
  if (resultSection) {
    const recommendedNumbers = document.getElementById('recommendedNumbers');
    const numberFortune = document.getElementById('numberFortune');
    const bestTiming = document.getElementById('bestTiming');
    const usageAdvice = document.getElementById('usageAdvice');
    
    if (recommendedNumbers) {
      recommendedNumbers.innerHTML = `
        <div class="recommended-number">7</div>
        <div class="recommended-number">3</div>
        <div class="recommended-number">9</div>
        <div class="recommended-number">1</div>
        <div class="recommended-number">5</div>
      `;
    }
    
    if (numberFortune) {
      numberFortune.innerHTML = `<p class="fortune-text">사주 기반으로 매우 길한 숫자들입니다. 개인적 성공과 행운을 가져올 것입니다.</p>`;
    }
    
    if (bestTiming) {
      bestTiming.innerHTML = `<p class="timing-text">월요일과 목요일 오전 시간대가 가장 좋습니다.</p>`;
    }
    
    if (usageAdvice) {
      usageAdvice.innerHTML = `<p class="advice-text">로또나 복권 구매 시 이 숫자들을 활용하시면 좋은 결과를 얻을 수 있습니다.</p>`;
    }
    
    resultSection.style.display = 'block';
    console.log('✅ 개인숫자 분석 데모 결과 표시 완료');
  }
}

function showDateSelectionDemo() {
  const resultSection = document.getElementById('dateSelectionResult');
  if (resultSection) {
    const resultGrid = resultSection.querySelector('.result-grid');
    if (resultGrid) {
      resultGrid.innerHTML = `
        <div class="result-card">
          <h5><i class="fas fa-calendar-check"></i> 최적 날짜</h5>
          <div class="date-list">
            <div class="date-item good">2024년 3월 15일 (금요일)</div>
            <div class="date-item good">2024년 3월 22일 (금요일)</div>
            <div class="date-item good">2024년 3월 29일 (금요일)</div>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-clock"></i> 최적 시간</h5>
          <div class="time-list">
            <div class="time-item good">오전 9시 - 11시</div>
            <div class="time-item good">오후 2시 - 4시</div>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-lightbulb"></i> 조언</h5>
          <div class="advice-content">
            <p>금요일은 사주에 매우 길한 요일입니다. 중요한 일정은 이 날짜들을 활용하시기 바랍니다.</p>
          </div>
        </div>
      `;
    }
    
    resultSection.style.display = 'block';
    console.log('✅ 택일 서비스 데모 결과 표시 완료');
  }
}

function showComprehensiveDemo() {
  const data = {
    birthYear: 1990,
    birthMonth: 5,
    birthDay: 15,
    phoneNumber: '01012345678',
    carNumber: '123456',
    personalNumber: '789'
  };
  const result = generateBasicComprehensiveAnalysis(data);
  displayAutoComprehensiveResult(result);
}

// 강제 결과 표시 함수들
function forceShowLuckyNumbers() {
  const resultSection = document.getElementById('autoLuckyNumbersResult');
  if (resultSection) {
    resultSection.innerHTML = `
      <h4>🎯 사주 기반 길한 숫자 분석 결과</h4>
      <div class="result-grid">
        <div class="result-card">
          <h5><i class="fas fa-star"></i> 길한 숫자</h5>
          <div class="number-list">
            <span class="lucky-number">1</span>
            <span class="lucky-number">2</span>
            <span class="lucky-number">9</span>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-calendar"></i> 최적 요일</h5>
          <div class="day-list">
            <span class="lucky-day">월요일</span>
            <span class="lucky-day">목요일</span>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-clock"></i> 길한 시간대</h5>
          <div class="hour-list">
            <span class="lucky-hour">자시(23-01)</span>
            <span class="lucky-hour">오시(11-13)</span>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-palette"></i> 길한 색상</h5>
          <div class="color-list">
            <span class="lucky-color">빨간색(화)</span>
            <span class="lucky-color">노란색(토)</span>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-compass"></i> 길한 방향</h5>
          <div class="direction-list">
            <span class="lucky-direction">동쪽(진)</span>
            <span class="lucky-direction">서쪽(태)</span>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-gem"></i> 길한 보석</h5>
          <div class="stone-list">
            <span class="lucky-stone">루비(화)</span>
            <span class="lucky-stone">다이아몬드(금)</span>
          </div>
        </div>
      </div>
    `;
    resultSection.style.display = 'block';
    console.log('✅ 길한 숫자 강제 표시 완료');
  }
}

function forceShowPhoneAnalysis() {
  const resultSection = document.getElementById('phoneAnalysisResult');
  if (resultSection) {
    resultSection.innerHTML = `
      <h4>📱 전화번호 분석 결과</h4>
      <div class="result-grid">
        <div class="result-card">
          <h5><i class="fas fa-star"></i> 전체 점수</h5>
          <div class="score-display">
            <span class="score-number">85점</span>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-chart-line"></i> 등급</h5>
          <div class="grade-display">
            <span class="grade-text">A+</span>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-lightbulb"></i> 추천사항</h5>
          <div class="recommendation-display">
            <p class="recommendation-text">매우 길한 전화번호입니다. 좋은 인연과 소통이 많을 것입니다.</p>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-list"></i> 숫자별 분석</h5>
          <div class="digit-analysis">
            <div class="digit-item good">0</div>
            <div class="digit-item good">1</div>
            <div class="digit-item neutral">0</div>
            <div class="digit-item good">1</div>
            <div class="digit-item good">2</div>
            <div class="digit-item neutral">3</div>
            <div class="digit-item good">4</div>
            <div class="digit-item good">5</div>
            <div class="digit-item neutral">6</div>
            <div class="digit-item good">7</div>
            <div class="digit-item good">8</div>
          </div>
        </div>
      </div>
    `;
    resultSection.style.display = 'block';
    console.log('✅ 전화번호 분석 강제 표시 완료');
  }
}

function forceShowCarAnalysis() {
  console.log('🚗 forceShowCarAnalysis 함수 시작');
  const resultSection = document.getElementById('carAnalysisResult');
  console.log('🔍 carAnalysisResult 요소 찾기:', resultSection);
  
  if (resultSection) {
    console.log('✅ carAnalysisResult 요소 발견, HTML 삽입 시작');
    resultSection.innerHTML = `
      <h4>🚗 차량번호 분석 결과</h4>
      <div class="result-grid">
        <div class="result-card">
          <h5><i class="fas fa-star"></i> 전체 점수</h5>
          <div class="score-display">
            <span class="score-number">78점</span>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-chart-line"></i> 등급</h5>
          <div class="grade-display">
            <span class="grade-text">A</span>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-lightbulb"></i> 추천사항</h5>
          <div class="recommendation-display">
            <p class="recommendation-text">안전한 차량번호입니다. 평온한 운전과 여행이 가능합니다.</p>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-list"></i> 숫자별 분석</h5>
          <div class="digit-analysis">
            <div class="digit-item good">1</div>
            <div class="digit-item good">2</div>
            <div class="digit-item neutral">3</div>
            <div class="digit-item good">4</div>
            <div class="digit-item good">5</div>
            <div class="digit-item neutral">6</div>
          </div>
        </div>
      </div>
    `;
    resultSection.style.display = 'block';
    console.log('✅ 차량번호 분석 강제 표시 완료');
  } else {
    console.error('❌ carAnalysisResult 요소를 찾을 수 없음');
  }
}

function forceShowPersonalNumber() {
  const resultSection = document.getElementById('personalNumberResult');
  if (resultSection) {
    resultSection.innerHTML = `
      <h4>🎯 개인 맞춤 행운 숫자 분석 결과</h4>
      <div class="result-grid">
        <div class="result-card">
          <h5><i class="fas fa-star"></i> 추천 행운 숫자</h5>
          <div class="recommended-numbers">
            <div class="recommended-number">7</div>
            <div class="recommended-number">3</div>
            <div class="recommended-number">9</div>
            <div class="recommended-number">1</div>
            <div class="recommended-number">5</div>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-chart-line"></i> 숫자별 길흉도</h5>
          <div class="number-fortune">
            <p class="fortune-text">사주 기반으로 매우 길한 숫자들입니다. 개인적 성공과 행운을 가져올 것입니다.</p>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-calendar"></i> 최적 사용 시기</h5>
          <div class="best-timing">
            <p class="timing-text">월요일과 목요일 오전 시간대가 가장 좋습니다.</p>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-lightbulb"></i> 활용 조언</h5>
          <div class="usage-advice">
            <p class="advice-text">로또나 복권 구매 시 이 숫자들을 활용하시면 좋은 결과를 얻을 수 있습니다.</p>
          </div>
        </div>
      </div>
    `;
    resultSection.style.display = 'block';
    console.log('✅ 개인숫자 분석 강제 표시 완료');
  }
}

function forceShowDateSelection() {
  const resultSection = document.getElementById('dateSelectionResult');
  if (resultSection) {
    resultSection.innerHTML = `
      <h4>📅 택일 서비스 결과</h4>
      <div class="result-grid">
        <div class="result-card">
          <h5><i class="fas fa-calendar-check"></i> 최적 날짜</h5>
          <div class="date-list">
            <div class="date-item good">2024년 3월 15일 (금요일)</div>
            <div class="date-item good">2024년 3월 22일 (금요일)</div>
            <div class="date-item good">2024년 3월 29일 (금요일)</div>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-clock"></i> 최적 시간</h5>
          <div class="time-list">
            <div class="time-item good">오전 9시 - 11시</div>
            <div class="time-item good">오후 2시 - 4시</div>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-lightbulb"></i> 조언</h5>
          <div class="advice-content">
            <p>금요일은 사주에 매우 길한 요일입니다. 중요한 일정은 이 날짜들을 활용하시기 바랍니다.</p>
          </div>
        </div>
      </div>
    `;
    resultSection.style.display = 'block';
    console.log('✅ 택일 서비스 강제 표시 완료');
  }
}

function forceShowComprehensive() {
  const resultSection = document.getElementById('autoComprehensiveResult');
  if (resultSection) {
    resultSection.innerHTML = `
      <h4>🔮 종합 운세 분석 결과</h4>
      <div class="result-grid">
        <div class="result-card">
          <h5><i class="fas fa-star"></i> 전체 운세 점수</h5>
          <div class="overall-score">
            <span class="score-number">85점</span>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-chart-line"></i> 숫자별 운세</h5>
          <div class="number-fortune">
            <div class="fortune-item">
              <span class="fortune-label">전화번호:</span>
              <span class="fortune-value">매우 길한 전화번호입니다. 좋은 인연과 소통이 많을 것입니다.</span>
            </div>
            <div class="fortune-item">
              <span class="fortune-label">차량번호:</span>
              <span class="fortune-value">안전한 차량번호입니다. 평온한 운전과 여행이 가능합니다.</span>
            </div>
            <div class="fortune-item">
              <span class="fortune-label">개인숫자:</span>
              <span class="fortune-value">매우 길한 개인숫자입니다. 개인적 성공과 행운이 많을 것입니다.</span>
            </div>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-calendar"></i> 최적 시기</h5>
          <div class="best-timing">
            <p class="timing-text">2024년 3월과 4월이 가장 좋은 시기입니다. 특히 금요일과 월요일이 길합니다.</p>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-lightbulb"></i> 개선 방안</h5>
          <div class="improvement">
            <p class="improvement-text">길한 숫자 1, 2, 9를 활용하고, 빨간색과 노란색을 자주 사용하시면 운세가 더욱 좋아집니다.</p>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-gem"></i> 길한 요소</h5>
          <div class="lucky-elements">
            <p class="lucky-text">길한 숫자와 색상을 활용하여 운세를 개선하세요.</p>
          </div>
        </div>
        <div class="result-card">
          <h5><i class="fas fa-exclamation-triangle"></i> 주의사항</h5>
          <div class="warnings">
            <p class="warning-text">분석 결과는 참고용이며, 실제 행동에 신중함을 기하세요.</p>
          </div>
        </div>
      </div>
    `;
    resultSection.style.display = 'block';
    console.log('✅ 종합 분석 강제 표시 완료');
  }
}

// 모달 팝업 함수들
function showResultModal(title, content) {
  const modal = document.getElementById('resultModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  modalTitle.textContent = title;
  modalBody.innerHTML = content;
  modal.style.display = 'block';
  
  console.log('✅ 모달 팝업 표시:', title);
}

function closeModal() {
  const modal = document.getElementById('resultModal');
  modal.style.display = 'none';
  console.log('✅ 모달 팝업 닫기');
}

// 길한 숫자 계산 함수
function calculateLuckyNumbers(user) {
  if (!user) {
    return [1, 2, 9]; // 기본값
  }
  
  const birthYear = parseInt(user.birthYear || user.birth_year);
  const birthMonth = parseInt(user.birthMonth || user.birth_month);
  const birthDay = parseInt(user.birthDay || user.birth_day);
  const birthHour = parseInt(user.birthHour || user.birth_hour || 0);
  
  // 생년월일시를 이용한 길한 숫자 계산 (간단한 알고리즘)
  const yearSum = (birthYear % 9) || 9;
  const monthSum = (birthMonth % 9) || 9;
  const daySum = (birthDay % 9) || 9;
  const hourSum = (birthHour % 9) || 9;
  
  // 길한 숫자 계산 (1-9 중에서 선택)
  const luckyNumbers = [];
  
  // 기본 길한 숫자들
  luckyNumbers.push(yearSum);
  luckyNumbers.push(monthSum);
  luckyNumbers.push(daySum);
  
  // 중복 제거 및 정렬
  const uniqueNumbers = [...new Set(luckyNumbers)].sort((a, b) => a - b);
  
  // 최소 3개, 최대 5개 숫자 반환
  if (uniqueNumbers.length < 3) {
    uniqueNumbers.push(hourSum);
    if (uniqueNumbers.length < 3) {
      uniqueNumbers.push(5); // 기본 길한 숫자
    }
  }
  
  return uniqueNumbers.slice(0, 5);
}

// 개인숫자 계산 함수
function calculatePersonalNumbers(user) {
  if (!user) {
    return [7, 14, 21, 28]; // 기본값
  }
  
  const birthYear = parseInt(user.birthYear || user.birth_year);
  const birthMonth = parseInt(user.birthMonth || user.birth_month);
  const birthDay = parseInt(user.birthDay || user.birth_day);
  const birthHour = parseInt(user.birthHour || user.birth_hour || 0);
  
  // 생년월일시를 이용한 개인숫자 계산
  const personalNumbers = [];
  
  // 기본 개인숫자들 (생년월일시 기반)
  personalNumbers.push((birthYear % 30) + 1); // 1-30 범위
  personalNumbers.push((birthMonth * 2) % 30 + 1); // 1-30 범위
  personalNumbers.push((birthDay * 3) % 30 + 1); // 1-30 범위
  personalNumbers.push((birthHour * 4) % 30 + 1); // 1-30 범위
  
  // 중복 제거 및 정렬
  const uniqueNumbers = [...new Set(personalNumbers)].sort((a, b) => a - b);
  
  return uniqueNumbers.slice(0, 4);
}

// 최적 요일 계산 함수
function calculateOptimalDays(user) {
  if (!user) {
    return ['월요일', '목요일']; // 기본값
  }
  
  const birthYear = parseInt(user.birthYear || user.birth_year);
  const birthMonth = parseInt(user.birthMonth || user.birth_month);
  const birthDay = parseInt(user.birthDay || user.birth_day);
  
  // 생년월일을 이용한 최적 요일 계산
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  
  // 간단한 알고리즘으로 최적 요일 계산
  const dayIndex1 = (birthYear + birthMonth) % 7;
  const dayIndex2 = (birthMonth + birthDay) % 7;
  
  const optimalDays = [];
  optimalDays.push(days[dayIndex1]);
  if (dayIndex1 !== dayIndex2) {
    optimalDays.push(days[dayIndex2]);
  } else {
    optimalDays.push(days[(dayIndex1 + 1) % 7]);
  }
  
  return optimalDays;
}

// 모달 팝업 함수들
function showLuckyNumbersModal(user = null) {
  // 사용자 정보 가져오기 (매개변수 우선, 없으면 currentUser 사용)
  const userToUse = user || currentUser;
  const userInfo = userToUse ? `(${userToUse.birthYear || userToUse.birth_year}년 ${userToUse.birthMonth || userToUse.birth_month}월 ${userToUse.birthDay || userToUse.birth_day}일)` : '';
  
  // 사용자 생년월일에 기반한 길한 숫자 계산
  const luckyNumbers = calculateLuckyNumbers(userToUse);
  const optimalDays = calculateOptimalDays(userToUse);
  
  const content = `
    <div style="margin-bottom: 20px; padding: 15px; background: rgba(255, 215, 0, 0.1); border-radius: 10px; border: 1px solid rgba(255, 215, 0, 0.3);">
      <h4 style="color: #ffd700; margin: 0;">🔮 사주 기반 길한 숫자 분석 ${userInfo}</h4>
    </div>
    
    <div class="modal-result-grid">
      <div class="modal-result-card">
        <h5><i class="fas fa-star"></i> 길한 숫자</h5>
        <div class="modal-number-list">
          ${luckyNumbers.map(num => `<span class="modal-number-item">${num}</span>`).join('')}
        </div>
        <p style="color: #ffd700; font-size: 0.9rem; margin-top: 10px;">사주에 길한 숫자들입니다</p>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-calendar"></i> 최적 요일</h5>
        <div class="modal-number-list">
          ${optimalDays.map(day => `<span class="modal-number-item">${day}</span>`).join('')}
        </div>
        <p style="color: #ffd700; font-size: 0.9rem; margin-top: 10px;">이 요일들이 가장 길합니다</p>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-clock"></i> 길한 시간대</h5>
        <div class="modal-number-list">
          <span class="modal-number-item">자시(23-01)</span>
          <span class="modal-number-item">오시(11-13)</span>
        </div>
        <p style="color: #ffd700; font-size: 0.9rem; margin-top: 10px;">이 시간대가 가장 좋습니다</p>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-palette"></i> 길한 색상</h5>
        <div class="modal-number-list">
          <span class="modal-number-item">빨간색(화)</span>
          <span class="modal-number-item">노란색(토)</span>
        </div>
        <p style="color: #ffd700; font-size: 0.9rem; margin-top: 10px;">이 색상들이 길합니다</p>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-compass"></i> 길한 방향</h5>
        <div class="modal-number-list">
          <span class="modal-number-item">동쪽(진)</span>
          <span class="modal-number-item">서쪽(태)</span>
        </div>
        <p style="color: #ffd700; font-size: 0.9rem; margin-top: 10px;">이 방향들이 길합니다</p>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-gem"></i> 길한 보석</h5>
        <div class="modal-number-list">
          <span class="modal-number-item">루비(화)</span>
          <span class="modal-number-item">다이아몬드(금)</span>
        </div>
        <p style="color: #ffd700; font-size: 0.9rem; margin-top: 10px;">이 보석들이 길합니다</p>
      </div>
    </div>
    
    <div style="margin-top: 20px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; border: 1px solid rgba(46, 204, 113, 0.3);">
      <h5 style="color: #2ecc71; margin: 0 0 10px 0;"><i class="fas fa-lightbulb"></i> 활용 조언</h5>
      <p style="color: white; line-height: 1.6; margin: 0;">
        💡 이 길한 숫자들을 로또, 복권, 행운번호 등에 활용하시면 좋은 결과를 얻을 수 있습니다.<br>
        💡 길한 요일과 시간대에 중요한 일정을 잡으시면 더욱 좋습니다.<br>
        💡 길한 색상과 보석을 활용하여 운세를 개선할 수 있습니다.
      </p>
    </div>
  `;
  showResultModal('⭐ 길한 숫자 분석 결과', content);
}

function showPhoneAnalysisModal(user = null) {
  const userToUse = user || currentUser;
  const userInfo = userToUse ? `(${userToUse.birthYear || userToUse.birth_year}년 ${userToUse.birthMonth || userToUse.birth_month}월 ${userToUse.birthDay || userToUse.birth_day}일)` : '';
  
  // 전화번호 입력 폼 표시
  const content = `
    <div style="margin-bottom: 20px; padding: 15px; background: rgba(255, 215, 0, 0.1); border-radius: 10px; border: 1px solid rgba(255, 215, 0, 0.3);">
      <h4 style="color: #ffd700; margin: 0;">📱 전화번호 길흉 분석 ${userInfo}</h4>
    </div>
    
          <form id="phoneModalForm" style="margin-bottom: 20px;">
        <div style="margin-bottom: 15px;">
          <label style="color: white; display: block; margin-bottom: 5px;">📱 전화번호 입력</label>
          <input type="text" id="phoneModalNumber" placeholder="전화번호 (하이픈 제외)" 
                 style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: white;">
          <small style="color: rgba(255,255,255,0.7); font-size: 12px;">※ 하이픈(-) 없이 숫자만 입력해주세요 (7-15자리)</small>
        </div>
      <button type="button" onclick="analyzePhoneNumberModal()" 
              style="background: rgba(52, 152, 219, 0.8); color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; width: 100%;">
        🔍 전화번호 분석하기
      </button>
    </form>
    
    <div id="phoneModalResult" style="display: none;">
      <!-- 분석 결과가 여기에 표시됩니다 -->
    </div>
    
    <div style="margin-top: 15px; padding: 10px; background: rgba(255, 193, 7, 0.1); border-radius: 8px; border: 1px solid rgba(255, 193, 7, 0.3);">
      <p style="color: #ffd700; font-size: 14px; margin: 0; text-align: center;">
        💡 <strong>전문가 조언:</strong> 실제 전화번호를 입력하시면 더 정확한 종합분석이 가능합니다.
      </p>
    </div>
  `;
  showResultModal('📱 전화번호 분석', content);
}

// 전화번호 분석 함수 (모달용)
function analyzePhoneNumberModal() {
  const phoneNumber = document.getElementById('phoneModalNumber').value.trim();
  
  if (!phoneNumber) {
    alert('전화번호를 입력해주세요.');
    return;
  }
  
  if (!/^\d{7,15}$/.test(phoneNumber)) {
    alert('올바른 전화번호 형식으로 입력해주세요. (7-15자리 숫자)');
    return;
  }
  
  // 사용자 입력 상태 저장
  userInputStatus.phoneNumber = phoneNumber;
  
  // 분석 결과 생성
  const score = Math.floor(Math.random() * 40) + 60; // 60-99점
  const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : 'C';
  
  const resultContent = `
    <div class="modal-result-grid">
      <div class="modal-result-card">
        <h5><i class="fas fa-star"></i> 전체 점수</h5>
        <div style="font-size: 2rem; color: #ffd700; font-weight: bold;">${score}점</div>
        <p style="color: #2ecc71; font-size: 0.9rem; margin-top: 5px;">${score >= 80 ? '매우 좋은 점수입니다' : score >= 70 ? '좋은 점수입니다' : '보통 점수입니다'}</p>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-chart-line"></i> 등급</h5>
        <div style="font-size: 1.5rem; color: #2ecc71; font-weight: bold;">${grade}</div>
        <p style="color: #2ecc71; font-size: 0.9rem; margin-top: 5px;">${grade === 'A+' ? '최상급 등급입니다' : grade === 'A' ? '상급 등급입니다' : grade === 'B+' ? '중상급 등급입니다' : '보통 등급입니다'}</p>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-lightbulb"></i> 추천사항</h5>
        <p style="color: white; line-height: 1.6;">${score >= 80 ? '매우 길한 전화번호입니다. 좋은 인연과 소통이 많을 것입니다.' : score >= 70 ? '좋은 전화번호입니다. 평온한 소통이 가능합니다.' : '보통의 전화번호입니다. 신중한 사용을 권장합니다.'}</p>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-list"></i> 숫자별 분석</h5>
        <div class="modal-number-list">
          ${phoneNumber.split('').map(digit => `<span class="modal-number-item">${digit}</span>`).join('')}
        </div>
        <p style="color: #ffd700; font-size: 0.9rem; margin-top: 10px;">각 자릿수별 길흉 분석</p>
      </div>
    </div>
    
    <div style="margin-top: 20px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; border: 1px solid rgba(46, 204, 113, 0.3);">
      <h5 style="color: #2ecc71; margin: 0 0 10px 0;"><i class="fas fa-info-circle"></i> 분석 설명</h5>
      <p style="color: white; line-height: 1.6; margin: 0;">
        📞 입력하신 전화번호 <strong>${phoneNumber}</strong> (${phoneNumber.length}자리)의 분석 결과입니다.<br>
        📞 ${score >= 80 ? '사주와 매우 잘 맞는 길한 번호입니다.' : score >= 70 ? '사주와 잘 맞는 번호입니다.' : '사주와 보통의 조화를 보입니다.'}<br>
        📞 ${score >= 80 ? '좋은 인연과 소통이 많을 것이며, 사업이나 업무에도 도움이 됩니다.' : '평온한 소통과 일상이 가능합니다.'}
      </p>
    </div>
  `;
  
  // 폼 숨기고 결과 표시
  document.getElementById('phoneModalForm').style.display = 'none';
  const resultDiv = document.getElementById('phoneModalResult');
  resultDiv.innerHTML = resultContent;
  resultDiv.style.display = 'block';
}

function showCarAnalysisModal(user = null) {
  const userToUse = user || currentUser;
  const userInfo = userToUse ? `(${userToUse.birthYear || userToUse.birth_year}년 ${userToUse.birthMonth || userToUse.birth_month}월 ${userToUse.birthDay || userToUse.birth_day}일)` : '';
  
  // 차량번호 입력 폼 표시
  const content = `
    <div style="margin-bottom: 20px; padding: 15px; background: rgba(255, 215, 0, 0.1); border-radius: 10px; border: 1px solid rgba(255, 215, 0, 0.3);">
      <h4 style="color: #ffd700; margin: 0;">🚗 차량번호 길흉 분석 ${userInfo}</h4>
    </div>
    
    <form id="carModalForm" style="margin-bottom: 20px;">
      <div style="margin-bottom: 15px;">
        <label style="color: white; display: block; margin-bottom: 5px;">🚗 차량번호판 번호</label>
        <input type="text" id="carModalNumber" placeholder="123456 (번호만 입력)" 
               style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: white;">
        <small style="color: rgba(255,255,255,0.7); font-size: 12px;">※ 차량번호판의 숫자 부분만 입력해주세요 (예: 12가3456 → 123456)</small>
      </div>
      <button type="button" onclick="analyzeCarNumberModal()" 
              style="background: rgba(46, 204, 113, 0.8); color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; width: 100%;">
        🔍 차량번호 분석하기
      </button>
    </form>
    
    <div id="carModalResult" style="display: none;">
      <!-- 분석 결과가 여기에 표시됩니다 -->
    </div>
    
    <div style="margin-top: 15px; padding: 10px; background: rgba(255, 193, 7, 0.1); border-radius: 8px; border: 1px solid rgba(255, 193, 7, 0.3);">
      <p style="color: #ffd700; font-size: 14px; margin: 0; text-align: center;">
        💡 <strong>전문가 조언:</strong> 실제 차량번호를 입력하시면 더 정확한 종합분석이 가능합니다.
      </p>
    </div>
  `;
  showResultModal('🚗 차량번호 분석', content);
}

// 차량번호 분석 함수 (모달용)
function analyzeCarNumberModal() {
  const carNumber = document.getElementById('carModalNumber').value.trim();
  
  if (!carNumber) {
    alert('차량번호를 입력해주세요.');
    return;
  }
  
  if (!/^\d{4,6}$/.test(carNumber)) {
    alert('올바른 차량번호 형식으로 입력해주세요. (4-6자리 숫자)');
    return;
  }
  
  // 사용자 입력 상태 저장
  userInputStatus.carNumber = carNumber;
  
  // 분석 결과 생성
  const score = Math.floor(Math.random() * 40) + 60; // 60-99점
  const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : 'C';
  
  const resultContent = `
    <div class="modal-result-grid">
      <div class="modal-result-card">
        <h5><i class="fas fa-star"></i> 전체 점수</h5>
        <div style="font-size: 2rem; color: #ffd700; font-weight: bold;">${score}점</div>
        <p style="color: #2ecc71; font-size: 0.9rem; margin-top: 5px;">${score >= 80 ? '매우 좋은 점수입니다' : score >= 70 ? '좋은 점수입니다' : '보통 점수입니다'}</p>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-chart-line"></i> 등급</h5>
        <div style="font-size: 1.5rem; color: #2ecc71; font-weight: bold;">${grade}</div>
        <p style="color: #2ecc71; font-size: 0.9rem; margin-top: 5px;">${grade === 'A+' ? '최상급 등급입니다' : grade === 'A' ? '상급 등급입니다' : grade === 'B+' ? '중상급 등급입니다' : '보통 등급입니다'}</p>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-lightbulb"></i> 추천사항</h5>
        <p style="color: white; line-height: 1.6;">${score >= 80 ? '매우 안전한 차량번호입니다. 평온한 운전과 여행이 가능합니다.' : score >= 70 ? '안전한 차량번호입니다. 신중한 운전을 권장합니다.' : '보통의 차량번호입니다. 운전 시 주의가 필요합니다.'}</p>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-list"></i> 숫자별 분석</h5>
        <div class="modal-number-list">
          ${carNumber.split('').map(digit => `<span class="modal-number-item">${digit}</span>`).join('')}
        </div>
        <p style="color: #ffd700; font-size: 0.9rem; margin-top: 10px;">각 자릿수별 안전도 분석</p>
      </div>
    </div>
    
    <div style="margin-top: 20px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; border: 1px solid rgba(46, 204, 113, 0.3);">
      <h5 style="color: #2ecc71; margin: 0 0 10px 0;"><i class="fas fa-info-circle"></i> 분석 설명</h5>
      <p style="color: white; line-height: 1.6; margin: 0;">
        🚗 입력하신 차량번호 <strong>${carNumber}</strong>의 분석 결과입니다.<br>
        🚗 ${score >= 80 ? '사주와 매우 잘 맞는 안전한 번호입니다.' : score >= 70 ? '사주와 잘 맞는 번호입니다.' : '사주와 보통의 조화를 보입니다.'}<br>
        🚗 ${score >= 80 ? '안전한 운전과 평온한 여행이 가능하며, 사고 위험이 낮습니다.' : '신중한 운전을 권장하며, 주의가 필요합니다.'}
      </p>
    </div>
  `;
  
  // 폼 숨기고 결과 표시
  document.getElementById('carModalForm').style.display = 'none';
  const resultDiv = document.getElementById('carModalResult');
  resultDiv.innerHTML = resultContent;
  resultDiv.style.display = 'block';
}

function showPersonalNumberModal(user = null) {
  const userToUse = user || currentUser;
  const userInfo = userToUse ? `(${userToUse.birthYear || userToUse.birth_year}년 ${userToUse.birthMonth || userToUse.birth_month}월 ${userToUse.birthDay || userToUse.birth_day}일)` : '';
  
  // 사용자별 개인숫자 계산
  const personalNumbers = calculatePersonalNumbers(userToUse);
  
  const content = `
    <div style="margin-bottom: 20px; padding: 15px; background: rgba(255, 215, 0, 0.1); border-radius: 10px; border: 1px solid rgba(255, 215, 0, 0.3);">
      <h4 style="color: #ffd700; margin: 0;">👤 개인숫자 분석 ${userInfo}</h4>
    </div>
    <div class="modal-result-grid">
      <div class="modal-result-card">
        <h5><i class="fas fa-star"></i> 추천 행운 숫자</h5>
        <div class="modal-number-list">
          ${personalNumbers.map(num => `<span class="modal-number-item">${num}</span>`).join('')}
        </div>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-chart-line"></i> 숫자별 길흉도</h5>
        <p style="color: white; line-height: 1.6;">사주 기반으로 매우 길한 숫자들입니다. 개인적 성공과 행운을 가져올 것입니다.</p>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-calendar"></i> 최적 사용 시기</h5>
        <p style="color: white; line-height: 1.6;">월요일과 목요일 오전 시간대가 가장 좋습니다.</p>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-lightbulb"></i> 활용 조언</h5>
        <p style="color: white; line-height: 1.6;">로또나 복권 구매 시 이 숫자들을 활용하시면 좋은 결과를 얻을 수 있습니다.</p>
      </div>
    </div>
  `;
  showResultModal('👤 개인숫자 분석 결과', content);
}

function showDateSelectionModal(user = null) {
  const userToUse = user || currentUser;
  const userInfo = userToUse ? `(${userToUse.birthYear || userToUse.birth_year}년 ${userToUse.birthMonth || userToUse.birth_month}월 ${userToUse.birthDay || userToUse.birth_day}일)` : '';
  
  // 택일 서비스 입력 폼 표시
  const content = `
    <div style="margin-bottom: 20px; padding: 15px; background: rgba(255, 215, 0, 0.1); border-radius: 10px; border: 1px solid rgba(255, 215, 0, 0.3);">
      <h4 style="color: #ffd700; margin: 0;">📅 택일 서비스 ${userInfo}</h4>
    </div>
    
    <form id="dateModalForm" style="margin-bottom: 20px;">
      <div style="margin-bottom: 15px;">
        <label style="color: white; display: block; margin-bottom: 5px;">🎯 목적 선택</label>
        <select id="dateModalPurpose" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: white;">
          <option value="">목적을 선택해주세요</option>
          <option value="meeting">📞 미팅/회의</option>
          <option value="contract">📋 계약/사업</option>
          <option value="moving">🏠 이사/입주</option>
          <option value="wedding">💒 결혼/행사</option>
          <option value="business">💼 사업 시작</option>
          <option value="travel">✈️ 여행/출장</option>
          <option value="medical">🏥 병원/치료</option>
          <option value="education">📚 교육/학습</option>
          <option value="investment">💰 투자/재테크</option>
          <option value="relationship">💕 인연/연애</option>
        </select>
      </div>
      <div style="margin-bottom: 15px;">
        <label style="color: white; display: block; margin-bottom: 5px;">📅 분석 유형</label>
        <select id="dateModalType" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: white;">
          <option value="recommend">📅 좋은 날 추천 (현재 날짜 기준)</option>
          <option value="check">🔍 특정 날짜 분석</option>
        </select>
      </div>
      <div id="dateModalRecommendOptions" style="margin-bottom: 15px;">
        <label style="color: white; display: block; margin-bottom: 5px;">📆 기간 선택</label>
        <select id="dateModalPeriod" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: white;">
          <option value="7">1주일 (7일)</option>
          <option value="14">2주일 (14일)</option>
          <option value="30">1개월 (30일)</option>
          <option value="60">2개월 (60일)</option>
        </select>
      </div>
      <div id="dateModalCheckOptions" style="margin-bottom: 15px; display: none;">
        <label style="color: white; display: block; margin-bottom: 5px;">🔍 분석할 날짜</label>
        <input type="date" id="dateModalCheckDate" 
               style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: white;">
      </div>
      <button type="button" onclick="analyzeDateSelectionModal()" 
              style="background: rgba(231, 76, 60, 0.8); color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; width: 100%;">
        🔍 택일 분석하기
      </button>
    </form>
    
    <div id="dateModalResult" style="display: none;">
      <!-- 분석 결과가 여기에 표시됩니다 -->
    </div>
  `;
  showResultModal('📅 택일 서비스', content);
  
  // 분석 유형 변경 이벤트
  setTimeout(() => {
    const dateTypeSelect = document.getElementById('dateModalType');
    if (dateTypeSelect) {
      dateTypeSelect.addEventListener('change', function() {
        const recommendOptions = document.getElementById('dateModalRecommendOptions');
        const checkOptions = document.getElementById('dateModalCheckOptions');
        
        if (this.value === 'recommend') {
          recommendOptions.style.display = 'block';
          checkOptions.style.display = 'none';
        } else if (this.value === 'check') {
          recommendOptions.style.display = 'none';
          checkOptions.style.display = 'block';
        }
      });
    }
  }, 100);
}

// 택일 분석 함수 (모달용)
function analyzeDateSelectionModal() {
  const purpose = document.getElementById('dateModalPurpose').value;
  const dateType = document.getElementById('dateModalType').value;
  
  if (!purpose) {
    alert('목적을 선택해주세요.');
    return;
  }
  
  // 사용자 입력 상태 저장
  userInputStatus.dateSelection = { purpose, dateType };
  
  if (dateType === 'check') {
    const checkDate = document.getElementById('dateModalCheckDate').value;
    if (!checkDate) {
      alert('분석할 날짜를 선택해주세요.');
      return;
    }
    userInputStatus.dateSelection.checkDate = checkDate;
    analyzeSpecificDate(purpose, checkDate);
  } else {
    const period = document.getElementById('dateModalPeriod').value;
    userInputStatus.dateSelection.period = period;
    recommendGoodDates(purpose, period);
  }
}

// 특정 날짜 분석
function analyzeSpecificDate(purpose, date) {
  const score = Math.floor(Math.random() * 40) + 60; // 60-99점
  const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : 'C';
  const dateObj = new Date(date);
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()];
  
  const resultContent = `
    <div class="modal-result-grid">
      <div class="modal-result-card">
        <h5><i class="fas fa-calendar-check"></i> 날짜 분석</h5>
        <div style="font-size: 1.5rem; color: #ffd700; font-weight: bold;">${date} (${dayOfWeek}요일)</div>
        <p style="color: #2ecc71; font-size: 0.9rem; margin-top: 5px;">${score >= 80 ? '매우 좋은 날입니다' : score >= 70 ? '좋은 날입니다' : '보통의 날입니다'}</p>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-star"></i> 길흉 점수</h5>
        <div style="font-size: 2rem; color: #ffd700; font-weight: bold;">${score}점</div>
        <p style="color: #2ecc71; font-size: 0.9rem; margin-top: 5px;">${grade} 등급</p>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-lightbulb"></i> 추천사항</h5>
        <p style="color: white; line-height: 1.6;">${score >= 80 ? '이 날짜는 매우 길한 날입니다. 중요한 일정을 잡기에 좋습니다.' : score >= 70 ? '이 날짜는 좋은 날입니다. 일정을 잡기에 적합합니다.' : '이 날짜는 보통의 날입니다. 신중한 판단이 필요합니다.'}</p>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-clock"></i> 최적 시간</h5>
        <div style="color: white; line-height: 1.6;">
          <div style="margin-bottom: 5px;">• 오전 9시 - 11시</div>
          <div style="margin-bottom: 5px;">• 오후 2시 - 4시</div>
        </div>
      </div>
    </div>
    
    <div style="margin-top: 20px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; border: 1px solid rgba(46, 204, 113, 0.3);">
      <h5 style="color: #2ecc71; margin: 0 0 10px 0;"><i class="fas fa-info-circle"></i> 분석 설명</h5>
      <p style="color: white; line-height: 1.6; margin: 0;">
        📅 ${date} (${dayOfWeek}요일)은 ${purpose} 목적으로 ${score >= 80 ? '매우 길한 날입니다.' : score >= 70 ? '좋은 날입니다.' : '보통의 날입니다.'}<br>
        📅 ${score >= 80 ? '이 날짜에 중요한 일정을 잡으시면 좋은 결과를 얻을 수 있습니다.' : score >= 70 ? '이 날짜에 일정을 잡으시면 평온한 진행이 가능합니다.' : '이 날짜는 신중한 판단이 필요한 날입니다.'}
      </p>
    </div>
  `;
  
  // 폼 숨기고 결과 표시
  document.getElementById('dateModalForm').style.display = 'none';
  const resultDiv = document.getElementById('dateModalResult');
  resultDiv.innerHTML = resultContent;
  resultDiv.style.display = 'block';
}

// 좋은 날 추천
function recommendGoodDates(purpose, period) {
  const today = new Date();
  const goodDates = [];
  const periodDays = parseInt(period);
  
  // 좋은 날짜들 생성 (랜덤)
  for (let i = 0; i < 5; i++) {
    const randomDays = Math.floor(Math.random() * periodDays) + 1;
    const date = new Date(today);
    date.setDate(today.getDate() + randomDays);
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    const score = Math.floor(Math.random() * 20) + 80; // 80-99점
    goodDates.push({
      date: date.toISOString().split('T')[0],
      dayOfWeek: dayOfWeek,
      score: score
    });
  }
  
  // 점수순으로 정렬
  goodDates.sort((a, b) => b.score - a.score);
  
  const resultContent = `
    <div class="modal-result-grid">
      <div class="modal-result-card">
        <h5><i class="fas fa-calendar-check"></i> 추천 날짜</h5>
        <div style="color: white; line-height: 1.6;">
          ${goodDates.map((date, index) => 
            `<div style="margin-bottom: 10px; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 5px;">
              <strong>${index + 1}. ${date.date} (${date.dayOfWeek}요일)</strong> - ${date.score}점
            </div>`
          ).join('')}
        </div>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-clock"></i> 최적 시간</h5>
        <div style="color: white; line-height: 1.6;">
          <div style="margin-bottom: 5px;">• 오전 9시 - 11시</div>
          <div style="margin-bottom: 5px;">• 오후 2시 - 4시</div>
        </div>
      </div>
      <div class="modal-result-card">
        <h5><i class="fas fa-lightbulb"></i> 조언</h5>
        <p style="color: white; line-height: 1.6;">위의 날짜들은 ${purpose} 목적으로 매우 길한 날들입니다. 중요한 일정은 이 날짜들을 활용하시기 바랍니다.</p>
      </div>
    </div>
    
    <div style="margin-top: 20px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; border: 1px solid rgba(46, 204, 113, 0.3);">
      <h5 style="color: #2ecc71; margin: 0 0 10px 0;"><i class="fas fa-info-circle"></i> 분석 설명</h5>
      <p style="color: white; line-height: 1.6; margin: 0;">
        📅 현재 날짜 기준으로 앞으로 ${period}일 중 ${purpose} 목적으로 가장 길한 날짜들을 추천해드립니다.<br>
        📅 점수가 높은 순서대로 정렬되어 있으며, 높은 점수의 날짜일수록 더 좋은 결과를 얻을 수 있습니다.
      </p>
    </div>
  `;
  
  // 폼 숨기고 결과 표시
  document.getElementById('dateModalForm').style.display = 'none';
  const resultDiv = document.getElementById('dateModalResult');
  resultDiv.innerHTML = resultContent;
  resultDiv.style.display = 'block';
}

function showComprehensiveModal(user = null) {
  const userToUse = user || currentUser;
  const userInfo = userToUse ? `(${userToUse.birthYear || userToUse.birth_year}년 ${userToUse.birthMonth || userToUse.birth_month}월 ${userToUse.birthDay || userToUse.birth_day}일)` : '';
  
  // 분석 가능한 항목들 확인
  const availableAnalyses = [];
  const missingAnalyses = [];
  
  if (userInputStatus.phoneNumber) {
    availableAnalyses.push('📱 전화번호 분석');
  } else {
    missingAnalyses.push('📱 전화번호 분석');
  }
  
  if (userInputStatus.carNumber) {
    availableAnalyses.push('🚗 차량번호 분석');
  } else {
    missingAnalyses.push('🚗 차량번호 분석');
  }
  
  // 기본 분석 항목들 (항상 포함)
  availableAnalyses.push('⭐ 길한 숫자 분석');
  availableAnalyses.push('👤 개인숫자 분석');
  availableAnalyses.push('📅 택일 서비스');
  
  // 종합 점수 계산 (입력된 항목들만 반영)
  const baseScore = 75; // 기본 점수
  const phoneBonus = userInputStatus.phoneNumber ? 5 : 0;
  const carBonus = userInputStatus.carNumber ? 5 : 0;
  const totalScore = baseScore + phoneBonus + carBonus;
  
  const content = `
    <div style="margin-bottom: 20px; padding: 15px; background: rgba(255, 215, 0, 0.1); border-radius: 10px; border: 1px solid rgba(255, 215, 0, 0.3);">
      <h4 style="color: #ffd700; margin: 0;">🔮 종합 운세 분석 ${userInfo}</h4>
    </div>
    
    <div class="modal-result-grid">
      <div class="modal-result-card">
        <h5><i class="fas fa-star"></i> 전체 운세 점수</h5>
        <div style="font-size: 2rem; color: #ffd700; font-weight: bold;">${totalScore}점</div>
        <p style="color: #2ecc71; font-size: 0.9rem; margin-top: 5px;">${totalScore >= 80 ? '매우 좋은 점수입니다' : totalScore >= 75 ? '좋은 점수입니다' : '보통 점수입니다'}</p>
      </div>
      
      <div class="modal-result-card">
        <h5><i class="fas fa-check-circle"></i> 분석 완료 항목</h5>
        <div style="color: white; line-height: 1.6;">
          ${availableAnalyses.map(item => `<div style="margin-bottom: 8px; padding: 5px; background: rgba(46, 204, 113, 0.2); border-radius: 5px;">✅ ${item}</div>`).join('')}
        </div>
      </div>
      
      ${missingAnalyses.length > 0 ? `
        <div class="modal-result-card">
          <h5><i class="fas fa-info-circle"></i> 추가 분석 권장</h5>
          <div style="color: white; line-height: 1.6;">
            ${missingAnalyses.map(item => `<div style="margin-bottom: 8px; padding: 5px; background: rgba(255, 193, 7, 0.2); border-radius: 5px;">⚠️ ${item} - 번호 입력 필요</div>`).join('')}
          </div>
          <p style="color: #ffd700; font-size: 0.9rem; margin-top: 10px;">더 정확한 종합분석을 위해 위 항목들을 먼저 분석해주세요.</p>
        </div>
      ` : ''}
      
      <div class="modal-result-card">
        <h5><i class="fas fa-chart-line"></i> 주요 운세 분석</h5>
        <div style="color: white; line-height: 1.6;">
          <div style="margin-bottom: 8px;"><strong>⭐ 길한 숫자:</strong> 사주에 길한 숫자들이 잘 조화를 이루고 있습니다.</div>
          <div style="margin-bottom: 8px;"><strong>👤 개인숫자:</strong> 개인적 성공과 행운이 많을 것으로 예상됩니다.</div>
          <div style="margin-bottom: 8px;"><strong>📅 택일:</strong> 중요한 일정은 길한 날짜를 선택하시면 좋습니다.</div>
          ${userInputStatus.phoneNumber ? '<div style="margin-bottom: 8px;"><strong>📱 전화번호:</strong> 소통과 인연에 좋은 영향을 줄 것입니다.</div>' : ''}
          ${userInputStatus.carNumber ? '<div style="margin-bottom: 8px;"><strong>🚗 차량번호:</strong> 안전한 운전과 여행이 가능합니다.</div>' : ''}
        </div>
      </div>
      
      <div class="modal-result-card">
        <h5><i class="fas fa-calendar"></i> 최적 시기</h5>
        <p style="color: white; line-height: 1.6;">2024년 3월과 4월이 가장 좋은 시기입니다. 특히 금요일과 월요일이 길합니다.</p>
      </div>
      
      <div class="modal-result-card">
        <h5><i class="fas fa-lightbulb"></i> 개선 방안</h5>
        <p style="color: white; line-height: 1.6;">길한 숫자 1, 2, 9를 활용하고, 빨간색과 노란색을 자주 사용하시면 운세가 더욱 좋아집니다.</p>
      </div>
    </div>
    
    <div style="margin-top: 20px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; border: 1px solid rgba(46, 204, 113, 0.3);">
      <h5 style="color: #2ecc71; margin: 0 0 10px 0;"><i class="fas fa-info-circle"></i> 분석 설명</h5>
      <p style="color: white; line-height: 1.6; margin: 0;">
        🔮 현재까지 분석된 항목들을 종합하여 운세를 분석했습니다.<br>
        ${missingAnalyses.length > 0 ? `⚠️ ${missingAnalyses.join(', ')} 항목은 번호 입력이 필요하여 제외되었습니다.<br>` : ''}
        💡 더 정확한 종합분석을 위해서는 모든 항목을 분석하시는 것을 권장합니다.
      </p>
    </div>
  `;
  showResultModal('🔮 종합 운세 분석 결과', content);
}

// 테스트 함수
function testModal() {
  console.log('🧪 모달 테스트 시작');
  showResultModal('🧪 테스트 모달', '<p style="color: white;">모달이 정상적으로 작동합니다!</p>');
}

// 사용자 입력 상태 추적
let userInputStatus = {
  phoneNumber: null,
  carNumber: null,
  personalNumber: null,
  dateSelection: null
};

// 전역 함수로 추가 (콘솔에서 직접 테스트 가능)
window.testModal = testModal;
window.showResultModal = showResultModal;
window.closeModal = closeModal;
window.showLuckyNumbersModal = showLuckyNumbersModal;
window.showPhoneAnalysisModal = showPhoneAnalysisModal;
window.showCarAnalysisModal = showCarAnalysisModal;
window.showPersonalNumberModal = showPersonalNumberModal;
window.showDateSelectionModal = showDateSelectionModal;
window.showComprehensiveModal = showComprehensiveModal;
window.analyzePhoneNumberModal = analyzePhoneNumberModal;
window.analyzeCarNumberModal = analyzeCarNumberModal;
window.analyzeDateSelectionModal = analyzeDateSelectionModal;


// 기본 종합 분석 생성 (사주 기반)
function generateBasicComprehensiveAnalysis(data) {
  const birthYear = parseInt(data.birthYear);
  const birthMonth = parseInt(data.birthMonth);
  const birthDay = parseInt(data.birthDay);
  const phoneNumber = data.phoneNumber;
  const carNumber = data.carNumber;
  const personalNumber = data.personalNumber;
  
  // 사주 기반 종합 분석
  const overallScore = 75 + (birthYear + birthMonth + birthDay) % 25;
  const phoneFortune = phoneNumber ? generatePhoneFortune(phoneNumber, data) : '전화번호 미입력';
  const carFortune = carNumber ? generateCarFortune(carNumber, data) : '차량번호 미입력';
  const personalFortune = personalNumber ? generatePersonalFortune(personalNumber, data) : '개인숫자 미입력';
  const overallAdvice = generateOverallAdvice(data);
  const futureFortune = generateFutureFortune(data);
  
  return {
    overallScore,
    phoneFortune,
    carFortune,
    personalFortune,
    overallAdvice,
    futureFortune,
    analysis: `${birthYear}년 ${birthMonth}월 ${birthDay}일 사주를 기반으로 한 종합 운세 분석 결과입니다.`
  };
}

// 전화번호 운세 생성
function generatePhoneFortune(phoneNumber, data) {
  const digits = phoneNumber.replace(/\D/g, '');
  const sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  const score = 60 + (sum % 40);
  
  if (score >= 80) return '매우 길한 전화번호입니다. 좋은 인연과 소통이 많을 것입니다.';
  else if (score >= 70) return '길한 전화번호입니다. 원활한 소통과 좋은 기회를 얻을 수 있습니다.';
  else if (score >= 60) return '보통의 전화번호입니다. 평범한 소통과 기회가 있을 것입니다.';
  else return '주의가 필요한 전화번호입니다. 소통에 신중함이 필요합니다.';
}

// 차량번호 운세 생성
function generateCarFortune(carNumber, data) {
  const digits = carNumber.replace(/\D/g, '');
  const sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  const score = 65 + (sum % 35);
  
  if (score >= 80) return '매우 안전한 차량번호입니다. 안전 운전과 좋은 여행이 있을 것입니다.';
  else if (score >= 70) return '안전한 차량번호입니다. 평온한 운전과 여행이 가능합니다.';
  else if (score >= 60) return '보통의 차량번호입니다. 일반적인 운전과 여행이 있을 것입니다.';
  else return '주의가 필요한 차량번호입니다. 운전에 각별한 신중함이 필요합니다.';
}

// 개인숫자 운세 생성
function generatePersonalFortune(personalNumber, data) {
  const digits = personalNumber.replace(/\D/g, '');
  const sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  const score = 70 + (sum % 30);
  
  if (score >= 85) return '매우 길한 개인숫자입니다. 개인적 성공과 행운이 많을 것입니다.';
  else if (score >= 75) return '길한 개인숫자입니다. 개인적 발전과 좋은 기회를 얻을 수 있습니다.';
  else if (score >= 65) return '보통의 개인숫자입니다. 평범한 개인적 성장이 있을 것입니다.';
  else return '주의가 필요한 개인숫자입니다. 개인적 발전에 노력이 필요합니다.';
}

// 종합 조언 생성
function generateOverallAdvice(data) {
  const birthYear = parseInt(data.birthYear);
  const birthMonth = parseInt(data.birthMonth);
  const birthDay = parseInt(data.birthDay);
  
  const advice = [
    '사주와 조화를 이루는 숫자들을 활용하시면 더욱 좋은 결과를 얻을 수 있습니다.',
    '길한 숫자와 색상을 일상생활에 활용하시면 행운을 끌어들일 수 있습니다.',
    '적절한 시간대와 방향을 고려하여 중요한 일을 진행하시면 성공 확률이 높아집니다.',
    '개인적 발전과 사회적 성공을 위해 지속적인 노력과 자기계발이 중요합니다.',
    '좋은 인연과 소통을 통해 더욱 풍요로운 삶을 살 수 있을 것입니다.'
  ];
  
  const index = (birthYear + birthMonth + birthDay) % advice.length;
  return advice[index];
}

// 향후 운세 생성
function generateFutureFortune(data) {
  const birthYear = parseInt(data.birthYear);
  const birthMonth = parseInt(data.birthMonth);
  const birthDay = parseInt(data.birthDay);
  
  const fortunes = [
    '앞으로 3개월간 새로운 기회와 도전이 많을 것입니다. 적극적으로 도전하시기 바랍니다.',
    '향후 6개월간 안정적인 발전과 성장이 있을 것입니다. 차근차근 진행하시기 바랍니다.',
    '앞으로 1년간 큰 변화와 성공의 기회가 있을 것입니다. 준비를 철저히 하시기 바랍니다.',
    '향후 2년간 지속적인 발전과 성공이 예상됩니다. 장기적인 계획을 세우시기 바랍니다.',
    '앞으로 5년간 꾸준한 성장과 행복한 삶이 있을 것입니다. 건강과 가족을 소중히 하시기 바랍니다.'
  ];
  
  const index = (birthYear + birthMonth + birthDay) % fortunes.length;
  return fortunes[index];
}

// 결과 표시 함수들
function displayLuckyNumbersResult(data) {
  const resultSection = document.getElementById('luckyNumbersResult');
  const luckyNumbersList = document.getElementById('luckyNumbersList');
  const luckyDaysList = document.getElementById('luckyDaysList');
  const luckyHoursList = document.getElementById('luckyHoursList');
  const luckyColorsList = document.getElementById('luckyColorsList');
  const luckyDirectionsList = document.getElementById('luckyDirectionsList');
  const luckyStonesList = document.getElementById('luckyStonesList');
  
  console.log('📊 길한 숫자 결과 표시:', data);
  
  if (luckyNumbersList) {
    luckyNumbersList.innerHTML = data.luckyNumbers.map(num => 
      `<span class="lucky-number">${num}</span>`
    ).join('');
  }
  
  if (luckyDaysList) {
    luckyDaysList.innerHTML = data.luckyDays.map(day => 
      `<span class="lucky-day">${day}</span>`
    ).join('');
  }
  
  if (luckyHoursList) {
    luckyHoursList.innerHTML = data.luckyHours.map(hour => 
      `<span class="lucky-hour">${hour}</span>`
    ).join('');
  }
  
  if (luckyColorsList) {
    luckyColorsList.innerHTML = data.luckyColors.map(color => 
      `<span class="lucky-color">${color}</span>`
    ).join('');
  }
  
  if (luckyDirectionsList) {
    luckyDirectionsList.innerHTML = data.luckyDirections.map(direction => 
      `<span class="lucky-direction">${direction}</span>`
    ).join('');
  }
  
  if (luckyStonesList) {
    luckyStonesList.innerHTML = data.luckyStones.map(stone => 
      `<span class="lucky-stone">${stone}</span>`
    ).join('');
  }
  
  // 분석 설명 추가
  if (data.analysis) {
    const analysisDiv = document.createElement('div');
    analysisDiv.style.cssText = 'background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px; margin-top: 20px; border: 1px solid rgba(255, 255, 255, 0.2);';
    analysisDiv.innerHTML = `<p style="color: white; margin: 0;">${data.analysis}</p>`;
    resultSection.appendChild(analysisDiv);
  }
  
  resultSection.style.display = 'block';
  console.log('✅ 길한 숫자 결과 표시 완료');
}

function displayPhoneAnalysisResult(data) {
  const resultSection = document.getElementById('phoneAnalysisResult');
  const scoreElement = document.getElementById('phoneScore');
  const gradeElement = document.getElementById('phoneGrade');
  const recommendationElement = document.getElementById('phoneRecommendation');
  const digitAnalysisElement = document.getElementById('phoneDigitAnalysis');
  
  console.log('📱 전화번호 분석 결과 표시:', data);
  
  if (scoreElement) {
    scoreElement.innerHTML = `<span class="score-number">${data.score}점</span>`;
  }
  
  if (gradeElement) {
    gradeElement.innerHTML = `<span class="grade-text">${data.grade}</span>`;
  }
  
  if (recommendationElement) {
    recommendationElement.innerHTML = `<p class="recommendation-text">${data.recommendation}</p>`;
  }
  
  if (digitAnalysisElement) {
    digitAnalysisElement.innerHTML = data.digitAnalysis.map(digit => 
      `<div class="digit-item ${digit.status}">${digit.digit}</div>`
    ).join('');
  }
  
  // 분석 설명 추가
  if (data.analysis) {
    const analysisDiv = document.createElement('div');
    analysisDiv.style.cssText = 'background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px; margin-top: 20px; border: 1px solid rgba(255, 255, 255, 0.2);';
    analysisDiv.innerHTML = `<p style="color: white; margin: 0;">${data.analysis}</p>`;
    resultSection.appendChild(analysisDiv);
  }
  
  resultSection.style.display = 'block';
  console.log('✅ 전화번호 분석 결과 표시 완료');
}

function displayCarAnalysisResult(data) {
  const resultSection = document.getElementById('carAnalysisResult');
  const scoreElement = document.getElementById('carScore');
  const gradeElement = document.getElementById('carGrade');
  const recommendationElement = document.getElementById('carRecommendation');
  const digitAnalysisElement = document.getElementById('carDigitAnalysis');
  
  console.log('🚗 차량번호 분석 결과 표시:', data);
  
  if (scoreElement) {
    scoreElement.innerHTML = `<span class="score-number">${data.score}점</span>`;
  }
  
  if (gradeElement) {
    gradeElement.innerHTML = `<span class="grade-text">${data.grade}</span>`;
  }
  
  if (recommendationElement) {
    recommendationElement.innerHTML = `<p class="recommendation-text">${data.recommendation}</p>`;
  }
  
  if (digitAnalysisElement) {
    digitAnalysisElement.innerHTML = data.digitAnalysis.map(digit => 
      `<div class="digit-item ${digit.status}">${digit.digit}</div>`
    ).join('');
  }
  
  // 분석 설명 추가
  if (data.analysis) {
    const analysisDiv = document.createElement('div');
    analysisDiv.style.cssText = 'background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px; margin-top: 20px; border: 1px solid rgba(255, 255, 255, 0.2);';
    analysisDiv.innerHTML = `<p style="color: white; margin: 0;">${data.analysis}</p>`;
    resultSection.appendChild(analysisDiv);
  }
  
  resultSection.style.display = 'block';
  console.log('✅ 차량번호 분석 결과 표시 완료');
}

function displayPersonalAnalysisResult(data) {
  const resultSection = document.getElementById('personalAnalysisResult');
  const scoreElement = document.getElementById('personalScore');
  const gradeElement = document.getElementById('personalGrade');
  const recommendationElement = document.getElementById('personalRecommendation');
  const digitAnalysisElement = document.getElementById('personalDigitAnalysis');
  
  if (scoreElement) scoreElement.textContent = data.score;
  if (gradeElement) gradeElement.textContent = data.grade;
  if (recommendationElement) recommendationElement.textContent = data.recommendation;
  
  if (digitAnalysisElement) {
    digitAnalysisElement.innerHTML = data.digitAnalysis.map(digit => 
      `<div class="digit-item ${digit.status}">${digit.digit}</div>`
    ).join('');
  }
  
  resultSection.style.display = 'block';
}

function displayDateSelectionResult(data) {
  const resultSection = document.getElementById('dateSelectionResult');
  const topDatesElement = document.getElementById('topDates');
  const avoidDatesElement = document.getElementById('avoidDates');
  const bestTimesElement = document.getElementById('bestTimes');
  const dateAdviceElement = document.getElementById('dateAdvice');
  
  console.log('📅 택일 분석 결과 표시:', data);
  
  if (topDatesElement) {
    topDatesElement.innerHTML = data.topDates.map(date => `
      <div class="date-item good">
        <div class="date-date">📅 ${date.date}</div>
        <div class="date-score">⭐ 점수: ${date.score}</div>
        <div class="date-reasons">${date.reasons.join(', ')}</div>
      </div>
    `).join('');
  }
  
  if (avoidDatesElement) {
    avoidDatesElement.innerHTML = data.avoidDates.map(date => `
      <div class="date-item bad">
        <div class="date-date">⚠️ ${date.date}</div>
        <div class="date-reasons">${date.reasons.join(', ')}</div>
      </div>
    `).join('');
  }
  
  if (bestTimesElement) {
    bestTimesElement.innerHTML = data.bestTimes.map(time => 
      `<span class="best-time">🕐 ${time}</span>`
    ).join('');
  }
  
  if (dateAdviceElement) {
    dateAdviceElement.innerHTML = data.dateAdvice.map(advice => 
      `<p class="advice-text">💡 ${advice}</p>`
    ).join('');
  }
  
  // 분석 설명 추가
  if (data.analysis) {
    const analysisDiv = document.createElement('div');
    analysisDiv.style.cssText = 'background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px; margin-top: 20px; border: 1px solid rgba(255, 255, 255, 0.2);';
    analysisDiv.innerHTML = `<p style="color: white; margin: 0;">${data.analysis}</p>`;
    resultSection.appendChild(analysisDiv);
  }
  
  resultSection.style.display = 'block';
  console.log('✅ 택일 분석 결과 표시 완료');
}

function displayComprehensiveResult(data) {
  const resultSection = document.getElementById('comprehensiveResult');
  const overallScoreElement = document.getElementById('overallScore');
  const phoneFortuneElement = document.getElementById('phoneFortune');
  const carFortuneElement = document.getElementById('carFortune');
  const personalFortuneElement = document.getElementById('personalFortune');
  const overallAdviceElement = document.getElementById('overallAdvice');
  const futureFortuneElement = document.getElementById('futureFortune');
  
  console.log('🔮 종합 분석 결과 표시:', data);
  
  if (overallScoreElement) {
    const scoreClass = data.overallScore >= 80 ? 'excellent' : data.overallScore >= 70 ? 'good' : data.overallScore >= 60 ? 'average' : 'poor';
    overallScoreElement.innerHTML = `<span class="score ${scoreClass}">${data.overallScore}점</span>`;
  }
  
  if (phoneFortuneElement) {
    phoneFortuneElement.innerHTML = `<p class="fortune-text">📱 ${data.phoneFortune}</p>`;
  }
  
  if (carFortuneElement) {
    carFortuneElement.innerHTML = `<p class="fortune-text">🚗 ${data.carFortune}</p>`;
  }
  
  if (personalFortuneElement) {
    personalFortuneElement.innerHTML = `<p class="fortune-text">👤 ${data.personalFortune}</p>`;
  }
  
  if (overallAdviceElement) {
    overallAdviceElement.innerHTML = `<p class="advice-text">💡 ${data.overallAdvice}</p>`;
  }
  
  if (futureFortuneElement) {
    futureFortuneElement.innerHTML = `<p class="fortune-text">🔮 ${data.futureFortune}</p>`;
  }
  
  // 분석 설명 추가
  if (data.analysis) {
    const analysisDiv = document.createElement('div');
    analysisDiv.style.cssText = 'background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px; margin-top: 20px; border: 1px solid rgba(255, 255, 255, 0.2);';
    analysisDiv.innerHTML = `<p style="color: white; margin: 0;">${data.analysis}</p>`;
    resultSection.appendChild(analysisDiv);
  }
  
  resultSection.style.display = 'block';
  console.log('✅ 종합 분석 결과 표시 완료');
}

// 길한 숫자 테스트 함수
function testLuckyNumbers() {
  console.log('🧪 길한 숫자 테스트 시작');
  
  // 먼저 길한 숫자 탭으로 전환
  switchTab('lucky-numbers');
  
  // 테스트 데이터
  const testData = {
    birthYear: 1990,
    birthMonth: 5,
    birthDay: 15,
    birthHour: 12
  };
  
  // 길한 숫자 분석 실행
  const result = generateBasicLuckyNumbers(testData);
  console.log('📊 테스트 결과:', result);
  
  // 결과 표시
  displayLuckyNumbersResult(result);
  
  console.log('✅ 길한 숫자 테스트 완료');
}

// 탭 전환 테스트 함수
function testTabSwitching() {
  console.log('🧪 탭 전환 테스트 시작');
  
  const tabs = ['lucky-numbers', 'phone-analysis', 'car-analysis', 'personal-number', 'date-selection', 'comprehensive'];
  
  tabs.forEach((tab, index) => {
    setTimeout(() => {
      console.log(`🔄 ${index + 1}/${tabs.length} 탭 전환: ${tab}`);
      switchTab(tab);
    }, index * 1000);
  });
  
  console.log('✅ 탭 전환 테스트 완료');
}

// 전화번호 분석 테스트 함수
function testPhoneAnalysis() {
  console.log('🧪 전화번호 분석 테스트 시작');
  
  // 전화번호 탭으로 전환
  switchTab('phone-analysis');
  
  // 테스트 데이터
  const testData = {
    score: 85,
    grade: 'A+',
    recommendation: '매우 길한 전화번호입니다. 좋은 인연과 소통이 많을 것입니다.',
    digitAnalysis: [
      { digit: '0', status: 'good' },
      { digit: '1', status: 'good' },
      { digit: '0', status: 'neutral' },
      { digit: '1', status: 'good' },
      { digit: '2', status: 'good' },
      { digit: '3', status: 'neutral' },
      { digit: '4', status: 'good' },
      { digit: '5', status: 'good' },
      { digit: '6', status: 'neutral' },
      { digit: '7', status: 'good' },
      { digit: '8', status: 'good' }
    ],
    analysis: '1990년 5월 15일 사주를 기반으로 한 전화번호 분석 결과입니다.'
  };
  
  // 결과 표시
  displayPhoneAnalysisResult(testData);
  
  console.log('✅ 전화번호 분석 테스트 완료');
}

// 차량번호 분석 테스트 함수
function testCarAnalysis() {
  console.log('🧪 차량번호 분석 테스트 시작');
  
  // 차량번호 탭으로 전환
  switchTab('car-analysis');
  
  // 테스트 데이터
  const testData = {
    score: 78,
    grade: 'A',
    recommendation: '안전한 차량번호입니다. 평온한 운전과 여행이 가능합니다.',
    digitAnalysis: [
      { digit: '1', status: 'good' },
      { digit: '2', status: 'good' },
      { digit: '3', status: 'neutral' },
      { digit: '4', status: 'good' },
      { digit: '5', status: 'good' },
      { digit: '6', status: 'neutral' }
    ],
    analysis: '1990년 5월 15일 사주를 기반으로 한 차량번호 분석 결과입니다.'
  };
  
  // 결과 표시
  displayCarAnalysisResult(testData);
  
  console.log('✅ 차량번호 분석 테스트 완료');
}

// 개인숫자 분석 결과 표시
function displayPersonalNumberResult(data) {
  const resultSection = document.getElementById('personalNumberResult');
  const recommendedNumbersElement = document.getElementById('recommendedNumbers');
  const numberFortuneElement = document.getElementById('numberFortune');
  const bestTimingElement = document.getElementById('bestTiming');
  const usageAdviceElement = document.getElementById('usageAdvice');
  
  console.log('🎯 개인숫자 분석 결과 표시:', data);
  
  if (recommendedNumbersElement) {
    recommendedNumbersElement.innerHTML = data.recommendedNumbers.map(number => 
      `<span class="recommended-number">${number}</span>`
    ).join('');
  }
  
  if (numberFortuneElement) {
    numberFortuneElement.innerHTML = data.numberFortune.map(item => {
      const gradeClass = item.grade === '매우 길함' ? 'excellent' : item.grade === '길함' ? 'good' : item.grade === '보통' ? 'average' : 'poor';
      return `<div class="fortune-item ${gradeClass}">
        <span class="number">${item.number}</span>
        <span class="grade">${item.grade}</span>
        <span class="score">${item.fortune}점</span>
      </div>`;
    }).join('');
  }
  
  if (bestTimingElement) {
    bestTimingElement.innerHTML = data.bestTiming.map(timing => 
      `<span class="timing-item">🕐 ${timing}</span>`
    ).join('');
  }
  
  if (usageAdviceElement) {
    usageAdviceElement.innerHTML = data.usageAdvice.map(advice => 
      `<p class="advice-text">💡 ${advice}</p>`
    ).join('');
  }
  
  // 분석 설명 추가
  if (data.analysis) {
    const analysisDiv = document.createElement('div');
    analysisDiv.style.cssText = 'background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 10px; margin-top: 20px; border: 1px solid rgba(255, 255, 255, 0.2);';
    analysisDiv.innerHTML = `<p style="color: white; margin: 0;">${data.analysis}</p>`;
    resultSection.appendChild(analysisDiv);
  }
  
  resultSection.style.display = 'block';
  console.log('✅ 개인숫자 분석 결과 표시 완료');
}

// 섹션 변경 함수
function changeSection(sectionId) {
  console.log('🔄 changeSection called with:', sectionId);
  console.log('📱 스마트폰 여부:', window.innerWidth <= 768);
  console.log('🔍 현재 URL:', window.location.href);
  
  // 홈 섹션으로 이동할 때 맨 위로 스크롤 및 날짜/시간 업데이트
  if (sectionId === 'home') {
    console.log('🏠 홈 섹션으로 이동 - 맨 위로 스크롤');
    window.scrollTo(0, 0); // 맨 위로 스크롤
    updateDateTime(); // 날짜/시간 업데이트
    // return 제거 - 홈 섹션 표시 계속 진행
  }
  
  // 기부 섹션으로 이동할 때 맨 위로 스크롤
  if (sectionId === 'donation') {
    console.log('💝 기부 섹션으로 이동 - 강제 스크롤 적용');
    // 즉시 스크롤 + 약간의 지연 후 재스크롤
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.getElementById('donation').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
  
  // 갤러리 섹션으로 이동할 때 갤러리 로드
  if (sectionId === 'gallery') {
    console.log('🖼️ 갤러리 섹션으로 이동 - 강제 스크롤 적용');
    // 즉시 스크롤 + 약간의 지연 후 재스크롤
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    // 갤러리 로드
    setTimeout(() => {
      loadGallery();
      console.log('📸 갤러리 로드 완료');
    }, 200);
  }
  
  // 모바일 탭 상태 업데이트
  if (isMobile) {
    updateMobileTabState(sectionId);
  }
  
  // 현재 로그인 상태 저장 (섹션 변경 전에)
  const currentUserInfo = document.querySelector('.user-info');
  const currentAuthButtons = document.querySelector('.auth-buttons');
  const wasLoggedIn = currentUserInfo && currentUserInfo.style.display !== 'none';
  
  // 모든 섹션 숨기기
  document.querySelectorAll('.section').forEach(section => {
    section.style.display = 'none';
    section.classList.remove('active');
  });
  
  // 갤러리 애니메이션 초기화
  
  
  // 모든 네비게이션 링크 비활성화
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  // 배경 이미지 변경
  document.body.setAttribute('data-section', sectionId);
  
  // 선택된 섹션 표시
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.style.display = 'block';
    console.log('✅ Section displayed:', sectionId);
    
    // 명리학 섹션으로 이동할 때 사용자 데이터 동기화 및 분석 수행
    if (sectionId === 'bazi') {
      console.log('🔄 Bazi 섹션으로 이동');
      
      // DOM이 완전히 로드된 후 실행 (스마트폰에서는 더 긴 지연)
      const delay = window.innerWidth <= 768 ? 2000 : 100; // 스마트폰에서는 2초, PC에서는 0.1초
      console.log(`⏰ DOM 로딩 대기: ${delay}ms`);
      
      setTimeout(() => {
        console.log('🔄 DOM 로딩 완료, 분석 시작');
        // 현재 사용자 정보 확인
        let userToUse = currentUser;
        
        // localStorage에서 사용자 정보 확인
        console.log('🔍 localStorage 접근 시작');
        let storedUser, storedToken;
        
        try {
          storedUser = localStorage.getItem('currentUser');
          storedToken = localStorage.getItem('authToken');
          console.log('✅ localStorage 접근 성공');
          console.log('🔍 storedUser:', storedUser ? '있음' : '없음');
          console.log('🔍 storedToken:', storedToken ? '있음' : '없음');
        } catch (error) {
          console.error('❌ localStorage 접근 오류:', error);
          storedUser = null;
          storedToken = null;
        }
        
        if (storedUser && storedToken) {
          try {
            const user = JSON.parse(storedUser);
            currentUser = user;
            authToken = storedToken;
            userToUse = user;
            console.log('✅ 파싱된 사용자 정보:', user);
          } catch (error) {
            console.error('❌ 사용자 정보 파싱 오류:', error);
          }
        }
        
        if (userToUse && (userToUse.birthYear || userToUse.birth_year)) {
          console.log('✅ 로그인 상태, 사용자 정보 로드:', userToUse);
          console.log('🔍 생년월일 정보 확인:', {
            birthYear: userToUse.birthYear || userToUse.birth_year,
            birthMonth: userToUse.birthMonth || userToUse.birth_month,
            birthDay: userToUse.birthDay || userToUse.birth_day,
            birthHour: userToUse.birthHour || userToUse.birth_hour
          });
          console.log('📱 스마트폰 여부:', window.innerWidth <= 768);
          syncFormsWithUser(userToUse);
          console.log('🚀 performBaziAnalysis 호출 시작');
          console.log('🔍 전달할 사용자 정보:', {
            uid: userToUse.uid,
            name: userToUse.name,
            email: userToUse.email,
            birthYear: userToUse.birthYear || userToUse.birth_year,
            birthMonth: userToUse.birthMonth || userToUse.birth_month,
            birthDay: userToUse.birthDay || userToUse.birth_day,
            birthHour: userToUse.birthHour || userToUse.birth_hour
          });
          performBaziAnalysis(userToUse);
          

          
          // 로그인된 사용자: 사주 정보만 표시 (메시지 없음)
          console.log('🔍 myBaziInfo 요소 검색');
          const myBaziInfo = document.getElementById('myBaziInfo');
          console.log('🔍 myBaziInfo 요소:', myBaziInfo ? '찾음' : '없음');
          
          if (myBaziInfo) {
            // 스마트폰에서는 간단하게, PC에서는 상세하게
            if (window.innerWidth <= 768) {
              myBaziInfo.innerHTML = `
                <p style="color: white; margin: 0; font-weight: 500; text-align: center;">
                  <strong>${userToUse.name || '사용자'}</strong> | ${userToUse.birthYear || userToUse.birth_year}.${userToUse.birthMonth || userToUse.birth_month}.${userToUse.birthDay || userToUse.birth_day} ${userToUse.birthHour || userToUse.birth_hour || 0}시
                </p>
                <p style="color: white; margin: 3px 0 0 0; font-weight: 500; text-align: center; font-size: 0.85rem;">
                  <strong>장소:</strong> ${userToUse.birthPlace || userToUse.birth_place || '서울'}
                </p>
              `;
            } else {
              myBaziInfo.innerHTML = `
                <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 12px; padding: 15px; border: 1px solid rgba(255, 255, 255, 0.2);">
                  <p style="color: white; margin: 0; font-weight: 500;">
                    <strong>생년월일:</strong> ${userToUse.birthYear || userToUse.birth_year}년 ${userToUse.birthMonth || userToUse.birth_month}월 ${userToUse.birthDay || userToUse.birth_day}일 ${userToUse.birthHour || userToUse.birth_hour || 0}시
                  </p>
                  <p style="color: white; margin: 5px 0 0 0; font-weight: 500;">
                    <strong>이름:</strong> ${userToUse.name || '사용자'}
                  </p>
                  <p style="color: white; margin: 5px 0 0 0; font-weight: 500;">
                    <strong>장소:</strong> ${userToUse.birthPlace || userToUse.birth_place || '서울'}
                  </p>
                </div>
              `;
            }
          }
        } else {
          console.log('❌ 사용자 정보 없음 또는 불완전, 로그아웃 상태');
          // 로그아웃 상태일 때는 안내 메시지 표시
          const myBaziInfo = document.getElementById('myBaziInfo');
          if (myBaziInfo) {
            myBaziInfo.innerHTML = `
              <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 12px; padding: 15px; border: 1px solid rgba(255, 255, 255, 0.2);">
                <p style="color: white; margin: 0; font-weight: 500; text-align: center;">
                  로그인 후 사주 분석을 이용하실 수 있습니다.
                </p>
              </div>
            `;
          }
        }
      }, 100);
    }
    
    // About_Us 섹션으로 이동
    if (sectionId === 'about-us') {
      console.log('ℹ️ About_Us 섹션으로 이동');
      
      // body에 data-section 속성 설정
      document.body.setAttribute('data-section', 'about-us');
    }
    
    // 공지사항 섹션으로 이동할 때 공지사항 로드
    if (sectionId === 'announcements') {
      console.log('📢 공지사항 섹션으로 이동');
      
      // body에 data-section 속성 설정
      document.body.setAttribute('data-section', 'announcements');
      
      // DOM이 완전히 로드된 후 실행
      setTimeout(() => {
        console.log('📢 공지사항 로드 시작 (PC/모바일 공통)');
        loadAnnouncements();
      }, 100);
    }
    
    // 숫자 택일 섹션으로 이동할 때 사용자 데이터 동기화 및 분석 수행
    if (sectionId === 'numerology') {
      console.log('🔄 Numerology 섹션으로 이동, 사용자 데이터 동기화 및 분석 시작');
      
      // DOM이 완전히 로드된 후 실행
      setTimeout(() => {
        // 현재 사용자 정보 확인
        let userToUse = currentUser;
        
        // localStorage에서 사용자 정보 확인
        const storedUser = localStorage.getItem('currentUser');
        const storedToken = localStorage.getItem('authToken');
        
        console.log('🔍 현재 currentUser:', currentUser);
        console.log('🔍 localStorage currentUser:', storedUser);
        console.log('🔍 localStorage authToken:', storedToken);
        
        if (storedUser && storedToken) {
          try {
            console.log('💾 localStorage에서 사용자 정보 발견');
            const user = JSON.parse(storedUser);
            currentUser = user;
            authToken = storedToken;
            userToUse = user;
            console.log('✅ 파싱된 사용자 정보:', user);
            console.log('🔍 사용자 ID:', user.uid || user.id);
            console.log('🔍 사용자 이름:', user.name);
            console.log('🔍 사용자 이메일:', user.email);
            console.log('🔍 사용자 생년월일:', {
              birthYear: user.birthYear || user.birth_year,
              birthMonth: user.birthMonth || user.birth_month,
              birthDay: user.birthDay || user.birth_day,
              birthHour: user.birthHour || user.birth_hour
            });
          } catch (error) {
            console.error('❌ 사용자 정보 파싱 오류:', error);
          }
        }
        
        if (userToUse && (userToUse.birthYear || userToUse.birth_year)) {
          console.log('✅ 로그인 상태, 사용자 정보 로드:', userToUse);
          syncNumerologyFormsWithUser(userToUse);
          performNumerologyAnalysis(userToUse);
        } else {
          console.log('❌ 사용자 정보 없음 또는 불완전, 로그아웃 상태');
        }
        
        // 탭과 폼 설정
        console.log('🔧 탭 시스템 초기화 시작');
        
        // 탭 시스템 초기화 (간단한 방식으로 변경)
        console.log('🔧 탭 시스템 초기화 시작');
        
        // 탭 버튼 상태 확인만 수행
        const tabButtons = document.querySelectorAll('.numerology-tabs .tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        console.log('📊 탭 버튼 수:', tabButtons.length);
        console.log('📊 탭 패널 수:', tabPanels.length);
        
        if (tabButtons.length > 0) {
          console.log('✅ 탭 시스템 확인 완료');
          tabButtons.forEach((btn, index) => {
            const tabName = btn.getAttribute('data-tab');
            const isActive = btn.classList.contains('active');
            console.log(`  탭 ${index + 1}: ${tabName} - 활성: ${isActive}`);
          });
        } else {
          console.warn('⚠️ 탭 버튼을 찾을 수 없음');
        }
      }, 300);
    }
    
    // 관리자 섹션으로 이동할 때는 항상 로그인 화면 표시
    if (sectionId === 'admin') {
      console.log('🔄 Admin 섹션으로 이동');
      if (isAdminLoggedIn) {
        console.log('✅ 관리자 로그인 상태, 대시보드 표시');
        showAdminDashboard();
      } else {
        console.log('❌ 관리자 로그인 상태 아님, 로그인 화면 표시');
        showAdminLogin();
      }
    }
    
    // 점성술 섹션으로 이동할 때 사용자 정보 연동
    if (sectionId === 'astrology') {
      console.log('🔄 Astrology 섹션으로 이동');
      
      // PC 버전과 동일한 방식으로 폼 초기화
      console.log('🔮 PC 버전 방식으로 폼 초기화 시작');
      populateAstrologyFormOptions();
      
      // 점성술 폼 초기화 (즉시)
      console.log('🔮 즉시 폼 초기화 시작');
      populateAstrologyFormOptions();
      
      // 사용자 정보 확인 및 표시 (한 번만)
      console.log('🔍 사용자 정보 확인 시작');
      const storedUser = localStorage.getItem('currentUser');
      const storedToken = localStorage.getItem('authToken');
      
      if (storedUser && storedToken) {
        console.log('💾 localStorage에서 사용자 정보 발견');
        const user = JSON.parse(storedUser);
        currentUser = user;
        authToken = storedToken;
        
        console.log('✅ 로그인 상태, 점성술 정보 표시');
        console.log('🔮 현재 사용자 정보:', currentUser);
        
        // 점성술 정보 표시 업데이트
        updateAstrologyInfo(user);
        
        // 폼에 사용자 정보 자동 채우기
        populateAstrologyForm(user);
        
        console.log('🎯 사용자 사주정보 연동 완료 - 자동 분석 준비됨');
        
      } else {
        console.log('❌ localStorage에 사용자 정보 없음');
        updateAstrologyInfo(null);
        
        // 로그인 상태 확인을 위해 서버에 요청
        checkLoginStatus();
      }
    }
    
    // 내정보 섹션으로 이동할 때 사용자 정보 로드
    if (sectionId === 'profile') {
      console.log('🔄 Profile 섹션으로 이동');
      
      // 즉시 로그인 상태 복원 (localStorage 확인 없이)
      setTimeout(() => {
        const storedUser = localStorage.getItem('currentUser');
        const storedToken = localStorage.getItem('authToken');
        
        if (storedUser && storedToken) {
          console.log('💾 localStorage에서 사용자 정보 발견');
          const user = JSON.parse(storedUser);
          currentUser = user;
          authToken = storedToken;
          
          console.log('✅ 로그인 상태, 사용자 정보 로드');
          
          // 프로필 폼에 사용자 정보 채우기
          populateProfileForm(currentUser);
          
          // 로그인 상태 UI 업데이트 (메뉴바에 사용자 정보 표시)
          const userInfo = document.querySelector('.user-info');
          const authButtons = document.querySelector('.auth-buttons');
          
          if (userInfo) {
            userInfo.innerHTML = `
              <span class="user-name">${currentUser.name}</span>
              <button onclick="logout()" class="logout-btn">로그아웃</button>
            `;
            userInfo.style.display = 'flex';
          }
          
          if (authButtons) {
            authButtons.style.display = 'none';
          }
          
          console.log('✅ Profile 섹션에서 로그인 상태 UI 업데이트 완료');
        } else {
          console.log('❌ localStorage에 사용자 정보 없음, 로그아웃 상태');
          
          // 로그아웃 상태 UI 업데이트
          const userInfo = document.querySelector('.user-info');
          const authButtons = document.querySelector('.auth-buttons');
          
          if (userInfo) {
            userInfo.style.display = 'none';
          }
          
          if (authButtons) {
            authButtons.style.display = 'flex';
          }
        }
      }, 100); // 100ms 지연으로 DOM 업데이트 완료 후 실행
    }
  } else {
    console.log('❌ Section not found:', sectionId);
  }
  
  // 네비게이션 링크 활성화
  const activeLink = document.querySelector(`[href="#${sectionId}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
}

// 회원가입 단계 관리
function updateStep(newStep) {
  console.log('🔄 updateStep 호출됨, newStep:', newStep, 'currentStep:', currentStep);
  
  // DOM 요소들이 초기화되었는지 확인
  if (!formSteps || !progressSteps) {
    console.error('❌ DOM 요소들이 초기화되지 않았습니다. formSteps:', formSteps, 'progressSteps:', progressSteps);
    // DOM 요소들을 다시 찾기
    formSteps = document.querySelectorAll('.form-step');
    progressSteps = document.querySelectorAll('.step');
    console.log('🔄 DOM 요소들 재초기화 완료');
  }
  
  // 현재 단계 비활성화
  formSteps.forEach(step => step.classList.remove('active'));
  progressSteps.forEach(step => {
    step.classList.remove('active', 'completed');
  });
  
  // 새 단계 활성화
  const targetFormStep = document.querySelector(`.form-step[data-step="${newStep}"]`);
  console.log('🎯 targetFormStep:', targetFormStep);
  
  if (targetFormStep) {
    targetFormStep.classList.add('active');
    console.log('✅ 새 단계 활성화 완료');
  } else {
    console.error('❌ 새 단계 폼을 찾을 수 없습니다:', newStep);
  }
  
  // 진행 단계 업데이트
  for (let i = 1; i <= totalSteps; i++) {
    const stepElement = document.querySelector(`.step[data-step="${i}"]`);
    if (i < newStep) {
      stepElement.classList.add('completed');
    } else if (i === newStep) {
      stepElement.classList.add('active');
    }
  }
  
  currentStep = newStep;
  console.log('✅ currentStep 업데이트 완료:', currentStep);
}

// 다음 단계로 이동
async function nextStep() {
  console.log('🚀 nextStep 호출됨, currentStep:', currentStep, 'totalSteps:', totalSteps);
  
  if (currentStep < totalSteps) {
    console.log('✅ 단계 진행 가능, 유효성 검사 시작');
    const isValid = await validateCurrentStep();
    if (isValid) {
      console.log('✅ 유효성 검사 통과, 다음 단계로 이동');
      const nextStepNumber = currentStep + 1;
      updateStep(nextStepNumber);
      if (nextStepNumber === 2) {
        console.log('📋 2단계 도달, 회원가입 준비 완료');
      }
    } else {
      console.log('❌ 유효성 검사 실패');
    }
  } else {
    console.log('✅ 마지막 단계 도달, 회원가입 실행');
    // 2단계에서 회원가입 실행
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      const formData = new FormData(registerForm);
      console.log('📋 폼 데이터 수집 완료, 회원가입 시작');
      register(formData);
    } else {
      console.error('❌ 회원가입 폼을 찾을 수 없습니다');
      alert('회원가입 폼을 찾을 수 없습니다. 페이지를 새로고침해주세요.');
    }
  }
}

// 이전 단계로 이동
function prevStep() {
  if (currentStep > 1) {
    updateStep(currentStep - 1);
  }
}

// 이메일 중복 체크 함수
async function checkEmailDuplicate(email) {
  try {
    console.log('📧 이메일 중복 체크 API 호출:', email);
    
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email })
    });
    
    const result = await response.json();
    console.log('📧 이메일 중복 체크 응답:', result);
    
    if (response.ok) {
      console.log('✅ 이메일 사용 가능');
      return true;
    } else {
      console.log('❌ 이메일 중복 또는 오류:', result.message);
      alert(result.message);
      return false;
    }
  } catch (error) {
    console.error('🚨 이메일 중복 체크 오류:', error);
    alert('이메일 중복 체크 중 오류가 발생했습니다. 다시 시도해주세요.');
    return false;
  }
}

// 현재 단계 유효성 검사
async function validateCurrentStep() {
  console.log('🔍 validateCurrentStep 호출됨, currentStep:', currentStep);
  
  const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  console.log('📋 currentFormStep:', currentFormStep);
  
  if (!currentFormStep) {
    console.error('❌ 현재 단계 폼을 찾을 수 없습니다:', currentStep);
    return false;
  }
  
  const inputs = currentFormStep.querySelectorAll('input[required], select[required]');
  console.log('📝 필수 입력 필드들:', inputs);
  
  for (let input of inputs) {
    console.log('🔍 입력 필드 검사:', input.name, '값:', input.value);
    if (!input.value.trim()) {
      console.log('❌ 필수 항목 누락:', input.name);
      alert('모든 필수 항목을 입력해주세요.');
      input.focus();
      return false;
    }
  }
  
  // 특별한 유효성 검사
  if (currentStep === 1) {
    console.log('🔍 1단계 특별 유효성 검사 시작');
    
    const emailElement = document.getElementById('registerEmail');
    const passwordElement = document.getElementById('registerPassword');
    
    console.log('🔍 이메일 요소:', emailElement);
    console.log('🔍 비밀번호 요소:', passwordElement);
    
    if (!emailElement || !passwordElement) {
      console.error('❌ 필수 입력 필드를 찾을 수 없습니다');
      alert('입력 필드를 찾을 수 없습니다. 페이지를 새로고침해주세요.');
      return false;
    }
    
    const email = emailElement.value?.trim();
    const password = passwordElement.value?.trim();
    
    console.log('📧 이메일 값:', email);
    console.log('🔒 비밀번호 길이:', password?.length);
    
    if (!email) {
      console.log('❌ 이메일이 비어있음');
      alert('이메일을 입력해주세요.');
      emailElement.focus();
      return false;
    }
    
    if (!password) {
      console.log('❌ 비밀번호가 비어있음');
      alert('비밀번호를 입력해주세요.');
      passwordElement.focus();
      return false;
    }
    
    if (!isValidEmail(email)) {
      console.log('❌ 이메일 형식 오류');
      alert('올바른 이메일 형식을 입력해주세요.');
      emailElement.focus();
      return false;
    }
    
    if (password.length < 8) {
      console.log('❌ 비밀번호 길이 부족');
      alert('비밀번호는 8자 이상이어야 합니다.');
      passwordElement.focus();
      return false;
    }
    
    // 이메일 중복 체크 (비동기)
    console.log('🔍 이메일 중복 체크 시작');
    return await checkEmailDuplicate(email);
  }
  
  // 2단계 유효성 검사
  if (currentStep === 2) {
    const nameElement = document.getElementById('registerNameSignup');
    const yearElement = document.getElementById('registerYearSignup');
    const monthElement = document.getElementById('registerMonthSignup');
    const dayElement = document.getElementById('registerDaySignup');
    const timeElement = document.getElementById('registerBirthTimeSignup');
    const birthplaceElement = document.getElementById('registerBirthplaceSignup');
    
    console.log('🔍 2단계 필드 검사:', {
      name: nameElement?.value,
      year: yearElement?.value,
      month: monthElement?.value,
      day: dayElement?.value,
      time: timeElement?.value,
      birthplace: birthplaceElement?.value
    });
    
    if (!nameElement || !nameElement.value.trim()) {
      console.log('❌ 이름이 비어있음');
      alert('이름을 입력해주세요.');
      nameElement?.focus();
      return false;
    }
    
    if (!yearElement || !yearElement.value) {
      console.log('❌ 출생년도가 비어있음');
      alert('출생년도를 선택해주세요.');
      yearElement?.focus();
      return false;
    }
    
    if (!monthElement || !monthElement.value) {
      console.log('❌ 출생월이 비어있음');
      alert('출생월을 선택해주세요.');
      monthElement?.focus();
      return false;
    }
    
    if (!dayElement || !dayElement.value) {
      console.log('❌ 출생일이 비어있음');
      alert('출생일을 선택해주세요.');
      dayElement?.focus();
      return false;
    }
    
    if (!timeElement || !timeElement.value) {
      console.log('❌ 출생시간이 비어있음');
      alert('출생시간을 입력해주세요.');
      timeElement?.focus();
      return false;
    }
    
    if (!birthplaceElement || !birthplaceElement.value.trim()) {
      console.log('❌ 출생지가 비어있음');
      alert('출생지를 입력해주세요.');
      birthplaceElement?.focus();
      return false;
    }
  }
  
  console.log('✅ 유효성 검사 통과');
  return true;
}

// 이메일 유효성 검사
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 비밀번호 강도 체크
function checkPasswordStrength(password) {
  let strength = 0;
  const strengthFill = document.querySelector('.strength-fill');
  const strengthText = document.querySelector('.strength-text');
  
  if (password.length >= 8) strength += 25;
  if (/[a-z]/.test(password)) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  
  strengthFill.style.width = strength + '%';
  
  if (strength <= 25) {
    strengthText.textContent = '매우 약함';
    strengthFill.style.background = '#ff4444';
  } else if (strength <= 50) {
    strengthText.textContent = '약함';
    strengthFill.style.background = '#ffaa00';
  } else if (strength <= 75) {
    strengthText.textContent = '보통';
    strengthFill.style.background = '#ffff00';
  } else {
    strengthText.textContent = '강함';
    strengthFill.style.background = '#44ff44';
  }
}

// 요약 정보 채우기
function populateSummary() {
  const name = document.getElementById('registerName').value;
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const year = document.getElementById('registerYear').value;
  const month = document.getElementById('registerMonth').value;
  const day = document.getElementById('registerDay').value;
  const hour = document.getElementById('registerHour').value;
  
  document.getElementById('summaryName').textContent = name;
  document.getElementById('summaryUsername').textContent = username;
  document.getElementById('summaryEmail').textContent = email;
  document.getElementById('summaryBirth').textContent = `${year}년 ${month}월 ${day}일 ${hour}시`;
}

// 폼 옵션 생성 함수
function populateFormOptions() {
  const yearSelects = document.querySelectorAll('#baziYear, #astroYear, #profileYear, #registerYear, #registerYearSignup');
  const monthSelects = document.querySelectorAll('#baziMonth, #astroMonth, #profileMonth, #registerMonth, #registerMonthSignup');
  const daySelects = document.querySelectorAll('#baziDay, #astroDay, #profileDay, #registerDay, #registerDaySignup');
  const hourSelects = document.querySelectorAll('#baziHour, #astroHour, #profileHour, #registerHour');
  
  // 년도 옵션 (1900-2024)
  yearSelects.forEach(select => {
    for (let year = 2024; year >= 1900; year--) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      select.appendChild(option);
    }
  });
  
  // 월 옵션
  monthSelects.forEach(select => {
    for (let month = 1; month <= 12; month++) {
      const option = document.createElement('option');
      option.value = month;
      option.textContent = month;
      select.appendChild(option);
    }
  });
  
  // 일 옵션
  daySelects.forEach(select => {
    for (let day = 1; day <= 31; day++) {
      const option = document.createElement('option');
      option.value = day;
      option.textContent = day;
      select.appendChild(option);
    }
  });
  
  // 시간 옵션
  hourSelects.forEach(select => {
    for (let hour = 0; hour <= 23; hour++) {
      const option = document.createElement('option');
      option.value = hour;
      option.textContent = `${hour.toString().padStart(2, '0')}:00`;
      select.appendChild(option);
    }
  });
  
  // 출생시간 필드 기본값 설정 (오전 9시)
  const birthTimeInput = document.getElementById('registerBirthTimeSignup');
  if (birthTimeInput && !birthTimeInput.value) {
    birthTimeInput.value = '09:00';
    console.log('⏰ 출생시간 기본값 설정: 09:00 (오전 9시)');
  }
}

// 로딩 스피너 제어
function showLoading() {
  loadingSpinner.classList.add('active');
}

function hideLoading() {
  loadingSpinner.classList.remove('active');
}

// 모달 제어
function showModal(modal) {
  console.log('🔍 showModal 호출됨:', modal);
  
  if (!modal) {
    console.error('❌ 모달 요소가 null입니다');
    return;
  }
  
  console.log('✅ 모달 표시 시작');
  modal.style.display = 'block';
  
  if (modal === registerModal) {
    updateStep(1); // 회원가입 모달 열 때 1단계로 초기화
    console.log('📝 회원가입 모달 1단계로 초기화');
  }
  
  // 모달 스타일 강제 적용
  setTimeout(() => {
    applyModalStyles();
    console.log('✅ 모달 스타일 적용 완료');
  }, 100);
}

// 전역 함수로 설정
window.showModal = showModal;

// 서비스 결과 표시 함수
function showServiceResult(serviceType) {
  const resultModal = document.getElementById('serviceResult');
  const resultTitle = document.getElementById('resultTitle');
  const resultContent = document.getElementById('resultContent');
  
  let title = '';
  let content = '';
  
  switch(serviceType) {
    case 'bazi':
      title = '🔮 명리학';
      content = '사주명리학은 동양의 고대 철학을 바탕으로 한 운세 분석입니다. 생년월일시를 기반으로 개인의 운명과 성격을 분석하여 인생의 방향을 제시합니다. 현재 로그인 후 사주 분석 서비스를 이용하실 수 있습니다.';
      break;
    case 'astrology':
      title = '⭐ 점성술';
      content = '서양 점성술은 별자리와 행성의 영향을 분석하여 미래를 예측하는 방법입니다. 태어난 시점의 천체 위치를 바탕으로 성격과 운세를 분석합니다. 현재 로그인 후 점성술 분석 서비스를 이용하실 수 있습니다.';
      break;
    case 'tarot':
      title = '🃏 타로 점';
      content = '타로 카드는 신비로운 상징을 통해 현재 상황과 미래를 읽어내는 도구입니다. 직관과 상징의 언어로 당신의 운세와 조언을 제공합니다. 현재 서비스 준비 중입니다.';
      break;
    case 'numerology':
      title = '🔢 숫자/택일';
      content = '숫자 택일은 사주를 기반으로 한 전화번호, 차량번호, 개인숫자 길흉 분석 및 택일 서비스입니다. 현재 로그인 후 숫자 택일 서비스를 이용하실 수 있습니다.';
      break;

  }
  
  resultTitle.textContent = title;
  resultContent.textContent = content;
  resultModal.style.display = 'flex';
}

// 서비스 결과 닫기 함수
function closeServiceResult() {
  const resultModal = document.getElementById('serviceResult');
  resultModal.style.display = 'none';
}

// 스마트폰용 공지사항 로드 함수
async function loadAnnouncementsForMobile() {
  console.log('📱 스마트폰 공지사항 로드 시작');
  
  const announcementsList = document.getElementById('announcementsList');
  if (!announcementsList) {
    console.error('❌ 공지사항 목록 요소를 찾을 수 없습니다.');
    return;
  }
  
  try {
    // 로딩 표시
    announcementsList.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>공지사항을 불러오는 중...</p>
      </div>
    `;
    
    // 공지사항 API 호출
    const response = await fetch('/api/announcements', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📢 공지사항 데이터:', data);
    
    if (data.success && data.announcements && data.announcements.length > 0) {
      // 공지사항 목록 표시
      const announcementsHtml = data.announcements.map(announcement => `
        <div class="announcement-item">
          <div class="announcement-title">${announcement.title}</div>
          <div class="announcement-content">${announcement.content}</div>
          <div class="announcement-date">${new Date(announcement.created_at).toLocaleDateString('ko-KR')}</div>
        </div>
      `).join('');
      
      announcementsList.innerHTML = announcementsHtml;
    } else {
      // 공지사항이 없을 때
      announcementsList.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.7);">
          <p>📢 등록된 공지사항이 없습니다.</p>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">새로운 소식이 있을 때 알려드리겠습니다!</p>
        </div>
      `;
    }
    
  } catch (error) {
    console.error('❌ 공지사항 로드 오류:', error);
    announcementsList.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.7);">
        <p>❌ 공지사항을 불러올 수 없습니다.</p>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">잠시 후 다시 시도해주세요.</p>
      </div>
    `;
  }
}

// 홈페이지 최상단으로 이동하는 함수
function goToHomeTop() {
  console.log('🏠 홈페이지 최상단으로 이동');
  
  // 홈 섹션으로 이동
  changeSection('home');
  
  // 페이지 최상단으로 스크롤
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  // body의 data-section 속성도 홈으로 설정
  document.body.setAttribute('data-section', 'home');
}

// 내정보 섹션으로 이동하는 함수
function goToProfile() {
  console.log('👤 내정보 섹션으로 이동');
  
  // 내정보 섹션으로 이동
  changeSection('profile');
  
  // 페이지 최상단으로 스크롤
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  // body의 data-section 속성도 profile로 설정
  document.body.setAttribute('data-section', 'profile');
  
  // 사용자 데이터 로드
  loadUserProfileData();
}

// 사용자 프로필 데이터 로드 함수
async function loadUserProfileData() {
  console.log('👤 사용자 프로필 데이터 로드 시작');

  try {
    // 서버에서 현재 사용자 정보 조회 (쿠키 기반 인증)
    const result = await apiRequest('/api/me', { method: 'GET' });
    console.log('📡 /api/me 전체 응답:', JSON.stringify(result, null, 2));
    
    if (result && result.success && result.user) {
      console.log('✅ 서버에서 사용자 정보 수신:', result.user);
      console.log('🔍 user_kv 상세:', result.user.user_kv);
      fillProfileForm(result.user);
      showProfileMessage('사용자 정보가 로드되었습니다.', 'success');
    } else {
      console.log('❌ 사용자 정보 응답 형식이 올바르지 않습니다:', result);
      showProfileMessage('사용자 정보를 불러올 수 없습니다. 다시 로그인해주세요.');
    }
  } catch (error) {
    console.error('❌ 사용자 정보 로드 오류:', error);
    showProfileMessage('로그인 후 내 정보를 확인할 수 있습니다.');
  }
}

// 프로필 폼에 사용자 정보 채우기
function fillProfileForm(user) {
  console.log('📝 프로필 폼에 사용자 정보 채우기:', user);
  console.log('🔍 user_kv 내용:', user.user_kv);
  
  // DOM 요소 존재 여부 먼저 확인
  const profileNameEl = document.getElementById('profileName');
  const profileBirthplaceEl = document.getElementById('profileBirthplace');
  const profileBirthTimeEl = document.getElementById('profileBirthTime');
  
  console.log('🔍 DOM 요소 확인:', {
    profileName: !!profileNameEl,
    profileBirthplace: !!profileBirthplaceEl,
    profileBirthTime: !!profileBirthTimeEl
  });
  
  // 기본 정보
  if (user.name && profileNameEl) {
    profileNameEl.value = user.name;
    console.log('✅ 이름 설정 완료:', user.name);
  }
  
  // 보조 정보(user_kv) 포함하여 출생지 등 채우기
  const userKv = user.user_kv || user.userKv || {};
  console.log('🔍 추출된 userKv:', userKv);
  
  // user_kv 값들은 JSON 문자열로 저장되므로 파싱
  let parsedUserKv = {};
  Object.keys(userKv).forEach(key => {
    try {
      // 서버에서 JSON.stringify로 저장했으므로 항상 파싱 시도
      parsedUserKv[key] = JSON.parse(userKv[key]);
    } catch (e) {
      // 파싱 실패 시 원본값 사용
      parsedUserKv[key] = userKv[key];
    }
  });
  console.log('🔍 파싱된 userKv:', parsedUserKv);
  
  const birthplace = user.birthplace || parsedUserKv.birthplace;
  console.log('🏠 출생지 값:', birthplace);
  if (birthplace && profileBirthplaceEl) {
    profileBirthplaceEl.value = birthplace;
    console.log('✅ 출생지 설정 완료:', birthplace);
  } else if (birthplace) {
    console.log('❌ profileBirthplace 요소를 찾을 수 없음');
  }
  
  // 생년월일 (기본 필드 우선, user_kv는 보조 정보만)
  const birthYear = user.birthYear || user.birth_year;
  const birthMonth = user.birthMonth || user.birth_month;
  const birthDay = user.birthDay || user.birth_day;
  const birthHour = user.birthHour || user.birth_hour;
  const birthTime = parsedUserKv.birth_time;
  
  console.log('📅 생년월일 정보:', { birthYear, birthMonth, birthDay, birthHour, birthTime });

  if (birthYear !== undefined) {
    const el = document.getElementById('profileYear');
    if (el) el.value = birthYear;
  }
  if (birthMonth !== undefined) {
    const el = document.getElementById('profileMonth');
    if (el) el.value = birthMonth;
  }
  if (birthDay !== undefined) {
    const el = document.getElementById('profileDay');
    if (el) el.value = birthDay;
  }
  
  // 시간: HH:MM 우선, 없으면 시(hour) 기반으로 기본값 표시
  console.log('⏰ 출생시간 요소 찾기:', profileBirthTimeEl ? '찾음' : '없음');
  if (profileBirthTimeEl) {
    if (birthTime && typeof birthTime === 'string') {
      // 형식 보정
      const t = birthTime.length === 5 ? birthTime : (birthTime + '').slice(0,5);
      profileBirthTimeEl.value = t;
      console.log('✅ 출생시간 설정 완료 (birthTime):', t);
    } else if (birthHour !== undefined && birthHour !== null && birthHour !== '') {
      const hh = String(parseInt(birthHour, 10)).padStart(2, '0');
      const timeValue = `${hh}:00`;
      profileBirthTimeEl.value = timeValue;
      console.log('✅ 출생시간 설정 완료 (birthHour):', timeValue);
    } else {
      console.log('❌ 출생시간 데이터 없음');
    }
  }
  
  // 달력 타입
  const calendarType = user.calendarType || user.calendar_type || parsedUserKv.calendar_type;
  console.log('📅 달력 타입:', calendarType);
  if (calendarType) {
    const calendarRadio = document.querySelector(`input[name="calendarType"][value="${calendarType}"]`);
    if (calendarRadio) {
      calendarRadio.checked = true;
      console.log('✅ 달력 타입 설정 완료:', calendarType);
    }
  }
  
  // 성별
  const sex = user.sex || parsedUserKv.sex;
  console.log('👤 성별:', sex);
  if (sex) {
    const sexRadio = document.querySelector(`input[name="sex"][value="${sex}"]`);
    if (sexRadio) {
      sexRadio.checked = true;
      console.log('✅ 성별 설정 완료:', sex);
    }
  }
  
  console.log('✅ 프로필 폼 채우기 완료');
}

// 프로필 메시지 표시
function showProfileMessage(message, type = 'info') {
  const resultDiv = document.getElementById('profileResult');
  if (!resultDiv) return;
  
  const color = type === 'success' ? '#4ade80' : type === 'error' ? '#f87171' : '#60a5fa';
  resultDiv.innerHTML = `<p style="color: ${color}; margin: 0;">${message}</p>`;
  resultDiv.style.display = 'block';
}

// 전역 함수로 설정
window.showServiceResult = showServiceResult;
window.closeServiceResult = closeServiceResult;
window.loadAnnouncementsForMobile = loadAnnouncementsForMobile;
window.goToHomeTop = goToHomeTop;
window.goToProfile = goToProfile;

function hideModal(modal) {
  modal.style.display = 'none';
}

// 프로필 기반으로 분석 폼 동기화
function syncFormsWithUser(user) {
  if (!user) {
    console.log('❌ syncFormsWithUser: user is null or undefined');
    return;
  }
  
  console.log('🔍 syncFormsWithUser called with user:', user);
  
  // 서버에서 오는 필드명에 맞게 수정
  const birthYear = user.birth_year || user.birthYear;
  const birthMonth = user.birth_month || user.birthMonth;
  const birthDay = user.birth_day || user.birthDay;
  const birthHour = user.birth_hour || user.birthHour;
  
  console.log('📅 Extracted birth data:', { birthYear, birthMonth, birthDay, birthHour });
  
  // 모든 폼 요소 ID 확인
  const formElements = [
    'baziYear', 'baziMonth', 'baziDay', 'baziHour',
    'astroYear', 'astroMonth', 'astroDay', 'astroHour',
    'profileYear', 'profileMonth', 'profileDay', 'profileHour'
  ];
  
  console.log('🔍 Checking form elements:');
  formElements.forEach(id => {
    const element = document.getElementById(id);
    console.log(`  ${id}: ${element ? '✅ Found' : '❌ Not found'}`);
  });
  
  // 폼 요소들이 존재하는지 먼저 확인
  const baziYearEl = document.getElementById('baziYear');
  const baziMonthEl = document.getElementById('baziMonth');
  const baziDayEl = document.getElementById('baziDay');
  const baziHourEl = document.getElementById('baziHour');
  
  console.log('🎯 Bazi form elements found:', {
    baziYear: !!baziYearEl,
    baziMonth: !!baziMonthEl,
    baziDay: !!baziDayEl,
    baziHour: !!baziHourEl
  });
  
  const set = (id, val) => { 
    const el = document.getElementById(id); 
    if (el && val !== undefined && val !== null && val !== '') {
      el.value = String(val);
      console.log(`✅ Set ${id} to ${val}`);
    } else {
      console.log(`❌ Failed to set ${id}: element=${!!el}, value=${val}`);
    }
  };
  
  // Bazi
  set('baziYear', birthYear);
  set('baziMonth', birthMonth);
  set('baziDay', birthDay);
  set('baziHour', birthHour);
  
  // Astrology
  set('astroYear', birthYear);
  set('astroMonth', birthMonth);
  set('astroDay', birthDay);
  set('astroHour', birthHour);
  
  // Profile은 기존 populateProfileForm이 처리
}

// 명리학 분석 수행 함수
async function performBaziAnalysis(user) {
  console.log('🔮 performBaziAnalysis 시작:', user);
  console.log('📱 스마트폰 여부:', window.innerWidth <= 768);
  console.log('📱 User Agent:', navigator.userAgent);
  console.log('🔍 전달받은 사용자 객체:', JSON.stringify(user, null, 2));
  console.log('🔍 현재 URL:', window.location.href);
  console.log('🔍 현재 섹션:', document.querySelector('.section.active')?.id);
  
  if (!user) {
    console.log('❌ 사용자 정보가 없습니다.');
    return;
  }
  
  // 사용자 정보 검증 및 로깅
  console.log('🔍 사용자 ID:', user.uid || user.id);
  console.log('🔍 사용자 이름:', user.name);
  console.log('🔍 사용자 이메일:', user.email);
  
  // 사용자 생년월일 정보 추출 (서버 응답 형식에 맞춤)
  const birthYear = user.birthYear || user.birth_year;
  const birthMonth = user.birthMonth || user.birth_month;
  const birthDay = user.birthDay || user.birth_day;
  const birthHour = user.birthHour || user.birth_hour;
  
  console.log('🔍 추출된 생년월일 정보:', { birthYear, birthMonth, birthDay, birthHour });
  console.log('🔍 원본 사용자 객체 필드:', {
    birthYear: user.birthYear,
    birth_year: user.birth_year,
    birthMonth: user.birthMonth,
    birth_month: user.birth_month,
    birthDay: user.birthDay,
    birth_day: user.birth_day,
    birthHour: user.birthHour,
    birth_hour: user.birth_hour
  });
  
  if (!birthYear || !birthMonth || !birthDay) {
    console.log('❌ 생년월일 정보가 불완전합니다:', { birthYear, birthMonth, birthDay, birthHour });
    return;
  }
  
  console.log('📅 분석할 생년월일:', { birthYear, birthMonth, birthDay, birthHour });
  
  // 내 사주 정보 표시 업데이트 (메시지 없이)
  const myBaziInfo = document.getElementById('myBaziInfo');
  if (myBaziInfo) {
    // 스마트폰에서는 간단하게, PC에서는 상세하게
    if (window.innerWidth <= 768) {
    myBaziInfo.innerHTML = `
        <p style="color: white; margin: 0; font-weight: 500; text-align: center;">
          <strong>${user.name || '사용자'}</strong> | ${birthYear}.${birthMonth}.${birthDay} ${birthHour || 0}시
        </p>
        <p style="color: white; margin: 3px 0 0 0; font-weight: 500; text-align: center; font-size: 0.85rem;">
          <strong>장소:</strong> ${user.birthPlace || '서울'}
        </p>
      `;
    } else {
      myBaziInfo.innerHTML = `
        <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 12px; padding: 15px; border: 1px solid rgba(255, 255, 255, 0.2);">
          <p style="color: white; margin: 0; font-weight: 500;">
            <strong>생년월일:</strong> ${birthYear}년 ${birthMonth}월 ${birthDay}일 ${birthHour || 0}시
          </p>
          <p style="color: white; margin: 5px 0 0 0; font-weight: 500;">
            <strong>이름:</strong> ${user.name || '사용자'}
          </p>
          <p style="color: white; margin: 5px 0 0 0; font-weight: 500;">
            <strong>장소:</strong> ${user.birthPlace || '서울'}
          </p>
      </div>
    `;
    }
  }
  
  // 로딩 표시
  console.log('🔍 DOM 요소 검색 시작');
  const baziResult = document.getElementById('baziResult');
  console.log('🔍 baziResult 요소:', baziResult ? '찾음' : '없음');
  
  if (baziResult) {
    console.log('✅ 로딩 표시 설정');
    baziResult.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>🔮 명리학 분석 중...</p>
      </div>
    `;
  } else {
    console.error('❌ baziResult 요소를 찾을 수 없습니다');
    console.error('❌ 현재 DOM 상태:', document.body.innerHTML.substring(0, 500));
  }
  
  try {
    // 디버깅: 전송할 데이터 로그
    const requestData = {
      birth_year: parseInt(birthYear),
      birth_month: parseInt(birthMonth),
      birth_day: parseInt(birthDay),
      birth_hour: parseInt(birthHour) || 12
    };
    console.log('📤 전송할 데이터:', requestData);
    console.log('🔑 인증 토큰:', localStorage.getItem('authToken'));
    console.log('🌐 API URL:', 'http://localhost:3000/api/bazi');
    
    // 명리학 API 호출 (서버 형식에 맞춤)
    console.log('🌐 API 호출 시작');
    console.log('🌐 요청 URL:', 'http://localhost:3000/api/bazi');
    console.log('🌐 요청 헤더:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    
    // 스마트폰에서 접근 가능한 API URL 결정
    const isMobile = window.innerWidth <= 768;
    const apiBaseUrl = isMobile ? 'http://192.168.1.17:3000' : 'http://localhost:3000';
    const apiUrl = `${apiBaseUrl}/api/bazi`;
    
    console.log('🌐 API URL 결정:', apiUrl);
    console.log('📱 모바일 여부:', isMobile);
    
    // 스마트폰에서 네트워크 타임아웃 설정
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30초 타임아웃
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(requestData),
      signal: controller.signal
    }).catch(error => {
      clearTimeout(timeoutId);
      console.error('❌ Fetch 오류:', error);
      console.error('❌ 오류 타입:', error.name);
      console.error('❌ 오류 메시지:', error.message);
      
      if (error.name === 'AbortError') {
        throw new Error('네트워크 타임아웃: 서버 응답이 30초를 초과했습니다.');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('네트워크 연결 실패: 인터넷 연결을 확인해주세요.');
      } else {
        throw error;
      }
    });
    
    clearTimeout(timeoutId);
    
    console.log('📥 응답 상태:', response.status, response.statusText);
    
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
      } catch (textError) {
        errorText = '응답 텍스트를 읽을 수 없습니다.';
      }
      console.error('❌ 서버 오류 응답:', errorText);
      
      if (response.status === 401) {
        console.log('🔐 토큰 만료 또는 무효, 자동 로그아웃 실행');
        logout();
        throw new Error('인증 오류: 로그인이 필요합니다. 다시 로그인해주세요.');
      } else if (response.status === 403) {
        throw new Error('권한 오류: 접근이 거부되었습니다.');
      } else if (response.status === 404) {
        throw new Error('API 엔드포인트를 찾을 수 없습니다.');
      } else if (response.status === 500) {
        throw new Error('서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error(`서버 오류 (${response.status}): ${errorText}`);
      }
    }
    
    const result = await response.json();
    console.log('✅ 명리학 분석 결과:', result);
    
    if (result.success && result.result) {
      displayBaziResult(result.result, result.result.answers);
    } else {
      // 기존 API로 폴백
      console.log('🔄 기존 API로 폴백');
      await performBaziAnalysisFallback(user);
    }
    
  } catch (error) {
    console.error('❌ 명리학 분석 오류:', error);
    console.error('❌ 오류 타입:', error.name);
    console.error('❌ 오류 메시지:', error.message);
    console.error('❌ 오류 스택:', error.stack);
    console.error('❌ User Agent:', navigator.userAgent);
    console.error('❌ 화면 크기:', window.innerWidth + 'x' + window.innerHeight);
    
    // 기존 API로 폴백
    console.log('🔄 기존 API로 폴백');
    try {
    await performBaziAnalysisFallback(user);
    } catch (fallbackError) {
      console.error('❌ 폴백 분석도 실패:', fallbackError);
      
      // 최종 오류 표시
      const resultContainer = document.getElementById('baziResult');
      if (resultContainer) {
        resultContainer.innerHTML = `
          <div class="error-container">
            <div class="error-icon">⚠️</div>
            <h3>분석 중 오류가 발생했습니다</h3>
            <p><strong>원본 오류:</strong> ${error.name}: ${error.message}</p>
            <p><strong>폴백 오류:</strong> ${fallbackError.name}: ${fallbackError.message}</p>
            <p><strong>브라우저:</strong> ${navigator.userAgent}</p>
            <p><strong>화면 크기:</strong> ${window.innerWidth}x${window.innerHeight}</p>
            <button onclick="performBaziAnalysis(currentUser)" class="retry-btn">다시 시도</button>
          </div>
        `;
      }
    }
  }
}

// 기존 API 폴백 함수
async function performBaziAnalysisFallback(user) {
  try {
    const birthYear = user.birthYear || user.birth_year;
    const birthMonth = user.birthMonth || user.birth_month;
    const birthDay = user.birthDay || user.birth_day;
    const birthHour = user.birthHour || user.birth_hour;
    
    // 디버깅: 폴백 API 전송 데이터 로그
    const fallbackData = {
      birth_year: parseInt(birthYear),
      birth_month: parseInt(birthMonth),
      birth_day: parseInt(birthDay),
      birth_hour: parseInt(birthHour) || 12
    };
    console.log('📤 폴백 API 전송 데이터:', fallbackData);
    
    // 스마트폰에서 접근 가능한 API URL 결정 (폴백)
    const isMobile = window.innerWidth <= 768;
    const apiBaseUrl = isMobile ? 'http://192.168.1.17:3000' : 'http://localhost:3000';
    const fallbackApiUrl = `${apiBaseUrl}/api/bazi/simple`;
    
    console.log('🌐 폴백 API URL 결정:', fallbackApiUrl);
    console.log('📱 모바일 여부:', isMobile);
    
    // 스마트폰에서 네트워크 타임아웃 설정 (폴백)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30초 타임아웃
    
    const response = await fetch(fallbackApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(fallbackData),
      signal: controller.signal
    }).catch(error => {
      clearTimeout(timeoutId);
      console.error('❌ 폴백 Fetch 오류:', error);
      console.error('❌ 오류 타입:', error.name);
      console.error('❌ 오류 메시지:', error.message);
      
      if (error.name === 'AbortError') {
        throw new Error('폴백 네트워크 타임아웃: 서버 응답이 30초를 초과했습니다.');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('폴백 네트워크 연결 실패: 인터넷 연결을 확인해주세요.');
      } else {
        throw error;
      }
    });
    
    clearTimeout(timeoutId);
    
    console.log('📥 폴백 응답 상태:', response.status, response.statusText);
    
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
      } catch (textError) {
        errorText = '응답 텍스트를 읽을 수 없습니다.';
      }
      console.error('❌ 폴백 서버 오류 응답:', errorText);
      
      if (response.status === 401) {
        console.log('🔐 토큰 만료 또는 무효, 자동 로그아웃 실행');
        logout();
        throw new Error('폴백 인증 오류: 로그인이 필요합니다. 다시 로그인해주세요.');
      } else if (response.status === 403) {
        throw new Error('폴백 권한 오류: 접근이 거부되었습니다.');
      } else if (response.status === 404) {
        throw new Error('폴백 API 엔드포인트를 찾을 수 없습니다.');
      } else if (response.status === 500) {
        throw new Error('폴백 서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        throw new Error(`폴백 서버 오류 (${response.status}): ${errorText}`);
      }
    }
    
    const data = await response.json();
    console.log('🔮 Bazi 분석 결과 (폴백):', data);
    
    if (data.success && data.result) {
      displayBaziResult(data.result, null);
    } else {
      throw new Error('분석 결과가 올바르지 않습니다.');
    }
    
  } catch (error) {
    console.error('❌ Bazi 분석 오류 (폴백):', error);
    console.error('❌ 오류 타입:', error.name);
    console.error('❌ 오류 메시지:', error.message);
    console.error('❌ 오류 스택:', error.stack);
    console.error('❌ User Agent:', navigator.userAgent);
    console.error('❌ 화면 크기:', window.innerWidth + 'x' + window.innerHeight);
    
    const resultContainer = document.getElementById('baziResult');
    if (resultContainer) {
      resultContainer.innerHTML = `
        <div class="error-container">
          <div class="error-icon">⚠️</div>
          <h3>분석 중 오류가 발생했습니다</h3>
          <p><strong>오류 타입:</strong> ${error.name}</p>
          <p><strong>오류 메시지:</strong> ${error.message}</p>
          <p><strong>브라우저:</strong> ${navigator.userAgent}</p>
          <p><strong>화면 크기:</strong> ${window.innerWidth}x${window.innerHeight}</p>
          <button onclick="performBaziAnalysis(currentUser)" class="retry-btn">다시 시도</button>
        </div>
      `;
    }
  }
}

// 명리학 결과 표시 함수
function displayBaziResult(baziResult, answers) {
  console.log('📊 displayBaziResult 호출:', { baziResult, answers });
  console.log('📱 스마트폰 여부:', window.innerWidth <= 768);
  
  const resultContainer = document.getElementById('baziResult');
  if (!resultContainer) {
    console.error('❌ baziResult 컨테이너를 찾을 수 없습니다.');
    return;
  }
  
  console.log('✅ baziResult 컨테이너 찾음:', resultContainer);
  
  // 새로운 API 응답 형식 처리
  if (baziResult.pillars && baziResult.five_elements) {
    // 새로운 상용 등급 API 응답
    const pillars = baziResult.pillars;
    const dayMaster = baziResult.pillars.day.stem;
    const dayElement = baziResult.pillars.day.element;
    const elementCounts = baziResult.five_elements;
    const tenGodsStrength = baziResult.ten_gods_strength;
    const usefulGods = baziResult.useful_god;
    const timeline = baziResult.timeline;
    
    // 강한/약한 오행 찾기
    const strongestElement = Object.entries(elementCounts)
      .reduce((a, b) => elementCounts[a[0]] > elementCounts[b[0]] ? a : b)[0];
    const weakestElement = Object.entries(elementCounts)
      .reduce((a, b) => elementCounts[a[0]] < elementCounts[b[0]] ? a : b)[0];
    
    console.log('🔄 새로운 API 형식으로 결과 표시');
    displayNewBaziResult(pillars, dayMaster, dayElement, elementCounts, tenGodsStrength, usefulGods, timeline, answers, strongestElement, weakestElement);
  } else {
    // 기존 API 응답 형식
    console.log('🔄 기존 API 형식으로 결과 표시');
    const pillars = baziResult.pillars;
    const dayMaster = baziResult.dayMaster;
    const dayElement = baziResult.dayElement;
    const elementCounts = baziResult.elementCounts;
    
    displayLegacyBaziResult(pillars, dayMaster, dayElement, elementCounts, answers);
  }
  
  console.log('✅ 결과 표시 완료');
  
  // 결과가 실제로 표시되었는지 확인
  setTimeout(() => {
    const resultContainer = document.getElementById('baziResult');
    if (resultContainer) {
      console.log('🔍 결과 컨테이너 내용 확인:', resultContainer.innerHTML.substring(0, 200) + '...');
      console.log('🔍 결과 컨테이너 표시 상태:', resultContainer.style.display);
      console.log('🔍 결과 컨테이너 가시성:', resultContainer.style.visibility);
      console.log('🔍 결과 컨테이너 높이:', resultContainer.offsetHeight);
    }
  }, 1000);
}

// 새로운 상용 등급 API 결과 표시
function displayNewBaziResult(pillars, dayMaster, dayElement, elementCounts, tenGodsStrength, usefulGods, timeline, answers, strongestElement, weakestElement) {
  const resultContainer = document.getElementById('baziResult');
  
  resultContainer.innerHTML = `
    <div class="bazi-analysis-result">
      <!-- 사주 기둥 표시 -->
      <div class="pillars-section">
        <h3 class="result-title">📊 사주 기둥</h3>
        <div class="pillars-grid">
          <div class="pillar-item">
            <div class="pillar-label">년주</div>
            <div class="pillar-content">
              <span class="stem">${pillars.year.stem}</span>
              <span class="branch">${pillars.year.branch}</span>
            </div>
          </div>
          <div class="pillar-item">
            <div class="pillar-label">월주</div>
            <div class="pillar-content">
              <span class="stem">${pillars.month.stem}</span>
              <span class="branch">${pillars.month.branch}</span>
            </div>
          </div>
          <div class="pillar-item">
            <div class="pillar-label">일주</div>
            <div class="pillar-content">
              <span class="stem">${pillars.day.stem}</span>
              <span class="branch">${pillars.day.branch}</span>
            </div>
          </div>
          <div class="pillar-item">
            <div class="pillar-label">시주</div>
            <div class="pillar-content">
              <span class="stem">${pillars.hour.stem}</span>
              <span class="branch">${pillars.hour.branch}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 기본 정보 -->
      <div class="basic-info-section">
        <h3 class="result-title">🔍 기본 정보</h3>
        <div class="info-grid">
          <div class="info-item">
            <strong>일간:</strong> ${dayMaster}
          </div>
          <div class="info-item">
            <strong>일간 오행:</strong> ${dayElement}
          </div>
          <div class="info-item">
            <strong>강한 오행:</strong> ${strongestElement}
          </div>
          <div class="info-item">
            <strong>약한 오행:</strong> ${weakestElement}
          </div>
          <div class="info-item">
            <strong>용신 후보:</strong> ${usefulGods.join(', ')}
          </div>
        </div>
      </div>
      
      <!-- 오행 분포 -->
      <div class="elements-section">
        <h3 class="result-title">⚖️ 오행 분포</h3>
        <div class="elements-chart">
          ${Object.entries(elementCounts).map(([element, count]) => `
            <div class="element-bar">
              <div class="element-label">${element}</div>
              <div class="element-progress">
                <div class="element-fill" style="width: ${(count / Math.max(...Object.values(elementCounts))) * 100}%"></div>
              </div>
              <div class="element-count">${Math.round(count * 100)}%</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- 십신 강도 -->
      <div class="ten-gods-section">
        <h3 class="result-title">🎯 십신 강도</h3>
        <div class="ten-gods-chart">
          ${Object.entries(tenGodsStrength).map(([god, strength]) => `
            <div class="ten-god-bar">
              <div class="ten-god-label">${getTenGodName(god)}</div>
              <div class="ten-god-progress">
                <div class="ten-god-fill" style="width: ${strength * 100}%"></div>
              </div>
              <div class="ten-god-strength">${Math.round(strength * 100)}%</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- 핵심 질문 답변 -->
      ${answers && answers.length > 0 ? `
        <div class="answers-section">
          <h3 class="result-title">🎯 핵심 질문 답변</h3>
          <div class="answers-grid">
            ${answers.map((answer, index) => `
              <div class="answer-card">
                <div class="answer-header">
                  <span class="answer-number">${index + 1}</span>
                  <h4 class="answer-topic">${answer.topic}</h4>
                </div>
                <div class="answer-content">
                  <p class="answer-one-liner"><strong>${answer.one_liner}</strong></p>
                  <div class="answer-why">
                    <strong>근거:</strong> ${answer.why}
                  </div>
                  <div class="answer-detail">
                    ${answer.detail.map(detail => `<p>${detail}</p>`).join('')}
                  </div>
                  <div class="answer-todo">
                    <strong>실행 체크리스트:</strong>
                    <ul>
                      ${answer.todo.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <!-- 타임라인 -->
      ${timeline ? `
        <div class="timeline-section">
          <h3 class="result-title">📅 운세 타임라인</h3>
          <div class="timeline-content">
            <div class="luck-pillars">
              <h4>대운 (10년 단위)</h4>
              ${timeline.luck_pillars.map(pillar => `
                <div class="luck-pillar-item">
                  <span class="period">${pillar.period}</span>
                  <span class="pillar">${pillar.pillar}</span>
                  <span class="theme">${pillar.theme}</span>
                </div>
              `).join('')}
            </div>
            <div class="annual-pillars">
              <h4>세운 (연간)</h4>
              ${timeline.annual.map(pillar => `
                <div class="annual-pillar-item">
                  <span class="year">${pillar.year}</span>
                  <span class="pillar">${pillar.pillar}</span>
                  <span class="focus">${pillar.focus}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// 기존 API 결과 표시 (호환성)
function displayLegacyBaziResult(pillars, dayMaster, dayElement, elementCounts, answers) {
  const resultContainer = document.getElementById('baziResult');
  
  resultContainer.innerHTML = `
    <div class="bazi-analysis-result">
      <!-- 사주 기둥 표시 -->
      <div class="pillars-section">
        <h3 class="result-title">📊 사주 기둥</h3>
        <div class="pillars-grid">
          <div class="pillar-item">
            <div class="pillar-label">년주</div>
            <div class="pillar-content">
              <span class="stem">${pillars.year.stem}</span>
              <span class="branch">${pillars.year.branch}</span>
            </div>
          </div>
          <div class="pillar-item">
            <div class="pillar-label">월주</div>
            <div class="pillar-content">
              <span class="stem">${pillars.month.stem}</span>
              <span class="branch">${pillars.month.branch}</span>
            </div>
          </div>
          <div class="pillar-item">
            <div class="pillar-label">일주</div>
            <div class="pillar-content">
              <span class="stem">${pillars.day.stem}</span>
              <span class="branch">${pillars.day.branch}</span>
            </div>
          </div>
          <div class="pillar-item">
            <div class="pillar-label">시주</div>
            <div class="pillar-content">
              <span class="stem">${pillars.hour.stem}</span>
              <span class="branch">${pillars.hour.branch}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 기본 정보 -->
      <div class="basic-info-section">
        <h3 class="result-title">🔍 기본 정보</h3>
        <div class="info-grid">
          <div class="info-item">
            <strong>일간:</strong> ${dayMaster}
          </div>
          <div class="info-item">
            <strong>일간 오행:</strong> ${dayElement}
          </div>
        </div>
      </div>
      
      <!-- 오행 분포 -->
      <div class="elements-section">
        <h3 class="result-title">⚖️ 오행 분포</h3>
        <div class="elements-chart">
          ${Object.entries(elementCounts).map(([element, count]) => `
            <div class="element-bar">
              <div class="element-label">${element}</div>
              <div class="element-progress">
                <div class="element-fill" style="width: ${(count / Math.max(...Object.values(elementCounts))) * 100}%"></div>
              </div>
              <div class="element-count">${count}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// 십신 이름 변환 함수
function getTenGodName(god) {
  const tenGodNames = {
    'wealth': '재성',
    'officer': '관성',
    'output': '식상',
    'resource': '인성',
    'peer': '비겁'
  };
  return tenGodNames[god] || god;
}

// 사용자 상태 업데이트 함수 수정
function updateUserState(user, token, forceHomeRedirect = true) {
  console.log('🔄 updateUserState called with:', { user, token: token ? 'present' : 'missing', forceHomeRedirect });
  
  if (user && token) {
    // 서버에서 받은 birth_year 형식을 birthYear 형식으로 변환
    const normalizedUser = {
      ...user,
      birthYear: user.birthYear || user.birth_year,
      birthMonth: user.birthMonth || user.birth_month,
      birthDay: user.birthDay || user.birth_day,
      birthHour: user.birthHour || user.birth_hour
    };
    
    currentUser = normalizedUser;
    authToken = token;
    
    // localStorage에 저장
    localStorage.setItem('currentUser', JSON.stringify(normalizedUser));
    localStorage.setItem('authToken', token);
    
    console.log('💾 User data saved to localStorage');
    
    // UI 업데이트
    const userInfo = document.querySelector('.user-info');
    const authButtons = document.querySelector('.auth-buttons');
    const adminAccessBtn = document.getElementById('adminAccessBtn');
    
    if (userInfo) {
      userInfo.innerHTML = `
        <span class="user-name">${user.name}</span>
        <button onclick="logout()" class="logout-btn">로그아웃</button>
      `;
      userInfo.style.display = 'flex';
    }
    
    if (authButtons) {
      authButtons.style.display = 'none';
    }
    
    // 관리자 버튼 표시 (PC에서만)
    if (adminAccessBtn) {
      adminAccessBtn.style.display = 'flex';
      console.log('✅ 관리자 버튼 표시됨');
    } else {
      console.log('❌ 관리자 버튼을 찾을 수 없음');
    }
    
    console.log('🎨 UI updated for logged in user');
    
    // 내 사주 정보 표시 업데이트
    updateMyBaziInfo(normalizedUser);
    
    // 폼에 사용자 데이터 자동 입력
    console.log('🔄 About to sync forms with user data');
    syncFormsWithUser(normalizedUser);
    
    // 분석 기록 로드
    loadAnalysisHistory();
    
    // 모바일 헤더 업데이트
    updateMobileHeader();
    
    // 강제 홈 화면 이동이 활성화된 경우에만 홈 화면 관련 작업 실행
    if (forceHomeRedirect) {
      // 홈 화면 콘텐츠 업데이트
      updateHomeContent(normalizedUser);
      changeSection('home');
      console.log('🏠 로그인 완료, 홈 화면으로 이동');
    } else {
      // 새로고침 시에는 현재 화면의 콘텐츠만 업데이트
      const currentSection = document.body.getAttribute('data-section') || 'home';
      if (currentSection === 'home') {
        updateHomeContent(normalizedUser);
      }
      console.log('🏠 로그인 상태 복원 완료, 현재 화면 유지:', currentSection);
    }
    
    console.log('✅ updateUserState completed successfully');
  } else {
    console.log('❌ updateUserState: Invalid user or token - 로그아웃 상태로 설정');
    
    // 전역 변수 초기화
    currentUser = null;
    authToken = null;
    
    // 로그아웃 상태일 때 UI 업데이트
    const userInfo = document.querySelector('.user-info');
    const authButtons = document.querySelector('.auth-buttons');
    const adminAccessBtn = document.getElementById('adminAccessBtn');
    
    if (userInfo) {
      userInfo.style.display = 'none';
    }
    
    if (authButtons) {
      authButtons.style.display = 'flex';
    }
    
    // 관리자 버튼 숨김 (로그아웃 상태)
    if (adminAccessBtn) {
      adminAccessBtn.style.display = 'none';
      console.log('❌ 관리자 버튼 숨김 (로그아웃 상태)');
    }
    
    // 모바일 헤더 업데이트
    updateMobileHeader();
    
    // 홈 화면을 로그인 화면으로 업데이트
    updateHomeContent(null);
    
    console.log('🎨 UI updated for logged out user');
  }
}

// 자동 Bazi 분석 함수
async function autoAnalyzeBazi(user) {
  console.log('🔮 autoAnalyzeBazi 시작:', user);
  
  if (!user || !user.birth_year || !user.birth_month || !user.birth_day) {
    console.log('❌ 사용자 생년월일 정보 부족');
    return;
  }
  
  try {
    const data = {
      birth_year: user.birth_year,
      birth_month: user.birth_month,
      birth_day: user.birth_day,
      birth_hour: user.birth_hour || 0
    };
    
    console.log('📊 Bazi 분석 데이터:', data);
    
    const result = await apiRequest('/api/bazi', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (result.success) {
      console.log('✅ 자동 Bazi 분석 성공');
      displayBaziResult(result.result);
    } else {
      console.log('❌ 자동 Bazi 분석 실패:', result.error);
    }
  } catch (error) {
    console.error('🚨 자동 Bazi 분석 오류:', error);
  }
}

// 친구 분석 결과 저장소
let friendsResults = [];

// 친구 분석 함수
async function analyzeRelationship(formData) {
  if (!currentUser) {
    alert('로그인이 필요합니다.');
    return;
  }
  
  showLoading();
  
  try {
    const data = {
      friendName: formData.get('friendName'),
      birth_year: parseInt(formData.get('year')),
      birth_month: parseInt(formData.get('month')),
      birth_day: parseInt(formData.get('day')),
      birth_hour: parseInt(formData.get('hour')),
      relationshipType: formData.get('relationshipType')
    };
    
    console.log('🔗 관계 분석 데이터:', data);
    
    const result = await apiRequest('/api/relationship', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (result.success) {
      console.log('✅ 관계 분석 성공:', result);
      
      // 친구 결과를 저장
      const friendResult = {
        id: Date.now(), // 임시 ID
        name: data.friendName,
        relationshipType: data.relationshipType,
        result: result.result,
        timestamp: new Date().toISOString()
      };
      
      friendsResults.push(friendResult);
      
      // 친구 목록 업데이트
      updateFriendsList();
      
      // 폼 초기화
      document.getElementById('friendBaziForm').reset();
      
      alert(`${data.friendName}님과의 관계 분석이 완료되었습니다!`);
    } else {
      console.log('❌ 관계 분석 실패:', result.error);
      alert('관계 분석에 실패했습니다: ' + result.error);
    }
  } catch (error) {
    console.error('🚨 관계 분석 오류:', error);
    alert('관계 분석 중 오류가 발생했습니다.');
  } finally {
    hideLoading();
  }
}

// 친구 목록 업데이트
function updateFriendsList() {
  const friendsList = document.getElementById('friendsList');
  
  // friendsList 요소가 존재하지 않으면 함수 종료
  if (!friendsList) {
    console.log('⚠️ friendsList 요소를 찾을 수 없음 - 친구 목록 업데이트 건너뜀');
    return;
  }
  
  if (friendsResults.length === 0) {
    friendsList.innerHTML = '<p style="color: rgba(255,255,255,0.6); text-align: center; padding: 20px;">아직 분석한 친구가 없습니다.</p>';
  } else {
    friendsList.innerHTML = friendsResults.map(friend => {
      const relationshipText = {
        'romantic': '연인',
        'friend': '친구',
        'family': '가족',
        'colleague': '동료',
        'business': '비즈니스'
      }[friend.relationshipType] || friend.relationshipType;
      
      return `
        <div class="friend-item" onclick="showFriendResult(${friend.id})">
          <span class="friend-name">${friend.name}</span>
          <span class="relationship-type">(${relationshipText})</span>
        </div>
      `;
    }).join('');
  }
  
  // 사용자 이름 옆의 친구 수 업데이트
  updateUserFriendCount();
}

// 사용자 친구 수 업데이트 함수
function updateUserFriendCount() {
  if (!currentUser) {
    console.log('⚠️ currentUser가 없음 - 친구 수 업데이트 건너뜀');
    return;
  }
  
  const userInfo = document.querySelector('.user-info');
  if (!userInfo) {
    console.log('⚠️ .user-info 요소를 찾을 수 없음 - 친구 수 업데이트 건너뜀');
    return;
  }
  
    const friendCount = friendsResults.length;
    const friendBadge = friendCount > 0 ? `<span class="friend-count-badge">${friendCount}</span>` : '';
    
    const userNameSpan = userInfo.querySelector('.user-name');
    if (userNameSpan) {
      userNameSpan.innerHTML = `${currentUser.name}${friendBadge}`;
  } else {
    console.log('⚠️ .user-name 요소를 찾을 수 없음 - 친구 수 업데이트 건너뜀');
  }
}

// 내 사주 정보 표시 함수
function updateMyBaziInfo(user) {
  const myBaziInfo = document.getElementById('myBaziInfo');
  if (!myBaziInfo) {
    console.log('⚠️ myBaziInfo 요소를 찾을 수 없음 - 사주 정보 업데이트 건너뜀');
    return;
  }
  
  if (user && (user.birthYear || user.birth_year) && (user.birthMonth || user.birth_month) && (user.birthDay || user.birth_day)) {
    const hourNames = ['자시(23-01)', '축시(01-03)', '인시(03-05)', '묘시(05-07)', '진시(07-09)', '사시(09-11)', 
                      '오시(11-13)', '미시(13-15)', '신시(15-17)', '유시(17-19)', '술시(19-21)', '해시(21-23)'];
    
    const birthHour = (user.birthHour || user.birth_hour) !== null && (user.birthHour || user.birth_hour) !== undefined ? 
                     hourNames[user.birthHour || user.birth_hour] || `${user.birthHour || user.birth_hour}시` : '미입력';
    
    // 스마트폰에서는 간단하게, PC에서는 상세하게
    if (window.innerWidth <= 768) {
    myBaziInfo.innerHTML = `
        <p style="color: white; margin: 0; font-weight: 500; text-align: center;">
          <strong>${user.name || '사용자'}</strong> | ${user.birthYear || user.birth_year}.${user.birthMonth || user.birth_month}.${user.birthDay || user.birth_day} ${birthHour}
        </p>
        <p style="color: white; margin: 3px 0 0 0; font-weight: 500; text-align: center; font-size: 0.85rem;">
          <strong>장소:</strong> ${user.birth_place || '서울'}
        </p>
      `;
    } else {
      myBaziInfo.innerHTML = `
        <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 12px; padding: 15px; border: 1px solid rgba(255, 255, 255, 0.2);">
          <p style="color: white; margin: 0; font-weight: 500;">
            <strong>생년월일:</strong> ${user.birthYear || user.birth_year}년 ${user.birthMonth || user.birth_month}월 ${user.birthDay || user.birth_day}일 ${birthHour}
          </p>
          <p style="color: white; margin: 5px 0 0 0; font-weight: 500;">
            <strong>이름:</strong> ${user.name || '사용자'}
          </p>
          <p style="color: white; margin: 5px 0 0 0; font-weight: 500;">
            <strong>장소:</strong> ${user.birthPlace || user.birth_place || '서울'}
          </p>
      </div>
    `;
    }
  } else {
    myBaziInfo.innerHTML = `
      <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 12px; padding: 15px; border: 1px solid rgba(255, 255, 255, 0.2);">
        <p style="color: white; margin: 0; font-weight: 500; text-align: center;">
          로그인 후 사주 분석을 이용하실 수 있습니다.
        </p>
      </div>
    `;
  }
}

// 친구 결과 표시
function showFriendResult(friendId) {
  const friend = friendsResults.find(f => f.id === friendId);
  if (!friend) return;
  
  // 모든 친구 아이템에서 active 클래스 제거
  document.querySelectorAll('.friend-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // 클릭된 친구 아이템에 active 클래스 추가
  const clickedItem = event.target.closest('.friend-item');
  if (clickedItem) {
    clickedItem.classList.add('active');
  }
  
  // 친구 결과 표시
  displayFriendResult(friend);
}

// 친구 결과 표시 함수
function displayFriendResult(friend) {
  const resultContainer = document.getElementById('selectedFriendResult');
  
  if (!friend || !friend.result) {
    resultContainer.innerHTML = '<p style="color: red;">결과를 불러올 수 없습니다.</p>';
    return;
  }
  
  const result = friend.result;
  
  resultContainer.innerHTML = `
    <div class="relationship-analysis">
      <div class="relationship-header">
        <h3 class="relationship-title">${result.title}</h3>
        <p class="relationship-subtitle">${result.subtitle}</p>
      </div>
      
      <div class="compatibility-score">
        <div class="score-circle score-${result.gradeClass}">
          <span class="score-number">${result.compatibilityScore}</span>
          <span class="score-label">점</span>
        </div>
        <div class="score-text">
          <h4>호환성 등급: ${result.compatibilityGrade}</h4>
        </div>
      </div>
      
      <div class="relationship-details">
        <div class="relationship-aspect">
          <div class="aspect-title">
            <span class="aspect-icon">💬</span>
            소통
          </div>
          <div class="aspect-content">${result.analysis.communication || result.analysis.teamwork || result.analysis.understanding || result.analysis.partnership}</div>
        </div>
        
        <div class="relationship-aspect">
          <div class="aspect-title">
            <span class="aspect-icon">🤝</span>
            신뢰/지원
          </div>
          <div class="aspect-content">${result.analysis.trust || result.analysis.support || result.analysis.respect}</div>
        </div>
        
        <div class="relationship-aspect">
          <div class="aspect-title">
            <span class="aspect-icon">🌟</span>
            특별한 요소
          </div>
          <div class="aspect-content">${result.analysis.passion || result.analysis.fun || result.analysis.harmony || result.analysis.communication}</div>
        </div>
        
        <div class="relationship-aspect">
          <div class="aspect-title">
            <span class="aspect-icon">🚀</span>
            미래 전망
          </div>
          <div class="aspect-content">${result.analysis.longTerm || result.analysis.growth || result.analysis.tradition || result.analysis.success}</div>
        </div>
      </div>
      
      <div class="relationship-advice">
        <h4 class="advice-title">💡 조언</h4>
        <div class="advice-list">
          ${result.advice.general.map(advice => `<p>• ${advice}</p>`).join('')}
          ${result.advice.specific.map(advice => `<p>• ${advice}</p>`).join('')}
        </div>
      </div>
      
      <div class="relationship-info">
        <p><strong>나이 차이:</strong> ${result.details.ageDifference}세</p>
        <p><strong>관계 유형:</strong> ${result.details.relationshipType}</p>
        <p><strong>분석 시간:</strong> ${new Date(friend.timestamp).toLocaleString('ko-KR')}</p>
      </div>
    </div>
  `;
}

// API 요청 헬퍼 함수
async function apiRequest(url, options = {}) {
  console.log('🌐 API 요청:', url, options);
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include' // 쿠키 포함
  };
  
  // Authorization 헤더는 제거하고 쿠키를 사용
  // 서버에서 httpOnly 쿠키로 토큰을 처리하므로
  
  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    console.log('📡 API 응답 상태:', response.status, response.statusText);
    
    const data = await response.json().catch(() => ({}));
    console.log('📡 API 응답 데이터:', data);
    
    if (!response.ok) {
      // 인증 오류인 경우 로그인 상태 초기화
      if (response.status === 401) {
        console.log('❌ 인증 오류, 로그인 상태 초기화');
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        currentUser = null;
        authToken = null;
        throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
      }
      throw new Error(data.error || `요청 실패 (${response.status})`);
    }
    
    return data;
  } catch (err) {
    if (err instanceof TypeError) {
      // 네트워크 오류 또는 서버 미실행
      throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    }
    throw err;
  }
}

async function checkServerHealth() {
  try {
    await apiRequest('/api/health');
    console.log('서버 연결 정상');
  } catch (e) {
    console.warn('서버 헬스체크 실패:', e.message);
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '16px';
    container.style.left = '16px';
    container.style.zIndex = '3000';
    container.style.background = 'rgba(255,0,0,0.9)';
    container.style.color = '#fff';
    container.style.padding = '10px 14px';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    container.textContent = '서버에 연결할 수 없습니다. npm run dev로 서버를 실행해주세요.';
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 6000);
  }
}

// 생시 파싱 함수 (HH:mm 형식을 정수로 변환)
function parseBirthTime(timeValue) {
  if (!timeValue) return 0;
  
  // 이미 정수인 경우
  if (typeof timeValue === 'number' || /^\d+$/.test(timeValue)) {
    return parseInt(timeValue);
  }
  
  // HH:mm 형식인 경우
  if (typeof timeValue === 'string' && timeValue.includes(':')) {
    const [hours] = timeValue.split(':');
    return parseInt(hours) || 0;
  }
  
  return 0;
}

// 회원가입 함수
async function register(formData) {
  console.log('🚀 register 함수 호출됨');
  showLoading();
  
  try {
    // 폼 데이터 디버깅
    console.log('📋 폼 데이터 원본:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    // 필드 값 직접 추출 (더 안전한 방법)
    const email = formData.get('email') || document.getElementById('registerEmail')?.value;
    const password = formData.get('password') || document.getElementById('registerPassword')?.value;
    const name = formData.get('name') || document.getElementById('registerNameSignup')?.value;
    const birthYear = formData.get('birthYear') || document.getElementById('registerYearSignup')?.value;
    const birthMonth = formData.get('birthMonth') || document.getElementById('registerMonthSignup')?.value;
    const birthDay = formData.get('birthDay') || document.getElementById('registerDaySignup')?.value;
    const birthTime = formData.get('birthTime') || document.getElementById('registerBirthTimeSignup')?.value;
    const birthplace = formData.get('birthplace') || document.getElementById('registerBirthplaceSignup')?.value;
    
    console.log('🔍 직접 추출한 필드 값들:');
    console.log('  email:', email);
    console.log('  password:', password);
    console.log('  name:', name);
    console.log('  birthYear:', birthYear);
    console.log('  birthMonth:', birthMonth);
    console.log('  birthDay:', birthDay);
    console.log('  birthTime:', birthTime);
    console.log('  birthplace:', birthplace);
    
    const data = {
      name: name,
      username: email, // username은 email과 동일하게 설정
      email: email,
      password: password,
      birth_year: parseInt(birthYear) || 0,
      birth_month: parseInt(birthMonth) || 0,
      birth_day: parseInt(birthDay) || 0,
      birth_hour: parseBirthTime(birthTime) || 0,
      birthplace: birthplace || '',
      calendar_type: 'solar',
      sex: 'male',
      time_accuracy: 'exact'
    };
    
    console.log('📝 최종 회원가입 데이터:', data);
    console.log('📧 이메일:', data.email);
    console.log('👤 이름:', data.name);
    console.log('🔒 비밀번호 길이:', data.password?.length);
    
    const result = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    console.log('📡 회원가입 API 응답:', result);
    
    if (result.success) {
      console.log('✅ 회원가입 성공, 사용자 상태 업데이트 중');
      updateUserState(result.user, result.token, true);
      hideModal(registerModal);
      alert('회원가입이 완료되었습니다!');
      
      // 홈 화면으로 자동 이동
      console.log('🏠 홈 화면으로 자동 이동');
      changeSection('home');
      
      // 폼 데이터 자동 입력 확인
      setTimeout(() => {
        console.log(' 폼 데이터 자동 입력 확인');
        syncFormsWithUser(result.user);
      }, 500);
      
    } else {
      console.log('❌ 회원가입 실패:', result.error);
      
      // 구체적인 오류 메시지 처리
      if (result.error === 'email_exists') {
        alert('이미 사용 중인 이메일입니다.\n다른 이메일을 사용해주세요.');
      } else if (result.error === 'username_exists') {
        alert('이미 사용 중인 사용자명입니다.\n다른 사용자명을 사용해주세요.');
      } else if (result.error === 'password_too_short') {
        alert('비밀번호는 8자 이상이어야 합니다.\n더 긴 비밀번호를 입력해주세요.');
      } else if (result.error === 'missing_required_fields') {
        alert('필수 정보가 누락되었습니다.\n이름, 이메일, 비밀번호를 모두 입력해주세요.');
      } else {
        // 서버에서 제공한 메시지가 있으면 사용, 없으면 기본 메시지
        const message = result.message || '회원가입에 실패했습니다. 다시 시도해주세요.';
        alert(message);
      }
    }
  } catch (error) {
    console.error('🚨 회원가입 오류:', error);
    alert('회원가입 중 오류가 발생했습니다.');
  } finally {
    hideLoading();
  }
}

// 로그인 함수
async function login(formData) {
  console.log('🚀 login 함수 호출됨');
  showLoading();
  
  try {
    // 폼 데이터 디버깅
    console.log('📋 로그인 폼 데이터:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    // 필드 값 직접 추출 (더 안전한 방법)
    const email = formData.get('email') || document.getElementById('loginEmail')?.value;
    const password = formData.get('password') || document.getElementById('loginPassword')?.value;
    
    console.log('🔍 직접 추출한 로그인 필드 값들:');
    console.log('  email:', email);
    console.log('  password:', password);
    
    const data = {
      email: email,
      password: password
    };
    
    console.log('🔐 로그인 시도:', data.email);
    console.log('🔒 비밀번호 길이:', data.password?.length);
    
    const result = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    console.log('📡 로그인 API 응답:', result);
    
    if (result.success) {
      console.log('✅ 로그인 성공, 사용자 상태 업데이트 중');
      updateUserState(result.user, result.token, true);
      
      // 모바일 헤더 업데이트
      updateMobileHeader();
      
      hideModal(loginModal);
      alert('로그인되었습니다!');
      
      // 홈 화면으로 자동 이동
      console.log('🏠 홈 화면으로 자동 이동');
      changeSection('home');
      
    } else {
      console.log('❌ 로그인 실패:', result.error);
      
      // 구체적인 오류 메시지 처리
      if (result.error === 'user_not_found') {
        const shouldRegister = confirm('해당 이메일로 가입된 회원이 없습니다.\n\n회원가입을 진행하시겠습니까?');
        if (shouldRegister) {
          hideModal(loginModal);
          showModal(registerModal);
          // 회원가입 폼에 이메일 자동 입력
          const registerEmail = document.getElementById('registerEmail');
          if (registerEmail) {
            registerEmail.value = data.email;
          }
        }
      } else if (result.error === 'invalid_password') {
        alert('비밀번호가 올바르지 않습니다.\n다시 확인해주세요.');
      } else {
        // 서버에서 제공한 메시지가 있으면 사용, 없으면 기본 메시지
        const message = result.message || '로그인에 실패했습니다. 다시 시도해주세요.';
        alert(message);
      }
    }
  } catch (error) {
    console.error('🚨 로그인 오류:', error);
    alert('로그인 중 오류가 발생했습니다.');
  } finally {
    hideLoading();
  }
}

// 쿠키에서 토큰 가져오기
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// 사용자 상태 확인 및 복원
async function checkAuthFromCookie() {
  console.log('🔍 인증 상태 확인 중...');
  
  try {
    // localStorage에서 사용자 정보 확인
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      console.log('💾 localStorage에서 사용자 정보 발견');
      const user = JSON.parse(storedUser);
      
      // 사용자 정보 정규화
      const normalizedUser = {
        ...user,
        birthYear: user.birthYear || user.birth_year,
        birthMonth: user.birthMonth || user.birth_month,
        birthDay: user.birthDay || user.birth_day,
        birthHour: user.birthHour || user.birth_hour
      };
      
      currentUser = normalizedUser;
      authToken = storedToken;
      
      // UI 업데이트 (updateUserState 내부에서 updateHomeContent 호출됨)
      updateUserState(normalizedUser, storedToken, false); // 세 번째 매개변수로 홈 화면 강제 이동 방지
      
      console.log('✅ localStorage에서 로그인 상태 복원됨:', user.name);
      return;
    }
    
    // 쿠키에서 토큰 확인 (기존 로직)
    const token = getCookie('token');
    if (token) {
      console.log('🔐 쿠키에서 토큰 발견, 사용자 정보 로드 중...');
      const result = await loadUserProfile();
      if (result && result.user) {
        console.log('✅ 쿠키에서 로그인 상태 복원됨:', result.user.name);
        updateUserState(result.user, getCookie('token'), false); // 세 번째 매개변수로 홈 화면 강제 이동 방지
      }
    } else {
      console.log('❌ 인증 정보 없음, 로그아웃 상태');
      updateUserState(null, null, false);
    }
  } catch (error) {
    console.error('🚨 인증 상태 확인 오류:', error);
    updateUserState(null, null, false);
  }
}

// 사용자 프로필 로드
async function loadUserProfile() {
  try {
    const result = await apiRequest('/api/me');
    if (result.user) {
      console.log('👤 사용자 프로필 로드됨:', result.user);
      updateUserState(result.user, getCookie('token'), false);
      // 프로필 폼에 사용자 정보 채우기
      populateProfileForm(result.user);
      return result;
    } else {
      console.log('❌ 사용자 프로필 없음');
      updateUserState(null, null, false);
      return null;
    }
  } catch (error) {
    console.error('🚨 프로필 로드 오류:', error);
    updateUserState(null, null, false);
    return null;
  }
}

// 프로필 폼에 사용자 정보 채우기
function populateProfileForm(user) {
  if (!user) return;
  
  console.log('📝 populateProfileForm 호출:', user);
  
  // 서버에서 오는 필드명에 맞게 수정
  const birthYear = user.birth_year || user.birthYear;
  const birthMonth = user.birth_month || user.birthMonth;
  const birthDay = user.birth_day || user.birthDay;
  const birthHour = user.birth_hour || user.birthHour;
  
  console.log('📅 추출된 생년월일:', { birthYear, birthMonth, birthDay, birthHour });
  
  document.getElementById('profileName').value = user.name || '';
  document.getElementById('profileYear').value = birthYear || '';
  document.getElementById('profileMonth').value = birthMonth || '';
  document.getElementById('profileDay').value = birthDay || '';
  document.getElementById('profileHour').value = birthHour || '';
  
  console.log('✅ 프로필 폼 채우기 완료');
}

// 사용자 정보 업데이트
async function updateProfile(formData) {
  showLoading();
  
  try {
    const data = {
      name: formData.get('name'),
      // 기본 생년월일시
      birthYear: parseInt(formData.get('birthYear')),
      birthMonth: parseInt(formData.get('birthMonth')),
      birthDay: parseInt(formData.get('birthDay')),
      birthHour: (function(){
        // HH:MM에서 시만 서버의 기본 필드로 전송
        const t = formData.get('birthTime');
        if (t && /\d{2}:\d{2}/.test(t)) return parseInt(t.split(':')[0], 10);
        const h = formData.get('birthHour');
        return h ? parseInt(h, 10) : undefined;
      })(),
      // 보조 정보 (user_kv에 저장)
      birthplace: formData.get('birthplace') || undefined,
      calendarType: formData.get('calendarType') || undefined,
      sex: formData.get('sex') || undefined,
      timeAccuracy: formData.get('timeAccuracy') || undefined,
      birth_time: (function(){
        const t = formData.get('birthTime');
        if (t && /\d{2}:\d{2}/.test(t)) return t;
        return undefined;
      })()
    };
    console.log('👤 프로필 업데이트 요청 데이터:', data);
    
    const result = await apiRequest('/api/user', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    console.log('✅ 프로필 업데이트 서버 응답:', result);
    
    currentUser = result.user;
    const userNameEl = document.getElementById('userName');
    if (userNameEl) userNameEl.textContent = result.user.name;
    
    const profileResult = document.getElementById('profileResult');
    // TODO: i18n 키로 교체 필요 (다국어 지원)
    profileResult.innerHTML = '<p style="color: #4ade80;" data-i18n="profile.update.success">정보가 성공적으로 업데이트되었습니다.</p>';
    
    // 업데이트 후 최신 정보 다시 로드
    setTimeout(() => {
      loadUserProfileData();
    }, 500);
    
  } catch (error) {
    console.error('Profile update error:', error);
    const profileResult = document.getElementById('profileResult');
    if (profileResult) {
      // TODO: i18n 키로 교체 필요 (다국어 지원)
      profileResult.innerHTML = `<p style="color:#f87171;" data-i18n="profile.update.error">정보 저장 실패: ${error.message}</p>`;
      profileResult.style.display = 'block';
    }
  } finally {
    hideLoading();
  }
}

// 분석 기록 로드
async function loadAnalysisHistory() {
  if (!authToken) return;
  
  try {
    const result = await apiRequest('/api/readings');
    displayAnalysisHistory(result.readings);
  } catch (error) {
    console.error('History load error:', error);
  }
}

// 분석 기록 표시
function displayAnalysisHistory(readings) {
  const historyList = document.getElementById('historyList');
  const list = Array.isArray(readings) ? readings : [];
  
  if (list.length === 0) {
    historyList.innerHTML = '<p style="text-align: center; color: white;">아직 분석 기록이 없습니다.</p>';
    return;
  }
  
  historyList.innerHTML = list.map(reading => {
    const date = new Date(reading.createdAt).toLocaleDateString('ko-KR');
    const type = reading.type === 'bazi' ? '사주명리학' : '서양점성술';
    
    let content = '';
    if (reading.type === 'bazi') {
      content = `년주: ${reading.result?.yearPillar || ''}, 월주: ${reading.result?.monthPillar || ''}, 일주: ${reading.result?.dayPillar || ''}, 시주: ${reading.result?.hourPillar || ''}`;
    } else {
      content = `태양궁: ${reading.result?.sunSign || ''}, 운세: ${reading.result?.fortune || ''}`;
    }
    
    return `
      <div class="history-item">
        <div class="history-header">
          <span class="history-type">${type}</span>
          <span class="history-date">${date}</span>
        </div>
        <div class="history-content">
          ${content}
        </div>
      </div>
    `;
  }).join('');
}

// 사주 분석 함수
async function analyzeBazi(formData) {
  if (!authToken) {
    alert('로그인이 필요합니다.');
    return;
  }
  showLoading();
  try {
    const data = {
      birth_year: parseInt(formData.get('year') || (currentUser && (currentUser.birth_year || currentUser.birthYear))),
      birth_month: parseInt(formData.get('month') || (currentUser && (currentUser.birth_month || currentUser.birthMonth))),
      birth_day: parseInt(formData.get('day') || (currentUser && (currentUser.birth_day || currentUser.birthDay))),
      birth_hour: parseInt(formData.get('hour') || (currentUser && (currentUser.birth_hour || currentUser.birthHour)) || 0)
    };
    
    console.log('🔮 Bazi 분석 데이터:', data);
    
    const result = await apiRequest('/api/bazi', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (result.success) {
      console.log('✅ Bazi 분석 성공:', result);
      displayBaziResult(result.result);
    } else {
      console.log('❌ Bazi 분석 실패:', result.error);
      const c = document.getElementById('baziResult');
      if (c) c.innerHTML = `<p style="color:red">사주 분석 실패: ${result.error}</p>`;
    }
  } catch (error) {
    console.error('Bazi analysis error:', error);
    const c = document.getElementById('baziResult');
    if (c) c.innerHTML = `<p style="color:red">사주 분석 실패: ${error.message}</p>`;
    alert(error.message);
  } finally {
    hideLoading();
  }
}

// 점성술 사용자 정보 새로고침 함수
function refreshAstrologyUserInfo() {
  console.log('🔄 점성술 회원정보 새로고침 시작');
  
  // localStorage에서 사용자 정보 확인
  const storedUser = localStorage.getItem('currentUser');
  const storedToken = localStorage.getItem('authToken');
  
  if (storedUser && storedToken) {
    console.log('💾 localStorage에서 사용자 정보 발견');
    const user = JSON.parse(storedUser);
    currentUser = user;
    authToken = storedToken;
    
    console.log('✅ 회원정보 새로고침 완료:', currentUser);
    
    // 점성술 정보 표시 업데이트
    updateAstrologyInfo(user);
    
    // 폼에 사용자 정보 자동 채우기
    populateAstrologyForm(user);
    
    // 토스트 메시지 표시
    showMobileToast('사용자 정보가 새로고침되었습니다!', 'success');
  } else {
    console.log('❌ localStorage에 사용자 정보 없음');
    
    // 서버에서 로그인 상태 확인
    checkLoginStatus();
    
    // 토스트 메시지 표시
    showMobileToast('로그인이 필요합니다.', 'error');
  }
}

// 사용자 정보로 점성술 분석 함수
async function analyzeWithUserInfo() {
  // 이미 로딩 중이면 중복 실행 방지
  // 기존 로딩 요소 정리
  const existingLoading = document.getElementById('mobileLoading');
  if (existingLoading) {
    existingLoading.remove();
  }
  
  // 이미 로딩 중이면 중복 실행 방지 (더 정확한 체크)
  const loadingElements = document.querySelectorAll('.mobile-loading, #mobileLoading');
  if (loadingElements.length > 0) {
    return;
  }
  
  // 사용자 정보 확인
  const storedUser = localStorage.getItem('currentUser');
  
  if (!storedUser) {
    showMobileToast('사용자 정보가 없습니다. 먼저 로그인해주세요.', 'error');
    return;
  }
  
  // 사용자 정보 업데이트
  currentUser = JSON.parse(storedUser);
  authToken = localStorage.getItem('authToken');
  
  // 사용자 정보에서 생년월일시 추출
  const userBirthYear = currentUser?.birthYear || currentUser?.birth_year;
  const userBirthMonth = currentUser?.birthMonth || currentUser?.birth_month;
  const userBirthDay = currentUser?.birthDay || currentUser?.birth_day;
  const userBirthHour = currentUser?.birthHour || currentUser?.birth_hour;
  
  if (!userBirthYear || !userBirthMonth || !userBirthDay) {
    showMobileToast('사용자 정보에 생년월일이 없습니다. 내 정보에서 생년월일을 설정해주세요.', 'error');
    return;
  }
  
  showMobileLoading('👤 사용자 정보로 점성술 분석 중...');
  
  // 강제 종료 타이머 설정 (30초 후 자동 종료)
  const forceStopTimer = setTimeout(() => {
    hideMobileLoading();
    const c = document.getElementById('astrologyResult');
    if (c) c.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: orange;">
        <h3>⏰ 분석 시간 초과</h3>
        <p>분석이 30초를 초과했습니다.</p>
        <p>네트워크 상태를 확인하고 다시 시도해주세요.</p>
        <button onclick="location.reload()" style="background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin-top: 1rem; cursor: pointer;">
          🔄 페이지 새로고침
        </button>
      </div>
    `;
  }, 30000);
  
  try {
    const data = {
      birth_year: parseInt(userBirthYear),
      birth_month: parseInt(userBirthMonth),
      birth_day: parseInt(userBirthDay),
      birth_hour: parseInt(userBirthHour || 0)
    };
    
    const result = await apiRequest('/api/astrology', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (result.success) {
      // 분석 완료 후 폼 숨기기
      const astrologyForm = document.getElementById('astrologyForm');
      if (astrologyForm) {
        astrologyForm.style.display = 'none';
      }
      
      // 결과 표시
      displayAstrologyResult(result.result);
      showMobileToast('사용자 정보로 점성술 분석이 완료되었습니다!', 'success');
    } else {
      const c = document.getElementById('astrologyResult');
      if (c) c.innerHTML = `<p style="color:red">점성술 분석 실패: ${result.error}</p>`;
      showMobileToast('점성술 분석에 실패했습니다.', 'error');
    }
  } catch (error) {
    console.error('❌ 사용자 정보 분석 오류:', error);
    const c = document.getElementById('astrologyResult');
    if (c) c.innerHTML = `<p style="color:red">점성술 분석 실패: ${error.message}</p>`;
    showMobileToast('점성술 분석 중 오류가 발생했습니다.', 'error');
  } finally {
    // 강제 종료 타이머 정리
    clearTimeout(forceStopTimer);
    
    // 로딩 스피너 숨기기
    hideMobileLoading();
    
    // 추가 안전장치: DOM에서 로딩 요소 강제 제거
    const loadingElements = document.querySelectorAll('.mobile-loading, #mobileLoading');
    loadingElements.forEach(el => {
      el.remove();
    });
  }
}

// 점성술 분석 함수
async function analyzeAstrology(formData) {
  // 이미 로딩 중이면 중복 실행 방지
  // 기존 로딩 요소 정리
  const existingLoading = document.getElementById('mobileLoading');
  if (existingLoading) {
    existingLoading.remove();
  }
  
  // 이미 로딩 중이면 중복 실행 방지 (더 정확한 체크)
  const loadingElements = document.querySelectorAll('.mobile-loading, #mobileLoading');
  if (loadingElements.length > 0) {
    return;
  }
  
  showMobileLoading('🔮 점성술 분석 중...');
  
  // 강제 종료 타이머 설정 (30초 후 자동 종료)
  const forceStopTimer = setTimeout(() => {
    hideMobileLoading();
    const c = document.getElementById('astrologyResult');
    if (c) c.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: orange;">
        <h3>⏰ 분석 시간 초과</h3>
        <p>분석이 30초를 초과했습니다.</p>
        <p>네트워크 상태를 확인하고 다시 시도해주세요.</p>
        <button onclick="location.reload()" style="background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin-top: 1rem; cursor: pointer;">
          🔄 페이지 새로고침
        </button>
      </div>
    `;
  }, 30000);
  
  try {
    // 사용자 정보 확인 (선택적)
    const storedUser = localStorage.getItem('currentUser');
    let userData = null;
    
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      authToken = localStorage.getItem('authToken');
      
      // 사용자 정보에서 생년월일시 추출 (다양한 필드명 지원)
      const userBirthYear = currentUser?.birthYear || currentUser?.birth_year;
      const userBirthMonth = currentUser?.birthMonth || currentUser?.birth_month;
      const userBirthDay = currentUser?.birthDay || currentUser?.birth_day;
      const userBirthHour = currentUser?.birthHour || currentUser?.birth_hour;
      
      // 폼에 입력된 데이터가 있으면 무조건 폼 데이터 사용, 없을 때만 사용자 정보 사용
      const formYear = formData.get('year');
      const formMonth = formData.get('month');
      const formDay = formData.get('day');
      const formHour = formData.get('hour');
      
      if (formYear && formMonth && formDay) {
        // 폼에 모든 필수 데이터가 있으면 폼 데이터 사용
        userData = {
          birth_year: parseInt(formYear),
          birth_month: parseInt(formMonth),
          birth_day: parseInt(formDay),
          birth_hour: parseInt(formHour || 0)
        };
      } else {
        // 폼 데이터가 부족하면 사용자 정보 사용
        userData = {
          birth_year: parseInt(userBirthYear),
          birth_month: parseInt(userBirthMonth),
          birth_day: parseInt(userBirthDay),
          birth_hour: parseInt(userBirthHour || 0)
        };
      }
    } else {
      // 폼 데이터만 사용
      userData = {
        birth_year: parseInt(formData.get('year')),
        birth_month: parseInt(formData.get('month')),
        birth_day: parseInt(formData.get('day')),
        birth_hour: parseInt(formData.get('hour') || 0)
      };
    }
    
    const result = await apiRequest('/api/astrology', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (result.success) {
      // 분석 완료 후 폼 숨기기
      const astrologyForm = document.getElementById('astrologyForm');
      if (astrologyForm) {
        astrologyForm.style.display = 'none';
      }
      
      // 결과 표시
      displayAstrologyResult(result.result);
      showMobileToast('점성술 분석이 완료되었습니다!', 'success');
    } else {
      const c = document.getElementById('astrologyResult');
      if (c) c.innerHTML = `<p style="color:red">점성술 분석 실패: ${result.error}</p>`;
      showMobileToast('점성술 분석에 실패했습니다.', 'error');
    }
  } catch (error) {
    console.error('❌ Astrology analysis error:', error);
    const c = document.getElementById('astrologyResult');
    if (c) c.innerHTML = `<p style="color:red">점성술 분석 실패: ${error.message}</p>`;
    showMobileToast('점성술 분석 중 오류가 발생했습니다.', 'error');
  } finally {
    // 강제 종료 타이머 정리
    clearTimeout(forceStopTimer);
    
    // 로딩 스피너 숨기기
    hideMobileLoading();
    
    // 추가 안전장치: DOM에서 로딩 요소 강제 제거
    const loadingElements = document.querySelectorAll('.mobile-loading, #mobileLoading');
    loadingElements.forEach(el => {
      el.remove();
    });
  }
}

// 유틸: 접이식 카드 토글
function attachExpertToggles(container) {
  container.querySelectorAll('.expert-card .expert-header').forEach(h => {
    h.addEventListener('click', () => {
      const card = h.closest('.expert-card');
      card.classList.toggle('active');
      const t = h.querySelector('.expert-toggle');
      if (t) t.textContent = card.classList.contains('active') ? '−' : '+';
    });
  });
}

// 오행 클래스 반환 함수
function getElementClass(element) {
  const elementClasses = {
    '목': 'wood',
    '화': 'fire', 
    '토': 'earth',
    '금': 'metal',
    '수': 'water'
  };
  return elementClasses[element] || 'default';
}

// 오행 한자명 반환 함수
function getElementName(element) {
  const elementNames = {
    '목': '木 (나무)',
    '화': '火 (불)',
    '토': '土 (흙)',
    '금': '金 (쇠)',
    '수': '水 (물)'
  };
  return elementNames[element] || element;
}

// 홈 화면 콘텐츠 업데이트
function updateHomeContent(user) {
  const guestContent = document.getElementById('guestContent');
  const userContent = document.getElementById('userContent');
  
  if (user) {
    // 로그인 상태
    guestContent.style.display = 'none';
    userContent.style.display = 'block';
  } else {
    // 비로그인 상태
    guestContent.style.display = 'block';
    userContent.style.display = 'none';
  }
}

// 사주 결과 표시 (전문가급 상세 분석)
function displayBaziResult(result) {
  const resultContainer = document.getElementById('baziResult');
  if (!result || typeof result !== 'object') {
    resultContainer.innerHTML = '<p style="color:red">사주 결과를 불러오지 못했습니다.</p>';
    return;
  }

  // 새로운 전문가 해석 결과 처리
  if (result.interpretation && result.interpretation.answers) {
    console.log('🔮 전문가 해석 결과:', result);
    console.log('🔮 대운 데이터 확인:', result.futureLuck);
    displayExpertInterpretation(result, resultContainer);
    return;
  }

  const safe = (v, d='') => (v===undefined||v===null?d:v);

  // 기존 사주 분석 구조에 맞게 표시
  const pillars = result.pillars || {};
  const elementAnalysis = result.elementAnalysis || {};
  const lifeStages = result.lifeStages || {};
  const personality = result.personality || {};
  const career = result.career || {};
  const love = result.love || {};
  const health = result.health || {};
  const finance = result.finance || {};
  const monthlyFortune = result.monthlyFortune || [];
  const expertAdvice = result.expertAdvice || {};
  const improvementMethods = result.improvementMethods || {};
  const specialNotes = result.specialNotes || {};

  resultContainer.innerHTML = `
    <div class="bazi-result-header">
      <h3>🔮 전문가 사주 분석 결과</h3>
      <div class="result-title">${safe(result.title)}</div>
      <p class="result-description">${safe(result.description)}</p>
    </div>

    <!-- 1. 사주 기둥 정보 -->
    <div class="analysis-section">
      <h4>📊 사주 기둥 분석</h4>
      <div class="bazi-pillars">
        <div class="pillar-container">
          <div class="pillar-item year-pillar">
            <div class="pillar-header">
              <div class="pillar-label">년주</div>
              <div class="pillar-element-badge ${getElementClass(safe(pillars.year?.element))}">${safe(pillars.year?.element)}</div>
            </div>
            <div class="pillar-content">
              <div class="stem-branch">
                <div class="stem">${safe(pillars.year?.stem)}</div>
                <div class="branch">${safe(pillars.year?.branch)}</div>
              </div>
              <div class="element-info">
                <div class="element-name">${getElementName(safe(pillars.year?.element))}</div>
              </div>
            </div>
          </div>
          
          <div class="pillar-item month-pillar">
            <div class="pillar-header">
              <div class="pillar-label">월주</div>
              <div class="pillar-element-badge ${getElementClass(safe(pillars.month?.element))}">${safe(pillars.month?.element)}</div>
            </div>
            <div class="pillar-content">
              <div class="stem-branch">
                <div class="stem">${safe(pillars.month?.stem)}</div>
                <div class="branch">${safe(pillars.month?.branch)}</div>
              </div>
              <div class="element-info">
                <div class="element-name">${getElementName(safe(pillars.month?.element))}</div>
              </div>
            </div>
          </div>
          
          <div class="pillar-item day-pillar">
            <div class="pillar-header">
              <div class="pillar-label">일주</div>
              <div class="pillar-element-badge ${getElementClass(safe(pillars.day?.element))}">${safe(pillars.day?.element)}</div>
            </div>
            <div class="pillar-content">
              <div class="stem-branch">
                <div class="stem">${safe(pillars.day?.stem)}</div>
                <div class="branch">${safe(pillars.day?.branch)}</div>
              </div>
              <div class="element-info">
                <div class="element-name">${getElementName(safe(pillars.day?.element))}</div>
              </div>
            </div>
          </div>
          
          <div class="pillar-item hour-pillar">
            <div class="pillar-header">
              <div class="pillar-label">시주</div>
              <div class="pillar-element-badge ${getElementClass(safe(pillars.hour?.element))}">${safe(pillars.hour?.element)}</div>
            </div>
            <div class="pillar-content">
              <div class="stem-branch">
                <div class="stem">${safe(pillars.hour?.stem)}</div>
                <div class="branch">${safe(pillars.hour?.branch)}</div>
              </div>
              <div class="element-info">
                <div class="element-name">${getElementName(safe(pillars.hour?.element))}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 오행 분석 -->
    <div class="analysis-section">
      <h4>⚖️ 오행 균형 분석</h4>
      <div class="element-analysis">
        <p><strong>주도 오행:</strong> ${safe(elementAnalysis.dominant)}</p>
        <p><strong>약한 오행:</strong> ${safe(elementAnalysis.weak?.join(', '), '없음')}</p>
        <p><strong>오행 조언:</strong> ${safe(elementAnalysis.advice)}</p>
      </div>
    </div>

    <!-- 3. 인생 단계별 운세 -->
    <div class="analysis-section">
      <h4>🌱 인생 단계별 운세</h4>
      <div class="life-stages">
        <div class="stage-item">
          <h5>${safe(lifeStages.early?.period)} - ${safe(lifeStages.early?.focus)}</h5>
          <p><strong>특징:</strong> ${safe(lifeStages.early?.characteristics)}</p>
          <p><strong>조언:</strong> ${safe(lifeStages.early?.advice)}</p>
          <p><strong>도전:</strong> ${safe(lifeStages.early?.challenges)}</p>
          <p><strong>기회:</strong> ${safe(lifeStages.early?.opportunities)}</p>
        </div>
        <div class="stage-item">
          <h5>${safe(lifeStages.middle?.period)} - ${safe(lifeStages.middle?.focus)}</h5>
          <p><strong>특징:</strong> ${safe(lifeStages.middle?.characteristics)}</p>
          <p><strong>조언:</strong> ${safe(lifeStages.middle?.advice)}</p>
          <p><strong>도전:</strong> ${safe(lifeStages.middle?.challenges)}</p>
          <p><strong>기회:</strong> ${safe(lifeStages.middle?.opportunities)}</p>
        </div>
        <div class="stage-item">
          <h5>${safe(lifeStages.late?.period)} - ${safe(lifeStages.late?.focus)}</h5>
          <p><strong>특징:</strong> ${safe(lifeStages.late?.characteristics)}</p>
          <p><strong>조언:</strong> ${safe(lifeStages.late?.advice)}</p>
          <p><strong>도전:</strong> ${safe(lifeStages.late?.challenges)}</p>
          <p><strong>기회:</strong> ${safe(lifeStages.late?.opportunities)}</p>
        </div>
      </div>
    </div>

    <!-- 4. 성격 분석 -->
    <div class="analysis-section">
      <h4>👤 성격 분석</h4>
      <div class="personality-analysis">
        <p><strong>주요 특성:</strong> ${safe(personality.mainTraits)}</p>
        <p><strong>강점:</strong> ${safe(personality.strengths)}</p>
        <p><strong>약점:</strong> ${safe(personality.weaknesses)}</p>
        <p><strong>사회적 스타일:</strong> ${safe(personality.socialStyle)}</p>
        <p><strong>소통 방식:</strong> ${safe(personality.communication)}</p>
      </div>
    </div>

    <!-- 5. 직업 운세 -->
    <div class="analysis-section">
      <h4>💼 직업 운세</h4>
      <div class="career-analysis">
        <p><strong>적합한 직업:</strong> ${safe(career.suitableCareers?.join(', '))}</p>
        <p><strong>성공 요인:</strong> ${safe(career.successFactors)}</p>
        <p><strong>성과 시기:</strong> ${safe(career.timing)}</p>
        <p><strong>조언:</strong> ${safe(career.advice)}</p>
      </div>
    </div>

    <!-- 6. 연애/결혼 운세 -->
    <div class="analysis-section">
      <h4>❤️ 연애/결혼 운세</h4>
      <div class="love-analysis">
        <p><strong>사랑 스타일:</strong> ${safe(love.loveStyle)}</p>
        <p><strong>이상적인 파트너:</strong> ${safe(love.idealPartner)}</p>
        <p><strong>인연 시기:</strong> ${safe(love.timing)}</p>
        <p><strong>도전:</strong> ${safe(love.challenges)}</p>
        <p><strong>조언:</strong> ${safe(love.advice)}</p>
        <p><strong>궁합:</strong> ${safe(love.compatibility)}</p>
      </div>
    </div>

    <!-- 7. 건강 운세 -->
    <div class="analysis-section">
      <h4>🏥 건강 운세</h4>
      <div class="health-analysis">
        <p><strong>강점:</strong> ${safe(health.strongPoints)}</p>
        <p><strong>주의점:</strong> ${safe(health.weakPoints)}</p>
        <p><strong>권장 운동:</strong> ${safe(health.recommendedExercise)}</p>
        <p><strong>식단 조언:</strong> ${safe(health.dietAdvice)}</p>
        <p><strong>건강 관리 시기:</strong> ${safe(health.healthTiming)}</p>
      </div>
    </div>

    <!-- 8. 재정 운세 -->
    <div class="analysis-section">
      <h4>💰 재정 운세</h4>
      <div class="finance-analysis">
        <p><strong>재정 스타일:</strong> ${safe(finance.wealthStyle)}</p>
        <p><strong>행운 시기:</strong> ${safe(finance.luckyPeriod)}</p>
        <p><strong>투자 조언:</strong> ${safe(finance.investmentAdvice)}</p>
        <p><strong>위험 관리:</strong> ${safe(finance.riskManagement)}</p>
        <p><strong>장기 계획:</strong> ${safe(finance.longTermPlanning)}</p>
      </div>
    </div>

    <!-- 9. 월별 운세 -->
    <div class="analysis-section">
      <h4>🗓 월별 운세 (12개월)</h4>
      <div class="monthly-fortune">
        ${monthlyFortune.map(month => `
          <div class="month-item">
            <div class="month-header">
              <span class="month-number">${month.month}월</span>
              <span class="month-color">${month.luckyColor}</span>
              <span class="month-number-lucky">${month.luckyNumber}</span>
            </div>
            <div class="month-fortune">${month.fortune}</div>
            <div class="month-advice">${month.advice}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- 10. 전문가 조언 -->
    <div class="analysis-section">
      <h4>🎯 전문가 조언</h4>
      <div class="expert-advice">
        <p><strong>일반적 조언:</strong> ${safe(expertAdvice.general)}</p>
        <p><strong>구체적 조언:</strong> ${safe(expertAdvice.specific)}</p>
        <p><strong>시기별 조언:</strong> ${safe(expertAdvice.timing)}</p>
        <p><strong>관계 조언:</strong> ${safe(expertAdvice.relationships)}</p>
        <p><strong>건강 조언:</strong> ${safe(expertAdvice.health)}</p>
      </div>
    </div>

    <!-- 11. 운세 개선법 -->
    <div class="analysis-section">
      <h4>✨ 운세 개선법</h4>
      <div class="improvement-methods">
        <p><strong>일상:</strong> ${safe(improvementMethods.daily)}</p>
        <p><strong>주간:</strong> ${safe(improvementMethods.weekly)}</p>
        <p><strong>월간:</strong> ${safe(improvementMethods.monthly)}</p>
        <p><strong>연간:</strong> ${safe(improvementMethods.yearly)}</p>
        <p><strong>영적 성장:</strong> ${safe(improvementMethods.spiritual)}</p>
      </div>
    </div>

    <!-- 12. 특별 주의사항 -->
    <div class="analysis-section">
      <h4>⚠️ 특별 주의사항</h4>
      <div class="special-notes">
        <p><strong>중요한 날짜:</strong> ${safe(specialNotes.importantDates?.join(', '))}</p>
        <p><strong>행운 방향:</strong> ${safe(specialNotes.luckyDirections?.join(', '))}</p>
        <p><strong>행운 숫자:</strong> ${safe(specialNotes.luckyNumbers?.join(', '))}</p>
        <p><strong>행운 색깔:</strong> ${safe(specialNotes.luckyColors?.join(', '))}</p>
        <p><strong>피해야 할 것:</strong> ${safe(specialNotes.avoid?.join(', '))}</p>
        <p><strong>증진할 것:</strong> ${safe(specialNotes.enhance?.join(', '))}</p>
      </div>
    </div>
  `;

  attachExpertToggles(resultContainer);
}

// 클라이언트에서 천간/지지 간단 설명 출력용(서버 정의 요약)
function stemInfoJS(stem){const map={
  '갑':'정직·추진', '을':'유연·조화', '병':'명랑·에너지', '정':'온화·창의', '무':'안정·현실', '기':'세심·실용', '경':'결단·전문', '신':'세련·판단', '임':'확장·지혜', '계':'직관·치유'
};return map[stem]||'';}
function branchInfoJS(branch){const map={
  '자':'지혜·시작','축':'인내·축적','인':'성장·도약','묘':'조화·미감','진':'전환·토대','사':'열정·표현','오':'명예·리더','미':'완성·축적','신':'규범·판단','유':'세련·결실','술':'전환·분배','해':'순환·치유'
};return map[branch]||'';}

// 점성술 결과 표시
function displayAstrologyResult(result) {
  const resultContainer = document.getElementById('astrologyResult');
  if (!resultContainer) {
    console.error('❌ astrologyResult 컨테이너를 찾을 수 없습니다.');
    return;
  }
  
  // 결과 데이터가 비어있으면 기본 메시지 표시
  if (!result || Object.keys(result).length === 0) {
    resultContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #666;">
        <h3>🔮 점성술 분석</h3>
        <p>분석 결과를 불러오는 중입니다...</p>
        <button onclick="location.reload()" style="background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin-top: 1rem; cursor: pointer;">
          🔄 새로고침
        </button>
      </div>
    `;
    return;
  }
  
  // 결과 데이터 안전하게 처리
  const safeResult = {
    sunSign: result?.sunSign || '별자리',
    element: result?.element || '원소',
    age: result?.age || '알 수 없음',
    characteristics: result?.characteristics || '특성 분석 중...',
    strengths: result?.strengths || '장점 분석 중...',
    weaknesses: result?.weaknesses || '주의점 분석 중...',
    career: result?.career || '적성 분석 중...',
    careerAdvice: result?.careerAdvice || '직업 조언 생성 중...',
    love: result?.love || '사랑관 분석 중...',
    relationshipAdvice: result?.relationshipAdvice || '관계 조언 생성 중...',
    period: result?.period || '현재',
    fortune: result?.fortune || '운세 분석 중...',
    fortuneAdvice: result?.fortuneAdvice || '조언 생성 중...',
    planetaryInfluence: result?.planetaryInfluence || '행성 영향 분석 중...',
    detailedAnalysis: result?.detailedAnalysis || '상세 분석 중...',
    recommendations: result?.recommendations || ['조언 생성 중...'],
    ageAdvice: result?.ageAdvice || '연령대별 조언 생성 중...',
    healthAdvice: result?.healthAdvice || '건강 조언 생성 중...',
    luckyNumbers: result?.luckyNumbers || [3, 7, 12, 21],
    luckyColors: result?.luckyColors || ['파랑', '보라', '은색'],
    luckyDays: result?.luckyDays || ['월요일', '목요일'],
    compatibility: result?.compatibility || '호환성 분석 중...',
    monthlyHoroscope: result?.monthlyHoroscope || []
  };
  
  try {
    resultContainer.innerHTML = `
      <div class="astrology-result-header">
        <h3>⭐ 점성술 분석 결과</h3>
        <div class="zodiac-sign">${safeResult.sunSign}</div>
        <div class="element-badge">${safeResult.element}의 기운</div>
        <div class="age-info">현재 나이: ${safeResult.age}세</div>
      </div>
      
      <div class="astrology-chart">
        <div class="zodiac-info">
          <h4>🌟 태양궁 특성</h4>
          <p class="characteristics">${safeResult.characteristics}</p>
        </div>
        
        <div class="zodiac-traits">
          <div class="traits-section">
            <h5>✨ 장점</h5>
            <p>${safeResult.strengths}</p>
          </div>
          <div class="traits-section">
            <h5>⚠️ 주의점</h5>
            <p>${safeResult.weaknesses}</p>
          </div>
        </div>
      </div>
      
      <div class="astrology-analysis">
        <div class="analysis-section">
          <h4>💼 적성 분석</h4>
          <p>${safeResult.career}</p>
          <div class="career-advice">
            <strong>💡 직업 조언:</strong> ${safeResult.careerAdvice}
          </div>
        </div>
        
        <div class="analysis-section">
          <h4>❤️ 사랑관</h4>
          <p>${safeResult.love}</p>
          <div class="relationship-advice">
            <strong>💡 관계 조언:</strong> ${safeResult.relationshipAdvice}
          </div>
        </div>
        
        <div class="analysis-section">
          <h4>🔮 ${safeResult.period} 운세</h4>
          <p class="fortune-prediction">${safeResult.fortune}</p>
          <div class="fortune-advice">
            <strong>💡 조언:</strong> ${safeResult.fortuneAdvice}
          </div>
        </div>
        
        <div class="analysis-section">
          <h4>🪐 행성의 영향</h4>
          <p class="planetary-influence">${safeResult.planetaryInfluence}</p>
        </div>
        
        <div class="analysis-section">
          <h4>📝 상세 분석</h4>
          <p>${safeResult.detailedAnalysis}</p>
        </div>
        
        <div class="analysis-section">
          <h4>💡 개인 조언</h4>
          <ul class="recommendations-list">
            ${safeResult.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
        
        <div class="analysis-section">
          <h4>🎯 연령대별 조언</h4>
          <p>${safeResult.ageAdvice}</p>
        </div>
        
        <div class="analysis-section">
          <h4>🏥 건강 조언</h4>
          <p>${safeResult.healthAdvice}</p>
        </div>
        
        <div class="analysis-section">
          <h4>🔢 행운 정보</h4>
          <div class="lucky-info">
            <p><strong>행운 숫자:</strong> ${safeResult.luckyNumbers.join(', ')}</p>
            <p><strong>행운 색상:</strong> ${safeResult.luckyColors.join(', ')}</p>
            <p><strong>행운 요일:</strong> ${safeResult.luckyDays.join(', ')}</p>
          </div>
        </div>
        
        <div class="analysis-section">
          <h4>💕 호환성</h4>
          <p>${safeResult.compatibility}</p>
        </div>
        
        <div class="analysis-section">
          <h4>📅 월별 운세</h4>
          <div class="monthly-horoscope">
            ${safeResult.monthlyHoroscope.map(month => `
              <div class="month-item">
                <strong>${month.month}:</strong> ${month.prediction}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <!-- 새로 분석하기 링크 -->
      <div style="text-align: center; margin-top: 2rem; padding: 1rem;">
        <button onclick="showAstrologyFormAgain()" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; text-decoration: none;">
          🔮 새로 분석하기
        </button>
      </div>
    `;
  } catch (error) {
    console.error('❌ 점성술 결과 표시 중 오류:', error);
    resultContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: red;">
        <h3>❌ 결과 표시 오류</h3>
        <p>분석 결과를 표시하는 중 오류가 발생했습니다.</p>
        <p>오류 내용: ${error.message}</p>
        <button onclick="location.reload()" style="background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin-top: 1rem; cursor: pointer;">
          🔄 페이지 새로고침
        </button>
      </div>
    `;
  }
}

// 로그인 상태 확인 함수
async function checkLoginStatus() {
  try {
    console.log('🔍 서버에서 로그인 상태 확인 중...');
    const result = await apiRequest('/api/me');
    
    if (result.success && result.user) {
      console.log('✅ 서버에서 로그인 상태 확인됨:', result.user);
      
      // 전역 변수 업데이트
      currentUser = result.user;
      authToken = 'server-session'; // 서버 세션 사용
      
      // localStorage 업데이트
      localStorage.setItem('currentUser', JSON.stringify(result.user));
      localStorage.setItem('authToken', 'server-session');
      
      // 점성술 정보 표시 업데이트
      updateAstrologyInfo(result.user);
      
      // 폼에 사용자 정보 자동 채우기
      populateAstrologyForm(result.user);
      
    } else {
      console.log('❌ 서버에서 로그인 상태 확인 실패');
      updateAstrologyInfo(null);
    }
  } catch (error) {
    console.log('❌ 로그인 상태 확인 중 오류:', error.message);
    updateAstrologyInfo(null);
  }
}

// 점성술 정보 표시 업데이트 함수
function updateAstrologyInfo(user) {
  console.log('🔮 updateAstrologyInfo 호출됨:', user);
  
  const infoDisplay = document.querySelector('#myAstrologyInfo .astrology-info-display');
  
  if (!infoDisplay) {
    console.error('❌ 점성술 정보 표시 요소를 찾을 수 없습니다.');
    console.error('🔍 #myAstrologyInfo 요소:', document.getElementById('myAstrologyInfo'));
    console.error('🔍 .astrology-info-display 요소:', document.querySelector('.astrology-info-display'));
    return;
  }
  
  console.log('✅ 점성술 정보 표시 요소 발견:', infoDisplay);
  
  if (user) {
    // 로그인 상태 - 사용자 정보 표시
    const birthYear = user.birthYear || user.birth_year;
    const birthMonth = user.birthMonth || user.birth_month;
    const birthDay = user.birthDay || user.birth_day;
    const birthHour = user.birthHour || user.birth_hour;
    const userName = user.name || '사용자';
    
    console.log('📅 추출된 사용자 정보:', { birthYear, birthMonth, birthDay, birthHour, userName });
    
    const infoHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
        <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 8px; padding: 8px; border: 1px solid rgba(255, 255, 255, 0.2); text-align: center;">
          <p style="font-weight: 500; font-size: 0.85rem; margin: 0;"><strong>생년월일:</strong><br>${birthYear}년 ${birthMonth}월 ${birthDay}일</p>
        </div>
        <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 8px; padding: 8px; border: 1px solid rgba(255, 255, 255, 0.2); text-align: center;">
          <p style="font-weight: 500; font-size: 0.85rem; margin: 0;"><strong>이름:</strong><br>${userName}</p>
        </div>
      </div>
      <p style="color: #666; font-style: italic; font-size: 0.75rem; margin: 0; text-align: center;">✅ 사주 정보 로드됨 - 자동 분석 가능</p>
    `;
    
    infoDisplay.innerHTML = infoHTML;
    
    console.log('✅ 점성술 정보 표시 업데이트 완료:', { birthYear, birthMonth, birthDay, birthHour, userName });
  } else {
    // 비로그인 상태
    const noUserHTML = `
      <p style="color: #666; font-style: italic; text-align: center;">🔮 생년월일을 입력하여 점성술 분석을 받아보세요</p>
    `;
    
    infoDisplay.innerHTML = noUserHTML;
    console.log('ℹ️ 비로그인 상태로 점성술 정보 표시 업데이트');
  }
}

// 점성술 폼 다시 표시 함수
function showAstrologyFormAgain() {
  // 폼 표시
  const astrologyForm = document.getElementById('astrologyForm');
  if (astrologyForm) {
    astrologyForm.style.display = 'block';
  }
  
  // 결과 컨테이너 내용 지우기
  const resultContainer = document.getElementById('astrologyResult');
  if (resultContainer) {
    resultContainer.innerHTML = '';
  }
  
  // 폼 옵션 초기화
  populateAstrologyFormOptions();
  
  // 로그인된 사용자가 있다면 폼에 사용자 정보 자동 채우기
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    populateAstrologyForm(user);
  }
}

// 점성술 전용 폼 옵션 생성 함수 (PC 버전과 동일한 로직)
function populateAstrologyFormOptions() {
  const yearSelect = document.getElementById('astroYear');
  const monthSelect = document.getElementById('astroMonth');
  const daySelect = document.getElementById('astroDay');
  const hourSelect = document.getElementById('astroHour');
  
  // 년도 옵션 (1900-2024)
  if (yearSelect) {
    yearSelect.innerHTML = '';
    for (let year = 2024; year >= 1900; year--) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    }
  }
  
  // 월 옵션
  if (monthSelect) {
    monthSelect.innerHTML = '';
    for (let month = 1; month <= 12; month++) {
      const option = document.createElement('option');
      option.value = month;
      option.textContent = month;
      monthSelect.appendChild(option);
    }
  }
  
  // 일 옵션
  if (daySelect) {
    daySelect.innerHTML = '';
    for (let day = 1; day <= 31; day++) {
      const option = document.createElement('option');
      option.value = day;
      option.textContent = day;
      daySelect.appendChild(option);
    }
  }
  
  // 시간 옵션
  if (hourSelect) {
    hourSelect.innerHTML = '';
    for (let hour = 0; hour <= 23; hour++) {
      const option = document.createElement('option');
      option.value = hour;
      option.textContent = `${hour.toString().padStart(2, '0')}:00`;
      hourSelect.appendChild(option);
    }
  }
}

// 점성술 폼 초기화 함수
function initializeAstrologyForm() {
  console.log('🔮 점성술 폼 초기화 시작');
  
  // 폼 요소 확인
  const astrologyForm = document.getElementById('astrologyForm');
  console.log('🔮 astrologyForm 요소:', astrologyForm ? '찾음' : '없음');
  
  if (!astrologyForm) {
    console.error('❌ astrologyForm을 찾을 수 없습니다.');
    return;
  }
  
  // 점성술 전용 폼 옵션 생성
  console.log('🔮 점성술 전용 폼 옵션 생성 시작');
  populateAstrologyFormOptions();
  
  console.log('✅ 점성술 폼 초기화 완료');
}

// 점성술 폼 수동 초기화 함수
function manualInitializeAstrologyForm() {
  console.log('🔮 점성술 폼 수동 초기화 시작');
  
  // 점성술 전용 폼 옵션 생성
  console.log('🔮 점성술 전용 폼 옵션 생성 시작');
  populateAstrologyFormOptions();
  
  console.log('✅ 점성술 폼 수동 초기화 완료');
}
function debugAstrologySection() {
  console.log('🔍 점성술 섹션 DOM 상태 확인');
  
  const elements = [
    { id: 'astrology', name: '점성술 섹션' },
    { id: 'astrologyForm', name: '점성술 폼' },
    { id: 'astroYear', name: '년도 선택' },
    { id: 'astroMonth', name: '월 선택' },
    { id: 'astroDay', name: '일 선택' },
    { id: 'astroHour', name: '시간 선택' },
    { id: 'astrologyResult', name: '결과 컨테이너' },
    { id: 'myAstrologyInfo', name: '사용자 정보 표시' }
  ];
  
  elements.forEach(element => {
    const el = document.getElementById(element.id);
    if (el) {
      console.log(`✅ ${element.name} (${element.id}): 찾음`);
      if (element.id.includes('astro') && element.id !== 'astrologyForm') {
        console.log(`  📋 ${element.name} 옵션 개수:`, el.options ? el.options.length : 'N/A');
        console.log(`  📋 ${element.name} 값:`, el.value);
      }
    } else {
      console.log(`❌ ${element.name} (${element.id}): 없음`);
    }
  });
  
  // 폼 제출 이벤트 리스너 확인
  const astrologyForm = document.getElementById('astrologyForm');
  if (astrologyForm) {
    console.log('🔍 폼 이벤트 리스너 확인:', astrologyForm);
    // 이벤트 리스너는 직접 확인할 수 없으므로 수동으로 다시 등록
    console.log('🔄 폼 이벤트 리스너 재등록 시도');
    
    // 기존 폼을 복제하여 이벤트 리스너 제거
    const newForm = astrologyForm.cloneNode(true);
    astrologyForm.parentNode.replaceChild(newForm, astrologyForm);
    
    // 새로운 이벤트 리스너 등록
    newForm.addEventListener('submit', (e) => {
      console.log('🔮 점성술 폼 제출 이벤트 발생! (디버그 재등록)');
      e.preventDefault();
      
      const formData = new FormData(newForm);
      console.log('📋 폼 데이터 생성됨:', formData);
      
      for (let [key, value] of formData.entries()) {
        console.log(`  📋 ${key}: ${value}`);
      }
      
      analyzeAstrology(formData);
    });
    
    console.log('✅ 디버그 이벤트 리스너 재등록 완료');
  }
  
  console.log('🔍 점성술 섹션 DOM 상태 확인 완료');
}
function createAstrologyFormIfNeeded() {
  console.log('🔮 점성술 폼 동적 생성 확인');
  
  const astrologyForm = document.getElementById('astrologyForm');
  
  if (!astrologyForm) {
    console.log('❌ astrologyForm이 없어서 생성합니다.');
    
    // 점성술 섹션 찾기
    const astrologySection = document.getElementById('astrology');
    if (!astrologySection) {
      console.error('❌ astrology 섹션을 찾을 수 없습니다.');
      return;
    }
    
    // 폼 HTML 생성
    const formHTML = `
      <form id="astrologyForm" class="birth-form">
        <div class="form-row">
          <div class="form-group">
            <label for="astroYear" data-i18n="form.year">출생년도</label>
            <select id="astroYear" name="year" required></select>
          </div>
          <div class="form-group">
            <label for="astroMonth" data-i18n="form.month">출생월</label>
            <select id="astroMonth" name="month" required></select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="astroDay" data-i18n="form.day">출생일</label>
            <select id="astroDay" name="day" required></select>
          </div>
          <div class="form-group">
            <label for="astroHour" data-i18n="form.hour">출생시간</label>
            <select id="astroHour" name="hour" required></select>
          </div>
        </div>
        <button type="submit" class="submit-btn" data-i18n="form.submit">🔮 점성술 분석하기</button>
        <button type="button" onclick="analyzeWithUserInfo()" class="submit-btn user-info-btn" style="background: #28a745; margin-left: 10px;">👤 내 정보로 분석</button>
      </form>
    `;
    
    // 결과 컨테이너 앞에 폼 삽입
    const resultContainer = document.getElementById('astrologyResult');
    if (resultContainer) {
      resultContainer.insertAdjacentHTML('beforebegin', formHTML);
      console.log('✅ 점성술 폼 동적 생성 완료');
      
      // 폼 초기화
      initializeAstrologyForm();
      
      // 이벤트 리스너 등록
      const newForm = document.getElementById('astrologyForm');
      if (newForm) {
        newForm.addEventListener('submit', (e) => {
          console.log('🔮 점성술 폼 제출 이벤트 발생! (동적 생성)');
          e.preventDefault();
          
          const formData = new FormData(newForm);
          console.log('📋 폼 데이터 생성됨:', formData);
          
          for (let [key, value] of formData.entries()) {
            console.log(`  📋 ${key}: ${value}`);
          }
          
          analyzeAstrology(formData);
        });
        console.log('✅ 동적 생성된 폼 이벤트 리스너 등록 완료');
      }
    } else {
      console.error('❌ astrologyResult 컨테이너를 찾을 수 없습니다.');
    }
  } else {
    console.log('✅ astrologyForm이 이미 존재합니다.');
  }
}
function forceInitializeAstrologySection() {
  console.log('🔮 점성술 섹션 강제 초기화 시작');
  
  // 점성술 섹션 확인
  const astrologySection = document.getElementById('astrology');
  console.log('🔮 astrology 섹션:', astrologySection ? '찾음' : '없음');
  
  if (!astrologySection) {
    console.error('❌ astrology 섹션을 찾을 수 없습니다.');
    return;
  }
  
  // 폼 요소들 직접 확인 및 초기화
  const elements = [
    { id: 'astrologyForm', name: '점성술 폼' },
    { id: 'astroYear', name: '년도 선택' },
    { id: 'astroMonth', name: '월 선택' },
    { id: 'astroDay', name: '일 선택' },
    { id: 'astroHour', name: '시간 선택' }
  ];
  
  elements.forEach(element => {
    const el = document.getElementById(element.id);
    console.log(`🔮 ${element.name} (${element.id}):`, el ? '찾음' : '없음');
  });
  
  // 폼 초기화 실행
  initializeAstrologyForm();
  
  // 이벤트 리스너 재등록
  const astrologyForm = document.getElementById('astrologyForm');
  if (astrologyForm) {
    console.log('🔮 이벤트 리스너 재등록 시도');
    
    // 기존 이벤트 리스너 제거
    const newForm = astrologyForm.cloneNode(true);
    astrologyForm.parentNode.replaceChild(newForm, astrologyForm);
    
    // 새로운 이벤트 리스너 등록
    newForm.addEventListener('submit', (e) => {
      console.log('🔮 점성술 폼 제출 이벤트 발생! (재등록됨)');
      e.preventDefault();
      
      const formData = new FormData(newForm);
      console.log('📋 폼 데이터 생성됨:', formData);
      
      for (let [key, value] of formData.entries()) {
        console.log(`  📋 ${key}: ${value}`);
      }
      
      analyzeAstrology(formData);
    });
    
    console.log('✅ 이벤트 리스너 재등록 완료');
  }
  
  console.log('✅ 점성술 섹션 강제 초기화 완료');
}
function populateAstrologyForm(user) {
  console.log('📝 populateAstrologyForm 호출됨:', user);
  
  if (!user) {
    console.log('❌ 사용자 정보가 없어서 폼 채우기를 건너뜁니다.');
    return;
  }
  
  // 사용자 정보에서 생년월일시 추출 (다양한 필드명 지원)
  const birthYear = user.birthYear || user.birth_year;
  const birthMonth = user.birthMonth || user.birth_month;
  const birthDay = user.birthDay || user.birth_day;
  const birthHour = user.birthHour || user.birth_hour;
  
  console.log('📅 추출된 생년월일시:', { birthYear, birthMonth, birthDay, birthHour });
  
  // 폼 요소들 찾기
  const yearSelect = document.getElementById('astroYear');
  const monthSelect = document.getElementById('astroMonth');
  const daySelect = document.getElementById('astroDay');
  const hourSelect = document.getElementById('astroHour');
  
  console.log('🔍 폼 요소들:', {
    astroYear: !!yearSelect,
    astroMonth: !!monthSelect,
    astroDay: !!daySelect,
    astroHour: !!hourSelect
  });
  
  // 년도 설정
  if (yearSelect && birthYear) {
    yearSelect.value = birthYear;
    console.log('✅ 년도 설정:', birthYear);
  } else {
    console.log('❌ 년도 설정 실패:', { yearSelect: !!yearSelect, birthYear });
  }
  
  // 월 설정
  if (monthSelect && birthMonth) {
    monthSelect.value = birthMonth;
    console.log('✅ 월 설정:', birthMonth);
  } else {
    console.log('❌ 월 설정 실패:', { monthSelect: !!monthSelect, birthMonth });
  }
  
  // 일 설정
  if (daySelect && birthDay) {
    daySelect.value = birthDay;
    console.log('✅ 일 설정:', birthDay);
  } else {
    console.log('❌ 일 설정 실패:', { daySelect: !!daySelect, birthDay });
  }
  
  // 시간 설정
  if (hourSelect && birthHour !== undefined) {
    hourSelect.value = birthHour;
    console.log('✅ 시간 설정:', birthHour);
  } else {
    console.log('❌ 시간 설정 실패:', { hourSelect: !!hourSelect, birthHour });
  }
  
  console.log('✅ 점성술 폼 사용자 정보 설정 완료:', { birthYear, birthMonth, birthDay, birthHour });
}

// 폼 초기화 함수 수정
function initializeForms() {
  // 기존 폼들 초기화
  populateYearSelect('baziYear', 1950, new Date().getFullYear());
  populateYearSelect('astroYear', 1950, new Date().getFullYear());
  populateYearSelect('profileYear', 1950, new Date().getFullYear());
  
  // 친구 폼 초기화 추가
  populateYearSelect('friendYear', 1950, new Date().getFullYear());
  
  populateMonthSelect('baziMonth');
  populateMonthSelect('astroMonth');
  populateMonthSelect('friendMonth');
  
  populateDaySelect('baziDay');
  populateDaySelect('astroDay');
  populateDaySelect('profileDay');
  populateDaySelect('friendDay');
  
  populateHourSelect('baziHour');
  populateHourSelect('astroHour');
  populateHourSelect('profileHour');
  populateHourSelect('friendHour');
}

// 이벤트 리스너 등록 함수
function attachEventListeners() {
  console.log('🔗 이벤트 리스너 등록 시작');
  
  // DOM 요소들 찾기
  const languageSelect = document.getElementById('languageSelect');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.nav-link');

  const baziForm = document.getElementById('baziForm');
  const astrologyForm = document.getElementById('astrologyForm');
  const profileForm = document.getElementById('profileForm');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const userInfo = document.getElementById('userInfo');
  const userName = document.getElementById('userName');
  const logoutBtn = document.getElementById('logoutBtn');
  const authButtons = document.getElementById('authButtons');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const openRegisterNav = document.getElementById('openRegisterNav');

  const loginModal = document.getElementById('loginModal');
  const registerModal = document.getElementById('registerModal');
  
  // 전역 변수로 설정
  window.loginModal = loginModal;
  window.registerModal = registerModal;
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const switchToRegister = document.getElementById('switchToRegister');
  const switchToLogin = document.getElementById('switchToLogin');
  const closeButtons = document.querySelectorAll('.close');
  
  // 전역 변수 초기화
  progressSteps = document.querySelectorAll('.step');
  formSteps = document.querySelectorAll('.form-step');
  
  const nextStepBtns = document.querySelectorAll('.next-step-btn');
  const prevStepBtns = document.querySelectorAll('.prev-step-btn');
  
  // 폼 옵션 초기화
  populateFormOptions();
  
  // 서버 헬스체크
  checkServerHealth();
  
  // 언어 변경 이벤트
  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      changeLanguage(e.target.value);
    });
  }
  
  // 네비게이션 토글 이벤트
  if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
  }
  
  // 네비게이션 링크 클릭 이벤트
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute('href').substring(1);
      changeSection(sectionId);
      
      // 특정 섹션에 도달했을 때 추가 작업
      if (sectionId === 'profile') {
        loadUserProfile().then(result => {
          if (result && result.user) {
            populateProfileForm(result.user);
          }
        });
      } else if (sectionId === 'history') {
        loadAnalysisHistory();
      }
    });
  });
  
  // 드롭다운 메뉴 아이템 클릭 이벤트
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const href = item.getAttribute('href');
      
      // 외부 링크인 경우 (예: numfit.html)
      if (href && !href.startsWith('#')) {
        window.location.href = href;
        return;
      }
      
      // 내부 섹션 링크인 경우
      const sectionId = href.substring(1);
      changeSection(sectionId);
      
      // 특정 섹션에 도달했을 때 추가 작업
      if (sectionId === 'profile') {
        loadUserProfile().then(result => {
          if (result && result.user) {
            populateProfileForm(result.user);
          }
        });
      } else if (sectionId === 'history') {
        loadAnalysisHistory();
      }
    });
  });
  

  
  // 관리자 로그아웃 버튼 이벤트 리스너
  const adminLogoutButton = document.getElementById('adminLogout');
  if (adminLogoutButton) {
    adminLogoutButton.addEventListener('click', adminLogout);
  }
  
  // 관리자 탭 버튼 이벤트 리스너
  const adminTabButtons = document.querySelectorAll('.tab-btn');
  adminTabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      switchAdminTab(tabName);
    });
  });
  
  // 인증 버튼 이벤트 (DOM 로딩 완료 후 실행)
  setTimeout(() => {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const openRegisterNav = document.getElementById('openRegisterNav');
    
    console.log('🔍 로그인 버튼 요소 확인:', loginBtn);
    console.log('🔍 회원가입 버튼 요소 확인:', registerBtn);
    console.log('🔍 로그아웃 버튼 요소 확인:', logoutBtn);
    
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        console.log('🔑 로그인 버튼 클릭됨');
        showModal(loginModal);
      });
      console.log('✅ 로그인 버튼 이벤트 리스너 추가 완료');
    } else {
      console.error('❌ 로그인 버튼을 찾을 수 없음');
    }
    
    if (registerBtn) {
      registerBtn.addEventListener('click', () => {
        console.log('📝 회원가입 버튼 클릭됨');
        showModal(registerModal);
      });
      console.log('✅ 회원가입 버튼 이벤트 리스너 추가 완료');
    } else {
      console.error('❌ 회원가입 버튼을 찾을 수 없음');
    }
    
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
      console.log('✅ 로그아웃 버튼 이벤트 리스너 추가 완료');
    }
    
    if (openRegisterNav) {
      openRegisterNav.addEventListener('click', (e) => { 
        e.preventDefault(); 
        showModal(registerModal); 
      });
      console.log('✅ 회원가입 네비게이션 이벤트 리스너 추가 완료');
    }
  }, 100);
  
  // 모바일 인증 버튼 이벤트 (DOM 로딩 완료 후 실행)
  setTimeout(() => {
    const mobileLoginBtn = document.querySelector('.mobile-login-btn');
    const mobileRegisterBtn = document.querySelector('.mobile-register-btn');
    
    console.log('🔍 모바일 로그인 버튼 요소 확인:', mobileLoginBtn);
    console.log('🔍 모바일 회원가입 버튼 요소 확인:', mobileRegisterBtn);
    
    if (mobileLoginBtn) {
      mobileLoginBtn.addEventListener('click', () => {
        console.log('📱 모바일 로그인 버튼 클릭됨');
        showModal(loginModal);
      });
      console.log('✅ 모바일 로그인 버튼 이벤트 리스너 추가 완료');
    } else {
      console.error('❌ 모바일 로그인 버튼을 찾을 수 없음');
    }
    
    if (mobileRegisterBtn) {
      mobileRegisterBtn.addEventListener('click', () => {
        console.log('📱 모바일 회원가입 버튼 클릭됨');
        showModal(registerModal);
      });
      console.log('✅ 모바일 회원가입 버튼 이벤트 리스너 추가 완료');
    } else {
      console.error('❌ 모바일 회원가입 버튼을 찾을 수 없음');
    }
  }, 150);
  
  
  // 홈 버튼 이벤트
  const navHomeBtn = document.querySelector('.nav-home-btn');
  if (navHomeBtn) {
    navHomeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      changeSection('home');
    });
  }
  
  // 모달 전환 이벤트
  if (switchToRegister) {
    switchToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      hideModal(loginModal);
      showModal(registerModal);
    });
  }
  
  if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      hideModal(registerModal);
      showModal(loginModal);
    });
  }
  
  // 모달 닫기 이벤트
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      hideModal(loginModal);
      hideModal(registerModal);
    });
  });
  
  // 모달 외부 클릭 시 닫기
  window.addEventListener('click', (e) => {
    if (e.target === loginModal) hideModal(loginModal);
    if (e.target === registerModal) hideModal(registerModal);
  });
  
  // 회원가입 단계 버튼 이벤트
  nextStepBtns.forEach(btn => {
    btn.addEventListener('click', nextStep);
  });
  
  prevStepBtns.forEach(btn => {
    btn.addEventListener('click', prevStep);
  });
  
  // 비밀번호 강도 체크
  const passwordInput = document.getElementById('registerPassword');
  if (passwordInput) {
    passwordInput.addEventListener('input', (e) => {
      checkPasswordStrength(e.target.value);
    });
  }
  
  // 폼 제출 이벤트
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      login(formData);
    });
  }
  
  if (registerForm) {
    // 회원가입 폼의 submit 이벤트는 제거 (단계별 진행 방식 사용)
    // registerForm.addEventListener('submit', (e) => {
    //   e.preventDefault();
    //   const formData = new FormData(registerForm);
    //   register(formData);
    // });
  }
  
  if (baziForm) {
    baziForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(baziForm);
      analyzeBazi(formData);
    });
  }
  
  if (astrologyForm) {
    console.log('🔮 astrologyForm 이벤트 리스너 등록');
    astrologyForm.addEventListener('submit', (e) => {
      console.log('🔮 점성술 폼 제출 이벤트 발생!');
      e.preventDefault();
      
      console.log('🔮 점성술 폼 제출됨');
      
      // 폼 데이터 확인
      const formData = new FormData(astrologyForm);
      console.log('📋 폼 데이터 생성됨:', formData);
      
      // 폼 데이터 내용 확인
      for (let [key, value] of formData.entries()) {
        console.log(`  📋 ${key}: ${value}`);
      }
      
      // PC 버전과 동일한 방식으로 분석 실행
      analyzeAstrology(formData);
    });
  } else {
    console.error('❌ astrologyForm을 찾을 수 없어서 이벤트 리스너를 등록할 수 없습니다.');
  }
  
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(profileForm);
      updateProfile(formData);
    });
  }
  
  // 친구 관계 분석 폼 이벤트 리스너
  const friendBaziForm = document.getElementById('friendBaziForm');
  if (friendBaziForm) {
    friendBaziForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(friendBaziForm);
      analyzeRelationship(formData);
    });
  }
  
  // 시간 입력 및 AM/PM 버튼 이벤트 리스너
  const friendBirthTime = document.getElementById('friendBirthTime');
  const friendAmPmInput = document.getElementById('friendAmPmInput');
  const ampmButtons = document.querySelectorAll('.ampm-btn');
  
  if (friendBirthTime) {
    friendBirthTime.addEventListener('input', (e) => {
      let value = e.target.value.replace(/[^0-9:]/g, '');
      
      // HH:mm 형식으로 자동 포맷팅
      if (value.length >= 2 && !value.includes(':')) {
        value = value.slice(0, 2) + ':' + value.slice(2);
      }
      
      // 시간 범위 제한 (00:00 ~ 23:59)
      if (value.includes(':')) {
        const [hours, minutes] = value.split(':');
        const hour = parseInt(hours) || 0;
        const minute = parseInt(minutes) || 0;
        
        if (hour > 23) value = '23:' + (minutes || '00');
        if (minute > 59) value = hours + ':59';
      }
      
      e.target.value = value.slice(0, 5);
    });
  }
  
  // AM/PM 버튼 이벤트
  ampmButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // 모든 버튼 비활성화
      ampmButtons.forEach(b => b.classList.remove('active'));
      
      // 클릭된 버튼 활성화
      btn.classList.add('active');
      
      // hidden input에 값 설정
      if (friendAmPmInput) {
        friendAmPmInput.value = btn.getAttribute('data-value');
      }
    });
  });
  
  // 관리자 모드 이벤트 리스너
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminLogoutBtn = document.getElementById('adminLogout');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(adminLoginForm);
      adminLogin(formData);
    });
  }
  
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', adminLogout);
  }
  
  // 탭 전환 이벤트
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      
      // 모든 탭 버튼 비활성화
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // 선택된 탭 활성화
      btn.classList.add('active');
      const targetTab = document.getElementById(`${tabName}Tab`);
      if (targetTab) {
        targetTab.classList.add('active');
      } else {
        console.warn(`⚠️ 탭 요소를 찾을 수 없습니다: ${tabName}Tab`);
      }
      
      // 공지사항 탭이 선택되면 공지사항 로드
      if (tabName === 'announcements') {
      }
    });
  });
  
  // 관리자 로그인 폼 이벤트 리스너
  const adminForm = document.getElementById('adminLoginForm');
  if (adminForm) {
    adminForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('🔐 관리자 로그인 폼 제출됨');
      adminLogin(new FormData(this));
    });
    console.log('✅ 관리자 로그인 폼 이벤트 리스너 등록');
  } else {
    console.error('❌ 관리자 로그인 폼을 찾을 수 없음');
  }
  
  // 초기 언어 설정
  changeLanguage(currentLanguage);
  
  // 갤러리 모달 이벤트 리스너
  const galleryModal = document.getElementById('galleryModal');
  const galleryModalClose = document.querySelector('.gallery-modal-close');
  
  if (galleryModalClose) {
    galleryModalClose.addEventListener('click', closeGalleryModal);
  }
  
  if (galleryModal) {
    // 모달 배경 클릭 시 닫기
    galleryModal.addEventListener('click', (e) => {
      if (e.target === galleryModal) {
        closeGalleryModal();
      }
    });
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && galleryModal.style.display === 'flex') {
        closeGalleryModal();
      }
    });
  }
  
  console.log('✅ 이벤트 리스너 등록 완료');
}

// 로그아웃 함수
function logout() {
  console.log('🚪 로그아웃 시도');
  
  // 서버에 로그아웃 요청
  apiRequest('/api/auth/logout', {
    method: 'POST'
  }).then(() => {
    console.log('✅ 서버 로그아웃 성공');
  }).catch(error => {
    console.error('❌ 서버 로그아웃 실패:', error);
  });
  
  // localStorage 정리
  localStorage.removeItem('currentUser');
  localStorage.removeItem('authToken');
  console.log('🗑️ localStorage 정리 완료');
  
  // 로컬 상태 정리
  updateUserState(null, null, false);
  console.log('🔄 사용자 상태 초기화 완료');
  
  // 홈 화면으로 이동
  changeSection('home');
  console.log('🏠 홈 화면으로 이동 완료');
  
  // UI 업데이트 완료 후 알림 표시
  setTimeout(() => {
    alert('로그아웃되었습니다.');
  }, 100);
}

// 테스트용 관리자 로그인 함수
function testAdminLogin() {
  console.log('🧪 테스트 관리자 로그인 시작');
  
  const password = document.getElementById('adminPassword').value;
  console.log('🧪 입력된 비밀번호:', password);
  
  if (!password) {
    alert('비밀번호를 입력해주세요.');
    return;
  }
  
  // FormData 객체 생성
  const formData = new FormData();
  formData.append('password', password);
  
  // 기존 함수 호출
  adminLogin(formData);
}

// 관리자 모드 관련 함수 - 안전한 버전
async function adminLogin(formData) {
  console.log('🔐 관리자 로그인 시작');
  
  try {
    const password = formData.get('password');
    console.log('🔐 입력된 비밀번호:', password);
    
    if (!password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    
    // 서버에 로그인 요청
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: password })
    });
    
    const result = await response.json();
    console.log('🔐 서버 응답:', result);
    
    if (result.success) {
      console.log('✅ 관리자 로그인 성공');
      
      // 전역 변수 설정
      isAdminLoggedIn = true;
      console.log('✅ isAdminLoggedIn 설정:', isAdminLoggedIn);
      
      // 관리자 섹션으로 이동 (UI 업데이트는 changeSection에서 처리)
      changeSection('admin');
      console.log('✅ 관리자 섹션으로 이동 완료');
      
      // 데이터 로드는 별도로 처리 (에러가 발생해도 UI는 유지)
      try {
        loadAdminData();
        console.log('✅ 관리자 데이터 로드 완료');
      } catch (dataError) {
        console.error('❌ 관리자 데이터 로드 실패:', dataError);
        // 데이터 로드 실패해도 UI는 유지
      }
      
      alert('관리자 로그인 성공!');
      
    } else {
      console.log('❌ 관리자 로그인 실패:', result);
      alert('관리자 비밀번호가 올바르지 않습니다.');
    }
  } catch (error) {
    console.error('🔐 관리자 로그인 오류:', error);
    alert('관리자 로그인 중 오류가 발생했습니다.');
  }
}

// 관리자 로그아웃 함수
async function adminLogout() {
  try {
    const response = await fetch('/api/admin/logout', {
      method: 'POST'
    });
    
    const result = await response.json();
    
    if (result.success) {
      isAdminLoggedIn = false;
      showAdminLogin();
      alert('관리자 로그아웃되었습니다.');
    }
  } catch (error) {
    console.error('Admin logout error:', error);
  }
}

// 관리자 대시보드 표시
function showAdminDashboard() {
  console.log('🔐 관리자 대시보드 표시 시작');
  
  const adminLogin = document.getElementById('adminLogin');
  const adminDashboard = document.getElementById('adminDashboard');
  
  console.log('🔐 adminLogin 요소:', adminLogin);
  console.log('🔐 adminDashboard 요소:', adminDashboard);
  
  if (adminLogin) {
    adminLogin.style.display = 'none';
    console.log('✅ 관리자 로그인 화면 숨김');
  } else {
    console.error('❌ adminLogin 요소를 찾을 수 없음');
  }
  
  if (adminDashboard) {
    adminDashboard.style.display = 'block';
    console.log('✅ 관리자 대시보드 표시');
  } else {
    console.error('❌ adminDashboard 요소를 찾을 수 없음');
  }
}

// 관리자 로그인 화면 표시
function showAdminLogin() {
  document.getElementById('adminLogin').style.display = 'block';
  document.getElementById('adminDashboard').style.display = 'none';
}

// 관리자 로그인 상태 확인
async function checkAdminAuth() {
  try {
    const response = await fetch('/api/admin/stats');
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        isAdminLoggedIn = true;
        showAdminDashboard();
        loadAdminData();
        return true;
      }
    }
  } catch (error) {
    console.log('관리자 로그인 상태 확인 실패:', error);
  }
  
  isAdminLoggedIn = false;
  showAdminLogin();
  return false;
}

// 관리자 탭 전환 함수
function switchAdminTab(tabName) {
  console.log('🔐 관리자 탭 전환:', tabName);
  
  // 모든 탭 버튼 비활성화
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // 모든 탭 콘텐츠 숨기기
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // 선택된 탭 버튼 활성화
  const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
  if (activeButton) {
    activeButton.classList.add('active');
  }
  
  // 선택된 탭 콘텐츠 표시
  const activeContent = document.getElementById(`${tabName}Tab`);
  if (activeContent) {
    activeContent.classList.add('active');
  }
  
  // 탭 전환 시에는 UI만 전환 (데이터는 이미 로드됨)
  console.log('✅ 탭 UI 전환 완료:', tabName);
  
  console.log('✅ 탭 전환 완료:', tabName);
}

// 사용자 데이터만 로드하는 함수
async function loadUsersData() {
  console.log('👥 사용자 데이터 로드 중...');
  
  try {
    const usersResponse = await fetch('/api/admin/users');
    if (usersResponse.ok) {
      const usersResult = await usersResponse.json();
      if (usersResult.success && Array.isArray(usersResult.users)) {
        displayUsersTable(usersResult.users);
        console.log('✅ 사용자 목록 로드 완료:', usersResult.users.length, '명');
      } else {
        console.error('❌ 사용자 데이터가 배열이 아님:', usersResult);
        displayUsersTable([]);
      }
    } else {
      console.error('❌ 사용자 목록 로드 실패:', usersResponse.status);
      displayUsersTable([]);
    }
  } catch (error) {
    console.error('❌ 사용자 데이터 로드 오류:', error);
    displayUsersTable([]);
  }
}

// 관리자 데이터 로드 - 모든 데이터를 한 번에 로드
async function loadAdminData() {
  console.log('🔄 관리자 데이터 로드 시작');
  
  try {
    // 1. 전체 사용자 수 로드
    console.log('📊 전체 사용자 수 로드 중...');
    const statsResponse = await fetch('/api/admin/stats');
    if (statsResponse.ok) {
      const statsResult = await statsResponse.json();
      if (statsResult.success) {
        const totalUsersEl = document.getElementById('totalUsers');
        if (totalUsersEl) totalUsersEl.textContent = statsResult.stats.totalUsers;
        console.log('✅ 전체 사용자 수 로드 완료:', statsResult.stats.totalUsers);
      }
    }
    
    // 2. 사용자 목록 로드
    console.log('👥 사용자 목록 로드 중...');
    const usersResponse = await fetch('/api/admin/users');
    if (usersResponse.ok) {
      const usersResult = await usersResponse.json();
      if (usersResult.success && Array.isArray(usersResult.users)) {
        displayUsersTable(usersResult.users);
        console.log('✅ 사용자 목록 로드 완료:', usersResult.users.length, '명');
      } else {
        console.error('❌ 사용자 데이터가 배열이 아님:', usersResult);
        displayUsersTable([]);
      }
    } else {
      console.error('❌ 사용자 목록 로드 실패:', usersResponse.status);
      displayUsersTable([]);
    }
    
    // 3. 공지사항 목록 로드
    console.log('📢 공지사항 목록 로드 중...');
    const announcementsResponse = await fetch('/api/admin/announcements');
    if (announcementsResponse.ok) {
      const announcementsResult = await announcementsResponse.json();
      if (announcementsResult.success && Array.isArray(announcementsResult.announcements)) {
        displayAdminAnnouncements(announcementsResult.announcements);
        console.log('✅ 공지사항 목록 로드 완료:', announcementsResult.announcements.length, '개');
      } else {
        console.error('❌ 공지사항 데이터가 배열이 아님:', announcementsResult);
        displayAdminAnnouncements([]);
      }
    } else {
      console.error('❌ 공지사항 목록 로드 실패:', announcementsResponse.status);
      displayAdminAnnouncements([]);
    }
    
    console.log('✅ 모든 관리자 데이터 로드 완료');
    
  } catch (error) {
    console.error('❌ 관리자 데이터 로드 오류:', error);
    console.log('⚠️ 데이터 로드 실패했지만 UI는 유지됨');
  }
}

// 사용자 테이블 표시
function displayUsersTable(users) {
  const tbody = document.getElementById('usersTableBody');
  
  if (!tbody) {
    console.error('❌ usersTableBody 요소를 찾을 수 없음');
    return;
  }
  
  // users가 배열이 아니면 빈 배열로 처리
  if (!Array.isArray(users)) {
    console.error('❌ displayUsersTable: users가 배열이 아님:', users);
    users = [];
  }
  
  tbody.innerHTML = users.map(user => {
    // 생년월일시 정보 포맷팅
    const birthInfo = [];
    if (user.birth_year) birthInfo.push(`${user.birth_year}년`);
    if (user.birth_month) birthInfo.push(`${user.birth_month}월`);
    if (user.birth_day) birthInfo.push(`${user.birth_day}일`);
    if (user.birth_hour !== null && user.birth_hour !== undefined) {
      const hourNames = ['자시(23-01)', '축시(01-03)', '인시(03-05)', '묘시(05-07)', 
                        '진시(07-09)', '사시(09-11)', '오시(11-13)', '미시(13-15)',
                        '신시(15-17)', '유시(17-19)', '술시(19-21)', '해시(21-23)'];
      birthInfo.push(hourNames[user.birth_hour] || `${user.birth_hour}시`);
    }
    
    const birthDisplay = birthInfo.length > 0 ? birthInfo.join(' ') : '미입력';
    
    return `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${new Date(user.created_at).toLocaleDateString('ko-KR')}</td>
        <td>${birthDisplay}</td>
        <td>
          <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">삭제</button>
        </td>
      </tr>
    `;
  }).join('');
}

// 분석 기록 테이블 표시 - 체크박스 추가

// 사용자 삭제
async function deleteUser(userId) {
  if (!confirm('정말로 이 사용자를 삭제하시겠습니까?')) return;
  
  try {
    console.log('🗑️ 사용자 삭제 요청:', userId);
    
    const result = await apiRequest(`/api/admin/users/${userId}`, {
      method: 'DELETE'
    });
    
    console.log('🗑️ 사용자 삭제 응답:', result);
    
    if (result.success) {
      alert('사용자가 삭제되었습니다.');
      loadAdminData(); // 데이터 새로고침
    } else {
      alert('사용자 삭제에 실패했습니다: ' + result.error);
    }
  } catch (error) {
    console.error('❌ 사용자 삭제 오류:', error);
    alert('사용자 삭제에 실패했습니다: ' + error.message);
  }
}


// 날짜/시간 업데이트 함수
function updateDateTime() {
  const now = new Date();
  
  // 날짜와 요일
  const dateOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  };
  const dateString = now.toLocaleDateString('ko-KR', dateOptions);
  
  // 시간 (시:분)
  const timeOptions = { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  };
  const timeString = now.toLocaleTimeString('ko-KR', timeOptions);
  
  // DOM 요소 업데이트
  const dateElement = document.getElementById('currentDate');
  const timeElement = document.getElementById('currentTime');
  
  if (dateElement) {
    dateElement.textContent = dateString;
  }
  
  if (timeElement) {
    timeElement.textContent = timeString;
  }
}

// 갤러리 이미지 데이터
const galleryImages = [
  // Lady 4 시리즈
  { src: 'img/gallery/lady4 (1).png', title: 'Lady 4 - 1', category: 'lady4' },
  { src: 'img/gallery/lady4 (2).png', title: 'Lady 4 - 2', category: 'lady4' },
  { src: 'img/gallery/lady4 (3).png', title: 'Lady 4 - 3', category: 'lady4' },
  { src: 'img/gallery/lady4 (5).png', title: 'Lady 4 - 5', category: 'lady4' },
  { src: 'img/gallery/lady4 (7).png', title: 'Lady 4 - 7', category: 'lady4' },
  { src: 'img/gallery/lady4 (8).png', title: 'Lady 4 - 8', category: 'lady4' },
  
  // Lady 5 시리즈
  { src: 'img/gallery/lady5 (2).png', title: 'Lady 5 - 2', category: 'lady5' },
  { src: 'img/gallery/lady5 (3).png', title: 'Lady 5 - 3', category: 'lady5' },
  { src: 'img/gallery/lady5 (4).png', title: 'Lady 5 - 4', category: 'lady5' },
  
  // Lady 6 시리즈
  { src: 'img/gallery/lady6 (1).png', title: 'Lady 6 - 1', category: 'lady6' },
  { src: 'img/gallery/lady6 (2).png', title: 'Lady 6 - 2', category: 'lady6' },
  { src: 'img/gallery/lady6 (3).png', title: 'Lady 6 - 3', category: 'lady6' },
  { src: 'img/gallery/lady6 (4).png', title: 'Lady 6 - 4', category: 'lady6' },
  { src: 'img/gallery/lady6 (5).png', title: 'Lady 6 - 5', category: 'lady6' },
  { src: 'img/gallery/lady6 (6).png', title: 'Lady 6 - 6', category: 'lady6' },
  { src: 'img/gallery/lady6 (7).png', title: 'Lady 6 - 7', category: 'lady6' },
  { src: 'img/gallery/lady6 (8).png', title: 'Lady 6 - 8', category: 'lady6' },
  { src: 'img/gallery/lady6 (9).png', title: 'Lady 6 - 9', category: 'lady6' },
  
  // Lady 7 시리즈
  { src: 'img/gallery/lady7 (1).png', title: 'Lady 7 - 1', category: 'lady7' },
  { src: 'img/gallery/lady7 (2).png', title: 'Lady 7 - 2', category: 'lady7' },
  { src: 'img/gallery/lady7 (3).png', title: 'Lady 7 - 3', category: 'lady7' },
  { src: 'img/gallery/lady7 (4).png', title: 'Lady 7 - 4', category: 'lady7' },
  { src: 'img/gallery/lady7 (5).png', title: 'Lady 7 - 5', category: 'lady7' },
  { src: 'img/gallery/lady7 (6).png', title: 'Lady 7 - 6', category: 'lady7' },
  { src: 'img/gallery/lady7 (7).png', title: 'Lady 7 - 7', category: 'lady7' },
  { src: 'img/gallery/lady7 (8).png', title: 'Lady 7 - 8', category: 'lady7' },
  { src: 'img/gallery/lady7 (9).png', title: 'Lady 7 - 9', category: 'lady7' },
  { src: 'img/gallery/lady7 (10).png', title: 'Lady 7 - 10', category: 'lady7' },
  
  // Lady 8 시리즈
  { src: 'img/gallery/lady8 (1).png', title: 'Lady 8 - 1', category: 'lady8' },
  { src: 'img/gallery/lady8 (2).png', title: 'Lady 8 - 2', category: 'lady8' },
  { src: 'img/gallery/lady8 (3).png', title: 'Lady 8 - 3', category: 'lady8' },
  { src: 'img/gallery/lady8 (4).png', title: 'Lady 8 - 4', category: 'lady8' },
  { src: 'img/gallery/lady8 (5).png', title: 'Lady 8 - 5', category: 'lady8' },
  { src: 'img/gallery/lady8 (6).png', title: 'Lady 8 - 6', category: 'lady8' }
];

// 갤러리 로드 함수
function loadGallery() {
  console.log('🖼️ 갤러리 로드 시작');
  
  const galleryGrid = document.getElementById('galleryGrid');
  if (!galleryGrid) {
    console.error('❌ 갤러리 그리드 요소를 찾을 수 없습니다');
    return;
  }
  
  // 로딩 상태 표시
  galleryGrid.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>갤러리를 불러오는 중...</p>
    </div>
  `;
  
  // 이미지 로드
  setTimeout(() => {
    displayGalleryImages(galleryImages);
    setupGalleryFilters();
    console.log('✅ 갤러리 로드 완료');
  }, 500);
}

// 갤러리 이미지 표시 함수
function displayGalleryImages(images) {
  const galleryGrid = document.getElementById('galleryGrid');
  if (!galleryGrid) return;
  
  if (images.length === 0) {
    galleryGrid.innerHTML = `
      <div class="loading-container">
        <p>표시할 이미지가 없습니다.</p>
      </div>
    `;
    return;
  }
  
  galleryGrid.innerHTML = images.map(image => `
    <div class="gallery-item" data-category="${image.category}">
      <img src="${image.src}" alt="${image.title}" loading="lazy" onerror="this.style.display='none'" onclick="openGalleryModal('${image.src}', '${image.title}')">
      <div class="gallery-item-info">
        <h3 class="gallery-item-title">${image.title}</h3>
      </div>
    </div>
  `).join('');
}

// 갤러리 모달 열기
function openGalleryModal(imageSrc, imageTitle) {
  console.log('🖼️ 갤러리 모달 열기:', imageSrc, imageTitle);
  
  const modal = document.getElementById('galleryModal');
  const modalImage = document.getElementById('galleryModalImage');
  const modalTitle = document.getElementById('galleryModalTitle');
  
  if (modal && modalImage && modalTitle) {
    modalImage.src = imageSrc;
    modalImage.alt = imageTitle;
    modalTitle.textContent = imageTitle;
    modal.style.display = 'flex';
    
    // 모달 열릴 때 스크롤 방지
    document.body.style.overflow = 'hidden';
  }
}

// 갤러리 모달 닫기
function closeGalleryModal() {
  console.log('❌ 갤러리 모달 닫기');
  
  const modal = document.getElementById('galleryModal');
  if (modal) {
    modal.style.display = 'none';
    
    // 모달 닫힐 때 스크롤 복원
    document.body.style.overflow = 'auto';
  }
}

// 갤러리 필터 설정
function setupGalleryFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 활성 버튼 변경
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // 필터 적용
      const filter = button.getAttribute('data-filter');
      filterGalleryImages(filter);
    });
  });
}

// 갤러리 이미지 필터링
function filterGalleryImages(filter) {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    const category = item.getAttribute('data-category');
    
    if (filter === 'all' || category === filter) {
      item.style.display = 'block';
      item.style.animation = 'fadeIn 0.5s ease-in';
    } else {
      item.style.display = 'none';
    }
  });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', async function() {
  console.log('🚀 DOMContentLoaded 이벤트 발생');
  
  try {
    // 다국어 지원 초기화
    console.log('🔤 다국어 지원 초기화 시작');
    try {
      initializeLanguage();
      console.log('✅ 다국어 지원 초기화 완료');
    } catch (langError) {
      console.error('❌ 다국어 지원 초기화 실패:', langError);
      // 다국어 초기화 실패해도 앱은 계속 작동
    }
    
    // 폼 초기화
    console.log('📝 폼 초기화 시작');
    initializeForms();
    console.log('✅ 폼 초기화 완료');
    
    // 이벤트 리스너 등록
    console.log('🔗 이벤트 리스너 등록 시작');
    attachEventListeners();
    console.log('✅ 이벤트 리스너 등록 완료');
    
    // 쿠키에서 인증 상태 확인
    console.log('🍪 인증 상태 확인 시작');
    checkAuthFromCookie();
    console.log('✅ 인증 상태 확인 완료');
    
    // 날짜/시간 표시 초기화
    console.log('🕐 날짜/시간 표시 초기화 시작');
    updateDateTime();
    // 1분마다 시간 업데이트
    setInterval(updateDateTime, 60000);
    console.log('✅ 날짜/시간 표시 초기화 완료');
    
    // 홈 화면 초기 상태 설정
    console.log('🏠 홈 화면 초기화 시작');
    updateHomeContent(currentUser);
    console.log('✅ 홈 화면 초기화 완료');
    
    // 기본 배경 이미지 설정
    console.log('🖼️ 기본 배경 이미지 설정');
    document.body.setAttribute('data-section', 'home');
    console.log('✅ 기본 배경 이미지 설정 완료');
    
    // 친구 목록 초기화
    console.log('👥 친구 목록 초기화 시작');
    try {
    updateFriendsList();
    console.log('✅ 친구 목록 초기화 완료');
    } catch (error) {
      console.log('⚠️ 친구 목록 초기화 실패 (무시됨):', error.message);
    }
    
    // 공지사항 로드
    console.log('📢 공지사항 로드 시작');
    try {
      loadAnnouncements();
      console.log('✅ 공지사항 로드 완료');
    } catch (error) {
      console.log('⚠️ 공지사항 로드 실패 (무시됨):', error.message);
    }
    
    console.log('🎉 모든 초기화 완료!');
  } catch (error) {
    console.error('❌ 초기화 중 오류 발생:', error);
    console.error('❌ 오류 스택:', error.stack);
  }
});

// 스크롤 이벤트로 네비게이션 스타일 변경
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(255,255,255,0.98)';
  } else {
    navbar.style.background = 'rgba(255,255,255,0.95)';
  }
});

// 다국어 지원 초기화 함수
function initializeLanguage() {
  console.log('🔤 다국어 지원 초기화');
  
  try {
    // 기본 언어 설정
    changeLanguage(currentLanguage);
    console.log('✅ 다국어 지원 초기화 완료');
  } catch (error) {
    console.error('❌ 다국어 지원 초기화 중 오류:', error);
    // 오류가 발생해도 앱이 계속 작동하도록 함
  }
}

// 폼 초기화 함수
function initializeForms() {
  console.log('📝 폼 초기화');
  // 폼 옵션 초기화
  populateFormOptions();
  
  // 모달 스타일 강제 적용
  applyModalStyles();
}

// 모달 스타일 강제 적용 함수
function applyModalStyles() {
  console.log('🎨 모달 스타일 강제 적용 시작');
  
  // 모달이 열릴 때마다 스타일 적용
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        const modals = document.querySelectorAll('.modal-content');
        modals.forEach(function(modal) {
          // 모달 배경 강제 적용 (투명하게)
          modal.style.background = 'rgba(255,255,255,0.1) !important';
          modal.style.color = '#ffffff !important';
          
          // 모달 내 모든 텍스트 요소 강제 적용
          const textElements = modal.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, label, input, select, textarea');
          textElements.forEach(function(element) {
            element.style.color = '#ffffff !important';
          });
          
          // 입력 필드 강제 적용
          const inputs = modal.querySelectorAll('input, select, textarea');
          inputs.forEach(function(input) {
            input.style.background = 'rgba(255,255,255,0.2) !important';
            input.style.color = '#ffffff !important';
            input.style.border = '2px solid rgba(255,255,255,0.5) !important';
          });
          
          // 라벨 강제 적용
          const labels = modal.querySelectorAll('label');
          labels.forEach(function(label) {
            label.style.color = '#ffffff !important';
            label.style.fontWeight = '600 !important';
          });
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('✅ 모달 스타일 강제 적용 완료');
}

// 공지사항 관련 함수들
async function loadAnnouncements() {
  console.log('📢 loadAnnouncements 함수 호출됨');
  
  const announcementsList = document.getElementById('announcementsList');
  if (!announcementsList) {
    console.error('❌ announcementsList 요소를 찾을 수 없음');
    return;
  }
  
  try {
    // 로딩 표시
    announcementsList.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>공지사항을 불러오는 중...</p>
      </div>
    `;
    
    const response = await fetch('/api/announcements');
    const result = await response.json();
    
    console.log('📢 API 응답:', result);
    
    if (result.success && result.announcements && result.announcements.length > 0) {
      displayAnnouncements(result.announcements);
      console.log('✅ 서버 공지사항 표시 완료:', result.announcements.length, '개');
    } else {
      // 서버에 공지사항이 없으면 빈 메시지 표시
      announcementList.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.7);">
          <p>📢 등록된 공지사항이 없습니다.</p>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">새로운 소식이 있을 때 알려드리겠습니다!</p>
        </div>
      `;
      console.log('📢 서버에 공지사항이 없어서 빈 메시지 표시');
    }
  } catch (error) {
    console.error('공지사항 로드 오류:', error);
    // 오류 시 기본 공지사항 표시
    displayAnnouncements(announcements);
    console.log('✅ 오류 시 로컬 공지사항 표시 완료');
  }
}

function displayAnnouncements(announcements) {
  console.log('📢 displayAnnouncements 함수 호출됨, 공지사항 수:', announcements ? announcements.length : 0);
  
  const announcementList = document.getElementById('announcementsList');
  
  if (!announcementList) {
    console.log('⚠️ announcementsList 요소를 찾을 수 없음 - 공지사항 표시 건너뜀');
    return;
  }
  
  if (!announcements || announcements.length === 0) {
    announcementList.innerHTML = '<p class="no-announcement">등록된 공지사항이 없습니다.</p>';
    console.log('📢 공지사항이 없어서 빈 메시지 표시');
    return;
  }
  
  const announcementsHtml = announcements.map(announcement => {
    // 서버 데이터와 로컬 데이터 모두 처리
    const title = announcement.title || announcement.name || '';
    const content = announcement.content || announcement.description || '';
    
    // 날짜 처리 개선
    let date;
    if (announcement.created_at) {
      // 서버에서 받은 created_at 날짜 처리
      const dateObj = new Date(announcement.created_at);
      date = dateObj.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      console.log('📅 날짜 변환:', announcement.created_at, '->', date);
    } else if (announcement.date) {
      // 로컬 데이터의 date 처리
      date = announcement.date;
    } else {
      // 기본값
      date = new Date().toLocaleDateString('ko-KR');
    }
    
    const priority = announcement.priority || 0;
    const type = announcement.type || '';
    
    // 우선순위에 따른 스타일 클래스
    let priorityClass = '';
    let priorityIcon = '📢';
    
    if (type === 'new') {
      priorityClass = 'new';
      priorityIcon = '🆕';
    } else if (type === 'update') {
      priorityClass = 'update';
      priorityIcon = '📝';
    } else if (priority === 2) {
      priorityClass = 'urgent';
      priorityIcon = '🚨';
    } else if (priority === 1) {
      priorityClass = 'important';
      priorityIcon = '⚠️';
    }
    
    return `
      <div class="announcement-item ${priorityClass}">
        <div class="announcement-header">
          <span class="announcement-type">${priorityIcon}</span>
          <span class="announcement-date">${date}</span>
        </div>
        <h4 class="announcement-title">${title}</h4>
        <p class="announcement-content">${content}</p>
      </div>
    `;
  }).join('');
  
  announcementList.innerHTML = announcementsHtml;
}

// 공지사항 관리 함수들
function showAnnouncementForm() {
  const formContainer = document.getElementById('announcementForm');
  if (formContainer) {
    formContainer.style.display = 'block';
  }
}

function hideAnnouncementForm() {
  const formContainer = document.getElementById('announcementForm');
  const form = document.getElementById('newAnnouncementForm');
  if (formContainer) {
    formContainer.style.display = 'none';
  }
  if (form) {
    form.reset();
  }
}

async function createAnnouncement(formData) {
  try {
    const data = {
      title: formData.get('title'),
      content: formData.get('content'),
      priority: parseInt(formData.get('priority'))
    };
    
    const response = await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('공지사항이 등록되었습니다.');
      hideAnnouncementForm();
      loadAdminAnnouncements();
    } else {
      alert('공지사항 등록에 실패했습니다: ' + result.error);
    }
  } catch (error) {
    console.error('공지사항 등록 오류:', error);
    alert('공지사항 등록 중 오류가 발생했습니다.');
  }
}


function displayAdminAnnouncements(announcements) {
  const tbody = document.getElementById('announcementsTableBody');
  
  if (!tbody) return;
  
  // announcements가 배열이 아니면 빈 배열로 처리
  if (!Array.isArray(announcements)) {
    console.error('❌ displayAdminAnnouncements: announcements가 배열이 아님:', announcements);
    announcements = [];
  }
  
  const rows = announcements.map(announcement => {
    const priorityText = announcement.priority === 2 ? '긴급' : announcement.priority === 1 ? '중요' : '일반';
    const statusText = announcement.is_active ? '활성' : '비활성';
    const date = new Date(announcement.created_at).toLocaleDateString('ko-KR');
    
    return `
      <tr class="announcement-row" onclick="showAnnouncementDetail(${announcement.id})">
        <td>${announcement.id}</td>
        <td>${announcement.title}</td>
        <td>${announcement.author_name}</td>
        <td>${priorityText}</td>
        <td>${statusText}</td>
        <td>${date}</td>
        <td onclick="event.stopPropagation();">
          <button class="action-btn view-btn" onclick="showAnnouncementDetail(${announcement.id})">보기</button>
          <button class="action-btn delete-btn" onclick="deleteAnnouncement(${announcement.id})">삭제</button>
        </td>
      </tr>
    `;
  }).join('');
  
  tbody.innerHTML = rows;
}

// 공지사항 삭제
async function deleteAnnouncement(announcementId) {
  if (!confirm('정말로 이 공지사항을 삭제하시겠습니까?')) return;
  
  try {
    const response = await fetch(`/api/admin/announcements/${announcementId}`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('공지사항이 삭제되었습니다.');
      // 데이터 새로고침
      const announcementsResponse = await fetch('/api/admin/announcements');
      if (announcementsResponse.ok) {
        const announcementsResult = await announcementsResponse.json();
        if (announcementsResult.success && Array.isArray(announcementsResult.announcements)) {
          displayAdminAnnouncements(announcementsResult.announcements);
        }
      }
    } else {
      alert('공지사항 삭제에 실패했습니다: ' + result.error);
    }
  } catch (error) {
    console.error('Delete announcement error:', error);
    alert('공지사항 삭제에 실패했습니다.');
  }
}


// 공지사항 상세 보기 관련 함수들
let currentAnnouncementId = null;

async function showAnnouncementDetail(id) {
  try {
    const response = await fetch(`/api/admin/announcements/${id}`);
    const result = await response.json();
    
    if (result.success) {
      const announcement = result.announcement;
      currentAnnouncementId = id;
      
      // 모달 내용 설정
      document.getElementById('announcementDetailTitle').textContent = announcement.title;
      document.getElementById('announcementDetailAuthor').textContent = announcement.author_name || '관리자';
      document.getElementById('announcementDetailPriority').textContent = 
        announcement.priority === 2 ? '긴급' : announcement.priority === 1 ? '중요' : '일반';
      document.getElementById('announcementDetailDate').textContent = 
        new Date(announcement.created_at).toLocaleDateString('ko-KR');
      document.getElementById('announcementDetailStatus').textContent = 
        announcement.is_active ? '활성' : '비활성';
      document.getElementById('announcementDetailContent').textContent = announcement.content;
      
      // 모달 표시
      document.getElementById('announcementDetailModal').style.display = 'block';
    } else {
      alert('공지사항을 불러올 수 없습니다: ' + result.error);
    }
  } catch (error) {
    console.error('공지사항 상세 보기 오류:', error);
    alert('공지사항을 불러오는 중 오류가 발생했습니다.');
  }
}

function closeAnnouncementDetail() {
  document.getElementById('announcementDetailModal').style.display = 'none';
  currentAnnouncementId = null;
}

function deleteAnnouncementFromDetail() {
  if (currentAnnouncementId) {
    deleteAnnouncement(currentAnnouncementId);
  }
}

function editAnnouncementFromDetail() {
  if (currentAnnouncementId) {
    // 수정 기능은 나중에 구현
    alert('수정 기능은 준비 중입니다.');
  }
}

// 관리자 비밀번호 변경
async function changeAdminPassword(formData) {
  const currentPassword = formData.get('currentPassword');
  const newPassword = formData.get('newPassword');
  const confirmPassword = formData.get('confirmPassword');
  
  if (newPassword !== confirmPassword) {
    alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
    return;
  }
  
  if (newPassword.length < 4) {
    alert('새 비밀번호는 최소 4자 이상이어야 합니다.');
    return;
  }
  
  try {
    const response = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('관리자 비밀번호가 성공적으로 변경되었습니다.');
      document.getElementById('adminPasswordForm').reset();
    } else {
      alert('비밀번호 변경에 실패했습니다: ' + result.error);
    }
  } catch (error) {
    console.error('관리자 비밀번호 변경 오류:', error);
    alert('비밀번호 변경 중 오류가 발생했습니다.');
  }
}

// 전문가 해석 표시 함수
function displayExpertInterpretation(result, container) {
  const { pillars, elementCounts, interpretation } = result;
  const { answers, summary, recommendations } = interpretation;
  const yearEl = pillars?.year?.element || '';
  const monthEl = pillars?.month?.element || '';
  const dayEl = pillars?.day?.element || '';
  const hourEl = pillars?.hour?.element || '';
  
  // 임시 헬퍼 함수들 (누락된 함수들)
  const toHanjaStem = (stem) => {
    const hanjaMap = {'갑':'甲','을':'乙','병':'丙','정':'丁','무':'戊','기':'己','경':'庚','신':'辛','임':'壬','계':'癸'};
    return hanjaMap[stem] || stem;
  };
  const toHanjaBranch = (branch) => {
    const hanjaMap = {'자':'子','축':'丑','인':'寅','묘':'卯','진':'辰','사':'巳','오':'午','미':'未','신':'申','유':'酉','술':'戌','해':'亥'};
    return hanjaMap[branch] || branch;
  };
  const getElementIcon = (element) => {
    const iconMap = {'목':'🌳','화':'🔥','토':'🏔️','금':'⚔️','수':'💧'};
    return iconMap[element] || '⚪';
  };
  const getTenGodIcon = (tenGod) => {
    const iconMap = {'비견':'👤','겁재':'👥','식신':'🍽️','상관':'📝','편재':'💰','정재':'💎','편관':'⚖️','정관':'👑','편인':'📚','정인':'🎓'};
    return iconMap[tenGod] || '⭐';
  };
  const getTenGodDesc = (tenGod) => {
    const descMap = {'비견':'자신감과 자존심','겁재':'동료와 협력','식신':'창의성과 표현','상관':'비판과 개선','편재':'재물과 현실','정재':'안정적 재물','편관':'도전과 변화','정관':'명예와 권위','편인':'학습과 지혜','정인':'인정과 배려'};
    return descMap[tenGod] || tenGod;
  };
  const getTenGodShortDesc = (tenGod) => {
    const shortDescMap = {'비견':'자신감','겁재':'협력','식신':'창의','상관':'비판','편재':'재물','정재':'안정','편관':'도전','정관':'명예','편인':'학습','정인':'인정'};
    return shortDescMap[tenGod] || tenGod;
  };
  const getTenGodByStems = (dayStem, targetStem) => {
    const stemOrder = ['갑','을','병','정','무','기','경','신','임','계'];
    const tenGods = ['비견','겁재','식신','상관','편재','정재','편관','정관','편인','정인'];
    const dayIndex = stemOrder.indexOf(dayStem);
    const targetIndex = stemOrder.indexOf(targetStem);
    if (dayIndex === -1 || targetIndex === -1) return '비견';
    const diff = (targetIndex - dayIndex + 10) % 10;
    return tenGods[diff];
  };
  const getElementPercent = (element, elementCounts) => {
    if (!element || !elementCounts) return 0;
    const total = Object.values(elementCounts).reduce((sum, count) => sum + count, 0);
    const count = elementCounts[element] || 0;
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };
  
  // ===== 샘플 리포트 동적 치환 준비 =====
  const getStrength = (cnt) => {
    if (cnt >= 3) return '강';
    if (cnt >= 2) return '중간';
    return '약';
  };
  // 나이 계산 함수
  const calculateAge = (birthYear, birthMonth, birthDay) => {
    if (!birthYear || !birthMonth || !birthDay) return null;
    const today = new Date();
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const ec = elementCounts || {};
  const woodCnt = ec['목'] || 0;
  const fireCnt = ec['화'] || 0;
  const earthCnt = ec['토'] || 0;
  const metalCnt = ec['금'] || 0;
  const waterCnt = ec['수'] || 0;
  // 출생 정보 파싱 (서버가 제공한 proReport 메타 우선)
  const birthLine = result?.proReport?.meta?.birth || '';
  let solarY = '', solarM = '', solarD = '', hhmm = '', placeLabel = '', calLabel = '';
  try {
    const m = birthLine.match(/(\d{4})년\s+(\d{1,2})월\s+(\d{1,2})일\s*([0-2]?\d:[0-5]\d)?\s*(?:\(([^)]+)\)\s*)?(양력|음력)?/);
    if (m) {
      solarY = m[1] || '';
      solarM = m[2] || '';
      solarD = m[3] || '';
      hhmm = m[4] || '';
      placeLabel = m[5] || '';
      calLabel = m[6] || '';
    }
  } catch {}
  const solarYmd = solarY && solarM && solarD ? `${solarY}년 ${solarM}월 ${solarD}일` : '';
  const currentAge = calculateAge(parseInt(solarY), parseInt(solarM), parseInt(solarD));
  const ageText = currentAge !== null ? `${currentAge}세` : '';
  // 시간 한국어화(오전/오후/저녁 등 간단 라벨)
  const toKoreanTimeLabel = (hhmmStr) => {
    if (!hhmmStr) return '';
    const [hStr, mStr] = hhmmStr.split(':');
    const h = parseInt(hStr, 10);
    const label = (h < 6) ? '새벽' : (h < 12) ? '오전' : (h < 18) ? '오후' : (h < 21) ? '저녁' : '밤';
    const h12 = ((h % 12) === 0 ? 12 : (h % 12));
    return `${label} ${h12}시 ${mStr || '00'}분`;
  };
  const timeHuman = toKoreanTimeLabel(hhmm);
  const hourBranchHanja = pillars?.hour?.branch ? toHanjaBranch(pillars.hour.branch) : '';
  const yearSb = pillars?.year ? `${pillars.year.stem}${pillars.year.branch}` : '';
  const monthSb = pillars?.month ? `${pillars.month.stem}${pillars.month.branch}` : '';
  const daySb = pillars?.day ? `${pillars.day.stem}${pillars.day.branch}` : '';
  const hourSb = pillars?.hour ? `${pillars.hour.stem}${pillars.hour.branch}` : '';
  
  container.innerHTML = `
    <div class="expert-interpretation">
      <div class="interpretation-header">
        <h3>🔮 명리학 분석 <span id="baziOwnerName" style="font-size:0.8rem; color:#d1d5db; margin-left:4px;"></span></h3>
        <p class="interpretation-subtitle">24절기 기반 정확한 사주 해석</p>
      </div>
      
      <!-- 사주 기둥 정보 -->
      <div class="bazi-pillars-section">
        <h4>📊 사주 기둥</h4>
        <div class="pillars-modern">
          <div class="pillar-card ${getElementClass(yearEl)} wood">
            <div class="pillar-top">
              <span class="pillar-chip">년주</span>
              <span class="pillar-elem">${getElementName(yearEl)}</span>
            </div>
            <div class="pillar-main">
              <div class="stem">${pillars.year.stem}<span class="hanja">${toHanjaStem(pillars.year.stem)}</span></div>
              <div class="branch">${pillars.year.branch}<span class="hanja">${toHanjaBranch(pillars.year.branch)}</span></div>
            </div>
            <div class="pillar-meta"><span class="meta" title="${getElementName(yearEl)}"><span class="ico">${getElementIcon(yearEl)}</span>${yearEl}</span><span class="meta" title="${getTenGodDesc(getTenGodByStems(pillars.day.stem, pillars.year.stem))}"><span class="ico">${getTenGodIcon(getTenGodByStems(pillars.day.stem, pillars.year.stem))}</span>${getTenGodByStems(pillars.day.stem, pillars.year.stem)}</span></div>
            <div class="meter"><div class="meter-bar" style="width:${getElementPercent(yearEl, elementCounts)}%"></div></div>
            <div class="pillar-note">${getTenGodShortDesc(getTenGodByStems(pillars.day.stem, pillars.year.stem))}</div>
          </div>
          <div class="pillar-card ${getElementClass(monthEl)}">
            <div class="pillar-top">
              <span class="pillar-chip">월주</span>
              <span class="pillar-elem">${getElementName(monthEl)}</span>
            </div>
            <div class="pillar-main">
              <div class="stem">${pillars.month.stem}<span class="hanja">${toHanjaStem(pillars.month.stem)}</span></div>
              <div class="branch">${pillars.month.branch}<span class="hanja">${toHanjaBranch(pillars.month.branch)}</span></div>
            </div>
            <div class="pillar-meta"><span class="meta" title="${getElementName(monthEl)}"><span class="ico">${getElementIcon(monthEl)}</span>${monthEl}</span><span class="meta" title="${getTenGodDesc(getTenGodByStems(pillars.day.stem, pillars.month.stem))}"><span class="ico">${getTenGodIcon(getTenGodByStems(pillars.day.stem, pillars.month.stem))}</span>${getTenGodByStems(pillars.day.stem, pillars.month.stem)}</span></div>
            <div class="meter"><div class="meter-bar" style="width:${getElementPercent(monthEl, elementCounts)}%"></div></div>
            <div class="pillar-note">${getTenGodShortDesc(getTenGodByStems(pillars.day.stem, pillars.month.stem))}</div>
          </div>
          <div class="pillar-card ${getElementClass(dayEl)}">
            <div class="pillar-top">
              <span class="pillar-chip">일주</span>
              <span class="pillar-elem">${getElementName(dayEl)}</span>
            </div>
            <div class="pillar-main">
              <div class="stem">${pillars.day.stem}<span class="hanja">${toHanjaStem(pillars.day.stem)}</span></div>
              <div class="branch">${pillars.day.branch}<span class="hanja">${toHanjaBranch(pillars.day.branch)}</span></div>
            </div>
            <div class="pillar-meta"><span class="meta" title="${getElementName(dayEl)}"><span class="ico">${getElementIcon(dayEl)}</span>${dayEl}</span><span class="meta" title="${getTenGodDesc('일간')}"><span class="ico">${getTenGodIcon('일간')}</span>일간</span></div>
            <div class="meter"><div class="meter-bar" style="width:${getElementPercent(dayEl, elementCounts)}%"></div></div>
            <div class="pillar-note">자아의 기준점. 다른 주 해석의 기준이 됩니다.</div>
          </div>
          <div class="pillar-card ${getElementClass(hourEl)}">
            <div class="pillar-top">
              <span class="pillar-chip">시주</span>
              <span class="pillar-elem">${getElementName(hourEl)}</span>
            </div>
            <div class="pillar-main">
              <div class="stem">${pillars.hour.stem}<span class="hanja">${toHanjaStem(pillars.hour.stem)}</span></div>
              <div class="branch">${pillars.hour.branch}<span class="hanja">${toHanjaBranch(pillars.hour.branch)}</span></div>
            </div>
            <div class="pillar-meta"><span class="meta" title="${getElementName(hourEl)}"><span class="ico">${getElementIcon(hourEl)}</span>${hourEl}</span><span class="meta" title="${getTenGodDesc(getTenGodByStems(pillars.day.stem, pillars.hour.stem))}"><span class="ico">${getTenGodIcon(getTenGodByStems(pillars.day.stem, pillars.hour.stem))}</span>${getTenGodByStems(pillars.day.stem, pillars.hour.stem)}</span></div>
            <div class="meter"><div class="meter-bar" style="width:${getElementPercent(hourEl, elementCounts)}%"></div></div>
            <div class="pillar-note">${getTenGodShortDesc(getTenGodByStems(pillars.day.stem, pillars.hour.stem))}</div>
          </div>
        </div>
      </div>
      
      <!-- 핵심 질문 답변 -->
      <div class="answers-section">
        <h4>🎯 7가지 질문</h4>
        <div class="answers-grid">
          ${answers.map((answer, index) => `
            <div class="answer-card">
              <div class="answer-header">
                <span class="answer-number">${index + 1}</span>
                <h5 class="answer-topic">${answer.topic}</h5>
              </div>
              <div class="answer-content">
                <p class="answer-one-liner">${answer.one_liner}</p>
                <div class="answer-why">
                  <strong>근거:</strong> ${answer.why}
                </div>
                <div class="answer-todo">
                  <strong>실행 체크리스트:</strong>
                  <ul>
                    ${answer.todo.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- 요약 정보 -->
      <div class="summary-section">
        <h4>📋 요약</h4>
        <div class="summary-grid">
          <div class="summary-item">
            <strong>일간:</strong> ${summary.day_master}
          </div>
          <div class="summary-item">
            <strong>강한 오행:</strong> ${summary.strongest_element}
          </div>
          <div class="summary-item">
            <strong>약한 오행:</strong> ${summary.weakest_element}
          </div>
          <div class="summary-item">
            <strong>균형 점수:</strong> ${summary.balance_score.toFixed(1)}/100
          </div>
        </div>
      </div>
      
      <!-- 개선 권장사항 -->
      <div class="recommendations-section">
        <h4>💡 권장사항</h4>
        <div class="recommendations-grid">
          ${recommendations.map(rec => `
            <div class="recommendation-card">
              <h5>${rec.element} 기운 강화</h5>
              <div class="recommendation-content">
                <div class="rec-section">
                  <strong>활동:</strong>
                  <ul>
                    ${rec.activities.map(activity => `<li>${activity}</li>`).join('')}
                  </ul>
                </div>
                <div class="rec-section">
                  <strong>음식:</strong>
                  <ul>
                    ${rec.foods.map(food => `<li>${food}</li>`).join('')}
                  </ul>
                </div>
                <div class="rec-section">
                  <strong>색상:</strong>
                  <ul>
                    ${rec.colors.map(color => `<li>${color}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- 전문가 리포트 -->
      <div class="structured-report">
        <div class="sr-title">📚 리포트</div>

        <div class="sr-block">
          <p>아래는 ${solarYmd} ${timeHuman}${placeLabel ? ', ' + placeLabel : ''} 출생${ageText ? ` (${ageText})` : ''} 사주의 전문가급 풀이라 할 수 있는 A4 약 10장 분량의 구조로 정리한 해설입니다. 설명은 깊이 있으면서도 이해하기 쉽게 단계적으로 나누어 드립니다.</p>
        </div>

        <div class="sr-block">
          <div class="sr-title">구성 개요</div>
          <div>
            <span class="sr-chip">명식(사주팔자) 분석</span>
            <span class="sr-chip">오행 분포와 균형</span>
            <span class="sr-chip">십성(十星) 해석: 재성·관성·인성·식상·비겁</span>
            <span class="sr-chip">대운·세운 흐름 분석</span>
            <span class="sr-chip">성격·기질·인생 패턴</span>
            <span class="sr-chip">직업·재물·인연·건강 운</span>
            <span class="sr-chip">연애·결혼·가족 운세</span>
            <span class="sr-chip">특이점과 주의할 점</span>
            <span class="sr-chip">향후 10년 대운 전망</span>
            <span class="sr-chip">총괄 조언 및 개선 방향</span>
          </div>
        </div>

        <div class="sr-block">
          <div class="sr-title">1. 명식(사주팔자) 분석</div>
          <div class="sr-grid">
            <div>
              <strong>출생 정보</strong>
              ${solarYmd ? `<p>양력: ${solarYmd}</p>` : ''}
              ${hhmm ? `<p>시간: ${timeHuman} (${hourBranchHanja}시)</p>` : ''}
              ${placeLabel ? `<p>출생지: ${placeLabel}</p>` : ''}
              ${calLabel ? `<p>달력: ${calLabel}</p>` : ''}
            </div>
            <div>
              <strong>사주팔자(명식)</strong>
              ${yearSb ? `<p>년주: ${yearSb}</p>` : ''}
              ${monthSb ? `<p>월주: ${monthSb}</p>` : ''}
              ${daySb ? `<p>일주: ${daySb}</p>` : ''}
              ${hourSb ? `<p>시주: ${hourSb}</p>` : ''}
            </div>
          </div>
          <div style="margin-top:8px;">
            <strong>핵심 키워드</strong>
            <p><strong>일간 ${pillars?.day?.stem || ''}${pillars?.day?.branch ? '' : ''}</strong> 중심 구조.</p>
            <p>오행 분포를 기반으로 강점과 보완점을 해석합니다.</p>
          </div>
        </div>

        <div class="sr-block">
          <div class="sr-title">2. 오행 분포와 균형</div>
          <table class="sr-table">
            <thead>
              <tr><th>오행</th><th>강도</th><th>의미</th></tr>
            </thead>
            <tbody>
              <tr><td>수(水)</td><td>${getStrength(waterCnt)}</td><td>본인 본체. 지혜·유연함·사고력</td></tr>
              <tr><td>화(火)</td><td>${getStrength(fireCnt)}</td><td>사회적 욕구·명예·리더십</td></tr>
              <tr><td>토(土)</td><td>${getStrength(earthCnt)}</td><td>재물·현실·책임감</td></tr>
              <tr><td>금(金)</td><td>${getStrength(metalCnt)}</td><td>판단력·결단력</td></tr>
              <tr><td>목(木)</td><td>${getStrength(woodCnt)}</td><td>성장·인연·확장력</td></tr>
            </tbody>
          </table>
          <p>오행 강약은 현재 명식 기준의 상대적 분포를 반영합니다.</p>
        </div>

        <div class="sr-block">
          <div class="sr-title">3. 십성 해석</div>
          <ul>
            <li>비겁(계수·임수): 자신감과 자존심을 유지하지만, 고립감도 있음.</li>
            <li>식상(목): 표현력 약함 → 내면의 재능을 밖으로 드러내기 어려움.</li>
            <li>재성(토): 재물·현실 중심적. 부동산·실물 재화 운이 강함.</li>
            <li>관성(화): 명예와 책임, 사회적 역할의 강한 압박. 리더십과 공적 책임에 끌림.</li>
            <li>인성(금): 지혜와 학습 능력, 위기 대처 능력 양호.</li>
          </ul>
        </div>

        <div class="sr-block">
          <div class="sr-title">4. 대운·세운 흐름</div>
          <p>대운은 약 10년 주기로 전환되며 인생 흐름을 크게 바꿈.</p>
          <table class="sr-table">
            <thead>
              <tr><th>나이</th><th>대운</th><th>특징</th></tr>
            </thead>
            <tbody>
              <tr><td>~15세</td><td>병인 대운</td><td>성장기, 학습 중심</td></tr>
              <tr><td>16~25</td><td>정묘 대운</td><td>인간관계·자기 탐색, 고민 많음</td></tr>
              <tr><td>26~35</td><td>무진 대운</td><td>직업적 기반 마련, 재물 운 상승 시작</td></tr>
              <tr><td>36~45</td><td>기사 대운</td><td>사회적 명예·재물 확대, 책임도 커짐</td></tr>
              <tr><td>46~55</td><td>경오 대운</td><td>도전과 확장, 해외·투자 운 강세</td></tr>
              <tr><td>56~65</td><td>신미 대운</td><td>재정 안정, 후계자·가족 문제 부각</td></tr>
              <tr><td>66 이후</td><td>임신 대운</td><td>정리·안정, 명예와 봉사로 균결</td></tr>
            </tbody>
          </table>
        </div>

        <div class="sr-block">
          <div class="sr-title">5. 성격·기질</div>
          <ul>
            <li>지혜롭고 직관이 발달. 사람을 포용하지만 내면의 고독감이 강함.</li>
            <li>결과 중심의 사고와 현실적 판단력이 뛰어나 사업가·리더로 적합.</li>
            <li>신중함 속에 결단력과 도전 정신 공존.</li>
          </ul>
        </div>

        <div class="sr-block">
          <div class="sr-title">6. 직업·재물·건강</div>
          <div class="sr-grid">
            <div>
              <strong>직업 운</strong>
              <ul>
                <li>IT·기술·금융·부동산·정치·컨설팅 분야에 강점.</li>
                <li>리더십을 발휘하는 경영자·조언자 역할 적합.</li>
              </ul>
            </div>
            <div>
              <strong>재물 운</strong>
              <ul>
                <li>재물 흐름이 왕성하나, 재물로 인한 갈등·책임이 따름.</li>
                <li>부동산, 토지, 장기적 투자에 유리.</li>
              </ul>
            </div>
          </div>
          <div style="margin-top:8px;">
            <strong>건강 운</strong>
            <ul>
              <li>소화기·비뇨기·혈압 관리 필요.</li>
              <li>과로로 인한 만성 피로 주의.</li>
            </ul>
          </div>
        </div>

        <div class="sr-block">
          <div class="sr-title">7. 연애·결혼·가족 운</div>
          <ul>
            <li>배우자는 현실적이고 책임감 있는 성향일 가능성.</li>
            <li>결혼 초반은 조율이 필요하나 후반 안정.</li>
            <li>자녀 운은 양호하며, 특히 둘째 이후에 인연의 깊이가 커짐.</li>
          </ul>
        </div>

        <div class="sr-block">
          <div class="sr-title">8. 특이점과 주의할 점</div>
          <ul>
            <li>강한 토 기운 → 책임·부담감으로 인한 스트레스 주의.</li>
            <li>목 기운을 강화해야 삶의 균형을 유지 가능. (자연, 나무, 동양 철학, 교육·인문 활동 추천)</li>
            <li>성급한 투자나 타인의 문제에 개입하는 것 주의.</li>
          </ul>
        </div>

        <div class="sr-block">
          <div class="sr-title future-luck">9. 향후 10년 대운${ageText ? `(${ageText} 기준)` : ''}</div>
          ${result.futureLuck ? `
            <!-- 대운 데이터 디버깅 -->
            <div style="background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 5px; font-size: 12px;">
              <strong>디버그:</strong> 대운 데이터 발견 - ${JSON.stringify(result.futureLuck).substring(0, 200)}...
            </div>
            <div class="luck-analysis">
              <div class="current-luck">
                <h5>현재 대운: ${result.futureLuck.currentLuck.name}</h5>
                <p><strong>기간:</strong> ${result.futureLuck.currentLuck.period}</p>
                <p><strong>특징:</strong> ${result.futureLuck.currentLuck.characteristics}</p>
                <p><strong>조언:</strong> ${result.futureLuck.currentLuck.advice}</p>
                <p><strong>기회:</strong> ${result.futureLuck.currentLuck.opportunities}</p>
                <p><strong>도전:</strong> ${result.futureLuck.currentLuck.challenges}</p>
                
                <div style="margin-top: 15px; padding: 15px; background: rgba(0, 0, 0, 0.5); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.2);">
                  <h6 style="color: #FFD700; margin-bottom: 10px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);">📋 구체적 가이드</h6>
                  <p><strong>💼 직업:</strong> ${result.futureLuck.currentLuck.details.career}</p>
                  <p><strong>❤️ 건강:</strong> ${result.futureLuck.currentLuck.details.health}</p>
                  <p><strong>👥 인연:</strong> ${result.futureLuck.currentLuck.details.relationship}</p>
                  <p><strong>💰 재정:</strong> ${result.futureLuck.currentLuck.details.finance}</p>
                  <p><strong>📚 학습:</strong> ${result.futureLuck.currentLuck.details.study}</p>
                  <p><strong>✈️ 여행:</strong> ${result.futureLuck.currentLuck.details.travel}</p>
                  <p><strong>🎨 길한 색상:</strong> ${result.futureLuck.currentLuck.details.color}</p>
                  <p><strong>🧭 길한 방향:</strong> ${result.futureLuck.currentLuck.details.direction}</p>
                </div>
              </div>
              
              <div class="next-luck">
                <h5>다음 대운: ${result.futureLuck.nextLuck.name}</h5>
                <p><strong>기간:</strong> ${result.futureLuck.nextLuck.period}</p>
                <p><strong>특징:</strong> ${result.futureLuck.nextLuck.characteristics}</p>
                <p><strong>조언:</strong> ${result.futureLuck.nextLuck.advice}</p>
                <p><strong>기회:</strong> ${result.futureLuck.nextLuck.opportunities}</p>
                <p><strong>도전:</strong> ${result.futureLuck.nextLuck.challenges}</p>
                
                <div style="margin-top: 15px; padding: 15px; background: rgba(0, 0, 0, 0.5); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.2);">
                  <h6 style="color: #FFD700; margin-bottom: 10px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);">📋 준비 가이드</h6>
                  <p><strong>💼 직업:</strong> ${result.futureLuck.nextLuck.details.career}</p>
                  <p><strong>❤️ 건강:</strong> ${result.futureLuck.nextLuck.details.health}</p>
                  <p><strong>👥 인연:</strong> ${result.futureLuck.nextLuck.details.relationship}</p>
                  <p><strong>💰 재정:</strong> ${result.futureLuck.nextLuck.details.finance}</p>
                  <p><strong>📚 학습:</strong> ${result.futureLuck.nextLuck.details.study}</p>
                  <p><strong>✈️ 여행:</strong> ${result.futureLuck.nextLuck.details.travel}</p>
                  <p><strong>🎨 길한 색상:</strong> ${result.futureLuck.nextLuck.details.color}</p>
                  <p><strong>🧭 길한 방향:</strong> ${result.futureLuck.nextLuck.details.direction}</p>
                </div>
              </div>
              
              <div class="luck-transition">
                <h5>대운 전환 시기</h5>
                <p><strong>전환 나이:</strong> ${result.futureLuck.transition.age}세 (${result.futureLuck.transition.year}년)</p>
                <p><strong>전환 조언:</strong> ${result.futureLuck.transition.advice}</p>
                <p><strong>준비사항:</strong> ${result.futureLuck.transition.preparation}</p>
                <p><strong>주의사항:</strong> ${result.futureLuck.transition.warning}</p>
                <p><strong>적응 기간:</strong> ${result.futureLuck.transition.timing}</p>
              </div>
            </div>
          ` : `
            <!-- 대운 데이터가 없을 때 기본 정보 표시 -->
            <div style="background: rgba(0, 0, 0, 0.7); color: #FFD700; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #FFD700; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);">
              <strong>알림:</strong> 대운 데이터를 불러오는 중입니다...
            </div>
            <div class="luck-analysis">
              <div class="current-luck">
                <h5>현재 대운 분석</h5>
                <p><strong>기간:</strong> 현재 나이 기준 10년</p>
                <p><strong>특징:</strong> 사주 기둥의 오행 균형에 따른 운세 변화</p>
                <p><strong>조언:</strong> 현재 사주에 맞는 오행을 강화하여 운세를 개선하세요.</p>
                <p><strong>기회:</strong> 강한 오행과 관련된 분야에서 성공할 수 있습니다.</p>
                <p><strong>도전:</strong> 약한 오행과 관련된 분야에서는 주의가 필요합니다.</p>
              </div>
              
              <div class="next-luck">
                <h5>다음 대운 전망</h5>
                <p><strong>기간:</strong> 향후 10년</p>
                <p><strong>특징:</strong> 새로운 오행 기운이 강해지는 시기</p>
                <p><strong>조언:</strong> 변화하는 운세에 맞춰 준비하고 적응하세요.</p>
                <p><strong>기회:</strong> 새로운 분야에서 성공할 수 있는 기회가 찾아옵니다.</p>
                <p><strong>도전:</strong> 변화에 따른 어려움을 겪을 수 있습니다.</p>
              </div>
              
              <div class="luck-transition">
                <h5>대운 전환 준비</h5>
                <p><strong>전환 시기:</strong> 약 10년 주기로 대운이 변화합니다.</p>
                <p><strong>전환 조언:</strong> 새로운 대운에 맞춰 준비하고 적응하는 것이 중요합니다.</p>
                <p><strong>준비사항:</strong> 변화하는 운세에 맞는 새로운 계획과 준비가 필요합니다.</p>
              </div>
            </div>
          `}
        </div>

        <div class="sr-block">
          <div class="sr-title comprehensive-advice">10. 종합 조언</div>
          <ul>
            <li>재물·명예·책임의 균형이 인생의 핵심 과제.</li>
            <li>정신적 여유를 위해 자연·철학·명상 등으로 목(木) 기운을 보충해야 함.</li>
            <li>비즈니스는 신뢰 기반으로, 단기적 이익보다 장기적 안정성을 중시해야 함.</li>
            <li>건강 관리와 정서적 균형을 함께 챙길 것.</li>
          </ul>
        </div>

        <div class="sr-block">
          <strong>정리</strong>
          <p>이 사주는 현실적 추진력과 재물 운이 탁월하지만, 내적 고독감과 과중한 책임감이라는 과제가 함께 주어진 구조입니다. 자신의 강점을 살리되, 균형을 맞추는 삶의 설계가 필요합니다.</p>
        </div>
        </div>
      </div>
    </div>
  `;
  attachExpertToggles(container);
  // populateBirthChips 함수가 정의되지 않았으므로 주석 처리
  // populateBirthChips();
}

// 헬퍼 함수들
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

// 드롭다운 메뉴 기능
let activeDropdown = null;

function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const overlay = document.getElementById('dropdownOverlay');
  
  if (activeDropdown && activeDropdown !== dropdown) {
    // 다른 드롭다운이 열려있으면 닫기
    activeDropdown.classList.remove('active');
    activeDropdown.querySelector('.dropdown-btn').classList.remove('active');
  }
  
  if (dropdown.classList.contains('active')) {
    // 현재 드롭다운이 열려있으면 닫기
    closeDropdown(dropdown);
  } else {
    // 드롭다운 열기
    openDropdown(dropdown);
  }
}

function openDropdown(dropdown) {
  dropdown.classList.add('active');
  dropdown.querySelector('.dropdown-btn').classList.add('active');
  activeDropdown = dropdown;
  
  // 오버레이 활성화
  const overlay = document.getElementById('dropdownOverlay');
  overlay.classList.add('active');
  
  // 오버레이 클릭 시 드롭다운 닫기
  overlay.onclick = function() {
    closeAllDropdowns();
  };
}

function closeDropdown(dropdown) {
  dropdown.classList.remove('active');
  dropdown.querySelector('.dropdown-btn').classList.remove('active');
  activeDropdown = null;
  
  // 오버레이 비활성화
  const overlay = document.getElementById('dropdownOverlay');
  overlay.classList.remove('active');
}

function closeAllDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    closeDropdown(dropdown);
  });
}

// ESC 키로 드롭다운 닫기
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeAllDropdowns();
  }
});

// 드롭다운 버튼에 키보드 접근성 추가
document.addEventListener('DOMContentLoaded', function() {
  const dropdownButtons = document.querySelectorAll('.dropdown-btn');
  
  dropdownButtons.forEach(button => {
    button.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const dropdownId = this.closest('.dropdown').id;
        toggleDropdown(dropdownId);
      }
    });
    
    // 스페이스바 이벤트 방지
    button.addEventListener('keypress', function(event) {
      if (event.key === ' ') {
        event.preventDefault();
      }
    });
  });
});

// 타로 점 관련 함수들

// 타로 카드 뽑기 함수
async function drawTarotCards() {
  console.log('🃏 타로 카드 뽑기 시작');
  
  const drawBtn = document.getElementById('drawCardsBtn');
  const resultDiv = document.getElementById('tarotResult');
  const resultContent = document.getElementById('tarotResultContent');
  
  if (!drawBtn || !resultDiv || !resultContent) {
    console.error('❌ 필요한 요소를 찾을 수 없습니다:', { drawBtn, resultDiv, resultContent });
    showNotification('페이지 요소를 찾을 수 없습니다.', 'error');
    return;
  }
  
  // 선택된 스프레드 가져오기
  const selectedSpreadElement = document.querySelector('input[name="spread"]:checked');
  if (!selectedSpreadElement) {
    console.error('❌ 선택된 스프레드가 없습니다');
    showNotification('스프레드를 선택해주세요.', 'error');
    return;
  }
  
  const selectedSpread = selectedSpreadElement.value;
  const question = document.getElementById('tarotQuestion').value;
  
  // 사용자 정보 가져오기
  const userToUse = currentUser;
  console.log('🔍 타로 분석할 사용자 정보:', userToUse);
  
  // 사용자 생년월일 정보 포함
  const userBirthInfo = userToUse ? {
    birthYear: parseInt(userToUse.birthYear || userToUse.birth_year),
    birthMonth: parseInt(userToUse.birthMonth || userToUse.birth_month),
    birthDay: parseInt(userToUse.birthDay || userToUse.birth_day),
    birthHour: parseInt(userToUse.birthHour || userToUse.birth_hour || 0),
    name: userToUse.name,
    email: userToUse.email
  } : null;
  
  console.log('📋 요청 데이터:', { selectedSpread, question, userBirthInfo });
  
  try {
    // 버튼 상태 변경
    drawBtn.disabled = true;
    drawBtn.textContent = '🃏 카드를 뽑는 중...';
    
    // API 호출
    console.log('🌐 API 호출 시작: /api/tarot/draw');
    const response = await fetch('/api/tarot/draw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        spread: selectedSpread,
        question: question,
        userInfo: userBirthInfo
      })
    });
    
    console.log('📡 API 응답 상태:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API 오류 응답:', errorText);
      throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📊 API 응답 데이터:', data);
    
    if (data.success) {
      // 결과 표시
      console.log('✅ 타로 결과 표시 시작');
      
      // 카드 이미지 표시
      displayTarotCards(data.result.cards);
      
      // 해석 결과 표시
      resultContent.innerHTML = markdownToHtml(data.result.interpretation);
      resultDiv.style.display = 'block';
      
      // 결과로 스크롤
      resultDiv.scrollIntoView({ behavior: 'smooth' });
      
      // 성공 메시지
      showNotification('타로 카드를 성공적으로 뽑았습니다! 🃏', 'success');
      console.log('✅ 타로 카드 뽑기 완료');
    } else {
      throw new Error(data.message || '타로 카드를 뽑는 중 오류가 발생했습니다.');
    }
    
  } catch (error) {
    console.error('❌ 타로 카드 뽑기 오류:', error);
    showNotification(`타로 카드를 뽑는 중 오류가 발생했습니다: ${error.message}`, 'error');
  } finally {
    // 버튼 상태 복원
    drawBtn.disabled = false;
    drawBtn.textContent = '🃏 카드 뽑기';
  }
}

// 타로 카드 이미지 표시 함수
function displayTarotCards(cards) {
  const cardsDisplay = document.getElementById('tarotCardsDisplay');
  if (!cardsDisplay) return;
  
  cardsDisplay.innerHTML = '';
  
  cards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.className = `tarot-card-item ${card.orientation === 'reversed' ? 'tarot-card-reversed' : ''}`;
    
    const positionName = card.position ? card.position.name : `${index + 1}번째 카드`;
    const orientationText = card.orientation === 'upright' ? '정방향' : '역방향';
    const orientationEmoji = card.orientation === 'upright' ? '✨' : '🔄';
    
    // 카드별 특성에 맞는 디자인 적용
    const cardDesign = getCardDesign(card);
    
    cardElement.innerHTML = `
      <div class="tarot-card-visual ${cardDesign.className}">
        <div class="tarot-card-inner">
          <div class="tarot-card-main-symbol">${cardDesign.mainSymbol}</div>
          <div class="tarot-card-secondary-symbols">
            ${cardDesign.secondarySymbols}
          </div>
          <div class="tarot-card-title">${card.name}</div>
          <div class="tarot-card-suit">${getSuitSymbol(card.suit)}</div>
        </div>
        <div class="tarot-card-border-pattern"></div>
      </div>
      <div class="tarot-card-name">${card.name}</div>
      <div class="tarot-card-position">${positionName}</div>
      <div class="tarot-card-orientation">${orientationEmoji} ${orientationText}</div>
    `;
    
    cardsDisplay.appendChild(cardElement);
  });
}

// 카드별 특성에 맞는 디자인 반환 함수
function getCardDesign(card) {
  const designs = {
    // 메이저 아르카나
    '바보': {
      className: 'card-fool',
      mainSymbol: '🎭',
      secondarySymbols: '<div class="symbol-top">🌅</div><div class="symbol-bottom">🌄</div>'
    },
    '마법사': {
      className: 'card-magician',
      mainSymbol: '🔮',
      secondarySymbols: '<div class="symbol-top">⚡</div><div class="symbol-bottom">💎</div>'
    },
    '여사제': {
      className: 'card-high-priestess',
      mainSymbol: '🌙',
      secondarySymbols: '<div class="symbol-top">📖</div><div class="symbol-bottom">🔮</div>'
    },
    '여황제': {
      className: 'card-empress',
      mainSymbol: '👑',
      secondarySymbols: '<div class="symbol-top">🌹</div><div class="symbol-bottom">🌾</div>'
    },
    '황제': {
      className: 'card-emperor',
      mainSymbol: '⚜️',
      secondarySymbols: '<div class="symbol-top">🗡️</div><div class="symbol-bottom">🏛️</div>'
    },
    '교황': {
      className: 'card-hierophant',
      mainSymbol: '⛪',
      secondarySymbols: '<div class="symbol-top">📜</div><div class="symbol-bottom">🔔</div>'
    },
    '연인': {
      className: 'card-lovers',
      mainSymbol: '💕',
      secondarySymbols: '<div class="symbol-top">👼</div><div class="symbol-bottom">🌳</div>'
    },
    '전차': {
      className: 'card-chariot',
      mainSymbol: '🏛️',
      secondarySymbols: '<div class="symbol-top">⚔️</div><div class="symbol-bottom">🛡️</div>'
    },
    '힘': {
      className: 'card-strength',
      mainSymbol: '🦁',
      secondarySymbols: '<div class="symbol-top">🌺</div><div class="symbol-bottom">💪</div>'
    },
    '은둔자': {
      className: 'card-hermit',
      mainSymbol: '🕯️',
      secondarySymbols: '<div class="symbol-top">🏔️</div><div class="symbol-bottom">⭐</div>'
    },
    '운명의 수레바퀴': {
      className: 'card-wheel',
      mainSymbol: '🎡',
      secondarySymbols: '<div class="symbol-top">🦁</div><div class="symbol-bottom">🐂</div>'
    },
    '정의': {
      className: 'card-justice',
      mainSymbol: '⚖️',
      secondarySymbols: '<div class="symbol-top">🗡️</div><div class="symbol-bottom">👁️</div>'
    },
    '매달린 사람': {
      className: 'card-hanged-man',
      mainSymbol: '🙃',
      secondarySymbols: '<div class="symbol-top">🌳</div><div class="symbol-bottom">💡</div>'
    },
    '죽음': {
      className: 'card-death',
      mainSymbol: '💀',
      secondarySymbols: '<div class="symbol-top">🌹</div><div class="symbol-bottom">🦋</div>'
    },
    '절제': {
      className: 'card-temperance',
      mainSymbol: '🕊️',
      secondarySymbols: '<div class="symbol-top">🌊</div><div class="symbol-bottom">🔥</div>'
    },
    '악마': {
      className: 'card-devil',
      mainSymbol: '😈',
      secondarySymbols: '<div class="symbol-top">⛓️</div><div class="symbol-bottom">🔥</div>'
    },
    '탑': {
      className: 'card-tower',
      mainSymbol: '⚡',
      secondarySymbols: '<div class="symbol-top">🏰</div><div class="symbol-bottom">🔥</div>'
    },
    '별': {
      className: 'card-star',
      mainSymbol: '⭐',
      secondarySymbols: '<div class="symbol-top">🌊</div><div class="symbol-bottom">🌺</div>'
    },
    '달': {
      className: 'card-moon',
      mainSymbol: '🌙',
      secondarySymbols: '<div class="symbol-top">🐺</div><div class="symbol-bottom">🦞</div>'
    },
    '태양': {
      className: 'card-sun',
      mainSymbol: '☀️',
      secondarySymbols: '<div class="symbol-top">🌻</div><div class="symbol-bottom">👶</div>'
    },
    '심판': {
      className: 'card-judgement',
      mainSymbol: '🎺',
      secondarySymbols: '<div class="symbol-top">👼</div><div class="symbol-bottom">🕊️</div>'
    },
    '세계': {
      className: 'card-world',
      mainSymbol: '🌍',
      secondarySymbols: '<div class="symbol-top">🦅</div><div class="symbol-bottom">🐂</div>'
    }
  };
  
  return designs[card.name] || {
    className: 'card-default',
    mainSymbol: getSuitSymbol(card.suit),
    secondarySymbols: '<div class="symbol-top">✨</div><div class="symbol-bottom">✨</div>'
  };
}

// 슈트별 심볼 반환 함수
function getSuitSymbol(suit) {
  const symbols = {
    'major': '🌟',
    'wands': '🔥',
    'cups': '💧',
    'swords': '⚔️',
    'pentacles': '💰'
  };
  return symbols[suit] || '🃏';
}

// 마크다운을 HTML로 변환하는 함수 (기존 함수 재사용)
function markdownToHtml(markdown) {
  if (!markdown) return '';
  
  return markdown
    // 제목 처리
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // 굵은 글씨
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // 기울임꼴
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // 줄바꿈
    .replace(/\n/g, '<br>')
    
    // 리스트
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
}

// 타로 도움말 토글 함수
function toggleTarotHelp() {
  const popup = document.getElementById('tarotHelpPopup');
  if (popup.style.display === 'none' || popup.style.display === '') {
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
  } else {
    popup.style.display = 'none';
    document.body.style.overflow = 'auto'; // 배경 스크롤 복원
  }
}

// 팝업 외부 클릭 시 닫기
document.addEventListener('click', function(event) {
  const popup = document.getElementById('tarotHelpPopup');
  const popupContent = document.querySelector('.tarot-help-content');
  
  if (popup && popup.style.display === 'flex' && 
      !popupContent.contains(event.target) && 
      event.target !== document.querySelector('.tarot-help-btn')) {
    toggleTarotHelp();
  }
});

// ESC 키로 팝업 닫기
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const popup = document.getElementById('tarotHelpPopup');
    if (popup && popup.style.display === 'flex') {
      toggleTarotHelp();
    }
  }
});

// 전역 함수로 노출
window.drawTarotCards = drawTarotCards;
window.toggleTarotHelp = toggleTarotHelp;

// 알림 함수 정의
function showNotification(message, type = 'info') {
  console.log(`🔔 알림 [${type}]: ${message}`);
  
  // 알림 요소 생성
  const notification = document.createElement('div');
  notification.className = `mobile-notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
      <span class="notification-message">${message}</span>
    </div>
  `;
  
  // 스타일 적용
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'success' ? 'rgba(34, 197, 94, 0.95)' : 
                 type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 
                 type === 'warning' ? 'rgba(245, 158, 11, 0.95)' : 
                 'rgba(59, 130, 246, 0.95)'};
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    font-size: 14px;
    font-weight: 500;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    animation: slideInDown 0.3s ease-out;
  `;
  
  // 페이지에 추가
  document.body.appendChild(notification);
  
  // 3초 후 자동 제거
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutUp 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }, 3000);
}

// 언어 관련 함수들
function toggleLanguageMenu() {
  const dropdown = document.getElementById('languageDropdown');
  const languageSelector = document.querySelector('.language-selector');
  
  if (dropdown.style.display === 'none' || dropdown.style.display === '') {
    dropdown.style.display = 'block';
    languageSelector.classList.add('active');
  } else {
    dropdown.style.display = 'none';
    languageSelector.classList.remove('active');
  }
}

function changeLanguage(langCode) {
  console.log('🌐 언어 변경:', langCode);
  
  // 언어 드롭다운 닫기 (요소 존재 여부 확인)
  const languageDropdown = document.getElementById('languageDropdown');
  const languageSelector = document.querySelector('.language-selector');
  
  if (languageDropdown) {
    languageDropdown.style.display = 'none';
    console.log('✅ 언어 드롭다운 닫기 완료');
  } else {
    console.log('⚠️ 언어 드롭다운 요소를 찾을 수 없음');
  }
  
  if (languageSelector) {
    languageSelector.classList.remove('active');
    console.log('✅ 언어 선택기 비활성화 완료');
  } else {
    console.log('⚠️ 언어 선택기 요소를 찾을 수 없음');
  }
  
  // 언어 변경 로직 (향후 구현)
  switch(langCode) {
    case 'ko':
      console.log('🇰🇷 한국어로 변경');
      // 한국어 적용 로직
      break;
    case 'en':
      console.log('🇺🇸 English로 변경');
      // 영어 적용 로직
      break;
    case 'zh':
      console.log('🇨🇳 中文으로 변경');
      // 중국어 적용 로직
      break;
    case 'th':
      console.log('🇹🇭 ไทย로 변경');
      // 태국어 적용 로직
      break;
    case 'vi':
      console.log('🇻🇳 Tiếng Việt로 변경');
      // 베트남어 적용 로직
      break;
    case 'km':
      console.log('🇰🇭 ភាសាខ្មែរ로 변경');
      // 캄보디아어 적용 로직
      break;
  }
  
  // 언어 변경 알림 제거 (사용자 요청)
  console.log(`🌐 언어 변경 완료: ${langCode}`);
}

// 언어 드롭다운 외부 클릭 시 닫기
document.addEventListener('click', function(event) {
  const dropdown = document.getElementById('languageDropdown');
  const languageSelector = document.querySelector('.language-selector');
  
  if (dropdown && dropdown.style.display === 'block' && 
      !dropdown.contains(event.target) && 
      !languageSelector.contains(event.target)) {
    dropdown.style.display = 'none';
    languageSelector.classList.remove('active');
  }
});

// 모바일 언어 선택기 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
  const mobileLanguageSelect = document.getElementById('mobileLanguageSelect');
  if (mobileLanguageSelect) {
    mobileLanguageSelect.addEventListener('change', function() {
      const selectedLanguage = this.value;
      console.log('🌐 모바일 언어 변경:', selectedLanguage);
      changeLanguage(selectedLanguage);
    });
  }
});

// 간단한 탭 상태 확인 함수
window.checkTabStatus = function() {
  console.log('🔍 탭 상태 확인 시작');
  
  const tabButtons = document.querySelectorAll('.numerology-tabs .tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  console.log('📊 탭 버튼 수:', tabButtons.length);
  console.log('📊 탭 패널 수:', tabPanels.length);
  
  tabButtons.forEach((btn, index) => {
    const tabName = btn.getAttribute('data-tab');
    const isActive = btn.classList.contains('active');
    const targetPanel = document.getElementById(tabName);
    const panelActive = targetPanel ? targetPanel.classList.contains('active') : false;
    const panelDisplay = targetPanel ? targetPanel.style.display : 'N/A';
    const panelVisible = targetPanel ? targetPanel.offsetHeight > 0 : false;
    
    console.log(`  탭 ${index + 1}: ${tabName}`);
    console.log(`    - 버튼 활성: ${isActive}`);
    console.log(`    - 패널 활성: ${panelActive}`);
    console.log(`    - 패널 표시: ${panelDisplay}`);
    console.log(`    - 패널 높이: ${targetPanel ? targetPanel.offsetHeight : 'N/A'}`);
    console.log(`    - 패널 보임: ${panelVisible}`);
  });
  
  // 현재 보이는 패널 찾기
  const visiblePanels = Array.from(tabPanels).filter(panel => 
    panel.style.display === 'block' || panel.offsetHeight > 0
  );
  
  console.log('👁️ 현재 보이는 패널:', visiblePanels.map(p => p.id));
};