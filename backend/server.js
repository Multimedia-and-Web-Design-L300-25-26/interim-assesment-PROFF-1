/*
 * Express server entrypoint for the Coinbase clone backend.
 * Configures CORS, cookies, JSON parsing, API routes, and MongoDB startup.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cryptoRoutes = require('./routes/cryptoRoutes');

const app = express();
const port = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Backend is healthy' });
});

app.use('/api', authRoutes);
app.use('/api/crypto', cryptoRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ message: error.message || 'Internal server error' });
});

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
