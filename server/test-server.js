// /server/test-server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5001;

// Manually handle CORS preflight requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-auth-token"
  );
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

// Middleware to parse JSON
app.use(express.json());

// A simple test route
app.post("/api/login", (req, res) => {
  console.log("Test login request received:", req.body);
  res.json({ token: "test_token_123" });
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
