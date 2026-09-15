import { Pool } from 'pg';
import { env } from './env.js';
import { logger } from './logger.js';
import { CREATE_USERS_TABLE_SQL } from '../modules/auth/user.model.js';

const pool = new Pool({
  user: env.PG_USER,
  host: env.PG_HOST,
  database: env.PG_DATABASE,
  password: env.PG_PASSWORD,
  port: env.PG_PORT,
  max: env.PG_MAX_POOL,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  logger.error({ err }, 'PostSQL connection error');
});

export const connectPostgres = async (): Promise<void> => {
  try {
    await pool.query('SELECT 1');
    await pool.query(CREATE_USERS_TABLE_SQL);
    logger.info('PostSQL Connected successfully');
  } catch (err) {
    logger.error({ err }, 'PostSQL connection error');
    throw err;
  }
};

export const disconnectPostgres = async (): Promise<void> => {
  try {
    await pool.end();
    logger.info('PostSQL disconnect successfully');
  } catch (err) {
    logger.error({ err }, 'PostSQL disconnect error');
    throw err;
  }
};
export default pool;
