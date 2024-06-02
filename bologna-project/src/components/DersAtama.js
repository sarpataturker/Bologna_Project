import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DersAtama = () => {
  const [dersler, setDersler] = useState([]);
  const [hocalar, setHocalar] = useState([]);
  const [selectedDers, setSelectedDers] = useState('');
  const [selectedHoca, setSelectedHoca] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'idareci') {
      navigate('/'); // İdareci değilse anasayfaya yönlendir
    } else {
      fetchDersler();
      fetchHocalar();
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

  const fetchHocalar = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/hocalar');
      setHocalar(response.data);
    } catch (error) {
      console.error('Hocalar yüklenemedi:', error);
    }
  };

  const handleDersChange = (event) => {
    setSelectedDers(event.target.value);
  };

  const handleHocaChange = (event) => {
    setSelectedHoca(event.target.value);
  };

  const handleAtaClick = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/ata', { dersId: selectedDers, hocaId: selectedHoca });
      console.log(response.data.message);
      setErrorMessage('');
      fetchDersler();
      fetchHocalar();
    } catch (error) {
      console.error('Ders atama hatası:', error.response.data.message);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Ders Atama</h2>
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
        <h3>Hoca Seç:</h3>
        <select onChange={handleHocaChange} value={selectedHoca}>
          <option value="">Hoca Seçiniz</option>
          {hocalar.map((hoca) => (
            <option key={hoca.hoca_id} value={hoca.hoca_id}>{hoca.name}</option>
          ))}
        </select>
      </div>
      <button onClick={handleAtaClick}>Ata</button>
    </div>
  );
};

export default DersAtama;