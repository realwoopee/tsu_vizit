import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationPage from './pages/registrationPage';
import LoginPage from './pages/loginPage';
import MainPage from './pages/mainPage';
import Users from './pages/users'

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/users" element={<Users />}/>
      </Routes>
    </Router>
  );
};

export default AppRouter;