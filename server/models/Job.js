const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: Number },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true },
    featured: { type: Boolean, default: false }, // Add this line for featured jobs
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);