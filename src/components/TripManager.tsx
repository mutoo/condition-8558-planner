import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t, i18n } = useTranslation()
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
      alert(t('trip.alerts.enterDates'))
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
    if (confirm(t('trip.alerts.confirmDelete'))) {
      onDeleteTrip(id)
      if (editingId === id) {
        handleCancelEdit()
      }
    }
  }

  const handleSetMaxExit = () => {
    if (!entryDate) {
      alert(t('trip.alerts.selectEntry'))
      return
    }

    const entry = parseDate(entryDate)

    // Check if entry date is within visa validity
    if (entry < visaStart || entry > visaEnd) {
      alert(t('trip.alerts.entryOutOfVisa'))
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
      alert(t('trip.alerts.cannotEntry'))
      return
    }

    // Calculate max exit date
    const maxExitDate = addDays(entry, maxDays - 1)
    const exitDateStr = formatDate(maxExitDate)

    setExitDate(exitDateStr)
    alert(t('trip.alerts.maxStaySet', { days: maxDays, date: exitDateStr }))
  }

  return (
    <section className="trip-manager">
      <h2>{editingId ? t('trip.editTitle') : t('trip.title')}</h2>

      <form onSubmit={handleSubmit} className="trip-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="entry-date">{t('trip.entryDate')}</label>
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
            <label htmlFor="exit-date">{t('trip.exitDate')}</label>
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
                title={t('trip.maxStay')}
              >
                {t('trip.maxStay')}
              </button>
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="secondary-btn">
              {editingId ? t('trip.update') : t('trip.add')}
            </button>
            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancelEdit}
              >
                {t('trip.cancel')}
              </button>
            )}
          </div>
        </div>
      </form>

      {trips.length > 0 ? (
        <div className="trips-list">
          <h3>{t('trip.planned')}</h3>
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
                      <span className="trip-label">{t('trip.entry')}</span>
                      <span className="trip-date">
                        {formatDisplayDate(entry, i18n.language)}
                      </span>
                    </div>
                    <div className="trip-dates">
                      <span className="trip-label">{t('trip.exit')}</span>
                      <span className="trip-date">
                        {formatDisplayDate(exit, i18n.language)}
                      </span>
                    </div>
                    <div className="trip-duration">
                      <span className="trip-label">{t('trip.days')}</span>
                      <span className="trip-days">{days}{t('trip.daysUnit')}</span>
                    </div>
                    <div className="trip-status">
                      {validation.valid ? (
                        <span className="status-valid">
                          {t('trip.status.valid')} {validation.reason}
                        </span>
                      ) : (
                        <span className="status-invalid">
                          {t('trip.status.invalid')} {validation.reason}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="trip-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(trip)}
                    >
                      {t('trip.edit')}
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(trip.id)}
                    >
                      {t('trip.delete')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="empty-trips">
          <p>{t('trip.empty')}</p>
        </div>
      )}
    </section>
  )
}
