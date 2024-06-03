const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

const loadUsers = () => {
  return new Promise((resolve, reject) => {
    const users = [];
    const usersFilePath = path.join(__dirname, 'data', 'users.csv');
    fs.createReadStream(usersFilePath)
      .pipe(csv())
      .on('data', (row) => {
        users.push(row);
      })
      .on('end', () => {
        resolve(users);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

const loadDersler = () => {
  return new Promise((resolve, reject) => {
    const dersler = [];
    const derslerFilePath = path.join(__dirname, 'data', 'dersler.csv');
    fs.createReadStream(derslerFilePath)
      .pipe(csv())
      .on('data', (row) => {
        dersler.push(row);
      })
      .on('end', () => {
        resolve(dersler);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

const loadHocalar = () => {
  return new Promise((resolve, reject) => {
    const hocalar = [];
    const hocalarFilePath = path.join(__dirname, 'data', 'hocalar.csv');
    fs.createReadStream(hocalarFilePath)
      .pipe(csv())
      .on('data', (row) => {
        hocalar.push(row);
      })
      .on('end', () => {
        resolve(hocalar);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

const getAssignedData = () => {
  return new Promise((resolve, reject) => {
    const assignmentFilePath = path.join(__dirname, 'data', 'assignment.csv');
    const assignedData = [];

    fs.createReadStream(assignmentFilePath)
      .pipe(csv({ headers: ['dersId', 'hocaId'], skipLines: 1 }))
      .on('data', (row) => {
        assignedData.push(row);
      })
      .on('end', () => {
        resolve(assignedData);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

let globalUsers = [];
let globalDersler = [];
let globalHocalar = [];

Promise.all([loadUsers(), loadDersler(), loadHocalar()])
  .then(([users, dersler, hocalar]) => {
    globalUsers = users;
    globalDersler = dersler;
    globalHocalar = hocalar;

    app.post('/login', async (req, res) => {
      const { tc, password } = req.body;
      const user = globalUsers.find(user => user.tc === tc);
      if (!user) {
        console.log('User not found');
        return res.status(400).json({ message: 'User not found' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Invalid credentials');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ tc: user.tc, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token, role: user.role });
    });

    app.get('/api/dersler', (req, res) => {
      res.json(globalDersler);
    });

    app.get('/api/hocalar', (req, res) => {
      res.json(globalHocalar);
    });

    app.post('/api/ata', (req, res) => {
      const { dersId, hocaId } = req.body;
      const assignmentFilePath = path.join(__dirname, 'data', 'assignment.csv');
      const assignments = [];

      fs.createReadStream(assignmentFilePath)
        .pipe(csv({ headers: ['dersId', 'hocaId'], skipLines: 1 }))
        .on('data', (row) => {
          assignments.push(row);
        })
        .on('end', () => {
          const assignmentsForHoca = assignments.filter(assignment => assignment.hocaId === hocaId);
          if (assignmentsForHoca.length >= 6) {
            return res.status(400).json({ message: 'Bu öğretim elemanına maksimum ders ataması yapılmış.' });
          }

          const existingAssignment = assignments.find(assignment => assignment.dersId === dersId);
          if (existingAssignment) {
            return res.status(400).json({ message: 'Bu ders zaten bir öğretim elemanına atanmış.' });
          }

          const assignmentData = `${dersId},${hocaId}\n`;
          fs.appendFile(assignmentFilePath, assignmentData, (err) => {
            if (err) {
              return res.status(500).json({ message: 'assignment.csv dosyasına yazılırken bir hata oluştu.' });
            }
            res.status(200).json({ message: 'Data written to assignment.csv' });
          });
        })
        .on('error', (err) => {
          res.status(500).json({ message: 'assignment.csv dosyası işlenirken bir hata oluştu.' });
        });
    });

    app.get('/api/assigned', (req, res) => {
      getAssignedData()
        .then(assignments => {
          const data = assignments.map(assignment => {
            const dersId = assignment.dersId;
            const hocaId = assignment.hocaId;
            const ders = globalDersler.find(ders => ders.ders_id.toString() === dersId);
            const hoca = globalHocalar.find(hoca => hoca.hoca_id.toString() === hocaId);
            return { dersName: ders ? ders.name : 'Bilinmiyor', hocaName: hoca ? hoca.name : 'Bilinmiyor' };
          });
          res.json(data);
        })
        .catch(error => {
          res.status(500).json({ message: 'Atanmış veriler alınırken bir hata oluştu.' });
        });
    });

    app.get('/api/icerik', (req, res) => {
      const icerikFilePath = path.join(__dirname, 'data', 'icerik.csv');
      const icerikler = [];
    
      fs.createReadStream(icerikFilePath)
        .pipe(csv({ headers: ['dersId', 'icerik'], skipLines: 1 }))
        .on('data', (row) => {
          icerikler.push(row);
        })
        .on('end', () => {
          res.json(icerikler);
        })
        .on('error', (err) => {
          res.status(500).json({ message: 'İçerikler alınırken bir hata oluştu.' });
        });
    });

    // Ders içeriği kaydetme
    app.post('/api/ders-icerigi-kaydet', (req, res) => {
      const { dersId, icerik } = req.body;
      const filePath = path.join(__dirname, 'data', 'icerik.csv');
      fs.appendFile(filePath, `${dersId},${icerik}\n`, (err) => {
        if (err) {
          res.status(500).json({ message: 'İçerik kaydedilirken bir hata oluştu.' });
        } else {
          res.status(200).json({ message: 'İçerik başarıyla kaydedildi.' });
        }
      });
    });

    // Kaynak kitap kaydetme
    app.post('/api/kaynak-kitap-kaydet', (req, res) => {
      const { dersId, kitap } = req.body;
      const filePath = path.join(__dirname, 'data', 'kitap.csv');
      fs.appendFile(filePath, `${dersId},${kitap}\n`, (err) => {
        if (err) {
          res.status(500).json({ message: 'Kitap kaydedilirken bir hata oluştu.' });
        } else {
          res.status(200).json({ message: 'Kitap başarıyla kaydedildi.' });
        }
      });
    });

    // Öğrenim çıktısı kaydetme
    app.post('/api/ogrenim-cikti-kaydet', (req, res) => {
      const { dersId, cikti } = req.body;
      const filePath = path.join(__dirname, 'data', 'cikti.csv');
      fs.appendFile(filePath, `${dersId},${cikti}\n`, (err) => {
        if (err) {
          res.status(500).json({ message: 'Öğrenim çıktısı kaydedilirken bir hata oluştu.' });
        } else {
          res.status(200).json({ message: 'Öğrenim çıktısı başarıyla kaydedildi.' });
        }
      });
    });

    // Kaynak kitapları görüntüleme
    app.get('/api/kaynak-kitaplar', (req, res) => {
      const kitapFilePath = path.join(__dirname, 'data', 'kitap.csv');
      const kitaplar = [];

      fs.createReadStream(kitapFilePath)
        .pipe(csv({ headers: ['dersId', 'kitap'], skipLines: 1 }))
        .on('data', (row) => {
          kitaplar.push(row);
        })
        .on('end', () => {
          res.json(kitaplar);
        })
        .on('error', (err) => {
          res.status(500).json({ message: 'Kitaplar alınırken bir hata oluştu.' });
        });
    });

    // Öğrenim çıktıları görüntüleme
    app.get('/api/ogrenim-ciktilari', (req, res) => {
      const ciktiFilePath = path.join(__dirname, 'data', 'cikti.csv');
      const ciktilar = [];

      fs.createReadStream(ciktiFilePath)
        .pipe(csv({ headers: ['dersId', 'cikti'], skipLines: 1 }))
        .on('data', (row) => {
          ciktilar.push(row);
        })
        .on('end', () => {
          res.json(ciktilar);
        })
        .on('error', (err) => {
          res.status(500).json({ message: 'Öğrenim çıktıları alınırken bir hata oluştu.' });
        });
    });

    // Server'ı başlat
    app.listen(port, () => {
      console.log(`Server http://localhost:${port} adresinde çalışıyor`);
    });
  })
  .catch(err => {
    console.error('Kullanıcılar, dersler veya hocalar yüklenemedi:', err);
    process.exit(1);
  });