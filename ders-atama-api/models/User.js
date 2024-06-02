const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    tc: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['idareci', 'hoca'], required: true }
});

module.exports = mongoose.model('User', userSchema);
