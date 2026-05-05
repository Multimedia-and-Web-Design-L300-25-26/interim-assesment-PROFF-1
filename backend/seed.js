/*
 * Seed script that populates the Crypto collection with starter market data.
 * Run this after the database is configured so the frontend has data to render.
 */
require('dotenv').config();
const connectDB = require('./config/db');
const Crypto = require('./models/Crypto');
const storageAdapter = require('./storage/storageAdapter');

const seedCryptos = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: 'https://assets.coinbase.com/assets/bitcoin.svg',
    price: 893552.24,
    change24h: 1.47,
    marketCap: 1770000000000,
    rank: 1,
    description: 'Bitcoin is the first and largest cryptocurrency by market cap.',
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'https://assets.coinbase.com/assets/ethereum.svg',
    price: 26262.16,
    change24h: 0.89,
    marketCap: 300000000000,
    rank: 2,
    description: 'Ethereum is a programmable blockchain for decentralized applications.',
  },
  {
    name: 'Tether',
    symbol: 'USDT',
    logo: 'https://assets.coinbase.com/assets/usdt.svg',
    price: 11.19,
    change24h: 0.01,
    marketCap: 150000000000,
    rank: 3,
    description: 'Tether is a dollar-pegged stablecoin used for trading and settlement.',
  },
  {
    name: 'XRP',
    symbol: 'XRP',
    logo: 'https://assets.coinbase.com/assets/xrp.svg',
    price: 15.58,
    change24h: 0.1,
    marketCap: 90000000000,
    rank: 4,
    description: 'XRP is designed for fast, low-cost cross-border value transfer.',
  },
  {
    name: 'BNB',
    symbol: 'BNB',
    logo: 'https://assets.coinbase.com/assets/bnb.svg',
    price: 6974.17,
    change24h: 0.88,
    marketCap: 85000000000,
    rank: 5,
    description: 'BNB powers activity across the BNB Chain ecosystem.',
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    logo: 'https://assets.coinbase.com/assets/solana.svg',
    price: 941.33,
    change24h: 0.11,
    marketCap: 70000000000,
    rank: 6,
    description: 'Solana is a high-throughput blockchain optimized for speed.',
  },
  {
    name: 'Dogecoin',
    symbol: 'DOGE',
    logo: 'https://assets.coinbase.com/assets/dogecoin.svg',
    price: 1.23,
    change24h: 1.6,
    marketCap: 20000000000,
    rank: 7,
    description: 'Dogecoin is a widely traded community-driven cryptocurrency.',
  },
  {
    name: 'Hyperliquid',
    symbol: 'HYPE',
    logo: 'https://assets.coinbase.com/assets/hyperliquid.svg',
    price: 468.12,
    change24h: 0.78,
    marketCap: 13000000000,
    rank: 8,
    description: 'Hyperliquid is a newer market asset with strong trading interest.',
  },
  {
    name: 'Virtuals Protocol',
    symbol: 'VIRTUAL',
    logo: 'https://assets.coinbase.com/assets/virtuals.svg',
    price: 85.3,
    change24h: 3.15,
    marketCap: 3200000000,
    rank: 9,
    description: 'Virtuals Protocol is a newer listing with strong momentum.',
  },
  {
    name: 'edgeX',
    symbol: 'EDGEX',
    logo: 'https://assets.coinbase.com/assets/edgex.svg',
    price: 12.8,
    change24h: -0.54,
    marketCap: 1800000000,
    rank: 10,
    description: 'edgeX is a recent listing with active market interest.',
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting seed process...');
    await connectDB();

    console.log('🗑️  Clearing existing cryptos...');
    await storageAdapter.deleteMany(Crypto, {});

    console.log('📝 Inserting seed cryptos...');
    await storageAdapter.insertMany(Crypto, seedCryptos);

    console.log('✅ Crypto seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();