const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
    suffix: { type: String, default: '' },
    prefix: { type: String, default: '' },
    icon: { type: String, default: '' },
    lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Stat', statSchema);
