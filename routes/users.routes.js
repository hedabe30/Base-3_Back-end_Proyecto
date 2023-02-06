const { Router } = require('express');
const usersController = require('../controllers/users.controller');

const router = Router();

router.get('/', usersController.getUsers)
router.get('/:id', usersController.getUser)
router.put('/:id', usersController.putUser)
router.post('/', usersController.createUser)
router.delete('/', usersController.deleteUser)

module.exports = router;