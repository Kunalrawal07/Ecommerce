const mongoose = require("mongoose"); 
mongoose.connect("mongodb+srv://kunalrawal:kunalrawal@cluster0.7szni.mongodb.net/logintesting")
.then(()=>{
    console.log("mongo connected");
})
.catch(()=>{
    console.log("Failed to connected");
})

const loginschema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    // email: { type: String, required: true, unique: true }
})


// Create and export model
const Collection1 = mongoose.model("Collection1", loginschema);  // Correct model creation
module.exports = Collection1;















// const mongoose = require("mongoose");

// // MongoDB connection
// mongoose.connect("mongodb+srv://kunalrawal:kunalrawal@cluster0.7szni.mongodb.net/logintesting", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => {
//     console.log("MongoDB connected");
// })
// .catch((error) => {
//     console.log("Failed to connect to MongoDB", error);
// });

// // User Schema (with email, password, and order references)
// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     orders: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Order',  // References the 'Order' model
//         },
//     ],
// });

// // Order Schema
// const orderSchema = new mongoose.Schema({
//     productName: String,
//     price: Number,
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',  // References the 'User' model
//     },
//     status: {
//         type: String,
//         enum: ['Pending', 'Shipped', 'Delivered'],
//         default: 'Pending',  // Track the order status
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,  // Automatically set the order creation time
//     },
// });

// // Models
// const User = mongoose.model('User', userSchema);
// const Order = mongoose.model('Order', orderSchema);

// // Export the models
// module.exports = { User, Order };
