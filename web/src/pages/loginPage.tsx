import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate  } from 'react-router-dom';
import { fetchAndSavePermissions } from '../services/profileData';

const LoginPage = () => {
  const baseUrl = 'https://vizit.90.188.95.63.sslip.io/api/'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

        try {
            const response = await fetch(`${baseUrl}auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('refreshToken', data.refreshToken);
                await fetchAndSavePermissions()
                navigate('/main'); 
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Ошибка авторизации');
            }
        } catch (err) {
            const errorMessage = 'Произошла ошибка при попытке авторизации';
            setError('Произошла ошибка при попытке авторизации');
            alert(errorMessage);
        }
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
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
          <button type="submit" className="btn btn-primary w-100">Войти</button>
          <Link to="/register" className="btn btn-secondary w-100 mt-3">Нет аккаунта? Зарегистрироваться</Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;