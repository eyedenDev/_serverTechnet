const logger = require("../utils/Logger"),
  ExpressData = require("../middleware/ExpressData"),
  { fork, spawn } = require("child_process"),
  { createWriteStream } = require("fs"),
  weatherChild = require("../utils/weatherChild");

module.exports = function(app) {
  app.get("/capTest", (req, res) => {
    const props = new ExpressData(req).props,
      treatmentData = [props.tf, parseFloat(props.lt), parseFloat(props.ln)];

    console.log(treatmentData);

    weatherChild("_weatherCaptureActive.js", treatmentData);
  });

  app.post("/api/treatment/startWeather", (req, res) => {
    const { treatmentFile, latitude, longitude } = req.body,
      treatmentData = [treatmentFile, latitude, longitude];
    logger.log(treatmentData);
    weatherChild("_weatherCaptureActive.js", treatmentData);
    res.status(200).json({
      status: "Treatment weather data capture started..."
    });
  });

  app.post("/api/treatment/startWeather2", async (req, res) => {
    const { treatmentFile, latitude, longitude } = req.body,
      treatmentData = [treatmentFile, latitude, longitude],
      dbTable = treatmentFile.substring(0, treatmentFile.indexOf(".json")),
      insertQuery = `INSERT INTO ${dbTable} SET ?`;
    try {
      let rslt = await pool.query(insertQuery, {
        summary: "kjhkjhkh",
        nearestStormDistance: 120.02
      });
    } catch (e) {
      logger.log(`insert test err${e}`);
    }
    // console.log(treatmentData);
    // weatherChild("_weatherCaptureActive.js", treatmentData);
  });

  app.post("/capTestOld", (req, res) => {
    let treatmentData = [
      "testingIt_weatherData_delayed.json",
      49.124,
      -120.1321,
      "2019-05-09",
      784
    ];
    weatherChild("_weatherCaptureDelayed.js", treatmentData);
  });

  app.get("/endpoint1", (req, res) => {
    // fork another process
    const treatmentData = [
        "TT49_0031_1083558489_weatherData.json",
        49.0861,
        -122.4026
      ],
      process = fork("./send_mail.js", treatmentData, {
        cwd: "./api/utils/",
        silent: true,
        detached: true,
        stdio: "ignore"
      });

    const mails = req.body.emails;
    // send list of e-mails to forked process
    process.send({ mails });
    // listen for messages from forked process
    process.on("message", message => {
      logger.log(`Number of mails sent ${message}`);
    });
    return res.json({ status: true, sent: true });
  });

  app.get("/endpoint", async (req, res) => {
    const treatmentData = [
        "TT49_0031_1083558489_weatherData.json",
        49.0861,
        -122.4026
      ],
      treatmentData2 = {
        treatmentTable: "TT49_0031_1083558489_weatherDataNOT.json",
        latitude: 49.0861,
        longitude: -122.4026
      },
      elogFileName = "testingIt-{}_Errs.log";
    captureErrWrite = createWriteStream(`./captureErrs/${elogFileName}`, {
      flags: "a"
    }); /*,
      sampleQuery = "insert into testingIt_weatherData set ? ",
      insertData = {
        insertTime: "2019-03-28 01:10:15",
        summary: "blah blah blah....",
        nearestStormDistance: 23.45,
        nearestStormBearing: 124.25,
        precipIntensity: 56.2,
        precipProbability: 98.2,
        temperature: 32.1,
        dewPoint: 2.3,
        humidity: 95.2,
        pressure: 241.2,
        windSpeed: 123,
        windGust: 124,
        windBearing: 10.9,
        cloudCover: 0.5,
        uvIndex: 1,
        visibility: 2.1,
        ozone: 320.0
      };*/
    // try {
    //   await pool.query(sampleQuery, insertData);
    // } catch (e) {
    //   console.log(e);
    // }
    // process = fork("weatherTest.js", treatmentData, {
    //   cwd: "./api/utils/",
    //   silent: true,
    //   detached: true,
    //   stdio: "ignore"
    // });

    process = spawn("node", "weatherTest.js", treatmentData, {
      cwd: "./api/utils/",
      silent: true,
      detached: true,
      stdio: "ignore"
    });
    // process.send(treatmentData2);
    // // listen for messages from forked process
    // process.on("message", message => {
    //   console.dir(message, { colors: true });
    // });
    return res.json({ status: true, sent: true });
  });

  app.put("/test", function(req, res, next) {
    console.log(req.body);
    var u = req.body.u;
    console.log(u);
    var cp = require("child_process");
    var c = cp.spawn("node", ["yourtest.js", '"' + u + '"'], {
      cwd: "./api/utils/",
      detach: true
    });
    c.unref();
    res.sendStatus(200);
  });
};
