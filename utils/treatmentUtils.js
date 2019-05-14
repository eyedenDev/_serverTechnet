'use strict';
let i_count = 0,
  insertDataSQL = '',
  insertData = [],
  // pool = require('../config/asyncPool'),
  processTreatment = require('./processTreatment'),
  moment = require('moment');


const treatmentUtils = {
  // retur calibrated values

  processMultiple: async (
    gateway_id,
    job_id,
    country_id,
    customer_id,
    locations,
    canary_data
  ) => {},
  processSingle: async (req, res) => {
    let {
        gateway_id,
        job_id,
        country_id,
        customer_id,
        locations,
        canary_data
      } = req.body,
      num_canaries = canary_data.length;

    for (let canary of canary_data) {
      // APPEND RAW INSERT DATA SQL
      insertDataSQL += `INSERT INTO ${gateway_id}_${
        canary.node_id
      }_${job_id}_${country_id}_${customer_id}_${locations[0].id}_raw SET ?;`;

      // APPEND CANARY DATA
      insertData[insertData.length] = {
        node_id: canary.node_id,
        latitude: canary.latitude,
        longitude: canary.longitude,
        date: canary.date,
        time: canary.time,
        temperature: canary.temperature * 1,
        humidity: canary.humidity * 1,
        pressure: canary.pressure * 1,
        UV: canary.UV * 1,
        CdS: canary.CdS * 1,
        CO2: canary.CO2 * 1,
        O2: canary.O2 * 1,
        VOC: canary.VOC * 1,
        NH3: canary.NH3 * 1,
        CO: canary.CO * 1,
        SR1: canary.SR1 * 1,
        SR2: canary.SR2 * 1,
        SR3: canary.SR3 * 1,
        SRalarm: canary.SRalarm
      };
      // APPEND CALIBRATED CANARY SQL
      insertDataSQL += `INSERT INTO ${gateway_id}_${
        canary.node_id
      }_${job_id}_${country_id}_${customer_id}_${locations[0].id}_cal SET ?;`;
      // LOAD CANARY CALIBRATION
      var get_calibration_sql =
        'SELECT * FROM calibrations WHERE node_id=? ORDER BY calibrations.calibration_id DESC LIMIT 1';

      try {
        let getCalibration = await pool.query(
          get_calibration_sql,
          canary.node_id
        );
        if (getCalibration.length > 0) {
          var isCalibrated = getCalibration.length > 0 ? true : false;

          insertData[insertData.length] = {
            node_id: canary.node_id,
            calibration_id: getCalibration
              ? getCalibration[0].calibration_id
              : null,
            latitude: canary.latitude,
            longitude: canary.longitude,
            temperature: processTreatment.returnCalibrated(
              isCalibrated,
              canary.temperature,
              getCalibration[0].temp_divisor,
              getCalibration[0].temp_modifier
            ),
            date: moment(canary.date).format('YYYY-MM-DD'),
            time: canary.time,
            // humidity: canary.humidity,
            humidity: processTreatment.returnCalibrated(
              isCalibrated,
              canary.humidity,
              getCalibration[0].humidity_divisor,
              getCalibration[0].humidity_modifier
            ),
            // pressure: canary.pressure,
            pressure: processTreatment.returnCalibrated(
              isCalibrated,
              canary.pressure,
              getCalibration[0].pressure_divisor,
              getCalibration[0].pressure_modifier
            ),
            // // UV: canary.UV,
            UV: processTreatment.returnCalibrated(
              isCalibrated,
              canary.UV,
              getCalibration[0].UV_divisor,
              getCalibration[0].UV_modifier
            ),
            // CdS: canary.CdS,
            CdS: processTreatment.returnCalibrated(
              isCalibrated,
              canary.CdS,
              getCalibration[0].CdS_divisor,
              getCalibration[0].CdS_modifier
            ),
            // CO2: canary.CO2,
            CO2: processTreatment.returnCalibrated(
              isCalibrated,
              canary.CO2,
              getCalibration[0].CO2_divisor,
              getCalibration[0].CO2_modifier
            ),
            // // O2: canary.O2,
            O2: processTreatment.returnCalibrated(
              isCalibrated,
              canary.O2,
              getCalibration[0].O2_divisor,
              getCalibration[0].O2_modifier
            ),
            // VOC: canary.VOC,
            VOC: processTreatment.returnCalibrated(
              isCalibrated,
              canary.VOC,
              getCalibration[0].VOC_divisor,
              getCalibration[0].VOC_modifier
            ),
            // NH3: canary.NH3,
            NH3: processTreatment.returnCalibrated(
              isCalibrated,
              canary.NH3,
              getCalibration[0].NH3_divisor,
              getCalibration[0].NH3_modifier
            ),
            // CO: canary.CO,
            CO: processTreatment.returnCalibrated(
              isCalibrated,
              canary.CO,
              getCalibration[0].CO_divisor,
              getCalibration[0].CO_modifier
            ),
            // SR1: canary.SR1,
            SR1: processTreatment.returnCalibrated(
              isCalibrated,
              canary.SR1,
              getCalibration[0].SR1_divisor,
              getCalibration[0].SR1_modifier
            ),
            // SR2: canary.SR2,
            SR2: processTreatment.returnCalibrated(
              isCalibrated,
              canary.SR2,
              getCalibration[0].SR2_divisor,
              getCalibration[0].SR2_modifier
            ),
            // SR3: canary.SR3,
            SR3: processTreatment.returnCalibrated(
              isCalibrated,
              canary.SR3,
              getCalibration[0].SR3_divisor,
              getCalibration[0].SR3_modifier
            ),
            SRalarm: canary.SRalarm
          };
          // INCREMENT COUNTER
          i_count++;
        } else {
          insertData[insertData.length] = {
            node_id: canary.node_id,
            latitude: canary.latitude,
            longitude: canary.longitude,
            date: canary.date,
            time: canary.time,
            temperature: canary.temperature * 1,
            humidity: canary.humidity * 1,
            pressure: canary.pressure * 1,
            UV: canary.UV * 1,
            CdS: canary.CdS * 1,
            CO2: canary.CO2 * 1,
            O2: canary.O2 * 1,
            VOC: canary.VOC * 1,
            NH3: canary.NH3 * 1,
            CO: canary.CO * 1,
            SR1: canary.SR1 * 1,
            SR2: canary.SR2 * 1,
            SR3: canary.SR3 * 1,
            SRalarm: canary.SRalarm
          };
          i_count++;
        }
      } catch (e) {
        return res.status(500).send(e);
      }
    }

    return { sql: insertDataSQL, data: insertData, i_count: i_count};

    // if (num_canaries == i_count) {
    //   try {
    //     const insertComplete = await pool.query(insertDataSQL, insertData);
    //     if (insertComplete) {
    //       return res.status(200).json({
    //         message: 'Data recorded',
    //         response: 'success!'
    //       });
    //     }
    //   } catch (e) {
    //     return res.status(500).send(e);
    //   }
    // }
  }
};
module.exports = treatmentUtils;
