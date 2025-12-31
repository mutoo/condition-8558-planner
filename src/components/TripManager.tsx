import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Edit2, Trash2, Save, X, CheckCircle, XCircle, Plus } from 'lucide-react'
import type { Trip } from '../types'
import {
  formatDate,
  formatDisplayDate,
  parseDate,
  addDays,
  daysBetween,
} from '../utils/dateUtils'
import { validateTrip, calculateMaxConsecutiveStay } from '../utils/validator'
import { AdSlot } from './AdSlot'
import { trackEvent } from './GoogleAnalytics'
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
  onDateClick?: (dateString: string) => void
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
  onDateClick,
}: TripManagerProps) {
  const { t, i18n } = useTranslation()
  const [newEntryDate, setNewEntryDate] = useState('')
  const [newExitDate, setNewExitDate] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editEntry, setEditEntry] = useState('')
  const [editExit, setEditExit] = useState('')

  // Update dates when initial values change (from calendar)
  useEffect(() => {
    if (initialEntryDate) {
      setNewEntryDate(initialEntryDate)
    }
  }, [initialEntryDate])

  useEffect(() => {
    if (initialExitDate) {
      setNewExitDate(initialExitDate)
    }
  }, [initialExitDate])

  const handleAddTrip = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newEntryDate || !newExitDate) {
      alert(t('trip.alerts.enterDates'))
      return
    }

    const trip: Trip = {
      id: 'temp',
      entry: newEntryDate,
      exit: newExitDate,
    }

    const validation = validateTrip(trip, trips, visaStart, visaEnd, t, i18n.language)

    if (!validation.valid) {
      alert(validation.reason)
      return
    }

    onAddTrip(newEntryDate, newExitDate)
    setNewEntryDate('')
    setNewExitDate('')
    
    // Track trip added
    const entry = parseDate(newEntryDate)
    const exit = parseDate(newExitDate)
    const days = daysBetween(entry, exit) + 1
    trackEvent('trip_added', {
      days: days,
      entry_date: newEntryDate,
      exit_date: newExitDate,
    })
  }

  const handleStartEdit = (trip: Trip) => {
    setEditingId(trip.id)
    setEditEntry(trip.entry)
    setEditExit(trip.exit)
  }

  const handleSaveEdit = (id: string) => {
    if (!editEntry || !editExit) {
      alert(t('trip.alerts.enterDates'))
      return
    }

    const trip: Trip = {
      id,
      entry: editEntry,
      exit: editExit,
    }

    const otherTrips = trips.filter(t => t.id !== id)
    const validation = validateTrip(trip, otherTrips, visaStart, visaEnd, t, i18n.language)

    if (!validation.valid) {
      alert(validation.reason)
      return
    }

    onUpdateTrip(id, editEntry, editExit)
    setEditingId(null)
    setEditEntry('')
    setEditExit('')
    
    // Track trip updated
    const entry = parseDate(editEntry)
    const exit = parseDate(editExit)
    const days = daysBetween(entry, exit) + 1
    trackEvent('trip_updated', {
      trip_id: id,
      days: days,
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditEntry('')
    setEditExit('')
  }

  const handleDelete = (id: string) => {
    if (confirm(t('trip.alerts.confirmDelete'))) {
      onDeleteTrip(id)
      if (editingId === id) {
        handleCancelEdit()
      }
      
      // Track trip deleted
      trackEvent('trip_deleted', {
        trip_id: id,
      })
    }
  }

  const handleSetMaxExit = (currentEntry: string, isEditing: boolean) => {
    if (!currentEntry) {
      alert(t('trip.alerts.selectEntry'))
      return
    }

    const entry = parseDate(currentEntry)

    if (entry < visaStart || entry > visaEnd) {
      alert(t('trip.alerts.entryOutOfVisa'))
      return
    }

    const relevantTrips = trips.filter(trip => {
      if (isEditing && trip.id === editingId) return false
      const tripStart = parseDate(trip.entry)
      const tripEnd = parseDate(trip.exit)
      return !(entry >= tripStart && entry <= tripEnd)
    })

    const maxDays = calculateMaxConsecutiveStay(entry, relevantTrips, visaEnd)

    if (maxDays <= 0) {
      alert(t('trip.alerts.cannotEntry'))
      return
    }

    const maxExitDate = addDays(entry, maxDays - 1)
    const exitDateStr = formatDate(maxExitDate)

    if (isEditing) {
      setEditExit(exitDateStr)
    } else {
      setNewExitDate(exitDateStr)
    }
    
    alert(t('trip.alerts.maxStaySet', { days: maxDays, date: exitDateStr }))
    
    // Track max stay calculation
    trackEvent('max_stay_calculated', {
      entry_date: currentEntry,
      max_days: maxDays,
      exit_date: exitDateStr,
    })
  }

  return (
    <section className="trip-manager">
      {trips.length > 0 ? (
        <div className="trips-list">
          <h2>{t('trip.planned')}</h2>
          <div className="trip-items">
            {trips.map(trip => {
              const isEditing = editingId === trip.id
              const entry = parseDate(isEditing ? editEntry : trip.entry)
              const exit = parseDate(isEditing ? editExit : trip.exit)
              const days = daysBetween(entry, exit) + 1

              const otherTrips = trips.filter(t => t.id !== trip.id)
              const validation = validateTrip(
                { id: trip.id, entry: isEditing ? editEntry : trip.entry, exit: isEditing ? editExit : trip.exit },
                otherTrips,
                visaStart,
                visaEnd,
                t,
                i18n.language
              )

              return (
                <div
                  key={trip.id}
                  className={`trip-item ${validation.valid ? 'valid' : 'invalid'} ${isEditing ? 'editing' : ''}`}
                >
                  {isEditing ? (
                    <div className="trip-edit-form">
                      <div className="trip-edit-dates">
                        <div className="form-group">
                          <label>{t('trip.entry')}</label>
                          <input
                            type="date"
                            value={editEntry}
                            onChange={e => setEditEntry(e.target.value)}
                            min={formatDate(visaStart)}
                            max={formatDate(visaEnd)}
                          />
                        </div>
                        <div className="form-group">
                          <label>{t('trip.exit')}</label>
                          <div className="date-input-with-button">
                            <input
                              type="date"
                              value={editExit}
                              onChange={e => setEditExit(e.target.value)}
                              min={editEntry || formatDate(visaStart)}
                              max={formatDate(visaEnd)}
                            />
                            <button
                              type="button"
                              className="max-btn-small"
                              onClick={() => handleSetMaxExit(editEntry, true)}
                              title={t('trip.maxStay')}
                            >
                              {t('trip.maxStay')}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="trip-edit-actions">
                        <button
                          className="save-btn"
                          onClick={() => handleSaveEdit(trip.id)}
                        >
                          <Save size={16} /> {t('trip.update')}
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={handleCancelEdit}
                        >
                          <X size={16} /> {t('trip.cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="trip-info">
                        <div className="trip-dates">
                          <span className="trip-label">{t('trip.entry')}</span>
                          <span 
                            className="trip-date clickable"
                            onClick={() => onDateClick?.(trip.entry)}
                            title={t('trip.entry')}
                          >
                            {formatDisplayDate(entry, i18n.language)}
                          </span>
                        </div>
                        <div className="trip-dates">
                          <span className="trip-label">{t('trip.exit')}</span>
                          <span 
                            className="trip-date clickable"
                            onClick={() => onDateClick?.(trip.exit)}
                            title={t('trip.exit')}
                          >
                            {formatDisplayDate(exit, i18n.language)}
                          </span>
                        </div>
                      </div>
                      <div className="trip-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleStartEdit(trip)}
                        >
                          <Edit2 size={16} /> {t('trip.edit')}
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(trip.id)}
                        >
                          <Trash2 size={16} /> {t('trip.delete')}
                        </button>
                      </div>
                    </>
                  )}
                  
                  <div className="trip-footer">
                    <div className="trip-days-info">
                      <span className="trip-label">{t('trip.days')}</span>
                      <span className="trip-days">{days}{t('trip.daysUnit')}</span>
                    </div>
                    <div className="trip-status">
                      {validation.valid ? (
                        <span className="status-valid">
                          <CheckCircle size={16} /> {validation.reason}
                        </span>
                      ) : (
                        <span className="status-invalid">
                          <XCircle size={16} /> {validation.reason}
                        </span>
                      )}
                    </div>
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

      {/* Secondary ad slot: Between planned trips and add trip form */}
      <AdSlot 
        slotId={import.meta.env.VITE_ADSENSE_SECONDARY_SLOT || 'secondary-ad'} 
        format="horizontal" 
        className="secondary-ad" 
      />

      <div className="add-trip-section">
        <h2>{t('trip.title')}</h2>
        <form onSubmit={handleAddTrip} className="trip-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="entry-date">{t('trip.entryDate')}</label>
              <input
                type="date"
                id="entry-date"
                value={newEntryDate}
                onChange={e => setNewEntryDate(e.target.value)}
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
                  value={newExitDate}
                  onChange={e => setNewExitDate(e.target.value)}
                  min={newEntryDate || formatDate(visaStart)}
                  max={formatDate(visaEnd)}
                  required
                />
                <button
                  type="button"
                  className="max-btn"
                  onClick={() => handleSetMaxExit(newEntryDate, false)}
                  title={t('trip.maxStay')}
                >
                  {t('trip.maxStay')}
                </button>
              </div>
            </div>
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="secondary-btn">
              <Plus size={16} /> {t('trip.add')}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
