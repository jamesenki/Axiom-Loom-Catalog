/**
 * Enhanced Performance Monitoring Service
 * 
 * Extends the base performance monitoring with Real User Monitoring (RUM) capabilities
 * Tracks detailed performance metrics, JavaScript errors, and resource loading
 */

import { performanceMonitoringService } from '../performanceMonitoring';

export interface RUMMetrics {
  // Page Load Metrics
  domContentLoaded: number;
  domComplete: number;
  loadComplete: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  
  // Network Metrics
  dnsLookup: number;
  tcpConnect: number;
  tlsNegotiation: number;
  requestDuration: number;
  responseDuration: number;
  
  // Resource Metrics
  totalResources: number;
  cachedResources: number;
  totalResourceSize: number;
  totalTransferSize: number;
  
  // JavaScript Metrics
  jsHeapSize?: number;
  jsHeapUsed?: number;
  jsErrors: ErrorInfo[];
  
  // User Experience Metrics
  longTasks: LongTaskInfo[];
  interactions: InteractionInfo[];
  scrollDepth: number;
  timeOnPage: number;
}

export interface ErrorInfo {
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
  timestamp: number;
  userAgent: string;
  url: string;
}

export interface LongTaskInfo {
  duration: number;
  startTime: number;
  name: string;
  attribution?: string;
}

export interface InteractionInfo {
  type: string;
  target: string;
  duration: number;
  timestamp: number;
}

export interface PerformanceMark {
  name: string;
  startTime: number;
  duration?: number;
  metadata?: Record<string, any>;
}

class EnhancedPerformanceMonitoring {
  private metrics: RUMMetrics;
  private marks: Map<string, PerformanceMark> = new Map();
  private observers: PerformanceObserver[] = [];
  private errorHandler?: (event: ErrorEvent) => void;
  private pageLoadTime: number;
  private interactionObserver?: PerformanceObserver;

  constructor() {
    this.pageLoadTime = Date.now();
    this.metrics = this.initializeMetrics();
    this.setupMonitoring();
  }

  private initializeMetrics(): RUMMetrics {
    return {
      domContentLoaded: 0,
      domComplete: 0,
      loadComplete: 0,
      dnsLookup: 0,
      tcpConnect: 0,
      tlsNegotiation: 0,
      requestDuration: 0,
      responseDuration: 0,
      totalResources: 0,
      cachedResources: 0,
      totalResourceSize: 0,
      totalTransferSize: 0,
      jsErrors: [],
      longTasks: [],
      interactions: [],
      scrollDepth: 0,
      timeOnPage: 0
    };
  }

  private setupMonitoring() {
    if (typeof window === 'undefined') return;

    // Navigation timing
    this.captureNavigationTiming();

    // Resource timing
    this.captureResourceTiming();

    // Error tracking
    this.setupErrorTracking();

    // Long task monitoring
    this.setupLongTaskMonitoring();

    // Interaction tracking
    this.setupInteractionTracking();

    // Memory monitoring (if available)
    this.setupMemoryMonitoring();

    // Scroll depth tracking
    this.setupScrollTracking();

    // Page visibility tracking
    this.setupVisibilityTracking();
  }

  private captureNavigationTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const [navTiming] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      
      if (navTiming) {
        // Page load metrics
        this.metrics.domContentLoaded = navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart;
        this.metrics.domComplete = navTiming.domComplete - navTiming.domInteractive;
        this.metrics.loadComplete = navTiming.loadEventEnd - navTiming.loadEventStart;

        // Network metrics
        this.metrics.dnsLookup = navTiming.domainLookupEnd - navTiming.domainLookupStart;
        this.metrics.tcpConnect = navTiming.connectEnd - navTiming.connectStart;
        this.metrics.tlsNegotiation = navTiming.secureConnectionStart > 0 
          ? navTiming.connectEnd - navTiming.secureConnectionStart 
          : 0;
        this.metrics.requestDuration = navTiming.responseStart - navTiming.requestStart;
        this.metrics.responseDuration = navTiming.responseEnd - navTiming.responseStart;

        // Paint metrics
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach((entry) => {
          if (entry.name === 'first-paint') {
            this.metrics.firstPaint = entry.startTime;
          } else if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        });
      }
    }
  }

  private captureResourceTiming() {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries() as PerformanceResourceTiming[];
          
          entries.forEach(entry => {
            this.metrics.totalResources++;
            
            // Check if resource was cached
            if (entry.transferSize === 0 && entry.decodedBodySize > 0) {
              this.metrics.cachedResources++;
            }
            
            this.metrics.totalResourceSize += entry.decodedBodySize || 0;
            this.metrics.totalTransferSize += entry.transferSize || 0;
          });
        });

        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (error) {
        console.warn('Resource timing observation not supported');
      }
    }
  }

  private setupErrorTracking() {
    this.errorHandler = (event: ErrorEvent) => {
      const errorInfo: ErrorInfo = {
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      this.metrics.jsErrors.push(errorInfo);

      // Limit stored errors to prevent memory issues
      if (this.metrics.jsErrors.length > 100) {
        this.metrics.jsErrors = this.metrics.jsErrors.slice(-50);
      }
    };

    window.addEventListener('error', this.errorHandler);

    // Also track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const errorInfo: ErrorInfo = {
        message: `Unhandled Promise Rejection: ${event.reason}`,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      this.metrics.jsErrors.push(errorInfo);
    });
  }

  private setupLongTaskMonitoring() {
    if ('PerformanceObserver' in window && 'PerformanceLongTaskTiming' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach((entry: any) => {
            const taskInfo: LongTaskInfo = {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name,
              attribution: entry.attribution?.[0]?.containerType
            };

            this.metrics.longTasks.push(taskInfo);

            // Limit stored long tasks
            if (this.metrics.longTasks.length > 50) {
              this.metrics.longTasks = this.metrics.longTasks.slice(-25);
            }
          });
        });

        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (error) {
        console.warn('Long task monitoring not supported');
      }
    }
  }

  private setupInteractionTracking() {
    // Track key interactions
    const interactionEvents = ['click', 'keydown', 'scroll', 'touchstart'];
    
    interactionEvents.forEach(eventType => {
      window.addEventListener(eventType, (event) => {
        const target = event.target as HTMLElement;
        const interactionInfo: InteractionInfo = {
          type: eventType,
          target: this.getElementSelector(target),
          duration: 0, // Will be calculated if we implement interaction timing
          timestamp: Date.now()
        };

        this.metrics.interactions.push(interactionInfo);

        // Limit stored interactions
        if (this.metrics.interactions.length > 100) {
          this.metrics.interactions = this.metrics.interactions.slice(-50);
        }
      }, { passive: true, capture: true });
    });
  }

  private setupMemoryMonitoring() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        if (memory) {
          this.metrics.jsHeapSize = memory.totalJSHeapSize;
          this.metrics.jsHeapUsed = memory.usedJSHeapSize;
        }
      }, 10000); // Check every 10 seconds
    }
  }

  private setupScrollTracking() {
    let maxScrollDepth = 0;

    const calculateScrollDepth = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const scrollDepth = ((scrollTop + windowHeight) / documentHeight) * 100;
      maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
      this.metrics.scrollDepth = Math.round(maxScrollDepth);
    };

    window.addEventListener('scroll', calculateScrollDepth, { passive: true });
    // Calculate initial scroll depth
    calculateScrollDepth();
  }

  private setupVisibilityTracking() {
    let hiddenTime = 0;
    let lastHiddenTimestamp = 0;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        lastHiddenTimestamp = Date.now();
      } else if (lastHiddenTimestamp > 0) {
        hiddenTime += Date.now() - lastHiddenTimestamp;
      }
    });

    // Update time on page periodically
    setInterval(() => {
      const totalTime = Date.now() - this.pageLoadTime;
      this.metrics.timeOnPage = totalTime - hiddenTime;
    }, 1000);
  }

  private getElementSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }

  // Custom performance marks
  public mark(name: string, metadata?: Record<string, any>) {
    const mark: PerformanceMark = {
      name,
      startTime: performance.now(),
      metadata
    };

    this.marks.set(name, mark);
    performance.mark(name);
  }

  public measure(name: string, startMark: string, endMark?: string) {
    const start = this.marks.get(startMark);
    if (!start) {
      console.warn(`Start mark '${startMark}' not found`);
      return;
    }

    const endTime = endMark ? this.marks.get(endMark)?.startTime : performance.now();
    if (!endTime) {
      console.warn(`End mark '${endMark}' not found`);
      return;
    }

    const duration = endTime - start.startTime;
    performance.measure(name, startMark, endMark);

    // Update the mark with duration
    start.duration = duration;

    // Track as custom metric in base performance monitoring
    performanceMonitoringService.trackCustomMetric(
      name as any,
      start.startTime,
      endTime
    );

    return duration;
  }

  // Get all metrics
  public getMetrics(): RUMMetrics {
    return { ...this.metrics };
  }

  // Get performance summary
  public getPerformanceSummary() {
    const baseMetrics = performanceMonitoringService.getPerformanceSummary();
    
    return {
      ...baseMetrics,
      rum: {
        pageLoadTime: this.metrics.loadComplete,
        resourceCount: this.metrics.totalResources,
        cacheHitRate: this.metrics.totalResources > 0 
          ? (this.metrics.cachedResources / this.metrics.totalResources) * 100 
          : 0,
        errorCount: this.metrics.jsErrors.length,
        longTaskCount: this.metrics.longTasks.length,
        averageLongTaskDuration: this.metrics.longTasks.length > 0
          ? this.metrics.longTasks.reduce((sum, task) => sum + task.duration, 0) / this.metrics.longTasks.length
          : 0,
        scrollDepth: this.metrics.scrollDepth,
        timeOnPage: Math.round(this.metrics.timeOnPage / 1000) // in seconds
      }
    };
  }

  // Export metrics for analytics
  public exportMetrics() {
    return {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      screen: {
        width: window.screen.width,
        height: window.screen.height
      },
      connection: (navigator as any).connection ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt
      } : null,
      metrics: this.getMetrics(),
      marks: Array.from(this.marks.values())
    };
  }

  // Cleanup
  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];

    if (this.errorHandler) {
      window.removeEventListener('error', this.errorHandler);
    }

    performanceMonitoringService.destroy();
  }
}

// Singleton instance
export const enhancedPerformanceMonitoring = new EnhancedPerformanceMonitoring();
export default EnhancedPerformanceMonitoring;