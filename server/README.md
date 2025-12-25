# BioLift Ranking Server

Node.js backend server for the BioLift Smart Ranking System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase:
   - Download your Firebase service account key from Firebase Console
   - Save it as `serviceAccountKey.json` in the server directory
   - OR set `FIREBASE_SERVICE_ACCOUNT` environment variable with JSON string

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

- `GET /health` - Health check
- `GET /api/leaderboard?type=overall&limit=50&offset=0` - Get leaderboard
- `GET /api/my-ranking?type=overall` - Get current user's ranking (requires auth)
- `GET /api/user-ranking/:userId?type=overall` - Get specific user's ranking (requires auth)
- `POST /api/update-user-metrics` - Update user metrics (requires auth)
- `POST /api/recalculate-rankings` - Recalculate all rankings (admin only)
- `GET /api/ranking-stats` - Get ranking statistics

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

## Features

- Smart algorithmic ranking based on multiple factors
- Real-time ranking updates
- Support for overall, weekly, and monthly leaderboards
- Tier-based ranking system (Diamond, Platinum, Gold, Silver, Bronze)
- Secure authentication with Firebase
- Shows all Google-authenticated users

