const showUsers = require('../middleware/showUsers'),
  crypt_o = require('../middleware/crypt.o'),
  ExpressData = require('../middleware/ExpressData'),
  moment = require('moment'),
  {
    Divider,
    TextField_Hidden,
    FormSudoButton,
    ButtonComponent,
    TextFieldGroupRow,
    TextAreaGroup,
    SelectGroup
  } = require('../components/components'),
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

  var baseUrl = '/api/service_request',
  renderDoc = './serviceRequests/service',
  priorityOptions = ['low','normal','important','critical'],
  statusOptions = ['pending','inprogress','material delay','complete'];

  function createForm(
    // id = '',
    c_or_c = 'Canary',
    primaryVal = '',
    primeE = null,
    srvc_val = '',
    srvc_valE = null,
    descValue ='',
    descError = null,
    prioritySelect='',
    prioritySectorE = null,
    prioritySectorI = null,
    cancelLink = '',
    btnLabel = '',
    btnValue = 'submit',
    showHideDel = false,
    showHideLink = ''
  ) {
    var form_obj = [];
    // form_obj.push(TextField_Hidden('id', id));
    form_obj.push(
      TextFieldGroupRow(
        'text',
        'node_id',
        `${c_or_c} ID`,
        '',
        primaryVal,
        true,
        primeE,
        null
      )
    );
    form_obj.push(
      TextFieldGroupRow(
        'text',
        'service',
        'Required Service',
        '',
        srvc_val,
        true,
        srvc_valE,
        null
      )
    );
    form_obj.push(
      TextAreaGroup(
        'description',
        'Description',
        '',
        descValue,
        false,
        5,
        null,
        null,
        true,
        false,
        false,
        descError,
        null
      )
    );
    form_obj.push(
      SelectGroup(
        'priority',
        '',
        'Priority',
        priorityOptions,
        prioritySelect,
        false,
        true,
        false,
        prioritySectorE,
        prioritySectorI
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

  // @route   GET /api/service_request/:node_id - [ getCalibrations ]
  // @desc    Load add canary clibrations forcalibration
  // @access  Public
  app.get(`${baseUrl}/:node_id`, async (req, res) => {
    const props = new ExpressData(req).props,
      // node_id = props.node_id,
      node_type = props.type,
      node_id = req.params.node_id;
      servicenQuery ='SELECT service_requests.*, users.first_name, users.last_name FROM service_requests JOIN users ON service_requests.requested_by_user = users.id WHERE service_requests.node_id=? ORDER BY service_requests.service_request_date ASC',
      // // fallBackQuery =
      //   node_type == 'cnry'
      //     ? 'SELECT * FROM Canaries WHERE node_id=?'
      //     : 'SELECT * FROM CUBs WHERE node_id=?',
      ref_link = node_type == 'cnry' ? '/api/canarys' : '/api/cubs',
      ref_label = node_type == 'cnry' ? 'Canaries' : 'CÜBs',
      cal_label = node_type == 'cnry' ? 'Canary' : 'CÜB',
      // return_link =
      //   props.bk != null || props.bk != undefined
      //     ? crypt_o.decryptIv(props.bk)
      //     : null,
      // alt_link = ref_link,
      breadcrumbs = [
        { link: '/api', label: 'Dashboard', isActive: false },
        { link: ref_link, label: ref_label, isActive: false },
        { link: '#', label: 'Service Request', isActive: true }
      ],
      message_type = 'light',
      message = '',
      form_header = `<span class="text-muted">Service Requests | </span>Create ${cal_label} Request`,
      searchObjs = `${cal_label} ${node_id} Service Requests`,
      isCanary = node_type == 'cnry' ? true: false,
      pageTitle  = isCanary ? 'TechNet | API - Canary Service Request': 'TechNet | API - CÜB Service Request',
      formCreateLbl = isCanary ? 'CREATE CANARY SERVICE REQUEST': 'CREATE CÜB SERVICE REQUEST',
      formEditLbl = 'UPDATE REQUEST';
      cancel_link = isCanary ? '/api/canarys': '/api/cubs',
      func_s = { moment };
;

    try {
      var pastServices = await pool_a.query(servicenQuery, node_id);
      console.log(pastServices);
    } catch (e) {
      return res.status(500).send(e);
    } finally {
      res.render(renderDoc, {
        title: pageTitle,
        breadcrumbs,
        showUsers: showUsers(req.user.account_type),
        func_s,
        props,
        form_header,
        searchObjs,
        form_obj: createForm(
          c_or_c = cal_label,
          primaryVal = node_id,
          primeE = null,
          srvc_val = '',
          srvc_valE = null,
          descValue ='',
          descError = null,
          prioritySelect='',
          prioritySectorE = null,
          prioritySectorI = null,
          cancelLink = cancel_link,
          btnLabel = formCreateLbl,
          btnValue = 'submit',
          showHideDel = false,
          showHideLink = ''
          ),
        services : pastServices,
        formAction: '',
        message_type,
        message
      });
    }
  });

  // @route   POST /api/service_request/:node_id [ calibrateCanary ]
  // @desc    Process  edit canary calibration form
  // @access  Public
  app.post(`${baseUrl}/:node_id`, upload.none(), async (req, res) => {
    var props = new ExpressData(req).props,
      { node_id, service, description, priority, processCal } = req.body,
      requested_by_user = req.user.id
      createRequest = { node_id, service, description, priority, requested_by_user },
      node_type = props.type,
      message = '',
      query = 'INSERT INTO `service_requests` SET ?',
      resRedirect = node_type == 'cnry'
            ? '/api/canarys'
            : '/api/cubs',
      func_s = { moment };

    try {
      var result = await pool_a.query(query, createRequest),
        service_id = result.insertId,
        task = 'New Service ticket requires your attention...'
        description = node_type == 'cnry'
        ? `Canary ID:: ${node_id} requires servicing... SERVICE TICKET:: ${service_id}`
        : `CÜB ID:: ${node_id} requires servicing... SERVICE TICKET::${service_id}`,
        loadResource =`SELECT id FROM users WHERE users.last_name='Floren' AND users.account_type='r&d'`;
        try {
          const loadResult = await pool_a.query(loadResource);
          const user_id = loadResult[0].id,
            taskInsert = 'INSERT INTO user_tasks SET ?',
            newTask = { task, description, user_id };
            try {
              var taskInserted = await pool_a.query(taskInsert, newTask);
              if (taskInserted) {
                res.redirect(resRedirect);
              }
            } catch (e) {
              return res.status(500).send(err);
            }
        } catch (e) {
          return res.status(500).send(err);
        }
    } catch (err) {
      return res.status(500).send(err);
    }

  });
};
