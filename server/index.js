const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes') // authRoutes imported
const dataRoutes = require('./routes/dataRoutes') // dataRoutes imported

dotenv.config(); // Load dotenv variables

const app = express();

// Middleware
app.use(express.json()); // parsing JSON request bodies
// CORS
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

// Using the auth route
app.use('/api', authRoutes);

// Using the data route
app.use('/api/data', dataRoutes)

// Basic Test Route
app.get('/', (req, res) => {
    res.send('API is running...')
})

app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
