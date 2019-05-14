'use strict';
const moment = require('moment');

function getDuration(startTime, endTime) {
  return moment(moment(startTime, 'h:mm').diff(moment(endTime, 'h:mm'))).format(
    'h:mm'
  );
}
module.exports = getDuration;
