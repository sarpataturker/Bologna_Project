const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/ders-atama', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

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
        console.log('CSV file successfully processed');
        resolve(users);
      })
      .on('error', (err) => {
        console.error('Error processing CSV file:', err);
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
        console.log('Dersler CSV file successfully processed');
        console.log('Loaded Dersler:', dersler); // Yüklenen dersleri göster
        resolve(dersler);
      })
      .on('error', (err) => {
        console.error('Error processing Dersler CSV file:', err);
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
        console.log('Hocalar CSV file successfully processed');
        console.log('Loaded hocalar:', hocalar); // Yüklenen hocaları göster
        resolve(hocalar);
      })
      .on('error', (err) => {
        console.error('Error processing Hocalar CSV file:', err);
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
        // Convert ders and hoca IDs to their respective names
        Promise.all(assignedData.map(assignment => {
          const dersId = Object.keys(assignment)[0];
          const hocaId = Object.values(assignment)[0];
          const dersName = global.loadedDersler.find(ders => ders.ders_id === dersId)?.name;
          const hocaName = global.loadedHocalar.find(hoca => hoca.hoca_id === hocaId)?.name;
          return { dersName, hocaName };
        })).then(data => {
          resolve(data);
        }).catch(err => {
          console.error('Error converting IDs to names:', err);
          reject('ID\'ler isimlere dönüştürülürken bir hata oluştu.');
        });
      })
      .on('error', (err) => {
        console.error('Error processing assignment.csv:', err);
        reject('assignment.csv dosyası işlenirken bir hata oluştu.');
      });
  });
};

// Load users and start the server when the users are loaded
Promise.all([loadUsers(), loadDersler(), loadHocalar()])
  .then(([loadedUsers, loadedDersler, loadedHocalar]) => {
    // Assign loaded users, dersler, and hocalar to global variables if needed
    global.loadedUsers = loadedUsers;
    global.loadedDersler = loadedDersler;
    global.loadedHocalar = loadedHocalar;

    // Authentication and other routes
    app.post('/login', async (req, res) => {
      const { tc, password } = req.body;
      const user = global.loadedUsers.find(user => user.tc === tc);
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
      res.json(global.loadedDersler);
    });

    // Endpoint to get hocalar
    app.get('/api/hocalar', (req, res) => {
      res.json(global.loadedHocalar);
    });

   // Endpoint to assign ders to hoca
app.post('/api/ata', (req, res) => {
  const { dersId, hocaId } = req.body;
  const assignmentFilePath = path.join(__dirname, 'data', 'assignment.csv');

  // Load existing assignments
  const existingAssignments = [];
  fs.createReadStream(assignmentFilePath)
    .pipe(csv())
    .on('data', (row) => {
      existingAssignments.push(row);
    })
    .on('end', () => {
      // Check if the hoca is already assigned to the maximum number of ders
      const assignmentsForHoca = existingAssignments.filter(assignment => assignment.hocaId === hocaId);
      if (assignmentsForHoca.length >= 6) {
        return res.status(400).json({ message: 'Bu öğretim elemanına maksimum ders ataması yapılmış.' });
      }

      // Check if the ders already has an assigned hoca
      const existingAssignment = existingAssignments.find(assignment => assignment.dersId === dersId);
      if (existingAssignment) {
        return res.status(400).json({ message: 'Bu ders zaten bir öğretim elemanına atanmış.' });
      }

      // If all checks pass, proceed with the assignment
      const assignmentData = `${dersId},${hocaId}\n`; // Convert ders and hoca information to CSV format
      fs.appendFile(assignmentFilePath, assignmentData, (err) => {
        if (err) {
          console.error('Error writing to assignment.csv:', err);
          return res.status(500).json({ message: 'assignment.csv dosyasına yazılırken bir hata oluştu.' });
        }
        console.log('New assignment written to assignment.csv:', assignmentData);
        res.status(200).json({ message: 'Yeni atama yapıldı.' });
      });
    })
    .on('error', (err) => {
      console.error('Error processing assignment.csv:', err);
      res.status(500).json({ message: 'assignment.csv dosyası işlenirken bir hata oluştu.' });
    });
});


    // Endpoint to get assigned dersler and hocas
    app.get('/api/assigned', (req, res) => {
      getAssignedData()
        .then(data => {
          res.json(data);
        })
        .catch(error => {
          console.error('Error getting assigned data:', error);
          res.status(500).json({ message: 'Atanmış veriler alınırken bir hata oluştu.' });
        });
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server http://localhost:${port} adresinde çalışıyor`);
    });
  })
  .catch((err) => {
    console.error('Kullanıcılar, dersler veya hocalar yüklenemedi:', err);
    process.exit(1); // Hata koduyla süreci sonlandır
  });
