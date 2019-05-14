/*
  FUNCTION: parsCanaries
  PURPOSE:  ensure canaries aarray only contains ints
  PARAMS:   arr  array && rtnActual boolean
  RETURN:    array of ints
  */
const parseCanaries = canaries => {
  let returnCanaries = [];
  canaries.forEach(canary => {
    returnCanaries.push(parseInt(canary));
  });
  return returnCanaries;
};
module.exports.parseCanaries = parseCanaries;
