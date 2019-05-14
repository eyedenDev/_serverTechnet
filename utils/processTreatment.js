'use strict';

const processTreatment = {
  returnCalibrated: (isCalibrated, value, div, mod, dec = 2) => {
    //  y = mx+b :: y = b + mx  return isCalibrated ? mod + value * div : value;
    const initValue = value * 1,
      divisor = div * 1,
      modifier = mod * 1;
    let rtnResult = isCalibrated ? initValue / divisor + modifier : initValue;
    return parseFloat(parseFloat(rtnResult).toFixed(dec));
  },
  round: (x, n) => {
    return parseFloat(
      Math.round(x * Math.pow(10, n)) / Math.pow(10, n)
    ).toFixed(n);
  }
};
module.exports = processTreatment;
