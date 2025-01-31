# Trivia Master Backend

Express and PostgreSQL backend for the Trivia Master application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a .env file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/db_trivia"
JWT_SECRET="your-secret-key"
PORT=5000
```

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Start server:
```bash
npm run dev
```

## API Routes

### Authentication
```
POST /api/login
- Body: { email, password }
- Returns: { token, userId }

POST /api/users
- Body: { email, password, username }
- Returns: { id, email, username }
```

### Scores
```
POST /api/score
- Body: { userId, score }
- Returns: { id, score, userId, createdAt }

GET /api/scores/:userId
- Returns: Array of user's scores
```

### Leaderboard
```
GET /api/leaderboard
- Returns: Array of top scores with usernames
```

## Database Schema

```prisma
model User {
  @@map("users")
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  username  String   @unique
  scores    Score[]
}

model Score {
  @@map("scores")
  id        Int      @id @default(autoincrement())
  score     Int
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
}
```

## Dependencies

- Express
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt

## Development Notes

- Uses Prisma for database operations
- JWT for authentication
- CORS enabled for frontend communication