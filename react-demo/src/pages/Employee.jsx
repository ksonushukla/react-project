import React, { useState, useEffect } from 'react';
import { storage } from '../utils/localStorage';
import './CRUD.css';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    salary: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    const allEmployees = storage.getEmployees();
    setEmployees(allEmployees);
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

    if (!formData.name || !formData.email || !formData.position || !formData.department || !formData.salary) {
      setError('Please fill in all fields');
      return;
    }

    const allEmployees = storage.getEmployees();

    if (editingEmployee) {
      // Update existing employee
      const updatedEmployees = allEmployees.map(employee =>
        employee.id === editingEmployee.id
          ? { ...employee, ...formData }
          : employee
      );
      storage.saveEmployees(updatedEmployees);
    } else {
      // Create new employee
      const newEmployee = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      allEmployees.push(newEmployee);
      storage.saveEmployees(allEmployees);
    }

    resetForm();
    loadEmployees();
  };

  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      position: employee.position,
      department: employee.department,
      salary: employee.salary
    });
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDelete = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const allEmployees = storage.getEmployees();
      const filteredEmployees = allEmployees.filter(employee => employee.id !== employeeId);
      storage.saveEmployees(filteredEmployees);
      loadEmployees();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', position: '', department: '', salary: '' });
    setEditingEmployee(null);
    setShowForm(false);
    setError('');
  };

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h1>Employee Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add New Employee'}
        </button>
      </div>

      {showForm && (
        <div className="crud-form">
          <h2>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
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
              <label>Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Enter position"
                required
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter department"
                required
              />
            </div>

            <div className="form-group">
              <label>Salary</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Enter salary"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingEmployee ? 'Update Employee' : 'Add Employee'}
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
              <th>Position</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-message">No employees found</td>
              </tr>
            ) : (
              employees.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.position}</td>
                  <td>{employee.department}</td>
                  <td>${employee.salary}</td>
                  <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleEdit(employee)} className="btn-edit">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(employee.id)} className="btn-delete">
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

export default Employee;

