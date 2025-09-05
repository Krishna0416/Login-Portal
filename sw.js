// Service Worker for PWA functionality
const CACHE_NAME = 'portal-login-v1.0.0';
const STATIC_CACHE = 'portal-static-v1.0.0';
const DYNAMIC_CACHE = 'portal-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/styles.css',
    '/dashboard.css',
    '/advanced-features.css',
    '/script.js',
    '/dashboard.js',
    '/advanced-features.js',
    '/advanced-ui-features.js',
    '/advanced-analytics.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/js-md5/0.7.3/md5.min.js',
    'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'
];

// Dynamic files that should be cached on first request
const DYNAMIC_FILES = [
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📦 Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('✅ Static files cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Failed to cache static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker activated');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve cached files and implement caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http(s) requests
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Handle different types of requests with appropriate strategies
    if (STATIC_FILES.includes(url.pathname) || STATIC_FILES.includes(request.url)) {
        // Cache First strategy for static files
        event.respondWith(cacheFirst(request));
    } else if (url.hostname === 'fonts.googleapis.com' || 
               url.hostname === 'cdnjs.cloudflare.com' ||
               url.hostname === 'cdn.jsdelivr.net') {
        // Stale While Revalidate for external resources
        event.respondWith(staleWhileRevalidate(request));
    } else if (url.pathname.endsWith('.json') || 
               url.pathname.includes('/api/')) {
        // Network First for API calls and data
        event.respondWith(networkFirst(request));
    } else {
        // Stale While Revalidate for other resources
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Caching Strategies

// Cache First - serve from cache, fallback to network
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Cache First failed:', error);
        return new Response('Offline content not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Network First - try network, fallback to cache
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', request.url);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page or default response
        return new Response(JSON.stringify({
            error: 'Network unavailable',
            message: 'Please check your internet connection',
            offline: true
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Stale While Revalidate - serve from cache, update in background
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await caches.match(request);
    
    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => {
        // Network failed, but we might have cached version
        return cachedResponse;
    });
    
    // Return cached version immediately if available, otherwise wait for network
    return cachedResponse || fetchPromise;
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'offline-login-attempts') {
        event.waitUntil(syncOfflineData());
    }
});

// Sync offline data when connection is restored
async function syncOfflineData() {
    try {
        const offlineData = await getOfflineData();
        if (offlineData.length > 0) {
            console.log('📡 Syncing offline data:', offlineData);
            
            // Process each offline action
            for (const action of offlineData) {
                await processOfflineAction(action);
            }
            
            // Clear offline data after successful sync
            await clearOfflineData();
            
            // Notify clients about successful sync
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({
                    type: 'OFFLINE_SYNC_SUCCESS',
                    message: 'Offline data synced successfully'
                });
            });
        }
    } catch (error) {
        console.error('❌ Failed to sync offline data:', error);
    }
}

// Process individual offline action
async function processOfflineAction(action) {
    try {
        const response = await fetch(action.url, {
            method: action.method,
            headers: action.headers,
            body: action.body
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        console.log('✅ Offline action processed:', action.type);
        return response;
    } catch (error) {
        console.error('❌ Failed to process offline action:', error);
        throw error;
    }
}

// Helper functions for offline data management
async function getOfflineData() {
    return new Promise((resolve) => {
        // In a real implementation, this would read from IndexedDB
        const offlineData = JSON.parse(localStorage.getItem('offlineActions') || '[]');
        resolve(offlineData);
    });
}

async function clearOfflineData() {
    return new Promise((resolve) => {
        localStorage.removeItem('offlineActions');
        resolve();
    });
}

// Push notification handling
self.addEventListener('push', (event) => {
    console.log('📬 Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New notification from Portal',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            url: '/'
        },
        actions: [
            {
                action: 'open',
                title: 'Open Portal',
                icon: '/icon-32x32.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/close-icon.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Portal Login System', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/')
        );
    }
    // 'dismiss' action just closes the notification
});

// Message handling from main thread
self.addEventListener('message', (event) => {
    console.log('💬 Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            cacheUrls(event.data.urls)
        );
    }
});

// Cache additional URLs on demand
async function cacheUrls(urls) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.addAll(urls);
        console.log('✅ Additional URLs cached:', urls);
    } catch (error) {
        console.error('❌ Failed to cache additional URLs:', error);
    }
}

// Periodic cleanup of old cache entries
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'cache-cleanup') {
        event.waitUntil(cleanupOldCaches());
    }
});

async function cleanupOldCaches() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const requests = await cache.keys();
        const now = Date.now();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        for (const request of requests) {
            const response = await cache.match(request);
            const dateHeader = response.headers.get('date');
            
            if (dateHeader) {
                const responseDate = new Date(dateHeader).getTime();
                if (now - responseDate > maxAge) {
                    await cache.delete(request);
                    console.log('🗑️ Removed old cache entry:', request.url);
                }
            }
        }
    } catch (error) {
        console.error('❌ Cache cleanup failed:', error);
    }
}

// Error handling
self.addEventListener('error', (event) => {
    console.error('💥 Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('💥 Service Worker unhandled rejection:', event.reason);
});

console.log('🎯 Service Worker loaded successfully');
console.log('📋 Cache strategy: Cache First for static, Network First for API, Stale While Revalidate for dynamic');
console.log('🔄 Background sync enabled for offline actions');
console.log('📬 Push notifications supported');
console.log('🏠 PWA features enabled');
