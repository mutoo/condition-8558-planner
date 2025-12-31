import { useState, useEffect, useCallback } from 'react'
import type { AppState, Trip } from '../types'
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
} from '../utils/storage'
import { addMonths, addDays } from '../utils/dateUtils'
import { generateTripId, sortTrips } from '../utils/tripUtils'

const initialState: AppState = {
  visaStart: null,
  visaEnd: null,
  trips: [],
  selectedDuration: '18',
}

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromLocalStorage()
    if (saved) {
      setState(prev => ({ ...prev, ...saved }))
    }
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (state.visaStart || state.visaEnd || state.trips.length > 0) {
      saveToLocalStorage(state)
    }
  }, [state])

  const setVisaPeriod = useCallback(
    (
      start: Date,
      duration: '18' | '36' | '60' | '120' | 'custom',
      end?: Date
    ) => {
      let calculatedEnd: Date

      if (duration === 'custom' && end) {
        calculatedEnd = end
      } else {
        const months = parseInt(duration)
        // Calculate end date and subtract 1 day to get the last day of validity period
        calculatedEnd = addMonths(start, months)
        calculatedEnd = addDays(calculatedEnd, -1)
      }

      setState(prev => ({
        ...prev,
        visaStart: start,
        visaEnd: calculatedEnd,
        selectedDuration: duration,
      }))
    },
    []
  )

  const addTrip = useCallback((entry: string, exit: string) => {
    const newTrip: Trip = {
      id: generateTripId(),
      entry,
      exit,
    }

    setState(prev => ({
      ...prev,
      trips: sortTrips([...prev.trips, newTrip]),
    }))

    return newTrip
  }, [])

  const updateTrip = useCallback((id: string, entry: string, exit: string) => {
    setState(prev => ({
      ...prev,
      trips: sortTrips(
        prev.trips.map(trip =>
          trip.id === id ? { ...trip, entry, exit } : trip
        )
      ),
    }))
  }, [])

  const deleteTrip = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      trips: prev.trips.filter(trip => trip.id !== id),
    }))
  }, [])

  const clearAllData = useCallback(() => {
    setState(initialState)
    clearLocalStorage()
  }, [])

  return {
    state,
    setVisaPeriod,
    addTrip,
    updateTrip,
    deleteTrip,
    clearAllData,
  }
}
