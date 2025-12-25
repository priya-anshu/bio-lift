# Quick Start Guide - Ranking System

## ⚠️ Important: You Need to Run TWO Servers

The ranking system requires both:
1. **React Frontend** (port 3000)
2. **Node.js Backend** (port 3001)

## Step 1: Start the Node.js Ranking Server

Open a **new terminal** and run:

```bash
cd server
npm install
npm run dev
```

You should see:
```
🚀 BioLift Ranking Server running on port 3001
📊 Health check: http://localhost:3001/health
```

## Step 2: Start the React Frontend

In your **main terminal**, run:

```bash
npm start
```

## Step 3: Test the Connection

1. Open your browser to `http://localhost:3000`
2. Navigate to the **Ranking** page
3. The leaderboard should load (if you have users with data)

## Troubleshooting

### Error: `ERR_CONNECTION_REFUSED`
**Solution:** The Node.js server isn't running. Start it with `cd server && npm run dev`

### Error: `Permission denied` (RTDB)
**Solution:** This is expected if the server isn't running. Once the server starts, it will handle permissions correctly.

### No data showing
**Solution:** 
- Make sure users have logged progress in the Track Progress page
- The server needs to calculate rankings first
- Check server console for any errors

## Server Setup (First Time Only)

1. **Get Firebase Service Account Key:**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `server/serviceAccountKey.json`

2. **Create `.env` file in `server/` directory:**
   ```env
   FIREBASE_DATABASE_URL=https://biolift-c37b6-default-rtdb.firebaseio.com
   FRONTEND_URL=http://localhost:3000
   PORT=3001
   ```

3. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

## Production Deployment

When deploying to production:
1. Deploy Node.js server (Heroku, Railway, AWS, etc.)
2. Update `REACT_APP_API_URL` in frontend `.env` to production server URL
3. Update `FRONTEND_URL` in server `.env` to production frontend URL

