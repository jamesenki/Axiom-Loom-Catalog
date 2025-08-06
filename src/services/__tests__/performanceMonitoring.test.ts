import PerformanceMonitoringService from '../performanceMonitoring';

describe('PerformanceMonitoringService', () => {
  let service: PerformanceMonitoringService;
  let mockObserve: jest.Mock;
  let mockDisconnect: jest.Mock;
  let observerCallbacks: Map<string, Function>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    observerCallbacks = new Map();
    
    // Mock PerformanceObserver
    mockObserve = jest.fn((options) => {
      const entryTypes = options.entryTypes;
      if (entryTypes) {
        entryTypes.forEach((type: string) => {
          // Store the callback for later use
        });
      }
    });
    
    mockDisconnect = jest.fn();
    
    class MockPerformanceObserver {
      callback: Function;
      
      constructor(callback: Function) {
        this.callback = callback;
      }
      
      observe(options: any) {
        mockObserve(options);
        if (options.entryTypes) {
          options.entryTypes.forEach((type: string) => {
            observerCallbacks.set(type, this.callback);
          });
        }
      }
      
      disconnect() {
        mockDisconnect();
      }
    }
    
    // Setup global mocks
    global.Date.now = jest.fn(() => 1609459200000);
    
    const mockGetEntriesByType = jest.fn(() => []);
    
    global.window = {
      location: { href: 'http://localhost:3000' },
      PerformanceObserver: MockPerformanceObserver as any,
      performance: {
        now: jest.fn(() => 1000),
        getEntriesByType: mockGetEntriesByType
      }
    } as any;
    
    global.PerformanceObserver = MockPerformanceObserver as any;
    global.performance = {
      now: jest.fn(() => 1000),
      getEntriesByType: mockGetEntriesByType
    } as any;
  });
  
  afterEach(() => {
    if (service) {
      service.destroy();
    }
  });
  
  describe('initialization', () => {
    it('should initialize performance monitoring', () => {
      service = new PerformanceMonitoringService();
      
      expect(mockObserve).toHaveBeenCalled();
    });
    
    it('should handle missing window object gracefully', () => {
      delete (global as any).window;
      
      expect(() => {
        service = new PerformanceMonitoringService();
      }).not.toThrow();
      
      // Restore window
      global.window = { location: { href: 'http://localhost:3000' } } as any;
    });
  });
  
  describe('Core Web Vitals', () => {
    beforeEach(() => {
      service = new PerformanceMonitoringService();
    });
    
    it('should track LCP metric', () => {
      const lcpCallback = observerCallbacks.get('largest-contentful-paint');
      
      if (lcpCallback) {
        lcpCallback({
          getEntries: () => [{ startTime: 2500 }]
        });
      }
      
      const metrics = service.getMetrics();
      expect(metrics.coreWebVitals.LCP).toMatchObject({
        name: 'LCP',
        value: 2500,
        rating: 'good',
        url: 'http://localhost:3000'
      });
      expect(metrics.coreWebVitals.LCP?.timestamp).toBe(1609459200000);
    });
    
    it('should track FID metric', () => {
      const fidCallback = observerCallbacks.get('first-input');
      
      if (fidCallback) {
        fidCallback({
          getEntries: () => [{
            processingStart: 150,
            startTime: 50
          }]
        });
      }
      
      const metrics = service.getMetrics();
      expect(metrics.coreWebVitals.FID).toMatchObject({
        name: 'FID',
        value: 100,
        rating: 'good',
        url: 'http://localhost:3000'
      });
    });
    
    it('should track CLS metric', () => {
      const clsCallback = observerCallbacks.get('layout-shift');
      
      if (clsCallback) {
        clsCallback({
          getEntries: () => [
            { value: 0.05, hadRecentInput: false },
            { value: 0.02, hadRecentInput: false },
            { value: 0.10, hadRecentInput: true } // Should be ignored
          ]
        });
      }
      
      const metrics = service.getMetrics();
      expect(metrics.coreWebVitals.CLS?.value).toBeCloseTo(0.07, 2);
      expect(metrics.coreWebVitals.CLS?.rating).toBe('good');
    });
    
    it('should track FCP metric', () => {
      const fcpCallback = observerCallbacks.get('paint');
      
      if (fcpCallback) {
        fcpCallback({
          getEntries: () => [{
            name: 'first-contentful-paint',
            startTime: 1500
          }]
        });
      }
      
      const metrics = service.getMetrics();
      expect(metrics.coreWebVitals.FCP).toMatchObject({
        name: 'FCP',
        value: 1500,
        rating: 'good',
        url: 'http://localhost:3000'
      });
    });
    
    it('should calculate TTFB from navigation timing', () => {
      // Need to set up navigation timing before creating service
      const originalGetEntriesByType = global.window.performance.getEntriesByType;
      global.window.performance.getEntriesByType = jest.fn(() => [{
        responseStart: 200,
        requestStart: 50
      }]);
      global.performance.getEntriesByType = global.window.performance.getEntriesByType;
      
      service = new PerformanceMonitoringService();
      
      const metrics = service.getMetrics();
      expect(metrics.coreWebVitals.TTFB).toMatchObject({
        name: 'TTFB',
        value: 150,
        rating: 'good',
        url: 'http://localhost:3000'
      });
      
      // Restore
      global.window.performance.getEntriesByType = originalGetEntriesByType;
    });
  });
  
  describe('Rating functions', () => {
    beforeEach(() => {
      service = new PerformanceMonitoringService();
    });
    
    it('should rate LCP correctly', () => {
      const testCases = [
        { value: 2000, expected: 'good' },
        { value: 2500, expected: 'good' },
        { value: 3000, expected: 'needs-improvement' },
        { value: 4000, expected: 'needs-improvement' },
        { value: 5000, expected: 'poor' }
      ];
      
      testCases.forEach(({ value, expected }) => {
        const lcpCallback = observerCallbacks.get('largest-contentful-paint');
        if (lcpCallback) {
          lcpCallback({
            getEntries: () => [{ startTime: value }]
          });
        }
        
        const metrics = service.getMetrics();
        expect(metrics.coreWebVitals.LCP?.rating).toBe(expected);
      });
    });
    
    it('should rate FID correctly', () => {
      const testCases = [
        { value: 50, expected: 'good' },
        { value: 100, expected: 'good' },
        { value: 200, expected: 'needs-improvement' },
        { value: 300, expected: 'needs-improvement' },
        { value: 400, expected: 'poor' }
      ];
      
      testCases.forEach(({ value, expected }) => {
        const fidCallback = observerCallbacks.get('first-input');
        if (fidCallback) {
          fidCallback({
            getEntries: () => [{
              processingStart: value + 50,
              startTime: 50
            }]
          });
        }
        
        const metrics = service.getMetrics();
        expect(metrics.coreWebVitals.FID?.rating).toBe(expected);
      });
    });
    
    it('should rate CLS correctly', () => {
      const testCases = [
        { value: 0.05, expected: 'good' },
        { value: 0.1, expected: 'good' },
        { value: 0.15, expected: 'needs-improvement' },
        { value: 0.25, expected: 'needs-improvement' },
        { value: 0.3, expected: 'poor' }
      ];
      
      testCases.forEach(({ value, expected }) => {
        // Reset CLS value by creating new service
        service.destroy();
        service = new PerformanceMonitoringService();
        
        const clsCallback = observerCallbacks.get('layout-shift');
        if (clsCallback) {
          clsCallback({
            getEntries: () => [{ value, hadRecentInput: false }]
          });
        }
        
        const metrics = service.getMetrics();
        expect(metrics.coreWebVitals.CLS?.rating).toBe(expected);
      });
    });
  });
  
  describe('Custom metrics', () => {
    beforeEach(() => {
      service = new PerformanceMonitoringService();
    });
    
    it('should track custom metrics', () => {
      service.trackCustomMetric('searchResponseTime', 100, 300);
      
      const metrics = service.getMetrics();
      expect(metrics.customMetrics.searchResponseTime).toMatchObject({
        name: 'searchResponseTime',
        value: 200,
        rating: 'good',
        url: 'http://localhost:3000'
      });
    });
    
    it('should rate custom metrics correctly', () => {
      const testCases = [
        { metric: 'searchResponseTime', value: 150, expected: 'good' },
        { metric: 'searchResponseTime', value: 300, expected: 'needs-improvement' },
        { metric: 'searchResponseTime', value: 600, expected: 'poor' },
        { metric: 'repositoryLoadTime', value: 800, expected: 'good' },
        { metric: 'repositoryLoadTime', value: 2000, expected: 'needs-improvement' },
        { metric: 'repositoryLoadTime', value: 4000, expected: 'poor' }
      ];
      
      testCases.forEach(({ metric, value, expected }) => {
        service.trackCustomMetric(metric as any, 0, value);
        const metrics = service.getMetrics();
        expect(metrics.customMetrics[metric as keyof typeof metrics.customMetrics]?.rating).toBe(expected);
      });
    });
    
    it('should use startMeasure helper', () => {
      jest.spyOn(performance, 'now')
        .mockReturnValueOnce(100) // Start time
        .mockReturnValueOnce(350); // End time
      
      const endMeasure = service.startMeasure('apiResponseTime');
      endMeasure();
      
      const metrics = service.getMetrics();
      expect(metrics.customMetrics.apiResponseTime?.value).toBe(250);
      expect(metrics.customMetrics.apiResponseTime?.rating).toBe('good');
    });
  });
  
  describe('Listeners and subscriptions', () => {
    beforeEach(() => {
      service = new PerformanceMonitoringService();
    });
    
    it('should notify listeners when metrics change', () => {
      const listener = jest.fn();
      service.subscribe(listener);
      
      // Should be called immediately with current metrics
      expect(listener).toHaveBeenCalledTimes(1);
      
      // Track a custom metric
      service.trackCustomMetric('searchResponseTime', 0, 100);
      
      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener).toHaveBeenLastCalledWith(expect.objectContaining({
        customMetrics: expect.objectContaining({
          searchResponseTime: expect.any(Object)
        })
      }));
    });
    
    it('should handle unsubscribe correctly', () => {
      const listener = jest.fn();
      const unsubscribe = service.subscribe(listener);
      
      listener.mockClear();
      
      // Unsubscribe
      unsubscribe();
      
      // Track a metric - listener should not be called
      service.trackCustomMetric('searchResponseTime', 0, 100);
      
      expect(listener).not.toHaveBeenCalled();
    });
    
    it('should handle multiple listeners', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      service.subscribe(listener1);
      service.subscribe(listener2);
      
      listener1.mockClear();
      listener2.mockClear();
      
      service.trackCustomMetric('searchResponseTime', 0, 100);
      
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('Performance summary', () => {
    beforeEach(() => {
      service = new PerformanceMonitoringService();
    });
    
    it('should calculate performance summary', () => {
      // Set up some metrics
      const lcpCallback = observerCallbacks.get('largest-contentful-paint');
      if (lcpCallback) {
        lcpCallback({
          getEntries: () => [{ startTime: 2000 }]
        });
      }
      
      service.trackCustomMetric('searchResponseTime', 0, 150);
      
      const summary = service.getPerformanceSummary();
      
      expect(summary).toHaveProperty('overallScore');
      expect(summary.coreWebVitals.LCP).toEqual({
        value: 2000,
        rating: 'good'
      });
      expect(summary.customMetrics.searchResponseTime).toEqual({
        value: 150,
        rating: 'good'
      });
    });
    
    it('should calculate overall score correctly', () => {
      // Set up some good metrics
      const lcpCallback = observerCallbacks.get('largest-contentful-paint');
      if (lcpCallback) {
        lcpCallback({
          getEntries: () => [{ startTime: 2000 }] // Good LCP
        });
      }
      
      const fidCallback = observerCallbacks.get('first-input');
      if (fidCallback) {
        fidCallback({
          getEntries: () => [{ processingStart: 100, startTime: 50 }] // Good FID
        });
      }
      
      const summary = service.getPerformanceSummary();
      expect(summary.overallScore).toBe(100); // All good ratings
    });
    
    it('should handle empty metrics in summary', () => {
      const summary = service.getPerformanceSummary();
      
      expect(summary.overallScore).toBe(0);
      expect(summary.coreWebVitals.LCP).toBeNull();
      expect(summary.coreWebVitals.FID).toBeNull();
      expect(summary.customMetrics).toEqual({});
    });
  });
  
  describe('Resource timing', () => {
    beforeEach(() => {
      service = new PerformanceMonitoringService();
    });
    
    it('should track resource timing', () => {
      const resourceCallback = observerCallbacks.get('resource');
      
      if (resourceCallback) {
        resourceCallback({
          getEntries: () => [
            { name: 'script.js', startTime: 100, duration: 50 },
            { name: 'style.css', startTime: 150, duration: 30 }
          ]
        });
      }
      
      const metrics = service.getMetrics();
      expect(metrics.resourceTiming).toHaveLength(2);
      expect(metrics.resourceTiming[0]).toMatchObject({ name: 'script.js' });
    });
  });
  
  describe('Error handling', () => {
    it('should handle PerformanceObserver not supported', () => {
      delete (global.window as any).PerformanceObserver;
      
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      expect(() => {
        service = new PerformanceMonitoringService();
      }).not.toThrow();
      
      consoleWarnSpy.mockRestore();
    });
    
    it('should handle observation errors gracefully', () => {
      const errorObserve = jest.fn(() => {
        throw new Error('Observation not supported');
      });
      
      class ErrorPerformanceObserver {
        observe() {
          errorObserve();
        }
        disconnect() {}
      }
      
      global.window.PerformanceObserver = ErrorPerformanceObserver as any;
      global.PerformanceObserver = ErrorPerformanceObserver as any;
      
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      service = new PerformanceMonitoringService();
      
      // The error should be caught and warned
      expect(errorObserve).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });
  
  describe('Cleanup', () => {
    it('should disconnect all observers on destroy', () => {
      service = new PerformanceMonitoringService();
      
      const observerCount = mockObserve.mock.calls.length;
      
      service.destroy();
      
      expect(mockDisconnect).toHaveBeenCalledTimes(observerCount);
    });
    
    it('should clear all listeners on destroy', () => {
      service = new PerformanceMonitoringService();
      
      const listener = jest.fn();
      service.subscribe(listener);
      
      service.destroy();
      
      listener.mockClear();
      
      // Try to track metric after destroy - listener should not be called
      service.trackCustomMetric('searchResponseTime', 0, 100);
      
      expect(listener).not.toHaveBeenCalled();
    });
  });
});