// backend/routes/scoreRoutes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Update score route
router.post('/api/score', async (req, res) => {
  const { userId, score } = req.body;
  console.log('Backend received:', { userId, score });  // Log what was received by the backend

  if (!userId || score === undefined) {
    console.log('Missing userId or score in backend');  // Log if the backend didn't get the required fields
    return res.status(400).json({ error: 'User ID and score are required' });
  }

  try {
    // Check if the user exists in the database
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      console.log(`User with ID ${userId} not found`); // Log if the user was not found
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's score
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { score },
    });

    console.log('Score updated successfully:', updatedUser); // Log the updated user
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error saving score:', error);  // Log any error that occurs
    return res.status(500).json({ error: 'Failed to update score' });
  }
});

module.exports = router;
