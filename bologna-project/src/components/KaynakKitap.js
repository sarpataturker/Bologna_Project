import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KaynakKitap = () => {
  const [kitaplar, setKitaplar] = useState([]);
  const [selectedDers, setSelectedDers] = useState('');
  const [kitap, setKitap] = useState('');
  const [dersler, setDersler] = useState([]);

  useEffect(() => {
    fetchKitaplar();
    fetchDersler();
  }, []);

  const fetchKitaplar = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/kaynak-kitaplar');
      setKitaplar(response.data);
    } catch (error) {
      console.error('Kitaplar yüklenemedi:', error);
    }
  };

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

  const handleKitapChange = (event) => {
    setKitap(event.target.value);
  };

  const handleKitapKaydet = async () => {
    try {
      await axios.post('http://localhost:5001/api/kaynak-kitap-kaydet', { dersId: selectedDers, kitap });
      fetchKitaplar(); // Kitapları yeniden yükle
    } catch (error) {
      console.error('Kitap kaydedilemedi:', error);
    }
  };

  return (
    <div>
      <h2>Kaynak Kitaplar</h2>
      <div>
        <h3>Kaynak Kitap Ekle</h3>
        <select onChange={handleDersChange} value={selectedDers}>
          <option value="">Ders Seçiniz</option>
          {dersler.map((ders) => (
            <option key={ders.ders_id} value={ders.ders_id}>{ders.name}</option>
          ))}
        </select>
        <textarea onChange={handleKitapChange} value={kitap} placeholder="Kaynak kitap giriniz" />
        <button onClick={handleKitapKaydet}>Kaydet</button>
      </div>
      <div>
        <h3>Kaynak Kitaplar</h3>
        <ul>
          {kitaplar.map((kitap, index) => (
            <li key={index}>{kitap.dersId}: {kitap.kitap}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default KaynakKitap;