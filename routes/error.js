const express = require('express');
const path  = require('path');
const router = express.Router();
const errorController = require('../controllers/errorController');


router.use('/500', errorController.get500Page)
router.use('/', errorController.get404Page)

module.exports = router;