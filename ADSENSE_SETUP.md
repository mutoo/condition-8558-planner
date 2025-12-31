# Google AdSense Integration Guide

## 📍 Ad Placement

This application has two Google AdSense ad slots configured:

### 1. **Primary Ad Slot**
- **Location**: Between Info Section and Visa Setup
- **Recommended Sizes**:
  - Desktop: 728×90 (Leaderboard) or 970×90 (Large Leaderboard)
  - Mobile: 320×100 (Large Mobile Banner) or 320×50 (Mobile Banner)
- **Environment Variable**: `VITE_ADSENSE_PRIMARY_SLOT`

### 2. **Secondary Ad Slot**
- **Location**: Between Planned Trips List and Add Trip Form
- **Recommended Sizes**:
  - Desktop: 728×90 (Leaderboard)
  - Mobile: 320×100 (Large Mobile Banner)
- **Environment Variable**: `VITE_ADSENSE_SECONDARY_SLOT`

## 🔧 Configuration Steps

### Step 1: Get AdSense Account Information

1. Login to [Google AdSense](https://www.google.com/adsense/)
2. Create ad units and obtain:
   - **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)
   - **Ad Slot ID** (each ad slot has a unique Slot ID)

### Step 2: Configure Environment Variables

1. Copy `.env.sample` file to `.env`:
```bash
cp .env.sample .env
```

2. Edit the `.env` file and fill in your actual AdSense information:
```bash
# Your AdSense Publisher ID
VITE_ADSENSE_CLIENT_ID=ca-pub-1234567890123456

# Primary Ad Slot ID
VITE_ADSENSE_PRIMARY_SLOT=1234567890

# Secondary Ad Slot ID
VITE_ADSENSE_SECONDARY_SLOT=0987654321
```

### Step 3: Add AdSense Script

Add the AdSense script to the `<head>` tag in `index.html`:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
     crossorigin="anonymous"></script>
```

Replace `ca-pub-XXXXXXXXXXXXXXXX` with your Publisher ID (same as `VITE_ADSENSE_CLIENT_ID` in `.env`).

### Step 4: Restart Development Server

After modifying the `.env` file, restart the development server:

```bash
pnpm run dev
```

## 🧪 Development Environment

In development mode, ad slots will display as gray placeholders:

```
┌─────────────────────────────────┐
│  📢 Ad Slot: 1234567890         │
│  Format: horizontal             │
└─────────────────────────────────┘
```

If AdSense is not configured (`.env` file doesn't exist or variables are not set), a warning will be displayed:

```
┌─────────────────────────────────┐
│  📢 Ad Slot: primary-ad         │
│  Format: horizontal             │
│  ⚠️ AdSense not configured      │
└─────────────────────────────────┘
```

## 📱 Responsive Design

Ad slots are optimized for mobile devices:

- **Desktop**: Standard banner ads (728×90 or larger)
- **Tablet**: Auto-adaptive
- **Mobile**: Small banner ads (320×100 or 320×50)

Using the `data-full-width-responsive="true"` attribute, ads will automatically adapt to screen width.

## 🎨 Custom Styling

Ad slot styles are defined in `src/components/AdSlot.css`:

```css
.ad-slot.primary-ad {
  margin: 1.5rem 0 2rem 0;  /* Primary ad slot margins */
}

.ad-slot.secondary-ad {
  margin: 1.5rem 0;         /* Secondary ad slot margins */
  padding: 0.5rem 0;
}
```

You can adjust margins, alignment, etc. as needed.

## 🔒 Security Considerations

### Environment Variable Security

1. **`.env` file is ignored by `.gitignore`**
   - Won't be committed to Git repository
   - Protects your AdSense ID

2. **Using Vite Environment Variables**
   - Variables with `VITE_` prefix are exposed to the client
   - AdSense IDs are publicly visible and not sensitive information
   - However, it's still recommended not to hardcode them in the code

3. **Production Environment Configuration**
   - Configure in deployment platform's (Vercel, Netlify, etc.) environment variable settings
   - Don't upload `.env` file to servers

### Deployment Platform Configuration Examples

#### Vercel
```bash
# Set environment variables in Vercel Dashboard
VITE_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
VITE_ADSENSE_PRIMARY_SLOT=1234567890
VITE_ADSENSE_SECONDARY_SLOT=0987654321
```

#### Netlify
```bash
# Set environment variables in Netlify Dashboard
VITE_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
VITE_ADSENSE_PRIMARY_SLOT=1234567890
VITE_ADSENSE_SECONDARY_SLOT=0987654321
```

## ⚠️ AdSense Policies

1. **Ad Density**: No more than 3 ad units per page
2. **User Experience**: Ads should not interfere with core functionality
3. **Load Time**: AdSense script loads asynchronously and won't block page rendering
4. **Content Policy**: Ensure compliance with [Google AdSense Program Policies](https://support.google.com/adsense/answer/48182)

## 🚀 Deployment Checklist

- [ ] Obtained AdSense Publisher ID
- [ ] Created two ad units and obtained Slot IDs
- [ ] Configured `.env` file (local development)
- [ ] Configured environment variables on deployment platform (production)
- [ ] Added AdSense script to `index.html`
- [ ] Tested ad display in production environment
- [ ] Verified mobile ad display
- [ ] Confirmed `.env` file is not committed to Git

## 📊 Performance Impact

AdSense script uses asynchronous loading, performance impact:
- **Initial Load**: +50-100ms
- **LCP (Largest Contentful Paint)**: Negligible impact
- **CLS (Cumulative Layout Shift)**: Near 0, as ad space is pre-allocated

## 🔍 Troubleshooting

### Ads Not Displaying?

1. **Check Environment Variables**
   ```bash
   # View current environment variables
   echo $VITE_ADSENSE_CLIENT_ID
   ```

2. **Check Browser Console**
   - Any AdSense errors?
   - Are network requests successful?

3. **Verify Configuration**
   - Is Publisher ID format correct?
   - Is Slot ID numeric only?
   - Is AdSense account approved?

4. **Clear Cache and Rebuild**
   ```bash
   rm -rf node_modules/.vite
   pnpm run build
   ```

5. **Check AdBlock**
   - Disable browser ad blocking extensions

### Can't See Placeholders in Development?

Check if `.env` file exists and variables are set. If not configured, a warning message will be displayed.

### Ads Not Showing in Production?

1. Confirm environment variables are set on deployment platform
2. New ad units may take several hours to activate
3. Check if AdSense script in `index.html` is correct

## 📞 Support

For questions, please refer to:
- [Google AdSense Help Center](https://support.google.com/adsense/)
- [AdSense Code Optimization Guide](https://support.google.com/adsense/answer/9183549)
- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)

