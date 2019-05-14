/*
FUNCTION: returnCalibrated
PURPOSE:  if value exists &&  calibrate  values exist  claibrate and return value  else if value exist no cal values return raw value else value undefined or null return null
PARAMS:   isCalibrated == bool value int divisor model dec value
RETURN:    various value or null
*/
module.exports = (isCalibrated, arg, div, mod, dec = 4) => {
  const convertFloat = parseFloat(arg);
  // if null dumpout and return null
  if (arg === null || arg === undefined || div == null || mod == null) {
    return null;
  } else if (isNaN(convertFloat)) {
    return null;
  } else {
    //  y = mx+b :: y = b + mx  return isCalibrated ? mod + value * div : value;
    const initValue = arg * 1,
      divisor = div * 1,
      modifier = mod * 1;
    let rtnResult = isCalibrated ? initValue / divisor + modifier : initValue;
    return parseFloat(parseFloat(rtnResult).toFixed(dec));
  }
};

// const  returnCalibrated = = (isCalibrated, arg, div, mod, dec = 4) => {
//   const convertFloat = parseFloat(arg);
//   // if null dumpout and return null
//   if (arg === null || arg === undefined) {
//     return null;
//   } else if (isNaN(convertFloat)) {
//     return null;
//   } else {
//     //  y = mx+b :: y = b + mx  return isCalibrated ? mod + value * div : value;
//     const initValue = arg * 1,
//       divisor = div * 1,
//       modifier = mod * 1;
//     let rtnResult = isCalibrated ? initValue / divisor + modifier : initValue;
//     return parseFloat(parseFloat(rtnResult).toFixed(dec));
//   }
//   };
// module.exports.returnCalibrated = returnCalibrated;
