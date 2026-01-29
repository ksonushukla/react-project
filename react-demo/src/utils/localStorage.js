// LocalStorage utility functions

export const storage = {
  // Users storage
  getUsers: () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  },

  saveUsers: (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  },

  // Employees storage
  getEmployees: () => {
    const employees = localStorage.getItem('employees');
    return employees ? JSON.parse(employees) : [];
  },

  saveEmployees: (employees) => {
    localStorage.setItem('employees', JSON.stringify(employees));
  },

  // Current user (logged in user)
  getCurrentUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user) => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  },

  // Clear all data
  clearAll: () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('users');
    localStorage.removeItem('employees');
  }
};

