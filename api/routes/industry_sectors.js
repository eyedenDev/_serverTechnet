const showUsers = require('../middleware/showUsers'),
  ExpressData = require('../middleware/ExpressData'),
  {
    Divider,
    TextField_Hidden,
    FormSudoButton,
    ButtonComponent,
    TextFieldGroupRow,
    SelectGroup
  } = require('../components/components'),
  // pool_a = require('../config/asyncpool_a'),
  retunNullVar = require('../middleware/retunNullVar'),
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
  var breadcrumbs = [
      { link: '/api', label: 'Dashboard', isActive: false },
      { link: '#', label: 'App API ', isActive: true },
      { link: '#', label: 'Industry - Sectors', isActive: true }
    ],
    baseUrl = '/api/industry_sectors',
    getQuery = 'SELECT * FROM industry_sectors ORDER BY industry ASC',
    insertQuery = 'INSERT INTO industry_sectors SET ?',
    form_header = '<span class="text-muted">Industries |</span> Create Sector',
    searchObjs = 'Industry | Sectors',
    message_type = 'light',
    message = '',
    pageTitle = 'TechNet | API - Industry Sectors',
    renderDoc = './app_api/industry_sectors',
    formCreateLbl = 'CREATE SECTOR',
    formEditLbl = 'UPDATE SECTOR';

  // @func   createForm
  // @desc    create&& return design form with params
  // @params
  //  - TextFieldGroupRow: (type, name, label, placeholder, value, required, error, info, onChange, disabled,min,max, step)
  //  - TextAreaGroup: (name, label, placeholder, value, required, rows, cols, maxlength, spellcheck,disabled, readonly, error, info, onChange)
  //  - ButtonComponent: (_type, _btn_size , _btn_type, _name, _value, _label, _btn_margin)
  function createForm(
    id = '',
    primaryVal = '',
    primeE = null,
    sectorIndustry = '',
    sectorE = null,
    sectorI = null,
    cancelLink = '',
    btnLabel = '',
    btnValue = 'submit',
    showHideDel = false,
    showHideLink = ''
  ) {
    var form_obj = [],
      selectOpts = ['Agricultural', 'Industrial', 'Residential', 'All'];
    form_obj.push(TextField_Hidden('id', id));
    form_obj.push(
      TextFieldGroupRow(
        'text',
        'industry',
        'Industry Sector',
        '',
        primaryVal,
        true,
        primeE,
        null
      )
    );
    form_obj.push(
      SelectGroup(
        'sector',
        'sector',
        'Industry Sector',
        selectOpts,
        sectorIndustry,
        false,
        true,
        false,
        sectorE,
        sectorI
      )
    );
    form_obj.push(Divider(3, 3));
    if (showHideDel) {
      form_obj.push(
        FormSudoButton(cancelLink, 'cancel', 'cancel', 'secondary', 'CANCEL')
      );
      form_obj.push(
        FormSudoButton(showHideLink, 'delete', 'delete', 'danger', 'DELETE')
      );
    } else {
      form_obj.push(
        FormSudoButton(cancelLink, 'cancel', 'cancel', 'danger', 'CANCEL')
      );
    }
    form_obj.push(
      ButtonComponent(
        'submit',
        'btn-sm',
        'warning',
        'processItem',
        btnValue,
        btnLabel
      )
    );
    return form_obj;
  }

  // @route   GET api/canary - [ getCanaryPage ]
  // @desc    Load canarys dashboard page
  // @access  Public
  app.get(baseUrl, async (req, res) => {
    var getResult;

    try {
      getResult = await pool_a.query(getQuery);
      if (getResult) {
        res.render(renderDoc, {
          title: pageTitle,
          breadcrumbs,
          showUsers: showUsers(req.user.account_type),
          form_header,
          searchObjs,
          form_obj: createForm(
            '',
            '',
            null,
            '',
            null,
            null,
            baseUrl,
            formCreateLbl,
            'submit',
            false,
            ''
          ),
          // form_obj: createForm(
          //   '',
          //   '',
          //   null,
          //   '',
          //   null,
          //   '',
          //   formCreateLbl,
          //   baseUrl
          // ),
          qryResults: getResult,
          formAction: baseUrl,
          message_type,
          message
        });
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  app.post(baseUrl, upload.none(), async (req, res) => {
    let { id, processItem } = req.body;
    var props = new ExpressData(req).props,
      getResult,
      existsResult;

    switch (processItem) {
    case 'update':
      {
        let { id, industry, sector } = req.body,
          updateQuery = 'UPDATE `industry_sectors` SET ? WHERE id=?',
          statusUpdate = [{ industry, sector }, id];

        try {
          var updateDesignResult = await pool_a.query(
            updateQuery,
            statusUpdate
          );
          if (updateDesignResult) res.redirect(baseUrl);
        } catch (e) {
          return res.status(500).send(e);
        }
      }
      break;
    default: {
      // create design
      let industry = req.body.industry,
        sector = req.body.sector,
        status = 'approved',
        newObj = { industry, sector, status },
        existingQuery = `SELECT id FROM industry_sectors WHERE industry=?;${getQuery}`;
      console.log('>>>>>>>>>>>>>>>>>>>' + req.body);

      try {
        existsResult = await pool_a.query(existingQuery, [id]);
        if (existsResult[0].length > 0) {
          message = 'That industry already exists in our records';
          message_type = 'warning';

          res.render(renderDoc, {
            title: pageTitle,
            breadcrumbs,
            showUsers: showUsers(req.user.account_type),
            props,
            form_header,
            searchObjs,
            // createForm( id, primaryVal, primeE, descValue, descE, cancelLink,btnLabel)
            form_obj: createForm(
              '',
              '',
              null,
              '',
              null,
              null,
              baseUrl,
              formCreateLbl,
              'submit',
              false,
              ''
            ),
            qryResults: getResult,
            formAction: baseUrl,
            submit_value: 'create',
            submit_label: 'CREATE',
            message_type,
            message
          });
        } else {
          try {
            var insertResult = await pool_a.query(insertQuery, newObj);
            if (insertResult) res.redirect(baseUrl);
          } catch (e) {
            return res.status(500).send(e);
          }
        }
      } catch (e) {
        return res.status(500).send(e);
      }
    }
    }

    try {
      getResult = await pool_a.query(getQuery);
      if (getResult) {
        res.render(renderDoc, {
          title: pageTitle,
          breadcrumbs,
          showUsers: showUsers(req.user.account_type),
          form_header,
          searchObjs,
          form_obj: createForm(
            '',
            '',
            null,
            '',
            null,
            '',
            null,
            baseUrl,
            formCreateLbl
          ),
          qryResults: getResult,
          formAction: baseUrl,
          submit_value: 'create',
          submit_label: 'CREATE',
          message_type,
          message
        });
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  // @route   GET api/location_designs/:id
  // @desc    load design for editing
  // @access  Public
  app.get(`${baseUrl}/:id`, async (req, res) => {
    var props = new ExpressData(req).props,
      id = props.id,
      loadEdit = `SELECT * FROM industry_sectors WHERE id=?;${getQuery}`;

    try {
      var loadEditResult = await pool_a.query(loadEdit, [id]);
      if (loadEditResult) {
        var editResult = loadEditResult[0][0],
          otherResults = loadEditResult[1],
          delLink = `${baseUrl}/expunge/${editResult.id}`;

        res.render(renderDoc, {
          title: pageTitle,
          breadcrumbs,
          showUsers: showUsers(req.user.account_type),
          form_header,
          searchObjs,
          form_obj: createForm(
            editResult.id,
            editResult.industry,
            null,
            editResult.sector,
            null,
            null,
            baseUrl,
            formEditLbl,
            'update',
            true,
            delLink
          ),
          // form_obj: createForm(
          //   editResult.id,
          //   editResult.type,
          //   null,
          //   retunNullVar(editResult.c_value),
          //   formEditLbl,
          //   baseUrl,
          //   formEditLbl,
          //   'update',
          //   true,
          //   delLink
          // ),
          qryResults: otherResults,
          formAction: baseUrl,
          message_type,
          message
        });
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  // @route   GET api/location_designs/approve/
  // @desc    appove designs
  // @access  Public
  app.get(`${baseUrl}/approve/:id`, async (req, res) => {
    var props = new ExpressData(req).props,
      approveQuery = 'UPDATE `industry_sectors` SET `status`=? WHERE id=?',
      id = props.id,
      status = 'approved',
      approvalObjs = [status, id];

    try {
      var approved = await pool_a.query(approveQuery, approvalObjs);
      if (approved) res.redirect(baseUrl);
    } catch (e) {
      return res.status(500).send(e);
    }
  });

  // @route   GET api/location_designs/del_rej/
  // @desc    appove designs
  // @access  Public
  app.get(`${baseUrl}/expunge/:id`, async (req, res) => {
    var props = new ExpressData(req).props,
      deletsQuery = 'DELETE FROM industry_sectors WHERE `id`=?',
      id = props.id;

    try {
      var approved = await pool_a.query(deletsQuery, id);
      if (approved) res.redirect(baseUrl);
    } catch (e) {
      return res.status(500).send(e);
    }
  });
};
