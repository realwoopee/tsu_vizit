import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';

const RegistrationPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate('/main');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 text-left">
      <div className="card p-4 shadow" style={{ maxWidth: '800px', width: '100vw ' }}>
        <h2 className="text-left mb-4">Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3" style={{ textAlign: 'left' }}>
            <label htmlFor="firstName" className="form-label">Имя</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 text-left" style={{ textAlign: 'left' }}>
            <label htmlFor="lastName" className="form-label">Фамилия</label>
            <input
              type="text"
              className="form-control"
              id="lastName"  
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 text-left" style={{ textAlign: 'left' }}>
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3 text-left" style={{ textAlign: 'left' }}>
            <label htmlFor="password" className="form-label">Пароль</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Зарегистрироваться</button>
          <Link to="/login" className="btn btn-secondary w-100 mt-3">Уже есть аккаунт? Войти</Link>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;