const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');

// Get all actions for a complaint
router.get('/complaint/:complaintId', actionController.getActionsByComplaint);

// Create a new action
router.post('/', actionController.createAction);

// Update an action
router.put('/:id', actionController.updateAction);

// Delete an action
router.delete('/:id', actionController.deleteAction);

module.exports = router; 