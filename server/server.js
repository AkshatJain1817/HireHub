const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

// Middleware
app.use(express.json());

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
app.get('/', (req, res) => {
    res.send('HireHub API is running!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`HireHub server is running on port ${PORT}`);
});