import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import DersAtama from './components/DersAtama';
import DersIcerigi from './components/DersIcerigi';
import KaynakKitap from './components/KaynakKitap';
import OgrenimCiktilari from './components/OgrenimCiktilari';
import Header from './components/Header';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ders-atama" element={<DersAtama />} />
        <Route path="/ders-icerigi" element={<DersIcerigi />} />
        <Route path="/kaynak-kitaplar" element={<KaynakKitap />} />
        <Route path="/ogrenim-ciktilari" element={<OgrenimCiktilari />} />
      </Routes>
    </Router>
  );
};

export default App;