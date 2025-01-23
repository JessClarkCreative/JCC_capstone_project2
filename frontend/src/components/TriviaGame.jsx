import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TriviaGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch trivia questions when the component mounts
    const fetchQuestions = async () => {
      try {  
        const response = await axios.get('https://opentdb.com/api.php?amount=10');
        setQuestions(response.data.results);
      } catch (err) {
        setError('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswer = (isCorrect) => {
    if (answered) return;  // Prevent multiple answers
    setAnswered(true);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setAnswered(false);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h2>Trivia Game</h2>
      {currentQuestion ? (
        <div>
          <h3>{currentQuestion.question}</h3>
          {currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer).map((answer, index) => (
            <button key={index} onClick={() => handleAnswer(answer === currentQuestion.correct_answer)}>
              {answer}
            </button>
          ))}
          {answered && (
            <div>
              <p>{answered ? 'Answered' : 'Not Answered'}</p>
              <button onClick={nextQuestion}>Next Question</button>
            </div>
          )}
        </div>
      ) : (
        <p>No more questions</p>
      )}
      <h3>Score: {score}</h3>
    </div>
  );
};

export default TriviaGame;