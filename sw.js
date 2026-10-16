/* 더행복한교회 앱: 늘 홈페이지의 최신 화면을 받아오고, 인터넷이 끊겼을 때만 마지막으로 본 화면을 보여 줍니다. */
const C = "thc-v3";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const req = e.request, u = new URL(req.url);
  if (req.method !== "GET" || u.origin !== location.origin) return;
  const page = req.mode === "navigate" || /\.html?$/.test(u.pathname) || u.pathname === "/";
  e.respondWith(fetch(req, page ? { cache: "no-store" } : {}).then(r => { if (r.ok && r.type === "basic") { const cp = r.clone(); caches.open(C).then(c => c.put(req, cp)); } return r; })
    .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("/"))));
});
