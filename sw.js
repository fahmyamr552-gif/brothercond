// BrotherCond management system: push notifications for cases
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { title: 'برازر كوند', body: e.data ? e.data.text() : '' }; }
  var url = './' + (d.case_id ? ('?case=' + encodeURIComponent(d.case_id)) : '');
  e.waitUntil(self.registration.showNotification(d.title || 'برازر كوند', {
    body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png',
    tag: d.case_id || undefined, renotify: !!d.case_id, dir: 'rtl', lang: 'ar', data: { url: url }
  }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (c.url.indexOf('booking.html') === -1 && c.url.indexOf('book.html') === -1 && 'focus' in c) {
        try { c.postMessage({ type: 'bc-open-case', url: url }); } catch (err) {}
        return c.focus();
      }
    }
    return self.clients.openWindow(url);
  }));
});
