const { Router } = require('express');
const { check } = require('express-validator');

const uploadsController = require('../controllers/uploads.controller');

const { validateFields, validateUploadedFile } = require('../middlewares');
const { collectionsAllowed } = require('../utils');

const router = Router();

router.post('/', validateUploadedFile, uploadsController.uploadFiles);

router.put('/:collection/:id', [
  validateUploadedFile,
  check('id', 'El id debe ser de Mongo').isMongoId(),
  check('collection').custom( c => collectionsAllowed(c, ['users', 'products'])),
  validateFields
], uploadsController.updateImage);

router.get('/:collection/:id', [
  check('id', 'El id debe ser de Mongo').isMongoId(),
  check('collection').custom( c => collectionsAllowed(c, ['users', 'products'])),
  validateFields
], uploadsController.showImage);

module.exports = router;