const mongoose = require('mongoose');

const agriculturalInputSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['Seed', 'Pesticide', 'Fertilizer', 'Tool', 'Other']
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    manufacturer: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: 'Available',
        enum: ['Available', 'Out of Stock', 'Discontinued']
    }
});

agriculturalInputSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

agriculturalInputSchema.set('toJSON', {
    virtuals: true,
});

exports.AgriculturalInput = mongoose.model('AgriculturalInput', agriculturalInputSchema);
exports.agriculturalInputSchema = agriculturalInputSchema; 