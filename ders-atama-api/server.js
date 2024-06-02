const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

// Kullanıcıları CSV dosyasından yükleme
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
        console.log('Users CSV file successfully processed');
        resolve(users);
      })
      .on('error', (err) => {
        console.error('Error processing Users CSV file:', err);
        reject(err);
      });
  });
};

// Dersleri CSV dosyasından yükleme
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

// Hocaları CSV dosyasından yükleme
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

// Atanmış derslerin ve hocaların listesini al
const getAssignedData = () => {
  return new Promise((resolve, reject) => {
    const assignmentFilePath = path.join(__dirname, 'data', 'assignment.csv');
    const assignedData = [];

    fs.createReadStream(assignmentFilePath)
      .pipe(csv())
      .on('data', (row) => {
        assignedData.push(row);
      })
      .on('end', () => {
        console.log('Assigned data retrieved from assignment.csv');
        resolve(assignedData);
      })
      .on('error', (err) => {
        console.error('Error processing assignment.csv:', err);
        reject(err);
      });
  });
};

// Load dersler and hocalar once and store them globally
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
        return res.status(400).json({ message: 'User not found' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ tc: user.tc, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
    });

    // Endpoint to get dersler
    app.get('/api/dersler', (req, res) => {
      res.json(globalDersler);
    });

    // Endpoint to get hocalar
    app.get('/api/hocalar', (req, res) => {
      res.json(globalHocalar);
    });

    // Endpoint to assign ders to hoca
    app.post('/api/ata', (req, res) => {
      const { dersId, hocaId } = req.body;
      const assignmentFilePath = path.join(__dirname, 'data', 'assignment.csv');
      const assignments = [];

      fs.createReadStream(assignmentFilePath)
        .pipe(csv())
        .on('data', (row) => {
          assignments.push(row);
        })
        .on('end', () => {
          const assignmentsForHoca = assignments.filter(assignment => Object.values(assignment)[0] === hocaId);
          if (assignmentsForHoca.length >= 6) {
            return res.status(400).json({ message: 'Bu öğretim elemanına maksimum ders ataması yapılmış.' });
          }

          const existingAssignment = assignments.find(assignment => Object.keys(assignment)[0] === dersId);
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
            const dersId = Object.keys(assignment)[0];
            const hocaId = Object.values(assignment)[0];
            const ders = globalDersler.find(ders => ders.ders_id === dersId);
            const hoca = globalHocalar.find(hoca => hoca.hoca_id === hocaId);
            return { dersName: ders ? ders.name : undefined, hocaName: hoca ? hoca.name : undefined };
          });
          res.json(data);
        })
        .catch(error => {
          res.status(500).json({ message: 'Atanmış veriler alınırken bir hata oluştu.' });
        });
    });

    app.listen(port, () => {
      console.log(`Server http://localhost:${port} adresinde çalışıyor`);
    });
  })
  .catch(err => {
    console.error('Kullanıcılar, dersler veya hocalar yüklenemedi:', err);
    process.exit(1);
  });