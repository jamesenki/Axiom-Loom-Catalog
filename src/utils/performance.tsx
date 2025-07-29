/**
 * Performance Optimization Utilities
 * 
 * Provides utilities for optimizing application performance
 */

/**
 * Lazy load components with loading states
 */
import React, { lazy, Suspense, ComponentType } from 'react';

export function lazyLoadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <div className="p-4 text-center">Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Memoize expensive computations
 */
export class MemoizedCache<K, V> {
  private cache = new Map<string, { value: V; timestamp: number }>();
  private maxAge: number;
  private maxSize: number;

  constructor(maxAge: number = 5 * 60 * 1000, maxSize: number = 100) {
    this.maxAge = maxAge;
    this.maxSize = maxSize;
  }

  get(key: K, compute: () => V): V {
    const keyStr = JSON.stringify(key);
    const cached = this.cache.get(keyStr);
    
    if (cached && Date.now() - cached.timestamp < this.maxAge) {
      return cached.value;
    }

    const value = compute();
    this.set(keyStr, value);
    return value;
  }

  private set(key: string, value: V): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, { value, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

/**
 * Debounce function for reducing API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for rate limiting
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Virtual list for rendering large lists efficiently
 */
export interface VirtualListOptions {
  itemHeight: number;
  containerHeight: number;
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  overscan?: number;
}

export function calculateVisibleRange(
  scrollTop: number,
  options: VirtualListOptions
): { startIndex: number; endIndex: number; offsetY: number } {
  const { itemHeight, containerHeight, items, overscan = 3 } = options;
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );
  
  const offsetY = startIndex * itemHeight;
  
  return { startIndex, endIndex, offsetY };
}

/**
 * Image lazy loading with intersection observer
 */
export function setupImageLazyLoading(): void {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

/**
 * Preload critical resources
 */
export function preloadResources(urls: string[]): void {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    
    if (url.endsWith('.css')) {
      link.as = 'style';
    } else if (url.endsWith('.js')) {
      link.as = 'script';
    } else if (url.match(/\.(jpg|jpeg|png|webp|svg)$/i)) {
      link.as = 'image';
    }
    
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Request idle callback polyfill
 */
export const requestIdleCallback = 
  window.requestIdleCallback ||
  function (cb: IdleRequestCallback): number {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
      });
    }, 1) as unknown as number;
  };

/**
 * Cancel idle callback polyfill
 */
export const cancelIdleCallback =
  window.cancelIdleCallback ||
  function (id: number): void {
    clearTimeout(id);
  };

/**
 * Batch DOM updates
 */
export class DOMBatcher {
  private updates: (() => void)[] = [];
  private scheduled = false;

  add(update: () => void): void {
    this.updates.push(update);
    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(() => this.flush());
    }
  }

  private flush(): void {
    const updates = this.updates.slice();
    this.updates = [];
    this.scheduled = false;
    
    updates.forEach(update => update());
  }
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private marks = new Map<string, number>();

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark: string, endMark?: string): number {
    const start = this.marks.get(startMark);
    const end = endMark ? this.marks.get(endMark) : performance.now();
    
    if (start === undefined || (endMark && end === undefined)) {
      console.warn(`Performance mark not found: ${startMark} or ${endMark}`);
      return 0;
    }
    
    const duration = (end || performance.now()) - start;
    
    if (window.performance && window.performance.measure) {
      try {
        window.performance.measure(name, startMark, endMark);
      } catch (e) {
        // Ignore if marks don't exist
      }
    }
    
    return duration;
  }

  logMetrics(): void {
    if (window.performance && window.performance.getEntriesByType) {
      const metrics = {
        navigation: window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming,
        paint: window.performance.getEntriesByType('paint'),
        resource: window.performance.getEntriesByType('resource').slice(0, 10)
      };
      
      console.group('Performance Metrics');
      console.log('Page Load Time:', metrics.navigation?.loadEventEnd - metrics.navigation?.fetchStart, 'ms');
      console.log('DOM Content Loaded:', metrics.navigation?.domContentLoadedEventEnd - metrics.navigation?.fetchStart, 'ms');
      console.log('First Paint:', metrics.paint);
      console.table(metrics.resource.map(r => ({
        name: r.name.split('/').pop(),
        duration: Math.round(r.duration),
        size: (r as any).transferSize || 'N/A'
      })));
      console.groupEnd();
    }
  }
}