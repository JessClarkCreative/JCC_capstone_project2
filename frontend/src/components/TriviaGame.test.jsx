import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TriviaGame from './TriviaGame';

// Mock the fetch function
global.fetch = jest.fn();

describe('TriviaGame Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders start game button initially', () => {
    render(<TriviaGame />);
    expect(screen.getByText('Start Game')).toBeInTheDocument();
  });

  test('shows loading state while fetching questions', async () => {
    // Mock the API call
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ results: [] })
      })
    );

    render(<TriviaGame />);
    
    // Click start game
    fireEvent.click(screen.getByText('Start Game'));
    
    // Check for loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('displays question and answers when loaded', async () => {
    // Mock question data
    const mockQuestion = {
      results: [{
        question: 'Test Question?',
        correct_answer: 'Correct',
        incorrect_answers: ['Wrong1', 'Wrong2', 'Wrong3']
      }]
    };

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockQuestion)
      })
    );

    render(<TriviaGame />);
    fireEvent.click(screen.getByText('Start Game'));

    // Wait for question to appear
    await waitFor(() => {
      expect(screen.getByText('Test Question?')).toBeInTheDocument();
    });
  });

  test('updates score when correct answer is selected', async () => {
    const mockQuestion = {
      results: [{
        question: 'Test Question?',
        correct_answer: 'Correct',
        incorrect_answers: ['Wrong1', 'Wrong2', 'Wrong3']
      }]
    };

    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockQuestion)
      })
    );

    render(<TriviaGame />);
    fireEvent.click(screen.getByText('Start Game'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Correct'));
    });

    expect(screen.getByText('Total Score: 1')).toBeInTheDocument();
  });

  test('shows error message when API fails', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('API Error'))
    );

    render(<TriviaGame />);
    fireEvent.click(screen.getByText('Start Game'));

    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });
});