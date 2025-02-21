self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("key-app-v1").then((cache) => {
            return cache.addAll(["/", "/index.html", "/App.css"]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches
            .match(event.request)
            .then((response) => response || fetch(event.request))
    );
});

self.addEventListener("sync", (event) => {
    if (event.tag === "sync-keys") {
        event.waitUntil(syncPendingActions());
    }
});

async function syncPendingActions() {
    const pending = JSON.parse(localStorage.getItem("pending") || "[]");
    for (const action of pending) {
        await fetch(action.url, {
            method: "POST",
            body: JSON.stringify(action.data),
        });
    }
    localStorage.setItem("pending", "[]");
}
