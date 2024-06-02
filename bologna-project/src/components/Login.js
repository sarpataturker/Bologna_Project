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
      const { token } = response.data;
      localStorage.setItem('token', token); // Tokeni localStorage'e sakla
      navigate('/ders-atama'); // Başarılı login durumunda DersAtama sayfasına yönlendir
    } catch (error) {
      console.error('Login error:', error);
      // İleride kullanıcıya uygun bir hata mesajı gösterilebilir
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
          required // TC alanı zorunlu
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required // Parola alanı zorunlu
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
