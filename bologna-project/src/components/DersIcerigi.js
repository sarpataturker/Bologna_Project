import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DersIcerigi = () => {
  const [dersler, setDersler] = useState([]);
  const [selectedDers, setSelectedDers] = useState('');
  const [icerik, setIcerik] = useState('');
  const [kitap, setKitap] = useState('');
  const [cikti, setCikti] = useState('');

  useEffect(() => {
    // Burada öğretmene atanmış dersleri çekebiliriz.
    const fetchDersler = async () => {
      const response = await axios.get('http://localhost:5001/api/atanan-dersler');
      setDersler(response.data);
    };

    fetchDersler();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/ders-icerigi-kaydet', { dersId: selectedDers, icerik, kitap, cikti });
      alert('İçerik başarıyla kaydedildi!');
    } catch (error) {
      console.error('İçerik kaydedilirken bir hata oluştu:', error);
      alert('İçerik kaydedilirken bir hata oluştu!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Ders Seç:</label>
        <select value={selectedDers} onChange={(e) => setSelectedDers(e.target.value)}>
          <option value="">Ders Seçiniz</option>
          {dersler.map((ders) => (
            <option key={ders.ders_id} value={ders.ders_id}>{ders.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label>İçerik:</label>
        <textarea value={icerik} onChange={(e) => setIcerik(e.target.value)} />
      </div>
      <div>
        <label>Kaynak Kitap:</label>
        <input type="text" value={kitap} onChange={(e) => setKitap(e.target.value)} />
      </div>
      <div>
        <label>Öğrenim Çıktısı:</label>
        <input type="text" value={cikti} onChange={(e) => setCikti(e.target.value)} />
      </div>
      <button type="submit">Kaydet</button>
    </form>
  );
};

export default DersIcerigi;