import React, { useState } from 'react';
import axios from 'axios';

const DersIcerigi = () => {
  const [dersId, setDersId] = useState('');
  const [icerik, setIcerik] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/icerik', { dersId, icerik });
      setMessage('İçerik başarıyla eklendi');
    } catch (error) {
      setMessage('İçerik eklenirken bir hata oluştu');
    }
  };

  return (
    <div>
      <h2>Ders İçeriği Ekle</h2>
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
          <label>İçerik:</label>
          <input
            type="text"
            value={icerik}
            onChange={(e) => setIcerik(e.target.value)}
          />
        </div>
        <button type="submit">Ekle</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DersIcerigi;