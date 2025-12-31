import { useState } from 'react'
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
  const [visaStart, setVisaStart] = useState('')
  const [duration, setDuration] = useState<
    '18' | '36' | '60' | '120' | 'custom'
  >('18')
  const [customEnd, setCustomEnd] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!visaStart) {
      alert('请输入签证开始日期')
      return
    }

    const start = new Date(visaStart + 'T00:00:00')

    if (duration === 'custom') {
      if (!customEnd) {
        alert('请输入签证结束日期')
        return
      }
      const end = new Date(customEnd + 'T00:00:00')
      if (end <= start) {
        alert('结束日期必须晚于开始日期')
        return
      }
      onStart(start, duration, end)
    } else {
      onStart(start, duration)
    }
  }

  const handleClearData = () => {
    if (confirm('确定要清除所有数据吗？此操作无法撤销。')) {
      onClearData()
      setVisaStart('')
      setCustomEnd('')
      setDuration('18')
    }
  }

  return (
    <section className="visa-setup">
      <h2>签证有效期设置</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="visa-start">签证开始日期：</label>
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
          <label>有效期：</label>
          <div className="duration-options">
            <label className="radio-label">
              <input
                type="radio"
                name="duration"
                value="18"
                checked={duration === '18'}
                onChange={() => setDuration('18')}
              />
              18个月
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="duration"
                value="36"
                checked={duration === '36'}
                onChange={() => setDuration('36')}
              />
              3年
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="duration"
                value="60"
                checked={duration === '60'}
                onChange={() => setDuration('60')}
              />
              5年
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="duration"
                value="120"
                checked={duration === '120'}
                onChange={() => setDuration('120')}
              />
              10年
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="duration"
                value="custom"
                checked={duration === 'custom'}
                onChange={() => setDuration('custom')}
              />
              自定义
            </label>
          </div>
        </div>

        {duration === 'custom' && (
          <div className="form-group">
            <label htmlFor="visa-end">签证结束日期：</label>
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
            开始规划
          </button>
          {hasData && (
            <button
              type="button"
              className="clear-btn"
              onClick={handleClearData}
            >
              清除所有数据
            </button>
          )}
        </div>
      </form>
    </section>
  )
}
