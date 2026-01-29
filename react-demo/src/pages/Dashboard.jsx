import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { storage } from '../utils/localStorage';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const users = storage.getUsers();
  const employees = storage.getEmployees();

  const stats = [
    {
      title: 'Total Users',
      count: users.length,
      icon: '👥',
      color: '#667eea'
    },
    {
      title: 'Total Employees',
      count: employees.length,
      icon: '💼',
      color: '#764ba2'
    },
    {
      title: 'Active Sessions',
      count: user ? 1 : 0,
      icon: '🔐',
      color: '#f093fb'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Dashboard, {user?.name}!</h1>
        <p>Here's an overview of your application</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderTopColor: stat.color }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p className="stat-count">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <div className="action-card">
            <h3>Manage Users</h3>
            <p>View, add, edit, or delete users</p>
          </div>
          <div className="action-card">
            <h3>Manage Employees</h3>
            <p>View, add, edit, or delete employees</p>
          </div>
          <div className="action-card">
            <h3>Update Profile</h3>
            <p>Edit your personal information</p>
          </div>
          <div className="action-card">
            <h3>Contact Support</h3>
            <p>Get in touch with our team</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

