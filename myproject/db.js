const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'build',{
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize;