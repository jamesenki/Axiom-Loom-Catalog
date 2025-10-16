/**
 * Analytics Hook
 * 
 * Provides easy access to analytics tracking functionality
 */

import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getAnalytics } from '../services/analytics/analyticsService';
import { useAuth } from '../contexts/BypassAuthContext';

export interface TrackingOptions {
  immediate?: boolean;
  debounce?: number;
  sampleRate?: number;
}

export const useAnalytics = () => {
  const location = useLocation();
  const { user } = useAuth();
  const analytics = getAnalytics();
  const previousPath = useRef<string>();

  // Track page views on route change
  useEffect(() => {
    if (location.pathname !== previousPath.current) {
      analytics.trackPageView(location.pathname, document.title);
      previousPath.current = location.pathname;
    }
  }, [location, analytics]);

  // Update user properties when user changes
  useEffect(() => {
    if (user) {
      analytics.identify(user.id, {
        email: user.email,
        role: user.role,
        organizationId: user.organizationId
      });
    } else {
      analytics.reset();
    }
  }, [user, analytics]);

  // Track custom events
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    analytics.trackEvent(eventName, {
      eventCategory: properties?.category || 'general',
      eventAction: properties?.action,
      eventLabel: properties?.label,
      eventValue: properties?.value,
      customProperties: properties
    });
  }, [analytics]);

  // Track repository interactions
  const trackRepositoryView = useCallback((repositoryName: string, repositoryId: string) => {
    analytics.trackRepositoryView(repositoryName, repositoryId);
  }, [analytics]);

  // Track API usage
  const trackApiAccess = useCallback((apiType: string, repositoryName: string, endpoint?: string) => {
    analytics.trackApiAccess(apiType, repositoryName, endpoint);
  }, [analytics]);

  // Track search
  const trackSearch = useCallback((query: string, resultCount: number, searchType: string = 'global') => {
    analytics.trackSearch(query, resultCount, searchType);
  }, [analytics]);

  // Track downloads
  const trackDownload = useCallback((fileName: string, fileType: string, repositoryName?: string) => {
    analytics.trackDownload(fileName, fileType, repositoryName);
  }, [analytics]);

  // Track errors
  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    analytics.trackError(error, context);
  }, [analytics]);

  // Track UI interactions with debouncing
  const trackInteraction = useCallback((element: string, action: string, value?: string, options?: TrackingOptions) => {
    if (options?.sampleRate && Math.random() > options.sampleRate) {
      return; // Skip based on sample rate
    }

    const track = () => {
      analytics.trackInteraction(element, action, value);
    };

    if (options?.immediate || !options?.debounce) {
      track();
    } else {
      // Debounce the tracking
      setTimeout(track, options.debounce);
    }
  }, [analytics]);

  // Track timing events
  const trackTiming = useCallback((category: string, variable: string, duration: number, label?: string) => {
    analytics.trackEvent('timing', {
      eventCategory: category,
      eventAction: variable,
      eventLabel: label,
      eventValue: Math.round(duration),
      customProperties: {
        category,
        variable,
        duration,
        label
      }
    });
  }, [analytics]);

  // Create a timer for tracking durations
  const startTimer = useCallback((name: string) => {
    const startTime = performance.now();
    
    return {
      end: (properties?: Record<string, any>) => {
        const duration = performance.now() - startTime;
        trackTiming(properties?.category || 'performance', name, duration, properties?.label);
      }
    };
  }, [trackTiming]);

  return {
    trackEvent,
    trackRepositoryView,
    trackApiAccess,
    trackSearch,
    trackDownload,
    trackError,
    trackInteraction,
    trackTiming,
    startTimer
  };
};

// Hook for tracking component visibility
export const useTrackVisibility = (elementName: string, threshold = 0.5) => {
  const { trackEvent } = useAnalytics();
  const elementRef = useRef<HTMLElement>(null);
  const hasBeenVisible = useRef(false);

  useEffect(() => {
    if (!elementRef.current || hasBeenVisible.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasBeenVisible.current) {
            hasBeenVisible.current = true;
            trackEvent('element_visible', {
              category: 'visibility',
              label: elementName,
              customProperties: {
                element: elementName,
                threshold
              }
            });
          }
        });
      },
      { threshold }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [elementName, threshold, trackEvent]);

  return elementRef;
};

// Hook for tracking form analytics
export const useFormAnalytics = (formName: string) => {
  const { trackEvent, startTimer } = useAnalytics();
  const timerRef = useRef<ReturnType<typeof startTimer>>();
  const fieldInteractions = useRef<Set<string>>(new Set());

  const trackFormStart = useCallback(() => {
    timerRef.current = startTimer(`form_${formName}_completion`);
    trackEvent('form_started', {
      category: 'form',
      label: formName
    });
  }, [formName, startTimer, trackEvent]);

  const trackFieldInteraction = useCallback((fieldName: string) => {
    if (!fieldInteractions.current.has(fieldName)) {
      fieldInteractions.current.add(fieldName);
      trackEvent('form_field_interaction', {
        category: 'form',
        label: formName,
        customProperties: {
          field: fieldName,
          formName
        }
      });
    }
  }, [formName, trackEvent]);

  const trackFormSubmit = useCallback((success: boolean, errors?: string[]) => {
    if (timerRef.current) {
      timerRef.current.end({
        category: 'form',
        label: `${formName}_${success ? 'success' : 'error'}`
      });
    }

    trackEvent(success ? 'form_submitted' : 'form_error', {
      category: 'form',
      label: formName,
      customProperties: {
        formName,
        success,
        errors,
        fieldsInteracted: Array.from(fieldInteractions.current)
      }
    });
  }, [formName, trackEvent]);

  const trackFormAbandon = useCallback(() => {
    trackEvent('form_abandoned', {
      category: 'form',
      label: formName,
      customProperties: {
        formName,
        fieldsInteracted: Array.from(fieldInteractions.current)
      }
    });
  }, [formName, trackEvent]);

  return {
    trackFormStart,
    trackFieldInteraction,
    trackFormSubmit,
    trackFormAbandon
  };
};

export default useAnalytics;