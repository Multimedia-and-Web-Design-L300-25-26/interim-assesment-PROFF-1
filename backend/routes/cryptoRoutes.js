/*
 * Crypto routes for market listings and protected crypto creation.
 * Static routes are declared before the authenticated POST route.
 */
const express = require('express');
const { getCryptos, getGainers, getNewCryptos, createCrypto } = require('../controllers/cryptoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/gainers', getGainers);
router.get('/new', getNewCryptos);
router.get('/', getCryptos);
router.post('/', authMiddleware, createCrypto);

module.exports = router;