/**
 * Performance optimization utilities
 * - Image lazy loading
 * - Component code splitting
 * - Asset preloading
 */

import React from 'react';
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
}

/**
 * Preload multiple images in parallel
 */
export async function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

/**
 * Optimize images with srcset for responsive loading
 */
export function generateImageSrcSet(
  basePath: string,
  sizes: number[] = [240, 360, 480, 720]
): string {
  return sizes
    .map((size) => `${basePath}?w=${size} ${size}w`)
    .join(', ');
}

/**
 * Lazy load element into viewport
 */
export function useLazyLoad(
  elementRef: React.RefObject<HTMLElement>,
  callback: () => void,
  options: IntersectionObserverInit = { threshold: 0.1 }
): void {
  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
        observer.unobserve(entry.target);
      }
    }, options);

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [elementRef, callback, options]);
}

/**
 * Defer non-critical function execution
 */
export function deferExecution(callback: () => void, delay: number = 0): void {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => callback(), { timeout: delay });
  } else {
    setTimeout(callback, delay);
  }
}

/**
 * Optimize long lists with virtualization support
 */
export function useVirtualization(
  items: any[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 3
) {
  const [scrollTop, setScrollTop] = React.useState(0);

  const visibleRange = {
    start: Math.max(0, Math.floor(scrollTop / itemHeight) - overscan),
    end: Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    ),
  };

  return {
    visibleItems: items.slice(visibleRange.start, visibleRange.end),
    offset: visibleRange.start * itemHeight,
    totalHeight: items.length * itemHeight,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    },
  };
}

/**
 * Cache API responses
 */
export class ResponseCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl: number;

  constructor(ttlMs: number = 3600000) {
    this.ttl = ttlMs;
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Measure performance
 */
export function measurePerformance(label: string, callback: () => void): void {
  const start = performance.now();
  callback();
  const end = performance.now();
  console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
}

/**
 * Request animation frame wrapper
 */
export function requestAnimationFrameAsync(): Promise<DOMHighResTimeStamp> {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve);
  });
}
