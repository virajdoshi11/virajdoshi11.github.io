const staticCache = "site-static-v2";
const dynamicCache = "site-dynamic-v2";

//here each entry is the key to the value which will be the response of that key
const assets = [
  "/",
  "/js/index.js",
  "/css/index.css",
  "/js/utilities.js",
  "/manifest.webmanifest",
  "/css/projects.css",
  "/icons/manifest-icon-192.maskable.png",
  "https://cdn.glitch.global/4e6df72e-2aca-481b-a11d-a2b808a5d1d7/VirajDoshi.webp?v=1677108369174",
  "https://cdn.glitch.global/2d4882ca-9b62-4da8-b91c-c07f71a3bcc7/ProjsPlaceHolder.png?v=1678245216695",
  "https://cdn.jsdelivr.net/npm/TagCloud@2.2.0/dist/TagCloud.min.js",
  "https://fonts.googleapis.com/css2?family=Unbounded&display=swap",
  // "https://fonts.gstatic.com/s/unbounded/v5/Yq6F-LOTXCb04q32xlpat-6uR42XTqtG6xjx44fNgdyOV0c1bY8p.woff2",
  "https://fonts.gstatic.com/s/unbounded/v5/Yq6F-LOTXCb04q32xlpat-6uR42XTqtG6xjx44rNgdyOV0c1bQ.woff2",
  // "https://fonts.googleapis.com",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js",
  "https://cdn.glitch.global/2d4882ca-9b62-4da8-b91c-c07f71a3bcc7/VirajDoshiLogo2.png?v=1678059876222",
  "/html/fallback.html"
];

function limitCacheSize(name, size) {
  caches.open(name).then(cache => {
    cache.keys().then(key => {
      while(key.length > size) {
        cache.delete(key[0]);
      }
    })
  })
}

// we do caching here because install event only runs when we change our
// service worker file (this file)
self.addEventListener("install", evt => {
  // console.log("service worker installed");

  //the browser closes the service worker once it is installed and our chaching method
  //is asynchronous ie it will take some time, so, to ensure that our chaching is 
  //complete before the browser closes the service worker we use this method
  evt.waitUntil(
    //if the cache doesnt exist then the browser will create a cache
    caches.open(staticCache).then(cache => {
      cache.addAll(assets);
    })
  );
})

self.addEventListener("activate", evt => {
  // console.log("service worker activated");

  //we have to delete all the previous caches so that the browser isn't confused
  //on what cache to select the data from
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== staticCache && key !== dynamicCache).map(key => caches.delete(key))
      )
    })
  );
})

self.addEventListener("fetch", evt => {
  // console.log("fetch event", evt);
  // here we stop the request going to server with respondWith method and match that
  // request with one of our cached requests
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      //if the request is something that we dont cache then cacheRes will be empty
      //in this case just complete the fetch request originally made by the user
      return cacheRes || fetch(evt.request).then(fetchRes => {
        
        //dont cache any chrome extension requests
        if(evt.request.url.indexOf("chrome-extension") != 0) {
          console.log(evt.request.url, "This was not cached, caching now...");
          return caches.open(dynamicCache).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            limitCacheSize(dynamicCache, 20)
            return fetchRes;
          });
        }
      });
      //the catch below id for is the user didnt visit a particular page(ie it is not cached)
      //and he wants to visit it offline (both the above condiions fail) then in such
      //situations send the fallback.html page
    }).catch(() => {
      if(evt.request.url.indexOf(".html") > -1) {
        return caches.match("/public/html/fallback.html")
      }
    })
  )
})