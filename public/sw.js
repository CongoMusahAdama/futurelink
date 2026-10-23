// Future-Link Check-in service worker.
// - Pages: network first, so a new deploy shows straight away; cached copy only when offline.
// - Hashed build assets (/assets/*): cache first (their names change on every deploy).
// - Images and other static files: served from cache, refreshed in the background.
// - /api/* and other origins are never cached, so check-ins and stats are always live.
const VERSION = "v1";
const CACHE = `fl-checkin-${VERSION}`;
const APP_SHELL = ["/", "/index.html", "/manifest.webmanifest", "/pwa/icon-192.png", "/pwa/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function cachePut(request, response) {
  if (response && response.ok && response.type === "basic") {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(request, copy));
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => cachePut("/index.html", res))
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(caches.match(request).then((hit) => hit || fetch(request).then((res) => cachePut(request, res))));
    return;
  }

  event.respondWith(
    caches.match(request).then((hit) => {
      const network = fetch(request)
        .then((res) => cachePut(request, res))
        .catch(() => hit);
      return hit || network;
    })
  );
});
