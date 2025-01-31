const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

router.get('/api/leaderboard', async (req, res) => {
  try {
    // Get the highest score for each user
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        username: true,  // Make sure we're selecting username
        scores: {
          orderBy: {
            score: 'desc'
          },
          take: 1
        }
      },
      // Only include users who have scores
      where: {
        scores: {
          some: {}
        }
      }
    });

    // Format the response
    const formattedLeaderboard = leaderboard
      .map(user => ({
        id: user.id,
        username: user.username,  // Include username in the response
        score: user.scores[0]?.score || 0
      }))
      .sort((a, b) => b.score - a.score) // Sort by score in descending order
      .slice(0, 10); // Get top 10 scores

    return res.status(200).json(formattedLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;