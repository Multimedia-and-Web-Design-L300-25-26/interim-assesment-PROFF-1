/*
 * Authentication controller for registration, login, logout, and profile data.
 * All responses include a message field to keep the API consistent for the frontend.
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };
}

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function sendAuthCookie(res, token) {
  res.cookie('token', token, getCookieOptions());
}

function sanitizeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const user = await User.create({ name, email, password });
    const safeUser = sanitizeUser(user);
    const token = createToken(user._id);
    sendAuthCookie(res, token);

    return res.status(201).json({
      message: 'User registered successfully',
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({ message: `Registration failed: ${error.message}` });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = await user.comparePassword(password);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = createToken(user._id);
    sendAuthCookie(res, token);

    return res.status(200).json({
      message: 'Login successful',
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: `Login failed: ${error.message}` });
  }
}

async function logout(req, res) {
  try {
    res.clearCookie('token', getCookieOptions());
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    return res.status(500).json({ message: `Logout failed: ${error.message}` });
  }
}

async function profile(req, res) {
  try {
    return res.status(200).json({
      message: 'Profile loaded successfully',
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ message: `Unable to load profile: ${error.message}` });
  }
}

module.exports = {
  register,
  login,
  logout,
  profile,
};