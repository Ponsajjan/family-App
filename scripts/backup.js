/**
 * Database Backup and Restore Script
 *
 * This script allows you to backup and restore your family app's database.
 * It supports both development (SQLite) and production (PostgreSQL) environments.
 *
 * Features:
 * - Backup: Creates a timestamped backup file in the 'backups' folder.
 * - Restore: Restores from a specified backup file.
 *
 * Requirements:
 * - For development (SQLite): Node.js with fs module.
 * - For production (PostgreSQL): pg_dump and psql tools must be installed and in PATH.
 * - Environment variables: SQLITE_DB_PATH (for dev), DATABASE_URL (for prod).
 *
 * Usage Steps:
 * 1. Ensure you are in the project root directory (c:/Users/DELL/Desktop/family_app).
 * 2. Set environment variables if needed (e.g., export DATABASE_URL="postgresql://...").
 * 3. Run the script with appropriate arguments:
 *    - To backup development database: node scripts/backup.js --env dev --action backup
 *    - To backup production database: node scripts/backup.js --env prod --action backup
 *    - To restore development database: node scripts/backup.js --env dev --action restore --file backups/dev_backup_YYYY-MM-DD_HH-MM-SS.db
 *    - To restore production database: node scripts/backup.js --env prod --action restore --file backups/prod_backup_YYYY-MM-DD_HH-MM-SS.sql
 * 4. The script will create the 'backups' folder if it doesn't exist.
 * 5. For production, ensure you have access to the PostgreSQL database via DATABASE_URL.
 *
 * Note: Restoring will overwrite the current database. Make sure to backup first if needed.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Parse command-line arguments
const argv = yargs(hideBin(process.argv))
    .option('env', {
        alias: 'e',
        describe: 'Environment: dev or prod',
        choices: ['dev', 'prod'],
        demandOption: true,
    })
    .option('action', {
        alias: 'a',
        describe: 'Action: backup or restore',
        choices: ['backup', 'restore'],
        demandOption: true,
    })
    .option('file', {
        alias: 'f',
        describe: 'Backup file path for restore (required for restore)',
        type: 'string',
    })
    .help()
    .argv;

// Ensure backups folder exists
const backupsDir = path.join(__dirname, '..', 'backups');
if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
}

// Get database configuration based on environment
function getDbConfig(env) {
    if (env === 'dev') {
        const dbPath = process.env.SQLITE_DB_PATH || './prisma/dev.db';
        return {
            type: 'sqlite',
            path: path.resolve(dbPath),
        };
    } else if (env === 'prod') {
        const url = process.env.DATABASE_URL;
        if (!url) {
            throw new Error('DATABASE_URL environment variable is required for production.');
        }
        return {
            type: 'postgresql',
            url: url,
        };
    }
}

// Generate timestamp for backup file
function getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + now.toTimeString().split(' ')[0].replace(/:/g, '-');
}

// Backup function
function backup(env) {
    const config = getDbConfig(env);
    const timestamp = getTimestamp();
    let backupFile;

    if (config.type === 'sqlite') {
        backupFile = path.join(backupsDir, `dev_backup_${timestamp}.db`);
        fs.copyFileSync(config.path, backupFile);
        console.log(`Development backup created: ${backupFile}`);
    } else if (config.type === 'postgresql') {
        backupFile = path.join(backupsDir, `prod_backup_${timestamp}.sql`);
        const command = `pg_dump "${config.url}" > "${backupFile}"`;
        try {
            execSync(command, { stdio: 'inherit' });
            console.log(`Production backup created: ${backupFile}`);
        } catch (error) {
            console.error('Error: pg_dump command failed. Ensure PostgreSQL tools are installed and in PATH.');
            console.error('Install PostgreSQL from https://www.postgresql.org/download/ and add bin directory to PATH.');
            throw error;
        }
    }
}

// Restore function
function restore(env, file) {
    if (!file) {
        throw new Error('--file is required for restore action.');
    }

    const config = getDbConfig(env);
    const backupPath = path.resolve(file);

    if (!fs.existsSync(backupPath)) {
        throw new Error(`Backup file does not exist: ${backupPath}`);
    }

    if (config.type === 'sqlite') {
        fs.copyFileSync(backupPath, config.path);
        console.log(`Development database restored from: ${backupPath}`);
    } else if (config.type === 'postgresql') {
        const command = `psql "${config.url}" < "${backupPath}"`;
        execSync(command, { stdio: 'inherit' });
        console.log(`Production database restored from: ${backupPath}`);
    }
}

// Main execution
try {
    if (argv.action === 'backup') {
        backup(argv.env);
    } else if (argv.action === 'restore') {
        restore(argv.env, argv.file);
    }
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
