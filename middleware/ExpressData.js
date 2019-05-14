const _ = require('lodash');

class ExpressData {
  /*
   * @param {Object} req - express request object
   */
  constructor(req) {
    //Merge all data passed by the client in the request
    this.props = _.merge(req.body, req.params, req.query);
  }
}

module.exports = ExpressData;
