# English Learning API

## Development

```powershell
npm.cmd install
npm.cmd run dev
```

## Required `.env`

Copy `.env.example` to `.env` and fill:

```text
MONGODB_URI=...
PORT=5000
JWT_SECRET=...
```

## Seed Demo Data

The seed script is non-destructive. It upserts demo users and questions by stable keys.

```powershell
npm.cmd run seed
```

Demo login:

```text
student@demo.com / 123456
admin@demo.com / 123456
```

## API Contract

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/questions`
- `POST /api/questions`
- `PUT /api/questions/:id`
- `DELETE /api/questions/:id`
- `GET /api/chat/messages`
- `POST /api/chat/messages`
- `GET /api/analytics`
- `POST /api/progress/score`
- `POST /api/progress/complete`
- `GET /api/users/leaderboard`
- Socket event: `chat:message`

## Mobile Frontend URL Notes

For Expo Go on a physical phone, the frontend must use the laptop LAN IP, not `localhost`.

Example:

```text
EXPO_PUBLIC_API_URL=http://192.168.1.10:5000/api
```
