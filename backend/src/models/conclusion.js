const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conclusion = sequelize.define('Conclusion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  complaintId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Complaints',
      key: 'id'
    }
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  decision: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'final'),
    defaultValue: 'draft'
  }
}, {
  timestamps: true,
  tableName: 'conclusions'
});

module.exports = Conclusion; 