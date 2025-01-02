// // src/connectDB.js
// const mongoose = require("mongoose");
// require('dotenv').config(); // Make sure to load the environment variables

// // MongoDB connection URI from .env
// const uri = process.env.MONGO_URI;

// const connectDB = async () => {
//     try {
//         if (mongoose.connection.readyState === 1) {
//             console.log("MongoDB is already connected");
//             return; // Exit if already connected
//         }

//         await mongoose.connect(uri, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log("MongoDB connected");
//     } catch (error) {
//         console.error("Failed to connect to MongoDB:", error);
//         process.exit(1); // Exit process with failure
//     }
// };

// module.exports = connectDB; // Export the connection function
