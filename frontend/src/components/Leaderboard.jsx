import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const response = await axios.get('http://localhost:5000/api/leaderboard');
      setLeaderboard(response.data);
    };
    fetchLeaderboard();
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {leaderboard.map((user, index) => (
          <li key={index}>{user.email}: {user.score}</li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
