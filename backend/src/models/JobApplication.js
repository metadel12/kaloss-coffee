const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    applicationId: { type: String, required: true, unique: true },
    position: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    coverLetter: { type: String, trim: true },
    portfolioUrl: { type: String, trim: true },
    linkedinUrl: { type: String, trim: true },
    expectedSalary: { type: Number },
    startDate: { type: String, trim: true },
    source: { type: String, trim: true },
    status: { type: String, default: 'Received' },
    notes: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
