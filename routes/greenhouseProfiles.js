const // pool_a = require('../config/asyncpool_a'),
multer = require('multer'),
fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif' ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true); // save file
  } else {
    cb(null, false); // reject file  /* // throw err==> cb(, true); */
  }
},
storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
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

module.exports = function(app) {
  // testing
  app.get('/api/greenhouseProfiles/test', function(req, res) {
    res.status(200).json({
      message: 'Greenhouse Profiles',
      response: 'success!'
    });
  });

  //  greenhouse profiles screen
  app.get('/api/greenhouseProfiles/', async (req, res) => {
    let getQuery =
        'SELECT id, design, `desc`, c_value FROM api_gh_design WHERE status=\'approved\' ORDER BY design ASC;SELECT id, frame FROM api_gh_frame WHERE status=\'approved\' ORDER BY frame ASC; SELECT id, floor, c_value FROM api_gh_floor  WHERE status=\'approved\' ORDER BY floor ASC; SELECT id, covering, c_value FROM api_gh_covering WHERE status=\'approved\' ORDER BY covering ASC;SELECT id, gutter, c_value FROM api_gh_gutter WHERE status=\'approved\' ORDER BY gutter ASC; SELECT id, system, c_value FROM api_gh_heating  WHERE status=\'approved\' ORDER BY system ASC; SELECT id, ventilation, c_value FROM api_gh_ventilation  WHERE status=\'approved\' ORDER BY ventilation ASC; SELECT id, system, c_value FROM api_gh_co2  WHERE status=\'approved\' ORDER BY system ASC; SELECT id, state, c_value FROM api_gh_screens  WHERE status=\'approved\' ORDER BY state ASC; SELECT id, screen, c_value FROM api_gh_screen_types  WHERE status=\'approved\' ORDER BY screen ASC;SELECT id, source FROM api_gh_power  WHERE status=\'approved\' ORDER BY source ASC; SELECT id, media, c_value FROM api_gh_growMedia  WHERE status=\'approved\' ORDER BY media ASC;SELECT id, obj FROM api_gh_misc  WHERE status=\'approved\' ORDER BY obj ASC',
      queryResult,
      gr5_obj = new Object();
    try {
      queryResult = await pool_a.query(getQuery);
      if (queryResult) {
        gr5_obj.designs = queryResult[0];
        gr5_obj.frames = queryResult[1];
        gr5_obj.floors = queryResult[2];
        gr5_obj.coverings = queryResult[3];
        gr5_obj.gutters = queryResult[4];
        gr5_obj.heating = queryResult[5];
        gr5_obj.ventilation = queryResult[6];
        gr5_obj.co2 = queryResult[7];
        gr5_obj.energyScreens = queryResult[8];
        gr5_obj.screenTypes = queryResult[9];
        gr5_obj.power = queryResult[10];
        gr5_obj.growMedia = queryResult[11];
        gr5_obj.misc = queryResult[12];

        res.status(200).json(gr5_obj);
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  //  greenhouse crops screen
  app.get('/api/greenhouseCrops/', async (req, res) => {
    let cropQuery =
        'SELECT id, crop, c_value FROM api_gr_crops  WHERE status=\'approved\' ORDER BY crop ASC',
      cropResult;
    try {
      cropResult = await pool_a.query(cropQuery);
      if (cropResult) {
        res.status(200).json(cropResult);
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  //  greenhouse crops screen
  app.post('/api/greenhouseCrops/', upload.none(), async (req, res) => {
    let { crop } = req.body,
      existsQuery = 'SELECT crop FROM api_gr_crops WHERE crop=?',
      insertQuery = 'INSERT INTO `api_gr_crops` SET ?',
      existsResult,
      insertResult;
    try {
      existsResult = await pool_a.query(existsQuery, crop);
      if (existsResult) {
        console.log(existsResult);
        res.status(400).json({
          error: `${crop} already exists in our records`,
          response: 'Submission failure!'
        });
      } else {
        insertResult = await pool_a.query(insertQuery, crop);
        if (insertResult) {
          res.status(200).json({
            message: 'Crop created!!',
            response: 'success!'
          });
        }
      }
    } catch (e) {
      return res.status(500).send(e);
    }
    // try {
    //   cropResult = await pool_a.query(cropQuery);
    //   if (cropResult) {
    //     res.status(200).json(cropResult);
    //   }
    // } catch (e) {
    //   return res.status(500).send(e);
    // }
  });

  //  greenhouse profiles screen
  app.get('/api/treatmentTargets/', async (req, res) => {
    let getQuery =
        'SELECT id, type, c_value FROM restorations_fire WHERE status=\'approved\' ORDER BY type ASC; SELECT id, type, c_value FROM restortions_flood WHERE status=\'approved\'  ORDER BY restortions_flood.type ASC; SELECT c_value, type, id FROM abatements_bacteria WHERE status=\'approved\' ORDER BY type ASC; SELECT c_value, type, id FROM abatement_fungals WHERE status=\'approved\' ORDER BY type ASC; SELECT c_value, type, id FROM abatement_mildews WHERE status=\'approved\' ORDER BY type ASC; SELECT c_value, type, id FROM abatement_molds WHERE status=\'approved\' ORDER BY type ASC; SELECT c_value, type, id FROM abatement_viroids WHERE status=\'approved\' ORDER BY type ASC; SELECT c_value, type, id FROM abatement_viruses WHERE status=\'approved\' ORDER BY type ASC; SELECT id, pest, c_value FROM api_pests WHERE sectors LIKE \'%Agricultural%\' AND status= \'approved\' ORDER BY api_pests.pest ASC',
      queryResult,
      gr9_obj = new Object();
    try {
      queryResult = await pool_a.query(getQuery);
      if (queryResult) {
        gr9_obj.fire = queryResult[0];
        gr9_obj.flood = queryResult[1];
        gr9_obj.bacteria = queryResult[2];
        gr9_obj.fungals = queryResult[3];
        gr9_obj.mildews = queryResult[4];
        gr9_obj.molds = queryResult[5];
        gr9_obj.viroids = queryResult[6];
        gr9_obj.viruses = queryResult[7];
        gr9_obj.pests = queryResult[8];

        res.status(200).json(gr9_obj);
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });


  // append new combustio type
  app.post('/api/treatmentTargets/fire', upload.none(), async(req, res) => {
    var type = req.body.type,
    newObj = { type },
    existsQuery = 'SELECT id FROM restorations_fire where type=?',
    existResult,
    insertQuery = 'INSERT INTO restorations_fire SET ?',
    insertresult;
    try {
      existResult = await pool_a.query(existsQuery, type);
      if (existResult[0]) {
        res.status(400).json({
          message: 'Combustion type already exists in db',
          response: 'error!'
        });
      }else {
        try {
           insertResult = await pool_a.query(insertQuery, newObj);
           if (insertResult) {
             res.status(400).json({
               message: 'Combustion type added to db',
               response: 'Success!'
             });
           }
        } catch (e) {
          return res.status(500).send(e);
        }
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  // append new flood source
  app.post('/api/treatmentTargets/flood', upload.none(), async(req, res) => {
    var type = req.body.type,
    newObj = { type },
    existsQuery = 'SELECT id FROM restortions_flood where type=?',
    existResult,
    insertQuery = 'INSERT INTO restortions_flood SET ?',
    insertresult;
    try {
      existResult = await pool_a.query(existsQuery, type);
      if (existResult[0]) {
        res.status(400).json({
          message: 'Flood type already exists in db',
          response: 'error!'
        });
      }else {
        try {
           insertResult = await pool_a.query(insertQuery, newObj);
           if (insertResult) {
             res.status(400).json({
               message: 'Flood source type added to db',
               response: 'Success!'
             });
           }
        } catch (e) {
          return res.status(500).send(e);
        }
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  // append new bacterial type
  app.post('/api/treatmentTargets/bacteria', upload.none(), async(req, res) => {
    var type = req.body.type,
    newObj = { type },
    existsQuery = 'SELECT id FROM abatement_bacterials where type=?',
    existResult,
    insertQuery = 'INSERT INTO abatement_bacterials SET ?',
    insertresult;
    try {
      existResult = await pool_a.query(existsQuery, type);
      if (existResult[0]) {
        res.status(400).json({
          message: 'Bacteria type already exists in db',
          response: 'error!'
        });
      }else {
        try {
           insertResult = await pool_a.query(insertQuery, newObj);
           if (insertResult) {
             res.status(400).json({
               message: 'Bacteria added to db',
               response: 'Success!'
             });
           }
        } catch (e) {
          return res.status(500).send(e);
        }
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  // append new bacterial type
  app.post('/api/treatmentTargets/fungals', upload.none(), async(req, res) => {
    var type = req.body.type,
    newObj = { type },
    existsQuery = 'SELECT id FROM abatement_fungals where type=?',
    existResult,
    insertQuery = 'INSERT INTO abatement_fungals SET ?',
    insertresult;
    try {
      existResult = await pool_a.query(existsQuery, type);
      if (existResult[0]) {
        res.status(400).json({
          message: 'Fungal type already exists in db',
          response: 'error!'
        });
      }else {
        try {
           insertResult = await pool_a.query(insertQuery, newObj);
           if (insertResult) {
             res.status(400).json({
               message: 'Fungal added to db',
               response: 'Success!'
             });
           }
        } catch (e) {
          return res.status(500).send(e);
        }
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  // append new mildew type
  app.post('/api/treatmentTargets/mildew', upload.none(), async(req, res) => {
    var type = req.body.type,
    newObj = { type },
    existsQuery = 'SELECT id FROM abatement_mildews where type=?',
    existResult,
    insertQuery = 'INSERT INTO abatement_mildews SET ?',
    insertresult;
    try {
      existResult = await pool_a.query(existsQuery, type);
      if (existResult[0]) {
        res.status(400).json({
          message: 'Mildew type already exists in db',
          response: 'error!'
        });
      }else {
        try {
           insertResult = await pool_a.query(insertQuery, newObj);
           if (insertResult) {
             res.status(400).json({
               message: 'Mildew added to db',
               response: 'Success!'
             });
           }
        } catch (e) {
          return res.status(500).send(e);
        }
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  // append new mold type
  app.post('/api/treatmentTargets/mildew', upload.none(), async(req, res) => {
    var type = req.body.type,
    newObj = { type },
    existsQuery = 'SELECT id FROM abatement_molds where type=?',
    existResult,
    insertQuery = 'INSERT INTO abatement_molds SET ?',
    insertresult;
    try {
      existResult = await pool_a.query(existsQuery, type);
      if (existResult[0]) {
        res.status(400).json({
          message: 'Mold type already exists in db',
          response: 'error!'
        });
      }else {
        try {
           insertResult = await pool_a.query(insertQuery, newObj);
           if (insertResult) {
             res.status(400).json({
               message: 'Mold added to db',
               response: 'Success!'
             });
           }
        } catch (e) {
          return res.status(500).send(e);
        }
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  // append new viroid type
  app.post('/api/treatmentTargets/viroids', upload.none(), async(req, res) => {
    var type = req.body.type,
    newObj = { type },
    existsQuery = 'SELECT id FROM abatement_viroids where type=?',
    existResult,
    insertQuery = 'INSERT INTO abatement_viroids SET ?',
    insertresult;
    try {
      existResult = await pool_a.query(existsQuery, type);
      if (existResult[0]) {
        res.status(400).json({
          message: 'Viroid type already exists in db',
          response: 'error!'
        });
      }else {
        try {
           insertResult = await pool_a.query(insertQuery, newObj);
           if (insertResult) {
             res.status(400).json({
               message: 'Viroud added to db',
               response: 'Success!'
             });
           }
        } catch (e) {
          return res.status(500).send(e);
        }
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  // append new virus type
  app.post('/api/treatmentTargets/virus', upload.none(), async(req, res) => {
    var type = req.body.type,
    newObj = { type },
    existsQuery = 'SELECT id FROM abatement_viruses where type=?',
    existResult,
    insertQuery = 'INSERT INTO abatement_viruses SET ?',
    insertresult;
    try {
      existResult = await pool_a.query(existsQuery, type);
      if (existResult[0]) {
        res.status(400).json({
          message: 'Virus type already exists in db',
          response: 'error!'
        });
      }else {
        try {
           insertResult = await pool_a.query(insertQuery, newObj);
           if (insertResult) {
             res.status(400).json({
               message: 'Virus added to db',
               response: 'Success!'
             });
           }
        } catch (e) {
          return res.status(500).send(e);
        }
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

};
