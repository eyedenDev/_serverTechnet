const crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  password = 'd6F3Efeq';

function encrypt(text) {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text) {
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

function getAction_URL(url, endAt) {
  const parameter_Start_index = url.indexOf(endAt),
    action_URL = url.substring(0, parameter_Start_index);
  return action_URL;
}
module.exports = getAction_URL;

function doesContain(needle, haystack) {
  var length = haystack.length;
  for (var i = 0; i < length; i++) {
    if (haystack[i] == needle) return true;
  }
  return false;
}
module.exports = doesContain;

function showTabs(tabAccent) {
  var states = {
    1: false,
    2: false,
    3: false,
    4: false
  };

  switch (tabAccent) {
  case 3:
    states[3] = true;
    break;
  case 4:
    states[4] = true;
    break;
  case 2:
    states[2] = true;
    break;
  default:
    states[1] = true;
  }
  // console.log('00000000');
  // console.log(states);
  return states;
}
module.exports = showTabs;

// function jsUcfirst(string)
// {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }
// module.exports = jsUcfirst;

function isAuthorized(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}
module.exports = isAuthorized;
