import React, { useState, useEffect } from 'react';
import { Table, Loader } from 'semantic-ui-react';

/**
 * Leaderboard Component
 * 
 * Displays either global rankings or personal score history based on props.
 * Uses conditional rendering to switch between display modes.
 * 
 * @param {boolean} showGlobalOnly - Shows only global leaderboard when true
 * @param {boolean} showPersonalOnly - Shows only personal scores when true
 */
const Leaderboard = ({ showGlobalOnly, showPersonalOnly }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [personalScores, setPersonalScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Fetch appropriate data based on display mode
    if (!showPersonalOnly) {
      fetchLeaderboard();
    }
    if (userId && !showGlobalOnly) {
      fetchPersonalScores();
    }
    setLoading(false);
  }, [showGlobalOnly, showPersonalOnly]);

  /**
   * Fetches global rankings from the server
   */
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/leaderboard');
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    }
  };

  /**
   * Fetches personal score history for logged-in user
   */
  const fetchPersonalScores = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/scores/${userId}`);
      const data = await response.json();
      setPersonalScores(data);
    } catch (error) {
      console.error('Failed to fetch personal scores:', error);
    }
  };

  /**
   * Formats database timestamp into readable date string
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) return <Loader active>Loading...</Loader>;

  return (
    <div>
      {/* Global Leaderboard Display */}
      {!showPersonalOnly && (
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Rank</Table.HeaderCell>
              <Table.HeaderCell>Player</Table.HeaderCell>
              <Table.HeaderCell>Score</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {leaderboard.map((user, index) => (
              <Table.Row key={user.id}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.score}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {/* Personal Score History Display */}
      {!showGlobalOnly && userId && (
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Score</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {personalScores.map((score, index) => (
              <Table.Row key={index}>
                <Table.Cell>{formatDate(score.createdAt)}</Table.Cell>
                <Table.Cell>{score.score}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export default Leaderboard;