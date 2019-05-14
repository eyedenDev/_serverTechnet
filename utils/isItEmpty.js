/*
FUNCTION: isEmpty
PURPOSE:  test if object is empty
PARAMS:   object
RETURN:
*/
module.exports = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};
