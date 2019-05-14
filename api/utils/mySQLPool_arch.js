const mysql = require("mysql2"),
  util = require("util"),
  CONFIG = require("../config/config"),
  pool_r = mysql.createPool({
    connectionLimit: 5,
    host: CONFIG.db_host,
    port: CONFIG.db_port,
    user: CONFIG.db_user_main,
    password: CONFIG.db_password_main,
    database: CONFIG.db_name_arch,
    waitForConnections: true,
    supportBigNumbers: true,
    bigNumberStrings: true,
    multipleStatements: true
  });

pool_r.on("acquire", function(connection) {
  console.log('Connection  `pool_arch` %d acquired', connection.threadId);
});
pool_r.on("enqueue", function() {
  console.log("Waiting for available  `pool_arch` connection slot");
});
pool_r.on("release", function(connection) {
  console.log('Connection  `pool_arch` %d released', connection.threadId);
});
pool_r.query = util.promisify(pool_r.query);

global.pool_a = pool_r;

module.exports.pool_a = pool_r;
