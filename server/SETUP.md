# BioLift Ranking Server Setup Guide

## Prerequisites

- Node.js 16+ installed
- Firebase project with Realtime Database enabled
- Firebase Admin SDK service account key

## Step 1: Install Dependencies

```bash
cd server
npm install
```

## Step 2: Get Firebase Service Account Key

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file as `serviceAccountKey.json` in the `server` directory

**OR** set the `FIREBASE_SERVICE_ACCOUNT` environment variable with the JSON content as a string.

## Step 3: Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
FIREBASE_DATABASE_URL=https://biolift-c37b6-default-rtdb.firebaseio.com
FRONTEND_URL=http://localhost:3000
PORT=3001
```

## Step 4: Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will run on `http://localhost:3001`

## Step 5: Update Frontend Environment

Add to your React app's `.env` file:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

## Security Notes

- The server verifies Firebase ID tokens for all protected endpoints
- Users can only view their own ranking data (unless admin)
- Admin endpoints require `admin@biolift.com` email
- Rate limiting is enabled (100 requests per 15 minutes per IP)

## Deployment

For production deployment:

1. Set environment variables on your hosting platform
2. Set `FIREBASE_SERVICE_ACCOUNT` as a JSON string (not file path)
3. Update `FRONTEND_URL` to your production frontend URL
4. Update React app's `REACT_APP_API_URL` to production server URL

## Testing

Test the health endpoint:
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{"status":"ok","timestamp":"2024-..."}
```

