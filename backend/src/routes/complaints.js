const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');

// Get all complaints
router.get('/', complaintController.getAllComplaints);

// Get complaint status summary
router.get('/status-summary', complaintController.getStatusSummary);

// Get complaints by category
router.get('/by-category', complaintController.getComplaintsByCategory);

// Get a specific complaint
router.get('/:id', complaintController.getComplaintById);

// Create a new complaint
router.post('/', complaintController.createComplaint);

// Update a complaint
router.put('/:id', complaintController.updateComplaint);

// Delete a complaint
router.delete('/:id', complaintController.deleteComplaint);

module.exports = router; 