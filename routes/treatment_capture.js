const CONFIG = require("../config/config"),
  { createWriteStream, unlink } = require("fs"),
  { fork } = require("child_process"),
  getDuration = require("../middleware/getDuration"),
  fetch = require("node-fetch"),
  request = require("request").defaults({ rejectUnauthorized: false }),
  // request = require("request"),
  weatherRequest = require("../utils/weatherRequest"),
  axios = require("axios"),
  axiosInstance = axios.create({
    baseURL: `https://${CONFIG.main_ip_address}:${CONFIG.main_port}`,
    rejectUnauthorized: false
  }),
  logger = require("../utils/Logger"),
  nullOrUndefined = require("../utils/nullOrUndefined"),
  nullOrUndefinedDec = require("../utils/nullOrUndefinedDec"),
  nullOrUndefinedNaN = require("../utils/nullOrUndefinedNaN"),
  returnCalibrated = require("../utils/returnCalibrated"),
  returnDuration = require("../utils/returnDuration"),
  valCalDateTime = require("../utils/valCalDateTime"),
  parseCanaries = require("../utils/parseCanaries"),
  isEmpty = require("../utils/isItEmpty"),
  getFileSizeCap = require("../utils/fileSizeCap"),
  getFileSize = require("../utils/getFileSize"),
  fileDelete = require("../utils/fileDelete"),
  deleteActiveFile = require("../utils/deleteActiveFile"),
  gTs = require("../utils/getTimestamp"),
  mergeByKey = require("array-merge-by-key"),
  deleteFile = require("../utils/deleteFile2"),
  removeFirstChar = require("../utils/removeFirstChar"),
  removeItem = require("../utils/removeItem"),
  moment = require("moment"),
  cp = require("child_process"),
  path = require("path"),
  pad = require("../utils/padNumbers"),
  toDate = require("normalize-date"),
  DarkSky = require("dark-sky"),
  darksky = new DarkSky(CONFIG.darksky_apiKey),
  weatherChild = require("../utils/weatherChild"),
  currentWeather = require("../utils/_weatherCaptureCurrent"),
  weatherRequester = require("../utils/weatherRequest");

module.exports = function(app) {
  const captureCurrentData = async (t_File, t_Lat, t_long) => {
    logger.log(
      `${CONFIG.main_ip_address}:${CONFIG.main_port}/api/treatment/startWeather`
    );
    try {
      await axiosInstance.post(
        `${CONFIG.main_ip_address}:${
          CONFIG.main_port
        }/api/treatment/startWeather`,
        {
          treatmentFile: t_File,
          latitude: t_Lat,
          longitude: t_long
        }
      );
    } catch (error) {
      logger.log(`  post to::/api/treatment/startWeather ${error}`);
    }
  };

  /*
  FUNC: startWeatherCapture
  PURPOSE: create json file  to  store treatment loc lat, long and table name AS WELL AS and start weather data capture every 2 min
  PARAMS: treatmentTable && latitude && longitude { Strings }
  RETURN: void
  */
  const startWeatherCapture = async (
    id,
    treatmentTable,
    latitude,
    longitude
  ) => {
    // logger.log(
    //   `inside startWeatherCapture:: ${id}=> ${treatmentTable}:: ${latitude}=> ${longitude}`
    // );
    const weatherWriter = createWriteStream(
        `./weatherFiles/${treatmentTable}.json`
      ),
      theTreatment = treatmentTable.substring(
        0,
        treatmentTable.indexOf("_weatherData")
      ),
      treatmentFile = `${treatmentTable}.json`;

    weatherWriter.write(
      `{\n"treatmentTable":"${theTreatment}",\n"latitude": "${latitude}",\n"longitude": "${longitude}"\n}`
    );

    // START  AUTOMATED TREATMENT DATA CAPTURE IN DETATCHED PROCESS
    weatherChild("_weatherCaptureActive.js", [
      theTreatment,
      parseFloat(latitude),
      parseFloat(longitude)
    ]);
    // captureCurrentData(
    //   theTreatment,
    //   parseFloat(latitude),
    //   parseFloat(longitude)
    // );
  };

  /*
  FUNC: startWeatherDelay
  PURPOSE: create json file  to  store treatment loc lat, long and table name AS WELL AS and start weather data capture 24 hr delayed update
  PARAMS: treatmentTable && latitude && longitude { Strings }
  RETURN: void
  */
  const startWeatherDelay = (
    treatmentId,
    treatmentTable,
    latitude,
    longitude
  ) => {
    let weatherWriter = createWriteStream(
        `./weatherFiles/${treatmentTable}_delayed.json`
      ),
      endDate = moment(new Date()).format("YYYY-MM-DD");

    weatherWriter.write(
      `{"treatment":${treatmentTable}Forcast"latitude": ${latitude},"longitude": ${longitude}}`
    );
  };
  // @route   POST /api/treatment/start -
  // @desc    Start recording canary treatments after preparing dbs
  // @access  Public
  app.post("/api/treatment/start", async (req, res) => {
    logger.log("Treatment capture started...");

    let i_count = 0,
      treatmentLocations = "",
      {
        gateway_id,
        job_id,
        country_id,
        customer_id,
        locations,
        tech_id,
        location_ip,
        canary_data
      } = req.body,
      numLocations = locations.length,
      num_canaries = canary_data.length,
      treatment_id = `${job_id}_${country_id}_${customer_id}`,
      treatment_tech = tech_id !== undefined ? tech_id : 56,
      elogFileName =
        tech_id !== undefined
          ? `${gateway_id}_${job_id}_${country_id}_${customer_id}-{${treatment_tech}}_Errs.log`
          : `${gateway_id}_${job_id}_${country_id}_${customer_id}_Errs.log`,
      captureErrWrite = createWriteStream(`./captureErrs/${elogFileName}`, {
        flags: "a"
      }),
      garbage_collection = true,
      create_treatment_tbl = "CALL createTreatmentTables_v8(?,?,?,?)",
      create_weather_tbl = "CALL createTreatmentWeatherTables_v1(?)",
      gps_lookup_qry = `https://extreme-ip-lookup.com/json/${location_ip}`,
      treatmnt_check =
        "SELECT _treatments.id FROM _treatments WHERE _treatments.treatment_id =?",
      tech_tbl_qry = `SELECT _technicians.id as tech_id FROM _technicians WHERE _technicians.user_id =?`,
      allow_access_obj =
        tech_id !== undefined
          ? `SELECT id FROM gateways WHERE gateway_id=?;${tech_tbl_qry}`
          : `SELECT id FROM gateways WHERE gateway_id=?`,
      init_qry_obj = tech_id !== undefined ? [gateway_id, tech_id] : gateway_id,
      tech_id_defined = tech_id !== undefined ? true : false,
      assoc_canary_SQL =
        "SELECT Canaries.id, Canaries.unit_number FROM Canaries WHERE Canaries.node_id =?",
      assoc_canary_SQL_multi =
        "SELECT Canaries.id, Canaries.unit_number FROM Canaries WHERE Canaries.unit_number =?",
      // inTreatmentSQL = `UPDATE gateways SET treatmentCount = treatmentCount+1, ttlTreatmentCount = ttlTreatmentCount+1, activeDate='${gTs()}' WHERE gateway_id=?`,
      get_calibration_sql =
        "SELECT * FROM calibrations WHERE node_id=? ORDER BY calibrations.calibration_id DESC LIMIT 1",
      gw_tbl_id,
      treatment_lat,
      treatment_long,
      treatment_tbl_id,
      tech_tbl_id,
      current_canary,
      treatment_tbls = [],
      captureCanaryByUsage = [],
      custLocationTablesArray = [],
      canariesTablesArray = [],
      custLocationQuery = "",
      treatmentTablesQuery = "",
      treatmentCanariesQuery = "";

    try {
      let duplicateTreatment = await pool_a.query(treatmnt_check, treatment_id);
      if (!isEmpty(duplicateTreatment)) {
        res.status(409).json({
          status: "FAILURE!",
          message: "Dulpicate Treatment ID exists in db.."
        });
      } else {
        logger.log("Pass duplicate treatment check...");

        // TEST AUTH IS GATEWAY IN DB
        try {
          let authConn = await pool_a.query(allow_access_obj, init_qry_obj);
          if (!isEmpty(authConn[0])) {
            // SET TECH TABLE ID && GATEWAY TABLE ID:
            tech_tbl_id =
              tech_id_defined && !isEmpty(authConn[1][0])
                ? authConn[1][0].tech_id
                : 2;
            gw_tbl_id = authConn[0][0].id;

            logger.log(
              `Gateway Authenticated... tech_tbl_id SET ${tech_tbl_id} && gw_tbl_id SET ${gw_tbl_id}`
            );

            // CAPTURE LOCATION GPS
            try {
              let gps_rslt = await fetch(gps_lookup_qry);
              let data = await gps_rslt.json();
              if (!isEmpty(data)) {
                treatment_lat = data.lat;
                treatment_long = data.lon;

                logger.log(
                  `treatment location gps coordinates set by ip address... lat: ${treatment_lat} long: ${treatment_long}`
                );

                // CAPTURE CUSTOMER DETAILS FOR TREATMENT TABLES
                let customerIdQuery =
                    "INSERT IGNORE INTO _customers  SET ?;SELECT _customers.id , _customers.industry_id FROM _customers WHERE _customers.customer_id = ?",
                  cust_tble_id,
                  cust_industry;
                try {
                  let custSearchInsertResult = await pool_a.query(
                    customerIdQuery,
                    [{ customer_id: customer_id }, customer_id]
                  );
                  cust_tble_id = custSearchInsertResult[1][0].id;
                  cust_industry = custSearchInsertResult[1][0].industry_id;
                  logger.log(`customer inserted / selected...`);

                  // INSERT INTO _treatments TABLE
                  try {
                    let create_treatment = `INSERT INTO _treatments SET ?`,
                      start_time = moment(Date.now()).format(
                        "YYYY-MM-DD HH:mm:ss"
                      ),
                      treatment = {
                        treatment_id: treatment_id,
                        gateway_id: gw_tbl_id,
                        cust_id: cust_tble_id,
                        start_time: start_time,
                        status_id: 1,
                        tech_id: tech_tbl_id,
                        latitude: treatment_lat,
                        longitude: treatment_long
                      },
                      treatment_inserted = await pool_a.query(
                        create_treatment,
                        treatment
                      );
                    if (treatment_inserted.affectedRows == 1) {
                      treatment_tbl_id = treatment_inserted.insertId;
                      logger.log(`Treatment inserted into _treatments...`);

                      // ASSIGN CANARIES TO LOCATIONS
                      // GET CANARY UNIT NUMBER FROM NODE_ID
                      logger.log(`assigning canaries to locations...`);
                      for (var c = 0; c < canary_data.length; c++) {
                        let currentCanaryByNode = canary_data[c].node_id;
                        try {
                          let queryResult = await pool_a.query(
                            `SELECT Canaries.unit_number FROM Canaries WHERE Canaries.node_id =?`,
                            currentCanaryByNode
                          );
                          if (!isEmpty(queryResult)) {
                            let currentCanaryUnitNumber =
                              queryResult[0].unit_number;
                            captureCanaryByUsage.push(currentCanaryUnitNumber);
                          }
                        } catch (e) {
                          garbage_collection = false;
                          captureErrWrite.write(
                            `db  error ${gTs()}\n   =>    capture canary unit number to assign to location ERR: ${e}\n`
                          );
                        }
                      }
                      // SORT LOCATIONS BY CANARIES
                      locations.sort((a, b) => {
                        if (b.canaries.length < a.canaries.length) {
                          return -1;
                        }
                        if (b.canaries.length > a.canaries.length) {
                          return 1;
                        }
                        // ELSE NAMES MUST BE EQUAL
                        return 0;
                      });
                      for (var l = 0; l < locations.length; l++) {
                        let currentLocatioId = locations[l].id,
                          locationId = currentLocatioId.toUpperCase(),
                          locationCanaries = locations[l].canaries;
                        custLocationQuery +=
                          "INSERT INTO _treatmentLocations SET ?;";
                        try {
                          let locationIdSearchQuery = await pool_a.query(
                            `SELECT id FROM _customerLocations WHERE cust_id = ? and location_id = ?`,
                            [cust_tble_id, locationId]
                          );

                          if (!isEmpty(locationIdSearchQuery)) {
                            let cust_loc_tbl_id = locationIdSearchQuery[0].id,
                              currentTreatLocation = {
                                treatment_id: treatment_tbl_id,
                                location_id: cust_loc_tbl_id
                              };
                            custLocationTablesArray.push(currentTreatLocation);
                          } else {
                            try {
                              // INSERT LOCATION AND RETREIVE  ID
                              let custLocationInsertResult = await pool_a.query(
                                "INSERT INTO _customerLocations SET ?",
                                [
                                  {
                                    cust_id: cust_tble_id,
                                    location_id: locationId
                                  }
                                ]
                              );

                              if (custLocationInsertResult.affectedRows >= 1) {
                                let cust_loc_tbl_id =
                                    custLocationInsertResult.insertId,
                                  currentTreatLocation = {
                                    treatment_id: treatment_tbl_id,
                                    location_id: cust_loc_tbl_id
                                  };

                                custLocationTablesArray.push(
                                  currentTreatLocation
                                );
                              }
                            } catch (e) {
                              garbage_collection = false;
                              captureErrWrite.write(
                                `db  error ${gTs()}\n   =>    customer location insert ERR: ${e}\n`
                              );
                            }
                          }
                        } catch (e) {
                          garbage_collection = false;
                          captureErrWrite.write(
                            `db  error ${gTs()}\n   =>====>>>>>      customer location select  ERR: ${e}\n`
                          );
                        }

                        if (!isEmpty(locationCanaries)) {
                          for (var lc = 0; lc < locationCanaries.length; lc++) {
                            let currentId = locationCanaries[lc];
                            removeItem(captureCanaryByUsage, currentId);
                            let index = captureCanaryByUsage.indexOf(currentId);
                            if (index > -1) {
                              captureCanaryByUsage.splice(index, 1);
                            }
                          }
                        } else {
                          for (
                            var i = 0;
                            i < captureCanaryByUsage.length;
                            i++
                          ) {
                            locationCanaries.push(captureCanaryByUsage[i]);
                          }
                        }
                      }

                      for (var x = 0; x < locations.length; x++) {
                        let lcActiveLoaction = locations[x].id,
                          activeLocation = lcActiveLoaction.toUpperCase(),
                          activeCanaries = locations[x].canaries,
                          currentLocationId;
                        // CAPTURE ACTIVE LOCATION ID
                        try {
                          let capLocationIdResult = await pool_a.query(
                            "SELECT _customerLocations.id FROM _customerLocations WHERE _customerLocations.cust_id = ? and _customerLocations.location_id = ?",
                            [cust_tble_id, activeLocation]
                          );
                          if (!isEmpty(capLocationIdResult)) {
                            currentLocationId = capLocationIdResult[0].id;
                          }
                        } catch (e) {
                          garbage_collection = false;
                          captureErrWrite.write(
                            `db  error ${gTs()}\n   =>    current location id capture  ERR: ${e}\n`
                          );
                        }
                        // ITERATE THROUGH CANARIES
                        for (var j = 0; j < activeCanaries.length; j++) {
                          treatmentCanariesQuery +=
                            " INSERT INTO _treatmentCanaries SET ?;";
                          let activeCanary = activeCanaries[j];
                          // CREATE _treatmentCanaries VALUES
                          try {
                            let searchCanaryIdResult = await pool_a.query(
                              "SELECT Canaries.id FROM Canaries WHERE Canaries.unit_number =?",
                              activeCanary
                            );
                            if (!isEmpty(searchCanaryIdResult)) {
                              let currentCanaryId = searchCanaryIdResult[0].id,
                                treatmentCanariesCurrent = {
                                  treatment_id: treatment_tbl_id,
                                  canary_id: currentCanaryId,
                                  location_id: currentLocationId
                                };
                              // APPEND TO ARRAY FOR INSERTION
                              canariesTablesArray.push(
                                treatmentCanariesCurrent
                              );
                            }
                          } catch (e) {
                            garbage_collection = false;
                            captureErrWrite.write(
                              `db  error ${gTs()}\n   =>     capture and insert into treatment canaries  ERR: ${e}\n`
                            );
                          } // _treatmentTables INSERT QUERY
                          treatmentTablesQuery +=
                            "INSERT INTO _treatmentTables SET ?;";
                          // GATHER TREATMENT TABLES DATA FOR INSERT
                          treatment_tbls.push({
                            treatment_id: treatment_tbl_id,
                            treatment_table: `${treatment_id}_${activeLocation}_${gateway_id}_${activeCanary}`
                          });
                          // CREATE TREATMENT DATA TABLES
                          logger.log("treatment tables created");

                          try {
                            await pool.query(create_treatment_tbl, [
                              treatment_id,
                              activeLocation,
                              gateway_id,
                              activeCanary
                            ]);
                          } catch (e) {
                            garbage_collection = false;
                            captureErrWrite.write(
                              `db  error ${gTs()}\n   =>    treatment table  ${treatment_id}_${activeLocation}_${gateway_id}_${activeCanary} create creation  ERR: ${e}\n`
                            );
                          }
                        }
                      }

                      // CREATE WEATHER TABLE
                      try {
                        let createWeatherTable = await pool.query(
                          create_weather_tbl,
                          treatment_id
                        );
                      } catch (e) {
                        garbage_collection = false;
                        captureErrWrite.write(
                          `db  error ${gTs()}\n   =>    treatment  weather table create creation  ERR: ${e}\n`
                        );
                      }
                    }
                  } catch (e) {
                    garbage_collection = false;
                    captureErrWrite.write(
                      `db  error ${gTs()}\n   =>    treatment table insert failure  ERR: ${e}\n`
                    );
                  }
                } catch (e) {
                  garbage_collection = false;
                  captureErrWrite.write(
                    `db  error ${gTs()}\n   =>    customer id capture  ERR: ${e}\n`
                  );
                }
                // INSERT  _treatmentLocations
                logger.log("_treatmentLocations inserted");
                try {
                  let insertTreatLocationsResult = await pool_a.query(
                    custLocationQuery,
                    custLocationTablesArray
                  );
                } catch (e) {
                  garbage_collection = false;
                  captureErrWrite.write(
                    `db  error ${gTs()}\n   =>     SELECT id FROM _customerLocations WHERE cust_id = ? and location_id = ?,
                    [${cust_tble_id}, ${locationId}] _treatrmentLocations insert  ERR: ${e}\n`
                  );
                }
                // INSERT  _treatmentCanaries
                try {
                  let insertTreatCanariesResult = await pool_a.query(
                    treatmentCanariesQuery,
                    canariesTablesArray
                  );
                } catch (e) {
                  garbage_collection = false;
                  captureErrWrite.write(
                    `db  error ${gTs()}\n   =>    _treatrmentLocations insert  ERR: ${e}\n`
                  );
                }
                // INSERT  _treatmentTables
                try {
                  let insertTreatTablesResult = await pool_a.query(
                    treatmentTablesQuery,
                    treatment_tbls
                  );
                } catch (e) {
                  garbage_collection = false;
                  captureErrWrite.write(
                    `db  error ${gTs()}\n   =>    _treatmentLocations insert  ERR: ${e}\n`
                  );
                }

                for (var i = 0; i < canary_data.length; i++) {
                  let currentDataset = canary_data[i],
                    currentDataInsertQuery,
                    treatTblesGPSUpdateQry;
                  // AQUIRE UNIT NUMBER OF NODE && DETERMINE LOCATION OF CANARYS && DETERMINE IF CALIBRATED
                  try {
                    let getUnitQuery = await pool_a.query(
                      "SELECT Canaries.id, Canaries.unit_number FROM Canaries WHERE Canaries.node_id=?;SELECT calibrations.* FROM calibrations WHERE calibrations.node_id = ?",
                      [currentDataset.node_id, currentDataset.node_id]
                    );

                    if (!isEmpty(getUnitQuery)) {
                      let currentCanaryId = getUnitQuery[0][0].id,
                        currentUnitNumber = getUnitQuery[0][0].unit_number,
                        currentCalibrations = getUnitQuery[1][0],
                        currentIsCalibrated = !isEmpty(currentCalibrations)
                          ? true
                          : false,
                        currentCanaryLocation,
                        to_decimals = 3,
                        currentData;

                      for (var n = 0; n < locations.length; n++) {
                        if (locations[n].canaries.includes(currentUnitNumber)) {
                          currentCanaryLocation = locations[n].id;
                          break;
                        }
                      }
                      let ucCurrentLocation = currentCanaryLocation.toUpperCase();
                      currentDataInsertQuery = `INSERT INTO ${treatment_id}_${ucCurrentLocation}_${gateway_id}_${currentUnitNumber} SET ?`;
                      // CALIBRATE DATA AND INSERT
                      if (currentIsCalibrated) {
                        // console.log("calibrated");
                        currentData = {
                          node_id: currentDataset.node_id,
                          // TEMPERATURE: CANARY_DATA[C].TEMPERATURE,
                          canary_temp: returnCalibrated(
                            currentIsCalibrated,
                            currentDataset.canary_temp,
                            currentCalibrations.canary_temp_divisor,
                            currentCalibrations.canary_temp_modifier,
                            to_decimals
                          ),
                          calibration_id: currentCalibrations
                            ? currentCalibrations.calibration_id
                            : null,
                          latitude: nullOrUndefined(currentDataset.latitude),
                          longitude: nullOrUndefined(currentDataset.longitude),
                          date: nullOrUndefinedNaN(currentDataset.date),
                          time: nullOrUndefinedNaN(currentDataset.time),
                          // TEMPERATURE: CANARY_DATA[C].TEMPERATURE,
                          temperature: returnCalibrated(
                            currentIsCalibrated,
                            currentDataset.temperature,
                            currentCalibrations.temp_divisor,
                            currentCalibrations.temp_modifier,
                            to_decimals
                          ),
                          // humidity: currentDataset.humidity,
                          humidity: returnCalibrated(
                            currentIsCalibrated,
                            currentDataset.humidity,
                            currentCalibrations.humidity_divisor,
                            currentCalibrations.humidity_modifier,
                            to_decimals
                          ),
                          // pressure: currentDataset.pressure,
                          pressure: returnCalibrated(
                            currentIsCalibrated,
                            currentDataset.pressure,
                            currentCalibrations.pressure_divisor,
                            currentCalibrations.pressure_modifier,
                            to_decimals
                          ),
                          // // UV: currentDataset.UV,
                          UV: returnCalibrated(
                            currentIsCalibrated,
                            currentDataset.UV,
                            currentCalibrations.UV_divisor,
                            currentCalibrations.UV_modifier,
                            to_decimals
                          ),
                          // CdS: currentDataset.CdS,
                          CdS: returnCalibrated(
                            currentIsCalibrated,
                            currentDataset.CdS,
                            currentCalibrations.CdS_divisor,
                            currentCalibrations.CdS_modifier,
                            to_decimals
                          ),
                          // CO2: currentDataset.CO2,
                          CO2: returnCalibrated(
                            currentIsCalibrated,
                            currentDataset.CO2,
                            currentCalibrations.CO2_divisor,
                            currentCalibrations.CO2_modifier,
                            to_decimals
                          ),
                          // // O2: currentDataset.O2,
                          O2: returnCalibrated(
                            currentIsCalibrated,
                            currentDataset.O2,
                            currentCalibrations.O2_divisor,
                            currentCalibrations.O2_modifier,
                            to_decimals
                          ),
                          // VOC: currentDataset.VOC,
                          VOC: returnCalibrated(
                            currentIsCalibrated,
                            currentDataset.VOC,
                            currentCalibrations.VOC_divisor,
                            currentCalibrations.VOC_modifier,
                            to_decimals
                          ),
                          // NH3: currentDataset.NH3,
                          NH3: returnCalibrated(
                            currentIsCalibrated,
                            currentDataset.NH3,
                            currentCalibrations.NH3_divisor,
                            currentCalibrations.NH3_modifier,
                            to_decimals
                          ),
                          // CH4: currentDataset.CH4,
                          CH4: returnCalibrated(
                            currentIsCalibrated,
                            currentDataset.CH4,
                            currentCalibrations.CH4_divisor,
                            currentCalibrations.CH4_modifier,
                            to_decimals
                          ),
                          // CO: currentDataset.CO,
                          CO: returnCalibrated(
                            currentIsCalibrated,
                            currentDataset.CO,
                            currentCalibrations.CO_divisor,
                            currentCalibrations.CO_modifier,
                            to_decimals
                          ),
                          // SR1: currentDataset.SR1,
                          SR1: returnCalibrated(
                            currentIsCalibrated,
                            currentDataset.SR1,
                            currentCalibrations.SR1_divisor,
                            currentCalibrations.SR1_modifier,
                            to_decimals
                          ),
                          // SR2: currentDataset.SR2,
                          SR2: returnCalibrated(
                            currentIsCalibrated,
                            currentDataset.SR2,
                            currentCalibrations.SR2_divisor,
                            currentCalibrations.SR2_modifier,
                            to_decimals
                          ),
                          // SR3: currentDataset.SR3,
                          SR3: returnCalibrated(
                            currentIsCalibrated,
                            currentDataset.SR3,
                            currentCalibrations.SR3_divisor,
                            currentCalibrations.SR3_modifier,
                            to_decimals
                          ),
                          // NH3: currentDataset.NH3,
                          dB: returnCalibrated(
                            currentIsCalibrated,
                            currentDataset.dB,
                            currentCalibrations.dB_divisor,
                            currentCalibrations.dB_modifier,
                            to_decimals
                          ),
                          SRalarm: nullOrUndefined(currentDataset.SRalarm),
                          motion: nullOrUndefined(currentDataset.motion),
                          xs_heat: nullOrUndefined(currentDataset.xs_heat),
                          insert_time: currentDataset.insert_time
                        };
                      } else {
                        currentData = {
                          node_id: currentDataset.node_id,
                          canary_temp: nullOrUndefined(
                            currentDataset.canary_temp
                          ),
                          calibration_id: null,
                          latitude: nullOrUndefined(currentDataset.latitude),
                          longitude: nullOrUndefined(currentDataset.longitude),
                          date: nullOrUndefinedNaN(currentDataset.date),
                          time: nullOrUndefinedNaN(currentDataset.time),
                          temperature: nullOrUndefinedDec(
                            currentDataset.temperature * 1
                          ),
                          humidity: nullOrUndefinedDec(
                            currentDataset.humidity * 1
                          ),
                          pressure: nullOrUndefinedDec(
                            currentDataset.pressure * 1
                          ),
                          UV: nullOrUndefinedDec(currentDataset.UV * 1),
                          CdS: nullOrUndefinedDec(currentDataset.CdS * 1),
                          CO2: nullOrUndefinedDec(currentDataset.CO2 * 1),
                          O2: nullOrUndefinedDec(currentDataset.O2 * 1),
                          VOC: nullOrUndefinedDec(currentDataset.VOC * 1),
                          NH3: nullOrUndefinedDec(currentDataset.NH3 * 1),
                          CH4: nullOrUndefinedDec(currentDataset.CH4 * 1),
                          CO: nullOrUndefinedDec(currentDataset.CO * 1),
                          SR1: nullOrUndefinedDec(currentDataset.SR1 * 1),
                          SR2: nullOrUndefinedDec(currentDataset.SR2 * 1),
                          SR3: nullOrUndefinedDec(currentDataset.SR3 * 1),
                          dB: nullOrUndefinedDec(currentDataset.dB * 1),
                          SRalarm: nullOrUndefinedDec(currentDataset.SRalarm),
                          motion: nullOrUndefinedDec(currentDataset.motion),
                          xs_heat: nullOrUndefinedDec(currentDataset.xs_heat),
                          insert_time: currentDataset.insert_time
                        };
                      }
                      // INSERT TREATMENT DATA
                      try {
                        await pool.query(currentDataInsertQuery, currentData);
                      } catch (e) {
                        garbage_collection = false;
                        captureErrWrite.write(
                          `db  error ${gTs()}\n   =>    calibrated canarydata insert \n     ${currentDataInsertQuery} \n ${
                            currentData.node_id
                          } ${currentData.canary_temp}  ${
                            currentData.latitude
                          }  ${currentData.longitude}  ${currentData.date}  ${
                            currentData.time
                          }  ${currentData.temperature}  ${
                            currentData.humidity
                          }  ${currentData.pressure}  ${currentData.UV}  ${
                            currentData.CdS
                          }  ${currentData.CO2}  ${currentData.O2}  ${
                            currentData.VOC
                          }  ${currentData.NH3}  ${currentData.CH4}  ${
                            currentData.CO
                          }  ${currentData.SR1}  ${currentData.SR2}  ${
                            currentData.SR3
                          }  ${currentData.SRalarm}  ${currentData.motion}  ${
                            currentData.xs_heat
                          }  ${currentData.insert_time}    ERR: ${e}\n`
                        );
                      }

                      // APPEND GPS TO _treaatmentCanaries TABLE
                      let currentLatitude = currentDataset.latitude,
                        currentLongitude = currentDataset.longitude,
                        hasCoordinates =
                          currentLatitude !== "0.000000" &&
                          currentLatitude !== "0.000000"
                            ? true
                            : false;
                      if (hasCoordinates) {
                        try {
                          let gpsUpdateQuery = await pool_a.query(
                            `UPDATE _treatmentCanaries SET ? WHERE _treatmentCanaries.treatment_id = ${treatment_tbl_id} AND _treatmentCanaries.canary_id = ${currentCanaryId}`,
                            [
                              {
                                latitude: currentLatitude,
                                longitude: currentLongitude
                              },
                              [treatment_tbl_id, currentCanaryId]
                            ]
                          );
                        } catch (e) {
                          garbage_collection = false;
                          captureErrWrite.write(
                            `db  error ${gTs()}\n   =>    _treatmentCanaries GPS update query  ERR: ${e}\n`
                          );
                        }
                      }

                      // CLOSEOUT
                      i_count += 1;
                      // if (i_count === num_canaries && garbage_collection) {
                      if (i_count === num_canaries) {
                        try {
                          const forecast = await darksky
                            .options({
                              latitude: treatment_lat,
                              longitude: treatment_long,
                              timezone: "America/Vancouver",
                              units: "si",
                              language: "en",
                              exclude: ["minutely", "flags"]
                            })
                            .get();
                          const dailyData = forecast.daily.data[0],
                            sunriseFC = moment
                              .unix(dailyData.sunriseTime)
                              .format("YYYY-MM-DD hh:mm:ss"),
                            sunsetFC = moment
                              .unix(dailyData.sunsetTime)
                              .format("YYYY-MM-DD hh:mm:ss"),
                            moonPhaseFC = dailyData.moonPhase,
                            precipTypeFC = dailyData.precipType,
                            precipIntensityMaxFC = dailyData.precipIntensityMax,
                            precipIntensityMaxTimeFC = moment
                              .unix(dailyData.precipIntensityMaxTime)
                              .format("YYYY-MM-DD hh:mm:ss"),
                            temperatureHighFC = dailyData.temperatureHigh,
                            temperatureHighTimeFC = moment
                              .unix(dailyData.temperatureHighTime)
                              .format("YYYY-MM-DD hh:mm:ss"),
                            temperatureLowFC = dailyData.temperatureLow,
                            temperatureLowTimeFC = moment
                              .unix(dailyData.temperatureLowTime)
                              .format("YYYY-MM-DD hh:mm:ss"),
                            windGustFC = dailyData.windGust,
                            windGustTimeFC = moment
                              .unix(dailyData.windGustTime)
                              .format("YYYY-MM-DD hh:mm:ss"),
                            uvIndexMaxTimeFC = moment
                              .unix(dailyData.uvIndexTime)
                              .format("YYYY-MM-DD hh:mm:ss"),
                            ozoneFC = dailyData.ozone,
                            currentData = forecast.currently,
                            insertTime = moment
                              .unix(currentData.time)
                              .format("YYYY-MM-DD hh:mm:ss"),
                            summary = currentData.summary,
                            nearestStormDistance =
                              currentData.nearestStormDistance,
                            nearestStormBearing =
                              currentData.nearestStormBearing,
                            precipIntensity = currentData.precipIntensity,
                            precipProbability = currentData.precipProbability,
                            temperature = currentData.temperature,
                            // apparentTemperature =
                            //   currentData.apparentTemperature,
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
                            forcastInsert = {
                              summary: dailyData.summary,
                              timeZone: forecast.timezone,
                              sunrise: sunriseFC,
                              sunset: sunsetFC,
                              moonPhase: moonPhaseFC,
                              percipType: precipTypeFC,
                              precipIntensityMax: precipIntensityMaxFC,
                              precipIntensityMaxTime: precipIntensityMaxTimeFC,
                              temperatureHigh: temperatureHighFC,
                              temperatureHighTime_forcast: temperatureHighTimeFC,
                              temperatureLow: temperatureLowFC,
                              temperatureLowTime_forcast: temperatureLowTimeFC,
                              windGust: windGustFC,
                              windGustTime_forcast: windGustTimeFC,
                              uvIndex: dailyData.uvIndex,
                              uvIndexMaxTime_forcast: uvIndexMaxTimeFC,
                              cloudCover_forcast: dailyData.cloudCover,
                              ozone_forcast: ozoneFC
                            },
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
                            },
                            treatmentTableUpdateQuery =
                              "UPDATE _treatments SET ? WHERE id =?",
                            _treatmentUpdateObj = [
                              forcastInsert,
                              treatment_tbl_id
                            ],
                            _ucTreatmentTable = treatment_id.toUpperCase(),
                            _treatmentTable = `${_ucTreatmentTable}_weatherData`,
                            weatherDataINsertQuery = `INSERT INTO ${_treatmentTable} SET ?`;

                          try {
                            // UPDATE _treatments TABLE
                            const _treatmentUpdateResult = await pool_a.query(
                              treatmentTableUpdateQuery,
                              _treatmentUpdateObj
                            );
                            console.log();
                            if (_treatmentUpdateResult.affectedRows == 1) {
                              try {
                                const dataInsertResult = await pool.query(
                                  weatherDataINsertQuery,
                                  currentInsert
                                );
                                if (
                                  dataInsertResult.affectedRows == 1 &&
                                  garbage_collection
                                ) {
                                  logger.log(`Treatment_id: ${treatment_id}`);
                                  // START WEATHER CAPTURE
                                  // startWeatherCapture(
                                  //   treatment_tbl_id,
                                  //   `${treatment_id}_weatherData`,
                                  //   treatment_lat,
                                  //   treatment_long,
                                  //   captureErrWrite
                                  // );
                                  res.status(200).json({
                                    status:
                                      "Treatment tables created and data collection started...",
                                    treatment: treatment_id,
                                    treatmentId: treatment_tbl_id
                                  });
                                }
                              } catch (e) {
                                garbage_collection = false;
                                captureErrWrite.write(
                                  `treatment weather data insert into  ${_treatmentTable} ERR: ${e}\n`
                                );
                              }
                            }
                          } catch (e) {
                            garbage_collection = false;
                            captureErrWrite.write(
                              `_treatments weather data insert  ERR: ${e}\n`
                            );
                          }
                        } catch (e) {
                          garbage_collection = false;
                          captureErrWrite.write(
                            `treatment weather data capture  ERR: ${e}\n`
                          );
                        }
                      }
                    }
                  } catch (e) {
                    garbage_collection = false;
                    captureErrWrite.write(
                      `db  error ${gTs()}\n   =>    canary unit capture for location pinpoint  ERR: ${e}\n`
                    );
                  }
                }
              }
            } catch (e) {
              garbage_collection = false;
              captureErrWrite.write(
                `db  error ${gTs()}\n   =>    capture gps coord ERR: ${e}\n`
              );
            }
          } else {
            res.status(401).json({
              status: "UNAUTHORIZED!",
              message: "Connection attemp denied.."
            });
          }
        } catch (e) {
          garbage_collection = false;
          captureErrWrite.write(
            `db  error ${gTs()}\n   =>    gateway auth check failure ERR: ${e}\n`
          );
        }
      }
    } catch (e) {
      garbage_collection = false;
      captureErrWrite.write(
        `db  error ${gTs()}\n   =>    duplicate treatment check ERR: ${e}\n`
      );
    }
  });

  // @route   POST /api/treatment/ -
  // @desc    capture treatmnt data
  // @access  Public
  app.post("/api/treatment/", async (req, res) => {
    let i_count = 0,
      treatmentLocations = "",
      {
        gateway_id,
        job_id,
        country_id,
        customer_id,
        locations,
        tech_id,
        location_ip,
        canary_data
      } = req.body,
      numLocations = locations.length,
      num_canaries = canary_data.length,
      treatment_id = `${job_id}_${country_id}_${customer_id}`,
      treatment_tech = tech_id !== undefined ? tech_id : 56,
      elogFileName =
        tech_id !== undefined
          ? `${gateway_id}_${job_id}_${country_id}_${customer_id}-{${treatment_tech}}_Errs.log`
          : `${gateway_id}_${job_id}_${country_id}_${customer_id}_Errs.log`,
      captureErrWrite = createWriteStream(`./captureErrs/${elogFileName}`, {
        flags: "a"
      }),
      garbage_collection = true,
      create_treatment_tbl = "CALL createTreatmentTables_v8_after(?,?,?,?)",
      create_weather_tbl = "CALL createTreatmentWeatherTables_v1(?)",
      gps_lookup_qry = `https://extreme-ip-lookup.com/json/${location_ip}`,
      treatmnt_check =
        "SELECT _treatments.id FROM _treatments WHERE _treatments.treatment_id =?",
      tech_tbl_qry = `SELECT _technicians.id as tech_id FROM _technicians WHERE _technicians.user_id =?`,
      allow_access_obj =
        tech_id !== undefined
          ? `SELECT id FROM gateways WHERE gateway_id=?;${tech_tbl_qry}`
          : `SELECT id FROM gateways WHERE gateway_id=?`,
      init_qry_obj = tech_id !== undefined ? [gateway_id, tech_id] : gateway_id,
      tech_id_defined = tech_id !== undefined ? true : false,
      assoc_canary_SQL =
        "SELECT Canaries.id, Canaries.unit_number FROM Canaries WHERE Canaries.node_id =?",
      assoc_canary_SQL_multi =
        "SELECT Canaries.id, Canaries.unit_number FROM Canaries WHERE Canaries.unit_number =?",
      // inTreatmentSQL = `UPDATE gateways SET treatmentCount = treatmentCount+1, ttlTreatmentCount = ttlTreatmentCount+1, activeDate='${gTs()}' WHERE gateway_id=?`,
      get_calibration_sql =
        "SELECT * FROM calibrations WHERE node_id=? ORDER BY calibrations.calibration_id DESC LIMIT 1",
      gw_tbl_id,
      treatment_lat,
      treatment_long,
      treatment_tbl_id,
      tech_tbl_id,
      current_canary,
      treatment_tbls = [],
      captureCanaryByUsage = [],
      custLocationTablesArray = [],
      canariesTablesArray = [],
      custLocationQuery = "",
      treatmentTablesQuery = "",
      treatmentCanariesQuery = "",
      compareTablesArray = [],
      testTablesArray = [],
      ignoreCanries = [],
      verifyTables = [],
      dataInsertQuery = "",
      dataInsertObj = [],
      treatmentTableId;

    // TEST IF CANARY IN LOCATION ARRAY
    let canaryInLocation = (canary, locationArray) => {
      return locationArray.includes(canary);
    };
    Array.prototype.findByValueOfObject = function(key, value) {
      return this.filter(function(item) {
        return item[key] === value;
      });
    };

    if (isEmpty(canary_data)) {
      res.status(200).json({
        message: "No data sent && no data recorded",
        response: "success!"
      });
    } else {
      // TEST AUTH IS GATEWAY IN DB
      try {
        let authConn = await pool_a.query(allow_access_obj, init_qry_obj);
        if (!isEmpty(authConn[0])) {
          // SET TECH TABLE ID && GATEWAY TABLE ID:
          tech_tbl_id =
            tech_id_defined && !isEmpty(authConn[1][0])
              ? authConn[1][0].tech_id
              : 2;
          gw_tbl_id = authConn[0][0].id;

          // CAPTURE LOCATION GPS
          try {
            let gps_rslt = await fetch(gps_lookup_qry);
            let data = await gps_rslt.json();
            if (!isEmpty(data)) {
              treatment_lat = data.lat;
              treatment_long = data.lon;

              // SORT LOCTIONS
              locations.sort((a, b) => {
                if (b.canaries.length < a.canaries.length) {
                  return -1;
                }
                if (b.canaries.length > a.canaries.length) {
                  return 1;
                }

                // ELSE NAMES MUST BE EQUAL
                return 0;
              });

              // SET DEFAULT LOCATION ID
              let lcDefaultLocation = locations[locations.length - 1].id,
                defaultLocationId = lcDefaultLocation.toUpperCase();

              // APPEND ASSIGNED CANARIES TO IGNORE ARRAY && UNSURE ASSIGNED TABLES ARE CREATED
              for (var i = 0; i < locations.length; i++) {
                let lcLocation = locations[i].id,
                  activeLocation = lcLocation.toUpperCase();
                console.log(activeLocation, " <<<<<<<<=");
                if (!isEmpty(locations[i].canaries)) {
                  let activeCanaries = locations[i].canaries;
                  for (var a = 0; a < activeCanaries.length; a++) {
                    ignoreCanries.push(activeCanaries[a]);
                    // APPEND TO testTablesArray FOR TABLE EXISTANCE CHECK
                    compareTablesArray.push(
                      `${treatment_id}_${activeLocation}_${gateway_id}_${
                        activeCanaries[a]
                      }`
                    );
                    testTablesArray.push({
                      table: `${treatment_id}_${activeLocation}_${gateway_id}_${
                        activeCanaries[a]
                      }`,
                      location: activeLocation,
                      canary: activeCanaries[a]
                    });
                  }
                } else {
                  let tempActivLocation = locations[i].id,
                    activeLocation = tempActivLocation.toUpperCase();
                }
              }

              // ITERATE THROUGH CANARY DATA_INSERTED
              for (var c = 0; c < canary_data.length; c++) {
                let currentDataset = canary_data[c],
                  currentNode_id = currentDataset.node_id,
                  currentUnitLat = currentDataset.latitude,
                  currentUnitLong = currentDataset.longitude;

                // CAPTURE NODE_ID, UNIT NUMBER AND CALIBRATIONS FOR ACTIVE DATASET, CALIBRATE DATA, ASSIGN TO INSERT OBJ, APPEND INSERT QUERY,
                try {
                  let canaryCaptureResult = await pool_a.query(
                    "SELECT Canaries.id , Canaries.unit_number FROM Canaries WHERE Canaries.node_id = ?;SELECT calibrations.* FROM calibrations WHERE calibrations.node_id =?;SELECT _treatments.id FROM _treatments WHERE _treatments.treatment_id =?",
                    [currentNode_id, currentNode_id, treatment_id]
                  );
                  if (!isEmpty(canaryCaptureResult)) {
                    let currentUnitNumber =
                        canaryCaptureResult[0][0].unit_number,
                      currentUnitId = canaryCaptureResult[0][0].id,
                      currentCalibrations = canaryCaptureResult[1][0],
                      currentIsCalibrated =
                        currentCalibrations !== undefined ? true : false,
                      currentData,
                      to_decimals = 3;
                    treatmentTableId = canaryCaptureResult[2][0].id;

                    if (!ignoreCanries.includes(currentUnitNumber)) {
                      let currentTargetTable = `${treatment_id}_${defaultLocationId}_${gateway_id}_${currentUnitNumber}`;

                      // APPEND TABLE CREATION TEST ARRAY IF TABLE NOT ALREADI INCLUDED...
                      if (!compareTablesArray.includes(currentTargetTable)) {
                        testTablesArray.push({
                          table: currentTargetTable,
                          location: defaultLocationId,
                          canary: currentUnitNumber,
                          canaryId: currentUnitId,
                          latitude: currentUnitLat,
                          longitude: currentUnitLong /*,
                        treatmentTableId: treatmentTableId*/
                        });
                      }
                      // APPEND INSERT QUERY
                      dataInsertQuery += `INSERT INTO ${treatment_id}_${defaultLocationId}_${gateway_id}_${currentUnitNumber} SET ?;`;
                    } else {
                      let searchfor = `_${gateway_id}_${currentUnitNumber}`,
                        index = compareTablesArray.findIndex(value =>
                          new RegExp(searchfor, "g").test(value)
                        ),
                        intoTable = compareTablesArray[index];
                      dataInsertQuery += `INSERT INTO ${intoTable} SET ?;`;
                    }

                    // CALIBRATE DATA
                    if (currentIsCalibrated) {
                      currentData = {
                        node_id: currentDataset.node_id,
                        // TEMPERATURE: CANARY_DATA[C].TEMPERATURE,
                        canary_temp: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.canary_temp,
                          currentCalibrations.canary_temp_divisor,
                          currentCalibrations.canary_temp_modifier,
                          to_decimals
                        ),
                        calibration_id: currentCalibrations
                          ? currentCalibrations.calibration_id
                          : null,
                        latitude: nullOrUndefined(currentDataset.latitude),
                        longitude: nullOrUndefined(currentDataset.longitude),
                        date: nullOrUndefinedNaN(currentDataset.date),
                        time: nullOrUndefinedNaN(currentDataset.time),
                        // TEMPERATURE: CANARY_DATA[C].TEMPERATURE,
                        temperature: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.temperature,
                          currentCalibrations.temp_divisor,
                          currentCalibrations.temp_modifier,
                          to_decimals
                        ),
                        // humidity: currentDataset.humidity,
                        humidity: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.humidity,
                          currentCalibrations.humidity_divisor,
                          currentCalibrations.humidity_modifier,
                          to_decimals
                        ),
                        // pressure: currentDataset.pressure,
                        pressure: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.pressure,
                          currentCalibrations.pressure_divisor,
                          currentCalibrations.pressure_modifier,
                          to_decimals
                        ),
                        // // UV: currentDataset.UV,
                        UV: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.UV,
                          currentCalibrations.UV_divisor,
                          currentCalibrations.UV_modifier,
                          to_decimals
                        ),
                        // CdS: currentDataset.CdS,
                        CdS: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.CdS,
                          currentCalibrations.CdS_divisor,
                          currentCalibrations.CdS_modifier,
                          to_decimals
                        ),
                        // CO2: currentDataset.CO2,
                        CO2: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.CO2,
                          currentCalibrations.CO2_divisor,
                          currentCalibrations.CO2_modifier,
                          to_decimals
                        ),
                        // // O2: currentDataset.O2,
                        O2: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.O2,
                          currentCalibrations.O2_divisor,
                          currentCalibrations.O2_modifier,
                          to_decimals
                        ),
                        // VOC: currentDataset.VOC,
                        VOC: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.VOC,
                          currentCalibrations.VOC_divisor,
                          currentCalibrations.VOC_modifier,
                          to_decimals
                        ),
                        // NH3: currentDataset.NH3,
                        NH3: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.NH3,
                          currentCalibrations.NH3_divisor,
                          currentCalibrations.NH3_modifier,
                          to_decimals
                        ),
                        // CH4: currentDataset.CH4,
                        CH4: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.CH4,
                          currentCalibrations.CH4_divisor,
                          currentCalibrations.CH4_modifier,
                          to_decimals
                        ),
                        // CO: currentDataset.CO,
                        CO: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.CO,
                          currentCalibrations.CO_divisor,
                          currentCalibrations.CO_modifier,
                          to_decimals
                        ),
                        // SR1: currentDataset.SR1,
                        SR1: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.SR1,
                          currentCalibrations.SR1_divisor,
                          currentCalibrations.SR1_modifier,
                          to_decimals
                        ),
                        // SR2: currentDataset.SR2,
                        SR2: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.SR2,
                          currentCalibrations.SR2_divisor,
                          currentCalibrations.SR2_modifier,
                          to_decimals
                        ),
                        // SR3: currentDataset.SR3,
                        SR3: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.SR3,
                          currentCalibrations.SR3_divisor,
                          currentCalibrations.SR3_modifier,
                          to_decimals
                        ),
                        // NH3: currentDataset.NH3,
                        dB: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.dB,
                          currentCalibrations.dB_divisor,
                          currentCalibrations.dB_modifier,
                          to_decimals
                        ),
                        SRalarm: nullOrUndefined(currentDataset.SRalarm),
                        motion: nullOrUndefined(currentDataset.motion),
                        xs_heat: nullOrUndefined(currentDataset.xs_heat),
                        insert_time: currentDataset.insert_time
                      };
                    } else {
                      currentData = {
                        node_id: currentDataset.node_id,
                        canary_temp: nullOrUndefinedDec(
                          currentDataset.canary_temp
                        ),
                        calibration_id: null,
                        latitude: nullOrUndefined(currentDataset.latitude),
                        longitude: nullOrUndefined(currentDataset.longitude),
                        date: nullOrUndefinedNaN(currentDataset.date),
                        time: nullOrUndefinedNaN(currentDataset.time),
                        temperature: nullOrUndefinedDec(
                          currentDataset.temperature * 1
                        ),
                        humidity: nullOrUndefinedDec(
                          currentDataset.humidity * 1
                        ),
                        pressure: nullOrUndefinedDec(
                          currentDataset.pressure * 1
                        ),
                        UV: nullOrUndefinedDec(currentDataset.UV * 1),
                        CdS: nullOrUndefinedDec(currentDataset.CdS * 1),
                        CO2: nullOrUndefinedDec(currentDataset.CO2 * 1),
                        O2: nullOrUndefinedDec(currentDataset.O2 * 1),
                        VOC: nullOrUndefinedDec(currentDataset.VOC * 1),
                        NH3: nullOrUndefinedDec(currentDataset.NH3 * 1),
                        CH4: nullOrUndefinedDec(currentDataset.CH4 * 1),
                        CO: nullOrUndefinedDec(currentDataset.CO * 1),
                        SR1: nullOrUndefinedDec(currentDataset.SR1 * 1),
                        SR2: nullOrUndefinedDec(currentDataset.SR2 * 1),
                        SR3: nullOrUndefinedDec(currentDataset.SR3 * 1),
                        dB: nullOrUndefinedDec(currentDataset.dB * 1),
                        SRalarm: nullOrUndefined(currentDataset.SRalarm),
                        motion: nullOrUndefined(currentDataset.motion),
                        xs_heat: nullOrUndefined(currentDataset.xs_heat),
                        insert_time: currentDataset.insert_time
                      };
                    }
                    // ASSIGN TO INSERT OBJ
                    dataInsertObj[dataInsertObj.length] = currentData;
                    // TEST IF GPS NEED updating
                    try {
                      let updateGPSResult = await pool_a.query(
                        "SELECT _treatmentCanaries.* FROM _treatmentCanaries WHERE _treatmentCanaries.treatment_id = ? AND _treatmentCanaries.canary_id = ? AND _treatmentCanaries.latitude IS NOT NULL AND _treatmentCanaries.longitude IS NOT NULL",
                        [treatmentTableId, currentUnitId]
                      );

                      if (isEmpty(updateGPSResult)) {
                        // UPDATE  TREATMENTCANARIES TABLES\
                        try {
                          let updateSuccess = await pool_a.query(
                            " UPDATE _treatmentCanaries SET ? WHERE _treatmentCanaries.treatment_id = ? AND _treatmentCanaries.canary_id = ? ",
                            [
                              {
                                latitude: currentUnitLat,
                                longitude: currentUnitLong
                              },
                              treatmentTableId,
                              currentUnitId
                            ]
                          );
                        } catch (e) {}
                      }
                    } catch (e) {
                      garbage_collection = false;
                      captureErrWrite.write(
                        `db  error ${gTs()}\n   =>    UPDATE  TREATMENTCANARIES TABLES  ERR: ${e}\n`
                      );
                    }
                  } ////;kljm;lmj;lk
                } catch (e) {
                  garbage_collection = false;
                  captureErrWrite.write(
                    `db  error ${gTs()}\n   =>    CAPTURE NODE_ID, UNIT NUMBER AND CALIBRATIONS  ERR: ${e}\n`
                  );
                }
              }

              // TEST IF REQUIRED DATA TABLES DO NOT EXIST CREATE AND UPDATE _TREATMENTTABLES _TREATMENTCANARIES
              let updateTreatmentCanariesQuery = "",
                treatmentCanariesObj = [],
                updateTreatmentTablesQuery = "";
              treatmentTablesObj = [];

              // TEST IF REQUIRED DATA TABLES DO NOT EXIST CREATE AND UPDATE _TREATMENTTABLES _TREATMENTCANARIES
              for (var i = 0; i < testTablesArray.length; i++) {
                let currentElement = testTablesArray[i],
                  currentCanaryTableId,
                  currentLocationTableId = "",
                  updateTreatmentCanaries = null,
                  updateTreatmentTables = null,
                  insertQuery = "",
                  insertObj;

                // CAPTURE LOCATION TABLE ID
                try {
                  let queryLocationTableIdResult = await pool_a.query(
                    "SELECT _customerLocations.id FROM _customers JOIN _customerLocations ON _customers.id = _customerLocations.cust_id WHERE _customerLocations.location_id =? and _customers.customer_id =?",
                    [currentElement.location, customer_id]
                  );
                  if (!isEmpty(queryLocationTableIdResult)) {
                    currentLocationTableId = queryLocationTableIdResult[0].id;
                  }
                } catch (e) {
                  garbage_collection = false;
                  captureErrWrite.write(
                    `db  error ${gTs()}\n   =>    CAPTURE LOCATION TABLE ID ERR: ${e}\n`
                  );
                }
                // TEST IF TABLE EXISTS
                try {
                  let existsResult = await pool.query(
                    "SHOW TABLES LIKE ?",
                    currentElement.table
                  );

                  // IF TABLE DOESNT EXIST
                  if (isEmpty(existsResult)) {
                    // TABLE DOESNT EXISTS  => CREATE TABLE
                    try {
                      let updateResut = await pool.query(create_treatment_tbl, [
                        treatment_id,
                        currentElement.location,
                        gateway_id,
                        currentElement.canary
                      ]);

                      // TEST IF CANARY ID EXISIS IN ELEMENT
                      let canaryIdExists =
                        "canaryId" in currentElement ? true : false;
                      if (!canaryIdExists) {
                        // IF CANARY ID EXISIS IN ELEMENT CAPTURE FROM DB
                        try {
                          let capCanaryTblIdResult = await pool_a.query(
                            "SELECT Canaries.id FROM Canaries WHERE Canaries.unit_number =?",
                            currentElement.canary
                          );
                          if (!isEmpty(capCanaryTblIdResult)) {
                            currentCanaryTableId = capCanaryTblIdResult[0].id;
                          }
                        } catch (e) {
                          garbage_collection = false;
                          captureErrWrite.write(
                            `db  error ${gTs()}\n   =>    table existance check ERR: ${e}\n`
                          );
                        }
                      } else {
                        // PULL FROM CURRENT ELEMENT
                        currentCanaryTableId = currentElement.canaryId;
                      }
                      // UPDATE _treatmentTables &&  TEST IF CURRENT IN  TABLE
                      try {
                        let treatemntTablesQuery =
                            "SELECT _treatmentTables.* FROM _treatmentTables WHERE _treatmentTables.treatment_id =? AND _treatmentTables.treatment_table =?",
                          treatmentTablesQuryObj = [
                            treatmentTableId,
                            currentElement.table
                          ];
                        testTTResult = await pool_a.query(
                          treatemntTablesQuery,
                          treatmentTablesQuryObj
                        );
                        if (isEmpty(testTTResult)) {
                          // UPDATE TABLE ADD NEW RESULT
                          try {
                            let insertTTResult = await pool_a.query(
                              "INSERT INTO _treatmentTables SET?",
                              {
                                treatment_id: treatmentTableId,
                                treatment_table: currentElement.table
                              }
                            );
                          } catch (e) {
                            garbage_collection = false;
                            captureErrWrite.write(
                              `db  error ${gTs()}\n   =>    UPDATE _treatmentTables ADD NEW RESULT  ERR: ${e}\n`
                            );
                          }
                        }
                      } catch (e) {
                        garbage_collection = false;
                        captureErrWrite.write(
                          `db  error ${gTs()}\n   =>    UPDATE _treatmentTables  -> TEST IF CURRENT  IN  _treatmentTablesERR: ${e}\n`
                        );
                      }
                      // UPDATE _treatmentCanaries &&  TEST IF CURRENT IN  TABLE
                      try {
                        let treatmentCanariesQuery =
                            "SELECT _treatmentCanaries.* FROM _treatmentCanaries WHERE _treatmentCanaries.treatment_id = ? AND _treatmentCanaries.canary_id = ? AND _treatmentCanaries.location_id = ? AND _treatmentCanaries.latitude IS NOT NULL AND _treatmentCanaries.longitude IS NOT NULL",
                          treatmentCanariesUpdateQuery =
                            "SELECT _treatmentCanaries.* FROM _treatmentCanaries WHERE _treatmentCanaries.treatment_id = ? AND _treatmentCanaries.canary_id = ? AND _treatmentCanaries.location_id = ? AND _treatmentCanaries.latitude IS  NULL AND _treatmentCanaries.longitude IS  NULL",
                          canariesQueryObj = [
                            treatmentTableId,
                            currentCanaryTableId,
                            currentLocationTableId
                          ],
                          testTCResult = await pool_a.query(
                            treatmentCanariesQuery,
                            canariesQueryObj
                          );

                        if (!isEmpty(testTCResult)) {
                          let updateLongitude =
                              "longitude" in currentElement
                                ? currentElement.longitude
                                : null,
                            updateLatitude =
                              "latitude" in currentElement
                                ? currentElement.latitude
                                : null;

                          try {
                            let tcUpdateQueryResult = await pool_a.query(
                              "UPDATE _treatmentCanaries SET ? WHERE _treatmentCanaries.treatment_id = ? AND _treatmentCanaries.canary_id = ? AND _treatmentCanaries.location_id = ? ",
                              [
                                {
                                  treatment_id: treatmentTableId,
                                  canary_id: currentCanaryTableId,
                                  location_id: currentLocationTableId,
                                  latitude: updateLatitude,
                                  longitude: updateLongitude
                                },
                                treatmentTableId,
                                currentCanaryTableId,
                                currentLocationTableId
                              ]
                            );
                          } catch (e) {
                            garbage_collection = false;
                            captureErrWrite.write(
                              `db  error ${gTs()}\n   =>    UPDATE _treatmentTables &&  _treatmentCanaries TABLES -> TEST IF CURRENT  IN _treatmentCanaries and needs updating ERR: ${e}\n`
                            );
                          }
                        }
                      } catch (e) {
                        garbage_collection = false;
                        captureErrWrite.write(
                          `db  error ${gTs()}\n   =>    UPDATE _treatmentTables &&  _treatmentCanaries TABLES -> TEST IF CURRENT  IN _treatmentCanaries ERR: ${e}\n`
                        );
                      }
                    } catch (e) {
                      garbage_collection = false;
                      captureErrWrite.write(
                        `db  error ${gTs()}\n   =>    TABLE DOESNT EXISTS  => CREATE TABLE ${
                          testTablesArray[i].table
                        } ERR: ${e}\n`
                      );
                    }
                  } else {
                    let curentCanaryTableId;
                    // if element doe not contain currentElement.canaryId
                    if (currentElement.canaryId == undefined) {
                      try {
                        let canaryIdCapture = await pool_a.query(
                          "SELECT Canaries.id FROM Canaries WHERE Canaries.unit_number =?",
                          currentElement.canary
                        );
                        if (!isEmpty(canaryIdCapture)) {
                          curentCanaryTableId = canaryIdCapture[0].id;
                        }
                      } catch (e) {
                        garbage_collection = false;
                        captureErrWrite.write(
                          `db  error ${gTs()}\n   =>    capture canary table if if not in current element ERR: ${e}\n`
                        );
                      }
                    } else {
                      curentCanaryTableId = currentElement.canaryId;
                    }

                    // TABLE EXISTS CHECK IF _TREATMENT CANARIES INPUT HAS GPPS CORRODINATES ASSIGN IF NOT RECORDED
                    // TEST AND UPDATE TREATMENT CANARIES GPS
                    // capture
                    let updateRequiredResult = await pool_a.query(
                      "SELECT _treatmentCanaries.* FROM _treatmentCanaries WHERE _treatmentCanaries.treatment_id = ? AND _treatmentCanaries.canary_id = ? AND _treatmentCanaries.location_id = ? AND _treatmentCanaries.latitude IS NULL AND _treatmentCanaries.longitude IS NULL",
                      [
                        treatmentTableId,
                        curentCanaryTableId,
                        currentLocationTableId
                      ]
                    );

                    if (!isEmpty(updateRequiredResult)) {
                      // console.log("update required!!!");
                      let updateLongitude =
                          "longitude" in currentElement
                            ? currentElement.longitude
                            : null,
                        updateLatitude =
                          "latitude" in currentElement
                            ? currentElement.latitude
                            : null;

                      try {
                        let tcUpdateQueryResult = await pool_a.query(
                          "UPDATE _treatmentCanaries SET ? WHERE _treatmentCanaries.treatment_id = ? AND _treatmentCanaries.canary_id = ? AND _treatmentCanaries.location_id = ? ",
                          [
                            {
                              treatment_id: treatmentTableId,
                              canary_id: curentCanaryTableId,
                              location_id: currentLocationTableId,
                              latitude: updateLatitude,
                              longitude: updateLongitude
                            },
                            treatmentTableId,
                            curentCanaryTableId,
                            currentLocationTableId
                          ]
                        );
                      } catch (e) {
                        garbage_collection = false;
                        captureErrWrite.write(
                          `db  error ${gTs()}\n   =>    UPDATE _treatmentTables &&  _treatmentCanaries TABLES -> TEST IF CURRENT  IN _treatmentCanaries and needs updating ERR: ${e}\n`
                        );
                      }
                    }
                  }
                } catch (e) {
                  garbage_collection = false;
                  captureErrWrite.write(
                    `db  error ${gTs()}\n   =>    table existance check ERR: ${e}\n`
                  );
                }
              }

              try {
                let treatmentDatainserted = await pool.query(
                  dataInsertQuery,
                  dataInsertObj
                );
                if (!isEmpty(treatmentDatainserted)) {
                  let insertId = treatmentDatainserted[0].insertId;
                  if (insertId % 4 == 0) {
                    logger.log(`capture weather ==>  ${insertId}`);
                    currentWeather(
                      `${treatment_id}_weatherData`,
                      treatment_lat,
                      treatment_long
                    );
                  } else {
                    logger.log(`insertId: no cap ${insertId}`);
                  }
                  logger.log(`--> ${treatmentDatainserted.insertId}`);
                  res.status(200).json({
                    message: "Data recorded",
                    response: "success!"
                  });
                }
              } catch (e) {
                garbage_collection = false;
                captureErrWrite.write(
                  `db  error ${gTs()}\n   =>    treatment data  insert ERR: ${e}\n`
                );
              }
            }
          } catch (e) {
            garbage_collection = false;
            captureErrWrite.write(
              `db  error ${gTs()}\n   =>    capture gps coord ERR: ${e}\n`
            );
          }
        } else {
          res.status(401).json({
            status: "UNAUTHORIZED!",
            message: "Connection attemp denied.."
          });
        }
      } catch (e) {
        garbage_collection = false;
        captureErrWrite.write(
          `db  error ${gTs()}\n   =>    gateway auth check failure ERR: ${e}\n`
        );
      }
    }
  });

  // @route   POST /api/treatment/ -
  // @desc    capture treatmnt data
  // @access  Public
  app.post("/api/treatment/end", async (req, res) => {
    let i_count = 0,
      treatmentLocations = "",
      {
        gateway_id,
        job_id,
        country_id,
        customer_id,
        locations,
        tech_id,
        location_ip,
        canary_data
      } = req.body,
      numLocations = locations.length,
      num_canaries = canary_data.length,
      treatment_id = `${job_id}_${country_id}_${customer_id}`,
      treatment_tech = tech_id !== undefined ? tech_id : 56,
      elogFileName =
        tech_id !== undefined
          ? `${gateway_id}_${job_id}_${country_id}_${customer_id}-{${treatment_tech}}_Errs.log`
          : `${gateway_id}_${job_id}_${country_id}_${customer_id}_Errs.log`,
      captureErrWrite = createWriteStream(`./captureErrs/${elogFileName}`, {
        flags: "a"
      }),
      garbage_collection = true,
      create_treatment_tbl = "CALL createTreatmentTables_v8_after(?,?,?,?)",
      create_weather_tbl = "CALL createTreatmentWeatherTables_v1(?)",
      gps_lookup_qry = `https://extreme-ip-lookup.com/json/${location_ip}`,
      treatmnt_check =
        "SELECT _treatments.id FROM _treatments WHERE _treatments.treatment_id =?",
      tech_tbl_qry = `SELECT _technicians.id as tech_id FROM _technicians WHERE _technicians.user_id =?`,
      allow_access_obj =
        tech_id !== undefined
          ? `SELECT id FROM gateways WHERE gateway_id=?;${tech_tbl_qry}`
          : `SELECT id FROM gateways WHERE gateway_id=?`,
      init_qry_obj = tech_id !== undefined ? [gateway_id, tech_id] : gateway_id,
      tech_id_defined = tech_id !== undefined ? true : false,
      assoc_canary_SQL =
        "SELECT Canaries.id, Canaries.unit_number FROM Canaries WHERE Canaries.node_id =?",
      assoc_canary_SQL_multi =
        "SELECT Canaries.id, Canaries.unit_number FROM Canaries WHERE Canaries.unit_number =?",
      // inTreatmentSQL = `UPDATE gateways SET treatmentCount = treatmentCount+1, ttlTreatmentCount = ttlTreatmentCount+1, activeDate='${gTs()}' WHERE gateway_id=?`,
      get_calibration_sql =
        "SELECT * FROM calibrations WHERE node_id=? ORDER BY calibrations.calibration_id DESC LIMIT 1",
      gw_tbl_id,
      treatment_lat,
      treatment_long,
      treatment_tbl_id,
      tech_tbl_id,
      current_canary,
      treatment_tbls = [],
      captureCanaryByUsage = [],
      custLocationTablesArray = [],
      canariesTablesArray = [],
      custLocationQuery = "",
      treatmentTablesQuery = "",
      treatmentCanariesQuery = "",
      compareTablesArray = [],
      testTablesArray = [],
      ignoreCanries = [],
      verifyTables = [],
      dataInsertQuery = "",
      dataInsertObj = [],
      treatmentTableId;

    // TEST IF CANARY IN LOCATION ARRAY
    let canaryInLocation = (canary, locationArray) => {
      return locationArray.includes(canary);
    };
    Array.prototype.findByValueOfObject = function(key, value) {
      return this.filter(function(item) {
        return item[key] === value;
      });
    };
    let getDateTime = () => {
      let date = new Date();
      let hour = date.getHours();
      hour = (hour < 10 ? "0" : "") + hour;
      let min = date.getMinutes();
      min = (min < 10 ? "0" : "") + min;
      let sec = date.getSeconds();
      sec = (sec < 10 ? "0" : "") + sec;
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = (month < 10 ? "0" : "") + month;
      let day = date.getDate();
      day = (day < 10 ? "0" : "") + day;
      return (
        year + ":" + month + ":" + day + " " + hour + ":" + min + ":" + sec
      );
    };

    function calculateDays(startDate, endDate) {
      var start_date = moment(startDate, "YYYY-MM-DD HH:mm:ss");
      var end_date = moment(endDate, "YYYY-MM-DD HH:mm:ss");
      var duration = moment.duration(end_date.diff(start_date));
      var days = duration.asDays();
      return days.toFixed(2);
    }

    /*
    function:: canaryInArray
    purpose:: to test if treatment table in validation/ creation array
    */
    let canaryInArray = (
      canarysArray,
      ignoreCanries,
      treatmentId,
      locationId,
      gayewayId,
      canaryNumber,
      lat = null,
      long = null
    ) => {
      let testTable = `${treatmentId}_${locationId}_${gayewayId}_${canaryNumber}`,
        compareAgainst = [];
      if (!ignoreCanries.includes(canaryNumber)) {
        for (var c = 0; c < canarysArray.length; c++) {
          compareAgainst.push(canarysArray[c].table);
        }
        // TEST IF LOCATION TABLE IN ARRAY AND APPEND IF NOT
        if (!compareAgainst.includes(testTable)) {
          canarysArray.push({
            table: testTable,
            location: locationId,
            canary: canaryNumber,
            latitude: lat,
            longitude: long
          });
        }
        return compareAgainst;
      }
    };

    if (isEmpty(canary_data)) {
      logger.log("isEmpty!!!");
      try {
        let gps_rslt = await fetch(gps_lookup_qry);
        let data = await gps_rslt.json();
        if (!isEmpty(data)) {
          treatment_lat = data.lat;
          treatment_long = data.lon;
        }
        logger.log(treatment_lat);
        logger.log(treatment_long);
        let loadStartTime =
            "SELECT id, start_time FROM _treatments WHERE treatment_id=?",
          treatment_id = `${job_id}_${country_id}_${customer_id}`;
        logger.log(loadStartTime);

        try {
          let getStartTime = await pool_a.query(loadStartTime, treatment_id);
          logger.log("success");
          if (!isEmpty(getStartTime)) {
            // START TIME CAPTURED
            let treatmentId = getStartTime[0].id,
              startTime = moment(getStartTime[0].start_time).format(
                "YYYY-MM-DD hh:mm:ss"
              ),
              end_time = moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
              end_time_date = moment(Date.now()).format("YYYY-MM-DD"),
              status_id = 4,
              treatment_duration = returnDuration(startTime, end_time),
              updateTable = "UPDATE _treatments SET ? WHERE id = ?",
              endObj = [
                {
                  end_time: end_time,
                  status_id: status_id,
                  duration: treatment_duration
                },
                treatmentId
              ],
              postObj = {
                id: treatmentId,
                treatmentFile: `${treatment_id}_weatherData`,
                latitude: treatment_lat,
                longitude: treatment_long,
                endTime: end_time
              };
            logger.log(treatmentId);
            logger.log(startTime);
            logger.log(end_time);
            logger.log(treatment_duration);
            console.log(postObj);

            /*
              treatment_duration = returnDuration(startTime, end_time),
              updateTable = "UPDATE _treatments SET ? WHERE id = ?",
              endObj = [
                {
                  end_time: end_time,
                  status_id: status_id,
                  duration: treatment_duration
                },
                treatmentId
              ],
              end_time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
              end_time_date = moment(Date.now()).format("YYYY-MM-DD"),
              status_id = 4,
              postObj = {
                id: treatmentId,
                treatmentFile: `${treatment_id}_weatherData`,
                latitude: treatment_lat,
                longitude: treatment_long,
                endTime: end_time
              };*/

            // CAPTURE CANARIES IN TREATMENT
            try {
              let retreiveCanariesResult = await pool_a.query(
                "SELECT _treatmentCanaries.canary_id FROM _treatmentCanaries WHERE _treatmentCanaries.treatment_id = ?",
                treatmentId
              );
              if (!isEmpty(retreiveCanariesResult)) {
                for (var c = 0; c < retreiveCanariesResult.length; c++) {
                  // QUERY TO UPDATE CANARY RUN TIMES
                  let currentCanaryId = retreiveCanariesResult[c].canary_id;
                  try {
                    let rtResult = await pool_a.query(
                      "SELECT Canaries.run_time FROM Canaries WHERE Canaries.id =?",
                      currentCanaryId
                    );
                    if (!isEmpty(rtResult)) {
                      // UPDATE CANARY RUNTIME
                      let updateRuntime = parseFloat(
                        rtResult[0].run_time + treatment_duration
                      ).toFixed(2);
                      try {
                        let updateResult = await pool_a.query(
                          "UPDATE Canaries SET ? WHERE id = ?",
                          [{ run_time: updateRuntime }, currentCanaryId]
                        );
                      } catch (e) {
                        garbage_collection = false;
                        captureErrWrite.write(
                          `db  error ${gTs()}\n   =>   capture runtime ERR: ${e}\n`
                        );
                      }
                    }
                  } catch (e) {
                    garbage_collection = false;
                    captureErrWrite.write(
                      `db  error ${gTs()}\n   =>   capture runtime ERR: ${e}\n`
                    );
                  }
                }

                // QUERY TO UPDATE GATEWAY RUN TIMES
                try {
                  let capGatewayForInsertResult = await pool_a.query(
                    "SELECT gateways.run_time , gateways.treatmentCount , gateways.ttlTreatmentCount FROM gateways WHERE gateways.gateway_id = ?",
                    gateway_id
                  );
                  if (!isEmpty(capGatewayForInsertResult)) {
                    let gatewayRTupdate = parseFloat(
                        capGatewayForInsertResult[0].run_time +
                          treatment_duration
                      ).toFixed(2),
                      updateTrtCount =
                        capGatewayForInsertResult[0].treatmentCount + 1,
                      updateTTLTrtcount =
                        capGatewayForInsertResult[0].ttlTreatmentCount + 1;
                    try {
                      let gatewayRTresult = await pool_a.query(
                        "UPDATE gateways SET ? WHERE gateway_id = ?",
                        [
                          {
                            treatmentCount: updateTrtCount,
                            ttlTreatmentCount: updateTTLTrtcount,
                            run_time: gatewayRTupdate
                          },
                          gateway_id
                        ]
                      );
                      if (gatewayRTresult.affectedRows == 1) {
                        // CLOSEOUT TREATMENT
                        try {
                          let completeResult = await pool_a.query(
                            updateTable,
                            endObj
                          );

                          if (completeResult.affectedRows == 1) {
                            // DELETE FILE CONTROLLING WEATHER CAPTURE
                            let closeOut = deleteActiveFile(
                              `./weatherFiles/${treatment_id}_weatherData.log`
                            );
                            let elogDeleted = fileDelete(
                              `./captureErrs/${elogFileName}`,
                              true,
                              treatmentTableId
                            );
                            if (closeOut !== undefined) {
                              // START DELAYED WEATHER CAPTURE
                              // startWeatherDelay(
                              //   treatmentTableId,
                              //   `${treatment_id}_weatherData_delayed`,
                              //   treatment_lat,
                              //   treatment_long
                              // );
                              // capture final weatherinput
                              currentWeather(
                                `${treatment_id}_weatherData`,
                                treatment_lat,
                                treatment_long
                              );

                              res.status(200).json({
                                message: `Treatment ${treatment_id} completed.`,
                                status: "Complete!"
                              });

                              // START  24 HOUR AUTOMATED _TREATMENT UPDATE
                              weatherChild("_weatherCaptureDelayed.js", [
                                treatmentId,
                                `${treatment_id}_weatherData`,
                                parseFloat(treatment_lat),
                                parseFloat(treatment_long)
                              ]);
                            }
                          }
                        } catch (e) {
                          garbage_collection = false;
                          captureErrWrite.write(
                            `db  error ${gTs()}\n   =>   CLOSEOUT TREATMENT ERR: ${e}\n`
                          );
                        }
                      }
                    } catch (e) {
                      garbage_collection = false;
                      captureErrWrite.write(
                        `db  error ${gTs()}\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ${e}\n`
                      );
                    }
                  }
                } catch (e) {
                  garbage_collection = false;
                  captureErrWrite.write(
                    `db  error ${gTs()}\n   =>   capture gateway runtime ERR: ${e}\n`
                  );
                }
              }
            } catch (e) {
              garbage_collection = false;
              captureErrWrite.write(
                `db  error ${gTs()}\n   =>     update treatment table ERR: ${e}\n`
              );
            }
          }
        } catch (e) {
          garbage_collection = false;
          captureErrWrite.write(
            `db  error ${gTs()}\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ${e}\n`
          );
        }
      } catch (e) {
        garbage_collection = false;
        captureErrWrite.write(
          `db  error ${gTs()}\n   =>    cp lat log from extreme ip: ${e}\n`
        );
      }
    } else {
      // TEST AUTH IS GATEWAY IN DB
      try {
        let authConn = await pool_a.query(allow_access_obj, init_qry_obj);
        if (!isEmpty(authConn[0])) {
          // SET TECH TABLE ID && GATEWAY TABLE ID:
          tech_tbl_id =
            tech_id_defined && !isEmpty(authConn[1][0])
              ? authConn[1][0].tech_id
              : 2;
          gw_tbl_id = authConn[0][0].id;

          // CAPTURE LOCATION GPS
          try {
            let gps_rslt = await fetch(gps_lookup_qry);
            let data = await gps_rslt.json();
            if (!isEmpty(data)) {
              treatment_lat = data.lat;
              treatment_long = data.lon;

              // SORT LOCTIONS
              locations.sort((a, b) => {
                if (b.canaries.length < a.canaries.length) {
                  return -1;
                }
                if (b.canaries.length > a.canaries.length) {
                  return 1;
                }

                // ELSE NAMES MUST BE EQUAL
                return 0;
              });

              // SET DEFAULT LOCATION ID
              let defaultLocationId = locations[locations.length - 1].id;

              // APPEND ASSIGNED CANARIES TO IGNORE ARRAY && UNSURE ASSIGNED TABLES ARE CREATED
              for (var i = 0; i < locations.length; i++) {
                let lcLocation = locations[i].id,
                  activeLocation = lcLocation.toUpperCase();
                if (!isEmpty(locations[i].canaries)) {
                  let activeCanaries = locations[i].canaries;
                  for (var a = 0; a < activeCanaries.length; a++) {
                    ignoreCanries.push(activeCanaries[a]);
                    // APPEND TO testTablesArray FOR TABLE EXISTANCE CHECK
                    compareTablesArray.push(
                      `${treatment_id}_${activeLocation}_${gateway_id}_${
                        activeCanaries[a]
                      }`
                    );
                    testTablesArray.push({
                      table: `${treatment_id}_${activeLocation}_${gateway_id}_${
                        activeCanaries[a]
                      }`,
                      location: activeLocation,
                      canary: activeCanaries[a]
                    });
                  }
                } else {
                  activeLocation = locations[i].id;
                }
              }

              // ITERATE THROUGH CANARY DATA_INSERTED
              for (var c = 0; c < canary_data.length; c++) {
                let currentDataset = canary_data[c],
                  currentNode_id = currentDataset.node_id,
                  currentUnitLat = currentDataset.latitude,
                  currentUnitLong = currentDataset.longitude;

                // CAPTURE NODE_ID, UNIT NUMBER AND CALIBRATIONS FOR ACTIVE DATASET, CALIBRATE DATA, ASSIGN TO INSERT OBJ, APPEND INSERT QUERY,
                try {
                  let canaryCaptureResult = await pool_a.query(
                    "SELECT Canaries.id , Canaries.unit_number FROM Canaries WHERE Canaries.node_id = ?;SELECT calibrations.* FROM calibrations WHERE calibrations.node_id =?;SELECT _treatments.id FROM _treatments WHERE _treatments.treatment_id =?",
                    [currentNode_id, currentNode_id, treatment_id]
                  );
                  if (!isEmpty(canaryCaptureResult)) {
                    let currentUnitNumber =
                        canaryCaptureResult[0][0].unit_number,
                      currentUnitId = canaryCaptureResult[0][0].id,
                      currentCalibrations = canaryCaptureResult[1][0],
                      currentIsCalibrated =
                        currentCalibrations !== undefined ? true : false,
                      currentData,
                      to_decimals = 3;
                    treatmentTableId = canaryCaptureResult[2][0].id;

                    if (!ignoreCanries.includes(currentUnitNumber)) {
                      let ucDefaultLocation = defaultLocationId.toUpperCase(),
                        currentTargetTable = `${treatment_id}_${ucDefaultLocation}_${gateway_id}_${currentUnitNumber}`;

                      // APPEND TABLE CREATION TEST ARRAY IF TABLE NOT ALREADI INCLUDED...
                      if (!compareTablesArray.includes(currentTargetTable)) {
                        testTablesArray.push({
                          table: currentTargetTable,
                          location: ucDefaultLocation,
                          canary: currentUnitNumber,
                          canaryId: currentUnitId,
                          latitude: currentUnitLat,
                          longitude: currentUnitLong /*,
                        treatmentTableId: treatmentTableId*/
                        });
                      }
                      // APPEND INSERT QUERY
                      dataInsertQuery += `INSERT INTO ${treatment_id}_${ucDefaultLocation}_${gateway_id}_${currentUnitNumber} SET ?;`;
                    } else {
                      let searchfor = `_${gateway_id}_${currentUnitNumber}`,
                        index = compareTablesArray.findIndex(value =>
                          new RegExp(searchfor, "g").test(value)
                        ),
                        intoTable = compareTablesArray[index];
                      dataInsertQuery += `INSERT INTO ${intoTable} SET ?;`;
                    }

                    // CALIBRATE DATA
                    if (currentIsCalibrated) {
                      currentData = {
                        node_id: currentDataset.node_id,
                        // TEMPERATURE: CANARY_DATA[C].TEMPERATURE,
                        canary_temp: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.canary_temp,
                          currentCalibrations.canary_temp_divisor,
                          currentCalibrations.canary_temp_modifier,
                          to_decimals
                        ),
                        calibration_id: currentCalibrations
                          ? currentCalibrations.calibration_id
                          : null,
                        latitude: nullOrUndefined(currentDataset.latitude),
                        longitude: nullOrUndefined(currentDataset.longitude),
                        date: nullOrUndefinedNaN(currentDataset.date),
                        time: nullOrUndefinedNaN(currentDataset.time),
                        // TEMPERATURE: CANARY_DATA[C].TEMPERATURE,
                        temperature: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.temperature,
                          currentCalibrations.temp_divisor,
                          currentCalibrations.temp_modifier,
                          to_decimals
                        ),
                        // humidity: currentDataset.humidity,
                        humidity: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.humidity,
                          currentCalibrations.humidity_divisor,
                          currentCalibrations.humidity_modifier,
                          to_decimals
                        ),
                        // pressure: currentDataset.pressure,
                        pressure: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.pressure,
                          currentCalibrations.pressure_divisor,
                          currentCalibrations.pressure_modifier,
                          to_decimals
                        ),
                        // // UV: currentDataset.UV,
                        UV: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.UV,
                          currentCalibrations.UV_divisor,
                          currentCalibrations.UV_modifier,
                          to_decimals
                        ),
                        // CdS: currentDataset.CdS,
                        CdS: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.CdS,
                          currentCalibrations.CdS_divisor,
                          currentCalibrations.CdS_modifier,
                          to_decimals
                        ),
                        // CO2: currentDataset.CO2,
                        CO2: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.CO2,
                          currentCalibrations.CO2_divisor,
                          currentCalibrations.CO2_modifier,
                          to_decimals
                        ),
                        // // O2: currentDataset.O2,
                        O2: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.O2,
                          currentCalibrations.O2_divisor,
                          currentCalibrations.O2_modifier,
                          to_decimals
                        ),
                        // VOC: currentDataset.VOC,
                        VOC: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.VOC,
                          currentCalibrations.VOC_divisor,
                          currentCalibrations.VOC_modifier,
                          to_decimals
                        ),
                        // NH3: currentDataset.NH3,
                        NH3: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.NH3,
                          currentCalibrations.NH3_divisor,
                          currentCalibrations.NH3_modifier,
                          to_decimals
                        ),
                        // CH4: currentDataset.CH4,
                        CH4: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.CH4,
                          currentCalibrations.CH4_divisor,
                          currentCalibrations.CH4_modifier,
                          to_decimals
                        ),
                        // CO: currentDataset.CO,
                        CO: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.CO,
                          currentCalibrations.CO_divisor,
                          currentCalibrations.CO_modifier,
                          to_decimals
                        ),
                        // SR1: currentDataset.SR1,
                        SR1: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.SR1,
                          currentCalibrations.SR1_divisor,
                          currentCalibrations.SR1_modifier,
                          to_decimals
                        ),
                        // SR2: currentDataset.SR2,
                        SR2: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.SR2,
                          currentCalibrations.SR2_divisor,
                          currentCalibrations.SR2_modifier,
                          to_decimals
                        ),
                        // SR3: currentDataset.SR3,
                        SR3: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.SR3,
                          currentCalibrations.SR3_divisor,
                          currentCalibrations.SR3_modifier,
                          to_decimals
                        ),
                        // NH3: currentDataset.NH3,
                        dB: returnCalibrated(
                          currentIsCalibrated,
                          currentDataset.dB,
                          currentCalibrations.dB_divisor,
                          currentCalibrations.dB_modifier,
                          to_decimals
                        ),
                        SRalarm: nullOrUndefined(currentDataset.SRalarm),
                        motion: nullOrUndefined(currentDataset.motion),
                        xs_heat: nullOrUndefined(currentDataset.xs_heat),
                        insert_time: currentDataset.insert_time
                      };
                    } else {
                      currentData = {
                        node_id: currentDataset.node_id,
                        canary_temp: nullOrUndefinedDec(
                          currentDataset.canary_temp
                        ),
                        calibration_id: null,
                        latitude: nullOrUndefined(currentDataset.latitude),
                        longitude: nullOrUndefined(currentDataset.longitude),
                        date: nullOrUndefinedNaN(currentDataset.date),
                        time: nullOrUndefinedNaN(currentDataset.time),
                        temperature: nullOrUndefinedDec(
                          currentDataset.temperature * 1
                        ),
                        humidity: nullOrUndefinedDec(
                          currentDataset.humidity * 1
                        ),
                        pressure: nullOrUndefined(currentDataset.pressure * 1),
                        UV: nullOrUndefinedDec(currentDataset.UV * 1),
                        CdS: nullOrUndefinedDec(currentDataset.CdS * 1),
                        CO2: nullOrUndefinedDec(currentDataset.CO2 * 1),
                        O2: nullOrUndefinedDec(currentDataset.O2 * 1),
                        VOC: nullOrUndefinedDec(currentDataset.VOC * 1),
                        NH3: nullOrUndefinedDec(currentDataset.NH3 * 1),
                        CH4: nullOrUndefinedDec(currentDataset.CH4 * 1),
                        CO: nullOrUndefinedDec(currentDataset.CO * 1),
                        SR1: nullOrUndefinedDec(currentDataset.SR1 * 1),
                        SR2: nullOrUndefinedDec(currentDataset.SR2 * 1),
                        SR3: nullOrUndefinedDec(currentDataset.SR3 * 1),
                        dB: nullOrUndefinedDec(currentDataset.dB * 1),
                        SRalarm: nullOrUndefinedDec(currentDataset.SRalarm),
                        motion: nullOrUndefinedDec(currentDataset.motion),
                        xs_heat: nullOrUndefinedDec(currentDataset.xs_heat),
                        insert_time: currentDataset.insert_time
                      };
                    }
                    // ASSIGN TO INSERT OBJ
                    dataInsertObj[dataInsertObj.length] = currentData;
                    // TEST IF GPS NEED updating
                    try {
                      let updateGPSResult = await pool_a.query(
                        "SELECT _treatmentCanaries.* FROM _treatmentCanaries WHERE _treatmentCanaries.treatment_id = ? AND _treatmentCanaries.canary_id = ? AND _treatmentCanaries.latitude IS NOT NULL AND _treatmentCanaries.longitude IS NOT NULL",
                        [treatmentTableId, currentUnitId]
                      );

                      if (isEmpty(updateGPSResult)) {
                        // UPDATE  TREATMENTCANARIES TABLES\
                        try {
                          let updateSuccess = await pool_a.query(
                            " UPDATE _treatmentCanaries SET ? WHERE _treatmentCanaries.treatment_id = ? AND _treatmentCanaries.canary_id = ? ",
                            [
                              {
                                latitude: currentUnitLat,
                                longitude: currentUnitLong
                              },
                              treatmentTableId,
                              currentUnitId
                            ]
                          );
                        } catch (e) {}
                      }
                    } catch (e) {
                      garbage_collection = false;
                      captureErrWrite.write(
                        `db  error ${gTs()}\n   =>    CAPTURE NODE_ID, UNIT NUMBER AND CALIBRATIONS  ERR: ${e}\n`
                      );
                    }
                  }
                } catch (e) {
                  garbage_collection = false;
                  captureErrWrite.write(
                    `db  error ${gTs()}\n   =>    CAPTURE NODE_ID, UNIT NUMBER AND CALIBRATIONS  ERR: ${e}\n`
                  );
                }
              }

              // TEST IF REQUIRED DATA TABLES DO NOT EXIST CREATE AND UPDATE _TREATMENTTABLES _TREATMENTCANARIES
              let updateTreatmentCanariesQuery = "",
                treatmentCanariesObj = [],
                updateTreatmentTablesQuery = "";
              treatmentTablesObj = [];

              // TEST IF REQUIRED DATA TABLES DO NOT EXIST CREATE AND UPDATE _TREATMENTTABLES _TREATMENTCANARIES
              for (var i = 0; i < testTablesArray.length; i++) {
                let currentElement = testTablesArray[i],
                  currentCanaryTableId,
                  currentLocationTableId = "",
                  updateTreatmentCanaries = null,
                  updateTreatmentTables = null,
                  insertQuery = "",
                  insertObj;

                // CAPTURE LOCATION TABLE ID
                try {
                  let queryLocationTableIdResult = await pool_a.query(
                    "SELECT _customerLocations.id FROM _customers JOIN _customerLocations ON _customers.id = _customerLocations.cust_id WHERE _customerLocations.location_id =? and _customers.customer_id =?",
                    [currentElement.location, customer_id]
                  );
                  if (!isEmpty(queryLocationTableIdResult)) {
                    currentLocationTableId = queryLocationTableIdResult[0].id;
                  }
                } catch (e) {
                  garbage_collection = false;
                  captureErrWrite.write(
                    `db  error ${gTs()}\n   =>    CAPTURE LOCATION TABLE ID ERR: ${e}\n`
                  );
                }
                // TEST IF TABLE EXISTS
                try {
                  let existsResult = await pool.query(
                    "SHOW TABLES LIKE ?",
                    currentElement.table
                  );
                  // IF TABLE DOESNT EXIST
                  if (isEmpty(existsResult)) {
                    // TABLE DOESNT EXISTS  => CREATE TABLE
                    try {
                      let updateResut = await pool.query(create_treatment_tbl, [
                        treatment_id,
                        currentElement.location,
                        gateway_id,
                        currentElement.canary
                      ]);

                      // TEST IF CANARY ID EXISIS IN ELEMENT
                      let canaryIdExists =
                        "canaryId" in currentElement ? true : false;
                      if (!canaryIdExists) {
                        // IF CANARY ID EXISIS IN ELEMENT CAPTURE FROM DB
                        try {
                          let capCanaryTblIdResult = await pool_a.query(
                            "SELECT Canaries.id FROM Canaries WHERE Canaries.unit_number =?",
                            currentElement.canary
                          );
                          if (!isEmpty(capCanaryTblIdResult)) {
                            currentCanaryTableId = capCanaryTblIdResult[0].id;
                          }
                        } catch (e) {
                          garbage_collection = false;
                          captureErrWrite.write(
                            `db  error ${gTs()}\n   =>    table existance check ERR: ${e}\n`
                          );
                        }
                      } else {
                        // PULL FROM CURRENT ELEMENT
                        currentCanaryTableId = currentElement.canaryId;
                      }
                      // UPDATE _treatmentTables &&  TEST IF CURRENT IN  TABLE
                      try {
                        let treatemntTablesQuery =
                            "SELECT _treatmentTables.* FROM _treatmentTables WHERE _treatmentTables.treatment_id =? AND _treatmentTables.treatment_table =?",
                          treatmentTablesQuryObj = [
                            treatmentTableId,
                            currentElement.table
                          ];
                        testTTResult = await pool_a.query(
                          treatemntTablesQuery,
                          treatmentTablesQuryObj
                        );
                        if (isEmpty(testTTResult)) {
                          // UPDATE TABLE ADD NEW RESULT
                          try {
                            let insertTTResult = await pool_a.query(
                              "INSERT INTO _treatmentTables SET?",
                              {
                                treatment_id: treatmentTableId,
                                treatment_table: currentElement.table
                              }
                            );
                          } catch (e) {
                            garbage_collection = false;
                            captureErrWrite.write(
                              `db  error ${gTs()}\n   =>    UPDATE _treatmentTables ADD NEW RESULT  ERR: ${e}\n`
                            );
                          }
                        }
                      } catch (e) {
                        garbage_collection = false;
                        captureErrWrite.write(
                          `db  error ${gTs()}\n   =>    UPDATE _treatmentTables  -> TEST IF CURRENT  IN  _treatmentTablesERR: ${e}\n`
                        );
                      }
                      // UPDATE _treatmentCanaries &&  TEST IF CURRENT IN  TABLE
                      try {
                        let treatmentCanariesQuery =
                            "SELECT _treatmentCanaries.* FROM _treatmentCanaries WHERE _treatmentCanaries.treatment_id = ? AND _treatmentCanaries.canary_id = ? AND _treatmentCanaries.location_id = ? AND _treatmentCanaries.latitude IS NOT NULL AND _treatmentCanaries.longitude IS NOT NULL",
                          treatmentCanariesUpdateQuery =
                            "SELECT _treatmentCanaries.* FROM _treatmentCanaries WHERE _treatmentCanaries.treatment_id = ? AND _treatmentCanaries.canary_id = ? AND _treatmentCanaries.location_id = ? AND _treatmentCanaries.latitude IS  NULL AND _treatmentCanaries.longitude IS  NULL",
                          canariesQueryObj = [
                            treatmentTableId,
                            currentCanaryTableId,
                            currentLocationTableId
                          ],
                          testTCResult = await pool_a.query(
                            treatmentCanariesQuery,
                            canariesQueryObj
                          );

                        if (!isEmpty(testTCResult)) {
                          let updateLongitude =
                              "longitude" in currentElement
                                ? currentElement.longitude
                                : null,
                            updateLatitude =
                              "latitude" in currentElement
                                ? currentElement.latitude
                                : null;

                          try {
                            let tcUpdateQueryResult = await pool_a.query(
                              "UPDATE _treatmentCanaries SET ? WHERE _treatmentCanaries.treatment_id = ? AND _treatmentCanaries.canary_id = ? AND _treatmentCanaries.location_id = ? ",
                              [
                                {
                                  treatment_id: treatmentTableId,
                                  canary_id: currentCanaryTableId,
                                  location_id: currentLocationTableId,
                                  latitude: updateLatitude,
                                  longitude: updateLongitude
                                },
                                treatmentTableId,
                                currentCanaryTableId,
                                currentLocationTableId
                              ]
                            );
                          } catch (e) {
                            garbage_collection = false;
                            captureErrWrite.write(
                              `db  error ${gTs()}\n   =>    UPDATE _treatmentTables &&  _treatmentCanaries TABLES -> TEST IF CURRENT  IN _treatmentCanaries and needs updating ERR: ${e}\n`
                            );
                          }
                        }
                      } catch (e) {
                        garbage_collection = false;
                        captureErrWrite.write(
                          `db  error ${gTs()}\n   =>    UPDATE _treatmentTables &&  _treatmentCanaries TABLES -> TEST IF CURRENT  IN _treatmentCanaries ERR: ${e}\n`
                        );
                      }
                    } catch (e) {
                      garbage_collection = false;
                      captureErrWrite.write(
                        `db  error ${gTs()}\n   =>    TABLE DOESNT EXISTS  => CREATE TABLE ${
                          testTablesArray[i].table
                        } ERR: ${e}\n`
                      );
                    }
                  } else {
                    let curentCanaryTableId;
                    // if element doe not contain currentElement.canaryId
                    if (currentElement.canaryId == undefined) {
                      try {
                        let canaryIdCapture = await pool_a.query(
                          "SELECT Canaries.id FROM Canaries WHERE Canaries.unit_number =?",
                          currentElement.canary
                        );
                        if (!isEmpty(canaryIdCapture)) {
                          curentCanaryTableId = canaryIdCapture[0].id;
                        }
                      } catch (e) {
                        garbage_collection = false;
                        captureErrWrite.write(
                          `db  error ${gTs()}\n   =>    capture canary table if if not in current element ERR: ${e}\n`
                        );
                      }
                    } else {
                      curentCanaryTableId = currentElement.canaryId;
                    }

                    // TABLE EXISTS CHECK IF _TREATMENT CANARIES INPUT HAS GPPS CORRODINATES ASSIGN IF NOT RECORDED
                    // TEST AND UPDATE TREATMENT CANARIES GPS
                    let updateRequiredResult = await pool_a.query(
                      "SELECT _treatmentCanaries.* FROM _treatmentCanaries WHERE _treatmentCanaries.treatment_id = ? AND _treatmentCanaries.canary_id = ? AND _treatmentCanaries.location_id = ? AND _treatmentCanaries.latitude IS NULL AND _treatmentCanaries.longitude IS NULL",
                      [
                        treatmentTableId,
                        curentCanaryTableId,
                        currentLocationTableId
                      ]
                    );

                    if (!isEmpty(updateRequiredResult)) {
                      // console.log("update required!!!");
                      let updateLongitude =
                          "longitude" in currentElement
                            ? currentElement.longitude
                            : null,
                        updateLatitude =
                          "latitude" in currentElement
                            ? currentElement.latitude
                            : null;

                      try {
                        let tcUpdateQueryResult = await pool_a.query(
                          "UPDATE _treatmentCanaries SET ? WHERE _treatmentCanaries.treatment_id = ? AND _treatmentCanaries.canary_id = ? AND _treatmentCanaries.location_id = ? ",
                          [
                            {
                              treatment_id: treatmentTableId,
                              canary_id: curentCanaryTableId,
                              location_id: currentLocationTableId,
                              latitude: updateLatitude,
                              longitude: updateLongitude
                            },
                            treatmentTableId,
                            curentCanaryTableId,
                            currentLocationTableId
                          ]
                        );
                      } catch (e) {
                        garbage_collection = false;
                        captureErrWrite.write(
                          `db  error ${gTs()}\n   =>    UPDATE _treatmentTables &&  _treatmentCanaries TABLES -> TEST IF CURRENT  IN _treatmentCanaries and needs updating ERR: ${e}\n`
                        );
                      }
                    }
                  }
                } catch (e) {
                  garbage_collection = false;
                  captureErrWrite.write(
                    `db  error ${gTs()}\n   =>    table existance check ERR: ${e}\n`
                  );
                }
              }
              try {
                let treatmentDatainserted = await pool.query(
                  dataInsertQuery,
                  dataInsertObj
                );
                if (!isEmpty(treatmentDatainserted)) {
                  // APPEND DURATION AND USE TIMES THEN END CAPTURE  DELETE LOG FILE OR EMAIL
                  let loadStartTime =
                      "SELECT start_time FROM _treatments WHERE treatment_id=?",
                    end_time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    status_id = 4,
                    treatment_id = `${job_id}_${country_id}_${customer_id}`;
                  try {
                    let gotStartTime = await pool_a.query(
                      loadStartTime,
                      treatment_id
                    );
                    if (gotStartTime) {
                      // START TIME CAPTURED

                      let treatment_duration = returnDuration(
                          gotStartTime[0].start_time,
                          end_time
                        ),
                        updateTable = "UPDATE _treatments SET ? WHERE id = ?",
                        endObj = [
                          {
                            end_time: end_time,
                            status_id: status_id,
                            duration: treatment_duration
                          },
                          treatmentTableId
                        ];

                      console.log(
                        " treatment_duration >> ",
                        treatment_duration
                      );

                      // CAPTURE CANARIES IN TREATMNT
                      try {
                        let retreiveCanariesResult = await pool_a.query(
                          "SELECT _treatmentCanaries.canary_id FROM _treatmentCanaries WHERE _treatmentCanaries.treatment_id = ?",
                          treatmentTableId
                        );
                        if (!isEmpty(retreiveCanariesResult)) {
                          for (
                            var c = 0;
                            c < retreiveCanariesResult.length;
                            c++
                          ) {
                            // QUERY TO UPDATE CANARY RUN TIMES
                            let currentCanaryId =
                              retreiveCanariesResult[c].canary_id;
                            try {
                              let rtResult = await pool_a.query(
                                "SELECT Canaries.run_time FROM Canaries WHERE Canaries.id =?",
                                currentCanaryId
                              );
                              if (!isEmpty(rtResult)) {
                                // UPDATE CANARY RUNTIME
                                let updateRuntime = parseFloat(
                                  rtResult[0].run_time + treatment_duration
                                ).toFixed(2);
                                try {
                                  let updateResult = await pool_a.query(
                                    "UPDATE Canaries SET ? WHERE id = ?",
                                    [
                                      { run_time: updateRuntime },
                                      currentCanaryId
                                    ]
                                  );
                                } catch (e) {
                                  garbage_collection = false;
                                  captureErrWrite.write(
                                    `db  error ${gTs()}\n   =>   capture runtime ERR: ${e}\n`
                                  );
                                }
                              }
                            } catch (e) {
                              garbage_collection = false;
                              captureErrWrite.write(
                                `db  error ${gTs()}\n   =>   capture runtime ERR: ${e}\n`
                              );
                            }
                          } ///////
                          // QUERY TO UPDATE GATEWAY RUN TIMES
                          try {
                            let capGatewayForInsertResult = await pool_a.query(
                              "SELECT gateways.run_time , gateways.treatmentCount , gateways.ttlTreatmentCount FROM gateways WHERE gateways.gateway_id = ?",
                              gateway_id
                            );
                            if (!isEmpty(capGatewayForInsertResult)) {
                              let gatewayRTupdate = parseFloat(
                                  capGatewayForInsertResult[0].run_time +
                                    treatment_duration
                                ).toFixed(2),
                                updateTrtCount =
                                  capGatewayForInsertResult[0].treatmentCount +
                                  1,
                                updateTTLTrtcount =
                                  capGatewayForInsertResult[0]
                                    .ttlTreatmentCount + 1;
                              try {
                                let gatewayRTresult = await pool_a.query(
                                  "UPDATE gateways SET ? WHERE gateway_id = ?",
                                  [
                                    {
                                      treatmentCount: updateTrtCount,
                                      ttlTreatmentCount: updateTTLTrtcount,
                                      run_time: gatewayRTupdate
                                    },
                                    gateway_id
                                  ]
                                );
                                if (gatewayRTresult.affectedRows == 1) {
                                  // CLOSEOUT TREATMENT

                                  try {
                                    let completeResult = await pool_a.query(
                                      updateTable,
                                      endObj
                                    );

                                    if (completeResult.affectedRows == 1) {
                                      // DELETE FILE CONTROLLING WEATHER CAPTURE
                                      let closeOut = deleteActiveFile(
                                        `./weatherFiles/${treatment_id}_weatherData.log`
                                      );
                                      let elogDeleted = fileDelete(
                                        `./captureErrs/${elogFileName}`,
                                        true,
                                        treatmentTableId
                                      );
                                      if (closeOut !== undefined) {
                                        // CAPTURE FINAL WEATHER INPUT
                                        currentWeather(
                                          `${treatment_id}_weatherData`,
                                          treatment_lat,
                                          treatment_long
                                        );
                                        res.status(200).json({
                                          message: `Treatment ${treatment_id} completed.`,
                                          status: "Complete!"
                                        });

                                        // START  24 HOUR AUTOMATED _TREATMENT UPDATE
                                        weatherChild(
                                          "_weatherCaptureDelayed.js",
                                          [
                                            treatmentTableId,
                                            `${treatment_id}_weatherData`,
                                            parseFloat(treatment_lat),
                                            parseFloat(treatment_long)
                                          ]
                                        );
                                      }
                                    }
                                  } catch (e) {
                                    garbage_collection = false;
                                    captureErrWrite.write(
                                      `db  error ${gTs()}\n   =>   CLOSEOUT TREATMENT ERR: ${e}\n`
                                    );
                                  }
                                }
                              } catch (e) {
                                garbage_collection = false;
                                captureErrWrite.write(
                                  `db  error ${gTs()}\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ${e}\n`
                                );
                              }
                            }
                          } catch (e) {
                            garbage_collection = false;
                            captureErrWrite.write(
                              `db  error ${gTs()}\n   =>   capture gateway runtime ERR: ${e}\n`
                            );
                          }
                        }
                      } catch (e) {
                        garbage_collection = false;
                        captureErrWrite.write(
                          `db  error ${gTs()}\n   =>     update treatment table ERR: ${e}\n`
                        );
                      }
                    }
                  } catch (e) {
                    garbage_collection = false;
                    captureErrWrite.write(
                      `db  error ${gTs()}\n   =>    load start time ERR: ${e}\n`
                    );
                  }
                }
              } catch (e) {
                garbage_collection = false;
                captureErrWrite.write(
                  `db  error ${gTs()}\n   =>    treatment data  insert ERR: ${e}\n`
                );
              }
            }
          } catch (e) {
            garbage_collection = false;
            captureErrWrite.write(
              `db  error ${gTs()}\n   =>    capture gps coord ERR: ${e}\n`
            );
          }
        } else {
          res.status(401).json({
            status: "UNAUTHORIZED!",
            message: "Connection attemp denied.."
          });
        }
      } catch (e) {
        garbage_collection = false;
        captureErrWrite.write(
          `db  error ${gTs()}\n   =>    gateway auth check failure ERR: ${e}\n`
        );
      }
    }
  });
};
