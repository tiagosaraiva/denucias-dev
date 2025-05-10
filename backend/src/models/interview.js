const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Interview = sequelize.define('Interview', {
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
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    interviewer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    interviewee: {
        type: DataTypes.STRING,
        allowNull: false
    },
    summary: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true,
    tableName: 'interviews'
});

module.exports = Interview; 