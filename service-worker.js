// service-worker.js

// 1. تحديد اسم ونسخة الذاكرة المؤقتة (Cache)
const CACHE_NAME = 'media-explorer-cache-v1';

// 2. قائمة بالملفات الأساسية التي يجب تخزينها مؤقتاً عند التثبيت
const urlsToCache = [
  // الملفات الرئيسية
  '/Exercise-plank/index.html', 
  '/Exercise-plank/manifest.json',
  '/Exercise-plank/', // المسار الجذر

  // الأيقونات (تم التأكد من مسارها المطلق)
  '/Exercise-plank/icon-192x192.png',
  '/Exercise-plank/icon-512x512.png',
  '/Exercise-plank/maskable_icon.png', 
];

// 3. حدث التثبيت (Install Event)
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching App Shell');
        // هنا يتم محاولة جلب وتخزين الملفات بالمسارات المطلقة الجديدة
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Service Worker: Failed to cache', err);
      })
  );
  self.skipWaiting(); 
});

// 4. حدث الجلب (Fetch Event)
self.addEventListener('fetch', (event) => {
  // لا تقم بالتخزين المؤقت لطلبات YouTube/Google (هذا الجزء صحيح)
  if (event.request.url.includes('googleapis.com') || event.request.url.includes('youtube.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(err => {
        console.log('Service Worker: Fetch failed', err);
      })
  );
});

// 5. حدث التفعيل (Activate Event)
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
