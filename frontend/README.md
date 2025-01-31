# Trivia Master Frontend

React-based frontend for the Trivia Master application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a .env file:
```env
VITE_API_URL=http://localhost:5000
```

3. Start development server:
```bash
npm run dev
```

## Component Structure

- `App.jsx`: Main application container
- `components/`
  - `TriviaGame.jsx`: Core game logic and UI
  - `Leaderboard.jsx`: Displays global rankings and personal scores
  - `Login.jsx`: User login form
  - `Signup.jsx`: User registration form
  - `Navigation.jsx`: Navigation bar

## Testing

1. Run tests:
```bash
npm test
```

Test files are located next to their components with `.test.jsx` extension.

## Dependencies

- React 18
- Semantic UI React
- React Testing Library
- Vite

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:5000)

## Development Notes

- Uses Semantic UI for styling
- Local storage for session management
- Implements client-side routing