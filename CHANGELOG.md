# Changelog

## [Unreleased] - 2024-12-31

### Fixed
- 🐛 Fixed date format still showing Chinese in English interface
  - Updated `formatDisplayDate()` to support locale parameter
  - English format: "Jan 1, 2025"
  - Chinese format: "2025年1月1日"
- 🐛 Fixed month names in calendar not properly translated
  - English format: "January 2025"
  - Chinese format: "2025年1月"
- 📅 All date displays now respect the selected language
  - Statistics panel dates
  - Trip manager dates
  - Date modal dates
  - Calendar month headers

### Improved
- 🎨 **Major UI/UX Enhancement**
  - Optimized font stack for better Chinese/English display
  - Added language-specific font optimizations (`:lang(zh)` and `:lang(en)`)
  - Improved typography with better line-height and letter-spacing
- ✨ **Visual Design Upgrade**
  - Enhanced app header with gradient background and decorative effects
  - Upgraded language switcher with gradient button and glow animation
  - Added hover effects and transitions to all interactive elements
  - Improved form inputs with better focus states and shadows
  - Enhanced statistics panel with gradient cards and hover animations
  - Updated buttons with gradient backgrounds and lift effects
- 🎯 **Better Visual Hierarchy**
  - Increased border radius for modern look (8px → 12px)
  - Enhanced shadows for better depth perception
  - Added decorative elements and icons
  - Improved color contrast and readability
- 📱 **Responsive Design**
  - Optimized mobile experience
  - Better touch targets
  - Adaptive font sizes and spacing

### Added
- 🌐 Multi-language support with i18next and react-i18next
  - Default language: English (en)
  - Added Chinese (Simplified) support (zh)
  - Language switcher component in top-right corner
  - Language preference saved to localStorage
  - Automatic language detection on startup
- 📝 Comprehensive translation files for all UI elements
  - App header and footer
  - Visa setup section
  - Trip management section
  - Statistics panel
  - Calendar and date modal
  - Form labels and buttons
  - Error messages and alerts
- 📚 I18N.md documentation for multi-language feature
- 🎨 Styled language switcher button with hover effects

### Changed
- Updated README.md to include multi-language support in features
- Updated project structure in README.md to include i18n folder
- Added i18next packages to dependencies in package.json
- Modified all React components to use translation hooks
- Updated main.tsx to initialize i18n on app startup

### Technical Details
- Used `useTranslation()` hook from react-i18next in all components
- Translation keys organized in hierarchical JSON structure
- Support for dynamic text interpolation (e.g., displaying counts)
- HTML content support for formatted text (dangerouslySetInnerHTML)
- Weekday names and common terms in separate translation section

### Files Changed
- Added: `src/i18n/config.ts` - i18n configuration
- Added: `src/i18n/locales/en.json` - English translations
- Added: `src/i18n/locales/zh.json` - Chinese translations
- Added: `src/components/LanguageSwitcher.tsx` - Language switcher component
- Added: `src/components/LanguageSwitcher.css` - Language switcher styles
- Modified: `src/main.tsx` - Initialize i18n
- Modified: `src/App.tsx` - Add translations and language switcher
- Modified: `src/components/VisaSetup.tsx` - Add translations
- Modified: `src/components/TripManager.tsx` - Add translations
- Modified: `src/components/StatsPanel.tsx` - Add translations
- Modified: `src/components/Calendar/Calendar.tsx` - Add translations
- Modified: `src/components/Calendar/DateModal.tsx` - Add translations
- Modified: `src/components/Calendar/MonthBlock.tsx` - Add translations
- Modified: `package.json` - Add i18next dependencies
- Modified: `README.md` - Update documentation
- Modified: `eslint.config.js` - Ignore coverage directory
- Added: `I18N.md` - Multi-language feature documentation

### Tested
- ✅ All existing tests passing (58 tests)
- ✅ Production build successful
- ✅ ESLint checks passing
- ✅ Language switching works correctly
- ✅ Language preference persists across sessions
- ✅ All UI elements properly translated

