import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [tc, setTc] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/login', { tc, password });
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      if (role === 'idareci') {
        navigate('/ders-atama');
      } else if (role === 'hoca') {
        navigate('/ders-icerigi');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError('Giriş hatası: Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>TC:</label>
        <input
          type="text"
          value={tc}
          onChange={(e) => setTc(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;