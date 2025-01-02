// src/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const { User } = require('./mongodb'); // Assuming this is your MongoDB model
const router = express.Router();

router.use(cookieParser());

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.cookie('userId', user._id, { maxAge: 24 * 60 * 60 * 1000 }); // 24 hours
            res.json({ message: 'Login successful', username: user.username });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    res.clearCookie('userId');
    res.json({ message: 'Logout successful' });
});

// Get User Profile
router.get('/profile', async (req, res) => {
    const userId = req.cookies.userId;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
});

module.exports = router;
