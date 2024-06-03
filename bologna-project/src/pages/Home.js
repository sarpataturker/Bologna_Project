import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [assignments, setAssignments] = useState([]);
  const [contents, setContents] = useState([]);
  const [books, setBooks] = useState([]);
  const [outcomes, setOutcomes] = useState([]);

  useEffect(() => {
    fetchAssignments();
    fetchContents();
    fetchBooks();
    fetchOutcomes();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/assigned');
      setAssignments(response.data);
    } catch (error) {
      console.error('Atamalar yüklenemedi:', error);
    }
  };

  const fetchContents = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/icerik');
      setContents(response.data);
    } catch (error) {
      console.error('İçerikler yüklenemedi:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/kitap');
      setBooks(response.data);
    } catch (error) {
      console.error('Kaynak kitaplar yüklenemedi:', error);
    }
  };

  const fetchOutcomes = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/cikti');
      setOutcomes(response.data);
    } catch (error) {
      console.error('Öğrenim çıktıları yüklenemedi:', error);
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
      
      <h3>Ders İçerikleri</h3>
      <table>
        <thead>
          <tr>
            <th>Ders ID</th>
            <th>İçerik</th>
          </tr>
        </thead>
        <tbody>
          {contents.map((content, index) => (
            <tr key={index}>
              <td>{content.dersId}</td>
              <td>{content.icerik}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Kaynak Kitaplar</h3>
      <table>
        <thead>
          <tr>
            <th>Ders ID</th>
            <th>Kitap</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={index}>
              <td>{book.dersId}</td>
              <td>{book.kitap}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Öğrenim Çıktıları</h3>
      <table>
        <thead>
          <tr>
            <th>Ders ID</th>
            <th>Çıktı</th>
          </tr>
        </thead>
        <tbody>
          {outcomes.map((outcome, index) => (
            <tr key={index}>
              <td>{outcome.dersId}</td>
              <td>{outcome.cikti}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;