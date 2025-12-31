import { useState, useImperativeHandle, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { Trip } from '../../types'
import { getMonthsBetween } from '../../utils/dateUtils'
import { MonthBlock } from './MonthBlock'
import { DateModal } from './DateModal'
import './Calendar.css'

interface CalendarProps {
  visaStart: Date
  visaEnd: Date
  trips: Trip[]
  onSetEntryDate: (date: Date) => void
  onSetExitDate: (date: Date) => void
}

export interface CalendarRef {
  scrollToDate: (date: Date) => void
}

export const Calendar = forwardRef<CalendarRef, CalendarProps>(({
  visaStart,
  visaEnd,
  trips,
  onSetEntryDate,
  onSetExitDate,
}, ref) => {
  const { t } = useTranslation()
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(() => {
    // Default: expand first and last month
    const months = getMonthsBetween(visaStart, visaEnd)
    if (months.length === 0) return new Set()

    const firstKey = `${months[0].getFullYear()}-${months[0].getMonth()}`
    const lastKey = `${months[months.length - 1].getFullYear()}-${months[months.length - 1].getMonth()}`

    return new Set([firstKey, lastKey])
  })

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const months = getMonthsBetween(visaStart, visaEnd)

  const toggleMonth = (year: number, month: number) => {
    const key = `${year}-${month}`
    setExpandedMonths(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }
  
  const scrollToDate = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const key = `${year}-${month}`
    
    // Expand the month
    setExpandedMonths(prev => {
      const next = new Set(prev)
      next.add(key)
      return next
    })
    
    // Scroll to the month
    setTimeout(() => {
      const element = document.getElementById(`month-${key}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }
  
  useImperativeHandle(ref, () => ({
    scrollToDate
  }))

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const handleCloseModal = () => {
    setSelectedDate(null)
  }

  const handleSetEntryDate = (date: Date) => {
    onSetEntryDate(date)
    setSelectedDate(null)
  }

  const handleSetExitDate = (date: Date) => {
    onSetExitDate(date)
    setSelectedDate(null)
  }

  return (
    <div className="calendar-wrapper">
      <div className="calendar-legend">
        <div className="legend-section">
          <strong>{t('calendar.legend.dateColors')}</strong>
          <div className="legend-items">
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ background: '#f5f5f5', border: '1px solid #e0e0e0' }}
              />
              <span className="legend-label">{t('calendar.legend.canEntry')}</span>
            </div>
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ background: '#a7f3d0', border: '1px solid #10b981' }}
              />
              <span className="legend-label">{t('calendar.legend.validStay')}</span>
            </div>
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ background: '#fee2e2', border: '1px solid #fca5a5' }}
              />
              <span className="legend-label">{t('calendar.legend.windowFull')}</span>
            </div>
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ background: '#fecaca', border: '1px solid #ef4444' }}
              />
              <span className="legend-label">{t('calendar.legend.violationStay')}</span>
            </div>
          </div>
        </div>

        <div className="legend-divider" />

        <div className="legend-section">
          <strong>{t('calendar.legend.monthColors')}</strong>
          <div className="legend-items">
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ background: '#d1fae5' }}
              />
              <span className="legend-label">{t('calendar.legend.hasValidStay')}</span>
            </div>
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ background: '#fef3c7' }}
              />
              <span className="legend-label">{t('calendar.legend.partialWindowFull')}</span>
            </div>
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ background: '#fee2e2' }}
              />
              <span className="legend-label">{t('calendar.legend.allWindowFull')}</span>
            </div>
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ background: '#fecaca' }}
              />
              <span className="legend-label">{t('calendar.legend.hasViolation')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="calendar-hint">
        {t('calendar.hint')}
      </div>

      <div className="calendar-container">
        {months.map(monthDate => {
          const year = monthDate.getFullYear()
          const month = monthDate.getMonth()
          const key = `${year}-${month}`
          const isExpanded = expandedMonths.has(key)

          return (
            <div key={key} id={`month-${key}`}>
              <MonthBlock
                year={year}
                month={month}
                isExpanded={isExpanded}
                visaStart={visaStart}
                visaEnd={visaEnd}
                trips={trips}
                onToggle={() => toggleMonth(year, month)}
                onDateClick={handleDateClick}
              />
            </div>
          )
        })}
      </div>

      {selectedDate && (
        <DateModal
          date={selectedDate}
          trips={trips}
          visaStart={visaStart}
          visaEnd={visaEnd}
          onClose={handleCloseModal}
          onSetAsEntry={handleSetEntryDate}
          onSetAsExit={handleSetExitDate}
        />
      )}
    </div>
  )
})
