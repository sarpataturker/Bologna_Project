import React, { useState } from 'react';
import axios from 'axios';

const OgrenimCiktilari = () => {
  const [dersId, setDersId] = useState('');
  const [cikti, setCikti] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/cikti', { dersId, cikti });
      setMessage('Öğrenim çıktısı başarıyla eklendi');
    } catch (error) {
      setMessage('Öğrenim çıktısı eklenirken bir hata oluştu');
    }
  };

  return (
    <div>
      <h2>Öğrenim Çıktısı Ekle</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ders ID:</label>
          <input
            type="text"
            value={dersId}
            onChange={(e) => setDersId(e.target.value)}
          />
        </div>
        <div>
          <label>Öğrenim Çıktısı:</label>
          <input
            type="text"
            value={cikti}
            onChange={(e) => setCikti(e.target.value)}
          />
        </div>
        <button type="submit">Ekle</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default OgrenimCiktilari;