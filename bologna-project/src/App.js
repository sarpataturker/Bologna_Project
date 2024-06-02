import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import DersAtama from './components/DersAtama';
import DersIcerigi from './components/DersIcerigi';
import Header from './components/Header';
import DersIcerikleriGoruntule from './components/DersIcerikleriGoruntule';
import KaynakKitaplarGoruntule from './components/KaynakKitaplarGoruntule';
import OgrenimCiktilariGoruntule from './components/OgrenimCiktilariGoruntule';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ders-atama" element={<DersAtama />} />
        <Route path="/ders-icerigi" element={<DersIcerigi />} />
        <Route path="/ders-icerikleri" element={<DersIcerikleriGoruntule />} />
        <Route path="/kaynak-kitaplar" element={<KaynakKitaplarGoruntule />} />
        <Route path="/ogrenim-ciktilari" element={<OgrenimCiktilariGoruntule />} />
      </Routes>
    </Router>
  );
};

export default App;