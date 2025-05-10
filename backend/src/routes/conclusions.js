const express = require('express');
const router = express.Router();
const conclusionController = require('../controllers/conclusionController');

// Get conclusion for a complaint
router.get('/complaint/:complaintId', conclusionController.getConclusionByComplaint);

// Create a new conclusion
router.post('/', conclusionController.createConclusion);

// Update a conclusion
router.put('/:id', conclusionController.updateConclusion);

// Delete a conclusion
router.delete('/:id', conclusionController.deleteConclusion);

module.exports = router; 