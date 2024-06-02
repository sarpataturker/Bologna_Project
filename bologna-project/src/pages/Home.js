import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [assignments, setAssignments] = useState([]);
  const [dersler, setDersler] = useState([]);
  const [hocalar, setHocalar] = useState([]);

  useEffect(() => {
    fetchAssignments();
    fetchDersler();
    fetchHocalar();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/assigned');
      setAssignments(response.data);
    } catch (error) {
      console.error('Atamalar yüklenemedi:', error);
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

  const fetchHocalar = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/hocalar');
      setHocalar(response.data);
    } catch (error) {
      console.error('Hocalar yüklenemedi:', error);
    }
  };

  const getDersName = (dersId) => {
    const ders = dersler.find(ders => ders.ders_id.toString() === dersId);
    return ders ? ders.name : 'Bilinmiyor';
  };

  const getHocaName = (hocaId) => {
    const hoca = hocalar.find(hoca => hoca.hoca_id.toString() === hocaId);
    return hoca ? hoca.name : 'Bilinmiyor';
  };

  return (
    <div>
      <h2>Anasayfa</h2>
      <h3>Atanan Dersler ve Hocalar</h3>
      <table>
        <thead>
          <tr>
            <th>Ders</th>
            <th>Hoca</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment, index) => (
            <tr key={index}>
              <td>{assignment.dersName}</td>
              <td>{assignment.hocaName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
