# Trivia Master

## Quick Start (For Grading)

### Option 1: Play Live Version
Visit: [https://your-deployed-url.com](https://your-deployed-url.com)

Test Account:
- Email: test@example.com
- Password: test123

Or create your own account to play!

### Option 2: Local Setup

1. Clone the repository:
```bash
git clone [your-repository-url]
cd trivia-master
```

2. Set up the backend:
```bash
cd backend
npm install

# Create a .env file with:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/db_trivia"
JWT_SECRET="your-secret-key"

# Run migrations
npx prisma migrate dev

# Start the server
npm run dev
```

3. Set up the frontend:
```bash
cd ../frontend
npm install
npm run dev
```

4. Visit `http://localhost:5173` in your browser

## Project Details

This full-stack trivia game features:
- 3 rounds of trivia (5 questions each)
- Score tracking
- Global leaderboard
- Personal score history
- User authentication

## Tech Stack

- Frontend: React with Semantic UI
- Backend: Node.js/Express
- Database: PostgreSQL with Prisma ORM
- Authentication: JWT

## Project Structure
```
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│   └── README.md      # Frontend setup details
├── backend/           # Express server
│   ├── routes/
│   ├── prisma/
│   └── README.md      # Backend setup details
```

## Grading Notes

### Key Files to Review
- `frontend/src/components/TriviaGame.jsx`: Core game logic
- `frontend/src/components/Leaderboard.jsx`: Score display
- `backend/routes/`: API endpoints
- `backend/prisma/schema.prisma`: Database schema

### Features to Test
1. User Registration/Login
2. Complete game flow (3 rounds)
3. Score saving
4. Leaderboard updates
5. Personal score history

## Testing

Run frontend tests:
```bash
cd frontend
npm test
```

## Common Issues & Solutions

1. Database Connection:
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env
   - Run `npx prisma migrate reset` if needed

2. Port Conflicts:
   - Backend runs on port 5000
   - Frontend runs on port 5173
   - Change in .env if needed

## Need Help?

Contact: [jessclarkcreative@gmail.com]