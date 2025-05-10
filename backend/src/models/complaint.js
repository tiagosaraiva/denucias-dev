const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Complaint = sequelize.define('Complaint', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  number: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.STRING,
    allowNull: false
  },
  characteristic: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  responsible_instance: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.STRING,
    allowNull: false
  },
  responsible1: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.STRING,
    allowNull: true
  },
  responsible2: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.STRING,
    allowNull: true
  },
  received_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'complaints'
});

// Static methods
Complaint.getAll = async () => {
  return await Complaint.findAll();
};

Complaint.getById = async (id) => {
  return await Complaint.findByPk(id);
};

Complaint.createComplaint  = async (data) => {
  return await Complaint.create(data);
};

Complaint.update = async (id, data) => {
  const complaint = await Complaint.findByPk(id);
  if (complaint) {
    await complaint.update(data);
    return complaint;
  }
  return null;
};

Complaint.delete = async (id) => {
  const complaint = await Complaint.findByPk(id);
  if (complaint) {
    await complaint.destroy();
    return true;
  }
  return false;
};

module.exports = Complaint; 