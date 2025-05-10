const { Interview } = require('../models');

// Get all interviews for a specific complaint
exports.getInterviewsByComplaint = async (req, res) => {
    try {
        const interviews = await Interview.findAll({
            where: { complaintId: req.params.complaintId }
        });
        res.json(interviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new interview
exports.createInterview = async (req, res) => {
    try {
        const interview = await Interview.create(req.body);
        res.status(201).json(interview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an interview
exports.updateInterview = async (req, res) => {
    try {
        const interview = await Interview.findByPk(req.params.id);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }
        await interview.update(req.body);
        res.json(interview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an interview
exports.deleteInterview = async (req, res) => {
    try {
        const interview = await Interview.findByPk(req.params.id);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }
        await interview.destroy();
        res.json({ message: 'Interview deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 