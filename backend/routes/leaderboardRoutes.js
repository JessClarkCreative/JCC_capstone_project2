router.get('/api/leaderboard', async (req, res) => {
    try {
      const leaderboard = await prisma.user.findMany({
        orderBy: { score: 'desc' }, // Ordering by score in descending order
        take: 10, // Limit to top 10 scores
      });
      return res.status(200).json(leaderboard);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  });
  