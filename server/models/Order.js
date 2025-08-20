import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        name: String,
        price: Number,
        image: String
    }],
    amount: { type: Number, required: true },
    address: { type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true },
    status: { type: String, default: 'Order Placed' },
    paymentType: { type: String,
        enum: ['COD', 'Online'],
        default: 'COD' },
    isPaid: { type: Boolean, required: true, default: false },

}, { timestamps: true })

const Order = mongoose.models.order || mongoose.model('order', orderSchema)

export default Order