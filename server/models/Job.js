const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true }, // Ensure this field exists
    location: { type: String, required: true },
    salary: { type: Number },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true },
    deadline: { type: Date }, // Add deadline field
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);