require("dotenv").config();
const serverless = require("serverless-http");
const express = require("express");
const port = process.env.PORT || 8000;

// Get express application
const app = express();

// Get prisma clients
const { PrismaClient: Client1 } = require(".prisma/client-1");
const { PrismaClient: Client2 } = require(".prisma/client-2");
const { PrismaClient: Client3 } = require(".prisma/client-3");

// Instantiate them
const prisma = new Client1();
const prisma2 = new Client2();
const prisma3 = new Client3();

// Wrapper for async routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Parse POST bodies
app.use(express.json());

app.get("/", (req, res) => {
  console.log(prisma)
  res.status(200).send(`Welcome`);
});

// Get all users
app.get(
  "/user",
  asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany()
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

// Get all profiles
app.get(
  "/profile",
  asyncHandler(async (req, res) => {
    const profiles = await prisma3.profile.findMany();
    res.json(profiles);
  })
);

// Create a profile
app.post(
  "/profile",
  asyncHandler(async (req, res) => {
    const { bio, user_id } = req.body;
    const newProfile = await prisma3.profile.create({
      data: { bio, user_id },
    });

    res.status(200).json(newProfile);
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
app.listen(port, () => console.log(`Listening on: http://localhost:${port}`));

// Export wrapped instance for serverless
module.exports.handler = serverless(app);
