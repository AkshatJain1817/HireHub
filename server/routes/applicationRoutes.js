const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const authMiddleware = require('../middleware/auth');

// Create a new application (only for candidates)
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'candidate') {
            return res.status(403).json({ message: 'Only candidates can apply for jobs' });
        }
        const { jobId, resumeUrl } = req.body;
        const application = new Application({ candidateId: req.user.id, jobId, resumeUrl });
        await application.save();
        res.status(201).json({ application, message: 'Application submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get applications for a candidate
router.get('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'candidate') {
            return res.status(403).json({ message: 'Only candidates can view their applications' });
        }
        const applications = await Application.find({ candidateId: req.user.id })
            .populate('jobId', 'title location')
            .populate('candidateId', 'fullName');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;