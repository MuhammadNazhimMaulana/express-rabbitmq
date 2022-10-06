const { Sequelize, DataTypes } = require('sequelize');

// Env
require('dotenv').config()

// Prepare Mysql Connection
const mysql = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,

    pool: {
        max: parseInt(process.env.MAX_POOL),
        min: parseInt(process.env.MIN_POOL),
        acquire: parseInt(process.env.ACQUIRE_POOL),
        idle: parseInt(process.env.IDLE_POOL)
    }
});

// Connection
mysql.authenticate().then(() => {
    console.log('Connected')
})
.catch(err => {
    console.log('gagal')
})

const db = {}

db.Sequelize = Sequelize;
db.mysql = mysql;

// Calling Schemas
db.users = require('../api/models/User')(mysql, DataTypes);

db.mysql.sync({ force: false })
.then(() => {
    console.log('Sinkronisasi');
})

// Exporting db to be used in controller
module.exports = db;
