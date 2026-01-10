import { useEffect, RefObject } from 'react';

/**
 * Custom hook for infinite scroll pagination
 * @param containerRef - Reference to the scrollable container element
 * @param isFetching - Whether data is currently being fetched
 * @param hasMore - Whether there are more items to fetch
 * @param onLoadMore - Callback function to load more items
 * @param threshold - Distance from bottom (in pixels) to trigger load (default: 200)
 * @param debounceMs - Debounce delay for scroll events (default: 100)
 */
export function useInfiniteScroll(
    containerRef: RefObject<HTMLElement | null>,
    isFetching: boolean,
    hasMore: boolean,
    onLoadMore: () => void,
    threshold: number = 200,
    debounceMs: number = 100
) {
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleScroll = () => {
            if (isFetching || !hasMore) return;

            // Clear any existing timeout
            if (timeoutId) clearTimeout(timeoutId);

            // Debounce the scroll event
            timeoutId = setTimeout(() => {
                // Check container scroll if containerRef exists
                if (containerRef.current) {
                    const container = containerRef.current;
                    const distanceFromBottom = container.scrollHeight - (container.scrollTop + container.clientHeight);

                    if (distanceFromBottom <= threshold) {
                        onLoadMore();
                        return;
                    }
                }

                // Check window scroll as fallback
                if (typeof window !== 'undefined') {
                    const distanceFromBottom = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);

                    if (distanceFromBottom <= threshold) {
                        onLoadMore();
                    }
                }
            }, debounceMs);
        };

        const currentContainer = containerRef.current;
        currentContainer?.addEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleScroll);

        return () => {
            currentContainer?.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handleScroll);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [containerRef, isFetching, hasMore, onLoadMore, threshold, debounceMs]);
}
