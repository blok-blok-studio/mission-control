# Vercel Production Configuration

## Issue Found
The Vercel deployment was configured to use the **dev** Convex deployment URL instead of the **production** deployment.

## Fix Required

### Environment Variable Update
In Vercel dashboard (mission-control-sigma-inky.vercel.app):

1. Go to Settings → Environment Variables
2. Update `NEXT_PUBLIC_CONVEX_URL`:
   - **Current (WRONG):** `https://tidy-penguin-909.eu-west-1.convex.cloud`
   - **Correct (PROD):** `https://laudable-cardinal-103.convex.cloud`
3. Redeploy the application

### Deployment URLs
- **Dev Deployment:** `https://tidy-penguin-909.eu-west-1.convex.cloud` (for local development)
- **Production Deployment:** `https://laudable-cardinal-103.convex.cloud` (for Vercel)

### What Was Done
1. ✅ Deployed Convex functions to production (`laudable-cardinal-103.convex.cloud`)
2. ⚠️ **MANUAL ACTION REQUIRED:** Update Vercel env var `NEXT_PUBLIC_CONVEX_URL`

## After Updating Environment Variable
1. Trigger a new deployment in Vercel
2. The client-side error should be resolved
