const mongoose = require('mongoose');

const careerOpeningSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    department: { type: String, trim: true },
    location: { type: String, trim: true },
    type: { type: String, trim: true },
    description: { type: String, trim: true },
    requirements: [{ type: String }],
    isActive: { type: Boolean, default: true },
    postedDate: { type: String, trim: true },
    closingDate: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('CareerOpening', careerOpeningSchema);
