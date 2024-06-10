import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import ItemPage from './pages/ItemPage';
import OrderPage from './pages/OrderPage';
import MenuList from './pages/MenuList';
import UserList from './pages/UserList';
import RoleList from './pages/RoleList';
import PlainPage from './pages/PlainPage';

const initializeLocalStorage = () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const admin = users.find((user) => user.username === 'Admin');

  if (!admin) {
    const defaultAdmin = {
      key: '1',
      username: 'Admin',
      name: '系统管理员',
      email: 'admin@example.com',
      password: 'Admin123456',
      addedTime: new Date().toLocaleString(),
      lastLogin: new Date().toLocaleString(),
      isEnabled: true,
      roles: ['管理员'],
    };
    users.push(defaultAdmin);
    localStorage.setItem('users', JSON.stringify(users));
  }
};

const App = () => {
  useEffect(() => {
    initializeLocalStorage();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/adminPage" element={<AdminPage />}>
          <Route path="items" element={<ItemPage />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="menulist" element={<MenuList />} />
          <Route path="userlist" element={<UserList />} />
          <Route path="rolelist" element={<RoleList />} />
          <Route path="*" element={<PlainPage />} />
          <Route path="home" element={<div>Admin Dashboard</div>} />
        </Route>
        <Route path="/userPage" element={<UserPage />}>
          <Route path="items" element={<ItemPage />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="*" element={<PlainPage />} />
          <Route path="home" element={<div>User Dashboard</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
