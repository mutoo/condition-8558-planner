import { useEffect } from 'react'
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
          <h3>{formatDisplayDate(date)}</h3>
          <span className="modal-close" onClick={onClose}>
            &times;
          </span>
        </div>

        <div className="modal-body">
          <h4>📊 18个月滑动窗口使用情况</h4>
          <div className="info-row">
            <span className="info-label">窗口期间</span>
            <span className="info-value">
              {formatDisplayDate(windowUsage.windowStart)} -{' '}
              {formatDisplayDate(date)}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">已使用</span>
            <span className="info-value">
              {windowUsage.daysUsed} 天 ({percentage}%)
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">剩余</span>
            <span className="info-value">{windowUsage.daysRemaining} 天</span>
          </div>

          {windowUsage.trips.length > 0 && (
            <>
              <h4>影响此窗口的行程</h4>
              <ul>
                {windowUsage.trips.map((trip, index) => {
                  const entry = parseDate(trip.entry)
                  const exit = parseDate(trip.exit)
                  return (
                    <li key={index}>
                      {formatDisplayDate(entry)} - {formatDisplayDate(exit)} (
                      {trip.days}天)
                    </li>
                  )
                })}
              </ul>
            </>
          )}

          {currentTrip && (
            <div className="highlight">
              <strong>📍 此日期在现有行程内</strong>
              <br />
              {formatDisplayDate(parseDate(currentTrip.entry))} -{' '}
              {formatDisplayDate(parseDate(currentTrip.exit))}
            </div>
          )}

          {maxConsecutiveDays <= 0 ? (
            <>
              <div className="danger">
                <strong>⚠️ 窗口已满，无法在此日期入境！</strong>
              </div>
              {nextValidDate && (
                <div className="success">
                  <strong>✅ 下一个可入境日期</strong>
                  <br />
                  {formatDisplayDate(nextValidDate)}
                  <br />
                  <small>
                    （需等待 {daysBetween(date, nextValidDate)} 天）
                  </small>
                </div>
              )}
            </>
          ) : (
            <div className={maxConsecutiveDays < 30 ? 'warning' : 'success'}>
              {currentTrip ? (
                <>
                  💡 如果从此日期重新规划，最多可连续停留：
                  <strong>{maxConsecutiveDays} 天</strong>
                </>
              ) : (
                <>
                  ✅ 从此日期开始，最多可连续停留：
                  <strong>{maxConsecutiveDays} 天</strong>
                </>
              )}
              {maxConsecutiveDays < 30 && (
                <>
                  <br />
                  <small>⚠️ 警告：可停留天数较少！</small>
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
              设置为入境日期
            </button>
            <button
              className="action-btn exit-btn"
              onClick={() => onSetAsExit(date)}
            >
              设置为出境日期
            </button>
          </div>
          <button className="primary-btn" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
