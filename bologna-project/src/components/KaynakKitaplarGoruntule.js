import React, { useState, useEffect } from 'react';
import axios from 'axios';

const KaynakKitaplarGoruntule = () => {
  const [kitaplar, setKitaplar] = useState([]);

  useEffect(() => {
    fetchKitaplar();
  }, []);

  const fetchKitaplar = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/kitap');
      setKitaplar(response.data);
    } catch (error) {
      console.error('Kitaplar yüklenemedi:', error);
    }
  };

  return (
    <div>
      <h2>Kaynak Kitaplar</h2>
      <table>
        <thead>
          <tr>
            <th>Ders Adı</th>
            <th>Kitap</th>
          </tr>
        </thead>
        <tbody>
          {kitaplar.map((kitap, index) => (
            <tr key={index}>
              <td>{kitap.dersId}</td>
              <td>{kitap.kitap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KaynakKitaplarGoruntule;