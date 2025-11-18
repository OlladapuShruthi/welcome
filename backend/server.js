const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./database/db");
const bookRoutes = require("./routes/book-routes");

dotenv.config();
const app = express();
/*
CORS is one of the most important concepts when your frontend (HTML, JS) and 
backend (Node.js, Express) run on different ports.

CORS = Cross-Origin Resource Sharing

It is a security rule in browsers.

It decides which frontend is allowed to call which backend.

Why do we need CORS?

Because browser blocks API calls if:

Frontend runs at:
http://127.0.0.1:5500
 (Live Server)

Backend runs at:
http://localhost:3000
 (Express Server)

These two have different ports ➝ different origins

Browser thinks:

“This website is trying to call another website… this might be a security risk. BLOCK!”

So you get errors like:
Access to fetch at 'http://localhost:3000/books'
from origin 'http://127.0.0.1:5500' has been blocked by CORS policy

Solution → Enable CORS in backend

We add this in server.js:

const cors = require("cors");
app.use(cors());

This tells the backend:

“Allow any frontend to access the API.”

*/
// ✅ Allow CORS for Live Server (5500)
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

// Body parser
app.use(express.json());

// Connect DB
connectDB();

// Static front-end
app.use(express.static(path.join(__dirname, "../frontend")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use("/api/books", bookRoutes);

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// Start server
const PORT = process.env.PORT || 3010;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
