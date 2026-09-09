self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function(event){
  var data = {};
  try{ data = event.data ? event.data.json() : {}; }catch(e){}
  var title = data.title || 'ЗаписьКрасоты';
  var opts = {
    body: data.body || '',
    icon: 'icons/icon-192-master.png',
    badge: 'icons/favicon-32-master.png',
    tag: data.tag || 'zapis',
    data: { url: data.url || 'app.html' }
  };
  event.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener('notificationclick', function(event){
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || 'app.html';
  event.waitUntil(self.clients.matchAll({type:'window', includeUncontrolled:true}).then(function(list){
    for(var i=0;i<list.length;i++){
      if(list[i].url.indexOf(url) !== -1 && 'focus' in list[i]) return list[i].focus();
    }
    if(self.clients.openWindow) return self.clients.openWindow(url);
  }));
});
