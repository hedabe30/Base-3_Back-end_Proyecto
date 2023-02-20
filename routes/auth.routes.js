const { Router } = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/auht.controller');
const { validateFields } = require('../middlewares/validateFields');

const router = Router();

router.post('/login', [
  check('email', 'el correo es obligatorio').isEmail(),
  check('password', 'la contraseña es obligatorio').not().isEmpty(),
  validateFields
], authController.login)

router.post('/google', [
  check('id_token', 'id_token de google es necesario').not().isEmpty(),
  validateFields
], authController.googleSignIn)

module.exports = router;