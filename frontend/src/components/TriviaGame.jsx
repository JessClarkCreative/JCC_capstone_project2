import React, { useState, useEffect } from 'react';
import { Segment, Button, Header, Progress, Message, Loader } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';

const TriviaGame = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const userId = localStorage.getItem('userId');
  const QUESTIONS_PER_ROUND = 5;
  const TOTAL_ROUNDS = 3;

  // Styles
  const gameContainerStyle = {
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  };

  const questionContainerStyle = {
    minHeight: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const answersContainerStyle = {
    minHeight: '250px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  };

  // Utility to decode HTML entities
  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  // Fetch questions from Open Trivia DB
  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=${QUESTIONS_PER_ROUND}`);
      const data = await response.json();
      
      if (data.response_code !== 0) {
        throw new Error('Failed to fetch questions');
      }

      setQuestions(data.results);
      setCurrentQuestionIndex(0);
      setAnswered(false);
      setSelectedAnswer(null);
    } catch (err) {
      setError('Unable to load questions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial and between-round question loading
  useEffect(() => {
    if (currentRound === 1 || questions.length === 0) {
      fetchQuestions();
    }
  }, [currentRound]);

  // Start a new round or save final score
  const startNewRound = async () => {
    if (currentRound < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
      await fetchQuestions();
    } else {
      await saveScore();
    }
  };

  // Handle user's answer selection
  const handleAnswer = (answer, correctAnswer) => {
    if (answered) return;
    setSelectedAnswer(answer);
    setAnswered(true);
    if (answer === correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  // Move to next question
  const nextQuestion = () => {
    setAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(prev => prev + 1);
  };

  // Save score to backend
  const saveScore = async () => {
    if (!userId) {
      alert('Please log in to save your score');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: parseInt(userId), 
          score: parseInt(score)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save score');
      }

      navigate('/thanks');
    } catch (error) {
      console.error('Score save error:', error);
      alert('Failed to save score. Please try again.');
    }
  };

  // Render loading state
  if (loading) {
    return (
      <Segment style={gameContainerStyle}>
        <Loader active size="large">Loading questions...</Loader>
      </Segment>
    );
  }

  // Render error state
  if (error) {
    return (
      <Segment style={gameContainerStyle}>
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
          <Button primary onClick={fetchQuestions}>
            Try Again
          </Button>
        </Message>
      </Segment>
    );
  }

  // No questions loaded - start game prompt
  if (!questions.length) {
    return (
      <Segment style={gameContainerStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Header as="h2">Round {currentRound}</Header>
          <Button 
            primary
            size="large"
            onClick={fetchQuestions}
          >
            {currentRound === 1 ? 'Start Game' : 'Start Round'}
          </Button>
        </div>
      </Segment>
    );
  }

  // Current game state
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestionInRound = currentQuestionIndex === QUESTIONS_PER_ROUND - 1;

  return (
    <Segment style={gameContainerStyle}>
      <div>
        <Header as="h2" textAlign="center">Round {currentRound}</Header>
        <Progress 
          percent={(currentQuestionIndex + 1) * (100/QUESTIONS_PER_ROUND)} 
          progress 
          indicating
          size="small"
        >
          Question {currentQuestionIndex + 1}/{QUESTIONS_PER_ROUND}
        </Progress>
        <Header as="h3" textAlign="right">Total Score: {score}</Header>
      </div>

      <div style={questionContainerStyle}>
        <Header as="h2" textAlign="center">{decodeHTML(currentQuestion.question)}</Header>
      </div>

      <div style={answersContainerStyle}>
        {[...currentQuestion.incorrect_answers, currentQuestion.correct_answer]
          .sort(() => Math.random() - 0.5)
          .map((answer, index) => (
            <Button
              key={index}
              fluid
              size="large"
              onClick={() => handleAnswer(answer, currentQuestion.correct_answer)}
              disabled={answered}
              color={
                answered
                  ? answer === currentQuestion.correct_answer
                    ? 'green'
                    : answer === selectedAnswer
                    ? 'red'
                    : null
                  : null
              }
            >
              {decodeHTML(answer)}
            </Button>
          ))}

        {answered && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            {isLastQuestionInRound ? (
              <Button
                size="large"
                onClick={currentRound === TOTAL_ROUNDS ? saveScore : startNewRound}
                color={currentRound === TOTAL_ROUNDS ? 'red' : 'purple'}
              >
                {currentRound === TOTAL_ROUNDS ? 'Finish Game' : 'Next Round'}
              </Button>
            ) : (
              <Button
                primary
                size="large"
                onClick={nextQuestion}
              >
                Next Question
              </Button>
            )}
          </div>
        )}
      </div>
    </Segment>
  );
};

export default TriviaGame;