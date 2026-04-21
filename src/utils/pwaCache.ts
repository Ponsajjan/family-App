/**
 * Clears specific PWA caches that might contain stale API or Next.js data.
 */
export const clearPWACaches = async () => {
    if (typeof window !== 'undefined' && 'caches' in window) {
        try {
            const cacheNames = await caches.keys();
            const targetCaches = ['apis', 'next-data'];
            await Promise.all(
                cacheNames
                    .filter((name) => targetCaches.some((target) => name.includes(target)))
                    .map((name) => caches.delete(name))
            );
            console.log("[PWA Cache] Successfully destroyed targeted caches.");
        } catch (err) {
            console.error("[PWA Cache] Failed to clear cache:", err);
        }
    }
}
