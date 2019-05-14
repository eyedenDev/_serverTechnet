"use strict";
const fs = require("fs"),
  path = require("path"),
  CONFIG = require("../config/config"),
  async = require("async"),
  moment = require("moment"),
  // Podio = require("podio-js").api,
  axios = require("axios"),
  axiosInstance = axios.create({
    baseURL: CONFIG.base_url
    // timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'}
  }),
  stripTags = require("striptags"),
  // CARBON STANDARDS
  appId_cStnd = CONFIG.c_standard_app_id,
  appToken_cStand = CONFIG.c_standard_app_token,
  // CONTACTS APP
  appId_cncts = CONFIG.contacts_app_id,
  appToken_cnct = CONFIG.contacts_app_token,
  // CUSTOMER APP
  appId_cust = CONFIG.customer_app_id,
  appToken_cust = CONFIG.customer_app_token,
  // GREENHOUSE APP
  appId_gHse = CONFIG.jobs_greenhouse_app_id,
  appToken_gHse = CONFIG.jobs_greenhouse_app_token,
  // LOCATIONS APP
  appId_loc = CONFIG.treatemnt_app_id,
  appToken_loc = CONFIG.treatemnt_app_token,
  // POULTRY APP
  appId_pltry = CONFIG.customer_app_id,
  appToken_pltry = CONFIG.customer_app_token,
  // TECH APP
  appId_tec = CONFIG.tech_app_id,
  appToken_tec = CONFIG.tech_app_token,
  pdoFilter = require("../middleware/pdoFilter"),
  podioFunctions = require("../middleware/podioAPI");

const utilities = {
  treatmentFuncs: {
    getDetails: filename => {
      const minusFolder = filename.substring(filename.indexOf("/") + 1),
        tableName = filename.substring(
          filename.indexOf("/") + 1,
          filename.indexOf("-")
        ),
        items = tableName.split("_"),
        gateway_id = items[0],
        node_id = items[1],
        job_id = items[2],
        coumtry_code = items[3],
        customer_id = items[4],
        location_id = items[5],
        itemNum = filename.substring(
          filename.indexOf("-") + 1,
          filename.indexOf("]")
        ),
        ofNum = filename.substring(
          filename.indexOf("]") + 1,
          filename.indexOf("{")
        ),
        tech_id = filename.substring(
          filename.indexOf("{") - 1,
          filename.indexOf("}")
        ),
        recordCount = filename.substring(
          filename.lastIndexOf("-") + 1,
          filename.search(/.json/gm)
        ),
        logName = `${tableName}-${itemNum}]${ofNum}{${tech_id}}_batchUploadErrs.log`;
      return {
        minusFolder,
        tableName,
        gateway_id,
        node_id,
        job_id,
        coumtry_code,
        customer_id,
        location_id,
        itemNum,
        ofNum,
        tech_id,
        recordCount,
        logName
      };
    },
    retreiveTableName: source => {
      return source.substr(0, source.lastIndexOf("_"));
    },
    calculBatchCount: (datasetLength, tbleName) => {
      let itCount = Math.ceil(datasetLength / 1000),
        returnArray = [];
      for (let i = 0; i < itCount; i++) {
        let writeName = `./batchProcess/${utilities.treatmentFuncs.retreiveTableName(
          tbleName
        )}_${i}`;
        returnArray.push(writeName);
      }
      return returnArray;
    },
    batch4insertion: dataSets => {
      let batchData = [],
        itCount = Math.ceil(dataSets.length / 1000);
      for (let i = 0; i < itCount; i++) {
        if (dataSets.length > 1000) {
          batchData[i] = dataSets.splice(0, 1000);
        } else {
          let currentLength = dataSets.length;
          batchData[i] = dataSets.splice(0, currentLength);
        }
      }
      return batchData;
    },
    /*
    FUNCTION: getCalibrations
    PURPOSE:  query db with axios for node calibrations
    PARAMS:   canary  obj && get getCalibration result
    RETURN:    void
    */
    getCalibrations: node_id => {
      console.log(" in  @getCalibrations");
      axiosInstance({
        method: "post",
        url: "/api/getCalibrations",
        data: {
          node_id: node_id
        }
      })
        .then(function(response) {
          console.log(response);
          return response;
          // console.log(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    /*
    FUNCTION: returnCalibrateObjMulti
    PURPOSE:   apply calibration to treatment data for multiple locations and return
    PARAMS:   canary  obj && get getCalibration result
    RETURN:    void
    */
    populateData: async (canary, getCalibration) => {
      axiosInstance
        .post("/api/treatment/batchProcessCanaries", {
          canariesArray: canaries
        })
        .then(function(response) {
          let nodesArray = response.data;
          console.log(nodesArray);

          for (let node of nodesArray) {
            console.log(node.node_id);
          }

          // console.log(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    /*
    FUNCTION: returnCalibrateObjMulti
    PURPOSE:   apply calibration to treatment data for multiple locations and return
    PARAMS:   canary  obj && get getCalibration result
    RETURN:    void
    */
    returnCalibrateObjMulti: (canary, getCalibration) => {
      return {
        node_id: canary.data.node_id,
        calibration_id: getCalibration
          ? getCalibration[0].calibration_id
          : null,
        latitude: utilities.generalFuncs.nullOrUndefined(canary.data.latitude),
        longitude: utilities.generalFuncs.nullOrUndefined(
          canary.data.longitude
        ),
        date: utilities.generalFuncs.nullOrUndefined(
          moment(canary.data.date).format("YYYY-MM-DD")
        ),
        time: utilities.generalFuncs.nullOrUndefined(canary.data.time),
        temperature: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.data.temperature,
          getCalibration[0].temp_divisor,
          getCalibration[0].temp_modifier,
          3
        ),
        // humidity: canary.data.humidity,
        humidity: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.data.humidity,
          getCalibration[0].humidity_divisor,
          getCalibration[0].humidity_modifier,
          3
        ),
        // pressure: canary.data.pressure,
        pressure: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.data.pressure,
          getCalibration[0].pressure_divisor,
          getCalibration[0].pressure_modifier,
          3
        ),
        // // UV: canary.data.UV,
        UV: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.data.UV,
          getCalibration[0].UV_divisor,
          getCalibration[0].UV_modifier,
          3
        ),
        // CdS: canary.data.CdS,
        CdS: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.data.CdS,
          getCalibration[0].CdS_divisor,
          getCalibration[0].CdS_modifier,
          3
        ),
        // CO2: canary.data.CO2,
        CO2: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.data.CO2,
          getCalibration[0].CO2_divisor,
          getCalibration[0].CO2_modifier,
          3
        ),
        // // O2: canary.data.O2,
        O2: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.data.O2,
          getCalibration[0].O2_divisor,
          getCalibration[0].O2_modifier,
          3
        ),
        // VOC: canary.data.VOC,
        VOC: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.data.VOC,
          getCalibration[0].VOC_divisor,
          getCalibration[0].VOC_modifier,
          3
        ),
        // NH3: canary.data.NH3,
        NH3: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.data.NH3,
          getCalibration[0].NH3_divisor,
          getCalibration[0].NH3_modifier,
          3
        ),
        // CO: canary.data.CO,
        CO: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.data.CO,
          getCalibration[0].CO_divisor,
          getCalibration[0].CO_modifier,
          3
        ),
        // SR1: canary.data.SR1,
        SR1: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.data.SR1,
          getCalibration[0].SR1_divisor,
          getCalibration[0].SR1_modifier,
          3
        ),
        // SR2: canary.data.SR2,
        SR2: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.data.SR2,
          getCalibration[0].SR2_divisor,
          getCalibration[0].SR2_modifier,
          3
        ),
        // SR3: canary.data.SR3,
        SR3: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.data.SR3,
          getCalibration[0].SR3_divisor,
          getCalibration[0].SR3_modifier,
          3
        ),
        SRalarm: canary.data.SRalarm,
        insert_time: utilities.generalFuncs.valCalDateTime(
          canary.data.insert_time
        )
      };
    },
    /*
    FUNCTION: returncalibrateDataObjMulti
    PURPOSE:   apply calibration to treatment data for multiple locations  and return
    PARAMS:   canary  obj && get getCalibration result
    RETURN:    void
    */
    returnUncalibrateObjMulti: async canary => {
      return {
        node_id: canary.data.node_id,
        latitude: utilities.generalFuncs.nullOrUndefined(canary.data.latitude),
        longitude: utilities.generalFuncs.nullOrUndefined(
          canary.data.longitude
        ),
        date: utilities.generalFuncs.nullOrUndefined(
          moment(canary.data.date).format("YYYY-MM-DD")
        ),
        time: utilities.generalFuncs.nullOrUndefined(canary.data.time),
        temperature: utilities.generalFuncs.nullOrUndefinedFloat(
          canary.data.temperature * 1
        ),
        humidity: utilities.generalFuncs.nullOrUndefinedFloat(
          canary.data.humidity * 1
        ),
        pressure: utilities.generalFuncs.nullOrUndefinedFloat(
          canary.data.pressure * 1
        ),
        UV: utilities.generalFuncs.nullOrUndefinedFloat(canary.data.UV * 1),
        CdS: utilities.generalFuncs.nullOrUndefinedFloat(canary.data.CdS * 1),
        CO2: utilities.generalFuncs.nullOrUndefinedFloat(canary.data.CO2 * 1),
        O2: utilities.generalFuncs.nullOrUndefinedFloat(canary.data.O2 * 1),
        VOC: utilities.generalFuncs.nullOrUndefinedFloat(canary.data.VOC * 1),
        NH3: utilities.generalFuncs.nullOrUndefinedFloat(canary.data.NH3 * 1),
        CO: utilities.generalFuncs.nullOrUndefinedFloat(canary.data.CO * 1),
        SR1: utilities.generalFuncs.nullOrUndefinedFloat(canary.data.SR1 * 1),
        SR2: utilities.generalFuncs.nullOrUndefinedFloat(canary.data.SR2 * 1),
        SR3: utilities.generalFuncs.nullOrUndefinedFloat(canary.data.SR3 * 1),
        SRalarm: canary.data.SRalarm,
        insert_time: utilities.generalFuncs.valCalDateTime(canary.insert_time)
      };
    },
    /*
    FUNCTION: returnCalibrateObjSolo
    PURPOSE:   apply calibration to treatment data for multiple locations and return
    PARAMS:   canary  obj && get getCalibration result
    RETURN:    void
    */
    returnCalibrateObjSolo: (canary, getCalibration) => {
      return {
        node_id: canary.node_id,
        calibration_id: getCalibration
          ? getCalibration[0].calibration_id
          : null,
        latitude: utilities.generalFuncs.nullOrUndefined(canary.latitude),
        longitude: utilities.generalFuncs.nullOrUndefined(canary.longitude),
        date: utilities.generalFuncs.nullOrUndefined(
          moment(canary.date).format("YYYY-MM-DD")
        ),
        time: utilities.generalFuncs.nullOrUndefined(canary.data.time),
        temperature: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.temperature,
          getCalibration[0].temp_divisor,
          getCalibration[0].temp_modifier,
          3
        ),
        // humidity: canary.humidity,
        humidity: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.humidity,
          getCalibration[0].humidity_divisor,
          getCalibration[0].humidity_modifier,
          3,
          3
        ),
        // pressure: canary.pressure,
        pressure: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.pressure,
          getCalibration[0].pressure_divisor,
          getCalibration[0].pressure_modifier,
          3,
          3
        ),
        // // UV: canary.UV,
        UV: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.UV,
          getCalibration[0].UV_divisor,
          getCalibration[0].UV_modifier,
          3,
          3
        ),
        // CdS: canary.CdS,
        CdS: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.CdS,
          getCalibration[0].CdS_divisor,
          getCalibration[0].CdS_modifier,
          3,
          3
        ),
        // CO2: canary.CO2,
        CO2: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.CO2,
          getCalibration[0].CO2_divisor,
          getCalibration[0].CO2_modifier,
          3,
          3
        ),
        // // O2: canary.O2,
        O2: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.O2,
          getCalibration[0].O2_divisor,
          getCalibration[0].O2_modifier,
          3,
          3
        ),
        // VOC: canary.VOC,
        VOC: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.VOC,
          getCalibration[0].VOC_divisor,
          getCalibration[0].VOC_modifier,
          3,
          3
        ),
        // NH3: canary.NH3,
        NH3: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.NH3,
          getCalibration[0].NH3_divisor,
          getCalibration[0].NH3_modifier,
          3,
          3
        ),
        // CO: canary.CO,
        CO: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.CO,
          getCalibration[0].CO_divisor,
          getCalibration[0].CO_modifier,
          3,
          3
        ),
        // SR1: canary.SR1,
        SR1: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.SR1,
          getCalibration[0].SR1_divisor,
          getCalibration[0].SR1_modifier,
          3,
          3
        ),
        // SR2: canary.SR2,
        SR2: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.SR2,
          getCalibration[0].SR2_divisor,
          getCalibration[0].SR2_modifier,
          3,
          3
        ),
        // SR3: canary.SR3,
        SR3: utilities.generalFuncs.returnCalibrated(
          isCalibrated,
          canary.SR3,
          getCalibration[0].SR3_divisor,
          getCalibration[0].SR3_modifier,
          3,
          3
        ),
        SRalarm: canary.SRalarm,
        insert_time: utilities.generalFuncs.valCalDateTime(
          canary.datainsert_time
        )
      };
    },
    /*
    FUNCTION: returncalibrateDataObjSolo
    PURPOSE:   apply calibration to treatment data for multiple locations  and return
    PARAMS:   canary  obj && get getCalibration result
    RETURN:    void
    */
    returnUncalibrateObjSolo: async canary => {
      return {
        node_id: canary.node_id,
        latitude: utilities.generalFuncs.nullOrUndefined(canary.latitude),
        longitude: utilities.generalFuncs.nullOrUndefined(canary.longitude),
        date: utilities.generalFuncs.nullOrUndefined(
          moment(canary.date).format("YYYY-MM-DD")
        ),
        time: utilities.generalFuncs.nullOrUndefined(canary.data.time),
        temperature: utilities.generalFuncs.nullOrUndefined(
          canary.temperature * 1
        ),
        humidity: utilities.generalFuncs.nullOrUndefined(canary.humidity * 1),
        pressure: utilities.generalFuncs.nullOrUndefined(canary.pressure * 1),
        UV: utilities.generalFuncs.nullOrUndefined(canary.UV * 1),
        CdS: utilities.generalFuncs.nullOrUndefined(canary.CdS * 1),
        CO2: utilities.generalFuncs.nullOrUndefined(canary.CO2 * 1),
        O2: utilities.generalFuncs.nullOrUndefined(canary.O2 * 1),
        VOC: utilities.generalFuncs.nullOrUndefined(canary.VOC * 1),
        NH3: utilities.generalFuncs.nullOrUndefined(canary.NH3 * 1),
        CO: utilities.generalFuncs.nullOrUndefined(canary.CO * 1),
        SR1: utilities.generalFuncs.nullOrUndefined(canary.SR1 * 1),
        SR2: utilities.generalFuncs.nullOrUndefined(canary.SR2 * 1),
        SR3: utilities.generalFuncs.nullOrUndefined(canary.SR3 * 1),
        SRalarm: canary.SRalarm,
        insert_time: utilities.generalFuncs.valCalDateTime(canary.insert_time)
      };
    }
  },
  generalFuncs: {
    /*
  FUNCTION: processBatchFile
  PURPOSE:   capture batchUploasd files and hand off to filehandler to extract data from file
  PARAMS:   filesArray
  RETURN:    void
  */
    processBatchFile: async filesArray => {
      filesArray.forEach((file, index) => {
        fs.readFile(`./${file.path}`, utilities.generalFuncs.fileHandeler);
      });
    },
    /*
  FUNCTION: fileHandeler
  PURPOSE:  parse json data call func to use axios to create treatment
  PARAMS:   err, data
  RETURN:    void
  */
    fileHandeler: (err, data) => {
      if (err) throw err;

      const obj = JSON.parse(data),
        gateway = obj.gateway_id,
        job_id = obj.job_id,
        country_id = obj.country_id,
        customer_id = obj.customer_id,
        locations = obj.locations[0].id,
        canaries = obj.locations[0].canaries,
        canary_data = obj.canary_data;

      axiosInstance
        .post("/api/treatment/batchProcessCanaries", {
          canariesArray: canaries
        })
        .then(function(response) {
          let nodesArray = response.data;
          console.log(nodesArray);

          for (let node of nodesArray) {
            console.log(node.node_id);
          }

          // console.log(response.data);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    /*
    FUNCTION: batchProcessCanaries
    PURPOSE:  query db to create tables data with axios
    PARAMS:   canaries array
    RETURN:    bool
    */
    batchProcess: async (
      gateway,
      job_id,
      country_id,
      customer_id,
      locations,
      canaries,
      canary_data
    ) => {
      console.log("inside.. batchProcessCanaries");
      axiosInstance({
        method: "post",
        url: "/api/treatment/batchProcess",
        data: {
          gateway: gateway,
          job_id: job_id,
          country_id: country_id,
          customer_id: customer_id,
          locations: locations,
          canaries: canaries,
          canary_data: canary_data
        }
      });
    },
    /*
    FUNCTION: batchProcessCanaries
    PURPOSE:  query db to create tables data with axios
    PARAMS:   canaries array
    RETURN:    bool
    */
    batchProcessCanaries: async batchProcessCanaries => {
      console.log("inside.. batchProcessCanaries");
      axiosInstance({
        method: "post",
        url: "/api/treatment/batchProcessTreatment",
        data: {
          batchProcessCanaries
        }
      });
      // axiosInstance
      //   .post('/api/treatment/batchProcess', batchProcessCanaries)
      //   .then(function(response) {
      //     console.log(response);
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //   });
    },
    readFiles: async (dir, processFile) => {
      fs.readdir(dir, (error, fileNames));
    },
    test: data => {
      utilities.generalFuncs.test2(`${data} wtf!!!`);
    },
    test2: moreData => {
      console.log(">>>>> " + moreData);
    },
    // test if file exists
    getFileRealPath: s => {
      try {
        return fs.realpathSync(s);
      } catch (e) {
        return false;
      }
    },
    fileExists: dataFiles => {
      const dataLength = dataCanaries.length,
        uploadedFiles = [];
      dataFiles.forEach(file => {
        console.log(file.originalname);
        console.log(file.path);
      });
      // let exists = await fileExists(filePath);
      // if exists return
    },
    /*
      FUNCTION: isEmpty
      PURPOSE:  return duration of action
      PARAMS:   _startTime && _endTime
      RETURN:    float
      */
    isEmpty: obj => {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) return false;
      }
      return true;
    },
    /*
      FUNCTION: returnDuration
      PURPOSE:  return duration of action
      PARAMS:   _startTime && _endTime
      RETURN:    float
      */
    returnDuration: (startTime, endTime) => {
      const _startTime = moment(startTime).format(),
        _endTime = moment(endTime).format(),
        _duration = moment.duration(moment(_endTime).diff(_startTime)),
        _hours = _duration.asHours();
      return _hours.toFixed(2);
    },
    /*
          FUNCTION: returnCalibrated
          PURPOSE:  if value exists &&  calibrate  values exist  claibrate and return value  else if value exist no cal values return raw value else value undefined or null return null
          PARAMS:   isCalibrated == bool value int divisor model dec value
          RETURN:    vaorig vaalue or null
          */
    returnCalibrated: (isCalibrated, arg, div, mod, dec = 4) => {
      const convertFloat = parseFloat(arg);
      // if null dumpout and return null
      if (arg === null || arg === undefined) {
        return null;
      } else if (isNaN(convertFloat)) {
        return null;
      } else {
        //  y = mx+b :: y = b + mx  return isCalibrated ? mod + value * div : value;
        const initValue = arg * 1,
          divisor = div * 1,
          modifier = mod * 1;
        let rtnResult = isCalibrated
          ? initValue / divisor + modifier
          : initValue;
        return parseFloat(parseFloat(rtnResult).toFixed(dec));
      }
    },
    /*
              FUNCTION: valCalDateTime
              PURPOSE:  validate if calibration  date time is valid timestamp if not attempt to format if both fail rturn null else retun formated timestamp
              PARAMS:   date  value
              RETURN:   null || timestamp
              */
    valCalDateTime: date => {
      // return new Date(date).toString() !== 'Invalid Date' ? true : false;
      return new Date(date).toString() == "Invalid Date"
        ? moment(date).format("YYYY-MM-DD hh:mm:ss")
        : new Date(date).toString() !== "Invalid Date"
        ? date
        : null;
    },

    /*
                FUNCTION: nullOrUndefined
                PURPOSE:  test if var undefined or null
                PARAMS:   arg  value
                RETURN:    vaorig vaalue or null
                */
    nullOrUndefined: arg => {
      return arg !== null && arg !== undefined ? arg : null;
    },
    /*
                FUNCTION: nullOrUndefined
                PURPOSE:  test if var undefined or null
                PARAMS:   arg  value
                RETURN:    vaorig vaalue or null
                */
    nullOrUndefinedCoord: arg => {
      return arg !== null && arg !== undefined && arg !== "0.000000"
        ? arg
        : null;
    },

    /*
                FUNCTION: nullOrUndefined
                PURPOSE:  test if var undefined or null
                PARAMS:   arg  value
                RETURN:    vaorig vaalue or null
                */
    nullOrUndefinedFloat: (arg, dec = 3) => {
      return arg !== null && arg !== undefined && !isNaN(arg)
        ? parseFloat(arg).toFixed(dec)
        : null;
    },
    nullOrUndefinedBool: arg => {
      if ((Boolean(arg) === arg && arg === true) || arg === "true") {
        return true;
      } else {
        return false;
      }
    },
    /*
      FUNCTION: numberOfCanaries
      PURPOSE:  return number of canaries used in treatment removing marker locatioon
      PARAMS:   string
      RETURN:   int
      */
    numberOfCanaries: canaryArr => {
      const markerCount =
          canaryArr.length -
          canaryArr
            .toString()
            .split("'xxx'")
            .toString()
            .split(",").length,
        numberCanaries = canaryArr.length + markerCount;
      return numberCanaries;
    },
    canaryCount: arr => {
      const itemArray = arr.split(","),
        theCount = itemArray.reduce(
          (prev, curr) => ((prev[curr] = ++prev[curr] || 1), prev),
          {}
        );
      return theCount["'xxx'"] !== undefined ? theCount["'xxx'"] + 1 : 1;
    },
    /*
      FUNCTION: parsCanaries
      PURPOSE:  ensure canaries aarray only contains ints
      PARAMS:   arr  array && rtnActual boolean
      RETURN:    array of ints
      */
    parseCanaries: canaries => {
      let returnCanaries = [];
      canaries.forEach(canary => {
        returnCanaries.push(parseInt(canary));
      });
      return returnCanaries;
    },
    /*
      FUNCTION: countOccurances
      PURPOSE:  iterate ove arry and retun either item count in array or return number of location in array based on div marker
      PARAMS:   arr  array && rtnActual boolean
      RETURN:   int
      */
    countOccurances: arr => {
      return arr.reduce((a, b) => (a[b] = a[b] + 1 || 1) && a, {});
    },
    getTimeStamp: () => {
      let logDate = moment().format("MM_DD_YYYY");
      return `accessLog_${logDate}.log`;
    },
    /*
    FUNC::    jsUcFirst
    PURPOSE:: change first letter of string to uppercase
    PARAMS::  string
    RETURN::  string
    */
    jsUcfirst: string => {
      return string !== undefined
        ? string.charAt(0).toUpperCase() + string.slice(1)
        : "";
    },
    /*
    FUNCTION::  processCustomerSearchById
    PURPOSE::   process returned  results and return formatted json object
    PARAAMS::   resultsData :: json Object
    */
    processSearchById: (resultsData, key, rtnCustName = false) => {
      const itemId = resultsData.item_id,
        // revId = resultsData.revisions[0].item_revision_id,
        resultFiles = resultsData.files,
        resultFields = resultsData.fields,
        filteredData = {};
      filteredData.id = itemId;

      resultFields.forEach(field => {
        switch (field.external_id) {
          case "draft-location-photo":
            filteredData.locationPhoto = {
              photoId: field.values[0].value.file_id,
              name: field.values[0].value.name,
              link: field.values[0].value.link,
              mimetype: field.values[0].value.mimetype
            };
            break;
          case "industry":
            filteredData.industry = {
              industry: field.values[0].value.text,
              industryId: field.values[0].value.id
            };
            break;
          case "website":
            filteredData.website = field.values[0].embed.url;
            break;
          case "contacts":
            {
              let key = "contacts",
                contactsArray = field.values;
              filteredData[key] = [];
              contactsArray.forEach(contact => {
                let data = {
                  contact_id: contact.value.app_item_id,
                  name: contact.value.title
                };
                filteredData[key].push(data);
              });
            }
            break;
          case "location":
            filteredData.location = {
              address: field.values[0].street_address,
              city: field.values[0].city,
              state: field.values[0].state,
              postal: field.values[0].postal_code,
              country: field.values[0].country,
              lat: field.values[0].lat,
              long: field.values[0].lng
            };
            break;
          case "logo":
            filteredData["logo"] = {
              name: field.values[0].value.name,
              link: field.values[0].value.link,
              mimetype: field.values[0].value.mimetype,
              file_id: field.values[0].value.file_id
            };
            break;
          case "title":
            filteredData.name = field.values[0].value;
            break;
          case "details": //  << contact APP :: name field
            filteredData.name = field.values[0].value;
            break;
          case "company": //  << contact APP :: name field
            filteredData.company = field.values[0].value;
            break;
          case "phone": //  << contact APP :: phone field
            filteredData.phone = field.values[0].value;
            break;
          case "address-2": //  << contact APP ::
            filteredData.address = {
              address: field.values[0].street_address,
              city: field.values[0].city,
              state: field.values[0].state,
              postal: field.values[0].postal_code,
              country: field.values[0].country
            };
            break;
          case "tech-mist-industry": //  << contact APP ::
            filteredData.industry = {
              industry: field.values[0].value.text,
              industryId: field.values[0].value.id
            };
            break;
          case "notes": //  << contact APP ::
            filteredData.notes = stripTags(field.values[0].value);
            break;
          case "acres":
            filteredData.acres = field.values[0].value;
            break;
          case "hectares":
            // hectares formula:: acres * 0.404686
            filteredData.hectares = field.values[0].value;
            break;
          case "meters-squared":
            // meters-squared formula:: acres / 0.0002471
            filteredData.metersSquared = field.values[0].value;
            break;
          case "ceiling-gutter-height":
            filteredData.gutterHeight = field.values[0].value;
            break;
          case "calculation":
            // meters-squared formula:: (acres * 4046.86)*Ceiling Gutter Height
            filteredData.totalCubicMeters = field.values[0].value;
            break;
          case "rail-width":
            // meters-squared formula:: (acres * 4046.86)*Ceiling Gutter Height
            filteredData.railWidth = field.values[0].value;
            break;
          case "rail-length":
            // meters-squared formula:: (acres * 4046.86)*Ceiling Gutter Height
            filteredData.railLength = field.values[0].value;
            break;
          case "aerial-photo":
            // meters-squared formula:: (acres * 4046.86)*Ceiling Gutter Height
            // filteredData.railLength = field.values[0].value;
            {
              let key = "aerialPhotos",
                aerialPhotos = field.values;
              filteredData[key] = [];
              aerialPhotos.forEach(photo => {
                let data = {
                  name: photo.value.name,
                  mimetype: photo.value.mimetype,
                  link: photo.value.link
                };
                filteredData[key].push(data);
              });
            }
            break;
          case "relationship":
            filteredData.customer = {
              name: field.values[0].value.title,
              customerId: field.values[0].value.app_item_id
            };
            break;
          case "carbon-demand":
            filteredData.carbonDemand = field.values[0].value;
            break;
          case "category":
            filteredData.category = {
              category: field.values[0].value.text,
              categoryId: field.values[0].value.id
            };
            break;
          default:
            filteredData[field.external_id] = field.values[0].value;
        }
      });
      if (resultFiles.length >= 1) {
        let key = "files";
        filteredData[key] = [];
        resultFiles.forEach((file, index) => {
          var data = {
            fileId: resultFiles[index].file_id,
            fileName: resultFiles[index].name,
            mimetype: resultFiles[index].mimetype,
            link: resultFiles[index].link
          };
          filteredData[key].push(data);
        });
      }
      // filteredData[fieldName] = resultItemId;
      // filteredData.revNum = revId;

      return rtnCustName == false ? filteredData : filteredData.name;
    },

    /*
    FUNCTION::  processFileName
    PURPOSE::   prepfilename for image and logo submitt to db && podio submission
    PARAMS::    custName, custId,  imgType, fileExt all string
    RETURN:: string
    */
    processFileName: currentName => {
      let filteredName = currentName.replace(/ /g, "_");
      if (filteredName.endsWith("_")) {
        return filteredName.slice(0, -1);
      } else {
        return filteredName;
      }
    },

    /*
    FUNCTION::  pdoFilterFileName
    PURPOSE::    fomat and return customername s
    PARAMS::    param string of name
    RETURN::  filteredArray
    */
    pdoFilterPlus: param => {
      let filteredParam = param.replace(/ /g, "+");
      if (filteredParam.endsWith("+")) {
        return filteredParam.slice(0, -1);
      } else {
        return filteredParam;
      }
    },

    /*
    FUNCTION::  processSearchResults
    PURPOSE::   iterate through, fomat and return cusatomer search results
    PARAMS::    resuiltData :: json object key :: string
    RETURN::    json object
    */
    processSearchResults: (resultsData, key) => {
      let resultCount = resultsData.counts.item,
        results = resultsData.results,
        resultObj = {};

      resultObj.resultCount = resultCount > 0 ? resultCount : 0;
      resultObj[key] = [];

      results.forEach(result => {
        let data = {
          name: result.item.title,
          itemId: result.item.item_id
        };
        resultObj[key].push(data);
      });
      return resultObj;
    },

    /*
    FUNCTION::  processDeleted
    PURPOSE::   ftest podio results and retun success failure
    PARAMS::    json obj
    RETURN::  obj
    */
    processDelete: function(results, key) {
      let messageSuccess = "",
        messageFailure = "";
      switch (key) {
        case "poultryJobs":
          messageSuccess = "Poultry job has been deleted.";
          messageFailure = "Poultry job was not deleted... try again later.";
          break;
        case "locations":
          messageSuccess = "Location has been deleted.";
          messageFailure = "Location was not deleted... try again later.";
          break;
        case "greenhouseJobs":
          messageSuccess = "Greenhouse job has been deleted.";
          messageFailure = "Greenhouse job was not deleted... try again later.";
          break;
        case "customer":
          messageSuccess = "Customer has been deleted.";
          messageFailure = "Customer was not deleted... try again later.";
          break;
        case "contact":
          messageSuccess = "Contact has been deleted.";
          messageFailure = "Contact was not deleted... try again later.";
          break;
        default:
          // carbon standards
          messageSuccess = "Carbon standard has been deleted.";
          messageFailure =
            "Carbon standard was not deleted... try again later.";
      }
      console.log(results);
      console.log(messageSuccess + " ::::: " + messageFailure);
      let response = this.isEmpty(results)
        ? {
            status: "success",
            message: messageSuccess
          }
        : {
            status: "failure",
            message: messageFailure
          };
      return response;
    },

    /*
    FUNCTION::  isEmpty
    PURPOSE::   tests if object is empty
    PARAMS::    obj => object
    RETURN::    boolean
    */
    isEmpty: obj => {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) return false;
      }
      return true;
    },
    /*
    FUNCTION::  filterEmbeds
    PURPOSE::   filter returned embed data and return embed object
    PARAMS::    data :: json object key :: string
    RETURN::    json object
    */
    filterEmbeds: data => {
      return { embed: data.embed_id, file: data.files[0].file_id };
    }
  },
  carbonFuncs: {
    /*
    FUNCTION::  processNewCarbonStand
    PURPOSE::   process and return new carbon standard result messgae
    PARAMS::    resuiltData :: json object key :: string
    RETURN::    json object
    */
    processNewCarbonStand: resultsData => {
      const newStandardMsg = {
        status: "success",
        newCarbonStandard: resultsData.title,
        newItemId: resultsData.item_id
      };
      return newStandardMsg;
    }
  },
  cnctFuncs: {
    /*
    FUNCTION::  processContactSearch
    PURPOSE::   process and return contact search results
    PARAMS::    resuiltData :: json object key :: string
    RETURN::    json object
    */
    processContactSearch: resultsData => {
      let resultCount = resultsData.filtered,
        results = resultsData.items,
        resultObj = {},
        key = "contacts";
      resultObj["contactCount"] = resultCount;
      resultObj[key] = [];
      results.forEach(result => {
        let data = {
          contactName: result.title,
          contactId: result.item_id
          // AppItemId: result.app_item_id,
          // revId: result.current_revision.item_revision_id
        };
        resultObj[key].push(data);
      });
      return resultObj;
    },
    returnNewCon: resultsData => {
      console.log(resultsData);
      return resultsData;
    },

    /*
    FUNCTION::  automatedContact
    PURPOSE::   use axios to create contact return id to calling app
    PARAMS::    resuiltData :: json object key :: string
    RETURN::    json object
    */
    automatedContact: contactData => {
      axiosInstance
        .post("/api/pdoContacts/auto_add", { data: contactData })
        .then(function(response) {
          let contactData = response.data,
            returnMessage,
            contacts = [];

          if (contactData.length > 1) {
            contactData.forEach(contact => {
              contacts.push(parseInt(contact.item_id));
            });
            customerData.contacts = contacts;
            returnMessage = {
              status: "successPlus",
              contacts: contacts
            };
          } else {
            customerData.contacts = parseInt(contact.item_id);
            returnMessage = {
              status: "success",
              contactId: contactData.item_id
            };
          }
          return returnMessage;
        })
        .catch(function(error) {
          returnMessage = {
            status: "Failure",
            message: error
          };
        });
    }
  },
  custFuncs: {
    captureCustomers: customers => {
      let customerArray = [],
        insertSQL = "";

      customers.forEach((customer, index) => {
        let data = {
          id: customer.item_id,
          customer: customer.title
        };
        customerArray.push(data);
        insertSQL += "INSERT INTO podio_customers SET ?;";
      });
      console.log("poipoipoipoipoi");
      // axiosInstance
      //   .post('/api/customerCapture', {
      //     query: insertSQL,
      //     customers: customers
      //   })
      //   .then(function(response) {
      //     console.log(response);
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //   });

      return { query: insertSQL, customers: customerArray };
    },
    getCustName: (custId, insertId) => {
      console.log("jhgfdjhgfjhgfjhgf");
      axiosInstance
        .get("/api/pdoCarbonStandard/load/", {
          params: {
            id: insertId
          }
        })
        .then(function(response) {
          utilities.custFuncs.updateCustomerField(response.name, insertId);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    updateCustomerField: (customerName, insertId) => {
      console.log("subCall:: " + custId);
      axiosInstance
        .post("/api/pdoCarbonStandard/load/", {
          customer: customerName,
          id: insertId
        })
        .then(function(response) {
          console.log("complete");
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // async appendCustomers:(custName, custId)=> {
    //   const response = await axiosInstance
    //     .get('/api/pdoCarbonStandard/load/', {
    //       params: {
    //         id: insertId
    //       }
    //     })
    //     .then(function(response) {
    //       console.log(rersponse);
    //       // utilities.custFuncs.updateCustomerField(response.name, insertId);
    //     })
    //     .catch(function(error) {
    //       console.log(error);
    //     });
    // },
    /*
    FUNCTION::  processCustomerSearchById
    PURPOSE::   process returned  results and return formatted json object
    PARAAMS::   resultsData :: json Object
    */
    processNewCustomer: resultsData => {
      const newStandardMsg = {
        status: "success",
        newCustomer: resultsData.title,
        customerId: resultsData.item_id
      };
      return newStandardMsg;
    },
    // queryPodio and retreive customerName
    getCustName: custId => {
      axiosInstance
        .get("/api/pdoCustomers/load/", {
          params: {
            id: custId
          }
        })
        .then(function(response) {
          return response.name;
        })
        .catch(function(error) {
          return {
            status: "Failure",
            message: error
          };
        });
    },
    updateCustomerName: (customerName, id) => {},

    /*
    FUNCTION::  embedWeb
    PURPOSE::   use axios to embed website
    PARAMS::    resuiltData :: json object key :: string
    RETURN::    json object
    */
    appendCustomerName: (customerId, id) => {
      console.log(customerId);
      console.log("----------");
      console.log(id);

      async.waterfall(
        [
          function firstStep(done) {
            // axiosInstance
            //   .get(`/api/pdoCarbonStandard/load/${customerId}`)
            //   .then(function(response) {
            //     done(null, response.name);
            //   })
            //   .catch(function(error) {
            //     console.log(error);
            //   });
          },
          function secondStep(step1Result, done) {
            console.log(step1Result);
            this.utilities.custFuncs.updateCustomerName(step1Result);

            done(null, "Value from step 2"); // <- set value to passed to step 3
          },
          function thirdStep(step2Result, done) {
            console.log(step2Result);

            done(null); // <- no value set for the next step.
          }
        ],
        function(err) {
          if (err) {
            throw new Error(err);
          } else {
            console.log("No error happened in any steps, operation done!");
          }
        }
      );
    },

    // appendCustomerName: async (customerId, id) => {
    //   let customer = utilities.custFuncs.getCustName(customerId),
    //     updateCustomer = 'CALL customerUpdate_v1(?,?,?)',
    //     updateCustObj = {
    //       customerName: customer,
    //       customerId: customerId,
    //       id: id
    //     };
    //
    //   try {
    //     let updateResult = await pool.query(updateCustomer, updateCustObj);
    //     if (updateResult) console.log(customerName);
    //   } catch (e) {
    //     return e;
    //   }
    //
    //   // axiosInstance
    //   //   .post('/api/pdoCustomers/embedWeb', { data: webData })
    //   //   .then(function(response) {
    //   //     customerData.website = response.data;
    //   //
    //   //     return {
    //   //       status: 'success',
    //   //       result: response.data
    //   //     };
    //   //   })
    //   //   .catch(function(error) {
    //   //     returnMessage = {
    //   //       status: 'Failure',
    //   //       message: error
    //   //     };
    //   //   });
    // },

    /*
    FUNCTION::  embedWeb
    PURPOSE::   use axios to embed website
    PARAMS::    resuiltData :: json object key :: string
    RETURN::    json object
    */
    embedWeb: webData => {
      axiosInstance
        .post("/api/pdoCustomers/embedWeb", { data: webData })
        .then(function(response) {
          customerData.website = response.data;

          return {
            status: "success",
            result: response.data
          };
        })
        .catch(function(error) {
          returnMessage = {
            status: "Failure",
            message: error
          };
        });
    }
  },
  grnHouseJobFuncs: {},
  locFuncs: {},
  poultryJobFuncs: {},
  techFuncs: {
    /*
    FUNCTION::  processCustomerSearchById
    PURPOSE::   process returned  results and return formatted json object
    PARAAMS::   resultsData :: json Object
    */
    processTechSearch: resultsData => {
      let resultItemId = resultsData.app_item_id,
        resultFiles = resultsData.files,
        resultFields = resultsData.fields,
        filteredData = {},
        idFieldName = "techId",
        hasSHC = false,
        hasTDG = false;

      // console.log(contactsData);
      filteredData[idFieldName] = resultItemId;

      resultFields.forEach((field, index) => {
        switch (field.external_id) {
          case "image":
            filteredData.image = {
              photoId: field.values[0].value.file_id,
              name: field.values[0].value.name,
              link: field.values[0].value.link,
              mimetype: field.values[0].value.mimetype
            };
            break;
          case "level":
            {
              filteredData.certificates = [];
              let data = {
                certificate: field.values[0].value.text,
                status: field.values[0].value.status
              };
              filteredData.certificates.push(data);
            }
            break;
          case "certification-date":
            filteredData.certificates[0].completionDate =
              field.values[0].start_date;
            break;
          case "safe-handling-of-cryogenics":
            {
              let schData = {
                certificate: field.values[0].value.text,
                status: field.values[0].value.status
              };
              filteredData.certificates.push(schData);
              hasSHC = true;
            }
            break;
          case "shc-date":
            filteredData.certificates[1].completionDate =
              field.values[0].start_date;
            break;
          case "transportation-of-dangerous-goods":
            {
              let tdgData = {
                certificate: field.values[0].value.text,
                status: field.values[0].value.status
              };
              filteredData.certificates.push(tdgData);
              hasTDG = true;
            }
            break;
          case "tdg-date":
            if (hasSHC && hasTDG) {
              filteredData.certificates[2].completionDate =
                field.values[0].start_date;
            } else if (!hasSHC && hasTDG) {
              filteredData.certificates[1].completionDate =
                field.values[0].start_date;
            }
            break;
          case "email":
            {
              let emails = field.values,
                emailsArray = [];
              emails.forEach((email, index) => {
                let data = {
                  email: email.value,
                  type: email.type
                };
                emailsArray.push(data);
              });
              filteredData.emails = emailsArray;
            }
            break;
          case "phone": {
            let phones = field.values,
              phonesArray = [];
            phones.forEach((phone, index) => {
              let data = {
                phone: phone.value,
                type: phone.type
              };
              phonesArray.push(data);
            });
            filteredData.phones = phonesArray;
          }
          //
          //   break;
          case "location":
            filteredData["location"] = {
              address: field.values[0].street_address,
              city: field.values[0].city,
              state: field.values[0].state,
              postal: field.values[0].postal_code,
              country: field.values[0].country,
              lat: field.values[0].lat,
              long: field.values[0].lng
            };
            break;

          case "title":
            filteredData.name = field.values[0].value;
            break;
          // case 'details': //  << contact APP :: name field
          //   filteredData.name = field.values[0].value;
          //   break;
          // case 'company': //  << contact APP :: name field
          //   filteredData.name = field.values[0].value;
          //   break;
          // case 'phone': //  << contact APP :: phone field
          //   filteredData.name = field.values[0].value;
          //   break;
          //
          // case 'address-2': //  << contact APP ::
          //   filteredData['address'] = {
          //     address: field.values[0].street_address,
          //     city: field.values[0].city,
          //     state: field.values[0].state,
          //     postal: field.values[0].postal_code,
          //     country: field.values[0].country
          //   };
          //   break;
          // case 'tech-mist-industry': //  << contact APP ::
          //   filteredData['industry'] = {
          //     industry: field.values[0].value.text,
          //     industryId: field.values[0].value.id
          //   };
          //   break;
          // case 'notes': //  << contact APP ::
          //   filteredData.notes = stripTags(field.values[0].value);
          //   break;
          // case 'acres':
          //   filteredData.acres = field.values[0].value;
          //   break;
          // case 'hectares':
          //   // hectares formula:: acres * 0.404686
          //   filteredData.hectares = field.values[0].value;
          //   break;
          // case 'meters-squared':
          //   // meters-squared formula:: acres / 0.0002471
          //   filteredData.metersSquared = field.values[0].value;
          //   break;
          // case 'ceiling-gutter-height':
          //   filteredData.gutterHeight = field.values[0].value;
          //   break;
          // case 'calculation':
          //   // meters-squared formula:: (acres * 4046.86)*Ceiling Gutter Height
          //   filteredData.totalCubicMeters = field.values[0].value;
          //   break;
          // case 'rail-width':
          //   // meters-squared formula:: (acres * 4046.86)*Ceiling Gutter Height
          //   filteredData.railWidth = field.values[0].value;
          //   break;
          // case 'rail-length':
          //   // meters-squared formula:: (acres * 4046.86)*Ceiling Gutter Height
          //   filteredData.railLength = field.values[0].value;
          //   break;
          // case 'aerial-photo':
          //   // meters-squared formula:: (acres * 4046.86)*Ceiling Gutter Height
          //   // filteredData.railLength = field.values[0].value;
          //   {
          //     let key = 'aerialPhotos',
          //       aerialPhotos = field.values;
          //     filteredData[key] = [];
          //     aerialPhotos.forEach(photo => {
          //       let data = {
          //         name: photo.value.name,
          //         mimetype: photo.value.mimetype,
          //         link: photo.value.link
          //       };
          //       filteredData[key].push(data);
          //     });
          //   }
          //   break;
          // case 'relationship':
          //   filteredData.customer = {
          //     name: field.values[0].value.title,
          //     customerId: field.values[0].value.app_item_id
          //   };
          //   break;
          // case 'carbon-demand':
          //   filteredData['carbon-demand'] = field.values[0].value;
          //   break;
          // case 'category':
          //   filteredData.category = {
          //     category: field.values[0].value.text,
          //     categoryId: field.values[0].value.id
          //   };
          //   break;
          default:
            filteredData[field.external_id] = field.values[0].value;
        }
      });
      if (resultFiles.length >= 1) {
        let key = "files";
        filteredData[key] = [];
        resultFiles.forEach((file, index) => {
          var data = {
            fileId: resultFiles[index].file_id,
            fileName: resultFiles[index].name,
            mimetype: resultFiles[index].mimetype,
            link: resultFiles[index].link
          };
          filteredData[key].push(data);
        });
      }
      return filteredData;
    }
  },
  jobsFuncs: {
    /*
    FUNCTION::  processNewCarbonStand
    PURPOSE::   process and return new carbon standard result messgae
    PARAMS::    resuiltData :: json object key :: string
    RETURN::    json object
    */
    processJobSearch: (resultsData, key) => {
      console.log(resultsData);
      console.log(key);
      // const newStandardMsg = {
      //   status: 'success',
      //   newStandard: resultsData.title,
      //   newItemId: resultsData.app_item_id
      // };
      // return newStandardMsg;
    }
  },

  processNames: filename => {
    return filename.substr(0, filename.lastIndexOf("."));
  }

  /*
  FUNCTION::  pdoFilterFileName
  PURPOSE::    fomat and return customername s
  PARAMS::    param string of name
  RETURN::  filteredArray
  */
  // pdoFilterFileName: param => {
  //   let filteredParam = param.replace(/ /g, '+');
  //   if (filteredParam.endsWith('+')) {
  //     return filteredParam.slice(0, -1);
  //   } else {
  //     return filteredParam;
  //   }
  // },

  /*
  FUNCTION::  processFileName
  PURPOSE::   prepfilename for image and logo submitt to db && podio submission
  PARAMS::    custName, custId,  imgType, fileExt all string
  RETURN:: string
  */
  // processFileName: currentName => {
  //   let filteredName = currentName.replace(/ /g, '_');
  //   if (filteredName.endsWith('_')) {
  //     return filteredName.slice(0, -1);
  //   } else {
  //     return filteredName;
  //   }
  // },

  // testFunction: param => {
  //   return ` hello ${param} hows it giong?`;
  // },

  /*
  FUNCTION::  pdoFilter
  PURPOSE::   remove spaces with +
  PARAMS::    string of name
  RETURN::  string
  */
  // pdoFilter: param => {
  //   let filteredParam = param.replace(/ /g, '+');
  //   if (filteredParam.endsWith('+')) {
  //     return filteredParam.slice(0, -1);
  //   } else {
  //     return filteredParam;
  //   }
  // },

  // GREENHOUSE_JOBS
};
module.exports = utilities;
