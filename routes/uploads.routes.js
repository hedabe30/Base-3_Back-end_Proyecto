const { Router } = require('express');
const { check } = require('express-validator');

const uploadsController = require('../controllers/uploads.controller');

const { validateFields } = require('../middlewares/validateFields');

const router = Router();

router.post('/', uploadsController.uploadFiles);

module.exports = router;