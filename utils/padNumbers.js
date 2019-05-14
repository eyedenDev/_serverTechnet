/*
FUNCTION: nullOrUndefined
PURPOSE:  test if var undefined or null
PARAMS:   arg  value
RETURN:    vaorig vaalue or null
*/
module.exports = (num, size) => {
  let s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
};
