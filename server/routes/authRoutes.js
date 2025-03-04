const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Employer = require('../models/Employer');
const Candidate = require('../models/Candidate');
const authMiddleware = require('../middleware/auth');

// Add this route for protected access (e.g., dashboard)
router.get('/dashboard', authMiddleware, (req, res) => {
    res.json({ message: `Welcome ${req.user.role} with ID ${req.user.id}` });
});

// Register Employer
router.post('/employer/register', async (req, res) => {
    try {
        const { email, password, companyName } = req.body;
        const existingEmployer = await Employer.findOne({ email });
        if (existingEmployer) {
            return res.status(400).json({ message: 'Employer already exists' });
        }
        const employer = new Employer({ email, password, companyName });
        await employer.save();
        res.status(201).json({ message: 'Employer registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Login Employer
router.post('/employer/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const employer = await Employer.findOne({ email });
        if (!employer || !(await employer.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: employer._id, role: 'employer' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Register Candidate
router.post('/candidate/register', async (req, res) => {
    try {
        const { email, password, fullName } = req.body;
        const existingCandidate = await Candidate.findOne({ email });
        if (existingCandidate) {
            return res.status(400).json({ message: 'Candidate already exists' });
        }
        const candidate = new Candidate({ email, password, fullName });
        await candidate.save();
        res.status(201).json({ message: 'Candidate registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Login Candidate
router.post('/candidate/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const candidate = await Candidate.findOne({ email });
        if (!candidate || !(await candidate.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: candidate._id, role: 'candidate' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;