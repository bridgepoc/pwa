//const { response } = require("express");

self.addEventListener('install',(event) =>{
    console.log('installing');
    event.waitUntil(
        caches.open("static-cache")
        .then((cache)=>{
            return cache.addAll([
                'css/bootstrap.min.css',
                'css/bootstrap.min.css.map',
                'js/bootstrap.bundle.min.js',
                'js/bootstrap.bundle.min.js.map',
                'images/icon512.png',
            ]);
        })
    );
});
self.addEventListener('active',(event)=>{
    console.log('now ready to handle fetch');
});
self.addEventListener('fetch', (event)=>{
    console.log('now fetch');
    const request = event.request;
    const url = request.url;

    if(request.headers.get("Accept").includes("text/html")){
        event.respondWith(
            caches.match(request)
            .then(cached_result =>{
                if(cached_result){
                    return cached_result;
                }
                return fetch(request)
                .then(response =>{
                    const copy = response.clone();
                    event.waitUntil(
                        caches.open("pages")
                        .then(cache =>{
                            return cache.put(request, response);
                        })
                    );
                    return response;
                });
            })
        );
    }
});