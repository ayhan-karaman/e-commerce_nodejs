const express  = require('express');
const router = express.Router();
const adminRoutes = require('./admin');
const shopRoutes = require('./shop')
const errorRoutes = require('./error')
const accountRoutes = require('./account');
const csrf = require('../middleware/csrf');
const isAdmin = require('../middleware/isAdmin');

router.use("/admin", csrf, isAdmin,  adminRoutes);
router.use("/", csrf, shopRoutes);
router.use('/account', csrf, accountRoutes);

router.use('/', errorRoutes);
module.exports = router;