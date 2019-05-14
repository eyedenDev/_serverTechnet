const moment = require('moment'),
  showUsers = require('../middleware/showUsers'),
  // pool_a = require('../config/asyncpool_a'),
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

module.exports = function(app, passport) {
  let cubCrumbs = [
      { link: '/api', label: 'Dashboard', isActive: false },
      { link: '#', label: 'CÜBs', isActive: true }
    ],
    getCanaryQuery = 'SELECT * FROM CUBs ORDER BY unit_number ASC',
    loadEdit = `SELECT * FROM CUBs WHERE id=?;${getCanaryQuery}`,
    updateCanaryQuery = 'UPDATE `CUBs` SET node_id=?, unit_name=?, unit_number=? WHERE id=?',
    deleteUserQuery = 'DELETE FROM CUBs WHERE `id`=?',
    node_type ='cub',
    getCanaryResult,
    updateResult;

  // @route   GET api/CUB/test  - [ testCanary ]
  // @desc    Tests canary route
  // @access  Public
  app.get('/api/cubs/test', function(req, res) {
    res.status(200).json({
      message: 'CUB & Canary routes are Works!',
      response: 'success!'
    });
  });

  // @route   GET api/CUB - [ getCanaryPage ]
  // @desc    Load canarys dashboard page
  // @access  Public
  app.get('/api/cubs', async (req, res) => {
    let message_type = 'light',
      message = '',
      submit_endpoint ='api/cubs',
      submit_label = 'CREATE',
      add_or_edit = 'CÜB',
      submit_value = 'create',
      getCanaryResult;

    try {
      getCanaryResult = await pool_a.query(getCanaryQuery);
    } catch (e) {
      message_type = 'danger';
      message = e;
    } finally {
      res.render('./cub/cub_index', {
        title: 'TechNet | CÜBs',
        breadcrumbs: cubCrumbs,
        showUsers: showUsers(req.user.account_type),
        canary_addEdit: {},
        node_type,
        add_or_edit,
        submit_endpoint,
        submit_value,
        submit_label,
        canaries: getCanaryResult,
        message_type,
        message
      });
    }
  });

  // @route   GET api/CUB - [ getCanaryPage ]
  // @desc    Load canarys dashboard page
  // @access  Public
  app.post('/api/cubs', upload.none(), async (req, res) => {
    let { canary_id, processCanary } = req.body
      message_type = 'light',
      message = '',
      submit_endpoint ='api/cubs',
      submit_label = 'CREATE',
      add_or_edit = 'CANARY',
      submit_value = 'create',
      getCanaryResult,
      updateResult;
    switch (processCanary) {
    case 'edit': {
      submit_value= 'update';
      submit_label='UPDATE';
      try {
        var loadResult = await pool_a.query(loadEdit, [canary_id, ]);

      } catch (e) {
        return res.status(500).send(e);
      } finally {
        res.render('./cub/cub_index', {
          title: 'TechNet | Canaries',
          breadcrumbs: cubCrumbs,
          showUsers: showUsers(req.user.account_type),
          canary_addEdit: loadResult[0][0],
          node_type,
          submit_endpoint,
          submit_value,
          submit_label,
          canaries: loadResult[1],
          message_type,
          message
        });
      }
    }
      break;
    case 'update': {
      let node_id = req.body.node_id,
        unit_name = req.body.unit_name,
        unit_number = req.body.unit_number,
        insertObjs = [node_id, unit_name, unit_number, canary_id];
      try {
        updateResult = await pool_a.query(updateCanaryQuery, insertObjs);
      } catch (e) {
        return res.status(500).send(e);
      } finally {
        res.redirect('/api/cubs');
      }
    }
      break;
    case 'delete': {
      try {
        var deleteResult = await pool_a.query(deleteUserQuery, canary_id);
        if (deleteResult) res.redirect('/api/cubs');
      } catch (e) {
        return res.status(500).send(e);
      }
    }
      break;
    default:{
      let node_id = req.body.node_id,
        unit_name = req.body.unit_name,
        unit_number = req.body.unit_number,
        newCanary = { node_id, unit_name, unit_number },
        existsQuery = `SELECT * FROM CUBs WHERE node_id=?;${getCanaryQuery}`,
        insertQuery = 'INSERT INTO `CUBs` SET ?',
        existsResult,
        submit_value= 'create',
        submit_label='CREATE';
      try {
        existsResult = await pool_a.query(existsQuery, [node_id,]);

        if(existsResult[0].length > 0) {
          message = 'Node_id already exists';
          message_type = 'warning';

          res.render('./cub/cub_index', {
            title: 'TechNet | Canaries',
            breadcrumbs: cubCrumbs,
            showUsers: showUsers(req.user.account_type),
            canary_addEdit: newCanary,
            node_type,
            add_or_edit,
            submit_endpoint,
            submit_value,
            submit_label,
            canaries: getCanaryResult,
            message_type,
            message
          });
          try {
            getCanaryResult = await pool_a.query(getCanaryQuery);
          } catch (e) {
            return res.status(500).send(e);
          } finally {
            res.render('./cub/cub_index', {
              title: 'TechNet | Canaries',
              breadcrumbs: cubCrumbs,
              showUsers: showUsers(req.user.account_type),
              canary_addEdit: newCanary,
              node_type,
              add_or_edit,
              submit_endpoint,
              submit_value,
              submit_label,
              canaries: getCanaryResult,
              message_type,
              message
            });
          }
        } else {
          try {
            var insertResult = await pool_a.query(insertQuery, newCanary);
            if (insertResult) res.redirect('/api/cubs');
          } catch (e) {
            return res.status(500).send(e);
          }
        }
      } catch (e) {
        return res.status(500).send(e);
      }
    }
    }
  });

};
