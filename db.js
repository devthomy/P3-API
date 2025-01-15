const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:6MAGSIhJ2iyT@ep-shy-breeze-a571p1aa.us-east-2.aws.neon.tech/neondb?sslmode=require",
});

module.exports = pool;
