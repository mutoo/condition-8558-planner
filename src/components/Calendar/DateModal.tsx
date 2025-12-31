import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { Trip } from '../../types'
import {
  formatDisplayDate,
  parseDate,
  daysBetween,
} from '../../utils/dateUtils'
import {
  getWindowUsage,
  calculateMaxConsecutiveStay,
  findNextValidEntryDate,
} from '../../utils/validator'

interface DateModalProps {
  date: Date
  trips: Trip[]
  visaStart: Date
  visaEnd: Date
  onClose: () => void
  onSetAsEntry: (date: Date) => void
  onSetAsExit: (date: Date) => void
}

export function DateModal({
  date,
  trips,
  visaEnd,
  onClose,
  onSetAsEntry,
  onSetAsExit,
}: DateModalProps) {
  const { t, i18n } = useTranslation()
  
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const windowUsage = getWindowUsage(date, trips)
  const percentage = ((windowUsage.daysUsed / 365) * 100).toFixed(1)

  // Check if date is in any existing trip
  const currentTrip = trips.find(trip => {
    const entry = parseDate(trip.entry)
    const exit = parseDate(trip.exit)
    return date >= entry && date <= exit
  })

  // Filter out trips that include the selected date for max stay calculation
  const relevantTrips = trips.filter(trip => {
    const entry = parseDate(trip.entry)
    const exit = parseDate(trip.exit)
    return !(date >= entry && date <= exit)
  })

  const maxConsecutiveDays = calculateMaxConsecutiveStay(
    date,
    relevantTrips,
    visaEnd
  )

  const nextValidDate =
    maxConsecutiveDays <= 0
      ? findNextValidEntryDate(date, trips, visaEnd)
      : null

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{formatDisplayDate(date, i18n.language)}</h3>
          <span className="modal-close" onClick={onClose}>
            &times;
          </span>
        </div>

        <div className="modal-body">
          <h4>{t('dateModal.windowUsage')}</h4>
          <div className="info-row">
            <span className="info-label">{t('dateModal.windowPeriod')}</span>
            <span className="info-value">
              {formatDisplayDate(windowUsage.windowStart, i18n.language)} -{' '}
              {formatDisplayDate(date, i18n.language)}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">{t('dateModal.used')}</span>
            <span className="info-value">
              {windowUsage.daysUsed} {t('common.days')} ({percentage}%)
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">{t('dateModal.remaining')}</span>
            <span className="info-value">{windowUsage.daysRemaining} {t('common.days')}</span>
          </div>

          {windowUsage.trips.length > 0 && (
            <>
              <h4>{t('dateModal.affectingTrips')}</h4>
              <ul>
                {windowUsage.trips.map((trip, index) => {
                  const entry = parseDate(trip.entry)
                  const exit = parseDate(trip.exit)
                  return (
                    <li key={index}>
                      {formatDisplayDate(entry, i18n.language)} - {formatDisplayDate(exit, i18n.language)} (
                      {trip.days}{t('trip.daysUnit')})
                    </li>
                  )
                })}
              </ul>
            </>
          )}

          {currentTrip && (
            <div className="highlight">
              <strong>{t('dateModal.inExistingTrip')}</strong>
              <br />
              {formatDisplayDate(parseDate(currentTrip.entry), i18n.language)} -{' '}
              {formatDisplayDate(parseDate(currentTrip.exit), i18n.language)}
            </div>
          )}

          {maxConsecutiveDays <= 0 ? (
            <>
              <div className="danger">
                <strong>{t('dateModal.windowFullWarning')}</strong>
              </div>
              {nextValidDate && (
                <div className="success">
                  <strong>{t('dateModal.nextValidDate')}</strong>
                  <br />
                  {formatDisplayDate(nextValidDate, i18n.language)}
                  <br />
                  <small>
                    {t('dateModal.waitDays', { days: daysBetween(date, nextValidDate) })}
                  </small>
                </div>
              )}
            </>
          ) : (
            <div className={maxConsecutiveDays < 30 ? 'warning' : 'success'}>
              {currentTrip ? (
                <>
                  {t('dateModal.replanMaxStay')}
                  <strong>{maxConsecutiveDays} {t('common.days')}</strong>
                </>
              ) : (
                <>
                  {t('dateModal.maxStayFromDate')}
                  <strong>{maxConsecutiveDays} {t('common.days')}</strong>
                </>
              )}
              {maxConsecutiveDays < 30 && (
                <>
                  <br />
                  <small>{t('dateModal.lowStayWarning')}</small>
                </>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="modal-actions">
            <button
              className="action-btn entry-btn"
              onClick={() => onSetAsEntry(date)}
            >
              {t('dateModal.setAsEntry')}
            </button>
            <button
              className="action-btn exit-btn"
              onClick={() => onSetAsExit(date)}
            >
              {t('dateModal.setAsExit')}
            </button>
          </div>
          <button className="primary-btn" onClick={onClose}>
            {t('dateModal.close')}
          </button>
        </div>
      </div>
    </div>
  )
}
