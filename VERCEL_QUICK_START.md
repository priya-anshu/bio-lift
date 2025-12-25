# 🚀 Vercel Quick Start Guide

## Quick Setup (5 Minutes)

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import to Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import `priya-anshu/bio-lift` from GitHub
3. Framework: **Create React App** (auto-detected)
4. Root Directory: `./` (keep default)

### 3. Add Environment Variables
Click **"> Environment Variables"** and add:

| Variable | Value | Environments |
|----------|-------|--------------|
| `FIREBASE_SERVICE_ACCOUNT` | Paste entire JSON from `server/serviceAccountKey.json` | All |
| `FIREBASE_DATABASE_URL` | `https://biolift-c37b6-default-rtdb.firebaseio.com` | All |
| `FRONTEND_URL` | Leave empty (auto-set after deploy) | All |

### 4. Deploy
Click **"Deploy"** and wait 2-5 minutes.

### 5. Update Environment Variables (After First Deploy)
1. Copy your Vercel URL: `https://bio-lift-xxxxx.vercel.app`
2. Go to **Settings** → **Environment Variables**
3. Update `FRONTEND_URL` to your Vercel URL
4. Add `REACT_APP_API_URL` = `https://bio-lift-xxxxx.vercel.app/api`
5. **Redeploy** (Settings → Deployments → Redeploy)

## ✅ Test Your Deployment

- Frontend: `https://your-project.vercel.app`
- Health Check: `https://your-project.vercel.app/health`
- API: `https://your-project.vercel.app/api/api/leaderboard`

## 📝 Important Notes

- **Never commit `serviceAccountKey.json`** - it's in `.gitignore`
- API routes: `/api/*` → handled by `api/index.js`
- Frontend: All other routes → served from `build/`
- Auto-deploy: Every push to `main` triggers a new deployment

## 🆘 Troubleshooting

**Build fails?** Check build logs in Vercel dashboard.

**API returns 404?** Make sure `vercel.json` exists and routes are correct.

**Firebase errors?** Verify `FIREBASE_SERVICE_ACCOUNT` is valid JSON.

---

For detailed setup, see `VERCEL_SETUP.md`

