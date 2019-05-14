'use strict';

module.exports = function(app) {
  app.post('/api/treatment/testing', function(req, res) {
    const body = req.body;
    console.log(body);

    res.status(200).json({
      captured: body,
      status: 'captured'
    });
  });
};
