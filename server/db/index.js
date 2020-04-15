const Pool = require("pg").Pool;
require("dotenv").config();

module.exports = new Pool({
  user: process.env.USER_DB,
  host: process.env.HOST_DB,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT_DB
});
