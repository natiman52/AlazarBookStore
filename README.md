## Better Auth Setup

1) Create a `.env.local` with the following variables:
```
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
BETTER_AUTH_SECRET="replace-with-strong-random-string"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
# legacy admin guard (remove once admin uses Better Auth)
ADMIN_PASSWORD="change-me"
# existing upload config
TELEGRAM_BOT_TOKEN=""
TELEGRAM_CHANNEL_ID=""
```

2) Run Prisma if the database schema is not applied:
```
npx prisma migrate deploy
```

3) Start the dev server:
```
npm run dev
```

Better Auth endpoints are mounted at `/api/auth`. The React client is configured in `lib/auth-client.ts` and the server config lives in `lib/auth.ts`.

