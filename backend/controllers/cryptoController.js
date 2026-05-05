/*
 * Crypto controller for listing, filtering, and creating crypto assets.
 * The frontend uses these endpoints to render the home, explore, and detail pages.
 * Works with both MongoDB and file-backed storage.
 */
const Crypto = require('../models/Crypto');
const storageAdapter = require('../storage/storageAdapter');

async function getCryptos(req, res) {
  try {
    const cryptos = await storageAdapter.find(Crypto, {});
    const sorted = cryptos.sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0));
    return res.status(200).json({ message: 'Cryptos loaded successfully', cryptos: sorted });
  } catch (error) {
    return res.status(500).json({ message: `Unable to load cryptos: ${error.message}` });
  }
}

async function getGainers(req, res) {
  try {
    const cryptos = await storageAdapter.find(Crypto, {});
    const gainers = cryptos
      .filter((c) => c.change24h > 0)
      .sort((a, b) => (b.change24h || 0) - (a.change24h || 0))
      .slice(0, 10);
    return res.status(200).json({ message: 'Top gainers loaded successfully', cryptos: gainers });
  } catch (error) {
    return res.status(500).json({ message: `Unable to load gainers: ${error.message}` });
  }
}

async function getNewCryptos(req, res) {
  try {
    const cryptos = await storageAdapter.find(Crypto, {});
    const sorted = cryptos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
    return res.status(200).json({ message: 'New listings loaded successfully', cryptos: sorted });
  } catch (error) {
    return res.status(500).json({ message: `Unable to load new listings: ${error.message}` });
  }
}

async function createCrypto(req, res) {
  try {
    const { name, symbol, logo, price, change24h, marketCap, rank, description } = req.body;

    if (!name || !symbol || price === undefined || change24h === undefined || marketCap === undefined) {
      return res.status(400).json({ message: 'Name, symbol, price, change24h, and marketCap are required' });
    }

    const existingCrypto = await storageAdapter.findOne(Crypto, { symbol: symbol.toUpperCase() });

    if (existingCrypto) {
      return res.status(400).json({ message: 'A crypto with this symbol already exists' });
    }

    const crypto = await storageAdapter.create(Crypto, {
      name,
      symbol,
      logo,
      price,
      change24h,
      marketCap,
      rank,
      description,
    });

    return res.status(201).json({
      message: 'Crypto created successfully',
      crypto,
    });
  } catch (error) {
    return res.status(500).json({ message: `Unable to create crypto: ${error.message}` });
  }
}

module.exports = {
  getCryptos,
  getGainers,
  getNewCryptos,
  createCrypto,
};