import { describe, it, expect } from 'vitest'
import {
  parseDate,
  formatDate,
  addDays,
  addMonths,
  daysBetween,
  formatDisplayDate,
  isSameDay,
  getMonthStart,
  getMonthEnd,
  getMonthsBetween,
  getDayOfWeekName,
  isDateInRange,
  getToday,
} from '../dateUtils'

describe('Date Utils', () => {
  describe('parseDate', () => {
    it('should correctly parse date string', () => {
      const date = parseDate('2024-07-04')
      expect(date.getFullYear()).toBe(2024)
      expect(date.getMonth()).toBe(6) // Month starts from 0
      expect(date.getDate()).toBe(4)
    })

    it('should parse date at midnight local time', () => {
      const date = parseDate('2024-07-04')
      expect(date.getHours()).toBe(0)
      expect(date.getMinutes()).toBe(0)
      expect(date.getSeconds()).toBe(0)
    })
  })

  describe('formatDate', () => {
    it('should correctly format date', () => {
      const date = new Date(2024, 6, 4) // 2024-07-04
      const formatted = formatDate(date)
      expect(formatted).toBe('2024-07-04')
    })

    it('should pad single digit month and day', () => {
      const date = new Date(2024, 0, 5) // 2024-01-05
      const formatted = formatDate(date)
      expect(formatted).toBe('2024-01-05')
    })
  })

  describe('formatDisplayDate', () => {
    it('should format date for display', () => {
      const date = new Date(2024, 6, 4)
      const formatted = formatDisplayDate(date)
      expect(formatted).toBe('2024年7月4日')
    })
  })

  describe('addDays', () => {
    it('should correctly add days', () => {
      const date = parseDate('2024-01-01')
      const newDate = addDays(date, 10)
      expect(formatDate(newDate)).toBe('2024-01-11')
    })

    it('should handle cross-month cases', () => {
      const date = parseDate('2024-01-25')
      const newDate = addDays(date, 10)
      expect(formatDate(newDate)).toBe('2024-02-04')
    })

    it('should handle negative days', () => {
      const date = parseDate('2024-01-15')
      const newDate = addDays(date, -10)
      expect(formatDate(newDate)).toBe('2024-01-05')
    })

    it('should handle leap year', () => {
      const date = parseDate('2024-02-28')
      const newDate = addDays(date, 1)
      expect(formatDate(newDate)).toBe('2024-02-29')
    })
  })

  describe('addMonths', () => {
    it('should correctly add months', () => {
      const date = parseDate('2024-01-15')
      const newDate = addMonths(date, 3)
      expect(newDate.getMonth()).toBe(3) // April (0-based)
    })

    it('should handle month-end overflow (31->29 in leap year)', () => {
      const date = parseDate('2024-01-31')
      const newDate = addMonths(date, 1)
      expect(formatDate(newDate)).toBe('2024-02-29')
    })

    it('should handle month-end overflow (31->28 in non-leap year)', () => {
      const date = parseDate('2023-01-31')
      const newDate = addMonths(date, 1)
      expect(formatDate(newDate)).toBe('2023-02-28')
    })

    it('should handle subtracting 18 months with month-end overflow', () => {
      const date = parseDate('2027-05-31')
      const newDate = addMonths(date, -18)
      expect(formatDate(newDate)).toBe('2025-11-30')
    })

    it('should handle cross-year month-end dates', () => {
      const date = parseDate('2024-03-31')
      const newDate = addMonths(date, -18)
      expect(formatDate(newDate)).toBe('2022-09-30')
    })
  })

  describe('daysBetween', () => {
    it('should correctly calculate days difference', () => {
      const date1 = parseDate('2024-01-01')
      const date2 = parseDate('2024-01-11')
      const days = daysBetween(date1, date2)
      expect(days).toBe(10)
    })

    it('should return 0 for same day', () => {
      const date1 = parseDate('2024-01-01')
      const date2 = parseDate('2024-01-01')
      const days = daysBetween(date1, date2)
      expect(days).toBe(0)
    })

    it('should handle negative differences', () => {
      const date1 = parseDate('2024-01-11')
      const date2 = parseDate('2024-01-01')
      const days = daysBetween(date1, date2)
      expect(days).toBe(-10)
    })
  })

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date(2024, 6, 4, 10, 30)
      const date2 = new Date(2024, 6, 4, 15, 45)
      expect(isSameDay(date1, date2)).toBe(true)
    })

    it('should return false for different days', () => {
      const date1 = new Date(2024, 6, 4)
      const date2 = new Date(2024, 6, 5)
      expect(isSameDay(date1, date2)).toBe(false)
    })
  })

  describe('getMonthStart', () => {
    it('should return first day of month', () => {
      const date = new Date(2024, 6, 15)
      const start = getMonthStart(date)
      expect(start.getDate()).toBe(1)
      expect(start.getMonth()).toBe(6)
    })
  })

  describe('getMonthEnd', () => {
    it('should return last day of month', () => {
      const date = new Date(2024, 6, 15) // July
      const end = getMonthEnd(date)
      expect(end.getDate()).toBe(31)
      expect(end.getMonth()).toBe(6)
    })

    it('should handle February in leap year', () => {
      const date = new Date(2024, 1, 15)
      const end = getMonthEnd(date)
      expect(end.getDate()).toBe(29)
    })

    it('should handle February in non-leap year', () => {
      const date = new Date(2023, 1, 15)
      const end = getMonthEnd(date)
      expect(end.getDate()).toBe(28)
    })
  })

  describe('getMonthsBetween', () => {
    it('should return all months between two dates', () => {
      const start = new Date(2024, 0, 15) // Jan 2024
      const end = new Date(2024, 2, 15) // Mar 2024
      const months = getMonthsBetween(start, end)
      expect(months.length).toBe(3)
      expect(months[0].getMonth()).toBe(0) // Jan
      expect(months[1].getMonth()).toBe(1) // Feb
      expect(months[2].getMonth()).toBe(2) // Mar
    })

    it('should return single month if same month', () => {
      const start = new Date(2024, 0, 1)
      const end = new Date(2024, 0, 31)
      const months = getMonthsBetween(start, end)
      expect(months.length).toBe(1)
    })
  })

  describe('getDayOfWeekName', () => {
    it('should return correct day names', () => {
      const sunday = new Date(2024, 6, 7) // Sunday
      expect(getDayOfWeekName(sunday)).toBe('日')

      const monday = new Date(2024, 6, 8) // Monday
      expect(getDayOfWeekName(monday)).toBe('一')
    })
  })

  describe('isDateInRange', () => {
    it('should return true if date is in range', () => {
      const date = new Date(2024, 6, 15)
      const start = new Date(2024, 6, 1)
      const end = new Date(2024, 6, 31)
      expect(isDateInRange(date, start, end)).toBe(true)
    })

    it('should return true for boundary dates', () => {
      const start = new Date(2024, 6, 1)
      const end = new Date(2024, 6, 31)
      expect(isDateInRange(start, start, end)).toBe(true)
      expect(isDateInRange(end, start, end)).toBe(true)
    })

    it('should return false if date is outside range', () => {
      const date = new Date(2024, 7, 1)
      const start = new Date(2024, 6, 1)
      const end = new Date(2024, 6, 31)
      expect(isDateInRange(date, start, end)).toBe(false)
    })
  })

  describe('getToday', () => {
    it('should return today at midnight', () => {
      const today = getToday()
      expect(today.getHours()).toBe(0)
      expect(today.getMinutes()).toBe(0)
      expect(today.getSeconds()).toBe(0)
    })
  })
})
