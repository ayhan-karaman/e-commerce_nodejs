const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-app', 'root', '<yourpassword>', {
    dialect:'mysql',
    host:'localhost'
})

module.exports = sequelize;