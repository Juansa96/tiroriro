declare global {
  interface Window {
    fbq?: (
      method: 'track' | 'trackCustom',
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export function trackFbEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', eventName, params ?? {});
}
