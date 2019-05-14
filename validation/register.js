const Validator = require('validator'),
  isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
  data.last_name = !isEmpty(data.last_name) ? data.last_name : '';
  data.username = !isEmpty(data.username) ? data.username : '';

  if (Validator.isEmpty(data.first_name)) {
    errors.first_name = 'First name is required';
  }

  if (Validator.isEmpty(data.last_name)) {
    errors.last_name = 'Last ame field is required';
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = 'Email  is required';
  }

  if (!Validator.isEmail(data.username)) {
    errors.username = 'Email is invalid';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
