import { useEffect, useRef } from 'react'
import './AdSlot.css'

interface AdSlotProps {
  slotId: string
  format?: 'horizontal' | 'rectangle' | 'auto'
  className?: string
}

export function AdSlot({ slotId, format = 'auto', className = '' }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID

  useEffect(() => {
    if (adRef.current && window.adsbygoogle && clientId) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch (err) {
        console.error('AdSense error:', err)
      }
    }
  }, [clientId])

  // Show placeholder in development or when AdSense is not configured
  if (import.meta.env.DEV || !clientId) {
    return (
      <div className={`ad-slot ad-slot-${format} ${className}`}>
        <div className="ad-placeholder">
          <span>📢 Ad Slot: {slotId}</span>
          <span className="ad-format">Format: {format}</span>
          {!clientId && <span className="ad-warning">⚠️ AdSense not configured</span>}
        </div>
      </div>
    )
  }

  return (
    <div className={`ad-slot ad-slot-${format} ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// Extend Window interface to support adsbygoogle
declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>
  }
}

