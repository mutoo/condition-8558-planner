# Google Analytics Integration Guide

## 📊 Overview

This application includes Google Analytics integration to track user behavior, page views, and custom events. The configuration is managed through environment variables for security and flexibility.

## 🔧 Configuration Steps

### Step 1: Create Google Analytics Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property or use an existing one
3. Get your **Measurement ID** (format: `G-XXXXXXXXXX` for GA4 or `UA-XXXXXXXXX-X` for Universal Analytics)

### Step 2: Configure Environment Variables

1. Copy `.env.sample` to `.env` if you haven't already:
```bash
cp .env.sample .env
```

2. Add your Google Analytics Measurement ID to `.env`:
```bash
# Google Analytics Configuration
VITE_GA_MEASUREMENT_ID=G-ABC123XYZ
```

### Step 3: Restart Development Server

After modifying `.env`, restart the development server:
```bash
pnpm run dev
```

## 🎯 Features

### Automatic Page View Tracking
The application automatically tracks page views when users navigate through the app.

### Custom Event Tracking
You can track custom events using the provided utility functions:

```typescript
import { trackEvent } from './components/GoogleAnalytics'

// Track a custom event
trackEvent('trip_added', {
  entry_date: '2024-01-01',
  exit_date: '2024-01-31',
  days: 31
})
```

### Available Tracking Functions

#### 1. `trackEvent(eventName, eventParams)`
Track custom events with optional parameters.

**Example:**
```typescript
trackEvent('visa_setup_completed', {
  duration: '18 months',
  start_date: '2024-01-01'
})
```

#### 2. `trackPageView(pagePath, pageTitle)`
Manually track page views (usually automatic).

**Example:**
```typescript
trackPageView('/calendar', 'Calendar View')
```

#### 3. `setUserProperties(properties)`
Set user-level properties for analytics.

**Example:**
```typescript
setUserProperties({
  language: 'en',
  visa_type: '8558'
})
```

## 🔍 Tracked Events

The application automatically tracks the following key events:

### User Actions
- **Visa Setup**
  - `visa_setup_started`: When user begins visa setup
  - `visa_setup_completed`: When visa dates are configured
  - `data_cleared`: When user clears all data

- **Trip Management**
  - `trip_added`: When a new trip is added
  - `trip_updated`: When a trip is edited
  - `trip_deleted`: When a trip is removed
  - `max_stay_calculated`: When user calculates max consecutive stay

- **Language**
  - `language_changed`: When user switches language

- **Calendar Interaction**
  - `date_clicked`: When user clicks a date in calendar
  - `calendar_scrolled`: When user navigates to specific month

## 🧪 Development Environment

In **development mode**, Google Analytics is **disabled** to avoid polluting your analytics data with test traffic.

You'll see console logs instead:
```
[GA] Development mode - Analytics disabled
```

In **production**, Google Analytics will load and track normally (if configured):
```
[GA] Initialized: G-ABC123XYZ
[GA] Event tracked: trip_added { days: 31 }
```

## 📱 Privacy Considerations

### Data Collection

Google Analytics collects:
- **Anonymous usage data**: Page views, interactions
- **Device information**: Browser, OS, screen size
- **Geographic data**: Country, region (IP-based)
- **User behavior**: Click patterns, session duration

### GDPR Compliance

If your users are in the EU, consider:

1. **Cookie Consent**
   - Add a cookie consent banner
   - Only load GA after user consent

2. **Privacy Policy**
   - Disclose GA usage
   - Explain what data is collected
   - Provide opt-out options

3. **IP Anonymization** (GA4 does this by default)

### Opt-Out

Users can opt-out by:
- Installing [Google Analytics Opt-out Browser Add-on](https://tools.google.com/dlpage/gaoptout)
- Using browser privacy extensions

## 🚀 Production Deployment

### Vercel
Set environment variable in Vercel Dashboard:
```bash
VITE_GA_MEASUREMENT_ID=G-ABC123XYZ
```

### Netlify
Set environment variable in Netlify Dashboard:
```bash
VITE_GA_MEASUREMENT_ID=G-ABC123XYZ
```

### Other Platforms
Add the environment variable through your platform's configuration interface.

## 📊 Viewing Analytics Data

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. View reports:
   - **Real-time**: See current users
   - **Events**: View custom event tracking
   - **Pages**: See most visited pages
   - **Demographics**: User location, device, etc.

## 🔍 Debugging

### Check if GA is Loaded

Open browser console:
```javascript
// Check if gtag is available
console.log(window.gtag)

// Check dataLayer
console.log(window.dataLayer)
```

### Verify Events

Use **Google Analytics DebugView**:
1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/) extension
2. Enable the extension
3. Reload your site
4. Go to GA4 → Configure → DebugView
5. See events in real-time

### Common Issues

#### GA not loading?
- Check environment variable is set correctly
- Verify Measurement ID format
- Check browser console for errors
- Disable ad blockers

#### Events not showing?
- Wait up to 24 hours for data to appear in reports
- Use DebugView for real-time verification
- Check event name follows [naming conventions](https://support.google.com/analytics/answer/10085872)

#### Development mode not working?
- Ensure `import.meta.env.DEV` is `true`
- Check Vite is running in dev mode

## 🛡️ Security

### Environment Variables
- `.env` file is gitignored (never commit it)
- GA Measurement ID is public (not sensitive)
- No API keys or secrets required

### Content Security Policy (CSP)
If using CSP headers, allow:
```
script-src 'self' https://www.googletagmanager.com;
connect-src 'self' https://www.google-analytics.com https://analytics.google.com;
```

## 📈 Best Practices

1. **Use Descriptive Event Names**
   ```typescript
   // Good
   trackEvent('trip_added', { days: 31 })
   
   // Bad
   trackEvent('click', { type: 'add' })
   ```

2. **Include Relevant Parameters**
   ```typescript
   trackEvent('visa_setup', {
     duration_type: '18_months',
     has_existing_trips: false
   })
   ```

3. **Don't Track PII**
   ```typescript
   // ❌ BAD - Don't track personal information
   trackEvent('user_action', {
     email: 'user@example.com',
     full_name: 'John Doe'
   })
   
   // ✅ GOOD - Use anonymous identifiers
   trackEvent('user_action', {
     user_type: 'returning',
     session_id: 'abc123'
   })
   ```

4. **Monitor Performance**
   - GA loads asynchronously (no blocking)
   - Check Core Web Vitals in GA4
   - Optimize if CLS increases

## 📞 Support

For questions, refer to:
- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [GA4 Event Tracking Guide](https://support.google.com/analytics/answer/9267735)
- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## 📋 Checklist

- [ ] Created Google Analytics property
- [ ] Obtained Measurement ID
- [ ] Added `VITE_GA_MEASUREMENT_ID` to `.env`
- [ ] Configured environment variable on deployment platform
- [ ] Tested in production environment
- [ ] Verified events in GA4 DebugView
- [ ] Added privacy policy (if required)
- [ ] Implemented cookie consent (if required for GDPR)
- [ ] Confirmed `.env` is gitignored

