// Import necessary modules
const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();  // Initialize the router
// const hbs = require("hbs");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs'); // Using bcryptjs instead of bcrypt
const { User, Order } = require('./mongodb');
// const cookieParser = require('cookie-parser'); // Already required
app.use(cookieParser()); // Use cookie parser to parse cookies
const session = require('express-session');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const mongoose = require("mongoose");
const collection = require("./mongodb");  // User collection
const Product = require("./product");     // Product model
const multer = require('multer');
const hbs = require('hbs');


// Middleware for parsing JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: 'rawalKunal', // Use a strong secret key for production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(cookieParser());

// Middleware to make session data accessible to views
app.use((req, res, next) => {
  res.locals.username = req.session.username;
  next();
});

app.get('/session-status', (req, res) => {
  if (req.session.username) {
      res.json({ loggedIn: true, username: req.session.username });
  } else {
      res.json({ loggedIn: false });
  }
});

// Your existing routes here
// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/admin', async (req, res) => {
  try {
    const products = await Product.find();  // Fetch all products
    res.render('admin', { products });      // Render the admin page with products
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
});

// Use Express's built-in body-parsing middleware
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json()); // For parsing application/json

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Use timestamp to avoid file name collisions
  }
});

const upload = multer({ storage: storage });

// Serve static files (CSS, JS, Images, etc.)
app.use(express.static(path.join(__dirname, '../public')));

// Set the path for templates (views)
const templatePath = path.join(__dirname, '../templates');
app.set("view engine", "hbs");
app.set("views", templatePath);

// Connect to MongoDB
mongoose.connect('mongodb+srv://kunalrawal:kunalrawal@cluster0.7szni.mongodb.net/logintesting', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use((req, res, next) => {
  // Pass session data to every response
  res.locals.username = req.session.username; // this will contain the logged-in username
  next();
});


// ajax testing 
app.get('/api/user', (req, res) => {
  if (req.session.user) {
      res.json({ success: true, user: req.session.user });
  } else {
      res.json({ success: false, user: null });
  }
});

app.get('/', (req, res) => {
  console.log('Session user:', req.session.username);
  res.redirect('/home');  // Redirect root to /home
});

// new updated code
app.get('/login', (req, res) => {
  res.render('login'); // This will render the login.hbs file
});

// new updated code 
app.get('/signup', (req,res) =>(
  res.render('signup')
));

app.get('/profile', (req,res) =>(
  res.render('profile')
));

app.get('/order', (req,res) =>(
  res.render('order')
));

app.get('/congratulations',(req,res) =>{
  res.render('congratulations')
})

app.get('/Checkout',(req,res) => {
  res.render('Checkout')
})

// new updated code 
app.get('/admin', (req,res) =>(
  res.render('admin')
));

app.get('/aboutus',(req,res)=>{
  res.render('aboutus')
})

app.get('/contactus',(req,res)=>{
  res.render('contactus')
})

app.get('/t&c',(req,res)=>{
  res.render('t&c')
})

app.get('/privacy-policy',(req,res)=>{
  res.render('privacy-policy')
})

app.get('/faq',(req,res)=>{
  res.render('faq')
})

app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // Pass session user to templates
  next();
});

app.set('view cache', false);


// hbs.registerPartials(path.join(__dirname, 'views', 'partials'));


// Partials for dynamic navbar
// hbs.registerPartial('navbar', fs.readFileSync(path.join(__dirname, '../views/partials/navbar.hbs'), 'utf8'));

// hbs.registerPartials(__dirname + '../views/partials/navbar.hbs');
// hbs.registerHelper('eq', (a, b) => a === b);



app.get('/some-route', (req, res) => {
  const user = req.session.user || null;
  res.render('somePage', { user });
});


// buy page order now route

app.post('/place-order', (req, res) => {
  
  const { productId, productName, price, username, quantity, fullname, mobileNo, emailAddress, city, pinCode, shippingAddress } = req.body;

  // Prepare email content
  const mailOptions = {
      from: 'apnaelectrician.com@gmail.com',
      to: 'vipulsinghvipul78@gmail.com',
      subject: 'New Order Placed',
      text: `
          A new order has been placed with the following details:

          Product ID: ${productId}
          Product Name: ${productName}
          Product Price: ${price}
          Quantity: ${quantity}
          Full Name: ${fullname}
          Mobile No: ${mobileNo}
          Email Address: ${emailAddress}
          City/State: ${city}
          Pin Code: ${pinCode}
          Shipping Address: ${shippingAddress}  `
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log('Error sending email:', error);
          return res.status(500).json({ success: false, message: 'Failed to send email' });
      }
      console.log('Email sent:', info.response);

      // Respond with success
      // res.json({ success: true, message: 'Order placed and email sent successfully!' });
      res.redirect('/congratulations');
  });
});




// place order button for checkout page
app.post('/place-multiple-orders', async (req, res) => {
  const { fullname, mobileNo, emailAddress, state, pincode, shippingAddress, cart } = req.body;

  const emailContent = `
      <h1>Order Details</h1>
      <h2>Form Details:</h2>
      <p>Full Name: ${fullname}</p>
      <p>Mobile No: ${mobileNo}</p>
      <p>Email Address: ${emailAddress}</p>
      <p>State: ${state}</p>
      <p>Pincode: ${pincode}</p>
      <p>Shipping Address: ${shippingAddress}</p>
      <h2>Product Details:</h2>
      <p>${JSON.stringify(cart)}</p>
  `;

  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'apnaelectrician.com@gmail.com',
          pass: 'kbcmnhznuxixrzhz',
      },
  });

  try {
      await transporter.sendMail({
          from: 'apnaelectrician.com@gmail.com',
          to: 'vipulsinghvipul78@gmail.com',
          subject: 'Order Confirmation',
          html: emailContent,
      });
      res.json({ success: true });
  } catch (error) {
      console.error(error);
      res.status(500).send('Failed to send email');
  }
});

// order history page 
// app.get('/order-history', async (req, res) => {
//   const orders = await Order.find({ userID: req.user._id });  // Get all orders for the logged-in user
//   res.render('order-history', { orders });
// });

// Invoice Generator code
app.post('/download-invoice', (req, res) => {
  console.log('Request body:', req.body); // Log the incoming data

  const { fullname, username, mobileNo, emailAddress, city, pinCode, shippingAddress, quantity, productId } = req.body;

  // Validate data
  if (!fullname || !username || !mobileNo || !emailAddress || !city || !pinCode || !shippingAddress || !quantity || !productId) {
      console.error('Missing required fields for invoice.');
      return res.status(400).json({ success: false, message: 'Missing required information for invoice.' });
  }

  // Create a document
  const doc = new PDFDocument();

  // Set the response headers
  res.setHeader('Content-disposition', 'attachment; filename=invoice.pdf');
  res.setHeader('Content-type', 'application/pdf');

  // Pipe its output to the response
  doc.pipe(res);

  // Add content to the PDF
  doc.fontSize(25).text('Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Name: ${fullname}`);
  doc.text(`Username: ${username}`); // Corrected line to display username
  doc.text(`Mobile No: ${mobileNo}`);
  doc.text(`Email Address: ${emailAddress}`);
  doc.text(`City: ${city}`);
  doc.text(`Pin Code: ${pinCode}`);
  doc.text(`Shipping Address: ${shippingAddress}`);
  doc.text(`Quantity: ${quantity}`);
  doc.text(`Product ID: ${productId}`);

  // Finalize the PDF and end the stream
  doc.end();
});



// more available product

app.get('/product/:id', async (req, res) => {
  try {
      const productId = req.params.id;
      
      // Fetch the product details based on the ID
      const product = await Product.findById(productId);
      
      // Fetch more available products (excluding the current one)
      const products = await Product.find({ _id: { $ne: productId } }).limit(6);
      
      res.render('p', { product, products });
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

app.post('/add-to-cart', async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
  }

  try {
      // Simulate adding the product to the user's cart (update your logic here)
      console.log(`Product ${productId} added to cart.`);
      res.json({ success: true });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to add to cart.' });
  }
});



// Register a helper to split the description
hbs.registerHelper('splitDescription', function(description) {
    if (!description) return [];
    // Split by newline or periods for point-wise formatting
    return description.split(/[\n.]/).filter(item => item.trim() !== '');
});




app.get('/cart', (req,res) =>(
  res.render('cart')
));

// Middleware to parse JSON bodies
const MongoStore = require('connect-mongo');
app.use(express.json());
app.use(session({
    secret: 'rawalkunal',
    resave: false,
    saveUninitialized: true,
 
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/cart/add', (req, res) => {
  const { productId, name, price, image } = req.body;

  // Check if user is logged in
  if (!req.session.username) {
    console.log("User not logged in");
    return res.status(401).json({ success: false, message: "User not logged in" });
  }

  // Initialize cart if it doesn't exist
  if (!req.session.cart) {
    req.session.cart = []; 
  }

  // Check if the product already exists in the cart
  const existingProduct = req.session.cart.find(item => item.productId === productId);
  if (existingProduct) {
      existingProduct.quantity += 1; // Increment quantity
  } else {
      req.session.cart.push({ productId, name, price, image, quantity: 1 });
  }

  // Log current cart state
  console.log("Current Cart for user:", req.session.username, req.session.cart);
  res.json({ success: true, message: 'Product added to cart' });
});





// Endpoint to get cart data (for rendering the cart page)
app.get('/cart', (req, res) => {
  if (!req.session.username) {
    return res.redirect('/login'); // Redirect to login if not logged in
  }

  const cart = req.session.cart || [];
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  res.render('cart', {
      cart,
      totalItems,
      totalPrice,
      username: req.session.username // Pass username to the template
  });
});

// Update product quantity
app.post('/cart/update-quantity', (req, res) => {
    const { productId, action } = req.body;
    const cart = req.session.cart || [];
    const product = cart.find(item => item.id === productId);

    if (product) {
        if (action === 'increase') {
            product.quantity += 1;
        } else if (action === 'decrease' && product.quantity > 1) {
            product.quantity -= 1;
        }
    }

    req.session.cart = cart; // Update session cart
    res.json({ success: true });
});

// Remove product from cart
app.post('/cart/remove', (req, res) => {
    const { productId } = req.body;
    let cart = req.session.cart || [];
    cart = cart.filter(item => item.id !== productId);
    req.session.cart = cart; // Update session cart

    res.json({ success: true });
});

// Login route working
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await collection.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
      // Store user details in session
      req.session.username = user.name; // For user display
      req.session.email = user.email;  // Store email in session
            req.session.phone = user.phone;  // Store phone number in session
            console.log(req.session);

      req.session.user = user;

      res.json({ success: true, username: user.name }); // Respond with username for the frontend
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "An error occurred during login." });
  }
});


// old route
app.get('/product/:id', async (req, res) => {
  try {
      const product = await Product.findById(req.params.id);
      if (!product) {
          return res.status(404).send('Product not found');
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
});

app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // Make user available in templates
  next();
});


// Updated POST route for signup
app.post("/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;

  // Validate input
  if (!name || !email || !phone || !password) {
    return res.status(400).send("All fields are required.");
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    const user = await collection.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    // Store user info in session
    req.session.username = user.name;
    req.session.email = user.email;
    req.session.phone = user.phone;
    // Redirect to home or profile page
    res.redirect("/home");
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send("Error occurred during signup.");
  }
});

// Logout route to clear the cookie
app.post("/logout", (req, res) => {
  // Clear the username from the session or cookies
  res.clearCookie('username'); // If you're using cookies for the username
  req.session.destroy(err => { // If you're using sessions to store the username
    if (err) {
      return res.status(500).send('Error during logout');
    }
    res.redirect('/home'); // Redirect to home after logout
  });
});

// Profile Change Request Send To mail
app.get("/profile", async (req, res) => {
  if (!req.session.username) {
    return res.redirect("/login");
  }

  try {
    // Retrieve the user directly from the database
    const user = await collection.findOne({ name: req.session.username });

    if (user) {
      // Ensure email and phone are passed to the view
      res.render("profile", {
        username: user.name,
        email: user.email,  // Pass email to template
        phone: user.phone,  // Pass phone number to template
      });
    } else {
      res.status(404).send("User not found.");
    }
  } catch (error) {
    console.error("Error loading profile:", error);
    res.status(500).send("An error occurred while loading your profile.");
  }
});


app.get('/home', (req, res) => {
  const username = req.cookies.username || req.session.username;  // Retrieve username from cookies or session
  const cartCount = req.session.cart ? req.session.cart.length : 0;  // Get cart count from session (if it exists)

  Product.find()
    .then(products => {
      res.render('home', { products, username, cartCount });  // Pass username, cartCount, and products to the template
    })
    .catch(error => {
      console.error(error);  // Log the error
      res.status(500).send('Error fetching products');
    });
});

// new updated code 30-11-24
app.get('/buy/:id', async (req, res) => {
  try {
      const productId = req.params.id; // Capture the product ID from the URL

      // Fetch product from database using the product ID
      const product = await Product.findById(productId);

      if (!product) {
          return res.status(404).send('Product not found');
      }

      // Render the buy page and pass product data to the template
      res.render('buy', { product });

  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
});

// new code for order place 
const nodemailer = require('nodemailer');
const { Console } = require("console");

app.use(express.urlencoded({ extended: true }));

// Setup Nodemailer transporter with your Gmail account
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'apnaelectrician.com@gmail.com',
        pass: 'kbcmnhznuxixrzhz'
    }
});

app.post('/place-order', (req, res) => {
    const { productId, productName, price, username, quantity, fullname, mobileNo, emailAddress, city, pinCode, shippingAddress } = req.body;

    // Prepare email content
    const mailOptions = {
        from: 'apnaelectrician.com@gmail.com',
        to: 'kunalrawal07@gmail.com',
        subject: 'New Order Placed',
        text: `
            A new order has been placed with the following details:

            Product ID: ${productId}
            Product Name: ${productName}
            Product Price: ${price}
            Quantity: ${quantity}
            Full Name: ${fullname}
            Mobile No: ${mobileNo}
            Email Address: ${emailAddress}
            City/State: ${city}
            Pin Code: ${pinCode}
            Shipping Address: ${shippingAddress}
        `
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            return res.status(500).json({ success: false, message: 'Failed to send email' });
        }
        console.log('Email sent:', info.response);

        // Respond with success
        // res.json({ success: true, message: 'Order placed and email sent successfully!' });
        res.redirect('/congratulations');
    });
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get('/product/:id', async (req, res) => {
  try {
      // Fetch the product by ID
      const product = await Product.findById(req.params.id);
      if (!product) {
          return res.status(404).send('Product not found');
      }

      // Retrieve the user from the session (null if not logged in)
      const user = req.session.user || null;

      // Fetch additional products for the "More Available Products" section
      const moreProducts = await Product.find().limit(5); // Adjust limit as needed

      // Render the product page with product and user data
      res.render('p', { 
          product, 
          user, // Pass user data for dynamic navbar
          products: moreProducts // Pass more products for the "More Available Products" section
      });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
});


// Route for product detail page
app.get('/p/:id', async (req, res) => {
  try {
      const productId = req.params.id;
      const currentProduct = await Product.findById(productId);

      // If product not found, return 404
      if (!currentProduct) {
          return res.status(404).send('Product not found');
      }

      const allProducts = await Product.find(); // Fetch all products for the more available section
      
      // Render product page with the current product and more available products
      res.render('p', { product: currentProduct, products: allProducts });
  } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Internal Server Error');
  }
});

app.post("/order", (req, res) => {
  req.session = null;  // Clear session (if using sessions)
  res.redirect("/order");    // Redirect to login page
});

// Route to handle product submission with multiple image uploads
app.post('/add-product', upload.array('imageUpload', 10), async (req, res) => {
  const { name, description, price } = req.body;

  // Handle image URLs from form inputs
  let imageUrlsFromText = req.body.imageUrls || [];

  // Ensure it's always treated as an array (even if there's only one URL input)
  if (!Array.isArray(imageUrlsFromText)) {
    imageUrlsFromText = [imageUrlsFromText];
  }

  // Handle image uploads
  let imageUrlsFromFiles = [];
  if (req.files && req.files.length > 0) {
    imageUrlsFromFiles = req.files.map(file => `/uploads/${file.filename}`);
  }

  // Combine both image URLs from text inputs and file uploads
  const imageUrls = [...imageUrlsFromText, ...imageUrlsFromFiles];

  // Check if all required fields are provided
  if (!name || !description || !price || imageUrls.length === 0) {
    return res.status(400).send("All fields and at least one image (URL or file) are required.");
  }

  try {
    // Create the new product using the combined image URLs
    const newProduct = new Product({
      name,
      description,
      price,
      imageUrls, // Use the combined array of image URLs
      createdAt: new Date(),
      isLive: true
    });

    // Save the new product to the database
    await newProduct.save();
    
    // Send a success response
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Error adding product');
  }
});


app.get('/edit', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products
    res.render('edit', { products }); // Render the edit view and pass products
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products.');
  }
});

// Route to handle product editing
app.post('/edit-product/:id', async (req, res) => {
  const productId = req.params.id;
  const { name, description, price, imageUrl } = req.body;

  try {
    await Product.findByIdAndUpdate(productId, {
      name,
      description,
      price,
      imageUrl,
      updatedAt: new Date()
    });
    res.status(200).send('Product updated successfully');
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Error updating product.');
  }
});

// Route to handle product deletion
app.delete('/delete-product/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).send('Product deleted successfully');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Error deleting product');
  }
});

// Home route to display products
app.get('/home', async (req, res) => {
  try {
    const products = await Product.find();  // Fetch all products
    res.render('home', { products });       // Render home page with products
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
});

function sendEmail(orderDetails) {
  return new Promise((resolve, reject) => {
      // Simulating an email sending process
      // Replace this with your actual email sending code
      const isSuccess = Math.random() > 0.5; // Simulating success/failure randomly

      if (isSuccess) {
          resolve();
      } else {
          reject(new Error('Simulated email sending error')); // Simulate an error
      }
  });
}

app.post('/place-order', (req, res) => {
  const { productId, quantity, fullname, mobileNo, emailAddress, city, pinCode, shippingAddress } = req.body;

  // Validate incoming data
  if (!productId || !quantity || !fullname || !mobileNo || !emailAddress || !city || !pinCode || !shippingAddress) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  // Simulate sending email (replace this with your actual email sending logic)
  sendEmail({ productId, quantity, fullname, mobileNo, emailAddress, city, pinCode, shippingAddress })
      .then(() => {
          // Email sent successfully
          res.json({ success: true, message: 'Order placed successfully!' });
      })
      .catch(err => {
          // If there's an error sending the email, respond with JSON
          console.error("Error sending email:", err);
          res.status(500).json({ success: false, message: 'Error sending email' });
      });
});

// invoice generator testing 


// Route to get the buy page
app.get('/buy/:productId', (req, res) => {
    // Fetch product details based on productId
    const product = {
        _id: req.params.productId,
        name: "Sample Product", // Replace with actual product name
        price: 150, // Replace with actual product price
        imageUrls: ["https://example.com/image.jpg"], // Replace with actual image URLs
        description: "Sample product description." // Replace with actual product description
    };

    res.render('buy', { product });
});

// Route to create and download an invoice
app.post('/place-order', (req, res) => {
    const { productId, quantity, fullname, mobileNo, emailAddress, city, pinCode, shippingAddress } = req.body;
    const product = {
        name: "Sample Product", // Replace with actual product retrieval based on productId
        price: 150 // Replace with actual product price
    };
    const total = product.price * quantity;

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, 'invoices', `invoice_${Date.now()}.pdf`);
    
    doc.pipe(fs.createWriteStream(filePath));

    // Invoice content
    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown();
    doc.text(`Product: ${product.name}`);
    doc.text(`Price: ₹${product.price}`);
    doc.text(`Quantity: ${quantity}`);
    doc.text(`Total: ₹${total}`);
    doc.moveDown();
    doc.text(`Customer Information:`);
    doc.text(`Full Name: ${fullname}`);
    doc.text(`Mobile No: ${mobileNo}`);
    doc.text(`Email Address: ${emailAddress}`);
    doc.text(`City/State: ${city}`);
    doc.text(`Pin Code: ${pinCode}`);
    doc.text(`Shipping Address: ${shippingAddress}`);

    doc.end();

    // Store the path of the generated invoice in the session
    req.session.invoicePath = filePath;

    // Respond back to the client (you can also render a success page or redirect)
    res.json({ success: true, message: 'Order placed successfully! You can download your invoice.', invoicePath: filePath });
});

// Route to download the invoice
app.get('/download-invoice', (req, res) => {
    const invoicePath = req.session.invoicePath;

    if (!invoicePath) {
        return res.status(404).send('Invoice not found');
    }

    res.download(invoicePath, (err) => {
        if (err) {
            console.error("File download error:", err);
            res.status(500).send("File download error");
        }
    });
});

// download Invoice button  START 
// const PDFDocument = require('pdfkit');
// const fs = require('fs');

app.post('/download-invoice', (req, res) => {
    const { productId, quantity, fullname, mobileNo, emailAddress, city, pinCode, shippingAddress } = req.body;

    // Create a new PDF document
    const doc = new PDFDocument();
    const fileName = `Invoice-${Date.now()}.pdf`;
    const filePath = `./invoices/${fileName}`;

    // Pipe the PDF into a writable stream
    doc.pipe(fs.createWriteStream(filePath));

    // Add invoice details to PDF
    doc.fontSize(18).text("Invoice", { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Product: ${req.body.productName}`);
    doc.text(`Price: ₹${req.body.productPrice}`);
    doc.text(`Quantity: ${quantity}`);
    doc.text(`Total: ₹${req.body.productPrice * quantity}`);
    doc.moveDown();
    doc.fontSize(14).text("Customer Information");
    doc.text(`Name: ${fullname}`);
    doc.text(`Mobile No: ${mobileNo}`);
    doc.text(`Email: ${emailAddress}`);
    doc.text(`City: ${city}`);
    doc.text(`Pin Code: ${pinCode}`);
    doc.text(`Shipping Address: ${shippingAddress}`);
    
    // Finalize the PDF
    doc.end();

    // Wait for the PDF to be created, then send it to the client
    doc.on('finish', () => {
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error("Error sending the file:", err);
            }
            // Clean up after download
            fs.unlinkSync(filePath);
        });
    });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

//  end this code

















// const express = require("express");
// const path = require("path");
// const bcrypt = require("bcryptjs");
// const mongoose = require("mongoose");
// const collection = require("./mongodb");
// const Product = require("./product");
// const cookieParser = require("cookie-parser");
// const session = require("express-session");
// const hbs = require("hbs");

// const app = express();

// const templatePath = path.join(__dirname, "../templates");
// const publicPath = path.join(__dirname, "../public");

// app.use(express.static(publicPath));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// app.use(session({
//     secret: 'mysecret',
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 86400000 } // 24 hours
// }));

// app.set("view engine", "hbs");
// app.set("views", templatePath);

// // Connect to MongoDB
// mongoose.connect('mongodb+srv://kunalrawal:kunalrawal@cluster0.7szni.mongodb.net/logintesting', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('MongoDB Connected'))
// .catch(err => console.log('MongoDB Connection Error:', err));

// // Middleware to check if the user is logged in
// const checkLogin = (req, res, next) => {
//     const token = req.cookies.authToken;
//     if (!token) return res.redirect('/login');
//     next();
// };

// // Render homepage with dynamic navbar and product display
// app.get('/', async (req, res) => {
//     try {
//         const products = await Product.find(); // Fetch products
//         const username = req.cookies.username || ''; // Get username from cookies if logged in
//         res.render('home', { products, username }); // Pass username and products to home template
//     } catch (err) {
//         res.status(500).send("Error loading products");
//     }
// });

// // Login page
// app.get('/login', (req, res) => {
//     res.render('login');
// });

// // Signup page
// app.get('/signup', (req, res) => {
//     res.render('signup');
// });

// // Profile page (protected route)
// app.get('/profile', checkLogin, async (req, res) => {
//     const username = req.cookies.username;
//     const user = await collection.findOne({ name: username });
//     if (user) {
//         res.render('profile', { user });
//     } else {
//         res.status(404).send("User not found");
//     }
// });

// // Handle signup
// app.post("/signup", async (req, res) => {
//     try {
//         const { name, password, email } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
//         const newUser = new collection({ name, password: hashedPassword, email });
//         await newUser.save(); // Save user to database

//         // Set cookies for session
//         res.cookie('authToken', 'loggedIn', { maxAge: 86400000, httpOnly: true });
//         res.cookie('username', name, { maxAge: 86400000 });
//         res.redirect('/profile');
//     } catch (err) {
//         res.status(500).send("Error during signup");
//     }
// });

// // Handle login
// app.post("/login", async (req, res) => {
//     try {
//         const { name, password } = req.body;
//         const user = await collection.findOne({ name });

//         if (user && await bcrypt.compare(password, user.password)) {
//             // Set cookies for session
//             res.cookie('authToken', 'loggedIn', { maxAge: 86400000, httpOnly: true });
//             res.cookie('username', name, { maxAge: 86400000 });
//             res.redirect('/profile');
//         } else {
//             res.status(401).send("Invalid username or password");
//         }
//     } catch (err) {
//         res.status(500).send("Error during login");
//     }
// });

// // Handle logout
// app.post('/logout', (req, res) => {
//     res.clearCookie('authToken');
//     res.clearCookie('username');
//     res.redirect('/');
// });

// // Start the server
// app.listen(3000, () => {
//     console.log("Server running on port 3000");
// });
