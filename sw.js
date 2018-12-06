const staticAssets = [
    './',
    './styles.css',
    './app.js',
    './fallback.json',
    './images/fetch-dog.jpg'
];

self.addEventListener('install', async e => {
    console.log("event: install")
    const cache = await caches.open('news-statics');
    cache.addAll(staticAssets);
});

self.addEventListener('fetch', e => {
    console.log("event: fetch")
    console.log("request = "+e.request);
    const req = e.request;
    const url = new URL(req.url);

    if(url.origin === location.origin) {
        console.log('offline');
        e.respondWith(cacheFirst(req));
    } else {
        console.log('online');
        e.respondWith(networkFirst(req));
    }

});

async function cacheFirst(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open('news-dynamics');

    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        const cachedResponse = await cache.match(req);
        return cachedResponse || await caches.match('./fallback.json');
    }
}
