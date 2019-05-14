const { stat } = require("fs"),
  util = require("util"),
  CONFIG = require("../config/config"),
  logger = require("./Logger"),
  deleteFile = require("../utils/deleteFile"),
  pad = require("./padNumbers"),
  moment = require("moment"),
  toDate = require("normalize-date"),
  DarkSky = require("dark-sky"),
  darksky = new DarkSky(CONFIG.darksky_apiKey),
  minutes = 1,
  theInterval = minutes * 60 * 1000,
  mysql = require("mysql2"),
  connection = mysql.createConnection({
    host: CONFIG.db_host,
    user: CONFIG.db_user_main,
    password: CONFIG.db_password_main,
    database: CONFIG.db_name_api
  }),
  data = process.argv.slice(2),
  treatmentFile = data[0],
  latitude = data[1],
  longitude = data[2],
  endTime = data[3],
  treatmentId = data[4];

connection.query = util.promisify(connection.query);

const getWeatherData = async (id, latitude, longitude, endTime) => {
  const insertQuery = `UPDATE _treatments SET ? WHERE id =?`;
  let captureInterval,
    captureData = null;

  captureInterval = setInterval(async () => {

      try {
        const forecast = await darksky
          .options({
            latitude: latitude,
            longitude: longitude,
            time: endTime,
            units: "si",
            language: "en",
            exclude: ["currently", "hourly", "minutely", "flags"]
          })
          .get();
        // console.log(forecast.daily.data[0]);
        const dailyData = forecast.daily.data[0],
          temperatureHighTimeAC = moment
            .unix(dailyData.temperatureHighTime)
            .format("YYYY-MM-DD hh:mm:ss"),
          temperatureLowTimeAC = moment
            .unix(dailyData.temperatureLowTime)
            .format("YYYY-MM-DD hh:mm:ss"),
          windGustTimeAC = moment
            .unix(dailyData.windGustTime)
            .format("YYYY-MM-DD hh:mm:ss"),
          uvIndexMaxTimeAC = moment
            .unix(dailyData.uvIndexTime)
            .format("YYYY-MM-DD hh:mm:ss"),
          upDateInsert = {
            temperatureHighTime_actual: temperatureHighTimeAC,
            temperatureLowTime_actual: temperatureLowTimeAC,
            windGustTime_actual: windGustTimeAC,
            uvIndexMaxTime_actual: uvIndexMaxTimeAC,
            cloudCover_actual: dailyData.cloudCover,
            ozone_actual: dailyData.ozone
          },
          insertObj = [upDateInsert, treatmentId];
        try {
          let insertResult = await connection.query(insertQuery, [
            upDateInsert,
            treatmentId
          ]);
          if (insertResult.affectedRows == 1)
            logger.log(`${insertResult.affectedRows} record inserted in db`);
          // console.log("\x07");
          // console.log("\x07");

        } catch (e) {
          logger.log(` weather data db insert ERR: ${e}`);
        }
      } catch (e) {
        logger.log(`Weather API  capture failure:: ${e}`);
      }
    }
  }, theInterval);
  // stat(treatmentFilepath, async err => {
  //   if (!err) {
  //     try {
  //       const forecast = await darksky
  //         .options({
  //           latitude: latitude,
  //           longitude: longitude,
  //           time: endTime,
  //           units: "si",
  //           language: "en",
  //           exclude: ["currently", "hourly", "minutely", "flags"]
  //         })
  //         .get();
  //       // console.log(forecast.daily.data[0]);
  //       const dailyData = forecast.daily.data[0],
  //         temperatureHighTimeAC = moment
  //           .unix(dailyData.temperatureHighTime)
  //           .format("YYYY-MM-DD hh:mm:ss"),
  //         temperatureLowTimeAC = moment
  //           .unix(dailyData.temperatureLowTime)
  //           .format("YYYY-MM-DD hh:mm:ss"),
  //         windGustTimeAC = moment
  //           .unix(dailyData.windGustTime)
  //           .format("YYYY-MM-DD hh:mm:ss"),
  //         uvIndexMaxTimeAC = moment
  //           .unix(dailyData.uvIndexTime)
  //           .format("YYYY-MM-DD hh:mm:ss"),
  //         upDateInsert = {
  //           temperatureHighTime_actual: temperatureHighTimeAC,
  //           temperatureLowTime_actual: temperatureLowTimeAC,
  //           windGustTime_actual: windGustTimeAC,
  //           uvIndexMaxTime_actual: uvIndexMaxTimeAC,
  //           cloudCover_actual: dailyData.cloudCover,
  //           ozone_actual: dailyData.ozone
  //         },
  //         insertObj = [upDateInsert, treatmentId];
  //       try {
  //         let insertResult = await connection.query(insertQuery, [
  //           upDateInsert,
  //           treatmentId
  //         ]);
  //         if (insertResult.affectedRows == 1)
  //           logger.log(`${insertResult.affectedRows} record inserted in db`);
  //         console.log("\x07");
  //         console.log("\x07");
  //
  //         // DELETE CONTROLLING FILE
  //         deleteFile(treatmentFilepath);
  //       } catch (e) {
  //         logger.log(` weather data db insert ERR: ${e}`);
  //       }
  //     } catch (e) {
  //       logger.log(`Weather API  capture failure:: ${e}`);
  //     }
  //   } else if (err.code === "ENOENT") {
  //     // logger.log("./weatherFiles/testingIt_weatherData.json");
  //
  //     logger.log(`${treatmentFilepath} does not exist`);
  //     clearInterval(captureInterval);
  //   }
  // });
};

getWeatherData(treatmentFile, latitude, longitude, endTime, treatmentId);
