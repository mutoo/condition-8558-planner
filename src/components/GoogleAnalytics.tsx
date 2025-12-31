import { useEffect } from 'react'

declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

interface GoogleAnalyticsProps {
  measurementId?: string
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const gaId = measurementId || import.meta.env.VITE_GA_MEASUREMENT_ID

  useEffect(() => {
    // Only load in production and when GA ID is configured
    if (!gaId || import.meta.env.DEV) {
      if (import.meta.env.DEV) {
        console.log('[GA] Development mode - Analytics disabled')
      }
      return
    }

    // Check if already loaded
    if (typeof window.gtag === 'function') {
      console.log('[GA] Already loaded')
      return
    }

    // Dynamically load GA script
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script1)

    // Initialize GA
    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}', {
        page_path: window.location.pathname,
        send_page_view: true
      });
    `
    document.head.appendChild(script2)

    console.log('[GA] Initialized:', gaId)

    // Cleanup function
    return () => {
      // Note: GA scripts don't need to be removed on component unmount
      // because they are global and should persist throughout the application lifecycle
    }
  }, [gaId])

  return null // This is a UI-less component
}

// Utility function: Send custom event
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
) {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams)
    console.log('[GA] Event tracked:', eventName, eventParams)
  }
}

// Utility function: Send page view
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    })
    console.log('[GA] Page view tracked:', pagePath)
  }
}

// Utility function: Set user properties
export function setUserProperties(properties: Record<string, unknown>) {
  if (window.gtag) {
    window.gtag('set', 'user_properties', properties)
    console.log('[GA] User properties set:', properties)
  }
}

