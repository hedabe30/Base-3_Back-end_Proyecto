const { Router } = require('express');
const { check } = require('express-validator');
const Role = require('../database/models/role');

const usersController = require('../controllers/users.controller');
const { validateFields } = require('../middlewares/validateFields');

const router = Router();

router.get('/', usersController.getUsers)
router.get('/:id', usersController.getUser)
router.put('/:id', usersController.putUser)
router.post('/', [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password debe ser más de 6 caracteres').isLength({ min:6 }),
  check('email', 'El correo no es valido').isEmail(),
  // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('role').custom( async (role = '') => {
    const roleExist = await Role.findOne({ role });
    if (!roleExist) {
      throw new Error(`El ${role} no esta registrado en base de datos`);
    }
  }),
  validateFields
], usersController.createUser)
router.delete('/', usersController.deleteUser)

module.exports = router;