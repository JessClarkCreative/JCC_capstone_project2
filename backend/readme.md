
* Database Setup *

1. Install dependencies with [npm install]

2. Init Prisma ORM with [npx prisma init] 
  (NOTE: [npx] not [npm])

3. Set your DATABASE_URL in the .env file
  - example DATABASE_URL=postgresql://postgres:postgres@localhost:5432/test_db
  - don't forget to create a database with [createdb] command

4. Generate Prisma client with [npx prisma generate]
  (AGAIN: [npx] not [npm])


5. Migrate and create initial table with [npx prisma migrate dev --name init]
  - (You should see a message like "Your database is now in sync with your schema.")
  - Use migrations when adding tables, changing columns, etc

6. [npm run dev] should run the server, it will "hot reload" whenever any changes on the backend code are saved

7. The server runs at [localhost:5000] unless changed in the ENV
