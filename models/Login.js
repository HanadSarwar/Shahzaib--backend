const mongoose = require('mongoose');

// Login model for login page (email and password)
const LoginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Login', LoginSchema);
