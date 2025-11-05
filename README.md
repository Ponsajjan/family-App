# Database Configuration

This project supports both SQLite (for development) and PostgreSQL (for production) databases.

## Configuration

The database type is automatically selected based on the `NODE_ENV` environment variable:
- `NODE_ENV=production`: Uses PostgreSQL
- Otherwise: Uses SQLite

## Environment Variables

### PostgreSQL (Production)
- `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:pass@localhost:5432/db`)

### SQLite (Development)
- `SQLITE_DB_PATH`: Path to the SQLite database file (default: `./dev.db`)
- `CREATE_NEW_SQLITE_DB`: Set to `true` to create a new SQLite database at `./dev_new.db` (default: `false`)

## Usage

To switch to PostgreSQL for production, set `NODE_ENV=production` and provide a valid `DATABASE_URL`.

For development with SQLite, ensure `NODE_ENV` is not set to `production` (or set it to `development`).

To create a new SQLite database, set `CREATE_NEW_SQLITE_DB=true`.

## Example .env file

```env
# For development (SQLite)
NODE_ENV=development
SQLITE_DB_PATH=./dev.db
CREATE_NEW_SQLITE_DB=false

# For production (PostgreSQL)
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@localhost:5432/db
