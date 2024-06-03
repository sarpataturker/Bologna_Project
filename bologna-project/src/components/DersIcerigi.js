import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DersIcerigi = () => {
  const [icerikler, setIcerikler] = useState([]);
  const [selectedDers, setSelectedDers] = useState('');
  const [icerik, setIcerik] = useState('');

  useEffect(() => {
    fetchIcerikler();
  }, []);

  const fetchIcerikler = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/icerik');
      setIcerikler(response.data);
    } catch (error) {
      console.error('İçerikler yüklenemedi:', error);
    }
  };

  const handleDersChange = (event) => {
    setSelectedDers(event.target.value);
  };

  const handleIcerikChange = (event) => {
    setIcerik(event.target.value);
  };

  const handleIcerikKaydet = async () => {
    try {
      await axios.post('http://localhost:5001/api/ders-icerigi-kaydet', { dersId: selectedDers, icerik });
      fetchIcerikler(); // İçerikleri yeniden yükle
    } catch (error) {
      console.error('İçerik kaydedilemedi:', error);
    }
  };

  return (
    <div>
      <h2>Ders İçeriği</h2>
      <div>
        <h3>İçerik Ekle</h3>
        <select onChange={handleDersChange} value={selectedDers}>
          <option value="">Ders Seçiniz</option>
          {icerikler.map((ders) => (
            <option key={ders.dersId} value={ders.dersId}>{ders.dersId}</option>
          ))}
        </select>
        <textarea onChange={handleIcerikChange} value={icerik} placeholder="İçerik giriniz" />
        <button onClick={handleIcerikKaydet}>Kaydet</button>
      </div>
      <div>
        <h3>İçerikler</h3>
        <ul>
          {icerikler.map((icerik, index) => (
            <li key={index}>{icerik.dersId}: {icerik.icerik}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DersIcerigi;