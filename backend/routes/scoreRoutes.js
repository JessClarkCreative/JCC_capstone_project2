// backend/routes/scoreRoutes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Update score route
router.post('/api/score', async (req, res) => {
  const { userId, score } = req.body;

  // Check if userId and score are provided
  if (!userId || score === undefined) {
    return res.status(400).json({ error: 'User ID and score are required' });
  }

  try {
    // Find the user by ID
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's score (assuming you have a 'score' field in your 'user' model)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { score },
    });

    // Respond with the updated user data
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update score' });
  }
});

module.exports = router;
