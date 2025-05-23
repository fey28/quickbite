// firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyBxU3aFH4vWCy1WD_BBG4Y4bB6GCPbcOZQ",
    authDomain: "quickbite-56340.firebaseapp.com",
    projectId: "quickbite-56340",
    storageBucket: "quickbite-56340.firebasestorage.app",
    messagingSenderId: "262160280043",
    appId: "1:262160280043:web:b86ec3339334f3bce2d1ae",
    measurementId: "G-R8LSHD0TE6"
});

const messaging = firebase.messaging();

// 🔔 notificare în foreground (când e deschis)
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/pwa-192x192.png"
  });
});
