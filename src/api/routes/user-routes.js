// Contoh Routing
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController')

const userController = new UserController()

// Index
router.get('/', userController.index);

// Show
router.get('/:id', userController.show);

// Create
router.post('/', userController.store_request);

// Update
router.put('/:id', userController.update);

// Delete
router.delete('/:id', userController.delete);

module.exports = router;