import { useTranslation } from 'react-i18next'
import type { TripStatistics } from '../types'
import { formatDisplayDate, parseDate } from '../utils/dateUtils'
import './StatsPanel.css'

interface StatsPanelProps {
  stats: TripStatistics
  visaStart: Date
  visaEnd: Date
}

export function StatsPanel({ stats, visaStart, visaEnd }: StatsPanelProps) {
  const { t, i18n } = useTranslation()

  return (
    <div className="stats-panel">
      <h3>{t('stats.title')}</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-label">{t('stats.visaPeriod')}</div>
          <div className="stat-value">
            {formatDisplayDate(visaStart, i18n.language)} ~ {formatDisplayDate(visaEnd, i18n.language)}
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-label">{t('stats.totalTrips')}</div>
          <div className="stat-value">{stats.totalTrips}{t('stats.tripsUnit')}</div>
        </div>

        <div className="stat-item">
          <div className="stat-label">{t('stats.totalDays')}</div>
          <div className="stat-value">{stats.totalDaysInAustralia}{t('trip.daysUnit')}</div>
        </div>

        {stats.violationDays > 0 && (
          <div className="stat-item stat-warning">
            <div className="stat-label">{t('stats.violationDays')}</div>
            <div className="stat-value">{stats.violationDays}{t('trip.daysUnit')}</div>
          </div>
        )}

        {stats.earliestEntry && (
          <div className="stat-item">
            <div className="stat-label">{t('stats.earliestEntry')}</div>
            <div className="stat-value">
              {formatDisplayDate(parseDate(stats.earliestEntry), i18n.language)}
            </div>
          </div>
        )}

        {stats.latestExit && (
          <div className="stat-item">
            <div className="stat-label">{t('stats.latestExit')}</div>
            <div className="stat-value">
              {formatDisplayDate(parseDate(stats.latestExit), i18n.language)}
            </div>
          </div>
        )}
      </div>

      {stats.violationDays > 0 && (
        <div className="stats-warning-message">
          {t('stats.warning', { days: stats.violationDays })}
        </div>
      )}
    </div>
  )
}
