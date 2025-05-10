const express = require('express');
const router = express.Router();
const procedureController = require('../controllers/procedureController');

// Get all procedures for a complaint
router.get('/complaint/:complaintId', procedureController.getProceduresByComplaint);

// Create a new procedure
router.post('/', procedureController.createProcedure);

// Update a procedure
router.put('/:id', procedureController.updateProcedure);

// Delete a procedure
router.delete('/:id', procedureController.deleteProcedure);

module.exports = router; 