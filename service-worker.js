var VERSION = 'v1';

var cacheFirstFiles = [
    // ADDME: Add paths and URLs to pull from cache first if it has been loaded before. Else fetch from network.
    // If loading from cache, fetch from network in the background to update the resource. Examples:,
    '../css/gfx/audio/blogposts.wav',
    '../css/gfx/audio/dashboard.wav',
    '../css/gfx/audio/hover.wav',
    '../css/gfx/audio/releasenotes.wav',
    '../css/gfx/audio/resources.wav',
    '../css/gfx/audio/settings.wav',
    '../css/gfx/audio/status.wav',
    '../css/gfx/audio/submenu.wav',
    '../css/gfx/videos/ancient.mp4',
    '../css/gfx/videos/anubis.mp4',
    '../css/gfx/videos/apollo.mp4',
    '../css/gfx/videos/blacksite.mp4',
    '../css/gfx/videos/cbble.mp4',
    '../css/gfx/videos/engage.mp4',
    '../css/gfx/videos/frostbite.mp4',
    '../css/gfx/videos/guard.mp4',
    '../css/gfx/videos/mutiny.mp4',
    '../css/gfx/videos/nuke.mp4',
    '../css/gfx/videos/sirocco.mp4',
    '../css/gfx/videos/sirocco_night.mp4',
    '../css/gfx/videos/swamp.mp4',
    '../css/gfx/videos/vertigo.mp4',
    '../css/gfx/models/bloody_darryl.glb',
    '../css/gfx/models/condom_man.glb',
    '../css/gfx/models/dead_cold.glb',
    '../css/gfx/models/farlow.glb',
    '../css/gfx/models/fbi_operator.glb',
    '../css/gfx/models/phoenix_soldier.glb',
    '../css/gfx/icon.ico',
    '../css/gfx/logo.png',
    '../css/gfx/default_news.png',
    '../css/gfx/rn-bg-1.jpg',
    '../css/gfx/rn-bg-2.jpg',
    '../css/gfx/rn-bg-3.jpg'
];

var networkFirstFiles = [
    // ADDME: Add paths and URLs to pull from network first. Else fall back to cache if offline. Examples:
    '/index.html',
    '../css/styles.css',
    '../css/twentytwenty.css',
    '../js/jquery.event.move.js',
    '../js/jquery.twentytwenty.js',
    '../js/lang.js',
    '../js/base.js'
];

// Below is the service worker code.

var cacheFiles = cacheFirstFiles.concat(networkFirstFiles);

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(VERSION).then(cache => {
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') { return; }
    if (networkFirstFiles.indexOf(event.request.url) !== -1) {
        event.respondWith(networkElseCache(event));
    } else if (cacheFirstFiles.indexOf(event.request.url) !== -1) {
        event.respondWith(cacheElseNetwork(event));
    } else {
        event.respondWith(fetch(event.request));
    }
});

// If cache else network.
// For images and assets that are not critical to be fully up-to-date.
// developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/
// #cache-falling-back-to-network
function cacheElseNetwork(event) {
    return caches.match(event.request).then(response => {
        function fetchAndCache() {
            return fetch(event.request).then(response => {
                // Update cache.
                caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
                return response;
            });
        }

        // If not exist in cache, fetch.
        if (!response) { return fetchAndCache(); }

        // If exists in cache, return from cache while updating cache in background.
        fetchAndCache();
        return response;
    });
}

// If network else cache.
// For assets we prefer to be up-to-date (i.e., JavaScript file).
function networkElseCache(event) {
    return caches.match(event.request).then(match => {
        if (!match) { return fetch(event.request); }
        return fetch(event.request).then(response => {
            // Update cache.
            caches.open(VERSION).then(cache => cache.put(event.request, response.clone()));
            return response;
        }) || response;
    });
}