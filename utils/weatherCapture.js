const { stat } = require("fs"),
  logger = require("./Logger"),
  minutes = 1,
  theInterval = minutes * 60 * 100,
  data = process.argv.slice(2),
  treatmentFile = data[0],
  latitude = data[1],
  longitude = data[2];

const getWeatherData = async (treatmentFile, latitude, longitude) => {
  const treatmentFilepath = `../../weatherFiles/${treatmentFile}`,
    dbTable = treatmentFile.substring(0, treatmentFile.indexOf(".json")),
    insertQuery = `INSERT INTO ${dbTable} SET ?`;
  let captureInterval;

  stat(treatmentFilepath, function(err) {
    if (!err) {
      console.log("file or directory exists");
      captureInterval = setInterval(async () => {
        try {
          const forecast = await darksky
            .options({
              latitude,
              longitude,
              // timezone: "America/Vancouver",
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
            // apparentTemperature = currentData.apparentTemperature,
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
              // apparentTemperature: apparentTemperature,
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

          logger.log("currentInsert \n", currentInsert);
          // insertData(insertQuery, currentInsert);
        } catch (e) {
          console.log(e);
        }
      }, theInterval);
    } else if (err.code === "ENOENT") {
      console.log("file or directory does not exist");
      clearInterval(captureInterval);
    }
  });

  // captureInterval = setInterval(async () => {
  //   // exists(treatmentFilepath, async exists => {
  //   //   if (!exists) {
  //   //     console.log("not not bnot boit ");
  //   //
  //   //     clearInterval(captureInterval);
  //   //   } else {
  //       try {
  //         const forecast = await darksky
  //           .options({
  //             latitude,
  //             longitude,
  //             // timezone: "America/Vancouver",
  //             units: "si",
  //             language: "en",
  //             exclude: ["daily", "hourly", "minutely", "flags"]
  //           })
  //           .get();
  //         const currentData = forecast.currently,
  //           insertTime = moment
  //             .unix(currentData.time)
  //             .format("YYYY-MM-DD hh:mm:ss"),
  //           summary = currentData.summary,
  //           nearestStormDistance = currentData.nearestStormDistance,
  //           nearestStormBearing = currentData.nearestStormBearing,
  //           precipIntensity = currentData.precipIntensity,
  //           precipProbability = currentData.precipProbability,
  //           temperature = currentData.temperature,
  //           apparentTemperature = currentData.apparentTemperature,
  //           dewPoint = currentData.dewPoint,
  //           humidity = currentData.humidity,
  //           pressure = currentData.pressure,
  //           windSpeed = currentData.windSpeed,
  //           windGust = currentData.windGust,
  //           windBearing = currentData.windBearing,
  //           cloudCover = currentData.cloudCover,
  //           uvIndex = currentData.uvIndex,
  //           visibility = currentData.visibility,
  //           ozone = currentData.ozone,
  //           currentInsert = {
  //             insertTime: insertTime,
  //             summary: summary,
  //             nearestStormDistance: nearestStormDistance,
  //             nearestStormBearing: nearestStormBearing,
  //             precipIntensity: precipIntensity,
  //             precipProbability: precipProbability,
  //             temperature: temperature,
  //             apparentTemperature: apparentTemperature,
  //             dewPoint: dewPoint,
  //             humidity: humidity,
  //             pressure: pressure,
  //             windSpeed: windSpeed,
  //             windGust: windGust,
  //             windBearing: windBearing,
  //             cloudCover: cloudCover,
  //             uvIndex: uvIndex,
  //             visibility: visibility,
  //             ozone: ozone
  //           };
  //
  //         console.log("currentInsert \n", currentInsert);
  //         insertData(insertQuery, currentInsert);
  //       } catch (e) {
  //         console.log(e);
  //       }
  //   //   }
  //   // });
  // }, theInterval);
  //
  // // captureInterval = setInterval(async () => {
  // //   exists(treatmentFilepath, async exists => {
  // //     if (!exists) {
  // //       console.log("not not bnot boit ");
  // //
  // //       clearInterval(captureInterval);
  // //     } else {
  // //       console.log("it exists!!! ", dbTable);
  // //       try {
  // //         const forecast = await darksky
  // //           .options({
  // //             latitude,
  // //             longitude,
  // //             // timezone: "America/Vancouver",
  // //             units: "si",
  // //             language: "en",
  // //             exclude: ["daily", "hourly", "minutely", "flags"]
  // //           })
  // //           .get();
  // //         const currentData = forecast.currently,
  // //           insertTime = moment
  // //             .unix(currentData.time)
  // //             .format("YYYY-MM-DD hh:mm:ss"),
  // //           summary = currentData.summary,
  // //           nearestStormDistance = currentData.nearestStormDistance,
  // //           nearestStormBearing = currentData.nearestStormBearing,
  // //           precipIntensity = currentData.precipIntensity,
  // //           precipProbability = currentData.precipProbability,
  // //           temperature = currentData.temperature,
  // //           apparentTemperature = currentData.apparentTemperature,
  // //           dewPoint = currentData.dewPoint,
  // //           humidity = currentData.humidity,
  // //           pressure = currentData.pressure,
  // //           windSpeed = currentData.windSpeed,
  // //           windGust = currentData.windGust,
  // //           windBearing = currentData.windBearing,
  // //           cloudCover = currentData.cloudCover,
  // //           uvIndex = currentData.uvIndex,
  // //           visibility = currentData.visibility,
  // //           ozone = currentData.ozone,
  // //           currentInsert = {
  // //             insertTime: insertTime,
  // //             summary: summary,
  // //             nearestStormDistance: nearestStormDistance,
  // //             nearestStormBearing: nearestStormBearing,
  // //             precipIntensity: precipIntensity,
  // //             precipProbability: precipProbability,
  // //             temperature: temperature,
  // //             apparentTemperature: apparentTemperature,
  // //             dewPoint: dewPoint,
  // //             humidity: humidity,
  // //             pressure: pressure,
  // //             windSpeed: windSpeed,
  // //             windGust: windGust,
  // //             windBearing: windBearing,
  // //             cloudCover: cloudCover,
  // //             uvIndex: uvIndex,
  // //             visibility: visibility,
  // //             ozone: ozone
  // //           };
  // //
  // //         console.log("currentInsert \n", currentInsert);
  // //         insertData(insertQuery, currentInsert);
  // //       } catch (e) {
  // //         console.log(e);
  // //       }
  // //     }
  // //   });
  // // }, theInterval);
};

getWeatherData(treatmentFile, latitude, longitude);
