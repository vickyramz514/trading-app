# Zerodha Kite Connect Setup

## 1. Get API credentials

1. Go to [Kite Connect Developer Console](https://developers.kite.trade/)
2. Create an app
3. Note your **API Key** and **API Secret**
4. Set **Redirect URL** to: `http://127.0.0.1:3002/api/kite/callback` (for local dev)
5. For production, use your domain: `https://yourdomain.com/api/kite/callback`

## 2. Configure the server

Add to `apps/server/.env`:

```env
KITE_API_KEY=your_api_key
KITE_API_SECRET=your_api_secret
KITE_REDIRECT_URL=http://127.0.0.1:3002/api/kite/callback
FRONTEND_URL=http://localhost:5173
```

## 3. Connect Zerodha

1. Start the app: `pnpm start`
2. Open http://localhost:5173
3. Login (dummy credentials)
4. Click **"Connect Zerodha"** on the Dashboard
5. Complete login on Zerodha's page
6. You'll be redirected back with real data

## 4. API Reference

From [Kite Connect docs](https://kite.trade/docs/connect/v3/):

- **Profile:** `GET /api/profile`
- **Holdings:** `GET /api/holdings`
- **Positions:** `GET /api/positions`
- **Quote:** `GET /api/quote?symbol=RELIANCE`
- **Kite Login URL:** `GET /api/kite/login`
- **Kite Status:** `GET /api/kite/status`
- **Kite Logout:** `POST /api/kite/logout`

## 5. Token expiry

Access tokens expire at **6 AM** daily (regulatory). Reconnect via "Connect Zerodha" when needed.
