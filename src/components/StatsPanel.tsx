import type { TripStatistics } from '../types'
import { formatDisplayDate, parseDate } from '../utils/dateUtils'
import './StatsPanel.css'

interface StatsPanelProps {
  stats: TripStatistics
  visaStart: Date
  visaEnd: Date
}

export function StatsPanel({ stats, visaStart, visaEnd }: StatsPanelProps) {
  return (
    <div className="stats-panel">
      <h3>统计信息</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-label">签证有效期</div>
          <div className="stat-value">
            {formatDisplayDate(visaStart)} ~ {formatDisplayDate(visaEnd)}
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-label">已规划行程</div>
          <div className="stat-value">{stats.totalTrips} 个</div>
        </div>

        <div className="stat-item">
          <div className="stat-label">总在澳天数</div>
          <div className="stat-value">{stats.totalDaysInAustralia} 天</div>
        </div>

        {stats.violationDays > 0 && (
          <div className="stat-item stat-warning">
            <div className="stat-label">违规天数</div>
            <div className="stat-value">{stats.violationDays} 天</div>
          </div>
        )}

        {stats.earliestEntry && (
          <div className="stat-item">
            <div className="stat-label">最早入境</div>
            <div className="stat-value">
              {formatDisplayDate(parseDate(stats.earliestEntry))}
            </div>
          </div>
        )}

        {stats.latestExit && (
          <div className="stat-item">
            <div className="stat-label">最晚出境</div>
            <div className="stat-value">
              {formatDisplayDate(parseDate(stats.latestExit))}
            </div>
          </div>
        )}
      </div>

      {stats.violationDays > 0 && (
        <div className="stats-warning-message">
          ⚠️ 警告：您的行程中有 {stats.violationDays} 天违反了 Condition 8558
          规定
        </div>
      )}
    </div>
  )
}
