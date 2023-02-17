const validateFields = require('./validateFields');
const validateJWT = require('./validate-jwt');
const validateRole = require('./validate-roles');

module.exports = {
  ...validateFields,
  ...validateJWT,
  ...validateRole,
}