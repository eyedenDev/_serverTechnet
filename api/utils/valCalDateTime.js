const moment = require("moment");
/*
FUNCTION: valCalDateTime
PURPOSE:  validate if calibration  date time is valid timestamp if not attempt to format if both fail rturn null else retun formated timestamp
PARAMS:   date  value
RETURN:   null || timestamp
*/
module.exports = date => {
  // return new Date(date).toString() !== 'Invalid Date' ? true : false;
  return new Date(date).toString() == "Invalid Date"
    ? moment
        // .tz(date, "America/Vanvouver")
        // .tz("America/Vanvouver")
        .format("YYYY-MM-DD hh:mm:ss")
    : new Date(date).toString() !== "Invalid Date"
    ? date
    : null;
};
