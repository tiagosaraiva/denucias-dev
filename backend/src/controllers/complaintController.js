const Complaint = require('../models/complaint');

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.getAll();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints', error: error.message });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.getById(req.params.id);
    if (!complaint) {
      //return res.status(404).json({ message: 'Complaint not found' });
      return res.status(200).json({ message: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaint', error: error.message });
  }
};

exports.createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.createComplaint(req.body);
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Error creating complaint', error: error.message });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.update(req.params.id, req.body);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Error updating complaint', error: error.message });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const result = await Complaint.delete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting complaint', error: error.message });
  }
};

exports.getStatusSummary = async (req, res) => {
  try {
    const summary = await Complaint.getStatusSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching status summary', error: error.message });
  }
};

exports.getComplaintsByCategory = async (req, res) => {
  try {
    const categories = await Complaint.getByCategory();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching complaints by category', error: error.message });
  }
}; 