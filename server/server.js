const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Add this line
require('dotenv').config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Add this line to allow cross-origin requests

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB for HireHub');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Test Route
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to HireHub API!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`HireHub server is running on port ${PORT}`);
});