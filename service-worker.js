// service-worker.js (الإصدار المُبسط والمُنقّح)

const CACHE_NAME = 'media-explorer-cache-v2'; // يجب تغيير اسم الكاش لإجباره على التحديث

// قائمة الملفات الأساسية التي يجب تخزينها مؤقتاً
const urlsToCache = [
  // المسار الجذر هو الأهم
  '/Exercise-plank/', 
  // ملفات الـ PWA
  '/Exercise-plank/index.html', 
  '/Exercise-plank/manifest.json',

  // الأيقونات (تم التأكد من مسارها)
  '/Exercise-plank/icon-192x192.png',
  '/Exercise-plank/icon-512x512.png',
  // لا تنس تضمين أي ملفات CSS أو JS أخرى خارجية إذا لم تكن مضمنة في index.html
  // لا نحتاج لـ maskable_icon.png للتثبيت، لكن تضمينها جيد لتمكين ميزة Maskable Icons
  '/Exercise-plank/maskable_icon.png', 
];

// ... (بقية الكود تبقى كما هي)
// تأكد من أن الجزء التالي كما هو:
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME) // يستخدم CACHE_NAME الجديد
      .then((cache) => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        // هذا السطر هو الأهم: سيسجل أي ملف فشل في تحميله!
        console.log('Service Worker: Failed to cache', err); 
        // إذا ظهر خطأ هنا في الـ Console، فإنه سيحدد الملف المفقود
      })
  );
  self.skipWaiting(); 
});
// ... (بقية الكود)
