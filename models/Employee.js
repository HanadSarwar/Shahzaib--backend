const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: false
  },
  salary: {
    type: Number,
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);
