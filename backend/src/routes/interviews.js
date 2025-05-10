const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

// Get all interviews for a complaint
router.get('/complaint/:complaintId', interviewController.getInterviewsByComplaint);

// Create a new interview
router.post('/', interviewController.createInterview);

// Update an interview
router.put('/:id', interviewController.updateInterview);

// Delete an interview
router.delete('/:id', interviewController.deleteInterview);

module.exports = router; 