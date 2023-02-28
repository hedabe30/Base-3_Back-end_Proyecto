const { Router } = require('express');
const searchController = require('../controllers/search.controller');

const router = Router();

router.get('/', searchController.search)

module.exports = router;