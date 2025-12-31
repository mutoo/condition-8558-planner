# Condition 8558 Calculator

A modern Australian visa Condition 8558 trip planning tool built with React + TypeScript + Vite.

## Features

### 1. Multi-language Support
- Default language: English
- Supported languages: English (en) and Chinese (zh)
- Easy language switching via top-right button
- Language preference saved to localStorage

### 2. Visa Setup
- Input visa start date
- Select visa validity period: 18 months, 3 years, 5 years, 10 years, or custom
- Automatically calculate visa end date

### 2. Visa Setup
- Add, edit, and delete entry/exit trips
- Automatic trip validation
- Detect trip overlaps
- Real-time Condition 8558 compliance checking

### 3. Trip Management
- Display visa validity period
- Count of planned trips
- Total days in Australia
- Violation days statistics
- Earliest entry and latest exit dates

### 4. Statistics
- Auto-save to localStorage
- Data persists after page refresh
- One-click clear all data

### 5. Data Persistence

Condition 8558 is a common restriction on Australian visas:
- Within any continuous **18-month** (548 days) period
- The holder must not stay in Australia for more than **12 months** (365 days)
- This is a **sliding window** calculation, measured in days

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript 5.6
- **Build Tool**: Vite 6
- **Package Manager**: pnpm
- **Internationalization**: i18next + react-i18next
- **Code Quality**: ESLint + Prettier
- **Testing**: Vitest + Testing Library

## Project Structure

```
src/
├── components/         # React components
│   ├── Calendar/           # Calendar-related components
│   │   ├── Calendar.tsx
│   │   ├── MonthBlock.tsx
│   │   └── DateModal.tsx
│   ├── LanguageSwitcher.tsx # Language switcher component
│   ├── VisaSetup.tsx       # Visa setup component
│   ├── TripManager.tsx     # Trip management component
│   └── StatsPanel.tsx      # Statistics panel component
├── hooks/             # Custom hooks
│   └── useAppState.ts      # Application state management
├── i18n/              # Internationalization
│   ├── config.ts           # i18n configuration
│   └── locales/            # Translation files
│       ├── en.json         # English translations
│       └── zh.json         # Chinese translations
├── utils/             # Utility functions
│   ├── dateUtils.ts        # Date manipulation utilities
│   ├── validator.ts        # Condition 8558 validation logic
│   ├── tripUtils.ts        # Trip-related utilities
│   └── storage.ts          # Local storage management
├── types/             # TypeScript type definitions
│   └── index.ts
├── styles/            # Global styles
│   ├── index.css
│   └── App.css
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Development

### Install Dependencies

```bash
pnpm install
```

### Start Development Server

```bash
pnpm dev
```

The application will run at `http://localhost:5173`

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

### Code Quality Checks

```bash
# Run ESLint
pnpm lint

# Auto-fix ESLint issues
pnpm lint:fix

# Format code
pnpm format

# Check code formatting
pnpm format:check
```

### Testing

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## Core Algorithm

### Sliding Window Calculation

```typescript
// 18 months = 548 days
const WINDOW_DAYS = 548

// 12 months = 365 days
const MAX_DAYS_IN_WINDOW = 365

function getDaysInAustraliaForWindow(date: Date, trips: Trip[]): number {
  const windowStart = addDays(date, -WINDOW_DAYS)
  const windowEnd = date
  
  let daysInAustralia = 0
  
  trips.forEach(trip => {
    const overlapStart = Math.max(tripStart, windowStart)
    const overlapEnd = Math.min(tripEnd, windowEnd)
    
    if (overlapStart <= overlapEnd) {
      // Both entry and exit days count, so +1
      daysInAustralia += daysBetween(overlapStart, overlapEnd) + 1
    }
  })
  
  return daysInAustralia
}
```

### Trip Validation

1. Check if date range is valid (exit date must be after or equal to entry date)
2. Check if within visa validity period
3. Check for overlaps with existing trips
4. Check if any day during the trip violates Condition 8558

## Proof of Concept

The original PoC code is preserved in the `poc/` directory, including:
- Original HTML/CSS/JavaScript implementation
- Complete calendar visualization
- Test cases

## Future Plans

- [x] Add unit tests ✅ **Completed**
- [ ] Support exporting trip plans (PDF/Excel)
- [ ] Add multi-language support (English, Chinese)
- [ ] Add end-to-end tests
- [ ] Optimize mobile experience

## Contributing

Issues and Pull Requests are welcome!

## License

MIT

## Disclaimer

This tool is for reference only. Please refer to official Australian immigration documents for specific visa conditions.
