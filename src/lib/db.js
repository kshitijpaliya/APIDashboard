// // lib/db.js
// const { Pool } = require("pg");

// const pool = new Pool({
//   connectionString: process.env.NEON_DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
//   idleTimeoutMillis: 5000,
//   connectionTimeoutMillis: 2000,
// });

// async function query(text, params) {
//   let client;
//   try {
//     client = await pool.connect();
//     console.log("Executing query:", text, "with params:", params);
//     const start = Date.now();
//     const result = await client.query(text, params);
//     const duration = Date.now() - start;
//     console.log(`Query completed in ${duration}ms`);
//     return result;
//   } catch (err) {
//     console.error("Query error:", err);
//     throw err;
//   } finally {
//     if (client) client.release();
//   }
// }

// module.exports = {
//   query,
// };
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
});

async function query(text, params) {
  const client = await pool.connect();
  try {
    const start = Date.now();
    const result = await client.query(text, params);
    const duration = Date.now() - start;
    console.log(`Executed query in ${duration}ms`, { text, params });
    console.log("Query result:", result.rows);
    return result;
  } catch (err) {
    console.error("Query error:", { text, params }, err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { query };
