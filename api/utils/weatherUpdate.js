const { exists } = require("fs"),
  util = require("util"),
  CONFIG = require("../config/config"),
  pad = require("./padNumbers"),
  moment = require("moment"),
  toDate = require("normalize-date"),
  DarkSky = require("dark-sky"),
  darksky = new DarkSky(CONFIG.darksky_apiKey),
  theInterval = 1000 * 60 * 60 * 24,
  mysql = require("mysql2"),
  connection = mysql.createConnection({
    host: CONFIG.db_host,
    user: CONFIG.db_user_main,
    password: CONFIG.db_password_main,
    database: CONFIG.db_name_api
  }),
  data = process.argv.slice(2),
  id = data[0],
  treatmentFile = data[1],
  latitude = data[2],
  longitude = data[3];

connection.query = util.promisify(connection.query);

// INSERT THE DATA INTO TREATMENT WEATHER TABLE
const insertData = async (query, data) => {
  try {
    let inserted = await connection.query(query, data);
    if (inserted.affectedRows == 1) console.dir(inserted, { colors: true });
  } catch (e) {
    console.dir(e, { colors: true });
  }
};

const getWeatherData = async (id, treatmentFile, time, latitude, longitude) => {
  const treatmentId = id,
    dbTable = treatmentFile.substring(0, treatmentFile.indexOf(".json")),
    treatmentFilepath = `./weatherFiles/${dbTable}`,
    updateQuery = `UPDATE _treatments SET ? WHERE id=?`;
  try {
    const forecast = await darksky
      .options({
        latitude: latitude,
        longitude: longitude,
        time: time,
        units: "si",
        language: "en",
        exclude: ["hourly", "minutely", "flags"]
      })
      .get();
    const pastData = forecast.daily.data[0],
      temperatureHighTimeAC = moment
        .unix(pastData.temperatureHighTime)
        .format("YYYY-MM-DD hh:mm:ss"),
      temperatureLowTimeAC = moment
        .unix(pastData.temperatureLowTime)
        .format("YYYY-MM-DD hh:mm:ss"),
      windGustTimeAC = moment
        .unix(pastData.windGustTime)
        .format("YYYY-MM-DD hh:mm:ss"),
      uvIndexMaxTimeAC = moment
        .unix(pastData.uvIndexTime)
        .format("YYYY-MM-DD hh:mm:ss"),
      ozoneAC = pastData.ozone,
      updateObj = [
        {
          temperatureHighTime_actual: temperatureHighTimeAC,
          temperatureLowTime_actual: temperatureLowTimeAC,
          uvIndexMaxTime_actual: uvIndexMaxTimeAC,
          cloudCover_actual: pastData.cloudCover,
          ozone_actual: ozoneAC
        },
        id
      ];

    insertData(updateQuery, updateObj);
  } catch (e) {
    console.log(e);
  }
};

getWeatherData(id, treatmentFile, time, latitude, longitude);
