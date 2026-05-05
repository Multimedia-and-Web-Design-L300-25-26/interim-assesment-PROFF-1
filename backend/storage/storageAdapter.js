/*
 * Database abstraction layer that works with both MongoDB and file-backed storage.
 * Provides unified interface for CRUD operations regardless of storage backend.
 */
const mongoose = require('mongoose');
const localDb = require('../storage/localDb');

class StorageAdapter {
  constructor() {
    this.mode = process.env.DB_MODE || 'file';
  }

  async findOne(model, filter) {
    const mode = process.env.DB_MODE || this.mode || 'file';
    if (mode === 'mongo') {
      return await model.findOne(filter);
    }

    if (model.modelName === 'User') {
      const user = await localDb.findUserByEmail(filter.email);
      return user || null;
    }

    if (model.modelName === 'Crypto') {
      const cryptos = await localDb.listCryptos();
      return cryptos.find((c) => c.symbol === filter.symbol?.toUpperCase()) || null;
    }

    return null;
  }

  async find(model, filter = {}) {
    const mode = process.env.DB_MODE || this.mode || 'file';
    if (mode === 'mongo') {
      return await model.find(filter);
    }

    if (model.modelName === 'Crypto') {
      return await localDb.listCryptos();
    }

    if (model.modelName === 'User') {
      const state = await localDb.readState();
      return state.users;
    }

    return [];
  }

  async create(model, data) {
    const mode = process.env.DB_MODE || this.mode || 'file';
    if (mode === 'mongo') {
      return await model.create(data);
    }

    if (model.modelName === 'Crypto') {
      return await localDb.addCrypto(data);
    }

    if (model.modelName === 'User') {
      return await localDb.addUser(data);
    }

    return null;
  }

  async deleteMany(model, filter = {}) {
    const mode = process.env.DB_MODE || this.mode || 'file';
    if (mode === 'mongo') {
      return await model.deleteMany(filter);
    }

    if (model.modelName === 'Crypto') {
      const state = await localDb.resetState({ cryptos: [], users: (await localDb.readState()).users });
      return { deletedCount: state.cryptos.length };
    }

    return { deletedCount: 0 };
  }

  async insertMany(model, data) {
    const mode = process.env.DB_MODE || this.mode || 'file';
    if (mode === 'mongo') {
      return await model.insertMany(data);
    }

    if (model.modelName === 'Crypto') {
      const results = [];
      for (const item of data) {
        const result = await localDb.addCrypto(item);
        results.push(result);
      }
      return results;
    }

    return [];
  }
}

module.exports = new StorageAdapter();
