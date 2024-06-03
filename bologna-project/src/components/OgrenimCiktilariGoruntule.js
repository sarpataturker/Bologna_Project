import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OgrenimCiktilariGoruntule = () => {
  const [ciktilar, setCiktilar] = useState([]);

  useEffect(() => {
    fetchCiktilar();
  }, []);

  const fetchCiktilar = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/cikti');
      setCiktilar(response.data);
    } catch (error) {
      console.error('Çıktılar yüklenemedi:', error);
    }
  };

  return (
    <div>
      <h2>Öğrenim Çıktıları</h2>
      <table>
        <thead>
          <tr>
            <th>Ders Adı</th>
            <th>Çıktı</th>
          </tr>
        </thead>
        <tbody>
          {ciktilar.map((cikti, index) => (
            <tr key={index}>
              <td>{cikti.dersId}</td>
              <td>{cikti.cikti}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OgrenimCiktilariGoruntule;