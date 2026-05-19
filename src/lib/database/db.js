/**
 * ====================================================
 * LUMORA AI - Database Connection Manager
 * ====================================================
 * Manages MySQL connection pool with automatic reconnection.
 * Uses mysql2/promise for async/await support.
 */

import mysql from 'mysql2/promise';

// Connection pool singleton
let pool = null;

/**
 * Get or create database connection pool
 * @returns {Promise<mysql.Pool>} MySQL connection pool
 */
export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      database: process.env.DB_NAME || 'lumora_ai',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      // Security: prevent SQL injection at driver level
      namedPlaceholders: true,
    });
  }
  return pool;
}

/**
 * Execute a parameterized query (prevents SQL injection)
 * @param {string} sql - SQL query with ? placeholders
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
export async function query(sql, params = []) {
  const db = getPool();
  try {
    const [results] = await db.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  }
}

/**
 * Execute a transaction with multiple queries
 * @param {Function} callback - Async function receiving connection
 * @returns {Promise<any>} Transaction result
 */
export async function transaction(callback) {
  const db = getPool();
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Test database connection
 * @returns {Promise<boolean>} Connection status
 */
export async function testConnection() {
  try {
    const db = getPool();
    await db.query('SELECT 1');
    return true;
  } catch (error) {
    return false;
  }
}

export default { getPool, query, transaction, testConnection };
