import React, { useState, useEffect } from 'react';
import { storage } from '../utils/localStorage';
import './CRUD.css';

const User = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = storage.getUsers();
    // Remove password from display
    const usersWithoutPassword = allUsers.map(({ password, ...rest }) => rest);
    setUsers(usersWithoutPassword);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    const allUsers = storage.getUsers();

    if (editingUser) {
      // Update existing user
      const updatedUsers = allUsers.map(user =>
        user.id === editingUser.id
          ? { ...user, ...formData }
          : user
      );
      storage.saveUsers(updatedUsers);
    } else {
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      allUsers.push(newUser);
      storage.saveUsers(allUsers);
    }

    resetForm();
    loadUsers();
  };

  const handleEdit = (user) => {
    const allUsers = storage.getUsers();
    const fullUser = allUsers.find(u => u.id === user.id);
    setFormData({
      name: fullUser.name,
      email: fullUser.email,
      password: '' // Don't pre-fill password
    });
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const allUsers = storage.getUsers();
      const filteredUsers = allUsers.filter(user => user.id !== userId);
      storage.saveUsers(filteredUsers);
      loadUsers();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '' });
    setEditingUser(null);
    setShowForm(false);
    setError('');
  };

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h1>User Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>

      {showForm && (
        <div className="crud-form">
          <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={editingUser ? "Enter new password (leave blank to keep current)" : "Enter password"}
                required={!editingUser}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingUser ? 'Update User' : 'Add User'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="crud-table-container">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-message">No users found</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleEdit(user)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="btn-delete">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;

