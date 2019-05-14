const { createWriteStream } = require("fs"),
  moment = require("moment"),
  getDuration = require("../middleware/getDuration"),
  fetch = require("node-fetch"),
  utilities = require("../utils/utils"),
  nullOrUndefined = require("../utils/nullOrUndefined"),
  returnCalibrated = require("../utils/returnCalibrated"),
  returnDuration = require("../utils/returnDuration"),
  valCalDateTime = require("../utils/valCalDateTime"),
  parseCanaries = require("../utils/parseCanaries"),
  isEmpty = require("../utils/isItEmpty"),
  getFileSizeCap = require("../utils/fileSizeCap"),
  gTs = require("../utils/getTimestamp"),
  CONFIG = require("../config/config"),
  mergeByKey = require("array-merge-by-key"),
  removeFirstChar = require("../utils/removeFirstChar");

module.exports = function(app, passport) {
  const inArray = (needle, haystack) => {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
      if (haystack[i] == needle) return true;
    }
    return false;
  };

  const filterTables = tableName => {
    const keepTables = [
      "PD11RD3_0001_1068055573_Main",
      "GD188_0001_1068055575_Main",
      "GD192_0001_1083558489_Barn300",
      "PipeTest4_0001_0000000000_Main",
      "FT740_9004_88888888_222_G1_30",
      "FT740_9074_999999854_111_G1_40"
    ];
    for (let i = 0; i < keepTables.length; i++) {
      // if(tableName.includes(keepTables[i]) return true;
      return tableName.includes(keepTables[i]) ? true : false;
    }
  };
  const returnCanaryId = node => {
    let canaries = [
      { node_id: "C5E3A86", unit: 3 },
      { node_id: "C25BC57", unit: 2 },
      { node_id: "C34EF34", unit: 1 },
      { node_id: "C8E9EB0", unit: 60 },
      { node_id: "C8EA926", unit: 61 },
      { node_id: "C8EA96B", unit: 58 },
      { node_id: "C8E9FC5", unit: 55 },
      { node_id: "C8E9EC2", unit: 30 },
      { node_id: "C8E9F92", unit: 40 },
      { node_id: "C8E9EA2", unit: 26 },
      { node_id: "C8E9F96", unit: 63 },
      { node_id: "C8E9EB2", unit: 38 },
      { node_id: "C8E9FB2", unit: 35 },
      { node_id: "C8E9FDD", unit: 33 },
      { node_id: "C8E9FD5", unit: 53 }
    ];
    for (let i = 0; i < canaries.length; i++) {
      if (canaries[i].node_id == node) return canaries[i].unit;
    }
  };

  const returnGatewayId = gateway => {
    let gateways = [
      { gateway_id: "GBF4AB9", unit: 1 },
      { gateway_id: "GE26F45", unit: 2 }
    ];
    for (let i = 0; i < gateways.length; i++) {
      if (gateways[i].gateway_id == gateway) return `G${gateways[i].unit}`;
    }
  };
  const renameTables = (tableName, startAt = 0) => {
    let filtered = tableName.substring(startAt),
      splitName = filtered.split("_"),
      gate = returnGatewayId(splitName[0]),
      node = returnCanaryId(splitName[1]),
      treatment = `${splitName[2]}_${splitName[3]}_${splitName[4]}`,
      loc = splitName[5];
    return `${treatment}_${loc}_${gate}_${node}`;
    console.log(splitName);
  };

  const reName_Tables = tableName => {
    let splitName = tableName.split("_"),
      gate = returnGatewayId(splitName[0]),
      node = returnCanaryId(splitName[1]),
      treatment = `${splitName[2]}_${splitName[3]}_${splitName[4]}`,
      loc = splitName[5];
    return `${treatment}_${loc}_${gate}_${node}`;
    // console.log(splitName);
  };
  app.post("/api/testing", async (req, res) => {
console.log(req);
});

  app.get("/api/getGateways", async (req, res) => {
    let getCanaries = `SELECT gateways.gateway_id , gateways.gateway FROM gateways`;

    try {
      let cans = await pool_a.query(getCanaries);
      for (let i = 0; i < cans.length; i++) {
        console.log({ gateway_id: cans[i].gateway, unit: cans[i].gateway_id });
      }
    } catch (e) {
      console.log(e);
    }
  });

  app.get("/api/getCanaries", async (req, res) => {
    let getCanaries = `SELECT TMData_app.Canaries.node_id , TMData_app.Canaries.unit_number FROM TMData_app.Canaries`;

    try {
      let cans = await pool_a.query(getCanaries);
      for (let i = 0; i < cans.length; i++) {
        console.log({ node_id: cans[i].node_id, unit: cans[i].unit_number });
      }
    } catch (e) {
      console.log(e);
    }
  });

  app.get("/api/fix_treatment_tables_times", async (req, res) => {
    let the_tbl = "PD11RD3_0001_1068055573_Main_G1_55_copy",
      ltn = 0,
      gth = 1000,
      insertQry = "",
      insertObj = [];
    try {
      let listRslt = await pool.query(
        `SELECT id , CONCAT(date , ' ' , time) AS insert_time FROM ${the_tbl} `
      );

      if (!isEmpty(listRslt)) {
        console.log(listRslt[0]);
        try {
          await pool.queryt(`UPDATE ${the_tbl} SET ? WHERE id =?`, [
            { insert_time: listRslt[1].insert_time },
            listRslt[1].id
          ]);
        } catch (e) {
          console.log(e);
        }
        // for (var i = 0; i < listRslt.length; i++) {
        //   // console.log(listRslt[i].insert_time, " >>> ", listRslt[i].id);
        //
        //   if (i % 15 === 0) {
        //     insertQry += `UPDATE ${the_tbl} SET ? WHERE id =?;`;
        //     let currentUpsert = [
        //       { insert_time: listRslt[i].insert_time },
        //       listRslt[i].id
        //     ];
        //     insertObj.push(currentUpsert);
        //
        //     // insert
        //     try {
        //       let upserted = await pool.query(insertQry, currentUpsert);
        //       console.log("update_success");
        //     } catch (e) {
        //       console.log(e);
        //     }
        //     // console.log("(i % 15 === 0)");
        //     // console.log(insertQry, "\n", insertObj);
        //
        //     // reset
        //     (insertQry = ""), (insertObj = []);
        //   } else if (i % 15 === 0 && i == listRslt.length) {
        //     insertQry += `UPDATE ${the_tbl} SET ? WHERE id =?;`;
        //     let currentUpsert = [
        //       { insert_time: listRslt[i].insert_time },
        //       listRslt[i].id
        //     ];
        //     insertObj.push(currentUpsert);
        //
        //     // insert
        //     try {
        //       let upserted = await pool.query(insertQry, currentUpsert);
        //       console.log("update_success");
        //     } catch (e) {
        //       console.log(e);
        //     }
        //     // console.log("(i % 15 === 0 && i == listRslt.length) ");
        //     // console.log(insertQry, "\n", insertObj);
        //
        //     // reset
        //     (insertQry = ""), (insertObj = []);
        //   } else if (i % 15 !== 0 && i == listRslt.length) {
        //     insertQry += `UPDATE ${the_tbl} SET ? WHERE id =?;`;
        //     let currentUpsert = [
        //       { insert_time: listRslt[i].insert_time },
        //       listRslt[i].id
        //     ];
        //     insertObj.push(currentUpsert);
        //
        //     // insert
        //     try {
        //       let upserted = await pool.query(insertQry, currentUpsert);
        //       console.log("update_success");
        //     } catch (e) {
        //       console.log(e);
        //     }
        //     // console.log("(i % 15 !== 0 && i == listRslt.length)");
        //     // console.log(insertQry, "\n", insertObj);
        //
        //     // reset
        //     (insertQry = ""), (insertObj = []);
        //   } else {
        //     insertQry += `UPDATE ${the_tbl} SET ? WHERE id =?;`;
        //     let currentUpsert = [
        //       { insert_time: listRslt[i].insert_time },
        //       listRslt[i].id
        //     ];
        //     insertObj.push(currentUpsert);
        //   }
        // }
        // console.log(listRslt);
      }
    } catch (e) {
      console.log(e);
    }
  });

  // @route   POST /api/treatment/end -
  // @desc    append treatmentTables  set endtime and status to complete
  // @access  Public
  app.get("/api/fix_treatment_tables/", async (req, res) => {
    let getTablesQry = `SELECT table_name FROM information_schema.tables where table_schema='2018Tmdatab'`,
      keepTables = [
        "PD11RD3_0001_1068055573_Main",
        "GD188_0001_1068055575_Main",
        "GD192_0001_1083558489_Barn300",
        "PipeTest4_0001_0000000000_Main",
        "FT740_9004_88888888_222_G1_30",
        "FT740_9074_999999854_111_G1_40"
      ];
    try {
      let listRslt = await pool.query(getTablesQry);
      if (!isEmpty(listRslt)) {
        // console.log(listRslt);
        for (let i = 0; i < listRslt.length; i++) {
          let tableName = listRslt[i].table_name,
            combinedVar = "combined_",
            completeVar = "complete_combo_";
          // console.log(tableName);
          // console.log(tableName.includes("complete_combo_"));

          if (tableName.includes(combinedVar)) {
            // if (filterTables(tableName)) {
            // console.log(combinedVar.length, "  >>> ", tableName);
            // console.log(tableName.substring(combinedVar.length));
            // console.log(" >>>> ", renameTables(tableName, combinedVar.length));
            let renameTo = renameTables(tableName, combinedVar.length);
            // await pool.query(`RENAME TABLE '${tableName}' TO '${renameTo}'`);
            await pool.query(
              "RENAME TABLE `" + tableName + "` TO `" + renameTo + "`"
            );
            // } else {
            //   await pool.query(`DROP TABLE ${tableName};`);
            // }
          } else if (tableName.includes("complete_combo_")) {
            // console.log("lk;lk;lk;lk");
            // if (filterTables(tableName)) {
            // console.log(completeVar.length, "  xx>>> ", tableName);
            // console.log(tableName.substring(completeVar.length));
            // console.log(
            //   "  >>>>>>>> ",
            //   renameTables(tableName, completeVar.length)
            // );
            let renameTo = renameTables(tableName, completeVar.length);
            // await pool.query(`RENAME TABLE '${tableName}' TO '${renameTo}'`);
            await pool.query(
              "RENAME TABLE `" + tableName + "` TO `" + renameTo + "`"
            );
            // } else {
            //   await pool.query(`DROP TABLE ${tableName};`);
            // }
          } else if (
            tableName.includes("FT740_9074_999999854") ||
            tableName.includes("FT740_9004_88888888")
          ) {
          } else {
            // if (filterTables(tableName)) {
            // console.log(tableName);
            // console.log(renameTables(tableName));
            let renameTo = renameTables(tableName);
            // await pool.query(`RENAME TABLE '${tableName}' TO '${renameTo}'`);
            await pool.query(
              "RENAME TABLE `" + tableName + "` TO `" + renameTo + "`"
            );
            // } else {
            //   await pool.query(`DROP TABLE ${tableName};`);
            // }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  });
  app.get("/api/fix_tt/", async (req, res) => {
    let select = `SELECT _treatmentTables_copy.* FROM _treatmentTables_copy WHERE _treatmentTables_copy.treatment_table NOT LIKE 'FT740_9074%' and _treatmentTables_copy.treatment_table NOT LIKE 'FT740_9004%'`,
      update_qry = "UPDATE _treatmentTables_copy SET ?  WHERE treatment_id =?";
    try {
      let rslt = await pool_a.query(select);
      if (!isEmpty(rslt)) {
        for (var i = 0; i < rslt.length; i++) {
          let updateId = rslt[i].treatment_id,
            tbl_name = rslt[i].treatment_table,
            currentUpdate = {
              treatment_table: reName_Tables(tbl_name)
            };

          try {
            await pool_a.query(update_qry, [currentUpdate, updateId]);
          } catch (e) {
            console.log(e);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  app.get("/api/colunms", async (req, res) => {
    /*

    ALTER TABLE vendors
    ADD COLUMN phone VARCHAR(15) AFTER name;
    */
    let getTablesQry = `SELECT table_name FROM information_schema.tables where table_schema='2018Tmdatab'`,
      add_cols = [
        {
          col: "canary_temp",
          type: "decimal(5,2) DEFAULT NULL",
          after: "node_id"
        },
        { col: "CH4", type: "decimal(7,4) DEFAULT NULL", after: "NH3" },
        { col: "dB", type: "decimal(5,2) DEFAULT NULL", after: "SR3" },
        { col: "motion", type: "tinyint(1) DEFAULT NULL", after: "SRalarm" },
        { col: "xs_heat", type: "tinyint(1) DEFAULT NULL", after: "motion" }
      ];

    try {
      let listRslt = await pool.query(getTablesQry);
      if (!isEmpty(listRslt)) {
        // console.log(listRslt);
        for (let i = 0; i < listRslt.length; i++) {
          let current_tbl = listRslt[i].table_name;
          if (
            current_tbl.includes("FT740_9004_88888888") ||
            current_tbl.includes("FT740_9074_999999854")
          ) {
          } else {
            // console.log(current_tbl);
            let alterQry = `ALTER TABLE ${current_tbl}`;
            for (var c = 0; c < add_cols.length; c++) {
              // console.log(add_cols[c]);
              alterQry += ` ADD COLUMN ${add_cols[c].col} ${
                add_cols[c].type
              } AFTER ${add_cols[c].after},`;
            }
            let trimmedQry = alterQry.substring(0, alterQry.length - 1);
            try {
              await pool.query(trimmedQry);
            } catch (e) {
              console.log(e);
            }
            console.log(trimmedQry, "\n");
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  app.get("/api/fix_attempt2", async (req, res) => {
    const currentTable = 'GD188_0001_1068055575_Main_G1_58', queryOffset = 2001;
    try {
      let selectQuery = await pool.query(`select id, CONCAT(date,' ',time) AS insert_time FROM ${currentTable} LIMIT 1000 OFFSET ${queryOffset}`), updateSuccess = true;
       console.log(selectQuery, '<<<<<<');
       for (var i = 0; i < selectQuery.length; i++) {
         console.log(selectQuery[i]);
         // try {
         //   let updateQuery = `UPDATE ${currentTable} SET ? where id=?;`,
         //     updateObj = [{ insert_time: selectQuery[i].insert_time },selectQuery[i].id]
         //     updateSuccess = await pool.query(updateQuery,updateObj);
         //     if (updateSuccess.affectedRows <1) updateSuccess = false;
         //
         // } catch (e) {
         //   console.log("Error:", e.stack);
         // }
         // }
         // console.log(updateSuccess ?  'UPDATE FAILURE': 'UPDATE SUCCESS');
      }
    } catch (e) {
      console.log("Error:", e.stack);
    }
});

app.get("/api/locationFix", async (req, res) => {
  try {
    let selectQuery = await pool_a.query(`SELECT _customerLocations.id , _customerLocations.location_id FROM _customerLocations`);
     console.log(selectQuery, '<<<<<<');
     for (var i = 0; i < selectQuery.length; i++) {
       let id = selectQuery[i].id,
        locationId = selectQuery[i].location_id.toUpperCase();
        console.log(id, ' >> ', locationId);
       try {
         let updateQuery = `UPDATE _customerLocations SET ? where id=?;`,
           updateObj = [{ location_id: locationId },id]
           updateSuccess = await pool_a.query(updateQuery,updateObj);
           if (updateSuccess.affectedRows <1) updateSuccess = false;

       } catch (e) {
         console.log("Error:", e.stack);
       }
       // }
       // console.log(updateSuccess ?  'UPDATE FAILURE': 'UPDATE SUCCESS');
    }
  } catch (e) {
    console.log("Error:", e.stack);
  }
});

  app.get("/api/fix_attempt", async (req, res) => {
    let getTablesQry = `SELECT table_name FROM information_schema.tables where table_schema='2018Tmdatab'`,
      keepTables = [
        "GD188_0001_1068055575_Main_G1_55_copy",
        "GD188_0001_1068055575_Main_G1_55",
        "GD188_0001_1068055575_Main_G1_58",
        "GD188_0001_1068055575_Main_G1_60",
        "GD188_0001_1068055575_Main_G1_61",
        "PD11RD3_0001_1068055573_Main_G1_55",
        "PD11RD3_0001_1068055573_Main_G1_58",
        "PD11RD3_0001_1068055573_Main_G1_60",
        "PD11RD3_0001_1068055573_Main_G1_61"
      ];
    try {
      let result = await pool.query(getTablesQry);
      if (!isEmpty(result)) {
        for (var i = 0; i < result.length; i++) {
          let currentTable = result[i].table_name;
          // console.log(result[i].table_name);
          if (currentTable == keepTables[5]) {
            let countQuery = `SELECT COUNT(*) as rowCount FROM ${currentTable}`,
              selectQuery = `SELECT id , CONCAT(date , ' ' , time) AS insert_time FROM ${currentTable}`,
              updateQuery = ``;
            // console.log(currentTable);
            // ROW COUNT
            try {
              let rowCountResult = await pool.query(countQuery);
              if (!isEmpty(rowCountResult)) {
                // console.log(rowCountResult[0].rowCount);

                let rowCount = rowCountResult[0].rowCount,
                  recorSetCount = rowCount / 500,
                  updateArray = [],
                  updateHolders = [],
                  queryHolderArray = [];
                // calculate offsetArray
                for (var i = 0; i < recorSetCount; i++) {
                  let selectMultiple = 500,
                    selectOffset = [i] * selectMultiple,
                    selectFilter = `${selectQuery} LIMIT 500 OFFSET ${selectOffset}`;
                  // console.log(selectFilter);
                  try {
                    let dataSelect = await pool.query(selectFilter);
                    if (!isEmpty(dataSelect)) {
                      // console.log(
                      //   dataSelect,
                      //   "{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}"
                      // );
                      for (var d = 0; d < dataSelect.length; d++) {
                        // for (var j = 0; j < array.length; j++) {
                        //   array[j]
                        // }
                        console.log(dataSelect[d].id);
                        updateQuery += `UPDATE ${currentTable} SET ? where id=?;`;
                        updateArray.push(
                          { insert_time: dataSelect[d].insert_time },
                          dataSelect[d].id
                        );
                        if ([d] % selectMultiple === 0) {
                          updateHolders.push(updateArray);
                          queryHolderArray.push(updateQuery);
                          // RESET UPDATEHOLDERS
                          updateArray = [];
                          updateQuery = "";
                        }
                      }
                      // console.log(queryHolderArray, "\n", updateHolders);
                      for (var x = 0; x < queryHolderArray.length; x++) {
                        try {
                          let inserted = await pool.query(
                            queryHolderArray[x],
                            updateHolders[x]
                          );
                          if (!isEmpty(inserted)) {
                            // console.log(inserted);
                          }
                        } catch (e) {
                          console.log("Error:", e.stack);
                        }
                      }
                    }
                  } catch (e) {
                    console.log("Error:", e.stack);
                  }
                }
                console.log(rowCount, " = > ", recorSetCount);
              }
            } catch (e) {
              console.log("Error:", e.stack);
            }
          }
        }
      }
    } catch (e) {
      console.log("Error:", e.stack);
    }
  });
};
