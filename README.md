# Family App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

A full-stack web application for building and managing family trees, built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL.

## Features

- Family tree visualization and navigation
- Member management (add, edit, relationships)
- Role-based access: Admin, Moderator, Member
- JWT-based authentication
- Offline support via PWA
- Database backup and restore

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS |
| ORM | Prisma 7 |
| Database | PostgreSQL |
| State | Redux Toolkit |
| Auth | JWT + bcryptjs |
| PWA | next-pwa |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ponsajjan/family-App.git
   cd family-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and fill in your values (see [Environment Variables](#environment-variables) below).

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `SUPER_ADMIN_PASSWORD` | Password for the super admin account | `your_secure_password` |
| `JWT_SECRET` | Secret key for signing JWTs (use a long random string) | `openssl rand -base64 64` |
| `NEXT_PUBLIC_BASE_URL` | Public base URL of the app | `http://localhost:3000` |
| `DATABASE_URL_CLIENT` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/familytree` |
| `DATABASE_PROVIDER` | Database provider | `postgresql` |
| `NODE_ENV` | Environment | `development` |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Web Push VAPID public key | `npx web-push generate-vapid-keys` |
| `VAPID_PRIVATE_KEY` | Web Push VAPID private key | `npx web-push generate-vapid-keys` |
| `VAPID_SUBJECT` | Contact URI sent with push requests | `mailto:you@example.com` |
| `CRON_SECRET` | Shared secret to trigger the daily notification job externally | long random string |

Copy `.env.example` to `.env.local` and set each value.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (with Turbopack) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Database

### Migrations
```bash
npx prisma migrate dev       # apply migrations in development
npx prisma db push           # push schema changes without migration history
npx prisma studio            # open Prisma visual editor
```

### Backup & Restore
```bash
node scripts/backup.js --env dev --action backup
node scripts/backup.js --env dev --action restore --file backups/dev_backup_YYYY-MM-DD.sql
node scripts/backup.js --env dev --action list
```

## Push Notifications

When a family member's birthday or deathday falls on the current day, every device that has subscribed receives a Web Push notification — even if the app isn't open. How it works:

- The app registers a push subscription per device (`src/utils/notificationUtils.ts`) and stores it against the logged-in family (`PushSubscription` model).
- A custom service worker (`worker/index.js`, merged into the generated PWA service worker) shows the notification and handles taps.
- The server checks for today's events and sends notifications via `src/utils/pushNotify.ts`. This runs two ways:
  - **Automatically**, once a day (default 8:00 AM IST, configurable via `NOTIFICATION_HOUR` / `NOTIFICATION_MINUTE`), via an in-process scheduler started in `src/instrumentation.ts` — no extra setup needed for a single-instance self-hosted deployment.
  - **On demand / externally**, via `GET /api/cron/notifications?secret=<CRON_SECRET>`, for deployments that prefer an external scheduler (e.g. multiple instances, serverless).

Requires `NEXT_PUBLIC_VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` to be set (see Environment Variables above).

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

## License

This project is licensed under the [MIT License](./LICENSE).
