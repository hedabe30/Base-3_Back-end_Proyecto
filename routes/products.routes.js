const { Router } = require('express');
const { check } = require('express-validator');

const productsController = require('../controllers/products.controller');
const { productExist, categoryExist } = require('../utils/db-validators');

const { validateJWT, validateFields, sadminRole } = require('../middlewares');

const router = Router();

//Obtener todos los productos - publico
router.get('/', productsController.getProducts)

//Obtener producto por id - publico
router.get('/:id', [
  check('id', 'No es un id de Mongo valido').isMongoId(),
  check('id').custom(productExist),
  validateFields
], productsController.getProduct)

//Crear producto - privado - cualquier rol
router.post('/', [
  validateJWT,
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('category', 'No es un id de Mongo').isMongoId(),
  check('category').custom(categoryExist),
  validateFields
], productsController.createProduct)

//Actualizar producto por id - privado - cualquier rol
router.put('/:id', [
  validateJWT,
  check('id', 'No es un id de Mongo valido').isMongoId(),
  check('id').custom(productExist),
  validateFields
],productsController.updateProduct)

//Borrar una producto - admin
router.delete('/:id', [
  validateJWT,
  sadminRole,
  check('id', 'No es un id de Mongo valido').isMongoId(),
  check('id').custom(productExist),
  validateFields
],productsController.deleteProduct)

module.exports = router;