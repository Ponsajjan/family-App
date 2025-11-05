
console.log('hello kitty1', process.env.NODE_ENV)
console.log('hello kitty2', process.env.SQLITE_DB_PATH)
console.log('hello kitty3', process.env.DATABASE_URL)
console.log('hello kitty4', process.env.NODE_ENV)

const isProduction = process.env.NODE_ENV === 'development';

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
            'postgresql://user:pass@localhost:5432/db',
    },
    url: '',
};

// Construct final URL based on type
databaseConfig.url =
    databaseConfig.type === 'sqlite'
        ? `file:${databaseConfig.sqlite.path}`
        : databaseConfig.postgresql.url;

export default databaseConfig;
console.log('hello kitty5', databaseConfig)

