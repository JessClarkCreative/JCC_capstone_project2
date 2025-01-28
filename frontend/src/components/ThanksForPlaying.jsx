// src/components/ThanksForPlaying.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThanksForPlaying = () => {
  const navigate = useNavigate();

  const handlePlayAgain = () => {
    navigate('/game');  // Navigate back to the trivia game page
  };

  return (
    <div className="thanks-container">
      <h2>Thanks for Playing!</h2>
      <p>We hope you had fun! Your score has been saved.</p>
      <button className="play-again-button" onClick={handlePlayAgain}>
        Play Again?
      </button>
    </div>
  );
};

export default ThanksForPlaying;
