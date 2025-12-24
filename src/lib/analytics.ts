/**
 * Analytics hooks for tracking user interactions
 * Placeholder implementation - integrate with your analytics service
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

export function trackEvent(event: AnalyticsEvent) {
  // Placeholder: Integrate with your analytics service
  // Examples: Google Analytics, Mixpanel, Amplitude, etc.
  
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event.name, event.properties);
  }
  
  // Example integration:
  // if (window.gtag) {
  //   window.gtag('event', event.name, event.properties);
  // }
}

export function trackPageView(path: string) {
  trackEvent({
    name: 'page_view',
    properties: { path },
  });
}

export function trackItineraryGenerated(days: number, places: number) {
  trackEvent({
    name: 'itinerary_generated',
    properties: { days, places },
  });
}

export function trackAnchorAdded(placeId: string) {
  trackEvent({
    name: 'anchor_added',
    properties: { place_id: placeId },
  });
}

export function trackPlaceRemoved(placeId: string) {
  trackEvent({
    name: 'place_removed',
    properties: { place_id: placeId },
  });
}

export function trackItineraryExported(format: 'text' | 'json') {
  trackEvent({
    name: 'itinerary_exported',
    properties: { format },
  });
}

