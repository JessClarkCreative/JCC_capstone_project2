import React, { useState } from 'react';
import { Segment, Button, Header, Progress, Message, Loader } from 'semantic-ui-react';

const TriviaGame = () => {
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

  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const handleFetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=${QUESTIONS_PER_ROUND}`);
      const data = await response.json();
      setQuestions(data.results);
      setCurrentQuestionIndex(0);
      setAnswered(false);
      setSelectedAnswer(null);
    } catch (err) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const startNewRound = async () => {
    if (currentRound < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
      await handleFetchQuestions();
    } else {
      await saveScore();
    }
  };

  const handleAnswer = (answer, correctAnswer) => {
    if (answered) return;
    setSelectedAnswer(answer);
    setAnswered(true);
    if (answer === correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const saveScore = async () => {
    console.log('Saving score:', { userId, score }); // Debug log
    
    if (!userId) {
      alert('Please log in to save your score');
      return;
    }

    if (score === undefined || score === null) {
      alert('Invalid score value');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/score', {
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

      const data = await response.json();
      console.log('Score saved successfully:', data); // Debug log

      window.location.href = '/thanks';
    } catch (error) {
      console.error('Failed to save score:', error);
      alert('Failed to save score. Please try again.');
    }
  };

  if (loading) {
    return (
      <Segment style={gameContainerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Loader active size="large">Loading questions...</Loader>
        </div>
      </Segment>
    );
  }

  if (error) {
    return (
      <Segment style={gameContainerStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Message negative>
            <Message.Header>Error</Message.Header>
            <p>{error}</p>
          </Message>
          <Button primary onClick={handleFetchQuestions} style={{ marginTop: '1rem' }}>
            Try Again
          </Button>
        </div>
      </Segment>
    );
  }

  if (!questions.length) {
    return (
      <Segment style={gameContainerStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Header as="h2">Round {currentRound}</Header>
          <Button 
            primary
            size="large"
            onClick={handleFetchQuestions}
          >
            {currentRound === 1 ? 'Start Game' : 'Start Round'}
          </Button>
        </div>
      </Segment>
    );
  }

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