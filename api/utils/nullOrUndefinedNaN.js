/*
FUNCTION: nullOrUndefined
PURPOSE:  test if var undefined or null
PARAMS:   arg  value
RETURN:    vaorig vaalue or null
*/
module.exports = arg => {
  return arg !== null || arg !== undefined ? arg : null;
};
