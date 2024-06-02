import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [tc, setTc] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/login', { tc, password });
      const { token, role } = response.data;
      localStorage.setItem('token', token); // Tokeni localStorage'e sakla
      localStorage.setItem('role', role); // Rolü localStorage'e sakla
      if (role === 'idareci') {
        navigate('/ders-atama'); // İdareci ise DersAtama sayfasına yönlendir
      } else if (role === 'hoca') {
        navigate('/ders-icerigi'); // Öğretim elemanı ise DersIcerigi sayfasına yönlendir
      }
    } catch (error) {
      console.error('Login error:', error);
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
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;