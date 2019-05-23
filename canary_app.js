(function() {
  var childProcess = require("child_process");
  var oldFork = childProcess.fork;
  function myFork() {
    console.log("fork called");
    console.log(arguments);
    var result = oldFork.apply(this, arguments);
    return result;
  }
  childProcess.fork = myFork;
})();

(function() {
  var childProcess = require("child_process");
  var oldSpawn = childProcess.spawn;
  function mySpawn() {
    console.log("spawn called");
    console.log(arguments);
    var result = oldSpawn.apply(this, arguments);
    return result;
  }
  childProcess.spawn = mySpawn;
})();

const express = require("express"),
  cluster = require("cluster"),
  numCPUs = require("os").cpus().length,
  { readFileSync } = require("fs"),
  logger = require("./api/utils/Logger"),
  gTs = require("./api/utils/getTimestamp"),
  https = require("https"),
  path = require("path"),
  logDirectory = path.join(__dirname, "log"),
  utilities = require("./api/utils/utils"),
  session = require("cookie-session"),
  CONFIG = require("./api/config/config"),
  httpsCredentials = {
    key: readFileSync(CONFIG.https_key, "utf8"),
    cert: readFileSync(CONFIG.https_cert, "utf8"),
    passphrase: CONFIG.https_passphrase
  },
  // httpsCredentials = {
  //   key: readFileSync(CONFIG.https_key, "utf8"),
  //   cert: readFileSync(
  //     CONFIG.https_fullChain,
  //     "utf8"
  //   ) /*,
  //   passphrase: CONFIG.https_passphrase*/
  // },
  flash = require("connect-flash"),
  cors = require("cors"),
  compression = require("compression"),
  helmet = require("helmet"),
  morgan = require("morgan"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  passport = require("passport"),
  isAuthorized = require("./api/middleware/isAuthorized"),
  pool = require("./api/utils/mySQLPool"),
  pool_a = require("./api/utils/mySQLPool_api"),
  socketIo = require("socket.io"),
  chokidar = require("chokidar");

// function getRandomInt(min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }
//
// function getRandomFloat(min, max) {
//   return Math.random() * (max - min) + min;
//
//   let rMin = getRandomInt(0, 20),
//     rMax = getRandomInt(20, 135);
// }
// console.log(
//   getRandomFloat(getRandomInt(0, 20), getRandomInt(20, 135)).toFixed(2)
// );
// if (cluster.isMaster) {
//   for (var i = 0; i < numCPUs; i++) {
//     // Create a worker
//     cluster.fork();
//   }
// } else {
// let i = 1;
// const funcone = () => {
//   console.log(";lklk");
// };
// setTimeout(function run() {
//   funcone();
//   setTimeout(run, 100);
// }, 100);
let appendName = require("./api/utils/removeSpacesCappIt"),
  test = "Mini greenhouse";
console.log(appendName(test));

require("./api/config/passport-local")(passport);
logger.log("starting app...");
// for (var i = 0; i < 300; i++) {
//   if (i % 4 == 0) {
//     console.log(i, " is a multiple of 4...");
//   }
// }

//
// const testFunc = (one, two, three) => {
//   logger.log(`one: ${one} two: ${two} three: ${three}`);
// };
// setTimeout(testFunc("blah", "haaa", "waaaa..."), 5000);

// let treatmentFile = "testingIt_weatherData_delayed.json",
//   latitude = 49.124,
//   longitude = -120.1321,
//   endTime = "2019-05-10",
//   treatmentId = 766;
// const getWeatherData = async (
//   treatmentFile,
//   latitude,
//   longitude,
//   endTime,
//   treatmentId
// ) => {
//   logger.log(`treatmentFile: 1 - ${treatmentFile}`);
//   logger.log(`latitude: 2 - ${latitude}`);
//   logger.log(`longitude: 3 - ${longitude}`);
//   logger.log(`endTime: 4 - ${endTime}`);
//   logger.log(`treatmentId: 5 - ${treatmentId}`);
// };

// let t1 = "49.124",
//   t2 = "-120.1321";
// logger.log(
//   `t1: ${t1} parsed: ${parseFloat(t1)} t2: ${t2} parsed: ${parseFloat(t2)}`
// );
//
// const delayProcessing = async (
//   treatmentFile,
//   latitude,
//   longitude,
//   endTime,
//   treatmentId
// ) => {
//   await sleep(5000);
//   getWeatherData(treatmentFile, latitude, longitude, endTime, treatmentId);
// };
// const sleep = ms => {
//   return new Promise(resolve => {
//     setTimeout(resolve, ms);
//   });
// };
//
// delayProcessing(treatmentFile, latitude, longitude, endTime, treatmentId);

// console.log("lkjhlkjlkjlkj");

// console.log(
//   fileExists("./weatherFiles/TT49_0031_1083558489_weatherData.json"),
//   " <<<<<======"
// );

// let Clock = require("./api/utils/weatherCap_emitter_class"),
//   clock = Clock();
// clock.on("tic", function(t) {
//   console.log("tic:", t);
// });
// clock.on("toc", function(t) {
//   console.log("toc:", t);
// });
// let pathTo = `./weatherFiles/TT13_0008_108355848_weatherData.json`;
// clock.start(pathTo, "49.086102", "-122.402603");
// let name = 'TT49_0031_1083558489_weatherData.json'
// tableName = name.substring(0,name.indexOf('.json'));
// console.log(tableName, ' <<<<<');
// const getWeatherData = require('./api/utils/getWeatherData');
// console.log(getWeatherData("49.086102", "-122.402603",0));

Object.assign = require("object-assign");
const app = express()
    .set("view engine", "ejs")
    .set("trust proxy", true)
    .use("/uploads", express.static("uploads"))
    // .use(morgan("combined", { stream: accessLogStream }))
    .use(morgan("dev"))
    .use(cors())
    .use(compression())
    .use(helmet())
    .use(cookieParser())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(
      session({
        name: CONFIG.session_key,
        secret: CONFIG.session_secret,
        cookie: {
          path: "/",
          // httpOnly: true,
          // secure: true,
          maxAge: 60000
        },
        resave: false,
        saveUninitialized: false
      })
    )
    .use(express.static("public"))
    .use(passport.initialize())
    .use(passport.session())
    .use(flash()),
  secureServer = https.createServer(httpsCredentials, app),
  io = socketIo(secureServer);

// secure routes
app.all("/api/user*", isAuthorized);
app.all("/api/canarys*", isAuthorized);
app.all("/api/cubs*", isAuthorized);
app.all("/api/calibrate*", isAuthorized);
app.all("/api/service_request*", isAuthorized);
app.all("/api/industry_sectors*", isAuthorized);

// assign routes
require("./api/routes/auth")(app, passport);
require("./api/routes/user")(app, passport);

require("./api/routes/endpointTesting")(app);
require("./api/routes/canary")(app, passport);
require("./api/routes/gateways")(app, passport);
// require("./api/routes/cubs")(app, passport);
require("./api/routes/technetInterface")(app, passport);
require("./api/routes/weatherCapture")(app);
require("./api/utils/weatherDelay")(app);

require("./api/routes/calibration")(app, passport);
require("./api/routes/service_request")(app, passport);
require("./api/routes/fix_tables")(app, passport);
// require("./api/routes/capture_treatment")(
//   app,
//   passport /*, SessionStore_cust*/
// );
// require("./api/routes/treatment_capture_alt")(app);

require("./api/routes/treatment_capture")(app);
// require("./api/routes/treatmentWeather")(app);
require("./api/routes/viewTreatments_bk")(app, passport);
require("./api/routes/dash_overview")(app, passport);
require("./api/routes/industry_sectors")(app, passport);

logger.log("finished config...");

console.log(`${logger.count} logs total`);
logger.logs.map(log => console.log(`   ${log.message}`));

// when status is 404, error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (404 === err.status) {
    res.format({
      "text/plain": () => {
        res.send({ message: "not found Data" });
      },
      "text/html": () => {
        res.render("404.ejs");
      },
      "application/json": () => {
        res.send({ message: "not found Data" });
      },
      default: () => {
        res.status(406).send("Not Acceptable");
      }
    });
  }

  // when status is 500, error handler
  if (500 === err.status) {
    res.render("500.ejs", {
      title: "500: Internal Server Error",
      error: err
    });
  }
});

console.log(`${logger.count} logs total`);
logger.logs.map(log => console.log(`   ${log.message}`));

module.exports = app;

if (require.main === module) {
  secureServer.listen(CONFIG.main_port, CONFIG.main_ip_address, () =>
    console.log(`Express app listening securly on ${CONFIG.main_port}`)
  );
}
// }
