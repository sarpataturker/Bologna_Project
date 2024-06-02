import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/assigned');
      setAssignments(response.data);
    } catch (error) {
      console.error('Atamalar yüklenemedi:', error);
    }
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