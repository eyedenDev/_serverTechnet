/*
FUNCTION: removeSpacesCapIt
PURPOSE:  remove empty spaces and cap it
PARAMS:   string
RETURN: string
*/
module.exports = sourceString => {
  sourceString = sourceString.replace(/ /g, "");
  return sourceString.toUpperCase();
};
