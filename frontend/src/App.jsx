import React, { useState, useEffect } from 'react';
import { Container, Header, Segment, Modal } from 'semantic-ui-react';
import Navigation from '../src/components/Navigation';
import Login from '../src/components/Login';
import Signup from '../src/components/Signup';
import TriviaGame from '../src/components/TriviaGame';
import Leaderboard from '../src/components/Leaderboard';
import 'semantic-ui-css/semantic.min.css';

/**
 * Main App component that handles the overall layout and authentication state
 * Strategy: Using a single-page architecture with modals for authentication
 * to provide a seamless user experience without page reloads
 */
const App = () => {
  // Authentication state management
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);
  }, []);

  // Authentication modal handlers
  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleSignupClick = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowLogin(false);
    setShowSignup(false);
  };

  // Styling objects for consistent design
  const pageStyle = {
    background: 'linear-gradient(135deg, #FF6B6B, #9B5DE5, #37B6FF)',
    minHeight: '100vh',
    paddingBottom: '2rem',
    paddingTop: '70px' // Accounts for fixed navbar
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '20px',
    marginBottom: '20px'
  };

  return (
    <div style={pageStyle}>
      <Navigation 
        isLoggedIn={isLoggedIn}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onLogout={handleLogout}
      />
      
      <Container style={{ paddingTop: '2rem', maxWidth: '1200px' }}>
        {/* Welcome Header Section */}
        <Segment textAlign="center" style={cardStyle}>
          <Header as="h1" style={{ fontSize: '2.5em', color: '#2C3E50', margin: '0.5em 0' }}>
            Welcome to Trivia!
            <Header.Subheader>
              Test your knowledge and compete with others!
            </Header.Subheader>
          </Header>
        </Segment>

        {/* Authentication Modals */}
        <Modal
          size="tiny"
          open={showLogin && !isLoggedIn}
          onClose={() => setShowLogin(false)}
        >
          <Modal.Header>Login to Your Account</Modal.Header>
          <Modal.Content>
            <Login onSuccess={() => {
              setShowLogin(false);
              setIsLoggedIn(true);
            }} />
          </Modal.Content>
        </Modal>

        <Modal
          size="tiny"
          open={showSignup && !isLoggedIn}
          onClose={() => setShowSignup(false)}
        >
          <Modal.Header>Create an Account</Modal.Header>
          <Modal.Content>
            <Signup onSuccess={() => {
              setShowSignup(false);
              handleLoginClick();
            }} />
          </Modal.Content>
        </Modal>

        {/* Main Content Layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Global Leaderboard */}
          <div style={cardStyle}>
            <Header as="h2" textAlign="center">Global Rankings</Header>
            <Leaderboard showGlobalOnly={true} />
          </div>

          {/* Game Section */}
          <div style={cardStyle}>
            <Header as="h2" textAlign="center">Play Trivia</Header>
            <TriviaGame />
          </div>

          {/* Personal Score History - Only shown when logged in */}
          {isLoggedIn && (
            <div style={cardStyle}>
              <Header as="h2" textAlign="center">Your Score History</Header>
              <Leaderboard showPersonalOnly={true} />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default App;