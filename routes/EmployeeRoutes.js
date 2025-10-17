const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const authenticateToken = require('../middleware/auth');

// Create employee
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, designation, experience, department, salary } = req.body;
    if (!name || !designation || experience === undefined) {
      return res.status(400).json({ message: 'name, designation and experience are required.' });
    }

    const employee = new Employee({ name, designation, experience, department, salary });
    await employee.save();
    res.status(201).json({ message: 'Employee created', employee });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// List employees
router.get('/', authenticateToken, async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update employee (partial update)
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid employee id' });
    }

    const allowedFields = ['name', 'designation', 'experience', 'department', 'salary'];
    const update = {};
    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        update[field] = req.body[field];
      }
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided to update' });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee updated', employee: updatedEmployee });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
