import type { AppState, Trip } from '../types'
import { formatDate, parseDate } from './dateUtils'

const STORAGE_KEY = 'condition8558_data'

interface StorageData {
  visaStart: string | null
  visaEnd: string | null
  selectedDuration: '18' | '36' | '60' | '120' | 'custom'
  trips: Trip[]
}

/**
 * Save application state to localStorage
 */
export function saveToLocalStorage(state: AppState): void {
  try {
    const data: StorageData = {
      visaStart: state.visaStart ? formatDate(state.visaStart) : null,
      visaEnd: state.visaEnd ? formatDate(state.visaEnd) : null,
      selectedDuration: state.selectedDuration,
      trips: state.trips,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save data to localStorage:', error)
  }
}

/**
 * Load application state from localStorage
 */
export function loadFromLocalStorage(): Partial<AppState> | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return null

    const parsed: StorageData = JSON.parse(data)

    return {
      visaStart: parsed.visaStart ? parseDate(parsed.visaStart) : null,
      visaEnd: parsed.visaEnd ? parseDate(parsed.visaEnd) : null,
      selectedDuration: parsed.selectedDuration,
      trips: parsed.trips || [],
    }
  } catch (error) {
    console.error('Failed to load data from localStorage:', error)
    return null
  }
}

/**
 * Clear all data from localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}
