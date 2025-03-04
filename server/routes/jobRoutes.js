const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const authMiddleware = require('../middleware/auth');

// Create a new job (only for employers)
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Only employers can post jobs' });
        }
        const { title, description, location, salary } = req.body;
        const job = new Job({ title, description, location, salary, employerId: req.user.id });
        await job.save();
        res.status(201).json({ job, message: 'Job posted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get all jobs (public access for job seekers) with optional limit and sort
router.get('/', async (req, res) => {
    try {
        const { limit, sort } = req.query;
        const query = {};
        let jobs = Job.find(query);

        if (limit) {
            jobs = jobs.limit(parseInt(limit));
        }
        if (sort) {
            jobs = jobs.sort(sort);
        }

        jobs = await jobs.populate('employerId', 'companyName');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get a specific job by ID
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('employerId', 'companyName');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Update a job (only for the employer who posted it)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Only employers can update jobs' });
        }
        const job = await Job.findOne({ _id: req.params.id, employerId: req.user.id });
        if (!job) {
            return res.status(404).json({ message: 'Job not found or unauthorized' });
        }
        const { title, description, location, salary } = req.body;
        job.title = title || job.title;
        job.description = description || job.description;
        job.location = location || job.location;
        job.salary = salary || job.salary;
        await job.save();
        res.json({ job, message: 'Job updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Delete a job (only for the employer who posted it)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Only employers can delete jobs' });
        }
        const job = await Job.findOneAndDelete({ _id: req.params.id, employerId: req.user.id });
        if (!job) {
            return res.status(404).json({ message: 'Job not found or unauthorized' });
        }
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;