const express = require('express');
const router = express.Router();
const dersController = require('../controllers/dersController');

router.post('/assign', dersController.assignDers);

module.exports = router;
