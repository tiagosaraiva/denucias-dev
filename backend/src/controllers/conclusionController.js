const { Conclusion } = require('../models');

// Get conclusion for a specific complaint
exports.getConclusionByComplaint = async (req, res) => {
    try {
        const conclusion = await Conclusion.findOne({
            where: { complaintId: req.params.complaintId }
        });
        res.json(conclusion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new conclusion
exports.createConclusion = async (req, res) => {
    try {
        const conclusion = await Conclusion.create(req.body);
        res.status(201).json(conclusion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a conclusion
exports.updateConclusion = async (req, res) => {
    try {
        const conclusion = await Conclusion.findByPk(req.params.id);
        if (!conclusion) {
            return res.status(404).json({ message: 'Conclusion not found' });
        }
        await conclusion.update(req.body);
        res.json(conclusion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a conclusion
exports.deleteConclusion = async (req, res) => {
    try {
        const conclusion = await Conclusion.findByPk(req.params.id);
        if (!conclusion) {
            return res.status(404).json({ message: 'Conclusion not found' });
        }
        await conclusion.destroy();
        res.json({ message: 'Conclusion deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 