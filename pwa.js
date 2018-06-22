// Service worker
if (window.location.href.match('localhost') || navigator.serviceWorker.controller) {
  console.log('[PWA Builder] active service worker found, or you are in localhost, no need to register')
} else {
  //Register the ServiceWorker
  navigator.serviceWorker.register('sw.js', {
    scope: './'
  }).then(function(reg) {
    console.log('Service worker has been registered for scope:'+ reg.scope);
  });
}

// Persistent storage API
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then(granted => {
    // If granted, Storage will not be cleared except by explicit user action
    // Otherwise, storage may be cleared by the UA under storage pressure.
  });
}

// Notification
if ("Notification" in window) {
  if (Notification.permission !== 'denied') {
    // ask for permission for use later
    Notification.requestPermission();
  }
}
