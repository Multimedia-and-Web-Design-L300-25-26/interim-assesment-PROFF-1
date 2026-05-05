/*
 * Authentication routes for registration, login, logout, and profile access.
 * The profile endpoint is protected by the JWT cookie middleware.
 */
const express = require('express');
const { register, login, logout, profile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authMiddleware, profile);

module.exports = router;