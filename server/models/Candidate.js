const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const candidateSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    resumeUrl: { type: String }, // Store resume URL or path after upload
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
candidateSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to check password
candidateSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Candidate', candidateSchema);