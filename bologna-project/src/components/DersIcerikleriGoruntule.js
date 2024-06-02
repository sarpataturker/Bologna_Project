import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DersIcerikleriGoruntule = () => {
  const [icerikler, setIcerikler] = useState([]);

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

  return (
    <div>
      <h2>Ders İçerikleri</h2>
      <table>
        <thead>
          <tr>
            <th>Ders ID</th>
            <th>İçerik</th>
          </tr>
        </thead>
        <tbody>
          {icerikler.map((icerik, index) => (
            <tr key={index}>
              <td>{icerik.dersId}</td>
              <td>{icerik.icerik}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DersIcerikleriGoruntule;