const mysql = require("mysql2"),
  util = require("util"),
  CONFIG = require("../config/config"),
  pool = mysql.createPool({
    connectionLimit: 5,
    host: CONFIG.db_host,
    port: CONFIG.db_port,
    user: CONFIG.db_user_main,
    password: CONFIG.db_password_main,
    database: CONFIG.db_name_main,
    waitForConnections: true,
    supportBigNumbers: true,
    bigNumberStrings: true,
    multipleStatements: true
  });

pool.on("acquire", function(connection) {
  console.log('Connection `pool` %d acquired', connection.threadId);
});
pool.on("enqueue", function() {
  console.log("Waiting for available `pool` connection slot");
});
pool.on("release", function(connection) {
  console.log('Connection  `pool` %d released', connection.threadId);
});
pool.query = util.promisify(pool.query);

global.pool = pool;

module.exports.pool = pool;
