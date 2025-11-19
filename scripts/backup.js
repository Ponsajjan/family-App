/**
 * Database Backup and Restore Script
 * 
 * This script allows you to backup and restore your family app's PostgreSQL database.
 * It supports both development and production PostgreSQL environments.
 * 
 * Features:
 * - Backup: Creates a timestamped SQL backup file in the 'backups' folder.
 * - Restore: Restores from a specified backup file.
 * - Schema-only backup: Option to backup only schema without data.
 * - Data-only backup: Option to backup only data without schema.
 * 
 * Requirements:
 * - PostgreSQL: pg_dump and psql tools must be installed and in PATH.
 * - Environment variables: DATABASE_URL_DEV (for development), DATABASE_URL (for production).
 * 
 * Usage Steps:
 * 1. Ensure you are in the project root directory (c:/Users/DELL/Desktop/family_app).
 * 2. Set environment variables:
 *    - Development: export DATABASE_URL_DEV="postgresql://user:pass@localhost:5432/family_app_dev"
 *    - Production: export DATABASE_URL="postgresql://user:pass@host:5432/family_app_prod"
 * 3. Run the script with appropriate arguments:
 *    - To backup development database: node scripts/backup.js --env dev --action backup
 *    - To backup production database: node scripts/backup.js --env prod --action backup
 *    - To backup schema only: node scripts/backup.js --env dev --action backup --schema-only
 *    - To backup data only: node scripts/backup.js --env dev --action backup --data-only
 *    - To restore development database: node scripts/backup.js --env dev --action restore --file backups/dev_backup_YYYY-MM-DD_HH-MM-SS.sql
 *    - To restore production database: node scripts/backup.js --env prod --action restore --file backups/prod_backup_YYYY-MM-DD_HH-MM-SS.sql
 *    - To list available backups for dev: node scripts/backup.js --env dev --action list
 *    - To list available backups for prod: node scripts/backup.js --env prod --action list
 * 4. The script will create the 'backups' folder if it doesn't exist.
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
        describe: 'Action: backup, restore, or list',
        choices: ['backup', 'restore', 'list'],
        demandOption: true,
    })
    .option('file', {
        alias: 'f',
        describe: 'Backup file path for restore (required for restore)',
        type: 'string',
    })
    .option('schema-only', {
        describe: 'Backup only schema (no data)',
        type: 'boolean',
        default: false,
    })
    .option('data-only', {
        describe: 'Backup only data (no schema)',
        type: 'boolean',
        default: false,
    })
    .option('compress', {
        alias: 'c',
        describe: 'Create compressed backup (.gz)',
        type: 'boolean',
        default: false,
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
        const url = process.env.DATABASE_URL_DEV || process.env.DATABASE_URL;
        if (!url) {
            throw new Error('DATABASE_URL_DEV or DATABASE_URL environment variable is required for development database.');
        }
        return {
            type: 'postgresql',
            url: url,
            name: 'development'
        };
    } else if (env === 'prod') {
        const url = process.env.DATABASE_URL;
        if (!url) {
            throw new Error('DATABASE_URL environment variable is required for production database.');
        }
        return {
            type: 'postgresql',
            url: url,
            name: 'production'
        };
    }
}

// Generate timestamp for backup file
function getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + now.toTimeString().split(' ')[0].replace(/:/g, '-');
}

// Parse database URL to extract components (for better error messages)
function parseDatabaseUrl(url) {
    try {
        const regex = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
        const match = url.match(regex);
        if (match) {
            return {
                user: match[1],
                host: match[3],
                port: match[4],
                database: match[5]
            };
        }
        return null;
    } catch (error) {
        return null;
    }
}

// Test database connection
function testConnection(config) {
    try {
        const testCommand = `psql "${config.url}" -c "SELECT 1;" -q`;
        execSync(testCommand, { stdio: 'pipe' });
        return true;
    } catch (error) {
        const dbInfo = parseDatabaseUrl(config.url);
        console.error(`❌ Cannot connect to ${config.name} database:`);
        if (dbInfo) {
            console.error(`   Host: ${dbInfo.host}:${dbInfo.port}`);
            console.error(`   Database: ${dbInfo.database}`);
            console.error(`   User: ${dbInfo.user}`);
        }
        console.error(`   Please check your DATABASE_URL${config.name === 'development' ? '_DEV' : ''} environment variable`);
        console.error(`   and ensure the database server is running and accessible.`);
        return false;
    }
}

// Backup function for PostgreSQL
function backup(env) {
    const config = getDbConfig(env);
    const timestamp = getTimestamp();

    console.log(`🔍 Testing connection to ${config.name} database...`);
    if (!testConnection(config)) {
        throw new Error(`Failed to connect to ${config.name} database`);
    }

    let backupFile;
    let command;

    // Build pg_dump command with options
    let pgDumpOptions = [];

    if (argv.schemaOnly) {
        pgDumpOptions.push('--schema-only');
        backupFile = path.join(backupsDir, `${env}_schema_${timestamp}.sql`);
    } else if (argv.dataOnly) {
        pgDumpOptions.push('--data-only');
        backupFile = path.join(backupsDir, `${env}_data_${timestamp}.sql`);
    } else {
        // Full backup with additional options
        pgDumpOptions.push('--verbose', '--clean', '--no-owner', '--no-privileges');
        backupFile = path.join(backupsDir, `${env}_backup_${timestamp}.sql`);
    }

    // Create the backup command
    const optionsString = pgDumpOptions.join(' ');
    command = `pg_dump ${optionsString} "${config.url}" > "${backupFile}"`;

    console.log(`💾 Creating ${config.name} database backup...`);
    console.log(`   File: ${path.basename(backupFile)}`);

    try {
        execSync(command, { stdio: 'inherit' });

        // Compress if requested
        if (argv.compress) {
            console.log('🗜️ Compressing backup file...');
            const compressedFile = backupFile + '.gz';
            const compressCommand = `gzip -c "${backupFile}" > "${compressedFile}"`;
            execSync(compressCommand, { stdio: 'inherit' });
            fs.unlinkSync(backupFile); // Remove uncompressed file
            backupFile = compressedFile;
        }

        // Get file size
        const stats = fs.statSync(backupFile);
        const fileSize = (stats.size / (1024 * 1024)).toFixed(2);

        console.log(`✅ ${config.name} backup created successfully: ${backupFile}`);
        console.log(`   Size: ${fileSize} MB`);

        return backupFile;
    } catch (error) {
        console.error('❌ Error: pg_dump command failed.');
        console.error('   Ensure PostgreSQL tools are installed and in PATH.');
        console.error('   Install PostgreSQL from https://www.postgresql.org/download/ and add bin directory to PATH.');

        // Clean up failed backup file if it exists
        if (fs.existsSync(backupFile)) {
            fs.unlinkSync(backupFile);
        }
        throw error;
    }
}

// Restore function for PostgreSQL
function restore(env, file) {
    if (!file) {
        throw new Error('--file is required for restore action.');
    }

    const config = getDbConfig(env);
    let backupPath = path.resolve(file);

    // Handle compressed files
    let decompressNeeded = false;
    if (backupPath.endsWith('.gz')) {
        console.log('🗜️ Decompressing backup file...');
        const decompressedPath = backupPath.replace('.gz', '');
        const decompressCommand = `gzip -dc "${backupPath}" > "${decompressedPath}"`;
        execSync(decompressCommand, { stdio: 'inherit' });
        backupPath = decompressedPath;
        decompressNeeded = true;
    }

    if (!fs.existsSync(backupPath)) {
        throw new Error(`Backup file does not exist: ${backupPath}`);
    }

    console.log(`🔍 Testing connection to ${config.name} database...`);
    if (!testConnection(config)) {
        throw new Error(`Failed to connect to ${config.name} database`);
    }

    console.log(`🔄 Restoring ${config.name} database from backup...`);
    console.log(`   File: ${path.basename(file)}`);

    // For safety, use psql with single transaction and exit on error
    const command = `psql "${config.url}" --set ON_ERROR_STOP=on -f "${backupPath}"`;

    try {
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ ${config.name} database restored successfully from: ${file}`);
    } catch (error) {
        console.error('❌ Error: Restore failed.');
        console.error('   Please check the backup file and database connection.');
        throw error;
    } finally {
        // Clean up decompressed file if we created it
        if (decompressNeeded && fs.existsSync(backupPath)) {
            fs.unlinkSync(backupPath);
        }
    }
}

// List available backups
function listBackups(env) {
    const files = fs.readdirSync(backupsDir);
    const envBackups = files
        .filter(file => file.startsWith(env + '_'))
        .sort()
        .reverse();

    if (envBackups.length === 0) {
        console.log(`No backups found for ${env} environment.`);
        return;
    }

    console.log(`\n📂 Available backups for ${env} environment:`);
    envBackups.forEach(file => {
        const filePath = path.join(backupsDir, file);
        const stats = fs.statSync(filePath);
        const size = (stats.size / (1024 * 1024)).toFixed(2);
        const modified = stats.mtime.toLocaleString();
        console.log(`   ${file} (${size} MB) - ${modified}`);
    });
}

// Main execution
try {
    if (argv.action === 'backup') {
        backup(argv.env);
    } else if (argv.action === 'restore') {
        restore(argv.env, argv.file);
    } else if (argv.action === 'list') {
        listBackups(argv.env);
    }
} catch (error) {
    console.error('💥 Error:', error.message);
    process.exit(1);
}