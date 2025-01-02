// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     price: {
//         type: Number,
//         required: true,
//     },
//     imageUrls: { // Changed to support multiple image URLs
//         type: [String], // Array of strings to store multiple image URLs
//         // required: true,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
//     isLive: {
//         type: Boolean,
//         default: true,
//     }
// });

// const Product = mongoose.model('Product', productSchema);
// module.exports = Product;





const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Product price must be a positive number'], // Validation to ensure price is positive
    },
    imageUrls: {
        type: [String], // Array of image URLs
        required: [true, 'At least one image URL is required'], // Ensure at least one image is provided
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isLive: {
        type: Boolean,
        default: true,
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
