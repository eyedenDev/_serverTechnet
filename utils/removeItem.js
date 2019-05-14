/*
  FUNCTION: removeItem
  PURPOSE:  remove element from array
  PARAMS:   arr  array && rtnActual boolean
  RETURN:    array of ints
  */
module.exports = (arr, value) => {
  return arr.filter(function(ele) {
    return ele != value;
  });
};
