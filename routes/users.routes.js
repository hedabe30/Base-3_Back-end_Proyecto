const { Router } = require('express');
const { check } = require('express-validator');

const {
  validateFields,
  validateJWT,
  sadminRole,
  validateRole
} = require('../middlewares');

const { roleIsValid, mailVerification, idMongoVerification } = require('../utils/db-validators');

const usersController = require('../controllers/users.controller');

const router = Router();

router.get('/', usersController.getUsers)
router.get('/:id', usersController.getUser)
router.put('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(idMongoVerification),
  validateFields
],
usersController.putUser)
router.post('/', [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password debe ser más de 6 caracteres').isLength({ min:6 }),
  check('email', 'El correo no es valido').isEmail(),
  check('email').custom(mailVerification),
  check('role').custom(roleIsValid),
  // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  validateFields
], usersController.createUser)
router.delete('/:id', [
  validateJWT,
  // sadminRole,
  validateRole('SADMIN_ROLE', 'ADMIN_ROLE'),
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(idMongoVerification),
  validateFields
],usersController.deleteUser)

module.exports = router;