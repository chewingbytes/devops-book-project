import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(process.cwd(), "data.json");

// Helper to read/write JSON file
function readData() {
  if (!fs.existsSync(DATA_FILE)) return { users: [], books: [] };
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API routes

// Get all users
app.get("/api/users", (req, res) => {
  const data = readData();
  res.json(data.users);
});

// Add user
app.post("/api/users", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  const data = readData();
  if (!data.users.includes(username)) data.users.push(username);
  writeData(data);
  res.json({ success: true });
});

// Get all books for a user
app.get("/api/books/:user", (req, res) => {
  const data = readData();
  const userBooks = data.books.filter(b => b.user === req.params.user);
  res.json(userBooks);
});

// Add or update a book
app.post("/api/books", (req, res) => {
  const { user, title, author, content, editIndex } = req.body;
  if (!user || !title || !author || !content) return res.status(400).json({ error: "Missing fields" });

  const data = readData();
  if (editIndex !== null && editIndex !== undefined) {
    // update
    const userBooks = data.books.filter(b => b.user === user);
    const actualIndex = data.books.findIndex(b => b.title === userBooks[editIndex].title && b.user === user);
    if (actualIndex !== -1) data.books[actualIndex] = { user, title, author, content };
  } else {
    // add
    data.books.push({ user, title, author, content });
  }

  writeData(data);
  res.json({ success: true });
});

// Delete a book
app.delete("/api/books/:user/:title", (req, res) => {
  const { user, title } = req.params;
  const data = readData();
  data.books = data.books.filter(b => !(b.user === user && b.title === title));
  writeData(data);
  res.json({ success: true });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
