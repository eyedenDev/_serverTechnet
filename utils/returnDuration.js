const moment = require("moment");
/*
  FUNCTION: returnDuration
  PURPOSE:  return duration of action
  PARAMS:   _startTime && _endTime
  RETURN:    float
  */
module.exports = (startTime, endTime) => {
  const _startTime = moment(startTime).format(),
    _endTime = moment(endTime).format(),
    _duration = moment.duration(moment(_endTime).diff(_startTime)),
    _hours = _duration.asHours();
  return _hours.toFixed(2);
};
