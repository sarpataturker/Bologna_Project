const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-writer').createObjectCsvWriter;

const usersFilePath = path.join(__dirname, 'data', 'users.csv');

const users = [
  { tc: '1234567890', password: '12345678', role: 'idareci' },
  { tc: '2345678901', password: '12345678', role: 'hoca' }
];

const hashPassword = async (user) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  return { ...user, password: hashedPassword };
};

const hashPasswords = async () => {
  const hashedUsers = await Promise.all(users.map(hashPassword));
  const csvWriterInstance = csvWriter({
    path: usersFilePath,
    header: [
      { id: 'tc', title: 'tc' },
      { id: 'password', title: 'password' },
      { id: 'role', title: 'role' }
    ]
  });
  await csvWriterInstance.writeRecords(hashedUsers);
  console.log('Users CSV file has been written with hashed passwords.');
};

hashPasswords();
