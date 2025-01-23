const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();


// Test Get Many Users //
router.get("/api/users", async(req, res) => {
  try {
    // This action queries the database similar to SQLAlchemy, { take: 10 } is simly  limited to 10 records  //
    const users = await prisma.user.findMany({ take: 10 });

    return res.status(200).json({ message: "Ok", users });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Test Create One User //
router.post('/api/users', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {

    // This actions creates a User in the database, similar to SQLAlchemy
    const user = await prisma.user.create({
      data: { email, password },
    });
    return res.status(201).json(user);

  } catch (error) {
    res.status(500).json({ error: 'Failed to create a user' });
  }
});

module.exports = router;