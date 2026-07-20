# English Learning App

Full-stack English learning app with Expo React Native, Express, MongoDB, realtime chat, quiz, leaderboard, and admin analytics.

## One-command workflow

Install both apps:

```powershell
npm.cmd run setup
```

Check backend and frontend:

```powershell
npm.cmd run check
```

Run backend and Expo together:

```powershell
npm.cmd run dev
```

Seed demo data into MongoDB Atlas after confirming the target database:

```powershell
npm.cmd run seed
```

## Mobile API URL

For Expo Go on a physical phone, set `frontend/.env`:

```text
EXPO_PUBLIC_API_URL=http://YOUR_LAPTOP_IP:5000/api
```

For APK distribution, deploy the backend to a public HTTPS host and use that URL before building.
