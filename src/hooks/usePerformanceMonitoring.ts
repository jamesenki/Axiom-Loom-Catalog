/**
 * Performance Monitoring Hook
 * 
 * React hook for real-time performance monitoring and Core Web Vitals tracking
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { performanceMonitoringService } from '../services/performanceMonitoring';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
}

interface CoreWebVitals {
  LCP?: PerformanceMetric;
  FID?: PerformanceMetric;
  CLS?: PerformanceMetric;
  FCP?: PerformanceMetric;
  TTFB?: PerformanceMetric;
}

interface PerformanceSummary {
  overallScore: number;
  coreWebVitals: {
    LCP: { value: number; rating: string } | null;
    FID: { value: number; rating: string } | null;
    CLS: { value: number; rating: string } | null;
    FCP: { value: number; rating: string } | null;
    TTFB: { value: number; rating: string } | null;
  };
  customMetrics: Record<string, { value: number; rating: string }>;
}

export const usePerformanceMonitoring = () => {
  const [performanceData, setPerformanceData] = useState(() => 
    performanceMonitoringService.getMetrics()
  );
  const [summary, setSummary] = useState<PerformanceSummary>(() => 
    performanceMonitoringService.getPerformanceSummary()
  );
  const measurementRefs = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const unsubscribe = performanceMonitoringService.subscribe((data) => {
      setPerformanceData(data);
      setSummary(performanceMonitoringService.getPerformanceSummary());
    });

    return unsubscribe;
  }, []);

  // Measure custom performance metrics
  const startMeasure = useCallback((name: string): (() => void) => {
    const startTime = performance.now();
    measurementRefs.current.set(name, startTime);
    
    return () => {
      const endTime = performance.now();
      const storedStartTime = measurementRefs.current.get(name);
      
      if (storedStartTime !== undefined) {
        const duration = endTime - storedStartTime;
        
        // Track custom metrics based on name
        if (['searchResponseTime', 'repositoryLoadTime', 'apiResponseTime', 'renderTime'].includes(name)) {
          performanceMonitoringService.trackCustomMetric(
            name as any, 
            storedStartTime, 
            endTime
          );
        }
        
        measurementRefs.current.delete(name);
        return duration;
      }
      
      return 0;
    };
  }, []);

  // Simplified measure function for one-off measurements
  const measure = useCallback((name: string, fn: () => Promise<any> | any) => {
    const endMeasure = startMeasure(name);
    
    if (typeof fn === 'function') {
      const result = fn();
      
      if (result && typeof result.then === 'function') {
        // Handle promises
        return result.finally(() => {
          endMeasure();
        });
      } else {
        // Handle synchronous functions
        endMeasure();
        return result;
      }
    }
    
    return endMeasure;
  }, [startMeasure]);

  // Track search performance
  const trackSearch = useCallback(() => {
    return startMeasure('searchResponseTime');
  }, [startMeasure]);

  // Track repository loading performance
  const trackRepositoryLoad = useCallback(() => {
    return startMeasure('repositoryLoadTime');
  }, [startMeasure]);

  // Track API response performance
  const trackApiResponse = useCallback(() => {
    return startMeasure('apiResponseTime');
  }, [startMeasure]);

  // Track component render performance
  const trackRender = useCallback(() => {
    return startMeasure('renderTime');
  }, [startMeasure]);

  // Get performance insights
  const getInsights = useCallback(() => {
    const insights: string[] = [];
    const { coreWebVitals, customMetrics } = summary;

    // Core Web Vitals insights
    if (coreWebVitals.LCP && coreWebVitals.LCP.rating === 'poor') {
      insights.push(`LCP is slow (${coreWebVitals.LCP.value}ms). Consider optimizing images and reducing render-blocking resources.`);
    }

    if (coreWebVitals.FID && coreWebVitals.FID.rating === 'poor') {
      insights.push(`FID is high (${coreWebVitals.FID.value}ms). Consider reducing JavaScript execution time.`);
    }

    if (coreWebVitals.CLS && coreWebVitals.CLS.rating === 'poor') {
      insights.push(`CLS is high (${coreWebVitals.CLS.value}). Ensure proper sizing for images and ads.`);
    }

    if (coreWebVitals.TTFB && coreWebVitals.TTFB.rating === 'poor') {
      insights.push(`TTFB is slow (${coreWebVitals.TTFB.value}ms). Consider server-side optimizations.`);
    }

    // Custom metrics insights
    if (customMetrics.searchResponseTime && customMetrics.searchResponseTime.rating === 'poor') {
      insights.push(`Search is slow (${customMetrics.searchResponseTime.value}ms). Consider indexing optimizations.`);
    }

    if (customMetrics.repositoryLoadTime && customMetrics.repositoryLoadTime.rating === 'poor') {
      insights.push(`Repository loading is slow (${customMetrics.repositoryLoadTime.value}ms). Consider caching strategies.`);
    }

    if (insights.length === 0) {
      insights.push('Performance looks good! All metrics are within acceptable ranges.');
    }

    return insights;
  }, [summary]);

  // Check if performance is good overall
  const isPerformanceGood = useCallback(() => {
    return summary.overallScore >= 80;
  }, [summary.overallScore]);

  return {
    // Raw performance data
    performanceData,
    
    // Summary with scores and ratings
    summary,
    
    // Measurement functions
    startMeasure,
    measure,
    
    // Specific tracking functions
    trackSearch,
    trackRepositoryLoad,
    trackApiResponse,
    trackRender,
    
    // Analysis functions
    getInsights,
    isPerformanceGood,
    
    // Individual metrics for easy access
    coreWebVitals: performanceData.coreWebVitals,
    customMetrics: performanceData.customMetrics,
    
    // Overall score
    overallScore: summary.overallScore
  };
};

export default usePerformanceMonitoring;