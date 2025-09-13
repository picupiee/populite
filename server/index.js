const dotenv = require("dotenv");
dotenv.config(); // Load dotenv variables
console.log("JWT_SECRET :", process.env.JWT_SECRET);
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes"); // authRoutes imported
const dataRoutes = require("./routes/dataRoutes"); // dataRoutes imported

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-auth-token, ngrok-skip-browser-warning"
  );
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

app.use(express.json()); // parsing JSON request bodies

const PORT = process.env.PORT || 5000;

// CORS Middleware
// const corsOptions = {
//   origin: "https://pdw-rt003--pyhc1rblze.expo.app",
//   optionsSuccessStatus: 200,
// };
// CORS

// Middleware

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Using the auth route
app.use("/api", authRoutes);

// Using the data route
app.use("/api/data", dataRoutes);

// Basic Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
