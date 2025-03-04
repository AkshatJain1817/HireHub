const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Create an 'uploads' folder in the server directory
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create a new application (only for candidates) with resume upload
router.post('/', authMiddleware, upload.single('resume'), async (req, res) => {
    try {
        if (req.user.role !== 'candidate') {
            return res.status(403).json({ message: 'Only candidates can apply for jobs' });
        }
        const { jobId } = req.body;
        const resumeUrl = req.file ? `/uploads/${req.file.filename}` : '';
        if (!resumeUrl) {
            return res.status(400).json({ message: 'Resume is required' });
        }
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