const express = require('express')
const accountControllers = require('../controllers/account');
const routers = express.Router();


routers.get('/login', accountControllers.getLogin);
routers.post('/login', accountControllers.postLogin);

routers.get('/register', accountControllers.getRegister);
routers.post('/register', accountControllers.postRegister);

routers.get('/reset-password', accountControllers.getResetPassword);
routers.post('/reset-password', accountControllers.postResetPassword);

routers.get('/reset-password/:token', accountControllers.getNewPassword);
routers.post('/new-password', accountControllers.postNewPassword);

routers.get('/logout', accountControllers.getLogout);

module.exports = routers;