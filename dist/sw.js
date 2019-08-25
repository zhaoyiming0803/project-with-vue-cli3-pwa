/**
 * Service Worker
 * @author zhaoyiming
 * @since  2019/08/25
 */

const cacheVersion = '201908021034';
const cacheName = 'cache-' + cacheVersion;
const preCacheUrls = [];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(preCacheUrls))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      clearCache(),
      self.clients.claim()
    ])
  );
});

function clearCache () {
  return caches.keys().then(keys => {
    return keys.map(key => {
      if (key !== cacheName) {
        return caches.delete(key);
      }
    });
  });
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method === 'POST') {
    return;
  }

  let promise = null;

  if (/\/api\//img.test(req.url)) {
    promise = fetchAndCache(req);
  } else {
    promise = caches.match(req)
      .then(res => {
        if (res) return res;
        return fetchAndCache(req);
      });
  }

  promise && event.respondWith(promise);
});

function fetchAndCache (req) {
  const cachedReq = req.clone();
  return fetch(cachedReq)
    .then(res => {
      if (!res || res.status !== 200) {
        return res;
      }
      const cachedRes = res.clone();
      caches.open(cacheName).then(cache => cache.put(cachedReq, cachedRes));
      return res;
    })
    .catch((err) => {
      return caches.match(cachedReq)
        .then(res => {
          if (res) return res;
          return err;
        });
    });
}