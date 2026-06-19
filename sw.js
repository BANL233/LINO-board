const CACHE_NAME = 'lino-tactical-v2';  // 更新版本号
const urlsToCache = [
    'index.html',
    'images/BANK.png',
    // 不需要再列出所有图标，改为运行时缓存
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    // 如果是干员图标请求（images/ 下 .png），采用“缓存优先”策略
    if (url.pathname.startsWith('/images/') && url.pathname.endsWith('.png')) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse; // 缓存命中
                }
                // 否则请求并缓存
                return fetch(event.request).then(response => {
                    // 注意：只缓存成功响应
                    if (response && response.status === 200) {
                        const cloned = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, cloned);
                        });
                    }
                    return response;
                });
            })
        );
    } else {
        // 其他资源（包括地图）使用“缓存优先，回退到网络”策略
        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request))
        );
    }
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
