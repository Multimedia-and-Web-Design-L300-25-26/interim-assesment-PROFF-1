/*
 * File-backed data store used when MongoDB is unavailable.
 * Keeps seeded users and cryptos on disk so the backend can still run in this workspace.
 */
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const storePath = path.join(__dirname, 'data.json');

const defaultState = {
  users: [],
  cryptos: [],
};

async function ensureStore() {
  try {
    await fs.access(storePath);
  } catch {
    await fs.mkdir(path.dirname(storePath), { recursive: true });
    await fs.writeFile(storePath, JSON.stringify(defaultState, null, 2), 'utf8');
  }
}

async function readState() {
  await ensureStore();
  const fileContents = await fs.readFile(storePath, 'utf8');
  return JSON.parse(fileContents);
}

async function writeState(state) {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(state, null, 2), 'utf8');
}

async function resetState(nextState) {
  const state = {
    users: nextState.users ?? [],
    cryptos: nextState.cryptos ?? [],
  };

  await writeState(state);
  return state;
}

async function findUserByEmail(email) {
  const state = await readState();
  return state.users.find((user) => user.email === email.toLowerCase()) ?? null;
}

async function findUserById(userId) {
  const state = await readState();
  return state.users.find((user) => user._id === userId) ?? null;
}

async function addUser(user) {
  const state = await readState();
  const now = new Date().toISOString();
  const storedUser = {
    _id: crypto.randomUUID(),
    name: user.name,
    email: user.email.toLowerCase(),
    password: user.password,
    createdAt: now,
    updatedAt: now,
  };

  state.users.push(storedUser);
  await writeState(state);
  return storedUser;
}

async function listCryptos() {
  const state = await readState();
  return state.cryptos;
}

async function addCrypto(cryptoItem) {
  const state = await readState();
  const now = new Date().toISOString();
  const storedCrypto = {
    _id: crypto.randomUUID(),
    name: cryptoItem.name,
    symbol: cryptoItem.symbol.toUpperCase(),
    logo: cryptoItem.logo || '',
    price: cryptoItem.price,
    change24h: cryptoItem.change24h,
    marketCap: cryptoItem.marketCap,
    rank: cryptoItem.rank ?? 0,
    description: cryptoItem.description || '',
    createdAt: now,
    updatedAt: now,
  };

  state.cryptos.push(storedCrypto);
  await writeState(state);
  return storedCrypto;
}

module.exports = {
  readState,
  writeState,
  resetState,
  findUserByEmail,
  findUserById,
  addUser,
  listCryptos,
  addCrypto,
};
