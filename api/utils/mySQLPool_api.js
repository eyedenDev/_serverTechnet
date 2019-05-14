const mysql = require("mysql2"),
  util = require("util"),
  CONFIG = require("../config/config"),
  pool_a = mysql.createPool({
    connectionLimit: 10,
    host: CONFIG.db_host,
    port: CONFIG.db_port,
    user: CONFIG.db_user_main,
    password: CONFIG.db_password_main,
    database: CONFIG.db_name_api,
    waitForConnections: true,
    supportBigNumbers: true,
    bigNumberStrings: true,
    multipleStatements: true
  });

pool_a.on("acquire", function(connection) {
  // console.log('Connection  `pool_a` %d acquired', connection.threadId);
});
pool_a.on("enqueue", function() {
  // console.log("Waiting for available  `pool_a` connection slot");
});
pool_a.on("release", function(connection) {
  // console.log('Connection  `pool_a` %d released', connection.threadId);
});
pool_a.query = util.promisify(pool_a.query);

global.pool_a = pool_a;

module.exports.pool_a = pool_a;
