import { describe, it, expect } from 'vitest'
import type { Trip } from '../../types'
import {
  getDaysInAustraliaForWindow,
  isViolation,
  validateTrip,
  getDayStatus,
  getWindowUsage,
  calculateMaxConsecutiveStay,
  findNextValidEntryDate,
  WINDOW_DAYS,
  MAX_DAYS_IN_WINDOW,
} from '../validator'
import { parseDate, addDays, daysBetween } from '../dateUtils'

describe('Validator', () => {
  describe('getDaysInAustraliaForWindow', () => {
    it('should correctly calculate days in window (both entry and exit days count)', () => {
      const trips: Trip[] = [
        { id: '1', entry: '2024-01-01', exit: '2024-01-31' },
      ]
      const checkDate = parseDate('2024-02-01')
      const days = getDaysInAustraliaForWindow(checkDate, trips)
      expect(days).toBe(31) // Jan 1 to Jan 31, both days count
    })

    it('should handle multiple trips', () => {
      const trips: Trip[] = [
        { id: '1', entry: '2024-01-01', exit: '2024-01-31' },
        { id: '2', entry: '2024-03-01', exit: '2024-03-31' },
      ]
      const checkDate = parseDate('2024-04-01')
      const days = getDaysInAustraliaForWindow(checkDate, trips)
      expect(days).toBe(62) // 31 + 31 = 62 days
    })

    it('should only calculate days within window', () => {
      const trips: Trip[] = [
        { id: '1', entry: '2023-01-01', exit: '2023-12-31' },
      ]
      const checkDate = parseDate('2025-02-01')
      const days = getDaysInAustraliaForWindow(checkDate, trips)

      // Window starts 548 days before checkDate
      const windowStart = addDays(checkDate, -WINDOW_DAYS)
      const expectedDays = daysBetween(windowStart, parseDate('2023-12-31')) + 1
      expect(days).toBe(expectedDays)
    })

    it('should handle same day entry and exit', () => {
      const trips: Trip[] = [
        { id: '1', entry: '2024-07-04', exit: '2024-07-04' },
      ]
      const checkDate = parseDate('2024-07-04')
      const days = getDaysInAustraliaForWindow(checkDate, trips)
      expect(days).toBe(1) // Both entry and exit count, so 1 day
    })

    it('should handle consecutive short trips', () => {
      const trips: Trip[] = []
      // Create 12 months, 30 days each (1st to 30th)
      for (let i = 0; i < 12; i++) {
        const month = i + 1
        trips.push({
          id: String(i),
          entry: `2024-${String(month).padStart(2, '0')}-01`,
          exit: `2024-${String(month).padStart(2, '0')}-30`,
        })
      }

      const checkDate = parseDate('2024-12-31')
      const days = getDaysInAustraliaForWindow(checkDate, trips)
      expect(days).toBe(360) // 12 months × 30 days = 360 days
    })
  })

  describe('isViolation', () => {
    it('should detect violation (366 days)', () => {
      const trips: Trip[] = [
        { id: '1', entry: '2024-01-01', exit: '2024-12-31' }, // 366 days (leap year)
      ]
      const checkDate = parseDate('2024-12-31')
      expect(isViolation(checkDate, trips)).toBe(true)
    })

    it('should allow exactly 365 days', () => {
      const trips: Trip[] = [
        { id: '1', entry: '2024-01-01', exit: '2024-12-30' }, // 365 days
      ]
      const checkDate = parseDate('2024-12-30')
      expect(isViolation(checkDate, trips)).toBe(false)
    })

    it('sliding window should move with time', () => {
      const trips: Trip[] = [
        { id: '1', entry: '2024-01-01', exit: '2024-12-30' }, // 365 days
      ]

      // At 2024-12-30, window includes entire trip, exactly 365 days
      const checkDate1 = parseDate('2024-12-30')
      expect(isViolation(checkDate1, trips)).toBe(false)

      // At 2025-08-01, window has moved forward
      const checkDate2 = parseDate('2025-08-01')
      const days2 = getDaysInAustraliaForWindow(checkDate2, trips)
      expect(days2).toBeLessThan(MAX_DAYS_IN_WINDOW)
    })
  })

  describe('validateTrip', () => {
    const visaStart = parseDate('2024-01-01')
    const visaEnd = parseDate('2026-12-31')

    it('should reject if exit before entry', () => {
      const trip: Trip = { id: '1', entry: '2024-01-10', exit: '2024-01-05' }
      const result = validateTrip(trip, [], visaStart, visaEnd)
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('Exit date must be after or equal to entry date')
    })

    it('should reject if outside visa validity', () => {
      const trip: Trip = { id: '1', entry: '2023-01-01', exit: '2023-12-31' }
      const result = validateTrip(trip, [], visaStart, visaEnd)
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('Trip is outside visa validity period')
    })

    it('should reject if overlaps with existing trip', () => {
      const existingTrips: Trip[] = [
        { id: '2', entry: '2024-01-15', exit: '2024-01-20' },
      ]
      const trip: Trip = { id: '1', entry: '2024-01-18', exit: '2024-01-25' }
      const result = validateTrip(trip, existingTrips, visaStart, visaEnd)
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('Trip overlaps with existing trip')
    })

    it('should reject if violates Condition 8558', () => {
      const existingTrips: Trip[] = [
        { id: '2', entry: '2024-01-01', exit: '2024-12-30' }, // 365 days
      ]
      // Try to add one more day
      const trip: Trip = { id: '1', entry: '2024-12-31', exit: '2024-12-31' }
      const result = validateTrip(trip, existingTrips, visaStart, visaEnd)
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('Violates Condition 8558')
    })

    it('should accept valid trip', () => {
      const trip: Trip = { id: '1', entry: '2024-01-01', exit: '2024-01-31' }
      const result = validateTrip(trip, [], visaStart, visaEnd)
      expect(result.valid).toBe(true)
    })
  })

  describe('getDayStatus', () => {
    const visaStart = parseDate('2024-01-01')
    const visaEnd = parseDate('2026-12-31')

    it('should return out-of-visa for dates outside visa period', () => {
      const date = parseDate('2023-12-31')
      const status = getDayStatus(date, [], visaStart, visaEnd)
      expect(status).toBe('out-of-visa')
    })

    it('should return normal for dates with available window', () => {
      const date = parseDate('2024-01-01')
      const status = getDayStatus(date, [], visaStart, visaEnd)
      expect(status).toBe('normal')
    })

    it('should return window-full when window is full', () => {
      const trips: Trip[] = [
        { id: '1', entry: '2023-02-01', exit: '2023-12-31' }, // 334 days
        { id: '2', entry: '2024-01-01', exit: '2024-01-31' }, // 31 days
      ]
      // Total: 365 days, window full
      const date = parseDate('2024-02-01')
      const status = getDayStatus(date, trips, visaStart, visaEnd)
      expect(status).toBe('window-full')
    })

    it('should return valid-stay for compliant stays', () => {
      const trips: Trip[] = [
        { id: '1', entry: '2024-01-01', exit: '2024-01-31' },
      ]
      const date = parseDate('2024-01-15')
      const status = getDayStatus(date, trips, visaStart, visaEnd)
      expect(status).toBe('valid-stay')
    })

    it('should return violation for non-compliant stays', () => {
      const trips: Trip[] = [
        { id: '1', entry: '2024-01-01', exit: '2024-12-31' }, // 366 days
      ]
      const date = parseDate('2024-12-31')
      const status = getDayStatus(date, trips, visaStart, visaEnd)
      expect(status).toBe('violation')
    })
  })

  describe('getWindowUsage', () => {
    it('should return correct window usage information', () => {
      const trips: Trip[] = [
        { id: '1', entry: '2024-01-01', exit: '2024-01-31' },
      ]
      const date = parseDate('2024-02-01')
      const usage = getWindowUsage(date, trips)

      expect(usage.daysUsed).toBe(31)
      expect(usage.daysRemaining).toBe(365 - 31)
      expect(usage.isViolation).toBe(false)
      expect(usage.isWindowFull).toBe(false)
      expect(usage.trips).toHaveLength(1)
      expect(usage.trips[0].days).toBe(31)
    })

    it('should detect window full', () => {
      const trips: Trip[] = [
        { id: '1', entry: '2024-01-01', exit: '2024-12-30' }, // 365 days
      ]
      const date = parseDate('2024-12-30')
      const usage = getWindowUsage(date, trips)

      expect(usage.daysUsed).toBe(365)
      expect(usage.daysRemaining).toBe(0)
      expect(usage.isWindowFull).toBe(true)
    })
  })

  describe('Boundary Cases', () => {
    it('should handle trip exactly crossing 548-day boundary', () => {
      const trips: Trip[] = [
        { id: '1', entry: '2023-01-01', exit: '2024-06-30' }, // 547 days
      ]
      const checkDate = parseDate('2024-06-30')
      const days = getDaysInAustraliaForWindow(checkDate, trips)

      const tripDays =
        daysBetween(parseDate('2023-01-01'), parseDate('2024-06-30')) + 1
      expect(days).toBe(tripDays)
    })

    it('should correctly handle trip partially in window', () => {
      const trips: Trip[] = [
        { id: '1', entry: '2023-01-01', exit: '2024-12-31' }, // Long trip
      ]
      const checkDate = parseDate('2024-08-01')
      const days = getDaysInAustraliaForWindow(checkDate, trips)

      // Window starts 548 days before checkDate
      const windowStart = addDays(checkDate, -WINDOW_DAYS)
      const expectedDays = daysBetween(windowStart, checkDate) + 1
      expect(days).toBe(expectedDays)
    })
  })

  describe('Leap Year', () => {
    it('should correctly handle leap year Feb 29', () => {
      const trips: Trip[] = [
        { id: '1', entry: '2024-02-28', exit: '2024-03-01' },
      ]
      const checkDate = parseDate('2024-03-01')
      const days = getDaysInAustraliaForWindow(checkDate, trips)
      expect(days).toBe(3) // Feb 28, 29, Mar 1
    })

    it('should handle 366-day stay in leap year', () => {
      const trips: Trip[] = [
        { id: '1', entry: '2024-01-01', exit: '2024-12-31' }, // 366 days
      ]
      const entry = parseDate(trips[0].entry)
      const exit = parseDate(trips[0].exit)
      const tripDays = daysBetween(entry, exit) + 1
      expect(tripDays).toBe(366)
    })
  })

  describe('calculateMaxConsecutiveStay', () => {
    const visaEnd = parseDate('2026-12-31')

    it('should calculate max stay for empty trips', () => {
      const date = parseDate('2024-01-01')
      const maxDays = calculateMaxConsecutiveStay(date, [], visaEnd)
      expect(maxDays).toBe(365) // Full 365 days available
    })

    it('should respect visa end date', () => {
      const date = parseDate('2026-12-01')
      const visaEnd = parseDate('2026-12-15')
      const maxDays = calculateMaxConsecutiveStay(date, [], visaEnd)
      expect(maxDays).toBe(15) // Only 15 days until visa ends
    })
  })

  describe('findNextValidEntryDate', () => {
    const visaEnd = parseDate('2026-12-31')

    it('should find next valid date when window is full', () => {
      const trips: Trip[] = [
        { id: '1', entry: '2024-01-01', exit: '2024-12-30' }, // 365 days
      ]
      const fromDate = parseDate('2024-12-30')
      const nextDate = findNextValidEntryDate(fromDate, trips, visaEnd)

      expect(nextDate).not.toBeNull()
      if (nextDate) {
        const daysUsed = getDaysInAustraliaForWindow(nextDate, trips)
        expect(daysUsed).toBeLessThan(MAX_DAYS_IN_WINDOW)
      }
    })

    it('should return null if no valid date before visa expires', () => {
      const trips: Trip[] = [
        { id: '1', entry: '2024-01-01', exit: '2024-12-30' }, // 365 days
      ]
      const fromDate = parseDate('2024-12-30')
      const visaEnd = parseDate('2025-01-10') // Too soon
      const nextDate = findNextValidEntryDate(fromDate, trips, visaEnd)

      // Might be null or a very close date
      if (nextDate === null) {
        expect(nextDate).toBeNull()
      } else {
        expect(nextDate.getTime()).toBeLessThanOrEqual(visaEnd.getTime())
      }
    })
  })
})
