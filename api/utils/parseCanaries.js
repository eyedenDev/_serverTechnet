const moment = require("moment");
/*
FUNCTION: getTimeStamp
PURPOSE:  returnCurrent timestamp
PARAMS:   void
RETURN: datertime formattde by moment
*/
module.exports = canaries => {
  let returnCanaries = [];
  canaries.forEach(canary => {
    returnCanaries.push(parseInt(canary));
  });
  return returnCanaries;
};
