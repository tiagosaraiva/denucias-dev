const { Action } = require('../models');

// Get all actions for a specific complaint
exports.getActionsByComplaint = async (req, res) => {
    try {
        const actions = await Action.findAll({
            where: { complaintId: req.params.complaintId }
        });
        res.json(actions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new action
exports.createAction = async (req, res) => {
    try {
        const action = await Action.create(req.body);
        res.status(201).json(action);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an action
exports.updateAction = async (req, res) => {
    try {
        const action = await Action.findByPk(req.params.id);
        if (!action) {
            return res.status(404).json({ message: 'Action not found' });
        }
        await action.update(req.body);
        res.json(action);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an action
exports.deleteAction = async (req, res) => {
    try {
        const action = await Action.findByPk(req.params.id);
        if (!action) {
            return res.status(404).json({ message: 'Action not found' });
        }
        await action.destroy();
        res.json({ message: 'Action deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 