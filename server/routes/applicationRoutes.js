const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer'); // Add this line
const Job = require('../models/Job');
const Candidate = require('../models/Candidate');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' or your email service (e.g., 'smtp.ethereal.email' for testing)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send email function
const sendApplicationEmail = async (candidateEmail, jobTitle, status) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: candidateEmail,
        subject: `HireHub Application ${status} for ${jobTitle}`,
        text: `Hello,\n\nYour application for the position of ${jobTitle} has been ${status.toLowerCase()}. We will notify you of any updates.\n\nBest regards,\nHireHub Team`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${candidateEmail} for ${jobTitle} - ${status}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Create a new application (only for candidates) with resume upload and email notification
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

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const application = new Application({ candidateId: req.user.id, jobId, resumeUrl, status: 'Pending' });
        await application.save();

        // Send email notification for successful application
        const candidate = await Candidate.findById(req.user.id);
        await sendApplicationEmail(candidate.email, job.title, 'Submitted');

        res.status(201).json({ application, message: 'Application submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update application status (for employers or admins, if needed)
router.put('/:id/status', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Only employers can update application status' });
        }

        const { status } = req.body;
        const application = await Application.findById(req.params.id).populate('jobId candidateId');
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if the employer owns the job
        if (application.jobId.employerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to update this application' });
        }

        application.status = status;
        await application.save();

        // Send email notification for status update
        await sendApplicationEmail(application.candidateId.email, application.jobId.title, status);

        res.json({ application, message: 'Application status updated successfully' });
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

// Get applications for an employer (optional, for dashboard)
router.get('/employer', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Only employers can view their applications' });
        }
        const applications = await Application.find()
            .populate({
                path: 'jobId',
                match: { employerId: req.user.id },
                select: 'title location'
            })
            .populate('candidateId', 'fullName email');
        res.json(applications.filter(app => app.jobId !== null));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;