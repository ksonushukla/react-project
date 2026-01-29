import React, { createContext, useState, useEffect } from 'react';
import { storage } from '../utils/localStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = storage.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = storage.getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Remove password before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      storage.setCurrentUser(userWithoutPassword);
      setUser(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, message: 'Invalid email or password' };
  };

  const signup = (userData) => {
    const users = storage.getUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'User with this email already exists' };
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    storage.saveUsers(users);

    // Auto login after signup
    const { password: _, ...userWithoutPassword } = newUser;
    storage.setCurrentUser(userWithoutPassword);
    setUser(userWithoutPassword);

    return { success: true, user: userWithoutPassword };
  };

  const logout = () => {
    storage.setCurrentUser(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    const users = storage.getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedUser };
      storage.saveUsers(users);
      
      const { password: _, ...userWithoutPassword } = users[userIndex];
      storage.setCurrentUser(userWithoutPassword);
      setUser(userWithoutPassword);
    }
  };

  const changePassword = (oldPassword, newPassword) => {
    const users = storage.getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex === -1) {
      return { success: false, message: 'User not found' };
    }

    if (users[userIndex].password !== oldPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }

    users[userIndex].password = newPassword;
    storage.saveUsers(users);

    return { success: true, message: 'Password changed successfully' };
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateUser,
      changePassword,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

