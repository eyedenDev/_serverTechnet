const Validator = require('validator'),
  isEmpty = require('./is-empty');

module.exports = function validatePasswordResetInput(data) {
  let errors = {};

  data.password = !isEmpty(data.password) ? data.password : '';
  data.new_password = !isEmpty(data.new_password) ? data.new_password : '';
  data.conf_password = !isEmpty(data.conf_password) ? data.conf_password : '';

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Old Password is required';
  }

  if (Validator.isEmpty(data.new_password)) {
    errors.new_password = 'New Password is required';
  }

  if (Validator.isEmpty(data.conf_password)) {
    errors.conf_password = 'Confirmtion Password is required';
  }

  if (data.new_password !== data.conf_password) {
    errors.new_password = 'New password & confirmation passwords don\'t match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
