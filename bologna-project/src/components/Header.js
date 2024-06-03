import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Anasayfa</Link></li>
          <li><Link to="/ders-atama">Ders Atama</Link></li>
          <li><Link to="/ders-icerigi">Ders İçeriği</Link></li>
          <li><Link to="/kaynak-kitaplar">Kaynak Kitaplar</Link></li>
          <li><Link to="/ogrenim-ciktilari">Öğrenim Çıktıları</Link></li>
          <li><Link to="/login">Giriş Yap</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;