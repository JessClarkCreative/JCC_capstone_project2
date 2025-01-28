// backend/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Assuming you're using JWT for authentication
const { PrismaClient } = require('@prisma/client');

const router = express.Router(); // Initialize the router here
const prisma = new PrismaClient();

router.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return userId and token to the frontend
    res.status(200).json({
      token,
      userId: user.id,  // Add userId here
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router; // Export the router to be used in server.js
