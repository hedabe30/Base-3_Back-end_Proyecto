const { Router } = require('express');
const { check } = require('express-validator');

const categoriesController = require('../controllers/categories.controller');
const { categoryExist } = require('../utils/db-validators');

const { validateJWT, validateFields, sadminRole } = require('../middlewares');

const router = Router();

//Obtener todas las categorias - publico
router.get('/', categoriesController.getCategories)

//Obtener categoria por id - publico
router.get('/:id', [
  check('id', 'No es un id de Mongo valido').isMongoId(),
  check('id').custom(categoryExist),
  validateFields
], categoriesController.getCategory)

//Crear categoria - privado - cualquier rol
router.post('/', [
  validateJWT,
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  validateFields
], categoriesController.createCategory)

//Actualizar categoria por id - privado - cualquier rol
router.put('/:id', [
  validateJWT,
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('id', 'No es un id de Mongo valido').isMongoId(),
  check('id').custom(categoryExist),
  validateFields
],categoriesController.updateCategory)

//Borrar una categoria - admin
router.delete('/:id', [
  validateJWT,
  sadminRole,
  check('id', 'No es un id de Mongo valido').isMongoId(),
  check('id').custom(categoryExist),
  validateFields
],categoriesController.deleteCategory)

module.exports = router;