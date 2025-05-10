const Procedure = require('../models/procedure');

exports.getProceduresByComplaint = async (req, res) => {
  try {
    const procedures = await Procedure.getByComplaintId(req.params.complaintId);
    res.json(procedures);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching procedures', error: error.message });
  }
};

exports.createProcedure = async (req, res) => {
  try {
    const procedure = await Procedure.create(req.body);
    res.status(201).json(procedure);
  } catch (error) {
    res.status(500).json({ message: 'Error creating procedure', error: error.message });
  }
};

exports.updateProcedure = async (req, res) => {
  try {
    const procedure = await Procedure.update(req.params.id, req.body);
    if (!procedure) {
      return res.status(404).json({ message: 'Procedure not found' });
    }
    res.json(procedure);
  } catch (error) {
    res.status(500).json({ message: 'Error updating procedure', error: error.message });
  }
};

exports.deleteProcedure = async (req, res) => {
  try {
    const result = await Procedure.delete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Procedure not found' });
    }
    res.json({ message: 'Procedure deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting procedure', error: error.message });
  }
}; 