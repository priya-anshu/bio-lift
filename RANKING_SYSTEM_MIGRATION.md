# Ranking System Migration: Cloud Functions → Node.js Backend

## Overview

The ranking system has been completely redesigned to use a Node.js backend instead of Cloud Functions. The UI remains unchanged, but the backend is now more powerful, secure, and easier to maintain.

## What Changed

### ✅ Removed
- All Cloud Functions code (`functions/` directory can be deleted)
- Firestore dependencies for ranking
- Direct Firestore writes from frontend

### ✅ Added
- Node.js Express server (`server/` directory)
- Smart algorithmic ranking system
- Secure Firebase Auth token verification
- Real-time ranking updates via Firebase RTDB
- Support for all Google-authenticated users

## Key Features

1. **Smart Algorithmic Ranking**
   - Multi-factor scoring (Strength, Stamina, Consistency, Improvement)
   - Progress tracking bonus
   - Tier-based system (Diamond, Platinum, Gold, Silver, Bronze)

2. **Security**
   - Firebase ID token verification on all protected endpoints
   - Users can only view their own ranking (unless admin)
   - Rate limiting (100 requests per 15 minutes)

3. **Real-time Updates**
   - Rankings update automatically when users log progress
   - Live leaderboard via Firebase RTDB listeners
   - Current user sees their ranking in real-time

4. **Google Authentication**
   - Shows all users who logged in with Google accounts
   - Displays user avatars, names, and profiles
   - Filters out non-Google users

## Setup Instructions

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Get Firebase Service Account Key:**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `serviceAccountKey.json` in `server/` directory

4. **Create `.env` file:**
   ```env
   FIREBASE_DATABASE_URL=https://biolift-c37b6-default-rtdb.firebaseio.com
   FRONTEND_URL=http://localhost:3000
   PORT=3001
   ```

5. **Start the server:**
   ```bash
   npm run dev  # Development
   npm start    # Production
   ```

### Frontend Setup

1. **Add environment variable:**
   Create/update `.env` in project root:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   ```

2. **Restart React app:**
   ```bash
   npm start
   ```

## API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `GET /api/leaderboard?type=overall&limit=50&offset=0` - Get leaderboard
- `GET /api/ranking-stats` - Get ranking statistics

### Protected Endpoints (Require Auth Token)
- `GET /api/my-ranking?type=overall` - Get current user's ranking
- `GET /api/user-ranking/:userId?type=overall` - Get specific user's ranking
- `POST /api/update-user-metrics` - Update user metrics
- `POST /api/recalculate-rankings` - Recalculate all rankings (Admin only)

## How It Works

1. **User logs progress** → Frontend calls `/api/update-user-metrics`
2. **Backend calculates score** → Uses smart algorithm
3. **Rankings recalculated** → All users re-ranked
4. **RTDB updated** → Real-time listeners trigger
5. **Frontend updates** → Leaderboard refreshes automatically

## Ranking Algorithm

The ranking score is calculated from:
- **Strength (30%)**: Max weight lifted, 1RM, total volume
- **Stamina (25%)**: Endurance, heart rate, cardio performance
- **Consistency (25%)**: Workout frequency, streak, attendance
- **Improvement (20%)**: Progress rate, calories burned, growth

**Bonus**: +5 points max for regular progress tracking

## Security

- All protected endpoints verify Firebase ID tokens
- Users can only access their own data
- Admin endpoints check for `admin@biolift.com` email
- Rate limiting prevents abuse
- CORS configured for your frontend domain only

## Migration Checklist

- [x] Node.js server created
- [x] Ranking algorithm implemented
- [x] API endpoints created
- [x] Frontend updated to use new API
- [x] Real-time updates working
- [x] Security implemented
- [x] Google users filtering working
- [ ] Deploy Node.js server to production
- [ ] Update production environment variables
- [ ] Test end-to-end in production

## Next Steps

1. Deploy Node.js server (Heroku, Railway, AWS, etc.)
2. Update production `.env` variables
3. Update React app's `REACT_APP_API_URL` to production URL
4. Test the complete flow
5. Monitor server logs for any issues

## Troubleshooting

**Server won't start:**
- Check if `serviceAccountKey.json` exists
- Verify `.env` file is configured
- Check if port 3001 is available

**Frontend can't connect:**
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS settings in server
- Ensure server is running

**Rankings not updating:**
- Check server logs for errors
- Verify Firebase RTDB permissions
- Ensure users are logging progress correctly

## Support

For issues or questions, check:
- Server logs: `server/` directory
- Browser console: Frontend errors
- Firebase Console: RTDB data structure

