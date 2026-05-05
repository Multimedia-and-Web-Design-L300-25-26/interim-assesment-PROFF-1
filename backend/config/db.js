/*
 * Database connection helper for MongoDB.
 * Falls back to the local file-backed store when MongoDB is unavailable.
 */
const mongoose = require('mongoose');

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.log('⚠️ MONGO_URI not provided. Using file-backed storage.');
    process.env.DB_MODE = 'file';
    return null;
  }

  try {
    console.log('🔗 Attempting to connect to MongoDB...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 3000,
    });
    console.log('✅ MongoDB connected successfully');
    process.env.DB_MODE = 'mongo';
    return mongoose.connection;
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed. Falling back to file-backed storage.');
    console.warn(`   Error: ${error.message}`);
    process.env.DB_MODE = 'file';
    return null;
  }
}

module.exports = connectDB;