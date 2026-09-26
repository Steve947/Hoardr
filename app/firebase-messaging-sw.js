// Hoardr — Firebase Cloud Messaging background service worker.
// Registered at a dedicated scope so it coexists with the app SW (sw.js).
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyC_LlFae2pwiu6c2Pt7avFAwZfFRmIYf9w",
  authDomain: "dads-collections.firebaseapp.com",
  projectId: "dads-collections",
  storageBucket: "dads-collections.firebasestorage.app",
  messagingSenderId: "1036789531654",
  appId: "1:1036789531654:web:4730152a416a24ff67ef87"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const n = payload.notification || {};
  const data = payload.data || {};
  self.registration.showNotification(n.title || 'Hoardr', {
    body: n.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: data
  });
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (const c of list) { if ('focus' in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});
