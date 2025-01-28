import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import he from 'he';

const TriviaGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('userId');  // Retrieve userId from localStorage
  const navigate = useNavigate();  // Used for redirection

  const handleFetchQuestions = () => {
    setLoading(true);
    setError(null);

    setTimeout(async () => {
      try {
        const response = await axios.get('https://opentdb.com/api.php?amount=10');
        setQuestions(response.data.results);
        setCurrentQuestionIndex(0);  
      } catch (err) {
        if (err.response && err.response.status === 429) {
          setError('Too many requests, please try again later.');
        } else {
          setError('Failed to load questions');
        }
      } finally {
        setLoading(false);
      }
    }, 2000);  
  };

  const handleAnswer = (isCorrect) => {
    if (answered) return;  
    setAnswered(true);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setAnswered(false);
    setCurrentQuestionIndex(currentQuestionIndex + 1);  
  };

  const saveScore = async () => {
    console.log('Sending score to backend...');
    console.log('userId:', userId, 'score:', score); // Log userId and score before the request
    
    if (userId && score !== undefined) {
      try {
        const response = await axios.post('http://localhost:5000/api/score', { userId, score });
        console.log('Score saved successfully:', response.data); // Log response from backend
        navigate('/thanks');
      } catch (error) {
        console.error('Failed to save score:', error.response || error);
      }
    } else {
      console.error('Missing userId or score'); // Log if userId or score is missing
    }
  };
  
  
  
  

  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Check if it's the last question
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div>
      <h2>Trivia Game</h2>
      {questions.length === 0 ? (
        <button onClick={handleFetchQuestions}>Fetch Questions</button>
      ) : (
        <>
          <h3>{he.decode(currentQuestion.question)}</h3>
          {currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer).map((answer, index) => (
            <button key={index} onClick={() => handleAnswer(answer === currentQuestion.correct_answer)}>
              {answer}
            </button>
          ))}
          {answered && (
            <div>
              <p>{answered ? 'Answered' : 'Not Answered'}</p>
              {/* The "Finish and Save Score" button is shown only when the last question is answered */}
              {isLastQuestion && (
                <button onClick={saveScore}>Finish and Save Score</button>
              )}
              {/* This "Next Question" button should only appear when it's not the last question */}
              {!isLastQuestion && (
                <button onClick={nextQuestion}>Next Question</button>
              )}
            </div>
          )}
        </>
      )}
      <h3>Score: {score}</h3>
    </div>
  );
};

export default TriviaGame;
