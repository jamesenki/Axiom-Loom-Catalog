/**
 * Performance Monitoring Service
 * 
 * Tracks Core Web Vitals, custom metrics, and provides real-time performance insights
 * Integrates with Web Performance API and provides analytics for the Axiom Loom Catalog
 */

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
}

interface CoreWebVitals {
  LCP?: PerformanceMetric; // Largest Contentful Paint
  FID?: PerformanceMetric; // First Input Delay
  CLS?: PerformanceMetric; // Cumulative Layout Shift
  FCP?: PerformanceMetric; // First Contentful Paint
  TTFB?: PerformanceMetric; // Time to First Byte
}

interface CustomMetrics {
  searchResponseTime?: PerformanceMetric;
  repositoryLoadTime?: PerformanceMetric;
  apiResponseTime?: PerformanceMetric;
  renderTime?: PerformanceMetric;
}

interface PerformanceData {
  coreWebVitals: CoreWebVitals;
  customMetrics: CustomMetrics;
  resourceTiming: PerformanceResourceTiming[];
  navigationTiming: PerformanceNavigationTiming | null;
}

class PerformanceMonitoringService {
  private metrics: PerformanceData = {
    coreWebVitals: {},
    customMetrics: {},
    resourceTiming: [],
    navigationTiming: null
  };

  private observers: PerformanceObserver[] = [];
  private listeners: ((data: PerformanceData) => void)[] = [];

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined') return;

    // Core Web Vitals monitoring
    this.initializeCoreWebVitals();
    
    // Navigation timing
    this.initializeNavigationTiming();
    
    // Resource timing
    this.initializeResourceTiming();
  }

  private initializeCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          
          if (lastEntry) {
            this.metrics.coreWebVitals.LCP = {
              name: 'LCP',
              value: lastEntry.startTime,
              rating: this.getLCPRating(lastEntry.startTime),
              timestamp: Date.now(),
              url: window.location.href
            };
            this.notifyListeners();
          }
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observation not supported');
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.coreWebVitals.FID = {
              name: 'FID',
              value: entry.processingStart - entry.startTime,
              rating: this.getFIDRating(entry.processingStart - entry.startTime),
              timestamp: Date.now(),
              url: window.location.href
            };
            this.notifyListeners();
          });
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observation not supported');
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          this.metrics.coreWebVitals.CLS = {
            name: 'CLS',
            value: clsValue,
            rating: this.getCLSRating(clsValue),
            timestamp: Date.now(),
            url: window.location.href
          };
          this.notifyListeners();
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observation not supported');
      }

      // First Contentful Paint (FCP)
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.coreWebVitals.FCP = {
              name: 'FCP',
              value: entry.startTime,
              rating: this.getFCPRating(entry.startTime),
              timestamp: Date.now(),
              url: window.location.href
            };
            this.notifyListeners();
          });
        });
        
        fcpObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(fcpObserver);
      } catch (e) {
        console.warn('FCP observation not supported');
      }
    }
  }

  private initializeNavigationTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const [navigationEntry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntry) {
        this.metrics.navigationTiming = navigationEntry;
        
        // Calculate TTFB
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        this.metrics.coreWebVitals.TTFB = {
          name: 'TTFB',
          value: ttfb,
          rating: this.getTTFBRating(ttfb),
          timestamp: Date.now(),
          url: window.location.href
        };
        
        this.notifyListeners();
      }
    }
  }

  private initializeResourceTiming() {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries() as PerformanceResourceTiming[];
          this.metrics.resourceTiming.push(...entries);
          this.notifyListeners();
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (e) {
        console.warn('Resource timing observation not supported');
      }
    }
  }

  // Rating functions based on Core Web Vitals thresholds
  private getLCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  private getFIDRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  private getCLSRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  private getFCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 1800) return 'good';
    if (value <= 3000) return 'needs-improvement';
    return 'poor';
  }

  private getTTFBRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 800) return 'good';
    if (value <= 1800) return 'needs-improvement';
    return 'poor';
  }

  // Custom metric tracking
  public trackCustomMetric(name: keyof CustomMetrics, startTime: number, endTime: number = performance.now()) {
    const value = endTime - startTime;
    const metric: PerformanceMetric = {
      name,
      value,
      rating: this.getCustomMetricRating(name, value),
      timestamp: Date.now(),
      url: window.location.href
    };

    this.metrics.customMetrics[name] = metric;
    this.notifyListeners();
  }

  private getCustomMetricRating(name: keyof CustomMetrics, value: number): 'good' | 'needs-improvement' | 'poor' {
    // Define thresholds for custom metrics
    const thresholds = {
      searchResponseTime: { good: 200, needsImprovement: 500 },
      repositoryLoadTime: { good: 1000, needsImprovement: 3000 },
      apiResponseTime: { good: 300, needsImprovement: 1000 },
      renderTime: { good: 100, needsImprovement: 300 }
    };

    const threshold = thresholds[name];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  }

  // Performance measurement helpers
  public startMeasure(name: string): () => void {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      if (name in this.metrics.customMetrics || ['searchResponseTime', 'repositoryLoadTime', 'apiResponseTime', 'renderTime'].includes(name)) {
        this.trackCustomMetric(name as keyof CustomMetrics, startTime, endTime);
      }
    };
  }

  // Listeners management
  public subscribe(listener: (data: PerformanceData) => void): () => void {
    this.listeners.push(listener);
    
    // Immediately call with current data
    listener(this.metrics);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.metrics));
  }

  // Get current metrics
  public getMetrics(): PerformanceData {
    return { ...this.metrics };
  }

  // Get performance summary
  public getPerformanceSummary() {
    const cwv = this.metrics.coreWebVitals;
    const custom = this.metrics.customMetrics;
    
    return {
      overallScore: this.calculateOverallScore(),
      coreWebVitals: {
        LCP: cwv.LCP ? { value: Math.round(cwv.LCP.value), rating: cwv.LCP.rating } : null,
        FID: cwv.FID ? { value: Math.round(cwv.FID.value), rating: cwv.FID.rating } : null,
        CLS: cwv.CLS ? { value: Math.round(cwv.CLS.value * 1000) / 1000, rating: cwv.CLS.rating } : null,
        FCP: cwv.FCP ? { value: Math.round(cwv.FCP.value), rating: cwv.FCP.rating } : null,
        TTFB: cwv.TTFB ? { value: Math.round(cwv.TTFB.value), rating: cwv.TTFB.rating } : null
      },
      customMetrics: Object.entries(custom).reduce((acc, [key, metric]) => {
        if (metric) {
          acc[key] = { value: Math.round(metric.value), rating: metric.rating };
        }
        return acc;
      }, {} as Record<string, { value: number; rating: string }>)
    };
  }

  private calculateOverallScore(): number {
    const metrics = Object.values(this.metrics.coreWebVitals).filter(Boolean);
    if (metrics.length === 0) return 0;

    const scores = metrics.map(metric => {
      switch (metric!.rating) {
        case 'good': return 100;
        case 'needs-improvement': return 75;
        case 'poor': return 50;
        default: return 0;
      }
    });

    return Math.round(scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length);
  }

  // Add listener (alias for subscribe for backward compatibility)
  public addListener(listener: (data: PerformanceData) => void): void {
    this.listeners.push(listener);
    listener(this.metrics);
  }

  // Remove listener
  public removeListener(listener: (data: PerformanceData) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Cleanup
  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.listeners = [];
  }
}

// Singleton instance
export const performanceMonitoringService = new PerformanceMonitoringService();
export default PerformanceMonitoringService;