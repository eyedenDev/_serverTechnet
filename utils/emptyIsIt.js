/*
FUNCTION: nullOrUndefined
PURPOSE:  test if var undefined or null
PARAMS:   arg  value
RETURN:    vaorig vaalue or null
*/
module.exports = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};
