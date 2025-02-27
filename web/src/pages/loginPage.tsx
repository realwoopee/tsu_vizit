import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 text-left">
      <div className="card p-4 shadow" style={{ maxWidth: '800px', width: '100vw ' }}>
        <h2 className="text-left mb-4">Вход</h2>
        <form onSubmit={handleSubmit}>
        
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
          <button type="submit" className="btn btn-primary w-100">Войти</button>
          <Link to="/register" className="btn btn-secondary w-100 mt-3">Нет аккаунта? Зарегистрироваться</Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;