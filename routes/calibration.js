const moment = require("moment"),
  crypt_o = require("../middleware/crypt.o"),
  ExpressData = require("../middleware/ExpressData"),
  isEmpty = require("../utils/isItEmpty"),
  showUsers = require("../middleware/showUsers"),
  multer = require("multer"),
  fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true); // save file
    } else {
      cb(null, false); // reject file  /* // throw err==> cb(, true); */
    }
  },
  storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, "./uploads/");
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + processFileName(file.originalname));
    }
  }),
  upload = multer({
    storage: storage,
    limit: {
      filesize: 1024 * 1024 * 5 // 5mb max
    },
    fileFilter: fileFilter
  });

module.exports = function(app, passport) {
  // @route   GET /api/calibrate/:node_id - [ getCalibrations ]
  // @desc    Load add canary clibrations forcalibration
  // @access  Public
  app.get("/api/calibrate/:unit_number", async (req, res) => {
    const props = new ExpressData(req).props,
      unit_number = props.unit_number,
      node_type = props.type,
      destination = props.d,
      returnId = props.r,
      filterIndex = props.td,
      calibrationQuery =
        "SELECT Canaries.id , Canaries.node_id , Canaries.unit_name , Canaries.unit_number , calibrations.* FROM calibrations JOIN Canaries ON calibrations.canary_id = Canaries.id WHERE Canaries.unit_number = ?",
      fallBackQuery =
        node_type == "cnry"
          ? "SELECT * FROM Canaries WHERE unit_number=?"
          : "SELECT * FROM CUBs WHERE unit_number=?",
      ref_link = node_type == "cnry" ? "/api/canarys" : "/api/cubs",
      ref_label = node_type == "cnry" ? "Canaries" : "CÜBs",
      cal_label = node_type == "cnry" ? "Canary" : "CÜB",
      return_link =
        props.bk != null || props.bk != undefined
          ? /*crypt_o.decryptIv*/ `${props.bk}&d=${
              props.d
            }&r=${returnId}&td=${filterIndex}` /*)*/
          : null,
      alt_link = ref_link,
      calCrumbs = [
        { link: "/api", label: "Dashboard", isActive: true },
        { link: ref_link, label: ref_label, isActive: false },
        { link: "#", label: "Calibration", isActive: true }
      ],
      message_type = "light",
      message = "";
    var cal_result,
      calDate = "";
    console.log(" >>>>>>>>>>>>>>>>>>", return_link);
    console.log(calibrationQuery);
    // console.log(props.type);

    try {
      cal_result = await pool_a.query(calibrationQuery, unit_number);
      if (cal_result.length <= 0) {
        try {
          cal_result = await pool_a.query(fallBackQuery, unit_number);
        } catch (e) {
          return res.status(500).send(e);
        }
      } else {
        // calDate = moment(cal_result[0].calibrated_on).format('lll');
        calDate = moment(cal_result[0].calibrated_on).format(
          "LTS / MMM Do YY",
          "Canada/Pacific"
        );
      }
    } catch (e) {
      return res.status(500).send(e);
    } finally {
      console.log(cal_result[0]);
      res.render("./calibrations/calibrate", {
        title: `TechNet | ${cal_label} Calibartion`,
        breadcrumbs: calCrumbs,
        showUsers: showUsers(req.user.account_type),
        alt_link,
        cal_label,
        calibration: cal_result[0],
        calDate,
        return_link,
        message_type,
        message
      });
    }
  });

  // @route   POST /api/calibrate/:node_id [ calibrateCanary ]
  // @desc    Process  edit canary calibration form
  // @access  Public
  app.post("/api/calibrate/:unit_number", upload.none(), async (req, res) => {
    let props = new ExpressData(req).props,
      { processCal } = req.body,
      node_type = props.type,
      unit_number = req.body.unit_number,
      message = "",
      calibrationInserts = {},
      query =
        processCal == "return_dash_insert"
          ? "INSERT INTO `calibrations` SET ?"
          : "UPDATE `calibrations` SET ? WHERE calibrations.calibration_id=?",
      calibration_id = req.body.calibration_id,
      insert_updata_data =
        calibration_id !== ""
          ? [calibrationInserts, calibration_id]
          : calibrationInserts,
      resRedirect =
        processCal !== "return_dash" &&
        processCal !== "return_dash_update" &&
        processCal !== "return_dash_insert"
          ? processCal
          : node_type == "cnry"
          ? "/api/canarys"
          : "/api/cubs";

    // ASSIGN VARS
    if (req.body.canary_id && processCal == "return_dash_insert")
      calibrationInserts.canary_id = req.body.canary_id;
    if (req.body.node_id) calibrationInserts.node_id = req.body.node_id;
    if (req.body.temp_divisor)
      calibrationInserts.temp_divisor = req.body.temp_divisor;
    if (req.body.temp_modifier)
      calibrationInserts.temp_modifier = req.body.temp_modifier;
    if (req.body.humidity_divisor)
      calibrationInserts.humidity_divisor = req.body.humidity_divisor;
    if (req.body.humidity_modifier)
      calibrationInserts.humidity_modifier = req.body.humidity_modifier;
    if (req.body.pressure_divisor)
      calibrationInserts.pressure_divisor = req.body.pressure_divisor;
    if (req.body.pressure_modifier)
      calibrationInserts.pressure_modifier = req.body.pressure_modifier;
    if (req.body.UV_divisor)
      calibrationInserts.UV_divisor = req.body.UV_divisor;
    if (req.body.UV_modifier)
      calibrationInserts.UV_modifier = req.body.UV_modifier;
    if (req.body.CdS_divisor)
      calibrationInserts.CdS_divisor = req.body.CdS_divisor;
    if (req.body.CdS_modifier)
      calibrationInserts.CdS_modifier = req.body.CdS_modifier;
    if (req.body.CO2_divisor)
      calibrationInserts.CO2_divisor = req.body.CO2_divisor;
    if (req.body.CO2_modifier)
      calibrationInserts.CO2_modifier = req.body.CO2_modifier;
    if (req.body.O2_divisor)
      calibrationInserts.O2_divisor = req.body.O2_divisor;
    if (req.body.O2_modifier)
      calibrationInserts.O2_modifier = req.body.O2_modifier;
    if (req.body.VOC_divisor)
      calibrationInserts.VOC_divisor = req.body.VOC_divisor;
    if (req.body.VOC_modifier)
      calibrationInserts.VOC_modifier = req.body.VOC_modifier;
    if (req.body.NH3_divisor)
      calibrationInserts.NH3_divisor = req.body.NH3_divisor;
    if (req.body.NH3_modifier)
      calibrationInserts.NH3_modifier = req.body.NH3_modifier;
    if (req.body.CO_divisor)
      calibrationInserts.CO_divisor = req.body.CO_divisor;
    if (req.body.CO_modifier)
      calibrationInserts.CO_modifier = req.body.CO_modifier;
    if (req.body.SR1_divisor)
      calibrationInserts.SR1_divisor = req.body.SR1_divisor;
    if (req.body.SR1_modifier)
      calibrationInserts.SR1_modifier = req.body.SR1_modifier;
    if (req.body.SR2_divisor)
      calibrationInserts.SR2_divisor = req.body.SR2_divisor;
    if (req.body.SR2_modifier)
      calibrationInserts.SR2_modifier = req.body.SR2_modifier;
    if (req.body.SR3_divisor)
      calibrationInserts.SR3_divisor = req.body.SR3_divisor;
    if (req.body.SR3_modifier)
      calibrationInserts.SR3_modifier = req.body.SR3_modifier;
    if (req.body.canary_temp_divisor)
      calibrationInserts.canary_temp_divisor = req.body.canary_temp_divisor;
    if (req.body.canary_temp_modifier)
      calibrationInserts.canary_temp_modifier = req.body.canary_temp_modifier;
    if (req.body.CH4_divisor)
      calibrationInserts.CH4_divisor = req.body.CH4_divisor;
    if (req.body.CH4_modifier)
      calibrationInserts.CH4_modifier = req.body.CH4_modifier;
    if (req.body.dB_divisor)
      calibrationInserts.dB_divisor = req.body.dB_divisor;
    if (req.body.dB_modifier)
      calibrationInserts.dB_modifier = req.body.dB_modifier;

    try {
      let calResult = await pool_a.query(query, insert_updata_data);
      if (calResult.affectedRows >= 1) {
        const calibrationDate = moment(Date.now()).format(
            "YYYY-MM-DD h:mm:ss",
            "Canada/Pacific"
          ),
          updateQuery =
            node_type == "cnry"
              ? "UPDATE Canaries SET last_calibrated=? WHERE unit_number=?"
              : "UPDATE CUBs SET last_calibrated=? WHERE node_id=?",
          canaryUpdate = [calibrationDate, unit_number];
        // update  last calibrated field
        try {
          let cal_updated = await pool_a.query(updateQuery, canaryUpdate);
          if (cal_updated.affectedRows >= 1) {
            res.redirect(resRedirect);
          }
        } catch (e) {
          console.log(e);
          return res.status(500).send(e);
        }
      }
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  });
};
