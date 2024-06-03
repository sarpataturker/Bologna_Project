import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OgrenimCiktilari = () => {
  const [ciktilar, setCiktilar] = useState([]);
  const [selectedDers, setSelectedDers] = useState('');
  const [cikti, setCikti] = useState('');

  useEffect(() => {
    fetchCiktilar();
  }, []);

  const fetchCiktilar = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/ogrenim-ciktilari');
      setCiktilar(response.data);
    } catch (error) {
      console.error('Çıktılar yüklenemedi:', error);
    }
  };

  const handleDersChange = (event) => {
    setSelectedDers(event.target.value);
  };

  const handleCiktiChange = (event) => {
    setCikti(event.target.value);
  };

  const handleCiktiKaydet = async () => {
    try {
      await axios.post('http://localhost:5001/api/ogrenim-cikti-kaydet', { dersId: selectedDers, cikti });
      fetchCiktilar(); // Çıktıları yeniden yükle
    } catch (error) {
      console.error('Çıktı kaydedilemedi:', error);
    }
  };

  return (
    <div>
      <h2>Öğrenim Çıktıları</h2>
      <div>
        <h3>Öğrenim Çıktısı Ekle</h3>
        <select onChange={handleDersChange} value={selectedDers}>
          <option value="">Ders Seçiniz</option>
          {ciktilar.map((ders) => (
            <option key={ders.dersId} value={ders.dersId}>{ders.dersId}</option>
          ))}
        </select>
        <textarea onChange={handleCiktiChange} value={cikti} placeholder="Öğrenim çıktısı giriniz" />
        <button onClick={handleCiktiKaydet}>Kaydet</button>
      </div>
      <div>
        <h3>Öğrenim Çıktıları</h3>
        <ul>
          {ciktilar.map((cikti, index) => (
            <li key={index}>{cikti.dersId}: {cikti.cikti}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OgrenimCiktilari;