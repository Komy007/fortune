const CACHE_NAME = 'fortuneteller-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/auth.html',
  '/test-contacts.html',
  '/manifest.json',
  // Essential API endpoints for offline
  '/api/auth/me',
  '/health'
];

// 설치 이벤트 - 필수 리소스 캐시
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Opened cache:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('❌ Cache install failed:', error);
      })
  );
  // 새 서비스 워커 즉시 활성화
  self.skipWaiting();
});

// 활성화 이벤트 - 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // 즉시 클라이언트 제어
  self.clients.claim();
});

// 네트워크 요청 인터셉트
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // GET 요청만 캐시 처리
  if (request.method !== 'GET') {
    return;
  }

  // API 요청에 대한 네트워크 우선 전략
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // 성공적인 응답이면 캐시에 저장
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // 네트워크 실패시 캐시에서 반환
          return caches.match(request);
        })
    );
    return;
  }

  // 정적 리소스에 대한 캐시 우선 전략
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // 캐시된 버전이 있으면 반환하고 백그라운드에서 업데이트
          fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
            })
            .catch(() => {
              console.log('📱 Background update failed for:', request.url);
            });
          
          return cachedResponse;
        }

        // 캐시에 없으면 네트워크에서 가져오기
        return fetch(request)
          .then((response) => {
            // 유효한 응답인지 확인
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 응답을 캐시에 저장
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // 네트워크도 실패하면 기본 페이지 반환
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// 푸시 알림 처리 (향후 확장용)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1,
      },
      actions: [
        {
          action: 'explore',
          title: '자세히 보기',
        },
        {
          action: 'close',
          title: '닫기',
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || '포춘텔러 알림', options)
    );
  }
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// 백그라운드 동기화 (향후 확장용)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // 백그라운드에서 수행할 작업
      console.log('🔄 Background sync triggered')
    );
  }
});

console.log('🚀 포춘텔러 Service Worker 준비완료!');