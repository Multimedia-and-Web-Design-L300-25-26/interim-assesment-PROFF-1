/*
 * Crypto model for market listings used by the frontend crypto tables.
 * Stores the pricing and ranking fields required by the Coinbase clone UI.
 */
const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Crypto name is required'],
      trim: true,
    },
    symbol: {
      type: String,
      required: [true, 'Crypto symbol is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    logo: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    change24h: {
      type: Number,
      required: [true, '24h change is required'],
    },
    marketCap: {
      type: Number,
      required: [true, 'Market cap is required'],
      min: 0,
    },
    rank: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Crypto', cryptoSchema);