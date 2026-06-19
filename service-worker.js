const CACHE_NAME = 'lino-tactical-v1';
const urlsToCache = [
    'index.html',
    'images/BANK.png',      // 默认地图
    'images/ash.png',       // 至少缓存常用干员图标（可选）
    // 你也可以不缓存所有干员，按需加载
];

// 安装时缓存核心资源
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// 拦截请求，优先从缓存返回
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

// 清理旧缓存
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});
