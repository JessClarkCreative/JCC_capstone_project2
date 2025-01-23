// src/App.jsx
import { useState } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'; // If you're using Semantic UI for styling

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from './components/Login'; // Login component
import Signup from './components/Signup'; // Signup component
import TriviaGame from './components/TriviaGame'; // Trivia Game component
import Leaderboard from './components/Leaderboard'; // Leaderboard component

import { Grid } from 'semantic-ui-react';

function App() {
  const [menuState, setMenuState] = useState({ activeItem: "register" });

  const handleMenuClick = (activeItem) => {
    setMenuState({ activeItem });
  };

  return (
    <Router>
      <Grid>
        <Grid.Row centered>
          <h1>Welcome to the Trivia Game!</h1>
        </Grid.Row>

        {/* Set up routes for different components */}
        <Routes>
          <Route path="/" element={<Login />} /> {/* Login route */}
          <Route path="/signup" element={<Signup />} /> {/* Signup route */}
          <Route path="/game" element={<TriviaGame />} /> {/* Trivia Game route */}
          <Route path="/leaderboard" element={<Leaderboard />} /> {/* Leaderboard route */}
        </Routes>
      </Grid>
    </Router>
  );
}

export default App;
