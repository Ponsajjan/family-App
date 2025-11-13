
const isProduction = process.env.NODE_ENV === 'production';

const databaseConfig = {
    type: isProduction ? 'postgresql' : 'sqlite',
    sqlite: {
        path:
            process.env.SQLITE_DB_PATH ||
            (process.env.CREATE_NEW_SQLITE_DB === 'true' ? './dev_new.db' : './dev.db'),
    },
    postgresql: {
        url:
            process.env.DATABASE_URL ||
            '',
    },
    url: '',
};

// Construct final URL based on type
databaseConfig.url =
    databaseConfig.type === 'sqlite'
        ? `file:${databaseConfig.sqlite.path}`
        : databaseConfig.postgresql.url;

export default databaseConfig;
