# Family App

A Next.js application for managing family trees and relationships, built with TypeScript, Tailwind CSS, and PostgreSQL.

## Features

- Family tree visualization
- Member management
- Relationship tracking
- Authentication and authorization
- Admin and moderator roles
- Offline support with PWA

## Database

This project uses PostgreSQL for both development and production environments.

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string for production (e.g., `postgresql://user:pass@host:5432/family_app_prod`)
- `DATABASE_URL_DEV`: PostgreSQL connection string for development (e.g., `postgresql://user:pass@localhost:5432/family_app_dev`)

### Database Backup and Restore

Use the provided script to backup and restore the PostgreSQL database.

#### Usage

- Backup development database: `node scripts/backup.js --env dev --action backup`
- Backup production database: `node scripts/backup.js --env prod --action backup`
- Restore: `node scripts/backup.js --env dev --action restore --file backups/dev_backup_YYYY-MM-DD_HH-MM-SS.sql`
- List backups: `node scripts/backup.js --env dev --action list`

See the script's help for more options: `node scripts/backup.js --help`

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`
4. Generate Prisma client: `npx prisma generate`
5. Run database migrations: `npx prisma migrate dev`
6. Start the development server: `npm run dev`

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Technologies

- Next.js 15
- React 18
- TypeScript
- Prisma with PostgreSQL
- Tailwind CSS
- PWA with next-pwa
