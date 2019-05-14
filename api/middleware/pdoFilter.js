'use strict';

function pdoFilter(param) {
  let filteredParam = param.replace(/ /g, '+');
  if (filteredParam.endsWith('+')) {
    return filteredParam.slice(0, -1);
  } else {
    return filteredParam;
  }
}
module.exports = pdoFilter;
