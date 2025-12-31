import type { Trip, ValidationResult, WindowUsage, DayStatus } from '../types'
import { parseDate, addDays, daysBetween } from './dateUtils'

// Constants for Condition 8558
export const WINDOW_DAYS = 548 // 18 months = 548 days (365 * 1.5)
export const MAX_DAYS_IN_WINDOW = 365 // 12 months = 365 days

/**
 * Calculate days spent in Australia within the 18-month window ending on the given date
 * Note: Both entry and exit days are counted (daysBetween + 1)
 */
export function getDaysInAustraliaForWindow(date: Date, trips: Trip[]): number {
  const windowStart = addDays(date, -WINDOW_DAYS)
  const windowEnd = date

  let daysInAustralia = 0

  trips.forEach(trip => {
    const tripStart = parseDate(trip.entry)
    const tripEnd = parseDate(trip.exit)

    // Calculate overlap between trip and window
    const overlapStart = tripStart > windowStart ? tripStart : windowStart
    const overlapEnd = tripEnd < windowEnd ? tripEnd : windowEnd

    if (overlapStart <= overlapEnd) {
      // Both entry and exit days count, so +1
      daysInAustralia += daysBetween(overlapStart, overlapEnd) + 1
    }
  })

  return daysInAustralia
}

/**
 * Check if staying in Australia on the given date would violate Condition 8558
 */
export function isViolation(date: Date, trips: Trip[]): boolean {
  const daysInAustralia = getDaysInAustraliaForWindow(date, trips)
  return daysInAustralia > MAX_DAYS_IN_WINDOW
}

/**
 * Validate a trip against existing trips and Condition 8558
 */
export function validateTrip(
  trip: Trip,
  existingTrips: Trip[],
  visaStart: Date,
  visaEnd: Date
): ValidationResult {
  const entry = parseDate(trip.entry)
  const exit = parseDate(trip.exit)

  // Check if date range is valid
  if (entry > exit) {
    return { valid: false, reason: '出境日期必须晚于或等于入境日期' }
  }

  // Check if trip is within visa validity period
  if (entry < visaStart || exit > visaEnd) {
    return { valid: false, reason: '行程不在签证有效期内' }
  }

  // Check for overlaps with existing trips
  for (const existingTrip of existingTrips) {
    if (existingTrip.id === trip.id) continue // Skip self when editing

    const existingEntry = parseDate(existingTrip.entry)
    const existingExit = parseDate(existingTrip.exit)

    if (entry <= existingExit && exit >= existingEntry) {
      return { valid: false, reason: '行程与现有行程重叠' }
    }
  }

  // Check if any day during the trip would violate Condition 8558
  const allTrips = [...existingTrips.filter(t => t.id !== trip.id), trip]
  let currentDate = new Date(entry)

  while (currentDate <= exit) {
    if (isViolation(currentDate, allTrips)) {
      return {
        valid: false,
        reason: `在 ${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月${currentDate.getDate()}日 违反 Condition 8558（18个月内超过12个月）`,
      }
    }
    currentDate = addDays(currentDate, 1)
  }

  return { valid: true, reason: '行程合法' }
}

/**
 * Get the status of a specific day
 */
export function getDayStatus(
  date: Date,
  trips: Trip[],
  visaStart: Date,
  visaEnd: Date
): DayStatus {
  // Check if within visa validity period
  if (date < visaStart || date > visaEnd) {
    return 'out-of-visa'
  }

  // Check if in Australia
  const isInAustralia = trips.some(trip => {
    const entry = parseDate(trip.entry)
    const exit = parseDate(trip.exit)
    return date >= entry && date <= exit
  })

  if (!isInAustralia) {
    // Not in Australia, check if window is full
    const daysInWindow = getDaysInAustraliaForWindow(date, trips)
    if (daysInWindow >= MAX_DAYS_IN_WINDOW) {
      return 'window-full' // Window is full, cannot enter
    }
    return 'normal'
  }

  // In Australia, check if violating rules
  if (isViolation(date, trips)) {
    return 'violation'
  }

  return 'valid-stay'
}

/**
 * Get window usage information for a specific date
 */
export function getWindowUsage(date: Date, trips: Trip[]): WindowUsage {
  const windowStart = addDays(date, -WINDOW_DAYS)
  const windowEnd = date
  const daysUsed = getDaysInAustraliaForWindow(date, trips)
  const daysRemaining = MAX_DAYS_IN_WINDOW - daysUsed

  // Get trips that overlap with this window
  const windowTrips = trips
    .map(trip => {
      const tripStart = parseDate(trip.entry)
      const tripEnd = parseDate(trip.exit)

      const overlapStart = tripStart > windowStart ? tripStart : windowStart
      const overlapEnd = tripEnd < windowEnd ? tripEnd : windowEnd

      if (overlapStart <= overlapEnd) {
        const days = daysBetween(overlapStart, overlapEnd) + 1
        return {
          entry: trip.entry,
          exit: trip.exit,
          days,
        }
      }
      return null
    })
    .filter((t): t is NonNullable<typeof t> => t !== null)

  return {
    date,
    windowStart,
    windowEnd,
    daysUsed,
    daysRemaining,
    isViolation: daysUsed > MAX_DAYS_IN_WINDOW,
    isWindowFull: daysUsed >= MAX_DAYS_IN_WINDOW,
    trips: windowTrips,
  }
}

/**
 * Calculate maximum consecutive days that can be stayed starting from a given date
 */
export function calculateMaxConsecutiveStay(
  startDate: Date,
  trips: Trip[],
  visaEnd: Date
): number {
  let maxDays = 0
  let checkDate = new Date(startDate)

  // Check each day to see if it would violate Condition 8558
  while (checkDate <= visaEnd) {
    // Create a hypothetical trip from startDate to checkDate
    const hypotheticalTrip: Trip = {
      id: 'temp',
      entry: startDate.toISOString().split('T')[0],
      exit: checkDate.toISOString().split('T')[0],
    }

    const allTrips = [...trips, hypotheticalTrip]

    if (isViolation(checkDate, allTrips)) {
      break
    }

    maxDays++
    checkDate = addDays(checkDate, 1)
  }

  return maxDays
}

/**
 * Find the next valid entry date after a given date
 */
export function findNextValidEntryDate(
  fromDate: Date,
  trips: Trip[],
  visaEnd: Date
): Date | null {
  const maxCheckDays = 570 // Check up to 18 months + buffer
  let checkDate = addDays(fromDate, 1)

  for (let i = 0; i < maxCheckDays; i++) {
    // Check if beyond visa validity
    if (checkDate > visaEnd) {
      return null
    }

    // Calculate window usage for this date
    const daysUsed = getDaysInAustraliaForWindow(checkDate, trips)

    // If there's at least 1 day remaining in the window, it's valid
    if (daysUsed < MAX_DAYS_IN_WINDOW) {
      return checkDate
    }

    checkDate = addDays(checkDate, 1)
  }

  return null
}
