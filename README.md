# Condition 8558 Planner

[![Built with Cursor](https://img.shields.io/badge/Built_with-Cursor-black?style=flat&logo=cursor&logoColor=white)](https://cursor.sh)
[![Vibe Coding](https://img.shields.io/badge/Vibe-Coding-7c3aed?style=flat&logo=sparkles&logoColor=white)](https://github.com/features/copilot)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)](LICENSE)

A modern, professional Australian visa Condition 8558 trip planning tool built with React + TypeScript + Vite.

🔗 **Live Demo**: [condition-8558-planner](https://condition-8558.mutoo.im)

## ✨ Features

### 🌐 Multi-language Support
- **Default language**: English
- **Supported languages**: English (en) and Chinese (zh)
- Easy language switching via top-right button
- Language preference saved to localStorage
- Localized date formats and validation messages

### 📅 Visa Setup
- Input visa start date with validation
- Select visa validity period: 18 months, 3 years, 5 years, 10 years, or custom
- Automatically calculate visa end date
- Duration selection with radio buttons
- Clear all data functionality with confirmation

### ✈️ Trip Management
- Add, edit, and delete entry/exit trips
- Automatic trip validation against Condition 8558
- Detect trip overlaps and date conflicts
- Real-time compliance checking
- Calculate maximum consecutive stay
- Click trip dates to navigate to calendar view
- Visual status indicators (valid/invalid trips)

### 📊 Statistics Dashboard
- Display visa validity period
- Count of planned trips
- Total days spent in Australia
- Violation days statistics with warnings
- Earliest entry and latest exit dates
- Real-time updates as trips change

### 📆 Interactive Calendar
- Visual representation of all planned trips
- 18-month sliding window visualization
- Color-coded days:
  - 🟢 In Australia
  - ⚪ Out of Australia
  - 🔴 Window full (cannot enter)
  - ⚠️ Violation days
  - ⚫ Outside visa period
- Click any date to see detailed window usage
- Sticky trip manager for easy access
- Responsive design for mobile devices

### 💾 Data Persistence
- Auto-save to localStorage
- Data persists after page refresh
- One-click clear all data with confirmation
- Safe data management

### 📢 Google AdSense Integration
- Two strategically placed ad slots
- Environment variable configuration
- Development mode with placeholders
- Responsive ad sizes for all devices

### 📈 Google Analytics
- Comprehensive event tracking
- User behavior analytics
- Custom event tracking for key actions
- Privacy-friendly (disabled in development)
- GDPR considerations documented

### 🎨 Modern UI/UX
- Professional blue theme
- Clean, flat design
- Responsive layout optimized for mobile
- Custom scrollbars
- Smooth animations and transitions
- lucide-react icons throughout
- Optimized spacing and typography

## 📖 What is Condition 8558?

Condition 8558 is a common restriction on Australian visas:
- Within any continuous **18-month** (548 days) period
- The holder must not stay in Australia for more than **12 months** (365 days)
- This is a **sliding window** calculation, measured in days
- Both entry and exit days count toward time in Australia

⚠️ **Important**: The Australian Department of Home Affairs does not provide strict mathematical definitions for "18 months" and "12 months", allowing immigration judges greater discretion. This application uses 365 days for 12 months and 548 days for 18 months for calculation purposes.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript 5.6
- **Build Tool**: Vite 6
- **Package Manager**: pnpm
- **Internationalization**: i18next + react-i18next
- **Icons**: lucide-react
- **Code Quality**: ESLint + Prettier
- **Testing**: Vitest + Testing Library
- **Analytics**: Google Analytics 4
- **Monetization**: Google AdSense

## 📁 Project Structure

```
src/
├── components/              # React components
│   ├── Calendar/           # Calendar-related components
│   │   ├── Calendar.tsx    # Main calendar component
│   │   ├── MonthBlock.tsx  # Individual month display
│   │   ├── DateModal.tsx   # Date details modal
│   │   └── index.ts        # Calendar exports
│   ├── AdSlot.tsx          # Google AdSense ad component
│   ├── GoogleAnalytics.tsx # Google Analytics integration
│   ├── LanguageSwitcher.tsx # Language switcher component
│   ├── VisaSetup.tsx       # Visa setup component
│   ├── TripManager.tsx     # Trip management component
│   └── StatsPanel.tsx      # Statistics panel component
├── hooks/                  # Custom hooks
│   └── useAppState.ts      # Application state management
├── i18n/                   # Internationalization
│   ├── config.ts           # i18n configuration
│   └── locales/            # Translation files
│       ├── en.json         # English translations
│       └── zh.json         # Chinese translations
├── utils/                  # Utility functions
│   ├── dateUtils.ts        # Date manipulation utilities
│   ├── validator.ts        # Condition 8558 validation logic
│   ├── calculator.ts       # Sliding window calculations
│   ├── tripUtils.ts        # Trip-related utilities
│   └── storage.ts          # Local storage management
├── types/                  # TypeScript type definitions
│   └── index.ts
├── styles/                 # Global styles
│   ├── index.css           # Global CSS with theme
│   └── App.css             # Main app styles
├── App.tsx                 # Main application component
└── main.tsx                # Application entry point
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mutoo/condition-8558-planner.git
cd condition-8558-planner
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables (Optional)**

For Google AdSense and Analytics:
```bash
cp .env.sample .env
# Edit .env and add your IDs
```

4. **Start development server**
```bash
pnpm dev
```

Visit `http://localhost:5173` to see the app running.

## 🔧 Development

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

## 🔐 Environment Variables

Create a `.env` file based on `.env.sample`:

```bash
# Google AdSense Configuration
VITE_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
VITE_ADSENSE_PRIMARY_SLOT=1234567890
VITE_ADSENSE_SECONDARY_SLOT=0987654321

# Google Analytics Configuration
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

See [ADSENSE_SETUP.md](./ADSENSE_SETUP.md) and [GOOGLE_ANALYTICS.md](./GOOGLE_ANALYTICS.md) for detailed setup instructions.

## 🚀 Deployment

### Deploy to GitHub Pages

This project includes a GitHub Actions workflow for automatic deployment to GitHub Pages.

#### Setup GitHub Pages

1. Go to your repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. (Optional) Add environment secrets in **Settings** → **Secrets and variables** → **Actions**:
   - `VITE_ADSENSE_CLIENT_ID`
   - `VITE_ADSENSE_PRIMARY_SLOT`
   - `VITE_ADSENSE_SECONDARY_SLOT`
   - `VITE_GA_MEASUREMENT_ID`

#### Manual Deployment

1. Go to **Actions** tab in your GitHub repository
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

The site will be deployed to `https://<username>.github.io/<repository>/`

#### Automatic Deployment (Optional)

To enable automatic deployment on push to main branch, uncomment these lines in `.github/workflows/deploy.yml`:

```yaml
push:
  branches:
    - main
```


## 🧮 Core Algorithm

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

The validator checks each trip against the following rules:

1. **Date Range Validity**: Exit date must be on or after entry date
2. **Visa Period Check**: Trip must be within visa validity period
3. **Overlap Detection**: No overlapping with existing trips
4. **Condition 8558 Compliance**: No day during the trip violates the 12/18 month rule

### Maximum Stay Calculation

The app can calculate the maximum consecutive days you can stay starting from any entry date:

```typescript
function calculateMaxConsecutiveStay(
  entryDate: Date,
  existingTrips: Trip[],
  visaEnd: Date
): number {
  // Binary search for the maximum valid exit date
  // considering the 18-month sliding window
}
```

## 📚 Documentation

- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Deployment guide for GitHub Pages
- **[I18N.md](./docs/I18N.md)** - Multi-language implementation guide
- **[ADSENSE_SETUP.md](./docs/ADSENSE_SETUP.md)** - Google AdSense integration guide
- **[GOOGLE_ANALYTICS.md](./docs/GOOGLE_ANALYTICS.md)** - Google Analytics setup guide
- **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** - Development guide
- **[TESTING.md](./TESTING.md)** - Testing guide

## 🎯 Roadmap

### Completed ✅
- [x] Multi-language support (English, Chinese)
- [x] Unit tests with Vitest
- [x] Google AdSense integration
- [x] Google Analytics tracking
- [x] Mobile responsive design
- [x] Interactive calendar visualization
- [x] Trip validation and max stay calculation
- [x] Data persistence with localStorage
- [x] Professional UI/UX with blue theme

### Planned 📋
- [ ] Export trip plans (PDF/Excel/iCal)
- [ ] End-to-end tests with Playwright
- [ ] PWA support (offline functionality)
- [ ] Share trip plans via URL
- [ ] Support for other visa conditions
- [ ] Dark mode
- [ ] Email notifications for upcoming trips

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details

## ⚠️ Disclaimer

**This tool is for reference and planning purposes only.**

- The Australian Department of Home Affairs does not provide strict mathematical definitions for "18 months" and "12 months"
- This application uses 365 days for 12 months and 548 days for 18 months
- Both entry and exit days are counted as time in Australia
- Immigration judges have discretionary power in interpreting visa conditions
- Always consult official Australian immigration documents and professional migration agents for definitive advice
- The developers are not responsible for any decisions made based on this tool

For official information, visit:
- [Department of Home Affairs](https://immi.homeaffairs.gov.au/)
- [Visa Conditions](https://immi.homeaffairs.gov.au/visas/already-have-a-visa/check-visa-details-and-conditions)

## 🙏 Acknowledgments

- React and Vite teams for excellent development tools
- i18next for internationalization support
- lucide-react for beautiful icons
- The open-source community

## 📞 Support

If you find this tool helpful, please ⭐ star the repository!

For issues and questions:
- Open an issue on [GitHub Issues](https://github.com/mutoo/condition-8558-planner/issues)
- Check existing documentation in the `docs/` folder

---

Made with ❤️ for the Australian visa community
