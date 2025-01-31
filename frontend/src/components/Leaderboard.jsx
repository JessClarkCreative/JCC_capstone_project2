import React, { useState, useEffect } from 'react';
import { Table, Loader, Message } from 'semantic-ui-react';

const Leaderboard = ({ showGlobalOnly, showPersonalOnly }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [personalScores, setPersonalScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch global leaderboard if not showing personal only
        if (!showPersonalOnly) {
          const leaderboardResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/leaderboard`);
          if (!leaderboardResponse.ok) {
            throw new Error('Failed to fetch leaderboard');
          }
          const leaderboardData = await leaderboardResponse.json();
          
          // Ensure leaderboardData is an array
          setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
        }

        // Fetch personal scores if user is logged in and not showing global only
        if (userId && !showGlobalOnly) {
          const scoresResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/scores/${userId}`);
          if (!scoresResponse.ok) {
            throw new Error('Failed to fetch personal scores');
          }
          const scoresData = await scoresResponse.json();
          
          // Ensure scoresData is an array
          setPersonalScores(Array.isArray(scoresData) ? scoresData : []);
        }
      } catch (err) {
        console.error('Leaderboard fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showGlobalOnly, showPersonalOnly, userId]);

  if (loading) return <Loader active>Loading...</Loader>;

  if (error) return (
    <Message negative>
      <Message.Header>Error</Message.Header>
      <p>{error}</p>
    </Message>
  );

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
            {(leaderboard || []).map((user, index) => (
              <Table.Row key={user.id || index}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{user.username || 'Unknown'}</Table.Cell>
                <Table.Cell>{user.score || 0}</Table.Cell>
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
            {(personalScores || []).map((score, index) => (
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

  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
};

export default Leaderboard;