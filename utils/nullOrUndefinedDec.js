/*
FUNCTION: nullOrUndefined
PURPOSE:  test if var undefined or null
PARAMS:   arg  value
RETURN:    vaorig vaalue or null
*/
module.exports = (arg, dec = 2) => {
  return arg == null || arg == undefined || isNaN(arg) ? null : arg.toFixed(dec);
};
