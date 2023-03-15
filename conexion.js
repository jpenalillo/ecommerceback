const { Pool } = require('pg')
const {POSTGRESQL_ADDON_HOST,POSTGRESQL_ADDON_DB,POSTGRESQL_ADDON_USER,POSTGRESQL_ADDON_PASSWORD,POSTGRESQL_ADDON_PORT} = require('./config')
const pool = new Pool({
host: POSTGRESQL_ADDON_HOST || 'localhost',
user: POSTGRESQL_ADDON_USER || 'postgres',
password: POSTGRESQL_ADDON_PASSWORD || '1234',
database: POSTGRESQL_ADDON_DB || 'plantas',
port:POSTGRESQL_ADDON_PORT,
allowExitOnIdle: true
})
module.exports = pool