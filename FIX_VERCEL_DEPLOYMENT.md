# Fix Vercel Production Deployment

## Root Cause
The Vercel deployment at `mission-control-sigma-inky.vercel.app` was configured with the **development** Convex deployment URL instead of the **production** URL.

## What Has Been Fixed
1. ✅ TypeScript type issues fixed (commit 842218b)
2. ✅ Convex functions deployed to production: `https://laudable-cardinal-103.convex.cloud`
3. ✅ All schema and functions are live on production deployment

## Action Required: Update Vercel Environment Variable

### Option 1: Via Vercel Dashboard (Recommended)
1. Go to https://vercel.com/your-team/mission-control/settings/environment-variables
2. Find `NEXT_PUBLIC_CONVEX_URL`
3. Update value from:
   ```
   https://tidy-penguin-909.eu-west-1.convex.cloud
   ```
   to:
   ```
   https://laudable-cardinal-103.convex.cloud
   ```
4. Click "Save"
5. Trigger a new deployment (go to Deployments → Redeploy)

### Option 2: Via Vercel CLI
```bash
# Set production environment variable
vercel env add NEXT_PUBLIC_CONVEX_URL production
# When prompted, enter: https://laudable-cardinal-103.convex.cloud

# Redeploy
vercel --prod
```

### Option 3: Via .env Configuration (if using Vercel's env file)
If Vercel is configured to read from a committed `.env.production` file:
1. Create `.env.production` in the repo root
2. Add: `NEXT_PUBLIC_CONVEX_URL=https://laudable-cardinal-103.convex.cloud`
3. Commit and push
4. Vercel will pick it up on next deployment

## Verification
After updating:
1. Visit https://mission-control-sigma-inky.vercel.app
2. Open browser console
3. Should see no errors
4. Dashboard should load with data from production Convex

## Environment Reference
- **Development (localhost):** `https://tidy-penguin-909.eu-west-1.convex.cloud`
- **Production (Vercel):** `https://laudable-cardinal-103.convex.cloud`

## Summary
The client-side exception was caused by the production frontend trying to connect to the dev Convex backend, which may have had different schema/functions or auth issues. Now that functions are deployed to production Convex and the env var is documented, the fix just needs the env var update in Vercel dashboard.
