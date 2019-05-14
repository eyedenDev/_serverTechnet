'use strict';
/*
FUNC::    isEmpty
PURPOSE:: test if obj is empty
PARAMS::   object
RETURN::  boolean
*/
// function isEmpty(obj) {
//   for (var key in obj) {
//     if (obj.hasOwnProperty(key)) return false;
//   }
//   return true;
// }
function isObjEmpty(obj) {
  return !Object.keys(obj).length > 0;
}
module.exports = isObjEmpty;

/*
FUNC::    jsUcFirst
PURPOSE:: change first letter of string to uppercase
PARAMS::  string
RETURN::  string
*/
function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
module.exports = jsUcfirst;

/*
FUNC::    showUsers
PURPOSE::  test if user hasd permissions to view sections of dashboard
PARAMS::  acc_type  String
RETURN::  boolesn
*/
function showUsers(acc_type) {
  const showIt = acc_type == 'designer' || acc_type == 'admin' ? true : false;
  return showIt;
}
module.exports = showUsers;

/*
FUNC::    prepFileName
PURPOSE::  prepare file names for db insertion
PARAMS::  custName && custId && imgType && imgType :: strings
RETURN::  string
*/
function prepFileName(custName, custId, imgType, fileExt) {
  let prcsNameItems = custName.split(' '),
    returnArray = [];

  prcsNameItems.forEach(item => {
    returnArray.push(this.jsUcfirst(item));
  });
  // return returnArray.join('') + '_' + imgType + '.' + fileExt;
  return imgType + '_' + custId + '_' + returnArray.join('') + '.' + fileExt;
}
module.exports = prepFileName;
