# Deployment Guide

This guide explains how to deploy the Condition 8558 Planner to GitHub Pages.

## Prerequisites

- GitHub repository with the project
- GitHub account with repository access
- (Optional) Environment variables for Google AdSense and Analytics

## Setup Instructions

### 1. Configure GitHub Pages

1. Navigate to your repository on GitHub
2. Go to **Settings** → **Pages**
3. Under **Build and deployment** → **Source**, select **GitHub Actions**

### 2. Configure Environment Variables (Optional)

If you want to include Google AdSense or Analytics in production:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add the following secrets:
   - `VITE_ADSENSE_CLIENT_ID` - Your Google AdSense client ID (e.g., ca-pub-XXXXXXXXXXXXXXXX)
   - `VITE_ADSENSE_PRIMARY_SLOT` - Primary ad slot ID
   - `VITE_ADSENSE_SECONDARY_SLOT` - Secondary ad slot ID
   - `VITE_GA_MEASUREMENT_ID` - Google Analytics measurement ID (e.g., G-XXXXXXXXXX)

> **Note**: These are optional. The app will work without them, just without ads and analytics.

### 3. Deploy Manually

#### Option A: GitHub UI

1. Go to the **Actions** tab in your repository
2. Select **Deploy to GitHub Pages** from the workflows list
3. Click **Run workflow** button
4. Select the branch you want to deploy (usually `main`)
5. Click **Run workflow** to start deployment

#### Option B: Git Push Trigger (Optional)

To enable automatic deployment on every push to main branch:

1. Edit `.github/workflows/deploy.yml`
2. Uncomment the following lines:
   ```yaml
   push:
     branches:
       - main
   ```
3. Commit and push the changes
4. Now every push to `main` branch will automatically trigger deployment

### 4. Verify Deployment

1. After the workflow completes successfully (usually 2-3 minutes)
2. Go to **Settings** → **Pages**
3. You should see your site URL: `https://<username>.github.io/<repository>/`
4. Click the URL to visit your deployed site

## Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`) performs the following steps:

### Build Job
1. **Checkout code** - Downloads the repository code
2. **Setup pnpm** - Installs pnpm package manager (version 9)
3. **Setup Node.js** - Installs Node.js (version 20) with pnpm cache
4. **Install dependencies** - Runs `pnpm install --frozen-lockfile`
5. **Run tests** - Executes test suite to ensure code quality
6. **Build** - Runs `pnpm build` to create production build with environment variables
7. **Setup Pages** - Configures GitHub Pages settings
8. **Upload artifact** - Uploads the `dist` folder as deployment artifact

### Deploy Job
1. **Deploy to GitHub Pages** - Deploys the artifact to GitHub Pages
2. **Generate URL** - Creates the public URL for your site

## Troubleshooting

### Build Fails

**Problem**: The workflow fails during the build step.

**Solutions**:
- Check if all tests pass locally: `pnpm test:run`
- Verify the build works locally: `pnpm build`
- Check the Actions logs for specific error messages

### Tests Fail

**Problem**: Tests fail in CI but pass locally.

**Solutions**:
- Ensure all dependencies are in `package.json`
- Check for environment-specific issues
- Review test logs in the Actions tab

### Site Shows 404

**Problem**: Deployed site shows 404 error.

**Solutions**:
- Verify GitHub Pages is configured to use "GitHub Actions" as source
- Check if the workflow completed successfully
- Wait a few minutes after deployment (can take 5-10 minutes to propagate)
- Verify the base path in `vite.config.ts` is set to `'./'`

### Assets Not Loading

**Problem**: CSS/JS files are not loading on the deployed site.

**Solutions**:
- Ensure `vite.config.ts` has `base: './'`
- Check if `.nojekyll` file exists in the `public` folder
- Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Environment Variables Not Working

**Problem**: AdSense or Analytics not showing on deployed site.

**Solutions**:
- Verify secrets are correctly added in repository settings
- Check secret names match exactly (case-sensitive)
- Re-run the workflow after adding secrets

## Custom Domain

To use a custom domain instead of `github.io`:

1. Add a `CNAME` file in the `public` folder with your domain:
   ```
   condition-8558.mutoo.im
   ```

2. Configure DNS settings:
   - Add a CNAME record pointing to `<username>.github.io`
   - Or add A records pointing to GitHub Pages IPs

3. In GitHub Settings → Pages → Custom domain, enter your domain

4. Enable "Enforce HTTPS"

See [GitHub's custom domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for detailed instructions.

## Workflow Permissions

The workflow requires the following permissions (already configured in `.github/workflows/deploy.yml`):

```yaml
permissions:
  contents: read      # Read repository contents
  pages: write        # Deploy to GitHub Pages
  id-token: write     # Verify deployment identity
```

## Monitoring Deployments

You can monitor all deployments:

1. **Actions Tab**: See workflow runs and logs
2. **Environments**: Go to **Settings** → **Environments** → **github-pages** to see deployment history
3. **Deployments**: Click the **Deployments** section on the repository main page

## Rollback

If you need to rollback to a previous version:

1. Find the commit hash of the previous working version
2. Go to **Actions** → **Deploy to GitHub Pages**
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

Or checkout the previous commit and push:

```bash
git checkout <previous-commit-hash>
git push origin main --force
```

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**Need Help?** Open an issue in the repository or check the [GitHub Community](https://github.community/).

