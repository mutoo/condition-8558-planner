/**
 * Trip represents a stay period in Australia
 */
export interface Trip {
  id: string
  entry: string // ISO date string (YYYY-MM-DD)
  exit: string // ISO date string (YYYY-MM-DD)
}

/**
 * Visa validity period
 */
export interface VisaPeriod {
  start: Date
  end: Date
}

/**
 * Validation result for trip checking
 */
export interface ValidationResult {
  valid: boolean
  reason: string
}

/**
 * Day status for calendar rendering
 */
export type DayStatus =
  | 'normal' // Can enter Australia
  | 'valid-stay' // Staying in Australia (compliant)
  | 'violation' // Staying in Australia (violates Condition 8558)
  | 'window-full' // Window is full, cannot enter
  | 'out-of-visa' // Outside visa validity period

/**
 * Month status for calendar month header
 */
export type MonthStatus =
  | 'normal' // No stays
  | 'has-stay' // Has compliant stays
  | 'has-window-full' // Some days with full window
  | 'all-window-full' // All days with full window
  | 'has-violation' // Has violation days

/**
 * Window usage information for a specific date
 */
export interface WindowUsage {
  date: Date
  windowStart: Date
  windowEnd: Date
  daysUsed: number
  daysRemaining: number
  isViolation: boolean
  isWindowFull: boolean
  trips: Array<{
    entry: string
    exit: string
    days: number
  }>
}

/**
 * Statistics for all planned trips
 */
export interface TripStatistics {
  totalTrips: number
  totalDaysInAustralia: number
  violationDays: number
  earliestEntry: string | null
  latestExit: string | null
}

/**
 * Application state
 */
export interface AppState {
  visaStart: Date | null
  visaEnd: Date | null
  trips: Trip[]
  selectedDuration: '18' | '36' | '60' | '120' | 'custom'
}

/**
 * Modal content for date info
 */
export interface DateModalInfo {
  date: Date
  windowUsage: WindowUsage
  canSetAsEntry: boolean
  canSetAsExit: boolean
}
