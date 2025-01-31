const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Update score route - now creates a new score entry
router.post('/api/score', async (req, res) => {
  const { userId, score } = req.body;
  console.log('Backend received:', { userId, score });

  if (!userId || score === undefined) {
    console.log('Missing userId or score in backend');
    return res.status(400).json({ error: 'User ID and score are required' });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({ 
      where: { id: parseInt(userId) } 
    });
    
    if (!user) {
      console.log(`User with ID ${userId} not found`);
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new score entry
    const newScore = await prisma.score.create({
      data: {
        score: score,
        userId: parseInt(userId)
      }
    });

    console.log('Score saved successfully:', newScore);
    return res.status(200).json(newScore);
  } catch (error) {
    console.error('Error saving score:', error);
    return res.status(500).json({ error: 'Failed to update score' });
  }
});

// Get user's score history
router.get('/api/scores/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const scores = await prisma.score.findMany({
      where: { 
        userId: parseInt(userId) 
      },
      orderBy: { 
        createdAt: 'desc' 
      },
      take: 10  // Get last 10 scores
    });
    
    return res.status(200).json(scores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    return res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

module.exports = router;