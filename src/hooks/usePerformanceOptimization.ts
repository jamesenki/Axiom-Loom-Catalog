/**
 * Performance Optimization Hook
 * 
 * Provides performance optimization utilities for React components
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { setupImageLazyLoading, requestIdleCallback, PerformanceMonitor } from '../utils/performance';

interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * Hook for intersection observer
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<HTMLDivElement>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      {
        root: options.root || null,
        rootMargin: options.rootMargin || '0px',
        threshold: options.threshold || 0
      }
    );

    observer.observe(target);
    return () => observer.unobserve(target);
  }, [options.root, options.rootMargin, options.threshold]);

  return [targetRef, isIntersecting];
}

/**
 * Hook for lazy loading images
 */
export function useLazyImages(dependencies: any[] = []): void {
  useEffect(() => {
    setupImageLazyLoading();
  }, dependencies);
}

/**
 * Hook for measuring component performance
 */
export function useComponentPerformance(componentName: string): PerformanceMonitor {
  const monitorRef = useRef(new PerformanceMonitor());

  useEffect(() => {
    const monitor = monitorRef.current;
    monitor.mark(`${componentName}-mount-start`);

    return () => {
      monitor.mark(`${componentName}-mount-end`);
      const mountTime = monitor.measure(
        `${componentName}-mount`,
        `${componentName}-mount-start`,
        `${componentName}-mount-end`
      );
      
      if (process.env.NODE_ENV === 'development' && mountTime > 16) {
        console.warn(`${componentName} mount time: ${mountTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);

  return monitorRef.current;
}

/**
 * Hook for defer non-critical operations
 */
export function useIdleCallback(
  callback: () => void,
  dependencies: any[] = []
): void {
  useEffect(() => {
    const id = requestIdleCallback(callback);
    return () => cancelIdleCallback(id);
  }, dependencies);
}

/**
 * Hook for progressive enhancement
 */
export function useProgressiveEnhancement(): {
  isLowEnd: boolean;
  hasReducedMotion: boolean;
  connectionType: string;
} {
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    isLowEnd: false,
    hasReducedMotion: false,
    connectionType: 'unknown'
  });

  useEffect(() => {
    // Check for low-end device
    const memory = (navigator as any).deviceMemory;
    const hardwareConcurrency = navigator.hardwareConcurrency;
    const isLowEnd = (memory && memory < 4) || (hardwareConcurrency && hardwareConcurrency < 4);

    // Check for reduced motion preference
    const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check connection type
    const connection = (navigator as any).connection;
    const connectionType = connection?.effectiveType || 'unknown';

    setDeviceCapabilities({
      isLowEnd,
      hasReducedMotion,
      connectionType
    });
  }, []);

  return deviceCapabilities;
}

/**
 * Hook for prefetching resources
 */
export function usePrefetch(urls: string[]): void {
  useEffect(() => {
    if ('IntersectionObserver' in window) {
      requestIdleCallback(() => {
        urls.forEach(url => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = url;
          document.head.appendChild(link);
        });
      });
    }
  }, [urls]);
}

/**
 * Hook for web vitals monitoring
 */
export function useWebVitals(onReport?: (metric: any) => void): void {
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      try {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          onReport?.({ name: 'LCP', value: lastEntry.startTime });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            onReport?.({ name: 'FID', value: entry.processingStart - entry.startTime });
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              onReport?.({ name: 'CLS', value: clsValue });
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        return () => {
          lcpObserver.disconnect();
          fidObserver.disconnect();
          clsObserver.disconnect();
        };
      } catch (error) {
        console.error('Web Vitals observation error:', error);
      }
    }
  }, [onReport]);
}

/**
 * Hook for memory management
 */
export function useMemoryManagement(threshold: number = 100): {
  isHighMemoryUsage: boolean;
  memoryInfo: any;
} {
  const [memoryState, setMemoryState] = useState<{
    isHighMemoryUsage: boolean;
    memoryInfo: any;
  }>({
    isHighMemoryUsage: false,
    memoryInfo: null
  });

  useEffect(() => {
    const checkMemory = () => {
      const memory = (performance as any).memory;
      if (memory) {
        const usedMemoryMB = memory.usedJSHeapSize / 1048576;
        const totalMemoryMB = memory.totalJSHeapSize / 1048576;
        const limitMemoryMB = memory.jsHeapSizeLimit / 1048576;

        setMemoryState({
          isHighMemoryUsage: usedMemoryMB > threshold,
          memoryInfo: {
            used: usedMemoryMB.toFixed(2),
            total: totalMemoryMB.toFixed(2),
            limit: limitMemoryMB.toFixed(2),
            percentage: ((usedMemoryMB / limitMemoryMB) * 100).toFixed(2)
          }
        });
      }
    };

    const interval = setInterval(checkMemory, 5000);
    checkMemory();

    return () => clearInterval(interval);
  }, [threshold]);

  return memoryState;
}