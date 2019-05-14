const bcrypt = require('bcrypt-nodejs'),
  validateLoginInput = require('../validation/login'),
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

module.exports = (app, passport) => {
  // @route   GET /test  - [ testUsers ]
  // @desc    Tests user route
  // @access  Public
  app.get('/test', function(req, res) {
    res.status(200).json({
      message: 'User routes are Works!',
      response: 'success!'
    });
  });

  // @route   GET login  - [ login screen ]
  // @desc    Tests user route
  // @access  Public
  app.get('/', async (req, res) => {
    console.log('1');
    res.render('./auth/_login', {
      title: 'Welcome to TechNet | Login',
      message: ''
    });
  });

  app.get('/forgottenPassword', async (req, res) => {
    res.render('./auth/_forgot', {
      title: 'Welcome to TechNet | ForgottenPassword',
      message: ''
    });
  });

  // app.get('/', function(req, res) {
  //   res.render('./auth/_login', {
  //     title: 'Welcome to TechNet | Login',
  //     message: ''
  //   });
  // });

  // @route   POST login  - [ process login screen ]
  // @desc    Tests user route
  // @access  Public
  app.post(
    '/',  upload.none(),
    passport.authenticate('local-login', {
      // successRedirect: '/api/canarys', // redirect to the secure profile section
      successRedirect: '/api/display_treatments/all', // redirect to the secure profile section
      failureRedirect: '/', // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    }),
    function(req, res) {
      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
      } else {
        req.session.cookie.expires = false;
      }
      res.redirect('/');
    }
  );
};
