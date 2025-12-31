import { useState, useEffect } from 'react'
import type { Trip } from '../types'
import {
  formatDate,
  formatDisplayDate,
  parseDate,
  addDays,
  daysBetween,
} from '../utils/dateUtils'
import { validateTrip, calculateMaxConsecutiveStay } from '../utils/validator'
import './TripManager.css'

interface TripManagerProps {
  trips: Trip[]
  visaStart: Date
  visaEnd: Date
  onAddTrip: (entry: string, exit: string) => void
  onUpdateTrip: (id: string, entry: string, exit: string) => void
  onDeleteTrip: (id: string) => void
  initialEntryDate?: string
  initialExitDate?: string
}

export function TripManager({
  trips,
  visaStart,
  visaEnd,
  onAddTrip,
  onUpdateTrip,
  onDeleteTrip,
  initialEntryDate,
  initialExitDate,
}: TripManagerProps) {
  const [entryDate, setEntryDate] = useState('')
  const [exitDate, setExitDate] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  // Update dates when initial values change (from calendar)
  useEffect(() => {
    if (initialEntryDate) {
      setEntryDate(initialEntryDate)
    }
  }, [initialEntryDate])

  useEffect(() => {
    if (initialExitDate) {
      setExitDate(initialExitDate)
    }
  }, [initialExitDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!entryDate || !exitDate) {
      alert('请输入入境和出境日期')
      return
    }

    const trip: Trip = {
      id: editingId || 'temp',
      entry: entryDate,
      exit: exitDate,
    }

    const existingTrips = editingId
      ? trips.filter(t => t.id !== editingId)
      : trips

    const validation = validateTrip(trip, existingTrips, visaStart, visaEnd)

    if (!validation.valid) {
      alert(validation.reason)
      return
    }

    if (editingId) {
      onUpdateTrip(editingId, entryDate, exitDate)
      setEditingId(null)
    } else {
      onAddTrip(entryDate, exitDate)
    }

    setEntryDate('')
    setExitDate('')
  }

  const handleEdit = (trip: Trip) => {
    setEditingId(trip.id)
    setEntryDate(trip.entry)
    setExitDate(trip.exit)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEntryDate('')
    setExitDate('')
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个行程吗？')) {
      onDeleteTrip(id)
      if (editingId === id) {
        handleCancelEdit()
      }
    }
  }

  const handleSetMaxExit = () => {
    if (!entryDate) {
      alert('请先选择入境日期')
      return
    }

    const entry = parseDate(entryDate)

    // Check if entry date is within visa validity
    if (entry < visaStart || entry > visaEnd) {
      alert('入境日期不在签证有效期内')
      return
    }

    // Filter out trips that include the entry date
    const relevantTrips = trips.filter(trip => {
      if (trip.id === editingId) return false // Exclude current editing trip
      const tripStart = parseDate(trip.entry)
      const tripEnd = parseDate(trip.exit)
      return !(entry >= tripStart && entry <= tripEnd)
    })

    const maxDays = calculateMaxConsecutiveStay(entry, relevantTrips, visaEnd)

    if (maxDays <= 0) {
      alert('该日期无法入境，窗口已满或有行程冲突')
      return
    }

    // Calculate max exit date
    const maxExitDate = addDays(entry, maxDays - 1)
    const exitDateStr = formatDate(maxExitDate)

    setExitDate(exitDateStr)
    alert(`已设置为最大停留期：${maxDays} 天\n出境日期：${exitDateStr}`)
  }

  return (
    <section className="trip-manager">
      <h2>{editingId ? '编辑行程' : '添加行程'}</h2>

      <form onSubmit={handleSubmit} className="trip-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="entry-date">入境日期：</label>
            <input
              type="date"
              id="entry-date"
              value={entryDate}
              onChange={e => setEntryDate(e.target.value)}
              min={formatDate(visaStart)}
              max={formatDate(visaEnd)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="exit-date">出境日期：</label>
            <div className="date-input-with-button">
              <input
                type="date"
                id="exit-date"
                value={exitDate}
                onChange={e => setExitDate(e.target.value)}
                min={entryDate || formatDate(visaStart)}
                max={formatDate(visaEnd)}
                required
              />
              <button
                type="button"
                className="max-btn"
                onClick={handleSetMaxExit}
                title="设置为最大可停留日期"
              >
                最大
              </button>
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="secondary-btn">
              {editingId ? '更新' : '添加'}
            </button>
            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelEdit}
              >
                取消
              </button>
            )}
          </div>
        </div>
      </form>

      {trips.length > 0 ? (
        <div className="trips-list">
          <h3>已规划行程</h3>
          <div className="trip-items">
            {trips.map(trip => {
              const entry = parseDate(trip.entry)
              const exit = parseDate(trip.exit)
              const days = daysBetween(entry, exit) + 1 // Include both entry and exit days

              // Validate trip against other trips
              const otherTrips = trips.filter(t => t.id !== trip.id)
              const validation = validateTrip(
                trip,
                otherTrips,
                visaStart,
                visaEnd
              )

              return (
                <div
                  key={trip.id}
                  className={`trip-item ${validation.valid ? 'valid' : 'invalid'} ${editingId === trip.id ? 'editing' : ''}`}
                >
                  <div className="trip-info">
                    <div className="trip-dates">
                      <span className="trip-label">入境：</span>
                      <span className="trip-date">
                        {formatDisplayDate(entry)}
                      </span>
                    </div>
                    <div className="trip-dates">
                      <span className="trip-label">出境：</span>
                      <span className="trip-date">
                        {formatDisplayDate(exit)}
                      </span>
                    </div>
                    <div className="trip-duration">
                      <span className="trip-label">天数：</span>
                      <span className="trip-days">{days} 天</span>
                    </div>
                    <div className="trip-status">
                      {validation.valid ? (
                        <span className="status-valid">
                          ✓ {validation.reason}
                        </span>
                      ) : (
                        <span className="status-invalid">
                          ✗ {validation.reason}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="trip-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(trip)}
                    >
                      编辑
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(trip.id)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="empty-trips">
          <p>暂无行程</p>
        </div>
      )}
    </section>
  )
}
