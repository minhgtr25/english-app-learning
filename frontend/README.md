# English Learning App Frontend

## Run Web

```powershell
npm.cmd run web
```

## Run Expo Go

```powershell
npm.cmd start
```

If testing on a phone, create `.env` from `.env.example` and set the laptop LAN IP:

```text
EXPO_PUBLIC_API_URL=http://YOUR_LAPTOP_IP:5000/api
```

## Build Internal APK

Install/login to EAS first:

```powershell
npm.cmd install --global eas-cli
eas login
```

Build preview APK:

```powershell
eas build -p android --profile preview
```

For a release-ready app, deploy the backend to a public HTTPS host and set `EXPO_PUBLIC_API_URL` to that URL before building.
