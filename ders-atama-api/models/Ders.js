const mongoose = require('mongoose');

const dersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    hocaId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Ders', dersSchema);
