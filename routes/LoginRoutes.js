const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Login = require('../models/Login');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'email and password are required.' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

    // Save successful login to Login collection (avoid storing plaintext password ideally)
    await Login.create({ email: user.email, password: user.password });

    const jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
    const token = jwt.sign({ userId: user._id, email: user.email }, jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
