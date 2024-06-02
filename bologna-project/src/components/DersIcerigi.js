import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DersIcerigi = () => {
  const [dersler, setDersler] = useState([]);
  const [selectedDers, setSelectedDers] = useState('');
  const [icerik, setIcerik] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'hoca') {
      navigate('/'); // Öğretim elemanı değilse anasayfaya yönlendir
    } else {
      fetchDersler();
    }
  }, [navigate]);

  const fetchDersler = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/dersler');
      setDersler(response.data);
    } catch (error) {
      console.error('Dersler yüklenemedi:', error);
    }
  };

  const handleDersChange = (event) => {
    setSelectedDers(event.target.value);
  };

  const handleIcerikChange = (event) => {
    setIcerik(event.target.value);
  };

  const handleKaydetClick = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/icerik', { dersId: selectedDers, icerik });
      console.log(response.data.message);
      setErrorMessage('');
    } catch (error) {
      console.error('İçerik kaydetme hatası:', error.response.data.message);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Ders İçeriği</h2>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <div>
        <h3>Ders Seç:</h3>
        <select onChange={handleDersChange} value={selectedDers}>
          <option value="">Ders Seçiniz</option>
          {dersler.map((ders) => (
            <option key={ders.ders_id} value={ders.ders_id}>{ders.name}</option>
          ))}
        </select>
      </div>
      <div>
        <h3>İçerik:</h3>
        <textarea onChange={handleIcerikChange} value={icerik}></textarea>
      </div>
      <button onClick={handleKaydetClick}>Kaydet</button>
    </div>
  );
};

export default DersIcerigi;