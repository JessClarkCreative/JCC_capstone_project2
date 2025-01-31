const express = require("express");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

router.post('/api/users', async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, password, and username are required' });
  }

  try {
    // Check if username is already taken
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUsername) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const salt = 10;
    const passHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { 
        email, 
        password: passHash,
        username
      },
    });
    
    return res.status(201).json({ 
      id: user.id,
      email: user.email,
      username: user.username
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Failed to create a user' });
  }
});
module.exports = router;