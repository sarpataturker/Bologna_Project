import React, { useState } from 'react';
import axios from 'axios';

const KaynakKitap = () => {
  const [dersId, setDersId] = useState('');
  const [kitap, setKitap] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/kitap', { dersId, kitap });
      setMessage('Kaynak kitap başarıyla eklendi');
    } catch (error) {
      setMessage('Kaynak kitap eklenirken bir hata oluştu');
    }
  };

  return (
    <div>
      <h2>Kaynak Kitap Ekle</h2>
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
          <label>Kaynak Kitap:</label>
          <input
            type="text"
            value={kitap}
            onChange={(e) => setKitap(e.target.value)}
          />
        </div>
        <button type="submit">Ekle</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default KaynakKitap;