
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Login = require('../models/Login');
const bcrypt = require('bcrypt');

// Registration Route
router.post('/register', async (req, res) => {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) {
			return res.status(400).json({ message: 'All fields are required.' });
		}

		// Check if user already exists
		const existingUser = await User.findOne({ $or: [{ email }, { username }] });
		if (existingUser) {
			return res.status(409).json({ message: 'Username or email already exists.' });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create new user
		const newUser = new User({ username, email, password: hashedPassword });
		await newUser.save();

		res.status(201).json({ message: 'User registered successfully.' });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error: error.message });
	}
});

module.exports = router;

// Login Route
// router.post('/login', async (req, res) => {
// 	try {
// 		const { gmail, password } = req.body;
// 		if (!gmail || !password) {
// 			return res.status(400).json({ message: 'Gmail and password are required.' });
// 		}

// 		// Find login user by gmail
// 		const loginUser = await Login.findOne({ gmail });
// 		if (!loginUser) {
// 			return res.status(401).json({ message: 'Invalid gmail or password.' });
// 		}

// 		// Compare password
// 		const isMatch = await bcrypt.compare(password, loginUser.password);
// 		if (!isMatch) {
// 			return res.status(401).json({ message: 'Invalid gmail or password.' });
// 		}

// 		res.status(200).json({ message: 'Login successful.' });
// 	} catch (error) {
// 		res.status(500).json({ message: 'Server error', error: error.message });
// 	}
// });
