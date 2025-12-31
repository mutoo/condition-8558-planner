import type { Trip, TripStatistics } from '../types'
import { parseDate, daysBetween } from './dateUtils'
import { getDayStatus } from './validator'

/**
 * Calculate statistics for all trips
 */
export function calculateStatistics(
  trips: Trip[],
  visaStart: Date,
  visaEnd: Date
): TripStatistics {
  if (trips.length === 0) {
    return {
      totalTrips: 0,
      totalDaysInAustralia: 0,
      violationDays: 0,
      earliestEntry: null,
      latestExit: null,
    }
  }

  let totalDaysInAustralia = 0
  let violationDays = 0
  let earliestEntry: string | null = null
  let latestExit: string | null = null

  trips.forEach(trip => {
    const entry = parseDate(trip.entry)
    const exit = parseDate(trip.exit)
    const tripDays = daysBetween(entry, exit) + 1 // Include both entry and exit days

    totalDaysInAustralia += tripDays

    // Track earliest and latest dates
    if (!earliestEntry || trip.entry < earliestEntry) {
      earliestEntry = trip.entry
    }
    if (!latestExit || trip.exit > latestExit) {
      latestExit = trip.exit
    }

    // Count violation days
    const currentDate = new Date(entry)
    while (currentDate <= exit) {
      const status = getDayStatus(currentDate, trips, visaStart, visaEnd)
      if (status === 'violation') {
        violationDays++
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }
  })

  return {
    totalTrips: trips.length,
    totalDaysInAustralia,
    violationDays,
    earliestEntry,
    latestExit,
  }
}

/**
 * Generate a unique ID for a trip
 */
export function generateTripId(): string {
  return `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Sort trips by entry date
 */
export function sortTrips(trips: Trip[]): Trip[] {
  return [...trips].sort((a, b) => a.entry.localeCompare(b.entry))
}
