const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
    title: {
        main: { type: String, required: true },
        subtitle: { type: String, required: true },
        brand: { type: String, required: true },
    },
    video: {
        desktop: { type: String, required: true },
        mobile: { type: String, required: true },
        fallbackImage: { type: String, required: true },
    },
    ctaButtons: [{
        text: { type: String },
        link: { type: String },
        type: { type: String, enum: ['primary', 'secondary'], default: 'primary' },
    }],
    floatingBeans: [{
        image: { type: String },
        animation: { type: String },
        position: {
            x: { type: Number },
            y: { type: Number },
        },
    }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema);
