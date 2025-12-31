import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatDate, getToday } from '../utils/dateUtils'
import './VisaSetup.css'

interface VisaSetupProps {
  onStart: (
    start: Date,
    duration: '18' | '36' | '60' | '120' | 'custom',
    end?: Date
  ) => void
  onClearData: () => void
  hasData: boolean
}

export function VisaSetup({ onStart, onClearData, hasData }: VisaSetupProps) {
  const { t } = useTranslation()
  const [visaStart, setVisaStart] = useState('')
  const [duration, setDuration] = useState<
    '18' | '36' | '60' | '120' | 'custom'
  >('18')
  const [customEnd, setCustomEnd] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!visaStart) {
      alert(t('visa.alerts.enterStartDate'))
      return
    }

    const start = new Date(visaStart + 'T00:00:00')

    if (duration === 'custom') {
      if (!customEnd) {
        alert(t('visa.alerts.enterEndDate'))
        return
      }
      const end = new Date(customEnd + 'T00:00:00')
      if (end <= start) {
        alert(t('visa.alerts.endAfterStart'))
        return
      }
      onStart(start, duration, end)
    } else {
      onStart(start, duration)
    }
  }

  const handleClearData = () => {
    if (confirm(t('visa.alerts.confirmClear'))) {
      onClearData()
      setVisaStart('')
      setCustomEnd('')
      setDuration('18')
    }
  }

  return (
    <section className="visa-setup">
      <h2>{t('visa.title')}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="visa-start">{t('visa.startDate')}</label>
          <input
            type="date"
            id="visa-start"
            value={visaStart}
            onChange={e => setVisaStart(e.target.value)}
            max={formatDate(getToday())}
            required
          />
        </div>

        <div className="form-group">
          <label>{t('visa.duration')}</label>
          <div className="duration-options">
            <label className="radio-label">
              <input
                type="radio"
                name="duration"
                value="18"
                checked={duration === '18'}
                onChange={() => setDuration('18')}
              />
              {t('visa.duration18')}
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="duration"
                value="36"
                checked={duration === '36'}
                onChange={() => setDuration('36')}
              />
              {t('visa.duration36')}
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="duration"
                value="60"
                checked={duration === '60'}
                onChange={() => setDuration('60')}
              />
              {t('visa.duration60')}
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="duration"
                value="120"
                checked={duration === '120'}
                onChange={() => setDuration('120')}
              />
              {t('visa.duration120')}
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="duration"
                value="custom"
                checked={duration === 'custom'}
                onChange={() => setDuration('custom')}
              />
              {t('visa.durationCustom')}
            </label>
          </div>
        </div>

        {duration === 'custom' && (
          <div className="form-group">
            <label htmlFor="visa-end">{t('visa.endDate')}</label>
            <input
              type="date"
              id="visa-end"
              value={customEnd}
              onChange={e => setCustomEnd(e.target.value)}
              min={visaStart}
              required
            />
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="primary-btn">
            {t('visa.startPlanning')}
          </button>
          {hasData && (
            <button
              type="button"
              className="clear-btn"
              onClick={handleClearData}
            >
              {t('visa.clearData')}
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
