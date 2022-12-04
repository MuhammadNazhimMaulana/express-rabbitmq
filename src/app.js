const express = require('express');
const http = require('http');

// Env
require('dotenv').config();

// Connection Database
require('./config/db');

// Connection Rabbitmq
require('./config/rabbitmq');

// Server and Express Config
const app = express();
const server = http.createServer(app)

// Setup Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Seperate Route
const user_route = require('./api/routes/user-routes');
app.use('/user', user_route);

// Port
const PORT = process.env.PORT;
server.listen(PORT, async () => {
    console.log(`Server Jalan di http://localhost:${PORT}`)
})