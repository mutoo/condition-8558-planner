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
    // 只在生产环境且配置了 GA ID 时加载
    if (!gaId || import.meta.env.DEV) {
      if (import.meta.env.DEV) {
        console.log('[GA] Development mode - Analytics disabled')
      }
      return
    }

    // 检查是否已经加载
    if (typeof window.gtag === 'function') {
      console.log('[GA] Already loaded')
      return
    }

    // 动态加载 GA 脚本
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script1)

    // 初始化 GA
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

    // 清理函数
    return () => {
      // 注意：GA 脚本不需要在组件卸载时移除
      // 因为它是全局的，应该在整个应用生命周期中保持
    }
  }, [gaId])

  return null // 这是一个无 UI 组件
}

// 工具函数：发送自定义事件
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
) {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams)
    console.log('[GA] Event tracked:', eventName, eventParams)
  }
}

// 工具函数：发送页面浏览
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    })
    console.log('[GA] Page view tracked:', pagePath)
  }
}

// 工具函数：设置用户属性
export function setUserProperties(properties: Record<string, unknown>) {
  if (window.gtag) {
    window.gtag('set', 'user_properties', properties)
    console.log('[GA] User properties set:', properties)
  }
}

