/**
 * Date utility functions for Condition 8558 calculator
 */

/**
 * Parse a date string (YYYY-MM-DD) to Date object at midnight local time
 */
export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Format a Date object to YYYY-MM-DD string
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Format a Date object for display
 * Note: For i18n support, use formatDisplayDateI18n instead
 * This function is kept for backward compatibility
 */
export function formatDisplayDate(date: Date, locale?: string): string {
  if (locale === 'en') {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }
  // Default to Chinese format
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Add months to a date, handling month-end overflow correctly
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  const targetMonth = result.getMonth() + months
  result.setMonth(targetMonth)

  // Handle month-end overflow (e.g., Jan 31 + 1 month = Feb 28/29)
  // If we've overshot, move back to the last day of the target month
  if (months > 0) {
    // Adding months forward
    const expectedMonth = (((date.getMonth() + months) % 12) + 12) % 12
    if (result.getMonth() !== expectedMonth) {
      result.setDate(0) // Set to last day of previous month
    }
  } else if (months < 0) {
    // Subtracting months backward
    const expectedMonth = (((date.getMonth() + months) % 12) + 12) % 12
    if (result.getMonth() !== expectedMonth) {
      result.setDate(0) // Set to last day of previous month
    }
  }

  return result
}

/**
 * Calculate days between two dates (inclusive on both ends)
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.round((date2.getTime() - date1.getTime()) / oneDay)
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Get the first day of a month
 */
export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/**
 * Get the last day of a month
 */
export function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

/**
 * Get all months between two dates (inclusive)
 */
export function getMonthsBetween(startDate: Date, endDate: Date): Date[] {
  const months: Date[] = []
  let current = getMonthStart(startDate)
  const end = getMonthStart(endDate)

  while (current <= end) {
    months.push(new Date(current))
    current = addMonths(current, 1)
  }

  return months
}

/**
 * Get day of week name in Chinese
 */
export function getDayOfWeekName(date: Date): string {
  const days = ['日', '一', '二', '三', '四', '五', '六']
  return days[date.getDay()]
}

/**
 * Check if a date is within a range (inclusive)
 */
export function isDateInRange(
  date: Date,
  rangeStart: Date,
  rangeEnd: Date
): boolean {
  return date >= rangeStart && date <= rangeEnd
}

/**
 * Get today's date at midnight
 */
export function getToday(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}
