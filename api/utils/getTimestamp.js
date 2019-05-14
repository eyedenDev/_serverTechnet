const moment = require("moment");
/*
FUNCTION: getTimeStamp
PURPOSE:  returnCurrent timestamp
PARAMS:   void
RETURN: datertime formattde by moment
*/
module.exports = (_under = true) => {
  return _under
    ? moment(Date.now()).format("YYYY-MM-DD_hh:mm:ss", "America/Vancouver")
    : moment(Date.now()).format("YYYY-MM-DD hh:mm:ss", "America/Vancouver");
};
