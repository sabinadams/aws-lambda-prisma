require("dotenv").config();
const serverless = require("serverless-http");
const express = require("express");
const fs = require("fs-extra");

const port = process.env.PORT || 8000;

// Get express application
const app = express();

// Get prisma clients
const { PrismaClient: Client1 } = require(".prisma/client-1");
const { PrismaClient: Client2 } = require(".prisma/client-2");

// Instantiate them
const prisma = new Client1();
const prisma2 = new Client2();

// Wrapper for async routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Parse POST bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send(`Welcome`);
});

// Get all users
app.get(
  "/user",
  asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
  })
);

// Create a user
app.post(
  "/user",
  asyncHandler(async (req, res) => {
    const { firstName, lastName, username } = req.body;
    const newUser = await prisma.user.create({
      data: { firstName, lastName, username },
    });

    res.status(200).json(newUser);
  })
);

// Get all books
app.get(
  "/book",
  asyncHandler(async (req, res) => {
    const books = await prisma2.book.findMany();
    res.json(books);
  })
);

// Create a book
app.post(
  "/book",
  asyncHandler(async (req, res) => {
    const { title, pages } = req.body;
    const newBook = await prisma2.book.create({
      data: { title, pages },
    });

    res.status(200).json(newBook);
  })
);

// Catch any errors, throw detailed info if in development
app.use((err, req, res, next) => {
  res.status(500).json({
    message: "Something went wrong",
    ...(process.env.NODE_ENV === "development"
      ? { devMessage: err.message, devStack: err.stack }
      : {}),
  });
});

// Start 'er up!
app.listen(port, async () => {
  // Only needed for SQLite
  if (process.env.NODE_ENV === "aws-testing") {
    // If we are on AWS, our SQLite DBs aren't writable unless in tmp
    await fs.copy("/opt/nodejs/prisma", "/tmp/prisma");
  }
  console.log(
    `Listening on: http://localhost:${port} in env ${process.env.NODE_ENV}`
  );
});

// Export wrapped instance for serverless
module.exports.handler = serverless(app);
