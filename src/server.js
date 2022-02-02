const serverless = require("serverless-http");
const express = require("express");
require('dotenv').config()

const { PrismaClient: Client1 } = require("./generated/client");
const { PrismaClient: Client2 } = require("./generated/client-2");

const app = express();

const prisma = new Client1();
const prisma2 = new Client2();

const port = process.env.PORT || 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("hello world!");
});

app.get("/user", async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users);
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong",
      ...(process.env.NODE_ENV === "development"
        ? { devMessage: e.message, devStack: e.stack }
        : {}),
    });
  }
});

app.post("/user", async (req, res) => {
  try {
    const { firstName, lastName, username } = req.body;
    const newUser = await prisma.user.create({
      data: { firstName, lastName, username },
    });

    res.status(200).json(newUser);
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong",
      ...(process.env.NODE_ENV === "development"
        ? { devMessage: e.message, devStack: e.stack }
        : {}),
    });
  }
});

app.get("/book", async (req, res) => {
  try {
    const books = await prisma2.book.findMany();
    res.json(books);
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong",
      ...(process.env.NODE_ENV === "development"
        ? { devMessage: e.message, devStack: e.stack }
        : {}),
    });
  }
});

app.post("/book", async (req, res) => {
  try {
    const { title, pages } = req.body;
    const newBook = await prisma2.book.create({
      data: { title, pages },
    });

    res.status(200).json(newBook);
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong",
      ...(process.env.NODE_ENV === "development"
        ? { devMessage: e.message, devStack: e.stack }
        : {}),
    });
  }
});

// Server
app.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}`);
});

module.exports.handler = serverless(app);
