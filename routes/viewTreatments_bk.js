const moment = require("moment"),
  showUsers = require("../middleware/showUsers"),
  showUsersSub = require("../middleware/showUsersSub"),
  getDuration = require("../middleware/getDuration"),
  ExpressData = require("../middleware/ExpressData"),
  isAuthorized = require("../middleware/isAuthorized"),
  utilities = require("../utils/utils"),
  CONFIG = require("../config/config"),
  isEmpty = require("../utils/isItEmpty"),
  gTs = require("../utils/getTimestamp"),
  { createWriteStream, writeFileSync, writeFile } = require("fs");

module.exports = function(app, passport) {
  // @route   POST /api/display_treatments/:state -
  // @desc    Start recording canary treatments after preparing dbs
  // @access  Public
  app.get("/api/display_treatments/:state", isAuthorized, async (req, res) => {
    var props = new ExpressData(req).props,
      breadcrumbs = [
        { link: "/api", label: "Dashboard", isActive: true },
        { link: "#", label: "Treatments", isActive: true }
      ],
      func_s = { getDuration, moment },
      retun_to_url = `?state=${props.state}`,
      results,
      searchObjs = "Treatrments ",
      activeState = props.state,
      letRefSql,
      andWhere =
        props.state === "active" ||
        props.state === "pending" ||
        props.state === "dropped" ||
        props.state === "complete"
          ? " WHERE _treatment_statuses.`status`= ?  and _treatments.status_id <>5  ORDER BY _treatments.id DESC"
          : ` WHERE _treatments.status_id <> 5 ORDER BY _treatments.id DESC`,
      base_qry =
        'SELECT _treatments.id , _treatment_statuses.`status` , CONCAT( _users.first_name , " " , _users.last_name) AS tech , _customers.customer_id , _customers.customer_name , _treatments.latitude , _treatments.longitude , _treatments.treatment_id , _treatments.start_time , _treatments.end_time , _treatments.duration , gateways.gateway_id FROM _technicians JOIN _treatments ON _technicians.id = _treatments.tech_id JOIN _users ON _technicians.user_id = _users.id JOIN _treatment_statuses ON _treatment_statuses.id = _treatments.status_id JOIN _customers ON _customers.id = _treatments.cust_id JOIN gateways ON gateways.id = _treatments.gateway_id ' +
        andWhere,
      qry_rslts;

    breadcrumbs.push({
      link: "#",
      label: utilities.generalFuncs.jsUcfirst(props.state),
      isActive: true
    });

    // create baseurl var
    props.base_url = "/api/display_treatments/";
    try {
      if (
        props.state === "active" ||
        props.state === "pending" ||
        props.state === "dropped" ||
        props.state === "complete"
      ) {
        qry_rslts = await pool_a.query(base_qry, props.state);
      } else {
        qry_rslts = await pool_a.query(base_qry);
      }

      if (qry_rslts) {
        // console.log(qry_rslts);
        res.render("./treatments/index_treatments", {
          title: "TechNet | Treatments",
          breadcrumbs: breadcrumbs,
          searchObjs,
          showUsers: showUsers(req.user.account_type),
          showUsersSub: showUsersSub(req.user.account_type),
          treatments: qry_rslts,
          func_s: func_s,
          retun_to_url: retun_to_url,
          props,
          message_type: "light",
          message: ""
        });
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  // @route   GET /api/treatment/view_data/:id
  // @desc    View generat treatment data
  // @access  Public
  app.get("/api/treatment/view/:id", isAuthorized, async (req, res) => {
    let props = new ExpressData(req).props,
      state = props.state,
      cust = props.cust !== undefined ? `?cust=${props.cust}` : "",
      breadcrumbs = [
        { link: "/api", label: "Dashboard", isActive: true },
        { link: "#", label: "Treatments", isActive: true }
      ],
      _id = props.id,
      base_url = "/api/display_treatments/",
      reset_params = `${state}${cust}`,
      canaryCount = utilities.generalFuncs.canaryCount,
      func_s = { getDuration, moment, canaryCount },
      result,
      rsltObj = [],
      the_treatment,
      the_cuts_id,
      the_cuts_name,
      theTreatment,
      retun_to_url =
        props.cust != undefined
          ? `?state=${props.state}&cust=${props.cust}`
          : `?state=${props.state}`,
      query =
        "SELECT _treatments.id , _treatment_statuses.`status` , Canaries.unit_number , _treatments.treatment_id , _customerLocations.location_id , gateways.gateway_id , _customers.customer_id , _customers.customer_name , CONCAT( _treatments.treatment_id , '_' , _customerLocations.location_id , '_' , gateways.gateway_id , '_' , Canaries.unit_number) AS db_table FROM gateways JOIN _treatments ON gateways.id = _treatments.gateway_id JOIN _treatmentCanaries ON _treatmentCanaries.treatment_id = _treatments.id JOIN Canaries ON Canaries.id = _treatmentCanaries.canary_id JOIN _treatmentLocations ON _treatmentLocations.treatment_id = _treatments.id JOIN _customers ON _customers.id = _treatments.cust_id JOIN _customerLocations ON _customerLocations.id = _treatmentLocations.location_id JOIN _treatment_statuses ON _treatment_statuses.id = _treatments.status_id WHERE _treatments.id = ?";


    if (cust !== "") {
      breadcrumbs.push({
        link: `${base_url}${state}`,
        label: utilities.generalFuncs.jsUcfirst(state),
        isActive: false
      });
      breadcrumbs.push({
        link: `${base_url}${reset_params}`,
        label: custRefine,
        isActive: false
      });
    } else {
      breadcrumbs.push({
        link: `${base_url}${state}`,
        label: utilities.generalFuncs.jsUcfirst(state),
        isActive: false
      });
    }
    try {
      result = await pool_a.query(query, _id);
      // console.log(!isEmpty(result));
      if (result) {
        let the_cust_id = result[0].customer_id,
          customer_name = result[0].customer_name,
          treatment_id = result[0].treatment_id;

        /*
        the_treatment = result[0].treatment_id;
        the_cuts_id = result[0].customer_id;
        customer_name = result[0].customer_name;
        theTreatment = result[0].treatment_id;
        // console.log(result);
        */
        for (var i = 0; i < result.length; i++) {
          // console.log(result[i]);
          let db_table = result[i].db_table,
            current_id = result[i].id,
            current_status = result[i].status,
            current_unit = result[i].unit_number,
            treatment_id = result[i].treatment_id,
            details_sql = `SELECT insert_time FROM ${db_table} ORDER BY insert_time DESC limit 1;SELECT COUNT(*)as chirps FROM ${db_table}`;
          // console.log(db_table);

          try {
            let d_rslt = await pool.query(details_sql, [db_table, db_table]);

            if (!isEmpty(d_rslt)) {
              // console.log(d_rslt[1][0].chirps);
              // console.log(d_rslt[0][0].insert_time);
              let t_rslt = {
                id: current_id,
                treatment_id: treatment_id,
                status: current_status,
                node_id: current_unit,
                chirps: d_rslt[1][0].chirps,
                last_chirp: d_rslt[0][0].insert_time,
                db_table: db_table
              };
              // console.log(t_rslt);
              rsltObj.push(t_rslt);
            }
          } catch (e) {
            console.log(e);
          }
        }
        console.log(rsltObj);
        console.log(customer_name, " >>> ", the_cust_id);

        // let chirp_query = `SELECT id, insert_time FROM ${last_calibrated} ORDER BY id DESC LIMIT 1`;
        // console.log('chirp_query: '+ chirp_query);
        breadcrumbs.push({
          link: "#",
          label: treatment_id,
          isActive: true
        });

        res.render("./treatments/index_treatment_details", {
          title: "TechNet | Treatments",
          breadcrumbs,
          customer: {
            name: customer_name,
            id: the_cust_id
          },
          func_s,
          showUsers: showUsers(req.user.account_type),
          treatments: rsltObj,
          retun_to_url: retun_to_url,
          props,
          message_type: "light",
          message: ""
        });
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  // @route   GET /api/display_treatments/:id -
  // @desc    view individual tretment node data
  // @access  Public
  app.get("/api/treatment/view_data/:id", isAuthorized, async (req, res) => {
    var props = new ExpressData(req).props,
      breadcrumbs = [
        { link: "/api", label: "Dashboard", isActive: true },
        { link: "#", label: "Treatments", isActive: true }
      ],
      base_url = "/api/display_treatments/",
      view_url = "/api/treatment/view/",
      cust_id = props.id,
      treatment_id = props.id,
      table = props.d,
      canary = props.c,
      rtrnVar = props.r,
      rtrnFilter = props.td,
      // allow_calibration = !table.includes("_cal") ? true : false,
      func_s = { getDuration, moment },
      query = `SELECT * FROM ${table} ; `,
      // select_qry =
      //   "SELECT gateways.gateway AS gateway_id , _treatments.treatment_id , _customers.customer_name , _customers.customer_id , Canaries.node_id , Canaries.unit_number , _customerLocations.location_id FROM _treatments JOIN gateways ON _treatments.gateway_id = gateways.id JOIN _customers ON _customers.id = _treatments.cust_id JOIN _treatmentLocations ON _treatmentLocations.treatment_id = _treatments.id JOIN _treatmentCanaries ON _treatmentCanaries.treatment_id = _treatments.id JOIN Canaries ON Canaries.id = _treatmentCanaries.canary_id JOIN _customerLocations ON _customerLocations.id = _treatmentLocations.location_id WHERE _treatments.id = ?",
      // calQuery =
      //   'SELECT calibration_id FROM _calibrations WHERE node_id=? ORDER BY calibrated_on DESC limit 1',
      calQuery =
        "SELECT calibrations.calibration_id FROM calibrations JOIN Canaries ON calibrations.canary_id = Canaries.id WHERE Canaries.unit_number =?",
      // "SELECT calibration_id FROM calibrations WHERE node_id=? ORDER BY calibrated_on DESC limit 1",
      results,
      isCalibrated = false,
      calResult,
      refine_req = rtrnFilter.split("?") ? true : false,
      refine_td = rtrnFilter.split("?"),
      state = refine_td[0],
      cust_filter = refine_req ? refine_td[1] : "",
      bc_label = "",
      _view;

    _view = `/api/treatment/view_data/${treatment_id}?c=${canary}&d=${table}&r=${rtrnVar}&td=${state}`;
    /*  }*/
    var data_view = /*crypt_o.encryptIv(*/ _view /*)*/,
      cal_view = `/api/calibrate/${canary}?type=cnry&bk=${data_view}`;

    if (cust_id !== "") {
      breadcrumbs.push({
        link: `${base_url}${state}`,
        label: utilities.generalFuncs.jsUcfirst(state),
        isActive: false
      });
      if (refine_req && cust_filter !== undefined) {
        breadcrumbs.push({
          link: `${base_url}${rtrnFilter}`,
          label: bc_label,
          isActive: false
        });
      }
      breadcrumbs.push({
        link: `${view_url}${rtrnVar}?state=${rtrnFilter}`,
        label: treatment_id,
        isActive: false
      });
      breadcrumbs.push({ link: "#", label: canary, isActive: true });
    } else {
      breadcrumbs.push({
        link: "#",
        label: utilities.generalFuncs.jsUcfirst(state),
        isActive: true
      });
    }

    try {
      results = await pool.query(query);
      if (results) {
        try {
          calResult = await pool_a.query(calQuery, canary);
          isCalibrated = calResult.length >= 1;
        } catch (e) {
          return res.status(500).send(e);
        } finally {
          res.render("./treatments/index_treatment_data", {
            title: "TechNet | Treatments Canary Data",
            breadcrumbs: breadcrumbs,
            showUsers: showUsers(req.user.account_type),
            treatment_id,
            canary,
            isCalibrated,
            table: table,
            returnVar: rtrnVar,
            cal_view,
            data_view,
            rtrnFilter,
            results,
            func_s,
            message_type: "light",
            message: ""
          });
        }
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  // @route   GET /api/treatment/archive/:id
  // @desc    View generat treatment data
  // @access  Public
  app.get("/api/treatment/archive/:id", isAuthorized, async (req, res) => {
    var props = new ExpressData(req).props,
      id = props.id,
      state = props.state,
      cust = props.cust !== undefined ? `?cust=${props.cust}` : "",
      breadcrumbs = [
        { link: "/api", label: "Dashboard", isActive: true },
        { link: "#", label: "Treatments", isActive: true }
      ],
      _id = props.id,
      base_url = "/api/display_treatments/",
      reset_params = `${state}${cust}`,
      canaryCount = utilities.generalFuncs.canaryCount,
      func_s = { getDuration, moment, canaryCount },
      searchObjs = "Treatrments ",
      result,
      rslt_tbls = [],
      the_treatment,
      the_cuts_id,
      the_cuts_name,
      theTreatment,
      retun_to_url =
        props.cust != undefined
          ? `?state=${props.state}&cust=${props.cust}`
          : `?state=${props.state}`,
      query = `SELECT _customerLocations.location_id AS location_id , Canaries.node_id AS node_id , _treatments.isActive AS is_active , _treatments.treatment_id AS treatment_id , gateways.gateway AS gateway , _customers.customer_name , _customers.customer_id , _treatments.id FROM _treatmentCanaries JOIN _treatments ON _treatmentCanaries.treatment_id = _treatments.id JOIN _treatmentLocations ON _treatmentLocations.treatment_id = _treatments.id JOIN _customerLocations ON _customerLocations.id = _treatmentLocations.location_id JOIN Canaries ON _treatmentCanaries.canary_id = Canaries.id JOIN gateways ON _treatments.gateway_id = gateways.id JOIN _customers ON _customers.id = _treatments.cust_id WHERE _treatments.id = ?`;
    // elogFileName = `${gateway_id}_${job_id}_${country_id}_${customer_id}-{${tech_id}}_captureErrs.log`,
    // captureErrWrite = createWriteStream(`./Errs/${elogFileName}`, {
    //   flags: "a"
    // });

    try {
      result = await pool_a.query(query, _id);
      if (result) {
        let treatment = result[0].treatment_id;
        for (var i = 0; i < result.length; i++) {
          let qry_tbl = `${result[i].gateway}_${result[i].node_id}_${
              result[i].treatment_id
            }_${result[i].location_id}_cal`,
            trans_sql_1 = `CREATE TABLE archivedData.${qry_tbl} LIKE 2018Tmdatab.${qry_tbl}`,
            trans_sql_2 = `ALTER TABLE archivedData.${qry_tbl} DISABLE KEYS; `;
          trans_sql_3 = ` INSERT INTO archivedData.${qry_tbl} SELECT * FROM 2018Tmdatab.${qry_tbl}`;
          (trans_sql_4 = `ALTER TABLE archivedData.${qry_tbl} ENABLE KEYS; DROP TABLE IF EXISTS ${qry_tbl}, nonexistent_table;`),
            (update_tbl = `update _treatments set  _treatments.isActive='archived' where id =?;`),
            (andWhere =
              props.state === "active" ||
              props.state === "pending" ||
              props.state === "dropped" ||
              props.state === "complete"
                ? `  WHERE _treatments.isActive=?  and _treatments.isActive!='archived'`
                : " WHERE _treatments.isActive!='archived'"),
            (baseSelect = `SELECT gateways.gateway , _treatments.treatment_id , _treatments.id , _customers.customer_id , _customers.customer_name , _treatments.cust_id , _treatments.start_time , _treatments.end_time , _treatments.duration , _treatments.isActive FROM gateways JOIN _treatments ON gateways.id = _treatments.gateway_id JOIN _customers ON _customers.id = _treatments.cust_id${andWhere}`);
          try {
            let s_one = await pool.query(trans_sql_1);
            console.log(s_one, " <<-");
            try {
              let s_two = await pool.query(trans_sql_2);
              console.log(s_two, " <<<<-");

              try {
                let s_three = await pool.query(trans_sql_3);
                console.log(s_three, " <<<<<<-");

                try {
                  let s_four = await pool.query(trans_sql_4);
                  console.log(s_four, " <<<<<<<<-");

                  try {
                    let is_archived = await pool_a.query(update_tbl, _id);
                    if (is_archived.affectedRows >= 1) {
                      breadcrumbs.push({
                        link: "#",
                        label: utilities.generalFuncs.jsUcfirst(props.state),
                        isActive: true
                      });

                      // create baseurl var
                      props.base_url = "/api/display_treatments/";

                      try {
                        if (
                          props.state === "active" ||
                          props.state === "pending" ||
                          props.state === "dropped" ||
                          props.state === "complete"
                        ) {
                          qry_rslts = await pool_a.query(
                            baseSelect,
                            props.state
                          );
                        } else {
                          qry_rslts = await pool_a.query(baseSelect);
                        }

                        if (qry_rslts) {
                          res.render("./treatments/index_treatments", {
                            title: "TechNet | Treatments",
                            breadcrumbs: breadcrumbs,
                            searchObjs,
                            showUsers: showUsers(req.user.account_type),
                            showUsersSub: showUsersSub(req.user.account_type),
                            treatments: qry_rslts,
                            func_s: func_s,
                            retun_to_url: retun_to_url,
                            props,
                            message_type: "light",
                            message: ""
                          });
                        }
                      } catch (e) {
                        return res.status(500).send(e);
                      }
                    }
                    console.log(is_archived);
                  } catch (e) {
                    console.log(e);
                  }
                } catch (e) {
                  console.log(e);
                }
              } catch (e) {
                console.log(e);
              }
            } catch (e) {
              console.log(e);
            }
          } catch (e) {
            console.log(e);
          }
        } ////
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  // @route   GET /api/treatment/delete/:id
  // @desc    View generat treatment data
  // @access  Public
  app.get("/api/treatment/delete/:id", isAuthorized, async (req, res) => {
    var props = new ExpressData(req).props,
      id = props.id,
      state = props.state,
      cust = props.cust !== undefined ? `?cust=${props.cust}` : "",
      breadcrumbs = [
        { link: "/api", label: "Dashboard", isActive: true },
        { link: "#", label: "Treatments", isActive: true }
      ],
      _id = props.id,
      base_url = "/api/display_treatments/",
      reset_params = `${state}${cust}`,
      canaryCount = utilities.generalFuncs.canaryCount,
      func_s = { getDuration, moment, canaryCount },
      searchObjs = "Treatrments ",
      result,
      rslt_tbls = [],
      the_treatment,
      the_cuts_id,
      the_cuts_name,
      theTreatment,
      retun_to_url =
        props.cust != undefined
          ? `?state=${props.state}&cust=${props.cust}`
          : `?state=${props.state}`,
      sel_qry = `SELECT _customerLocations.location_id AS location_id , Canaries.node_id AS node_id , _treatments.treatment_id AS treatment_id , gateways.gateway AS gateway , _customers.customer_id , _treatments.id FROM _treatmentCanaries JOIN _treatments ON _treatmentCanaries.treatment_id = _treatments.id JOIN _treatmentLocations ON _treatmentLocations.treatment_id = _treatments.id JOIN _customerLocations ON _customerLocations.id = _treatmentLocations.location_id JOIN Canaries ON _treatmentCanaries.canary_id = Canaries.id JOIN gateways ON _treatments.gateway_id = gateways.id JOIN _customers ON _customers.id = _treatments.cust_id WHERE _treatments.id =?`,
      del_qry = "delete from _treatments";
    query = `SELECT _customerLocations.location_id AS location_id , Canaries.node_id AS node_id , _treatments.isActive AS is_active , _treatments.treatment_id AS treatment_id , gateways.gateway AS gateway , _customers.customer_name , _customers.customer_id , _treatments.id FROM _treatmentCanaries JOIN _treatments ON _treatmentCanaries.treatment_id = _treatments.id JOIN _treatmentLocations ON _treatmentLocations.treatment_id = _treatments.id JOIN _customerLocations ON _customerLocations.id = _treatmentLocations.location_id JOIN Canaries ON _treatmentCanaries.canary_id = Canaries.id JOIN gateways ON _treatments.gateway_id = gateways.id JOIN _customers ON _customers.id = _treatments.cust_id WHERE _treatments.id = ?`;
    console.log(sel_qry);
    try {
      let srch_trtmnts = await pool_a.query(sel_qry, id);
      if (!isEmpty(srch_trtmnts)) {
        console.log(srch_trtmnts);
      }
    } catch (e) {
      res.status(500).send({ status: error, message: e });
    }

    // try {
    //   result = await pool_a.query(query, _id);
    //   if (result) {
    //     let treatment = result[0].treatment_id;
    //     for (var i = 0; i < result.length; i++) {
    //       let qry_tbl = `${result[i].gateway}_${result[i].node_id}_${result[i].treatment_id}_${result[i].location_id}_cal`,
    //         trans_sql_1 = `CREATE TABLE archivedData.${qry_tbl} LIKE 2018Tmdatab.${qry_tbl}`,
    //         trans_sql_2 = `ALTER TABLE archivedData.${qry_tbl} DISABLE KEYS; `
    //         trans_sql_3 = ` INSERT INTO archivedData.${qry_tbl} SELECT * FROM 2018Tmdatab.${qry_tbl}`
    //         trans_sql_4 = `ALTER TABLE archivedData.${qry_tbl} ENABLE KEYS; DROP TABLE IF EXISTS ${qry_tbl}, nonexistent_table;`,
    //         update_tbl = `update _treatments set  _treatments.isActive='archived' where id =?;`,
    //         andWhere =
    //           props.state === "active" ||
    //           props.state === "pending" ||
    //           props.state === "dropped" ||
    //           props.state === "complete"
    //             ? `  WHERE _treatments.isActive=?  and _treatments.isActive!='archived'`
    //             : " WHERE _treatments.isActive!='archived'",
    //         baseSelect = `SELECT gateways.gateway , _treatments.treatment_id , _treatments.id , _customers.customer_id , _customers.customer_name , _treatments.cust_id , _treatments.start_time , _treatments.end_time , _treatments.duration , _treatments.isActive FROM gateways JOIN _treatments ON gateways.id = _treatments.gateway_id JOIN _customers ON _customers.id = _treatments.cust_id${andWhere}`;
    //         try {
    //           let s_one = await pool.query(trans_sql_1);
    //           console.log(s_one, ' <<-');
    //           try {
    //             let s_two = await pool.query(trans_sql_2);
    //             console.log(s_two, ' <<<<-');
    //
    //             try {
    //               let s_three = await pool.query(trans_sql_3);
    //               console.log(s_three, ' <<<<<<-');
    //
    //               try {
    //                 let s_four = await pool.query(trans_sql_4);
    //                 console.log(s_four, ' <<<<<<<<-');
    //
    //                 try {
    //                   let is_archived = await pool_a.query(update_tbl, _id);
    //                   if (is_archived.affectedRows >=1) {
    //                     breadcrumbs.push({
    //                       link: "#",
    //                       label: utilities.generalFuncs.jsUcfirst(props.state),
    //                       isActive: true
    //                     });
    //
    //                     // create baseurl var
    //                     props.base_url = "/api/display_treatments/";
    //
    //                     try {
    //                       if (
    //                         props.state === "active" ||
    //                         props.state === "pending" ||
    //                         props.state === "dropped" ||
    //                         props.state === "complete"
    //                       ) {
    //                         qry_rslts = await pool_a.query(baseSelect, props.state);
    //                       } else {
    //                         qry_rslts = await pool_a.query(baseSelect);
    //                       }
    //
    //                       if (qry_rslts) {
    //                         res.render("./treatments/index_treatments", {
    //                           title: "TechNet | Treatments",
    //                           breadcrumbs: breadcrumbs,
    //                           searchObjs,
    //                           showUsers: showUsers(req.user.account_type),
    //                           showUsersSub: showUsersSub(req.user.account_type),
    //                           treatments: qry_rslts,
    //                           func_s: func_s,
    //                           retun_to_url: retun_to_url,
    //                           props,
    //                           message_type: "light",
    //                           message: ""
    //                         });
    //                       }
    //                     } catch (e) {
    //                       return res.status(500).send(e);
    //                     }
    //                   }
    //                   console.log(is_archived);
    //                 } catch (e) {
    //                   console.log(e);
    //                 }
    //               } catch (e) {
    //                 console.log(e);
    //               }
    //             } catch (e) {
    //               console.log(e);
    //             }
    //           } catch (e) {
    //             console.log(e);
    //           }
    //         } catch (e) {
    //           console.log(e);
    //         }
    //   } ////
    // }
    // } catch (e) {
    //   return res.status(500).send(e);
    // }
  });
  // app.get("/api/treatment/archive/:id", isAuthorized, async (req, res) => {
  //   let props = new ExpressData(req).props,
  //     state = props.state,
  //     cust = props.cust !== undefined ? `?cust=${props.cust}` : "",
  //     breadcrumbs = [
  //       { link: "/api", label: "Dashboard", isActive: false },
  //       { link: "#", label: "Treatments", isActive: true }
  //     ],
  //     _id = props.id,
  //     arc_query_one =
  //       "SELECT gateways.gateway , _treatments.treatment_id , Canaries.node_id , _customerLocations.location_id FROM _treatments JOIN gateways ON _treatments.gateway_id = gateways.id JOIN _treatmentCanaries ON _treatmentCanaries.treatment_id = _treatments.id JOIN Canaries ON Canaries.id = _treatmentCanaries.canary_id JOIN _treatmentLocations ON _treatmentLocations.treatment_id = _treatments.id JOIN _customerLocations ON _customerLocations.id = _treatmentLocations.location_id WHERE _treatments.id =?",
  //     arc_query_two = "",
  //     elogFileName = ` treaatment_${_id}_archiveErrs.log`,
  //     captureErrWrite = createWriteStream(`./archive/logs/${elogFileName}`, {
  //       flags: "a"
  //     }),
  //     garbageCollection = true,
  //     treatment_id,
  //     tbls = [];
  //
  //   try {
  //     let tbl_cap_rslt = await pool_a.query(arc_query_one, _id);
  //     if (!isEmpty(tbl_cap_rslt)) {
  //       treatment_id = tbl_cap_rslt[0].treatment_id;
  //       for (var i = 0; i < tbl_cap_rslt.length; i++) {
  //         let table_name = `${tbl_cap_rslt[i].gateway}_${
  //           tbl_cap_rslt[i].node_id
  //         }_${tbl_cap_rslt[i].treatment_id}_${tbl_cap_rslt[i].location_id}`;
  //         tbls.push(table_name);
  //       }
  //
  //       //         mysqlBackup({
  //       //     host: 'localhost',
  //       //     user: 'root',
  //       //     password: '',
  //       //     database: 'test',
  //       // }).then(dump => {
  //       //     console.log(dump);
  //       // })
  //
  //       // mysqlDump(
  //       //   {
  //       //     host: CONFIG.main_ip_address,
  //       //     user: CONFIG.db_arch_user,
  //       //     password: CONFIG.db_arch_pass,
  //       //     database: CONFIG.db_name_main,
  //       //     tables: tbls, // only these tables
  //       //     where: {}, // Only test players with id < 1000
  //       //     ifNotExist: false // Create table if not exist
  //       //   }.then(dump => {
  //       //     fs.writeFileSync(`${treatment_id}.sql`, dump); // Create data.sql file with dump result
  //       //   })
  //       // );
  //     }
  //   } catch (e) {
  //     captureErrWrite.write(`db  error ${gTs()}\n   =>    Err: ${e}\n`); // return res.status(500).send(e);
  //     console.log(e);
  //   }
  // });
};
