'use strict';
const showUsers = require('../middleware/showUsers'),
  isAuthorized = require('../middleware/isAuthorized');

module.exports = function(app, passport) {

  app.get('/healthz', function(req, res) {
    res.status(200).json({
      message: 'healthy!',
      response: 'success!'
    });
  });

  // @route   GET api/canary - [ getCanaryPage ]
  // @desc    Load canarys dashboard page
  // @access  Public
  app.get('/api', isAuthorized, async (req, res) => {
    var breadcrumbs = [
      { link: '/api', label: 'Dashboard', isActive: false },
      { link: '#', label: 'Overview', isActive: true }
    ];

    res.render('./dashboard/index', {
      title: 'TechNet - Dashboard Overview',
      breadcrumbs,
      showUsers: showUsers(req.user.account_type),
      message_type: 'light',
      message: ''
    });
  });
};
