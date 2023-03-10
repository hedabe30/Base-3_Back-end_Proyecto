const validateFields = require('./validateFields');
const validateJWT = require('./validate-jwt');
const validateRole = require('./validate-roles');
const validateUploadedFile = require('./validate-file');

module.exports = {
  ...validateFields,
  ...validateJWT,
  ...validateRole,
  ...validateUploadedFile
}