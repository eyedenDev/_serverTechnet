const { stat } = require("fs"),
  util = require("util"),
  CONFIG = require("../config/config"),
  logger = require("./Logger"),
  pad = require("./padNumbers"),
  moment = require("moment"),
  toDate = require("normalize-date"),
  DarkSky = require("dark-sky"),
  darksky = new DarkSky(CONFIG.darksky_apiKey),
  minutes = 2,
  theInterval = minutes * 60 * 100,
  mysql = require("mysql2"),
  connection = mysql.createConnection({
    host: CONFIG.db_host,
    user: CONFIG.db_user_main,
    password: CONFIG.db_password_main,
    database: CONFIG.db_name_main
  }),
  data = process.argv.slice(2),
  treatmentFile = data[0],
  latitude = data[1],
  longitude = data[2];

connection.query = util.promisify(connection.query);

const getWeatherData = async (treatmentFile, latitude, longitude) => {
  const treatmentFilepath = `../../weatherFiles/${treatmentFile}`,
    dbTable = treatmentFile.substring(0, treatmentFile.indexOf(".json")),
    insertQuery = `INSERT INTO ${dbTable} SET ?`;
  let captureInterval,
    captureData = null;

  captureInterval = setInterval(async () => {
    // TEST IF FILE EXSTS
    stat(treatmentFilepath, function(err) {
      if (!err) {
        captureData = true;
        logger.log(`${treatmentFilepath} exists ${captureData}`);
      } else if (err.code === "ENOENT") {
        captureData = false;
        logger.log(`${treatmentFilepath} exists ${captureData}`);
        clearInterval(captureInterval);
      }
    });
    logger.log(`${treatmentFilepath} exists`);
    logger.log(`latitude: ${latitude}`);
    logger.log(`longitude: ${longitude}`);
    if (captureData) {
      try {
        const forecast = await darksky
          .options({
            latitude: latitude,
            longitude: longitude,
            units: "si",
            language: "en",
            exclude: ["daily", "hourly", "minutely", "flags"]
          })
          .get();
        const currentData = forecast.currently,
          insertTime = moment
            .unix(currentData.time)
            .format("YYYY-MM-DD hh:mm:ss"),
          summary = currentData.summary,
          nearestStormDistance = currentData.nearestStormDistance,
          nearestStormBearing = currentData.nearestStormBearing,
          precipIntensity = currentData.precipIntensity,
          precipProbability = currentData.precipProbability,
          temperature = currentData.temperature,
          dewPoint = currentData.dewPoint,
          humidity = currentData.humidity,
          pressure = currentData.pressure,
          windSpeed = currentData.windSpeed,
          windGust = currentData.windGust,
          windBearing = currentData.windBearing,
          cloudCover = currentData.cloudCover,
          uvIndex = currentData.uvIndex,
          visibility = currentData.visibility,
          ozone = currentData.ozone,
          currentInsert = {
            insertTime: insertTime,
            summary: summary,
            nearestStormDistance: nearestStormDistance,
            nearestStormBearing: nearestStormBearing,
            precipIntensity: precipIntensity,
            precipProbability: precipProbability,
            temperature: temperature,
            dewPoint: dewPoint,
            humidity: humidity,
            pressure: pressure,
            windSpeed: windSpeed,
            windGust: windGust,
            windBearing: windBearing,
            cloudCover: cloudCover,
            uvIndex: uvIndex,
            visibility: visibility,
            ozone: ozone
          };
        try {
          let insertResult = await connection.query(insertQuery, currentInsert);
          if (insertResult.affectedRows == 1)
            //console.log("\x07");
            logger.log(
              `${insertResult.affectedRows} record inserted in ${dbTable}`
            );
        } catch (e) {
          logger.log(` weather data db insert ERR: ${e}`);
        }
      } catch (e) {
        logger.log(`Weather API  capture failure:: ${e}`);
      }
    }
  }, theInterval);
};
getWeatherData(treatmentFile, latitude, longitude);
