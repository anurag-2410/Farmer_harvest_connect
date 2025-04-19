const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    input: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AgriculturalInput',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
});

const orderSchema = mongoose.Schema({
    orderItems: [orderItemSchema],
    shippingAddress: {
        name: String,
        street: String,
        city: {
            type: String,
            required: true
        },
        state: String,
        postalCode: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    customer: {
        type: Object,
        required: true,
        default: {}
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        default: 'Cash on Delivery'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: {
        type: Date
    },
    feedback: {
        rating: Number,
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
}, {
    timestamps: true
});

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});

exports.Order = mongoose.model('Order', orderSchema);
exports.orderSchema = orderSchema; 