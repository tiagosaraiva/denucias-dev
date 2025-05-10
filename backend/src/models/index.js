const sequelize = require('../config/database');
const Interview = require('./interview');
const Complaint = require('./complaint');
const Action = require('./action');
const Conclusion = require('./conclusion');
const User = require('./user');

// Define associations
Interview.belongsTo(Complaint, {
  foreignKey: 'complaintId',
  as: 'complaint'
});

Complaint.hasMany(Interview, {
  foreignKey: 'complaintId',
  as: 'interviews'
});

Action.belongsTo(Complaint, {
  foreignKey: 'complaintId',
  as: 'complaint'
});

Complaint.hasMany(Action, {
  foreignKey: 'complaintId',
  as: 'actions'
});

Conclusion.belongsTo(Complaint, {
  foreignKey: 'complaintId',
  as: 'complaint'
});

Complaint.hasOne(Conclusion, {
  foreignKey: 'complaintId',
  as: 'conclusion'
});

// Sync all models
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

module.exports = {
    sequelize,
    Interview,
    Complaint,
    Action,
    Conclusion,
    User
}; 