import type { Trip, MonthStatus } from '../../types'
import { getMonthStart, getMonthEnd } from '../../utils/dateUtils'
import { getDayStatus } from '../../utils/validator'

interface MonthBlockProps {
  year: number
  month: number
  isExpanded: boolean
  visaStart: Date
  visaEnd: Date
  trips: Trip[]
  onToggle: () => void
  onDateClick: (date: Date) => void
}

export function MonthBlock({
  year,
  month,
  isExpanded,
  visaStart,
  visaEnd,
  trips,
  onToggle,
  onDateClick,
}: MonthBlockProps) {
  const monthStatus = getMonthStatus(year, month, visaStart, visaEnd, trips)
  const monthName = getMonthName(year, month)

  return (
    <div className={`month-block ${isExpanded ? 'expanded' : ''}`}>
      <div className={`month-header ${monthStatus}`} onClick={onToggle}>
        <span>{monthName}</span>
        <span className="expand-icon">▼</span>
      </div>

      {isExpanded && (
        <div className="month-calendar">
          <MonthCalendar
            year={year}
            month={month}
            visaStart={visaStart}
            visaEnd={visaEnd}
            trips={trips}
            onDateClick={onDateClick}
          />
        </div>
      )}
    </div>
  )
}

interface MonthCalendarProps {
  year: number
  month: number
  visaStart: Date
  visaEnd: Date
  trips: Trip[]
  onDateClick: (date: Date) => void
}

function MonthCalendar({
  year,
  month,
  visaStart,
  visaEnd,
  trips,
  onDateClick,
}: MonthCalendarProps) {
  const firstDay = getMonthStart(new Date(year, month, 1))
  const lastDay = getMonthEnd(new Date(year, month, 1))
  const startWeekday = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const weekdays = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="calendar-grid">
      {/* Week day headers */}
      {weekdays.map(day => (
        <div key={day} className="calendar-header-cell">
          {day}
        </div>
      ))}

      {/* Empty cells before first day */}
      {Array.from({ length: startWeekday }).map((_, i) => (
        <div key={`empty-${i}`} className="calendar-day empty" />
      ))}

      {/* Date cells */}
      {Array.from({ length: daysInMonth }).map((_, i) => {
        const day = i + 1
        const date = new Date(year, month, day)
        const status = getDayStatus(date, trips, visaStart, visaEnd)
        const isClickable = status !== 'out-of-visa'

        return (
          <div
            key={day}
            className={`calendar-day ${status}`}
            onClick={() => isClickable && onDateClick(date)}
            style={{ cursor: isClickable ? 'pointer' : 'default' }}
          >
            {day}
          </div>
        )
      })}
    </div>
  )
}

function getMonthName(year: number, month: number): string {
  return `${year}年${month + 1}月`
}

function getMonthStatus(
  year: number,
  month: number,
  visaStart: Date,
  visaEnd: Date,
  trips: Trip[]
): MonthStatus {
  const monthStart = getMonthStart(new Date(year, month, 1))
  const monthEnd = getMonthEnd(new Date(year, month, 1))

  let hasViolation = false
  let hasStay = false
  let hasWindowFull = false
  let hasNormal = false
  let totalDays = 0
  let windowFullDays = 0

  const currentDate = new Date(monthStart)
  while (currentDate <= monthEnd) {
    const status = getDayStatus(currentDate, trips, visaStart, visaEnd)

    // Only count dates within visa validity period
    if (status !== 'out-of-visa') {
      totalDays++

      if (status === 'violation') {
        hasViolation = true
        break
      }
      if (status === 'valid-stay') {
        hasStay = true
      }
      if (status === 'window-full') {
        hasWindowFull = true
        windowFullDays++
      }
      if (status === 'normal') {
        hasNormal = true
      }
    }

    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Priority: violation > all window full > has stay > normal
  if (hasViolation) return 'has-violation'

  // If all valid dates are window full (no stay, no normal)
  if (totalDays > 0 && windowFullDays === totalDays && !hasStay && !hasNormal) {
    return 'all-window-full'
  }

  if (hasStay) return 'has-stay'
  if (hasWindowFull) return 'has-window-full' // Some dates with full window
  return 'normal'
}
